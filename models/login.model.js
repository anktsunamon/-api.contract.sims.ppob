const database = require('../configs/database');

async function checkLoginUuid(data) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT uuid FROM login WHERE uuid = ?';
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

async function postLogin(data) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO login (uuid, login_name, login_password, user_uuid) VALUES (?, ?, ?, ?)';
        database.query(query, [data.uuid, data.login_name, data.login_password, data.user_uuid], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(query);
            }
        });
    });
}

async function getLoginByName(data) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT uuid, login_name, login_password, user_uuid FROM login WHERE login_name = ? AND deleted = ?';
        database.query(query, [data.login_name, 0], (err, results) => {
            if(err) {
                reject(err);
            } else {
                if (results.length === 0) {
                    resolve(null);
                } else {
                    resolve(results[0]);
                }
            }
        });
    });
}

module.exports = { checkLoginUuid, postLogin, getLoginByName }