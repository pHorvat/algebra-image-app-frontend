import React, {useEffect, useContext, useState, useRef} from "react";
import styled from "styled-components";
import { FiSettings } from "react-icons/fi";
import Topbar from "../Topbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import Modal from "../UI/Modal";
import EditProfile from "../EditProfile";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import Intercept from "../../Tools/refrech";
import { format } from "timeago.js";
import {NotificationManager} from "react-notifications";


function Manage(props) {
    const [users, setUsers] = useState([]);
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [followed, setFollowed] = useState(true);
    const [consumption, setConsumption] = useState(0);
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

    useEffect(() => {
        fetchUsers();
    }, []);

    const [newUsername, setNewUsername] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://algebraimageappbackend.azurewebsites.net/api/User/');
            setUsers(response.data);
        } catch (error) {
            console.log('Error fetching users:', error);
        }
    };

    const handleUserUpdate = async (updatedUser) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/User/`,
                updatedUser,{
                    headers: { Authorization: "Bearer " + user.accessToken },
                }
            );

            if (response.status === 200) {
                // User successfully updated
                console.log('User updated:', updatedUser);
                NotificationManager.success("User updated", "Success", 3000);
                setTimeout(()=>{
                    window.location.reload(false);
                }, 1000);
            } else {
                console.log('Error updating user:', response.statusText);
                NotificationManager.error(response.statusText, "Warning", 3000);
            }
        } catch (error) {
            console.log('Error updating user:', error);
            NotificationManager.error(error, "Warning", 3000);
        }
    };








    return (
        <>
            {showEditProfile && (
                <Modal onClose={hideEditProfileHandler}>
                    <EditProfile onClose={hideEditProfileHandler} />
                </Modal>
            )}
            <Topbar
                rerenderFeed={props.rerenderFeed}
                onChange={props.onChange}
            ></Topbar>
            <UsersContainer>
            <div className="table-container">
                <h1>Manage Users</h1>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Type</th>
                        <th>Tier</th>
                        <th>Consumption</th>
                        <th>Last Package Change</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>
                                <input
                                    className="usernameInput"
                                    defaultValue ={user.username}
                                    type="text"
                                    onChange={(e) => setNewUsername(e.target.value)}
                                />
                                <button className="editButton" style={{marginLeft:"15px", }}
                                        onClick={() => handleUserUpdate({ ...user, Username: newUsername })}
                                >
                                    Save
                                </button>
                            </td>
                            <td>{user.type}</td>
                            <td>{user.tier}</td>
                            <td>{user.consumption}</td>
                            <td>{format(user.lastPackageChange)}</td>
                            <td>
                                <button className="editButton"
                                    onClick={() => handleUserUpdate({ ...user, Tier: 'GOLD' })}
                                >
                                    GOLD
                                </button>
                                <button
                                    onClick={() => handleUserUpdate({ ...user, Tier: 'PRO' })}
                                >
                                    PRO
                                </button>
                                <button
                                    onClick={() => handleUserUpdate({ ...user, Tier: 'FREE' })}
                                >
                                    FREE
                                </button>
                                <button
                                    onClick={() => handleUserUpdate({ ...user, Type: 'Admin' })}
                                >
                                    Admin
                                </button>
                                <button
                                    onClick={() => handleUserUpdate({ ...user, Type: 'Registered' })}
                                >
                                    Registered
                                </button>
                                {/* Add more buttons/actions for other fields as needed */}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            </UsersContainer>
        </>
    );
}

const UsersContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 10px;
  
  .table-container {
    margin: 20px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #f5f5f5;
  }

  button {
    padding: 5px 10px;
    border: none;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
    margin-right: 5px;
    border-radius: 5px;
  }

  button:hover {
    background-color: #45a049;
  }
  .verticalLine {
    width: 10px; /* Adjust the width as needed */
    height: 100%; /* Adjust the height as needed */
    background-color: black; /* Adjust the color as needed */
  }

  .usernameInput {
    height: 30px;
    width: 65%;
    border-radius: 5px;
    border: 1px solid gray;
    margin-bottom: 10px;
    padding: 0px 5px;
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
  }
  .profilePostImg {
    width: 100%;
    height: 100%;
    object-fit: fill;
    display: block;
  }
`;
export default Manage;
