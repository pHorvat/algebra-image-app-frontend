import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

function Search({ data, hideSearch }) {
  return (
    <SearchContainer>
      <div className="searchWrapper">
        <div className="users">
          {data?.map((u) => (
            <Link
              style={{ textDecoration: "none" }}
              to={`/profile/${u.authorUsername}`}
              onClick={hideSearch}
            >
              <div key={u.id} className="user">
                <div className="userRight">
                  <img
                    src={
                      u.url
                        ? u.url
                        : "person/noAvatar.png"
                    }
                    alt=""
                    className="searchImg"
                  />
                </div>


                  <div className="userLeft">
                      <div className="userContainer">
                          <span className="username">{u.authorUsername}</span>
                          <br/>
                          <span className="description">{u.description}</span>
                          <br/>
                          <span className="hashtags">
                            {u.hashtags.split(" ").map((word, index) => (
                            <span key={index}>#{word} </span>
                            ))}
                         </span>
                      </div>
                  </div>



              </div>
            </Link>
          ))}
        </div>
      </div>
    </SearchContainer>
  );
}

const SearchContainer = styled.div`
  position: fixed;
  width: 100vw;
  top: 51px;
  display: flex;
  justify-content: center;

  @media (max-width: 655px) {
    left: -4px;
  }

  .searchWrapper {
    z-index: 3033;
    width: 600px;
    background-color: rgb(243, 243, 243);
    position: relative;
    border-radius: 0px 0px 13px 13px;
    -webkit-border-radius: 0px 0px 13px 13px;
    -moz-border-radius: 0px 0px 13px 13px;
    border: 3px solid #ebebeb;
    box-shadow: 0px 24px 41px -7px rgba(28, 28, 28, 0.41);
    -webkit-box-shadow: 0px 24px 41px -7px rgba(28, 28, 28, 0.41);
    -moz-box-shadow: 0px 24px 41px -7px rgba(28, 28, 28, 0.41);
  }

  .users {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .user {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }

  .userRight {
    width: 20%;
  }

  .userLeft {
    width: 100%;
    display: block;

    > span {
      color: black;
    }
  }

  .searchImg {
    display: block;
    padding: 5px;
    width: 100px;
    height: 100px;
    border-radius: 10%;
  }

  .userContainer {
    background-color: #f8f8f8;
    border-radius: 5px;
    padding: 10px;
  }

  .username {
    font-weight: bold;
    color: #0095f6; /* Adjust the color as desired */
  }

  .description {
    color: #333333; /* Adjust the color as desired */
    margin-top: 5px;
  }

  .hashtags {
    color: #666666; /* Adjust the color as desired */
    margin-top: 5px;
  }



`;
export default Search;
