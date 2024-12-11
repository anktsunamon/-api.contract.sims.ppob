const database = require('../configs/database');

async function checkBalanceUuid(data) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT uuid FROM balance WHERE uuid = ?';
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

async function postBalance(data) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO balance (uuid, balance, user_uuid) VALUES (?, ?, ?)';
        database.query(query, [data.uuid, data.balance, data.user_uuid], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

async function getBalanceByUseruuid(data) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT uuid, balance, user_uuid FROM balance WHERE user_uuid = ?';
        database.query(query, [data.user_uuid], (err, results) => {
            if(err) {
                reject(err);
            } else {
                resolve(results[0]);
            }
        });
    });
}

async function putBalance(data) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE balance SET balance = ? WHERE uuid = ?';
        database.query(query, [data.balance, data.uuid], (err, result) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

module.exports = { checkBalanceUuid, postBalance, getBalanceByUseruuid, putBalance }