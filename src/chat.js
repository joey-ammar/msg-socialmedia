import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.chatMessages);
    console.log("Last 10 chatMessages: ", chatMessages);
    useEffect(() => {
        console.log("chat hooks component has mounted");
        console.log("elemRef =", elemRef);
        console.log("scroll top:", elemRef.current.scrollTop);
        console.log("Client height:", elemRef.current.clientHeight);
        console.log("scroll height:", elemRef.current.scrollHeight);
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);
    const keyCheck = (e) => {
        // console.log("e.target.value", e.target.value);
        // console.log("key pressed:", e.key);
        if (e.key === "Enter") {
            e.preventDefault(); //stops enter taking cursor to the next line
            console.log(e.target.value);
            socket.emit("newMessage", e.target.value);
            e.target.value = "";
        }
    };
    return (
        <div>
            <div className="chat-container">
                <h2>Start talking ....</h2>
                <div className="chat" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map((message) => (
                            <div
                                className="insideMaping"
                                key={message.chats_id}
                            >
                                <Link to={"/user/" + message.id}>
                                    <ProfilePic
                                        className="imageRight"
                                        first={message.first}
                                        last={message.last}
                                        imageUrl={message.image_url}
                                    />
                                    <div className="fromWhom">
                                        {message.first} {message.last}
                                    </div>
                                </Link>
                                <div className="organizing">
                                    <div className="timeFly">
                                        {message.created_at}
                                    </div>
                                    <div className="messages">
                                        {message.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                <textarea
                    className="textEditor"
                    placeholder="Start typing"
                    onKeyDown={keyCheck}
                />
            </div>
        </div>
    );
}
