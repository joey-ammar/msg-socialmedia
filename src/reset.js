import React from "react";
import axios from "./axios";
export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            error: false,
        };
    }
    handleChange(e) {
        console.log("e.target.value", e.target.value);
        console.log("e.target.name", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state", this.state)
        );
    }
    getReset() {
        console.log("getReset Part");
        axios.post("/password/reset/start", this.state).then(({ data }) => {
            if (data.success) {
                console.log("getReset request", data);
                this.setState({ step: 2 });
            } else {
                this.setState({ error: true });
            }
        });
    }
    getNew() {
        console.log("getNew Part");
        axios.post("/password/reset/verify", this.state).then(({ data }) => {
            if (data.success) {
                console.log("getNew", data);
                this.setState({ step: 3 });
            } else {
                this.setState({ error: true });
            }
        });
    }

    render() {
        return (
            <div className="goingToReset">
                <h1>Reset Your Password</h1>
                {this.state.step == 1 && (
                    <div className="resetField">
                        {this.state.error && (
                            <div className="whiteOps">
                                Oops something went wrong
                            </div>
                        )}

                        <input
                            className="resetInputField"
                            name="email"
                            placeholder="email"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <button
                            className="btnReset"
                            onClick={() => this.getReset()}
                        >
                            reset
                        </button>
                    </div>
                )}
                {this.state.step == 2 && (
                    <div className="flexReset">
                        {this.state.error && (
                            <div>Oops something went wrong</div>
                        )}
                        <input
                            name="code"
                            placeholder="code"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <input
                            type="password"
                            name="password"
                            placeholder="Your new password"
                            onChange={(e) => this.handleChange(e)}
                        ></input>
                        <button
                            className="btnNow"
                            onClick={() => this.getNew()}
                        >
                            reset
                        </button>
                    </div>
                )}
                {this.state.step == 3 && (
                    <div className="lastReset">
                        {this.state.error && (
                            <div>Oops something went wrong</div>
                        )}
                        <h1>You have done it</h1>
                    </div>
                )}
            </div>
        );
    }
}
