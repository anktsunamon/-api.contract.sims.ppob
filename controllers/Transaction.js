const jwt = require('jsonwebtoken');

const customConfig = require('../custom-config');

const generalHelper = require('../helpers/general.helper');

const userModel = require("../models/user.model");
const balanceModel = require("../models/balance.model");
const transactionModel = require("../models/transaction.model");
const serviceModel = require("../models/service.model");

const getBalance = async(req, res) => {
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

        const getBalanceByUseruuidData = {
            user_uuid: getUserByEmail.uuid
        }

        const getBalanceByUseruuid = await balanceModel.getBalanceByUseruuid(getBalanceByUseruuidData);

        const data = {
            balance: getBalanceByUseruuid.balance
        }

        return res.status(200).json({
            status: 0,
            message: 'Get Balance Berhasil',
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

const postTopup = async(req, res) => {
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

        const top_up_amount = req.body.top_up_amount;

        const numberCheck = await generalHelper.numberCheck(top_up_amount);

        if(!numberCheck) {
            return res.status(400).json({
                status: 102,
                message: "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
                data: null
            });
        }

        const getUserByEmailData = {
            user_email: email
        }

        const getUserByEmail = await userModel.getUserByEmail(getUserByEmailData);

        const getBalanceByUseruuidData = {
            user_uuid: getUserByEmail.uuid
        }

        const getBalanceByUseruuid = await balanceModel.getBalanceByUseruuid(getBalanceByUseruuidData);

        const putBalanceData = {
            uuid: getBalanceByUseruuid.uuid,
            balance: getBalanceByUseruuid.balance + parseInt(top_up_amount)
        }

        const putBalance = await balanceModel.putBalance(putBalanceData);
        if(!putBalance) {
            return res.status(500).json({
                status: 'error',
                message: putBalance.message,
                data: putBalance.stack
            });
        }

        let transaction_uuid = await generalHelper.generateUuid();
        let checkTransactionUuidData = {
            uuid: transaction_uuid
        }
        let checkTransactionUuid = await transactionModel.checkTransactionUuid(checkTransactionUuidData);
        while (checkTransactionUuid) {
            transaction_uuid = await generalHelper.generateUuid();
            checkTransactionUuidData = {
                uuid: transaction_uuid
            }
            checkTransactionUuid = await transactionModel.checkTransactionUuid(checkTransactionUuidData);
        }

        const transaction_invoice_number = await generalHelper.generateInvoice();
        const created_on = new Date();

        const postTransactionData = {
            uuid: transaction_uuid,
            transaction_invoice_number: transaction_invoice_number,
            transaction_type: 'TOPUP',
            transaction_description: 'Top up balance',
            transaction_total_amount: parseInt(top_up_amount),
            user_uuid: getUserByEmail.uuid,
            created_on: created_on
        }

        const postTransaction = await transactionModel.postTransaction(postTransactionData);
        if(!postTransaction) {
            return res.status(500).json({
                status: 'error',
                message: postTransaction.message,
                data: postTransaction.stack
            });
        }

        const data = {
            balance: getBalanceByUseruuid.balance + parseInt(top_up_amount)
        }

        return res.status(200).json({
            status: 0,
            message: 'Top Up Balance berhasil',
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

const postTransaction = async(req, res) => {
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

        const service_code = req.body.service_code;

        const getUserByEmailData = {
            user_email: email
        }

        const getUserByEmail = await userModel.getUserByEmail(getUserByEmailData);

        const getBalanceByUseruuidData = {
            user_uuid: getUserByEmail.uuid
        }

        const getBalanceByUseruuid = await balanceModel.getBalanceByUseruuid(getBalanceByUseruuidData);

        const getServiceByServicecodeData = {
            service_code: service_code
        }

        const getServiceByServicecode = await serviceModel.getServiceByServicecode(getServiceByServicecodeData);
        if(!getServiceByServicecode) {
            return res.status(400).json({
                status: 102,
                message: "Service ataus Layanan tidak ditemukan",
                data: null
            });
        }

        if(getBalanceByUseruuid.balance < getServiceByServicecode.service_tariff) {
            return res.status(400).json({
                status: 102,
                message: "Maaf, Saldo anda tidak mencukupi untuk melakukan transaksi ini",
                data: null
            });
        }

        const putBalanceData = {
            uuid: getBalanceByUseruuid.uuid,
            balance: getBalanceByUseruuid.balance - parseInt(getServiceByServicecode.service_tariff)
        }

        const putBalance = await balanceModel.putBalance(putBalanceData);
        if(!putBalance) {
            return res.status(500).json({
                status: 'error',
                message: putBalance.message,
                data: putBalance.stack
            });
        }

        let transaction_uuid = await generalHelper.generateUuid();
        let checkTransactionUuidData = {
            uuid: transaction_uuid
        }
        let checkTransactionUuid = await transactionModel.checkTransactionUuid(checkTransactionUuidData);
        while (checkTransactionUuid) {
            transaction_uuid = await generalHelper.generateUuid();
            checkTransactionUuidData = {
                uuid: transaction_uuid
            }
            checkTransactionUuid = await transactionModel.checkTransactionUuid(checkTransactionUuidData);
        }

        const transaction_invoice_number = await generalHelper.generateInvoice();
        const created_on = new Date();

        const postTransactionData = {
            uuid: transaction_uuid,
            transaction_invoice_number: transaction_invoice_number,
            transaction_type: 'PAYMENT',
            transaction_description: getServiceByServicecode.service_name,
            transaction_total_amount: parseInt(getServiceByServicecode.service_tariff),
            user_uuid: getUserByEmail.uuid,
            created_on: created_on
        }

        const postTransaction = await transactionModel.postTransaction(postTransactionData);
        if(!postTransaction) {
            return res.status(500).json({
                status: 'error',
                message: postTransaction.message,
                data: postTransaction.stack
            });
        }

        const data = {
            invoice_number: transaction_invoice_number,
            service_code: getServiceByServicecode.service_code,
            service_name: getServiceByServicecode.service_name,
            transaction_type: "PAYMENT",
            total_amount: getServiceByServicecode.service_tariff,
            created_on: created_on
        }

        return res.status(200).json({
            status: 0,
            message: 'Transaksi berhasil',
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

const getTransactionHistory = async(req, res) => {
    try {
        let email;

        let offset = 0;
        let limit = 0;

        const transactionData = [];

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

        if(req.query.offset) {
            offset = req.query.offset;
        }

        if(req.query.limit) {
            limit = req.query.limit;
        }

        const getUserByEmailData = {
            user_email: email
        }

        const getUserByEmail = await userModel.getUserByEmail(getUserByEmailData);

        const getTransactionByUseruuidData = {
            user_uuid: getUserByEmail.uuid,
            limit: limit,
            offset: offset
        }

        const getTransactionByUseruuid = await transactionModel.getTransactionByUseruuid(getTransactionByUseruuidData);

        console.log(getTransactionByUseruuidData);

        if (Array.isArray(getTransactionByUseruuid) && getTransactionByUseruuid.length !== 0) {
            for (const transaction of getTransactionByUseruuid) {
                const transactionItem = {
                    invoice_number: transaction.transaction_invoice_number,
                    transaction_type: transaction.transaction_type,
                    description: transaction.transaction_description,
                    total_amount: transaction.transaction_total_amount,
                    created_on: transaction.created_on,
                }

                transactionData.push(transactionItem);
            }
        }

        const data = {
            offset: offset,
            limit: limit,
            records: transactionData
        }

        return res.status(200).json({
            status: 0,
            message: 'Get History Berhasil',
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

module.exports = { getBalance, postTopup, postTransaction, getTransactionHistory };