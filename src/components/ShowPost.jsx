import axios from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { NotificationManager } from "react-notifications";
import { AuthContext } from "../contexts/AuthContext/AuthContext";
import Intercept from "../Tools/refrech";

function ShowPost(props) {
  const { user } = useContext(AuthContext);
  const [newDescription, setNewDescription] = useState(null);
  const [newHashtags, setNewHashtags] = useState(null);
  const axiosJWT = axios.create();
  Intercept(axiosJWT);
  /*
const submitHandler = async (e) => {
  e.preventDefault();
  try {
    const submitData = {};
    submitData.articleId = props.post._id;
    submitData.description = yourComment;
    await axiosJWT.post("http://localhost:8000/api/comment/", submitData, {
      headers: { Authorization: "Bearer " + user.accessToken },
    });
    const newComment = {};
    newComment.username = user.data.username;
    newComment.userPicture = user.data.profilePicture;
    newComment.description = submitData.description;
    newComment._id = Math.random();
    setComments((comments) => [newComment, ...comments]);
    props.newComment();
    NotificationManager.success("Success", "Comment has been created", 3000);
  } catch (error) {
    NotificationManager.error("Error", "Warning", 3000);
  }
};

useEffect(() => {
  const fetchComment = async () => {
    const res = await axios.get(
      `http://localhost:8000/api/comment/${props.post._id}`
    );

    res.data.comments.forEach(async (comment) => {
      const res = await axios.get(
        `http://localhost:8000/api/user/${comment.user}`
      );
      comment.username = res.data.user.username;
      comment.userPicture = res.data.user.profilePicture;
      setComments((comments) => [comment, ...comments]);
    });
  };
  fetchComment();
}, [props.post._id]);*/

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const submitData = {};
      submitData.id = props.post.id;
      if(newDescription===null){
        submitData.Description = props.post.description;
      }else {
        submitData.Description = newDescription;
      }

      if(newHashtags===null){
        submitData.Hashtags = props.post.hashtags;
      }else {
        submitData.Hashtags = newHashtags;
      }

      console.log(submitData)
      await axiosJWT.put("http://localhost:5000/api/photo/", submitData, {
        headers: { Authorization: "Bearer " + user.accessToken },
      });
      NotificationManager.success("Success", "Edit successful", 3000);
      setTimeout(()=>{
        window.location.reload(false);
      }, 1000);


    } catch (error) {
      NotificationManager.error("Error", "Edit unsuccessful", 3000);
    }
  };




  return (
    <ShowPostContainer>
        <div className="editTitle">Description</div>
      <div className="addComment">

        <input
          className="addCommentInput"
          defaultValue ={props.post.description}
          type="text"
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button className="addCommentButton" onClick={submitHandler}>
          Save
        </button>
      </div>
      <br/>
      <div className="editTitle">Hashtags</div>
      <div className="addComment">

        <input
            className="addCommentInput"
            defaultValue ={props.post.hashtags}
            type="text"
            onChange={(e) => setNewHashtags(e.target.value)}
        />
        <button className="addCommentButton" onClick={submitHandler}>
          Save
        </button>
      </div>
      { /*
      <div className="showComments">
        {comments.map((comment) => (
          <div key={comment._id} className="oneComment">
            <div className="pictureUserCommentWrapper">
              <img className="pictureUser" src={comment.userPicture} alt="" />
            </div>
            <div className="usernameAndCommentWrapper">
              <span className="usernameComment">{comment.username}</span>
              <span className="Comment">{comment.description}</span>
            </div>
          </div>
        ))}
      </div>*/}
    </ShowPostContainer>
  );
}
const ShowPostContainer = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .addComment {
    width: 100%;
    display: flex;
    justify-content: space-between;
    border: solid 1px #cecdcd;
    @media (max-width: 655px) {
      flex-direction: column;
    }
  }
  .addCommentInput {
    width: 70%;
    border: none;
    padding: 7px;
    border-radius: 5px;
    &:focus {
      outline: none;
    }
    @media (max-width: 655px) {
      width: 90%;
    }
  }
  .addCommentButton {
    border: none;
    padding: 7px;
    border-radius: 5px;
    background-color: #4a4b4b;
    color: white;
    margin: 5px;
  }
  .showComments {
    width: 100%;
    margin-top: 10px;
    height: 30vh;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      width: 3px;
    }
    ::-webkit-scrollbar-track {
      background-color: #f1f1f1;
    }
    ::-webkit-scrollbar-thumb {
      background-color: rgb(192, 192, 192);
    }
  }
  .oneComment {
    display: flex;
    margin-bottom: 5px;
  }
  .usernameAndCommentWrapper {
    display: flex;
    flex-direction: column;
    margin-left: 5px;
    padding: 5px;
    border: solid 1px #cecdcd;
    border-radius: 10px;
    width: 100%;
  }
  .usernameComment {
    font-weight: bold;
  }
  .pictureUser {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  .editTitle{
    margin-right: 50px;
  }
`;
export default ShowPost;
