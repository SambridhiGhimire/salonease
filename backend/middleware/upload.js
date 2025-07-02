const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

const uploadPath = process.env.UPLOAD_PATH || path.join(__dirname, '../uploads');

// File filter for images only
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

// Storage for user avatars
const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = path.join(uploadPath, 'users');
        fs.ensureDirSync(dest);
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, `avatar_${req.user ? req.user.id : 'guest'}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Storage for salon images
const salonStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = path.join(uploadPath, 'salons');
        fs.ensureDirSync(dest);
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, `salon_${req.params.salonId || 'unknown'}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Storage for generic images
const genericStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = path.join(uploadPath, 'generic');
        fs.ensureDirSync(dest);
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, `image_${Date.now()}_${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`);
    }
});

exports.uploadAvatar = multer({
    storage: avatarStorage,
    fileFilter: imageFilter,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 }
});

exports.uploadSalonImage = multer({
    storage: salonStorage,
    fileFilter: imageFilter,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 }
});

exports.uploadGenericImage = multer({
    storage: genericStorage,
    fileFilter: imageFilter,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 }
}); 