import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import { FiSettings } from "react-icons/fi";
import Topbar from "../Topbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import Modal from "../UI/Modal";
import EditProfile from "../EditProfile";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import Intercept from "../../Tools/refrech";
import ShowPost from "../ShowPost";
import {NotificationManager} from "react-notifications";
import {format} from "timeago.js";

function Profile(props) {
  const username = useParams().username;
  const { user: currentUser, dispatch } = useContext(AuthContext);
  //const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [showPost, setShowPost] = useState(false);
  const [isWithin24Hours, setIsWithin24Hours] = useState(false);
  const [currentPost, setCurrentPost] = useState([]);
  const [maxConsumption, setMaxConsumption] = useState(0);

  const [showEditProfile, setshowEditProfile] = useState(false);
  const [userProfile, setCurrentUserProfile] = useState([]);
  const axiosJWT = axios.create();
  Intercept(axiosJWT);
  const hideEditProfileHandler = () => {
    setshowEditProfile(false);
  };
  const showEditProfileHandler = (e) => {
    e.preventDefault();
    setshowEditProfile(true);
  };

  const deleteHandler = async (id) => {
    try {
      await axiosJWT.delete(`http://localhost:5000/api/photo/${id}`, {
        headers: { Authorization: "Bearer " + currentUser.accessToken },
      });
      NotificationManager.success("Success", "Post has been deleted", 3000);
      window.location.reload()
      props.onChange(1);
    } catch (error) {
      NotificationManager.warning("Warning", "error", 3000);
    }
  };


  useEffect(() => {
    let tempUserId=[];
    const fetchUser = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/User/u/" + username
      );
      setCurrentUserProfile(res.data);
      tempUserId=res.data;

      fetchPosts();

    };
    const fetchPosts = async () => {
      const pst = await axios.get(
          "http://localhost:5000/api/Photo/user/" + tempUserId.id
      );
      console.log(pst)
      setPosts(
          pst.data.sort((p1, p2) => {
            return new Date(p2.upload) - new Date(p1.upload);
          })
      );
    };
    fetchUser();
  }, [username]);

  useEffect(() => {
    console.log(userProfile)
    if(userProfile.tier==="FREE")
    {
      setMaxConsumption(10);
    }else if(userProfile.tier==="PRO"){
      setMaxConsumption(50);
    }else if(userProfile.tier==="GOLD"){
      setMaxConsumption(100);
    }

    const currentTime = new Date();
    const providedTime = new Date(userProfile.lastPackageChange);

    const timeDiff = currentTime - providedTime;
    const timeValue = timeDiff < 24 * 60 * 60 * 1000
    setIsWithin24Hours (timeValue);


  },[userProfile]);





  return (
    <>
      {showEditProfile && (
        <Modal onClose={hideEditProfileHandler}>
          <EditProfile user={userProfile} onClose={hideEditProfileHandler} />
        </Modal>
      )}
      {showPost && ((currentPost.authorId === currentUser.userId) || (currentUser.userType==="Admin")) &&(

          <Modal
              onClose={() => {
                setShowPost(false);
              }}
          >

            <ShowPost post={currentPost}></ShowPost>
          </Modal>
      )}


      <Topbar
        rerenderFeed={props.rerenderFeed}
        onChange={props.onChange}
      ></Topbar>
      <ProfileContainer>
        <div className="profileWrapper">
          <div className="profilePicture">
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt=""
              className="ProfilePictureImg"
            />
          </div>
          <div className="profileData">
            <div className="profileSettings">
              <span className="profileSettingsUsername">{username}</span>
              {currentUser.data.username === username ? (
                <>
                  <a
                    className="profileSettingsButton"
                    onClick={showEditProfileHandler}
                    href="/"
                  >
                    Edit plan

                  </a>
                  <FiSettings className="profileSettingsIcon"  onClick={showEditProfileHandler}/>


                </>
              ) :
              null
              }
            </div>
            <div className="profileInfo">
              <span className="profileInfoPost">
                <span className="profileInfoNum"></span>

                {isWithin24Hours ? (
                    <p>Last package change: less than 24 hours ago</p>
                ) : (
                    <p>Last package change: {format(userProfile.lastPackageChange)}</p>
                )}


              </span>
              <span className="profileInfoFollowers">
                <span className="profileInfoNum"></span>
                Tier: {userProfile.tier}
              </span>
              <span className="profileInfoFollowings">
                <span className="profileInfoNum"></span>
                Current consumption: {userProfile.consumption} / {maxConsumption}
              </span>
            </div>
            <div className="profileBio">
              {/* <span className="profileBioUsername">{userProfile.username}</span>
             <span className="profileBioBio">{userProfile.description}</span> */}
            </div>
          </div>
        </div>
      </ProfileContainer>
      <ProfilePosts>
        <div className="postsWrapper">
          {posts.map((p) => (
            <div key={p.id} className="profilePostWrapper">
              <div className="profilePost">
                <img
                  src={
                    p.url
                      ? p.url
                      : "http://localhost:3000/images/defaultpost.jpg"
                  }
                  alt=""
                  className="profilePostImg"
                  onClick={()=> {
                    setCurrentPost(p);
                    setShowPost(true);
                    console.log(p)
                  }


                }
                />
                <div className="overlay-container">
                  <h1 className="overlay-title">{p.description}</h1>
                  <p className="overlay-text">{addCharacterBeforeWords(p.hashtags, '#')}</p>
                </div>

                {((p.authorId === currentUser.userId) || (currentUser.userType==="Admin")) &&(

                    <div className="delete-container">
                      <button
                          className="deleteButton"
                          onClick={()=>{
                            deleteHandler(p.id)
                          }}
                      >Delete</button>
                    </div>

                )}
              </div>
            </div>
          ))}
        </div>
      </ProfilePosts>
    </>
  );
}

