const path = require('path');
const fs = require('fs');
const {
  getAllFiles,
  getFileById,
  createFileMeta,
  saveFileMeta,
  renameFile,
  deleteFile,
  updateFileMeta,
  incrementDownloadCount,
  getFilePath,
  UPLOADS_DIR,
} = require('../services/fileService');
const { getMimeType } = require('../utils/fileUtils');
const archiver = require('archiver');

/**
 * GET /api/files
 * Lists all files with optional filtering, sorting, and pagination
 */
async function listFiles(req, res, next) {
  try {
    let files = getAllFiles();

    // Filter by category
    if (req.query.category) {
      files = files.filter(f => f.category === req.query.category);
    }

    // Filter by search query
    if (req.query.search) {
      const query = req.query.search.toLowerCase();
      files = files.filter(f =>
        f.originalName.toLowerCase().includes(query) ||
        (f.tags && f.tags.some(t => t.toLowerCase().includes(query)))
      );
    }

    // Filter favorites
    if (req.query.favorites === 'true') {
      files = files.filter(f => f.isFavorite);
    }

    // Sorting
    const sortBy = req.query.sortBy || 'date';
    const sortOrder = req.query.sortOrder || 'desc';

    files.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'name': cmp = a.originalName.localeCompare(b.originalName); break;
        case 'size': cmp = a.size - b.size; break;
        case 'date': cmp = new Date(a.uploadDate) - new Date(b.uploadDate); break;
        default: cmp = new Date(a.uploadDate) - new Date(b.uploadDate);
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const total = files.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedFiles = files.slice((page - 1) * limit, page * limit);

    res.json({
      success: true,
      data: paginatedFiles,
      pagination: { page, limit, total, totalPages },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/file/:id
 * Gets a single file's metadata
 */
async function getFile(req, res, next) {
  try {
    const meta = getFileById(req.params.id);
    if (!meta) {
      return res.status(404).json({ success: false, error: 'File not found.' });
    }
    res.json({ success: true, data: meta });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/upload
 * Handles single or multiple file uploads
 */
async function uploadFiles(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded.' });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      // Create metadata — match the UUID from the stored filename
      const storedName = file.filename;
      const id = storedName.split('.')[0]; // UUID is before the first dot

      const meta = {
        id,
        originalName: file.originalname,
        storedName,
        extension: storedName.split('.').pop(),
        mimeType: file.mimetype,
        size: file.size,
        category: require('../utils/fileUtils').getCategory(file.originalname),
        uploadDate: new Date().toISOString(),
        isPreviewable: require('../utils/fileUtils').isPreviewable(file.originalname),
        isFavorite: false,
        tags: [],
        notes: '',
        downloadCount: 0,
      };

      saveFileMeta(meta);
      uploadedFiles.push(meta);

      // Emit socket event if io is available
      if (req.io) {
        req.io.emit('file:uploaded', meta);
      }
    }

    res.status(201).json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully.`,
      data: uploadedFiles,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/file/:id
 * Deletes a file and its metadata
 */
async function deleteFileHandler(req, res, next) {
  try {
    const meta = getFileById(req.params.id);
    if (!meta) {
      return res.status(404).json({ success: false, error: 'File not found.' });
    }

    const deleted = deleteFile(req.params.id);
    if (!deleted) {
      return res.status(500).json({ success: false, error: 'Failed to delete file.' });
    }

    if (req.io) {
      req.io.emit('file:deleted', { id: req.params.id, name: meta.originalName });
    }

    res.json({ success: true, message: `File "${meta.originalName}" deleted successfully.` });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/rename/:id
 * Renames a file
 */
async function renameFileHandler(req, res, next) {
  try {
    const { newName } = req.body;
    if (!newName || !newName.trim()) {
      return res.status(400).json({ success: false, error: 'New name is required.' });
    }

    const updatedMeta = renameFile(req.params.id, newName.trim());
    if (!updatedMeta) {
      return res.status(404).json({ success: false, error: 'File not found.' });
    }

    if (req.io) {
      req.io.emit('file:renamed', updatedMeta);
    }

    res.json({ success: true, message: 'File renamed successfully.', data: updatedMeta });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/download/:id
 * Downloads a file
 */
async function downloadFile(req, res, next) {
  try {
    const meta = getFileById(req.params.id);
    if (!meta) {
      return res.status(404).json({ success: false, error: 'File not found.' });
    }

    const filePath = getFilePath(meta.storedName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File data not found.' });
    }

    incrementDownloadCount(req.params.id);

    if (req.io) {
      req.io.emit('download:start', { id: meta.id, name: meta.originalName });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(meta.originalName)}"`);
    res.setHeader('Content-Type', meta.mimeType || 'application/octet-stream');
    res.setHeader('Content-Length', meta.size);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('end', () => {
      if (req.io) {
        req.io.emit('download:complete', { id: meta.id, name: meta.originalName });
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/preview/:id
 * Streams a file for in-browser preview
 */
async function previewFile(req, res, next) {
  try {
    const meta = getFileById(req.params.id);
    if (!meta) {
      return res.status(404).json({ success: false, error: 'File not found.' });
    }

    const filePath = getFilePath(meta.storedName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File data not found.' });
    }

    const stat = fs.statSync(filePath);
    const mimeType = meta.mimeType || getMimeType(meta.originalName);

    // Support range requests for audio/video
    const range = req.headers.range;
    if (range && (mimeType.startsWith('video/') || mimeType.startsWith('audio/'))) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mimeType,
      });

      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Accept-Ranges', 'bytes');
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/file/:id/meta
 * Updates file metadata (favorites, tags, notes)
 */
async function updateFileMetaHandler(req, res, next) {
  try {
    const allowed = ['isFavorite', 'tags', 'notes'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedMeta = updateFileMeta(req.params.id, updates);
    if (!updatedMeta) {
      return res.status(404).json({ success: false, error: 'File not found.' });
    }

    res.json({ success: true, data: updatedMeta });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/bulk-delete
 * Deletes multiple files at once
 */
async function bulkDelete(req, res, next) {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'No file IDs provided.' });
    }

    const results = { success: [], failed: [] };
    for (const id of ids) {
      const deleted = deleteFile(id);
      if (deleted) {
        results.success.push(id);
        if (req.io) req.io.emit('file:deleted', { id });
      } else {
        results.failed.push(id);
      }
    }

    res.json({
      success: true,
      message: `Deleted ${results.success.length} file(s).`,
      data: results,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/bulk-download
 * Downloads multiple files as a zip
 */
async function bulkDownload(req, res, next) {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'No file IDs provided.' });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="localshare-files-${Date.now()}.zip"`);

    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.on('error', (err) => next(err));
    archive.pipe(res);

    for (const id of ids) {
      const meta = getFileById(id);
      if (!meta) continue;
      const filePath = getFilePath(meta.storedName);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: meta.originalName });
      }
    }

    await archive.finalize();
  } catch (err) {
    next(err);
  }
}

module.exports = {
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
};
