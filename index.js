/*
*************************
*************************
Variables
 */

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const ses = require("./ses");
const db = require("./db");
const { hash, compare } = require("./bc");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const config = require("./config");
/*
*************************
*************************
cookie-Session
 */
// app.use(
//     cookieSession({
//         secret: " I'm always angry",
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
/*
*************************
*************************
CSURF
 */
app.use(csurf());
/*
*************************
*************************
TOKEN
 */
app.use(function (req, res, next) {
    console.log(req.csrfToken());
    res.cookie("mytoken", req.csrfToken());
    next();
});
/*
*************************
*************************
FIles
 */
app.use(express.static("public"));
app.use(express.json());
app.use(compression());
/*
*************************
*************************
Image plate
 */
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
//we need to build a register post route
//takes the body, hashed the password
//stores everything in db
//set a cookie (i.e. req.session.userId = equal a number)
//if it worked, res.json({success:. true})

/*
*************************
*************************
Welcome
 */
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
/*
*************************
*************************
Register
 */
app.post("/register", (req, res) => {
    console.log("The req.body part", req.body);
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let password = req.body.password;
    console.log(password);
    if (first != "" && last != "" && email != "" && password != "") {
        hash(password)
            .then((hashPassword) => {
                console.log("This is the hashed password", hashPassword);
                return db.getSubmit(first, last, email, hashPassword);
            })
            .then((results) => {
                console.log(results.rows);
                console.log(results.rows[0].id, "results");
                req.session.userId = results.rows[0].id;
                res.json({ success: true });
            })
            .catch((error) => {
                console.log(
                    "You are in the submit post request register",
                    error
                );
            });
    }
});

/*
*************************
*************************
Login
 */
app.post("/login", (req, res) => {
    let password = req.body.password;
    let email = req.body.email;
    let hashPassword;
    let id;
    console.log(req.session.userId);
    db.getLogin(email)
        .then((results) => {
            console.log("Results row", results.row);
            hashPassword = results.rows[0].password;
            id = results.rows[0].id;
            console.log("hashedPassword", hashPassword);
            console.log("the id ", id);

            return hashPassword;
        })
        .then((hashPassword) => {
            return compare(password, hashPassword);
        })
        .then((ifMatch) => {
            if (ifMatch) {
                req.session.userId = id;
                console.log("They match");
                res.json({ success: true });
            } else {
                res.json({ success: false });
                console.log("They dont match");
                console.log("I'm going back to the login");
            }
        })
        .catch((error) => {
            console.log("You are not logged in try another things");
            res.json({ success: false });
            console.log("error", error);
        });
});

/*
*************************
*************************
reset Password
 */
app.post("/password/reset/start", (req, res) => {
    console.log(req.body);
    let email = req.body.email;
    db.getLogin(email)
        .then((results) => {
            if (results.rows.length < 1) {
                res.json({ error: true });
            } else {
                const theCode = cryptoRandomString({ length: 6 });
                db.addCode(email, theCode)
                    .then(() =>
                        sendEmail(
                            email,
                            "Let us resetting the code",
                            `Your  code is ${theCode}`
                        ).then(() => res.json({ success: true }))
                    )
                    .catch((error) => {
                        console.log("Error in the start zone", error);
                    });
            }
        })
        .catch((error) => {
            console.log("An error in the reset occurs", error);
        });
});
/*
*************************
*************************
reset password
 */
app.post("/password/reset/verify", (req, res) => {
    console.log(req.body);
    let email = req.body.email;
    let code = req.body.code;
    db.getCode(email).then((results) => {
        console.log(results);
        console.log(results.rows);
        if (results.rows.length < 1) {
            res.json({ error: true });
        } else {
            let last = results.rows.length - 1;
            if (results.rows[last].code === code) {
                hash(req.body.password)
                    .then((hashPassword) => {
                        db.updatePassword(email, hashPassword)
                            .then(() => {
                                console.log(
                                    "You have successfully updated your password!"
                                );
                                res.json({ success: true });
                            })
                            .catch((error) => {
                                console.log(
                                    "Error in updating your password",
                                    error
                                );
                            });
                    })
                    .catch((error) => {
                        console.log("err in reset", error);
                    });
            } else {
                res.json({ error: true });
            }
        }
    });
});
/*
*************************
*************************
userIndex
 */