const addCharacterBeforeWords = (sentence, character) =>
    sentence.split(' ').map((word) => character + word).join(' ');

const ProfileContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 10px;
  .profileWrapper {
    display: flex;
    width: 999px;
    @media (max-width: 655px) {
      flex-direction: column;
    }
  }
  .profilePicture {
    display: flex;
    justify-content: center;
    flex-grow: 1;
  }
  .ProfilePictureImg {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    object-fit: cover;
    @media (max-width: 655px) {
      width: 30vw;
      height: 30vw;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  .profileData {
    flex-grow: 2;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @media (max-width: 655px) {
      flex-basis: auto;
      padding: 10px;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
    }
  }
  .profileSettings {
    display: flex;
    height: 30px;
    width: 100%;
    align-items: flex-end;
    @media (max-width: 655px) {
      padding-bottom: 5px;
    }
  }
  .profileSettingsUsername {
    width: 280px;
    font-size: 30px;
    font-weight: 300;
    @media (max-width: 655px) {
      font-size: 25px;
      width: 200px;
    }
  }
  .profileSettingsButton {
    display: block;
    font-size: 14px;
    border: 1px solid black;
    border-radius: 4px;
    text-decoration: none;
    padding: 5px 9px;
    box-sizing: border-box;
    color: black;
    cursor: pointer;
  }
  .profileSettingsButton:visited {
    text-decoration: none;
  }
  .profileSettingsIcon {
    padding-left: 10px;
    cursor: pointer;
    font-size: 28px;
  }
  .profileInfo {
    display: flex;
  }
  .profileInfoPost {
    padding-right: 30px;
  }
  .profileInfoFollowers {
    padding-right: 30px;
  }
  .profileInfoFollowings {
  }
  .profileInfoNum {
    font-weight: bold;
  }
  .profileBio {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .profileBioUsername {
    font-size: 18px;
    font-weight: bold;
  }
  .profileBioBio {
    font-size: 15px;
    font-weight: 300;
    max-width: 400px;
    text-align: justify;
  }
  .rightbarFollowButton {
    margin-top: 30px;
    /* margin-bottom: 10px; */
    border: none;
    background-color: #1872f2;
    color: white;
    border-radius: 5px;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  }

  .rightbarFollowButton:focus {
    outline: none;
  }
`;

const ProfilePosts = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 10px;
  .postsWrapper {
    display: flex;
    width: 999px;
    flex-wrap: wrap;
  }
  .profilePostWrapper {
    aspect-ratio: 1 / 1;
    flex-grow: 1;
    width: 33.33%;
    max-width: 33.33%;
    display: flex;
  }
  .profilePost {
    width: 100%;
    height: 100%;
    padding: 1%;
    justify-content: center;


    position: relative;
    display: inline-block;
  }
  .profilePostImg {
    width: 100%;
    height: 100%;
    object-fit: fill;
    display: block;
  }

  .overlay-container {
    position: absolute;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%); /* Set the desired gradient colors and stops */
    color: #fff; /* Set the desired text color */
    padding-bottom: 20px;
    text-align: center;
    width: 98%;
    margin: 1%;
  }
  .delete-container {
    position: absolute;
    top: 0;
    right: 0;
    padding-bottom: 20px;
    text-align: center;
    margin: 7px;
  }

  .overlay-title,
  .overlay-text {
    margin: 0;
  }

  .overlay-title {
    font-size: 25px;
    font-weight: bold;
    letter-spacing: 2px;
    margin-bottom: 10px;
  }

  .overlay-text {
    font-size: 16px;
    line-height: 1.4;
  }
  .deleteButton{
    width: 100%;
    height: 25px;
    border-radius: 5px;
    border: none;
    font-size: 15px;
    cursor: pointer;
    padding: 5px;
  }
  
`;
export default Profile;
