import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { BsPlusSquare } from "react-icons/bs";
import { AuthContext } from "../contexts/AuthContext/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Modal from "../components/UI/Modal";
import Share from "./Share";
import Search from "./Search";
import axios from "axios";
import Backdrop from "./UI/Backdrop";
import SearchBarMobile from "./SearchBarMobile";
import LoginButtonState from "./Patterns/LoginButtonState";
import Login from "./pages/Login";

function Topbar(props) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [showSearch, setshowSearch] = useState(false);
  const [usersSearch, setusersSearch] = useState([]);
  const [searchquery, setSearchquery] = useState("");
  const [showBarSearchMobile, setShowBarSearchMobile] = useState(false);
  const logoutHandler = async () => {
    await axios.post("http://localhost:5000/api/user/logout", {
    },
        {
          headers: { Authorization: "Bearer " + user.accessToken },
        });
    localStorage.setItem("user", null);
    window.location.reload(false);
  };
  const showBarSearchMobileHandler = () => {
    setShowBarSearchMobile(true);
  };
  const hideAddPostHandler = () => {
    setShowAddPost(false);
    props.onChange(1);
  };
  const hideAddPostWithBackdropHandler = () => {
    setShowAddPost(false);
  };
  const hideBarSearchMobileHandler = () => {
    setShowBarSearchMobile(false);
    setshowSearch(false);
  };
  const searchHandler = (e) => {
    if (searchquery.length < 1) {
      setshowSearch(false);
    } else {
      setshowSearch(true);
    }
    setSearchquery(e.target.value);
  };
  useEffect(() => {
    const getSearch = async () => {
      try {
        if (searchquery.length >= 1) {
          const searchresult = await axios.get(
            `http://localhost:5000/api/photo/search/${searchquery}`,
              /*
            {
              params: { search: searchquery },
            }*/
          );
          setusersSearch(searchresult.data);
        }
      } catch (error) {}
    };
    const timer = setTimeout(() => {
      getSearch();
    }, 700);
    return () => clearTimeout(timer);
  }, [searchquery]);
  return (
    <>
      {showBarSearchMobile && (
        <SearchBarMobile
          searchHandler={searchHandler}
          hidebar={hideBarSearchMobileHandler}
        />
      )}
      {showSearch && <Backdrop onClose={hideBarSearchMobileHandler} />}
      {showAddPost && (
        <Modal onClose={hideAddPostWithBackdropHandler}>
          <Share hideAddPostHandler={hideAddPostHandler}></Share>
        </Modal>
      )}
      <TopbarContainer>
        <div className="TopbarLeft">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="Logo">AlgebraImageApp</span>
          </Link>
        </div>
        <div className="TopbarCenter">
          <div className="Searchbar">
            <AiOutlineSearchStyled />
            <input
              onChange={searchHandler}
              type="text"
              className="SearchInput"
              placeholder="Search"
            />
          </div>
          {showSearch && (
            <>
              <Search
                data={usersSearch}
                hideSearch={() => {
                  setshowSearch(false);
                }}
              />
            </>
          )}
        </div>

        <div>
          {user.userType !=="Anonymous" ? <div>
        <div className="TopbarRight">
          <div className="TopbarIcons">

            <div className="TopbarIconItem">
              <FiSearchStyled
                onClick={showBarSearchMobileHandler}
              ></FiSearchStyled>
            </div>
            <div className="TopbarIconItem">

              <BsPlusSquareStyled
                onClick={() => {
                  setShowAddPost(true);
                }}
              />
            </div>
            <div className="TopbarAdminItem">
              {user.userType==="Admin" &&
                  <Link to="/manage" style={{ textDecoration: "none" }}>
                  <div>MANAGE</div>
                    </Link>}
            </div>
            <img
              className="TopbarImg"
              onClick={() => {
                setShowMenu(!showMenu);
              }}
              alt=""
              src={"https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=1060&t=st=1685604898~exp=1685605498~hmac=fe4c8c4a53f34732ccadf2589da69945a5b26564a1b960c48eed00ca45c95149"}
            />
            {showMenu && (
              <div className="TopbarMenu">
                <span
                  className="menuItems"
                  onClick={() => {
                    //navigate(`/profile/${user.data.username}`);
                    navigate(`/profile/`+user.username);
                  }}
                >
                  Profile
                </span>
                {/*
                <span className="menuItems" onClick={logoutHandler}>
                  Logout
                </span>
                  */}

              </div>
            )}
          </div>
        </div>

          </div>

              :null
             /* <button
                  className="loginButton"
                  onClick={logoutHandler}>Login</button>*/

          }

        </div>
        <LoginButtonState user={user.username}/>
      </TopbarContainer>
    </>
  );
}

const FiSearchStyled = styled(FiSearch)`
  font-size: 20px;
  margin-right: 10px;
  display: none;
  @media (max-width: 655px) {
    display: block;
  }
`;
const BsPlusSquareStyled = styled(BsPlusSquare)`
  font-size: 20px;
  margin-right: 10px;
`;
const AiOutlineSearchStyled = styled(AiOutlineSearch)`
  font-size: 20px !important;
  margin-left: 10px;
`;
const TopbarContainer = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: rgb(255, 255, 255);
  justify-content: center;
  border-bottom: 1px solid gray;
  box-shadow: -2px 10px 9px -7px rgba(0, 0, 0, 0.34);
  -webkit-box-shadow: -2px 10px 9px -7px rgba(0, 0, 0, 0.34);
  -moz-box-shadow: -2px 10px 9px -7px rgba(0, 0, 0, 0.34);
  @media (max-width: 655px) {
    justify-content: space-between;
  }
  .TopbarLeft {
    padding-right: 130px;
    display: flex;
    @media (max-width: 655px) {
      padding-right: 0px;
    }
  }
  .Logo {
    font-size: 32px;
    padding-right: 20px;
    padding-left: 20px;
    font-weight: bold;
    color: black;
    cursor: pointer;
    font-family: "Dancing Script", cursive;
  }
  .Searchbar {
    width: 100%;
    height: 30px;
    background-color: rgb(218, 218, 218);
    border-radius: 10px;
    display: flex;
    align-items: center;
    @media (max-width: 655px) {
      display: none;
    }
  }
  .TopbarCenter {
    display: flex;
    width: 400px;
    justify-content: center;
    margin: 0 20px;
    z-index: 2;
  }
  .SearchInput {
    border: none;
    width: 70%;
    background-color: rgb(218, 218, 218);

    &:focus {
      outline: none;
    }
  }
  .TopbarRight {
    margin-right: 10px;
    padding-left: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    @media (max-width: 655px) {
      padding-left: 0px;
    }
  }
  .TopbarIcons {
    display: flex;
    position: relative;
  }
  .TopbarMenu {
    position: absolute;
    top: 42px;
    width: 120px;
    right: -4px;
    background-color: #f1f1f1;
    display: flex;
    flex-direction: column;
    -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  }
  .menuItems {
    margin: 7px;
    border-bottom: 1px solid #e1e1e1;
    color: black;
    cursor: pointer;
  }
  .TopbarIconItem {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .TopbarAdminItem {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;
    color: red;
  }
  .TopbarImg {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
  }
  .loginButton {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 25px;
    background-color: #0095f6;
    color: white;
    border-radius: 5px;
    border: none;
    font-size: 15px;
    cursor: pointer;
    padding: 10px;
  }
`;

export default Topbar;