app.get("/userIndex", (req, res) => {
    return db
        .getUser(req.session.userId)
        .then((results) => {
            console.log("This is the userIndex results", results);
            console.log("results.rows", results.rows);
            let user = {
                id: results.rows[0].id,
                first: results.rows[0].first,
                last: results.rows[0].last,
                imageUrl: results.rows[0].image_url,
                bio: results.rows[0].bio,
            };
            res.json(user);
        })
        .catch((error) => {
            console.log("Error in user", error);
        });
});
/*
*************************
*************************
Upload
 */
app.post("/upload", uploader.single("file"), ses.upload, (req, res) => {
    let spicedUrl = config.s3Url;
    console.log("Spiced Url", spicedUrl);
    spicedUrl += req.file.filename;
    console.log("After that Url", spicedUrl);
    if (req.file) {
        return db
            .addImage(req.session.userId, spicedUrl)
            .then((results) => {
                console.log("results.rows", results.rows);
                let image = {
                    imageUrl: results.rows[0].image_url,
                };
                res.json(image);
            })
            .catch((error) => {
                console.log("Errors in the image handle", error);
                res.json({ success: false });
            });
    } else {
        res.json({
            success: false,
        });
    }
});
/*
*************************
*************************
SaveBio
 */
app.post("/bioSaving", (req, res) => {
    let bio = req.body.wBio;
    console.log("bioSaving the bio", bio);
    return db
        .changeBio(req.session.userId, bio)
        .then((results) => {
            console.log("results", results);
            console.log("results and bio", results.rows);
            let bio = {
                bio: results.rows[0].bio,
            };
            console.log("The Bio one: ", bio);
            res.json(bio);
        })
        .catch((error) => {
            console.log("Error concerning the bio", error);
            res.json({ success: false });
        });
});
/*
*************************
*************************
user id
 */
app.get("/api/user/:id", (req, res) => {
    console.log("server is watching you: ", req.body);
    let id = req.params.id;
    console.log("api/user(:id , id", id);
    if (id == req.session.userId) {
        res.json({ trueUser: true });
    } else {
        return db
            .getUser(id)
            .then((results) => {
                let user = {
                    first: results.rows[0].first,
                    last: results.rows[0].last,
                    imageUrl: results.rows[0].image_url,
                    bio: results.rows[0].bio,
                };
                console.log("This is the user: ", user);
                res.json(user);
            })
            .catch((error) => {
                console.log("Handling the error in the user id", error);
            });
    }
});

app.get("/api/users/:user", async (req, res) => {
    const user = req.params.user;
    console.log("I'm in the api users user");
    console.log("req.params.user", req.params.user);
    if (user == "user") {
        const { rows } = await db.getUsers();
        console.log("Let us see the rows in the api users user", rows);
        res.json(rows);
    } else {
        try {
            const { rows } = await db.firstUser(user);
            res.json(rows);
        } catch (error) {
            console.log("Error in findUsersFirst: ", error);
        }
    }
});
/*
*************************
*************************
friendsRequest
 */

