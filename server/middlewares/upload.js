const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { sanitizeFilename, getExtension } = require('../utils/fileUtils');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

/**
 * Multer storage configuration
 * Files are stored with a UUID-based name to avoid conflicts
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = getExtension(file.originalname);
    const id = uuidv4();
    // Store as: <uuid>.<ext>  — actual original name is in metadata
    req.fileIds = req.fileIds || {};
    req.fileIds[file.originalname] = id;
    cb(null, `${id}.${ext}`);
  },
});

/**
 * File filter — validates MIME types
 */
const fileFilter = (req, file, cb) => {
  // Block files with dangerous extensions
  const dangerousExts = ['exe', 'bat', 'cmd', 'com', 'msi', 'vbs', 'js', 'scr', 'ps1', 'sh'];
  const ext = getExtension(file.originalname);

  // Note: we allow .js files for sharing code, but not executable ones
  // For safety, just block truly dangerous ones
  const blocked = ['exe', 'bat', 'cmd', 'com', 'msi', 'scr', 'pif', 'vbs'];
  if (blocked.includes(ext)) {
    return cb(new Error(`File type .${ext} is not allowed for security reasons.`), false);
  }

  cb(null, true);
};

/**
 * Multer upload middleware
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024, // 500MB default
    files: 20, // Max 20 files per request
  },
});

module.exports = upload;
