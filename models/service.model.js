const database = require('../configs/database');

async function getService() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT uuid, service_code, service_name, service_icon, service_tariff FROM service WHERE deleted = ? ORDER BY service_code ASC';
        database.query(query, [0], (err, results) => {
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

async function getServiceByServicecode(data) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT uuid, service_code, service_name, service_icon, service_tariff FROM service WHERE service_code = ? AND deleted = ?';
        database.query(query, [data.service_code, 0], (err, results) => {
            if(err) {
                reject(err);
            } else {
                resolve(results[0]);
            }
        });
    });
}

module.exports = { getService, getServiceByServicecode }