app.get("/api/friendsB/:otherId", (req, res) => {
    db.ifFriends(req.session.userId, req.params.otherId)
        .then((results) => {
            console.log("Searching for the results here", results.rows);
            if (results.rows == 0) {
                console.log("I am going to send friend request now");
                res.json({ buttonText: "Sending Friend Request" });
            } else if (results.rows[0].accepted) {
                console.log("I am going to end friends now");
                res.json({ buttonText: "End Friend" });
            } else if (req.session.userId == results.rows[0].receiver_id) {
                console.log("Accept", req.session.userId);
                res.json({ buttonText: "Accept Friend" });
            } else if (req.session.userId == results.rows[0].sender_id) {
                console.log("CAncel", req.session.userId);
                res.json({ buttonText: "Cancel Friend" });
            }
        })
        .catch((err) => {
            console.log("err in getFriendship", err);
        });
});
app.post("/api/makeFriends/:otherId/:buttonText", (req, res) => {
    if (req.params.buttonText == "Sending Friend Request") {
        return db
            .askFriends(req.params.otherId, req.session.userId)
            .then(() => {
                res.json({ buttonText: "Cancel Friend" });
            })
            .catch((error) => {
                "You are in request friends error ", error;
            });
    } else if (
        req.params.buttonText == "Cancel Friend" ||
        req.params.buttonText == "End Friend"
    ) {
        db.deleteFriends(req.session.userId, req.params.otherId)
            .then(() => {
                console.log("Cancel Friend");
                res.json({ buttonText: "Sending Friend Request" });
            })
            .catch((error) => {
                "error in canceling friends", error;
            });
    } else if (req.params.buttonText == "Accept Friend") {
        return db
            .acceptFriends(req.session.userId, req.params.otherId)
            .then(() => {
                console.log("Accepted");
                res.json({ buttonText: "End Friend" });
            })
            .catch((error) => {
                "Not accepted error in the acceptFriends", error;
            });
    }
});
/**
 * wannabes
 */

app.get("/friends-wannabes", (req, res) => {
    db.wannabes(req.session.userId)
        .then((results) => {
            console.log("First we got the results", results);
            console.log(
                "Second we are searching for the results.rows in the wannabes",
                results.rows
            );
            res.json(results.rows);
        })
        .catch((error) => {
            console.log("handling error in the friends-wannabes route", error);
        });
});

/**
 * logout
 */
app.get("/logout", (req, res) => {
    req.session = null;
    console.log("You are logging out !");
    res.redirect("/");
});
/*
 *************************
 *************************
 *
 */
app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function () {
    console.log("I'm listening.");
});
io.on("connection", function (socket) {
    console.log(`socket with id ${socket.id} connected`);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const userId = socket.request.session.userId;
    console.log("this is the userId,", userId);
    db.getMsg().then((data) => {
        console.log("the rows inside the io.on", data.rows);
        io.sockets.emit("chatMessages", data.rows);
    });
    //insert code to retreive last ten messages from db

    // db.getLastTen().then(data => {
    //     console.log(data.rows);
    //     io.sockets.emit("chatMessages", data.rows);
    // });

    //db query needs to be a JOIN
    //users table first_name, last_name, pic_url / chat table user_id and msg_text
    //most recent msg at bottom - order in query or in server (easier in query)
    //return info by emitting event to socket.js

    socket.on("newMessage", (msg) => {
        console.log("this message is coming from chat.js component", msg);

        console.log("userId of sender", userId);
        return db.addMsg(msg, userId).then((data) => {
            console.log("inside the newMsg rows", data.rows);
            let newMsg = {
                chats_id: data.rows[0].id,
                message: data.rows[0].message,
                sender_id: data.rows[0].sender_id,
                created_at: data.rows[0].created_at,
            };
            console.log("after the msg and rows", data.rows);
            return db.getUser(userId).then((data) => {
                console.log("inside the getUser userId rows", data.rows);
                let idInformation = {
                    ...newMsg,
                    first: data.rows[0].first,
                    last: data.rows[0].last,
                    image_url: data.rows[0].image_url,
                };
                io.sockets.emit("chatMessage", idInformation);
            });
        });
        // db.addChatMsg(newMsg, userId).then(response => {
        //     console.log("addChat response", response.rows);
        // });

        //also need db query to extract info about user (first, last, pic_url)

        //then emit message object

        //needs all the user info too
    });
});
