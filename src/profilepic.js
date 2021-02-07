import React from "react";

export default function ProfilePic({ first, last, imageUrl, toggleModal }) {
    imageUrl = imageUrl || "/default.png";
    return (
        <div className="showcaseBox">
            <img
                src={imageUrl}
                alt={`${first} ${last}`}
                onClick={toggleModal}
            />
        </div>
    );
}
