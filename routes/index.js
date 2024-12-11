const express = require('express');
const router = express.Router();

const membershipController = require("../controllers/Membership");
const informationController = require("../controllers/Information");
const transactionController = require("../controllers/Transaction");

const authMiddleware = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

router.get('/', function(req, res) {
    res.status(200).json({
        status: 'info',
        message: 'Assignment API Contract SIMS PPOB!',
        data: null
    });
});

// Module Membership
router.post('/registration', membershipController.postRegistration);
router.post('/login', membershipController.postLogin);
router.get('/profile', authMiddleware.authencationCheck, membershipController.getProfile);
router.put('/profile/update', authMiddleware.authencationCheck, membershipController.putProfileUpdate);
router.put('/profile/image', authMiddleware.authencationCheck, uploadMiddleware.uploadImage.fields([{ name: 'file' }]), membershipController.putProfileImage);

// Module Information
router.get('/banner', informationController.getBanner);
router.get('/services', informationController.getServices);

// Module Transaction
router.get('/balance', authMiddleware.authencationCheck, transactionController.getBalance);
router.post('/topup', transactionController.postTopup);
router.post('/transaction', transactionController.postTransaction);
router.get('/transaction/history', transactionController.getTransactionHistory);

module.exports = router;