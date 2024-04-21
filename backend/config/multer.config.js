const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Directory where uploaded files will be stored
const uploadDir = path.join(__dirname, '../uploads');

// Ensure the upload directory exists
fs.existsSync(uploadDir) || fs.mkdirSync(uploadDir, { recursive: true });

// Define storage strategy
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

// Setup Multer with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
