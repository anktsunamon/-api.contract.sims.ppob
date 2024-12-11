const crypto = require('crypto');
const uuid = require("uuid");

async function hash(password, salt) {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash;
}

async function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
}

async function generateUuid() {
    const resultUuid = uuid.v4()
    return resultUuid;
}

async function compare(password, verifyHash, salt) {
    const newHash = await hash(password, salt);
    return verifyHash === newHash;
}

async function numberCheck(number) {
    var regex = /^\d+$/;
    return regex.test(number)
}

async function generateInvoice() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');

    const transaction_invoice_number = `INV${day}${month}${year}${hour}${minute}`;
    
    return transaction_invoice_number;
}

module.exports = { hash, validateEmail, generateUuid, compare, numberCheck, generateInvoice }