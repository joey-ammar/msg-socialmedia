import React from "react";
export default function Nav() {
    return (
        <div className="navBar">
            {location.pathname != "/" && (
                <p onClick={() => location.replace("/")}> Profile</p>
            )}
            {location.pathname != "/friends" && (
                <p onClick={() => location.replace("/friends")}>Friends</p>
            )}
            {location.pathname != "/chat" && (
                <p onClick={() => location.replace("/chat")}>Chats</p>
            )}
            {location.pathname != "/users" && (
                <p onClick={() => location.replace("/users")}>Search</p>
            )}
        </div>
    );
}
