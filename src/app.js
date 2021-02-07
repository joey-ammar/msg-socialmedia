import React from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import { HashRouter, Link } from "react-router-dom";
import People from "./people";
import Presentational from "./presentational";
import Uploader from "./uploader";
import Profile from "./profile";
import Logout from "./logout";
import OtherProfile from "./otherprofile";
import Friends from "./friends";
import Chat from "./chat";
export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "Hussein",
            last: "Ammar",
            uploaderIsVisible: false,
        };
    }
    componentDidMount() {
        console.log("App mounted");
        // here is where we want to make an axios request to "get" info about logged in user (first name, last name)
        // an axios route "/user" is a good path for it
        // when we finally have the info from the server, you will want to add it to
        axios
            .get("/userIndex")
            .then(({ data }) => {
                this.setState({
                    id: data.id,
                    first: data.first,
                    last: data.last,
                    imageUrl: data.imageUrl,
                    bio: data.bio,
                });
            })
            .catch((error) => {
                console.log("Error in userIndex ", error);
            });
    }
    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }
    methodInApp(arg) {
        console.log("Im running in App !!!", arg);
        this.setState({
            imageUrl: arg,
        });
    }

    saveBio(arg) {
        console.log("Im running in Bio", arg);
        this.setState({
            bio: arg,
        });
    }

    render() {
        if (!this.state.id) {
            return null;
        } else {
            return (
                <div className="mainContainer">
                    <div className="container">
                        <div className="mainNav">
                            <div className="container">
                                <div className="insideMainNav">
                                    <div className="logo">
                                        <img src="/logo.png" />
                                    </div>
                                    <div className="mainForm">
                                        <HashRouter>
                                            <div className="sorting" id="login">
                                                <Presentational
                                                    first={this.state.first}
                                                    last={this.state.last}
                                                    imageUrl={
                                                        this.state.imageUrl
                                                    }
                                                    toggleModal={() =>
                                                        this.toggleModal()
                                                    }
                                                />
                                                <Logout />
                                            </div>
                                        </HashRouter>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <BrowserRouter>
                            <div className="imageSort">
                                <div className="container">
                                    <Route
                                        exact
                                        path="/"
                                        render={() => (
                                            <Profile
                                                className="profileImageSmall"
                                                first={this.state.first}
                                                last={this.state.last}
                                                imageUrl={this.state.imageUrl}
                                                toggleModal={() =>
                                                    this.toggleModal()
                                                }
                                                //
                                                bio={this.state.bio}
                                                saveBio={(arg) =>
                                                    this.saveBio(arg)
                                                }
                                            />
                                        )}
                                    />
                                    <Route
                                        exact
                                        path="/users"
                                        render={() => <People />}
                                    />
                                    <Route
                                        exact
                                        path="/friends"
                                        render={() => <Friends />}
                                    />
                                    <Route
                                        path="/chat"
                                        render={() => <Chat />}
                                    />
                                    <Route
                                        exact
                                        path="/user/:id"
                                        render={(props) => (
                                            <OtherProfile
                                                key={props.match.url}
                                                match={props.match}
                                                history={props.history}
                                            />
                                        )}
                                    />

                                    {this.state.uploaderIsVisible && (
                                        <Uploader
                                            methodInApp={(arg) =>
                                                this.methodInApp(arg)
                                            }
                                            toggleModal={() =>
                                                this.toggleModal()
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </BrowserRouter>
                    </div>
                </div>
            );
        }
    }
}
