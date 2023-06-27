import React, {useContext, useEffect} from "react";
import styled from "styled-components";
import Feed from "../Feed";
import Topbar from "../Topbar";

import "react-notifications/lib/notifications.css";
import {AuthContext} from "../../contexts/AuthContext/AuthContext";

function Home(props) {
    const { user } = useContext(AuthContext);
    useEffect(() => {
        function getTokenAge(token) {
            const tokenPayload = parseJwtPayload(token);
            const expirationTime = tokenPayload.exp;
            const currentTime = Math.floor(Date.now() / 1000);
            return expirationTime - currentTime;
        }
        function parseJwtPayload(token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        }
        const ageInSeconds = getTokenAge(user.accessToken);
        console.log('Token age (in seconds):', ageInSeconds);
        if(ageInSeconds<64800){
            localStorage.setItem("user", null);
            window.location.href = '/login';
        }
    })


  return (
    <>
      <Topbar
        rerenderFeed={props.rerenderFeed}
        onChange={props.onChange}
      ></Topbar>
      <HomeContainer>
        <Feed rerenderFeed={props.rerenderFeed} onChange={props.onChange} />
      </HomeContainer>
    </>
  );
}

export default Home;

const HomeContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;
