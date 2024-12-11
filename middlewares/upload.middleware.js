const generalHelper = require('../helpers/general.helper');
const multer = require('multer');
const path = require('path');

async function customImagename(req, file, cb) {
    const newFilename = await generalHelper.generateUuid();
    const extension = path.extname(file.originalname);
    cb(null, `${newFilename}${extension}`);
}

const storageImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/upload');
    },
    filename: customImagename
});

const uploadImage = multer({ storage: storageImage });

module.exports = { uploadImage };