import axios from "./axios";

export async function pendingFriendsWannabes() {
    const { data } = await axios.get("/friends-wannabes");
    console.log(
        "We are consoling the data in the pending Friends wannabes",
        data
    );
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friendsWannabes: data,
    };
}
// working on the other part
export async function acceptFriendship(otherId) {
    console.log("hello world");
    const { data } = await axios.post(
        `/api/makeFriends/${otherId}/Accept Friend`
    );
    console.log("the data from accept FriendShip", data);
    console.log("otherid", otherId);
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        otherId,
    };
}

export async function endFriendship(otherId) {
    console.log("heyyyy!!!");
    const { data } = await axios.post(`/api/makeFriends/${otherId}/End Friend`);
    console.log("bla bla");
    console.log("the data from the end friendship", data);
    return {
        type: "UNFRIEND",
        otherId,
    };
}
export function chatMessages(msgs) {
    console.log(
        "incase we have an error this will appear in the chatmessages!"
    );
    console.log(msgs);
    return {
        type: "GET_MSG",
        msgs,
    };
}
export function chatMessage(msg) {
    console.log("incase we have an error this will appear in the chatmessage");
    console.log(msg);
    return {
        type: "ADD_MSG",
        msg,
    };
}
