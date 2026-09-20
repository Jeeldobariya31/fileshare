const express = require('express');
const router  = express.Router();
const upload  = require('../middlewares/upload');
const { hostOnly } = require('../middlewares/hostOnly');
const {
  listFiles,
  getFile,
  uploadFiles,
  deleteFileHandler,
  renameFileHandler,
  downloadFile,
  previewFile,
  updateFileMetaHandler,
  bulkDelete,
  bulkDownload,
} = require('../controllers/fileController');

// Inject Socket.io instance into req
router.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

// ── Public (any device) ────────────────────────────────────────────
router.get('/files',             listFiles);           // browse
router.get('/file/:id',          getFile);             // metadata
router.get('/download/:id',      downloadFile);        // download
router.get('/preview/:id',       previewFile);         // preview
router.post('/upload',           upload.array('files', 20), uploadFiles); // upload
router.post('/bulk-download',    bulkDownload);        // zip download

// ── Host-only (server machine only) ───────────────────────────────
router.delete('/file/:id',       hostOnly, deleteFileHandler);  // delete
router.put('/rename/:id',        hostOnly, renameFileHandler);  // rename
router.put('/file/:id/meta',     hostOnly, updateFileMetaHandler); // favorites/tags
router.post('/bulk-delete',      hostOnly, bulkDelete);         // bulk delete

module.exports = router;
