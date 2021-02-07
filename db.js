const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/social"
);
module.exports.getSubmit = (first, last, email, password) => {
    return db.query(
        `INSERT INTO users
         (first, last, email, password) VALUES ($1, $2, $3, $4)
          RETURNING id;`,
        [first, last, email, password]
    );
};
module.exports.getLogin = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1;`, [email]);
};
module.exports.getUser = (id) => {
    return db.query(`SELECT * FROM users WHERE id = $1;`, [id]);
};
module.exports.getUsers = () => {
    return db.query(`
    SELECT * FROM users ORDER BY id DESC LIMIT 3;`);
};
module.exports.firstUser = (first) => {
    return db.query(
        `
    SELECT * FROM users WHERE first ILIKE $1;`,
        [first + "%"]
    );
};
module.exports.lastUser = (last) => {
    return db.query(
        `
        SELECT * FROM users WHERE last ILIKE $1;`,
        [last + "%"]
    );
};
module.exports.addCode = (email, code) => {
    return db.query(
        `
    INSERT INTO reset_codes (email, code)
    VALUES ($1, $2)
    RETURNING email, code;
        `,
        [email, code]
    );
};

module.exports.getCode = (email) => {
    return db.query(
        `
        SELECT * FROM reset_codes WHERE reset_codes.email = $1;
        `,
        [email]
    );
};

module.exports.updatePassword = (email, hashPassword) => {
    return db.query(
        `
        UPDATE users SET password = $2 WHERE email = $1;
        `,
        [email, hashPassword]
    );
};

module.exports.addImage = (id, image_url) => {
    return db.query(
        `UPDATE users SET image_url = $2 WHERE id = $1 RETURNING *;`,
        [id, image_url]
    );
};
module.exports.changeBio = (id, bio) => {
    return db.query(`UPDATE users SET bio = $2 WHERE id = $1 RETURNING bio;`, [
        id,
        bio,
    ]);
};
module.exports.ifFriends = (receiver_id, sender_id) => {
    return db.query(
        `SELECT * FROM friendships WHERE (receiver_id = $1 AND sender_id = $2) OR (receiver_id = $2 AND sender_id = $1);`,
        [receiver_id, sender_id]
    );
};
module.exports.askFriends = (receiver_id, sender_id) => {
    return db.query(
        `INSERT INTO friendships (receiver_id, sender_id) VALUES ($1, $2) RETURNING *;`,
        [receiver_id, sender_id]
    );
};
module.exports.acceptFriends = (receiver_id, sender_id) => {
    return db.query(
        `UPDATE friendships SET accepted = TRUE WHERE (receiver_id = $1 AND sender_id = $2) OR (receiver_id = $2 AND sender_id = $1);`,
        [receiver_id, sender_id]
    );
};
module.exports.deleteFriends = (receiver_id, sender_id) => {
    return db.query(
        `DELETE FROM friendships WHERE (receiver_id = $1 AND sender_id = $2) OR (receiver_id = $2 AND sender_id = $1);`,
        [receiver_id, sender_id]
    );
};
module.exports.wannabes = (id) => {
    return db.query(
        `SELECT users.id, first, last, image_url, accepted FROM friendships JOIN users 
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id) 
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id) 
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`,
        [id]
    );
};
module.exports.getMsg = () => {
    return db.query(
        `SELECT chats.id AS chats_id, users.id, first, last, image_url, message, sender_id, chats.created_at FROM users JOIN chats ON users.id = sender_id ORDER BY chats_id DESC LIMIT 10;`
    );
};

module.exports.addMsg = (message, sender_id) => {
    return db.query(
        `INSERT INTO chats (message, sender_id) VALUES ($1, $2) RETURNING *;`,
        [message, sender_id]
    );
};
