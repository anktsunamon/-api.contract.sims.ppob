const path = require('path');
const jwt = require('jsonwebtoken');

const customConfig = require('../custom-config');

const generalHelper = require('../helpers/general.helper');

const authencationCheck =  async(req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (authHeader) {
        const bearerContent = authHeader.split(' ')[1];

        jwt.verify(bearerContent, customConfig.secret, async (err, user) => {
            if (err) {
                return res.status(401).json({
                    status: 108,
                    message: 'Token tidak valid atau kadaluwarsa',
                    data: null
                });
            } else {
                next();
            }
        });
    } else {
        return res.status(401).json({
            status: 108,
            message: 'Token tidak valid atau kadaluwarsa',
            data: null
        });
    }
}

module.exports = { authencationCheck };