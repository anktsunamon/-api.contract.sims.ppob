const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const customConfig = require('../custom-config');

const generalHelper = require('../helpers/general.helper');

const userModel = require('../models/user.model');
const loginModel = require('../models/login.model');
const balanceModel = require('../models/balance.model');

const postRegistration = async(req, res) => {
    try {
        const email = req.body.email;
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const password_original = req.body.password;

        const emailToValidate = await generalHelper.validateEmail(email);

        if(!emailToValidate) {
            return res.status(400).json({
                status: 102,
                message: "Parameter email tidak sesuai format",
                data: null
            });
        }

        if(password_original.length < 8) {
            return res.status(400).json({
                status: 102,
                message: "Password minimal 8 karakter",
                data: null
            });
        }

        const checkUseremailData = {
            user_email: email
        }

        const checkUseremail = await userModel.checkUseremail(checkUseremailData);
        if(checkUseremail) {
            return res.status(400).json({
                status: 102,
                message: "Email sudah terdaftar",
                data: null
            });
        }

        const password = await generalHelper.hash(password_original, customConfig.secret);

        let user_uuid = await generalHelper.generateUuid();
        let checkUserUuidData = {
            uuid: user_uuid
        }
        let checkUserUuid = await userModel.checkUserUuid(checkUserUuidData);
        while (checkUserUuid) {
            user_uuid = await generalHelper.generateUuid();
            checkUserUuidData = {
                uuid: user_uuid
            }
            checkUserUuid = await userModel.checkUserUuid(checkUserUuidData);
        }

        let login_uuid = await generalHelper.generateUuid();
        let checkLoginUuidData = {
            uuid: login_uuid
        }
        let checkLoginUuid = await loginModel.checkLoginUuid(checkLoginUuidData);
        while (checkLoginUuid) {
            login_uuid = await generalHelper.generateUuid();
            checkLoginUuidData = {
                uuid: login_uuid
            }
            checkLoginUuid = await loginModel.checkLoginUuid(checkLoginUuidData);
        }

        let balance_uuid = await generalHelper.generateUuid();
        let checkBalanceUuidData = {
            uuid: balance_uuid
        }
        let checkBalanceUuid = await balanceModel.checkBalanceUuid(checkBalanceUuidData);
        while (checkBalanceUuid) {
            balance_uuid = await generalHelper.generateUuid();
            checkBalanceUuidData = {
                uuid: balance_uuid
            }
            checkBalanceUuid = await balanceModel.checkBalanceUuid(checkBalanceUuidDataData);
        }

        const postUserData = {
            uuid: user_uuid,
            user_first_name: first_name,
            user_last_name: last_name,
            user_email: email
        }

        const postUser = await userModel.postUser(postUserData);
        if(!postUser) {
            return res.status(500).json({
                status: 'error',
                message: postUser.message,
                data: postUser.stack
            });
        }

        const postLoginData = {
            uuid: login_uuid,
            login_name: email,
            login_password: password,
            user_uuid: user_uuid
        }
        
        const postLogin = await loginModel.postLogin(postLoginData);
        if(!postLogin) {
            return res.status(500).json({
                status: 'error',
                message: postLogin.message,
                data: postLogin.stack
            });
        }

        const postBalanceData = {
            uuid: balance_uuid,
            balance: 0,
            user_uuid: user_uuid
        }
        
        const postBalance = await balanceModel.postBalance(postBalanceData);
        if(!postBalance) {
            return res.status(500).json({
                status: 'error',
                message: postBalance.message,
                data: postBalance.stack
            });
        }

        return res.status(200).json({
            status: 0,
            message: "Registrasi berhasil silahkan login",
            data: null
        });
    } catch (error) {
        return res.status(500).json({
            status: 1,
            message: error.message,
            data: error.stack
        });
    }
}

const postLogin = async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const emailToValidate = await generalHelper.validateEmail(email);

        if(!emailToValidate) {
            return res.status(400).json({
                status: 102,
                message: "Parameter email tidak sesuai format",
                data: null
            });
        }

        if(password.length < 8) {
            return res.status(400).json({
                status: 102,
                message: "Password minimal 8 karakter",
                data: null
            });
        }

        const getLoginByNameData = {
            login_name: email
        }

        const getLoginByName = await loginModel.getLoginByName(getLoginByNameData);

        if(!getLoginByName) {
            return res.status(401).json({
                status: 103,
                message: "Username atau password salah",
                data: null
            });
        }

        const password_match = await generalHelper.compare(password, getLoginByName.login_password, customConfig.secret);

        if(!password_match) {
            return res.status(401).json({
                status: 103,
                message: "Username atau password salah",
                data: null
            });
        }

        const tokenData = {
            'email': email
        }

        const token = jwt.sign({ data: tokenData }, customConfig.secret, { expiresIn: '12h' });

        res.setHeader("Authorization", `Bearer ${token}`);

        const data = {
            token: token
        }

        return res.status(200).json({
            status: 0,
            message: 'Login Sukses',
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message,
            data: error.stack
        });
    }
}

