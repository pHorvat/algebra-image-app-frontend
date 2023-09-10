import React, { useContext, useState } from "react";
import styled from "styled-components";
import Intercept from "../Tools/refrech";
import { AuthContext } from "../contexts/AuthContext/AuthContext";
import axios from "axios";
import { NotificationManager } from "react-notifications";

function EditProfile(props) {
  const { user } = useContext(AuthContext);
  const [tier, setTier] = useState("");

  const axiosJWT = axios.create();
  Intercept(axiosJWT);

  const handleUserUpdate = async (updatedUser) => {
    try {
      console.log(updatedUser)
      console.log(user)
      const response = await axios.put(
          `https://algebraimageappbackend.azurewebsites.net/api/User/updateTier`,
          updatedUser,{
            headers: { Authorization: "Bearer " + user.accessToken },
          }
      );

      if (response.status === 200) {
        // User successfully updated
        console.log('User updated:', updatedUser);
        //NotificationManager.success("User updated", "Success", 3000);
        setTimeout(()=>{
          window.location.reload(false);
        }, 1000);
      } else {
        console.log('Error updating user:', response.statusText);
        //NotificationManager.error(response.statusText, "Warning", 3000);
      }
    } catch (error) {
      console.log('Error updating user:', error);
      ///NotificationManager.error(error, "Warning", 3000);
    }
  };

  function isLessThan24HoursAgo(datetime) {
    console.log(datetime)
    // Convert the datetime value to a Date object
    const currentDatetime = new Date(datetime);

    // Get the current datetime
    const now = new Date();

    // Calculate the difference in milliseconds between the two datetime values
    const timeDifference = now - currentDatetime;

    // Convert the time difference to hours
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    // Check if the time difference is less than 24 hours
    if (hoursDifference < 24) {
      console.log("returned false")
      return false;
    } else {
      console.log("returned true")
      console.log(hoursDifference)
      return true;
    }
  }

  return (
    <EditProfileContainer>
      <div className="editProfileWrapper">
        <div className="editProfileRight">
          <form action="" className="signupBox" onSubmit={(event) => event.preventDefault()}>

            <input type="radio" id="free" name="plan" value="FREE" className="radio-input" onChange={(e) => {
              setTier(e.target.value);
              console.log(tier)
            }}/>
            <label htmlFor="free" className="label-description" >
              <h2 className="plan-title">Free Plan</h2>
              <p className="plan-description">The Free Plan is a basic plan that offers limited features.</p>
              <p className="consumption-limit">Consumption Limit: 10 images</p>
            </label>
            <br/>

            <input type="radio" id="pro" name="plan" value="PRO" className="radio-input" onChange={(e) => {
              setTier(e.target.value);
              console.log(tier)

            }}/>
            <label htmlFor="pro" className="label-description">
              <h2 className="plan-title">Pro Plan</h2>
              <p className="plan-description">The Pro Plan is a premium plan with enhanced features.</p>
              <p className="consumption-limit">Consumption Limit: 50 images</p>
            </label>
            <br/>

            <input type="radio" id="gold" name="plan" value="GOLD" className="radio-input" onChange={(e) => {
              setTier(e.target.value);
              console.log(tier)
              console.log(user)


            }}/>
            <label htmlFor="gold" className="label-description">
              <h2 className="plan-title">Gold Plan</h2>
              <p className="plan-description">The Gold Plan is the ultimate plan with the most features.</p>
              <p className="consumption-limit">Consumption Limit: 100 images</p>
            </label>
            <br/>
            {isLessThan24HoursAgo(props.user.lastPackageChange) ?(
            <button className="editProfileButton" type="submit"
                    onClick={() =>
                        handleUserUpdate({ Id:user.userId, Username:user.username, Type:user.userType,  Tier: tier})}
            >
              Save
            </button>

                ):
                (<p style={{color: "red"}}>Last package change was less than 24h ago </p>)


            }
            </form>
        </div>
      </div>
    </EditProfileContainer>
  );
}

const EditProfileContainer = styled.div`
  padding: 9px;

  .editProfileLeftImg {
    width: 150px;
    display: block;
  }
  .editProfileWrapper {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
  }
  .editProfileBox {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    background-color: white;
    padding: 20px;
  }
  .editProfileBoxInput {
    padding-bottom: 10px;
  }
  .BoxInput {
    height: 30px;
    border-radius: 5px;
    border: 1px solid gray;
    font-size: 18px;
    padding-left: 10px;
  }
  .editProfileButton {
    height: 30px;
    border-radius: 10px;
    border: none;
    background-color: black;
    color: white;
    font-size: 16px;
    padding: 0 20px;
    cursor: pointer;
  }
  .shareOptionText {
    height: 20px;
    border-radius: 10px;
    border: none;
    background-color: #3b3b3b;
    color: white;
    font-size: 16px;
    padding: 0 20px;
    cursor: pointer;
  }
  .fileupload {
    cursor: pointer;
    display: flex;
    flex-direction: column;
  }


  .form-title {
    text-align: center;
    color: #333;
  }

  .plan-title {
    color: #555;
  }

  .plan-description {
    margin-bottom: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .label-description {
    margin-bottom: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 10px;
    padding: 10px;
  }

  .consumption-limit {
    margin-bottom: 10px;
    font-weight: bold;

  }

  .radio-input {
    display: none;
  }

  .plan-label {
    font-weight: bold;
  }

  .label-description:hover {
    background-color: #f2f2f2;
  }

  .radio-input:checked + .label-description {
    background-color: rgba(37, 147, 248, 0.58);
  }

  .signupBox {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-bottom: 20px;
  }




`;

export default EditProfile;
