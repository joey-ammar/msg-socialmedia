import React from "react";
import axios from "./axios";
import { HashRouter, Link } from "react-router-dom";
import { useStatefulFields, useAuthSubmit } from "./hooks";
export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }
    handleChange(e) {
        console.log("e.target.value", e.target.value);
        console.log("e.target.name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            //Second argument to see the this.state since it is asy and need some time
            () => console.log("this.state: ", this.state)
        );
    }
    login(e) {
        e.preventDefault();
        // data is this.statee.first , last ...
        console.log("about to submit", this.state);
        axios
            .post("/login", this.state)
            .then(({ data }) => {
                console.log("data: ", data);
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((error) => {
                console.log("Error in the submitting ", error);
            });
    }
    render() {
        return (
            <div className="mainContainer">
                {this.state.error && <div>Oppps something went wrong</div>}
                <div className="mainNav">
                    <div className="container">
                        <div className="insideMainNav">
                            <div className="logo">
                                <img src="/logo.png" />
                            </div>
                            <div className="mainForm">
                                <HashRouter>
                                    <div id="login">
                                        <small>Instagram |</small>
                                        <small> twitter |</small>
                                        <Link to="/"> Register</Link>
                                    </div>
                                </HashRouter>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="imagePlace">
                    <div className="insidePlace">
                        <h1>Connect with your soul mate</h1>
                        <p className="mainbtn">Download the app</p>
                    </div>
                </div>
                <div className="inputFields">
                    <div className="container">
                        <div>
                            <input
                                name="email"
                                placeholder="Email"
                                onChange={(e) => this.handleChange(e)}
                            ></input>
                        </div>
                        <div>
                            <input
                                name="password"
                                placeholder="Password"
                                type="password"
                                onChange={(e) => this.handleChange(e)}
                            ></input>
                        </div>
                        <div>
                            <button
                                className="submit"
                                onClick={(e) => this.login(e)}
                            >
                                Login
                            </button>
                        </div>
                        <HashRouter>
                            <div id="register">
                                <Link className="resetting" to="/reset">
                                    Reset your password now
                                </Link>
                            </div>
                        </HashRouter>
                    </div>
                </div>
            </div>
        );
    }
}