const getProfile = async(req, res) => {
    try {
        let email;

        const authHeader = req.headers['authorization'];

        if (authHeader) {
            const bearerContent = authHeader.split(' ')[1];
    
            jwt.verify(bearerContent, customConfig.secret, async (err, payload) => {
                if (err) {
                    return res.status(401).json({
                        status: 108,
                        message: 'Token tidak valid atau kadaluwarsa',
                        data: null
                    });
                } else {
                    email = payload.data.email;
                }
            });
        } else {
            return res.status(401).json({
                status: 108,
                message: 'Token tidak valid atau kadaluwarsa',
                data: null
            });
        }

        const getUserByEmailData = {
            user_email: email
        }

        const getUserByEmail = await userModel.getUserByEmail(getUserByEmailData);

        const data = {
            email: getUserByEmail.user_email,
            first_name: getUserByEmail.user_first_name,
            last_name: getUserByEmail.user_last_name,
            profile_image: getUserByEmail.user_profile_image
        }

        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message,
            data: error.stack
        });
    }
}

const putProfileUpdate = async(req, res) => {
    try {
        let email;

        const authHeader = req.headers['authorization'];

        if (authHeader) {
            const bearerContent = authHeader.split(' ')[1];
    
            jwt.verify(bearerContent, customConfig.secret, async (err, payload) => {
                if (err) {
                    return res.status(401).json({
                        status: 108,
                        message: 'Token tidak valid atau kadaluwarsa',
                        data: null
                    });
                } else {
                    email = payload.data.email;
                }
            });
        } else {
            return res.status(401).json({
                status: 108,
                message: 'Token tidak valid atau kadaluwarsa',
                data: null
            });
        }

        const first_name = req.body.first_name;
        const last_name = req.body.last_name;

        const getUserByEmailData = {
            user_email: email
        }

        const getUserByEmail = await userModel.getUserByEmail(getUserByEmailData);

        const putUserNameData = {
            uuid: getUserByEmail.uuid,
            user_first_name: first_name,
            user_last_name: last_name
        }

        const putUserName = await userModel.putUserName(putUserNameData);
        if(!putUserName) {
            return res.status(500).json({
                status: 'error',
                message: putUserName.message,
                data: putUserName.stack
            });
        }

        const data = {
            email: getUserByEmail.user_email,
            first_name: first_name,
            last_name: last_name,
            profile_image: getUserByEmail.user_profile_image
        }

        return res.status(200).json({
            status: 0,
            message: 'Update Pofile berhasil',
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message,
            data: error.stack
        });
    }
}

const putProfileImage = async(req, res) => {
    try {
        let email;

        const authHeader = req.headers['authorization'];

        if (authHeader) {
            const bearerContent = authHeader.split(' ')[1];
    
            jwt.verify(bearerContent, customConfig.secret, async (err, payload) => {
                if (err) {
                    return res.status(401).json({
                        status: 108,
                        message: 'Token tidak valid atau kadaluwarsa',
                        data: null
                    });
                } else {
                    email = payload.data.email;
                }
            });
        } else {
            return res.status(401).json({
                status: 108,
                message: 'Token tidak valid atau kadaluwarsa',
                data: null
            });
        }

        sharp.cache({ files: 0 });

        const file_file = req.files.file;
        const file_sourceFile = path.join(__dirname, '../' + file_file[0].destination, file_file[0].filename);

        const extension = path.extname(file_file[0].originalname);
        if(extension.substring(1) !== 'jpeg' && extension.substring(1) !== 'png') {
            await fs.promises.unlink(file_sourceFile);

            return res.status(400).json({
                status: 102,
                message: "Format Image tidak sesuai",
                data: null
            });
        }

        const getUserByEmailData = {
            user_email: email
        }

        const getUserByEmail = await userModel.getUserByEmail(getUserByEmailData);

        if(getUserByEmail.user_profile_image !== null) {
            await fs.promises.unlink(path.join(__dirname, '../assets/profile') + getUserByEmail.user_profile_image.substring(customConfig.origin.length));
        }

        const assetsProfileDir = path.join(__dirname, '../assets/profile', getUserByEmail.uuid);
        if (!fs.existsSync(assetsProfileDir)) {
            fs.mkdirSync(assetsProfileDir);
        }

        const file_destinationFile = path.join(assetsProfileDir, file_file[0].filename);

        await sharp(file_sourceFile)
            .toFile(file_destinationFile);
        
        const file = customConfig.origin + '/' + getUserByEmail.uuid + '/' + file_file[0].filename;

        await fs.promises.unlink(file_sourceFile);

        const putUserImageData = {
            uuid: getUserByEmail.uuid,
            user_profile_image: file
        }

        const putUserImage = await userModel.putUserImage(putUserImageData);
        if(!putUserImage) {
            return res.status(500).json({
                status: 'error',
                message: putUserImage.message,
                data: putUserImage.stack
            });
        }

        const data = {
            email: getUserByEmail.user_email,
            first_name: getUserByEmail.user_first_name,
            last_name: getUserByEmail.user_last_name,
            profile_image: file
        }

        return res.status(200).json({
            status: 0,
            message: 'Update Profile Image berhasil',
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message,
            data: error.stack
        });
    }
}

module.exports = { postRegistration, postLogin, getProfile, putProfileUpdate, putProfileImage };