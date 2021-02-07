export default function reducer(state = {}, action) {
    if (action.type === "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes,
        };
    }
    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((eachWannabe) => {
                console.log("eachWan", eachWannabe);
                console.log("action", action);
                if (eachWannabe.id == action.otherId) {
                    return {
                        ...eachWannabe,
                        accepted: true,
                    };
                } else {
                    return eachWannabe;
                }
            }),
        };
    }

    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter((eachFriend) => {
                eachFriend.id != action.otherId;
            }),
        };
    }

    if (action.type == "GET_MSG") {
        state = {
            ...state,
            chatMessages: action.msgs,
        };
    }

    if (action.type == "ADD_MSG") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.msg],
        };
        console.log(state);
    }

    return state;
}
