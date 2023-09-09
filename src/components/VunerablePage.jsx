import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import styled from "styled-components";
import {NotificationManager} from "react-notifications";

function VulnerableComponent() {
    const [userId, setUserId] = useState("");
    const [user, setUser] = useState({});

    const [input, setInput] = useState('');
    const xss = "<img onerror='alert(\"XSS Attack!\")' src='invalid-image' />";

    const axiosJWT = axios.create();

    const sanitizeUsername = (input) => {
        return input.replace(/[^a-zA-Z0-9]/g, ''); // Keep only alphanumeric characters
    };

    const handleSubmit = () => {
        //const output = `<p>${input}</p>`; // User input is directly embedded
        const output = `<p>${sanitizeUsername(input)}</p>`; // User input is directly embedded
        document.getElementById('output').innerHTML = output;
    };

    let { userSuppliedData } = user;

    useEffect(() => {
        fetchUser();
    }, [userId]);

    async function fetchUser() {
        try{
            const response = await axios.get(`http://localhost:5000/api/User/${userId}`);
            setUser(response.data);
        }catch (e) {
            console.log(e.toString())
        }

        console.log(user)
    }

    function handleInputChange(e) {
        setUserId(e.target.value);
    }

    async function fetchConsumption() {
                try {
                    const response = await axios.get(`http://localhost:5000/api/User/consumption/${userId}`);
                    const { data } = response;
                    console.log(response)
                    document.getElementById('consumptionOutput').innerHTML = response.data;
                } catch (error) {
                    console.error('Error:', error);
                }
            }




    return (
        <div>
            <DivBox>
            <p>SQL Injection</p>
                <p>;INSERT INTO Person (firstName, lastName, city) VALUES ('SQL', 'Injection', 'Attack');</p>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
                <button onClick={fetchConsumption}>Submit</button>
                <div id="consumptionOutput"></div>
            </DivBox>

            <DivBox>
                <p>XSS Attack ({xss})</p>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
                <button onClick={handleSubmit}>Submit</button>
                <div id="output"></div>
            </DivBox>
        </div>
    );
}

const DivBox = styled.div`
  margin: 35px;
  background-color: #f2f2f2;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: block;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
  color: #333;
  border: 5px #282c34;
`;

export default VulnerableComponent;