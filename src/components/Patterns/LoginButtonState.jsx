import React, {Component} from 'react';
import axios from "axios";

class LoginButtonState extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: this.props.user !== "anonymous"
        };
    }

    handleClick = async () => {
        if (this.state.isLoggedIn) {
            localStorage.setItem("user", null);
            try {
                const res = await axios.post("http://localhost:5000/api/user/logout", {
                });
            } catch (e) {
                console.log(e)
            }
            this.setState({isLoggedIn: false});
            window.location.href = '/login';
        } else {
            try {
                const res = await axios.post("http://localhost:5000/api/user/logout", {
                });
            } catch (e) {
                console.log(e)
            }
            localStorage.setItem("user", null);
            window.location.href = '/login';
        }
    };

    render() {
        const loginButton={
            height: "25px",
            backgroundColor: "#0095f6",
            color: "white",
            borderRadius: "5px",
            border: "none",
            fontSize: "15px",
            cursor: "pointer",
            paddingLeft: "10px",
            paddingRight: "10px",

        }
        return (
            <button onClick={this.handleClick} style={loginButton}>
                {this.state.isLoggedIn ? 'Logout' : 'Login'}
            </button>
        );
    }
}

export default LoginButtonState;
