const database = require('../configs/database');

async function checkTransactionUuid(data) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT uuid FROM transaction WHERE uuid = ?';
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

async function postTransaction(data) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO transaction (uuid, transaction_invoice_number, transaction_type, transaction_description, transaction_total_amount, user_uuid, created_on) VALUES (?, ?, ?, ?, ?, ?, ?)';
        database.query(query, [data.uuid, data.transaction_invoice_number, data.transaction_type, data.transaction_description, data.transaction_total_amount, data.user_uuid, data.created_on], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

async function getTransactionByUseruuid(data) {
    return new Promise((resolve, reject) => {
        let limitCondition = '';
        if(data.limit !== 0) {
            limitCondition = ` LIMIT ${data.limit} OFFSET ${data.offset}`;
        }

        const query = 'SELECT uuid, transaction_invoice_number, transaction_type, transaction_description, transaction_total_amount, user_uuid, created_on FROM transaction WHERE user_uuid = ? ORDER BY created_on DESC' + limitCondition;
        database.query(query, [data.user_uuid], (err, results) => {
            if(err) {
                reject(err);
            } else {
                if (results.length === 0) {
                    resolve(null);
                } else {
                    resolve(results);
                }
            }
        });
    });
}

module.exports = { checkTransactionUuid, postTransaction, getTransactionByUseruuid }