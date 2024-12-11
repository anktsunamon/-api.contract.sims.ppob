const database = require('../configs/database');

async function getBanner() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT uuid, banner_name, banner_image, banner_description FROM banner WHERE deleted = ? ORDER BY banner_name ASC';
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

module.exports = { getBanner }