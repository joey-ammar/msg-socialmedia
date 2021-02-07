import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";
export default function People() {
    const [user, setUser] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        let uEffect;
        (async () => {
            const { data } = await axios.get("/api/users/" + (user || "user"));
            console.log("The data: ", data);
            if (!uEffect) {
                console.log("Yes !");
                setUsers(data);
            }
        })();
        return () => {
            uEffect = true;
        };
    }, [user]);

    return (
        <div className="discoverPeople">
            <h1>Discover people around you: </h1>
            <input
                onChange={(e) => setUser(e.target.value)}
                placeholder="Starting finding people"
            />
            <div className="search">
                {users.map((user) => (
                    <div className="insideSearch" key={user.id}>
                        <Link to={"/user/" + user.id}>
                            <ProfilePic
                                className="insideSearch"
                                first={user.first}
                                last={user.last}
                                imageUrl={user.image_url}
                            />
                            <div className="bigNames">
                                {user.first} {user.last}
                            </div>
                        </Link>
                    </div>
                ))}
                {!users.length && <div>No results found</div>}
            </div>
        </div>
    );
}
