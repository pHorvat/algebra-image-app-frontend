import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import Intercept from "../Tools/refrech";
import { FiMoreVertical } from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext/AuthContext";
import {AiFillHeart, AiOutlineDownload} from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "./UI/Modal";
import ShowPost from "./ShowPost";
import { NotificationManager } from "react-notifications";
import { format } from "timeago.js";
import Backdrop from "./UI/Backdrop";

function Post(props) {
  const post = props.post;
  const { user } = useContext(AuthContext);
  const [postUsername, setPostUsername] = useState("");
  const [showPost, setShowPost] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editStyle, setEditStyle] = useState({display: 'none'});

  const axiosJWT = axios.create();

  Intercept(axiosJWT);
  const deleteHandler = async () => {
    try {
      await axiosJWT.delete(`http://localhost:5000/api/photo/${post.id}`, {
        headers: { Authorization: "Bearer " + user.accessToken },
      });
      NotificationManager.success("Success", "Post has been deleted", 3000);
      props.onChange(1);
    } catch (error) {
      NotificationManager.warning("Warning", "error", 3000);
    }
  };

  function PostUsername({ id }) {
    const [username, setUsername] = useState('');

    useEffect(() => {
      async function fetchUsername() {
        try {
          const response = await axios.get(`http://localhost:5000/api/User/${id}`);
          const { data } = response;
          setUsername(data.username);
        } catch (error) {
          console.error('Error:', error);
          setUsername('Error fetching username');
        }
      }

      fetchUsername();
    }, [id]);

    return <span className="postUsername">{username}</span>;
  }
  const showMenuHandler = () => {
    setShowMenu(!showMenu);
  };

  async function handleDownload() {
    const imageUrl = post.url;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const anchor = document.createElement('a');
      anchor.download = getFileNameFromURL(imageUrl);
      anchor.href = URL.createObjectURL(blob);
      anchor.click();

      URL.revokeObjectURL(anchor.href);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function getFileNameFromURL(url) {
    var startIndex = url.lastIndexOf("/") + 1; // Find the index of the last occurrence of "/"
    var endIndex = url.indexOf("?"); // Find the index of the first occurrence of "?"
    if (endIndex === -1) {
      endIndex = url.indexOf("#"); // If "?" is not found, find the index of the first occurrence of "#"
    }
    var filename = url.substring(startIndex, endIndex); // Extract the file name from the URL
    filename = decodeURIComponent(filename); // Decode any URL-encoded characters

    return filename;
  }




  return (
    <>
      {showMenu && <Backdrop onClose={showMenuHandler} />}
      {/* eslint-disable-next-line no-mixed-operators */}
      {showPost && ((post.authorId === user.userId) || (user.userType==="Admin")) &&(

        <Modal
          onClose={() => {
            setShowPost(false);
          }}
        >

          <ShowPost post={post}></ShowPost>
        </Modal>
      )}

      <PostContainer>
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${post.authorUsername}`}>
              <img
                src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
                alt=""
                className="postProfileImg"
              />
            </Link>
            <Link
              style={{ textDecoration: "none", color: "#000000" }}
              to={"/profile/" + post.authorUsername}
            >
              { (post.authorId === user.userId) ? (
              <span className="postUsername" style={{color: "#0095f6"}}>{post.authorUsername}</span>):
                  (<span className="postUsername">{post.authorUsername}</span>)
              }

              {/* <PostUsername id={post.authorId} /> */ }
            </Link>
            <span className="postDate">{format(post.upload)}</span>
          </div>


            <div className="postTopright">
              <AiOutlineDownload
                  className="likeIcon"
                  onClick={handleDownload}
                  style={{marginRight:"20px"}}

              />
              { (post.authorId === user.userId) || (user.userType==="Admin") ?
                  (<div>
                    <FiMoreVertical
                        className="likeIcon"
                        style={{fontSize:"20px", paddingTop:"5px"}}
                        onClick={() => {
                          setShowMenu(!showMenu);
                          console.log(post);
                          console.log(user);
                        }}
                    />
                    {showMenu && (
                        <div className="topRightPanel" onClick={deleteHandler}>
                          Delete
                        </div>
                    )}
                  </div>) : null }

            </div>


        </div>
        <hr className="hrh" />
        <div className="postCenter">

          <div className="postImgWrapper">
            <img
              src={post.url ? post.url : "DEFAULT_IMG_URL"}
              alt=""
              className="postImg"
            />
          </div>
        </div>


        <div

            style={{ cursor: (post.authorId === user.userId) || (user.userType==="Admin")? 'pointer': 'null'}}

            onClick={() => {
              setShowPost(true);
            }}

            onMouseEnter={e => {
              if((post.authorId === user.userId) || (user.userType==="Admin")) {
                setEditStyle({display: 'block'});
              }

            }}
            onMouseLeave={e => {
              setEditStyle({display: 'none'})
            }}
        >
        <p className="postText">{post.description}</p>

        <hr className="hrh" />
        <div className="postBottom">
          <div className="postBottomLeft">
            {/*
            <AiFillHeart
              onClick={likeHandler}
              className="likeIcon"
              color={isLiked ? "red" : "#e0e0e0ed"}
            />*/}
            <span
              className="postLikeCounter"
              onClick={() => {
                setShowPost(true);
              }}
            >
              {/*  {likes} Likes {Countcomments} Comments */}
              {addCharacterBeforeWords(post.hashtags, '#')}


            </span>

          </div>

          <p style={editStyle} className="editPostText">Click to edit...</p>
        </div>
        </div>
      </PostContainer>
    </>
  );
}

const addCharacterBeforeWords = (sentence, character) =>
    sentence.split(' ').map((word) => character + word).join(' ');

const PostContainer = styled.div`
  width: 99%;
  border-radius: 10px;
  border: 1px solid rgb(211, 211, 211);
  -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  margin-top: 10px;
  margin-bottom: 50px;

  .postTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
  }

  .postTopright {
    position: relative;
    display: flex;
  }

  .topRightPanel {
    position: absolute;
    background-color: #eaeaea;
    width: 80px;
    height: 30px;
    right: 5px;
    z-index: 60;
    border-radius: 5px;
    border: 1px solid rgb(211, 211, 211);
    -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    padding-top: 10px;
    text-align: center;

    &:hover {
      cursor: pointer;
    }
  }

  .postTopLeft {
    display: flex;
    align-items: center;
  }

  .postProfileImg {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .postUsername {
    font-size: 15px;
    font-weight: 500;
    padding: 0 10px;
  }

  .postDate {
    font-size: 10px;
    font-weight: 500;
    padding-top: 3px;
  }

  .postImgWrapper {
    padding-right: 3px;
    padding-left: 3px;
  }

  .postImg {
    padding-top: 5px;
    width: 100%;
    object-fit: contain;
  }

  .postCenter {
    display: flex;
    flex-direction: column;
  }

  .postText {
    padding-top: 5px;
    padding-bottom: 3px;
    font-weight: 400;
    font-size: 15px;
    padding-left: 4px;
  }
  .editPostText {
    font-weight: 400;
    font-size: 15px;
    margin-right: 10px;
    color: darkgray;
  }

  .postBottom {
    padding-top: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 4px;
  }

  .postBottomLeft {
    display: flex;
    align-items: center;

  
  }

  .likeIcon {
    font-size: 30px;
    padding-right: 5px;
    cursor: pointer;
  }

  .postLikeCounter {
    font-size: 15px;
    color: #444444;
  }

  .hrh {
    opacity: 0.4;
  }
`;
export default Post;
