const database = require('../configs/database');

async function checkUserUuid(data) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT uuid FROM user WHERE uuid = ?';
        database.query(query, [data.uuid], (err, results) => {
            if(err) {
                reject(err);
            } else {
                if (results.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
}

async function checkUseremail(data) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT user_email FROM user WHERE user_email = ?';
        database.query(query, [data.user_email], (err, results) => {
            if(err) {
                reject(err);
            } else {
                if (results.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
}

async function postUser(data) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO user (uuid, user_first_name, user_last_name, user_email) VALUES (?, ?, ?, ?)';
        database.query(query, [data.uuid, data.user_first_name, data.user_last_name, data.user_email], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

async function getUserByEmail(data) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT uuid, user_first_name, user_last_name, user_email, user_profile_image FROM user WHERE user_email = ?';
        database.query(query, [data.user_email], (err, results) => {
            if(err) {
                reject(err);
            } else {
                resolve(results[0]);
            }
        });
    });
}

async function putUserName(data) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE user SET user_first_name = ?, user_last_name = ? WHERE uuid = ?';
        database.query(query, [data.user_first_name, data.user_last_name, data.uuid], (err, result) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

async function putUserImage(data) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE user SET user_profile_image = ? WHERE uuid = ?';
        database.query(query, [data.user_profile_image, data.uuid], (err, result) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

module.exports = { checkUserUuid, checkUseremail, postUser, getUserByEmail, putUserName, putUserImage }