import axios from "./axios";
import React, { useState, useEffect } from "react";
export default function FriendshipButton({ otherId }) {
    console.log("This is the other user ID", otherId);
    const [buttonText, setButtonText] = useState("Start making friends");
    useEffect(() => {
        console.log("Inside the useEffect inf friendsB");
        axios
            .get(`/api/friendsB/${otherId}`)
            .then(({ data }) => {
                console.log("data", data);
                setButtonText(data.buttonText);
            })
            .catch((error) => {
                console.log("Firing an error in the catch of useEffect", error);
            });
    }, []);
    function submit() {
        console.log("It is time to click the button", buttonText);
        axios
            .post(`/api/makeFriends/${otherId}/${buttonText}`)
            .then(({ data }) => {
                console.log("In the data part in the post submit", data);
                setButtonText(data.buttonText);
            })
            .catch((error) => {
                console.log("Catching an error in the post submit ", error);
            });
    }
    return (
        <div>
            <button className="CreatingFriends" onClick={submit}>
                {buttonText}
            </button>
        </div>
    );
}
