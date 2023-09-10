import React from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";

function Signup() {
  const navigate = useNavigate();
  const [tier, setTier] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const registerHandler = async (e) => {
    e.preventDefault();
    const data = { tier, username, password };
    try {
      await axios.post("https://algebraimageappbackend.azurewebsites.net/api/user/register", data);
      //await axios.post("http://localhost:5000/api/user/register", data);
      navigate("/login");
    } catch (error) {
      NotificationManager.error(error.response.data.message, "Warning", 3000);
    }
  };
  return (
    <SignupContainer>
      <div className="signupWrapper">
        <div className="signupRight">
          <div className="signupRightTop">
            <div className="signupRightTopTop">
              <span className="signupRightTopLogo">AlgebraImageApp</span>
            </div>
            <div className="signupRightTopForm">
              <form action="" className="signupBox" onSubmit={registerHandler}>

                <input type="radio" id="free" name="plan" value="FREE" className="radio-input" onChange={(e) => {
                  setTier(e.target.value);
                }}/>
                  <label htmlFor="free" className="label-description">
                    <h2 className="plan-title">Free Plan</h2>
                    <p className="plan-description">The Free Plan is a basic plan that offers limited features.</p>
                    <p className="consumption-limit">Consumption Limit: 10 images</p>
                  </label>
                  <br/>

                    <input type="radio" id="pro" name="plan" value="PRO" className="radio-input" onChange={(e) => {
                      setTier(e.target.value);
                    }}/>
                      <label htmlFor="pro" className="label-description">
                        <h2 className="plan-title">Pro Plan</h2>
                        <p className="plan-description">The Pro Plan is a premium plan with enhanced features.</p>
                        <p className="consumption-limit">Consumption Limit: 50 images</p>
                      </label>
                      <br/>

                        <input type="radio" id="gold" name="plan" value="GOLD" className="radio-input" onChange={(e) => {
                          setTier(e.target.value);
                        }}/>
                          <label htmlFor="gold" className="label-description">
                            <h2 className="plan-title">Gold Plan</h2>
                            <p className="plan-description">The Gold Plan is the ultimate plan with the most features.</p>
                            <p className="consumption-limit">Consumption Limit: 100 images</p>
                          </label>
                          <br/>


                <input
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  placeholder="Username"
                  type="text"
                  required
                  className="signupInput"
                />
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  placeholder="Password"
                  type="password"
                  required
                  minLength="6"
                  className="signupInput"
                />
                <button className="signupButton">Sign Up</button>
              </form>
            </div>
          </div>
          <div className="signupRightBottom">
            <center>
              <span>have an account? </span>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <span
                  className="SignUptext"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Log in
                </span>
              </Link>
            </center>
          </div>
        </div>
      </div>
    </SignupContainer>
  );
}

const SignupContainer = styled.div`
  width: 100vw;
  display: flex;
  margin-top: 100px;
  justify-content: center;


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


  .signupRight {
    flex: 1;
    display: flex;
    height: max-content;
    justify-content: center;
    flex-direction: column;
    max-width: 360px;
    border: 1px solid #d6d6d6;
    padding: 10px;
    @media (max-width: 877px) {
      justify-content: center;
    }
  }

  .signupWrapper {
    width: 100%;
    height: 70%;
    display: flex;
    justify-content: center;
  }

  .signupRightWrapper {
    width: 360px;
    border: 1px solid rgb(224, 224, 224);
    border-radius: 3px;
    padding-bottom: 10px;
  }

  .signupRightTop {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .signupRightTopTop {
    display: flex;
    width: 100%;
    justify-content: center;
    margin: 35px 0;
  }

  .signupRightTopLogo {
    font-family: "Dancing Script", cursive;
    font-size: 50px;
    font-weight: bold;
  }

  .signupRightTopForm {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .signupBox {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 70%;
    padding-bottom: 20px;
  }

  .signupInput {
    height: 30px;
    width: 100%;
    border-radius: 5px;
    border: 1px solid gray;
    font-size: 14px;
    margin-bottom: 10px;
    padding-left: 5px;
    padding-right: 5px;
  }

  .signupButton {
    margin-top: 10px;
    width: 100%;
    height: 25px;
    background-color: #0095f6;
    color: white;
    border-radius: 5px;
    border: none;
    font-size: 15px;
    cursor: pointer;
  }

  .SignUptext {
    color: #0095f6;
    font-weight: 500;
  }
`;
export default Signup;
