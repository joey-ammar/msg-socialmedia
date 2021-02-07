// src /helloworld.js

import React from "react";
import axios from "axios";
import Child from "./child";
//first way to create component
export default class HelloWorld extends React.Component {
    constructor() {
        super();
        //creating state from the component
        this.state = {
            first: "Hussein",
            last: "Ammar",
        };
    }
    componentDidMount() {
        // componentDidMount is the React equivalent of Vue's mounted method
        //oftentimes in Vue we would do the following in mounted:
        // axios.get("/images").then(function (response) {
        //     self.images = response.data;
        // });
        //the way we'll do that thing in the React is:
        // axios.get("/some-route").then((response) => {
        //     //update state
        //     this.setState({
        //         // this.setState is the function we use to update state in React
        //         //first: resp.data.first
        //         first: "hassan",
        //     });
        // });
        setTimeout(() => {
            this.setState({
                first: "msg",
            });
        }, 3000);
    }
    handleClick() {
        //make axios requests or change state
        //change state
        this.setState({
            first: "hassan",
        });
        console.log("handleClick IS RUNNING");
    }
    render() {
        return (
            <div>
                {this.state.first}, {this.state.last}, good to see you !
                <Child last={this.state.last} />
                <p onClick={() => this.handleClick()}>Click ME</p>
            </div>
        );
    }
}

//second way to create component

// export default function HelloWorld() {
//     return <div>Hello, World!</div>;
// }
