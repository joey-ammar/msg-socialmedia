import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    pendingFriendsWannabes,
    acceptFriendship,
    endFriendship,
    cancelFriendship,
} from "./actions";
import ProfilePic from "./profilepic";
import { Link } from "react-router-dom";
export default function Friends() {
    const dispatch = useDispatch();
    const wannabes = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((user) => user.accepted == false)
    );
    const friends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((user) => user.accepted == true)
    );
    useEffect(() => {
        dispatch(pendingFriendsWannabes());
        console.log(
            "consoling in the useEffect pendingFriendsWannabes",
            pendingFriendsWannabes()
        );
    }, []);
    return (
        <div>
            <h1>You are friends with:</h1>

            <div>
                {friends &&
                    friends.map((eachFriend) => (
                        <div key={eachFriend.id}>
                            <Link to={"/user/" + eachFriend.id}>
                                <ProfilePic
                                    first={eachFriend.first}
                                    last={eachFriend.last}
                                    imageUrl={eachFriend.image_url}
                                />
                                <div>
                                    {eachFriend.first}
                                    {eachFriend.last}
                                </div>
                            </Link>
                            <button
                                onClick={() =>
                                    dispatch(endFriendship(eachFriend.id))
                                }
                            >
                                End Friendship
                            </button>
                        </div>
                    ))}
            </div>
            {/*  */}
            <h1>Pending</h1>
            <div>
                {wannabes &&
                    wannabes.map((eachWannabe) => (
                        <div key={eachWannabe.id}>
                            <Link to={"/user/" + eachWannabe.id}>
                                <ProfilePic
                                    first={eachWannabe.first}
                                    last={eachWannabe.last}
                                    imageUrl={eachWannabe.image_url}
                                />
                                <div>
                                    {eachWannabe.first}
                                    {eachWannabe.last}
                                </div>
                            </Link>
                            <button
                                onClick={() =>
                                    dispatch(acceptFriendship(eachWannabe.id))
                                }
                            >
                                Accept Friend Request
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
