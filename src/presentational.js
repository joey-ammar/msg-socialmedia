import React from "react";
import ProfilePic from "./profilepic";
import Nav from "./nav";
//pass props as an argument to get access to the info being passed down
export default function Presentational({ first, last, imageUrl, toggleModal }) {
    return (
        <div className="arrange">
            <ProfilePic
                first={first}
                last={last}
                imageUrl={imageUrl}
                toggleModal={toggleModal}
            />
            <Nav />
        </div>
    );
}
