const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { getExtension, getCategory, sanitizeFilename, getMimeType, isPreviewable } = require('../utils/fileUtils');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

/**
 * Ensures the uploads directory exists
 */
function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

/**
 * Reads all file metadata from uploads directory
 */
function getAllFiles() {
  ensureUploadsDir();
  const files = [];

  try {
    const items = fs.readdirSync(UPLOADS_DIR);

    for (const item of items) {
      // Only read .meta.json files
      if (!item.endsWith('.meta.json')) continue;

      const metaPath = path.join(UPLOADS_DIR, item);
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        // Verify the actual file still exists
        const filePath = path.join(UPLOADS_DIR, meta.storedName);
        if (fs.existsSync(filePath)) {
          files.push(meta);
        }
      } catch (err) {
        // Skip corrupted meta files
        console.warn(`Skipping corrupted meta file: ${item}`);
      }
    }
  } catch (err) {
    console.error('Error reading uploads directory:', err);
  }

  // Sort by uploadDate descending (newest first)
  return files.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
}

/**
 * Gets single file metadata by ID
 */
function getFileById(id) {
  const metaPath = path.join(UPLOADS_DIR, `${id}.meta.json`);
  if (!fs.existsSync(metaPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Creates metadata for an uploaded file
 */
function createFileMeta(file, extraData = {}) {
  const id = uuidv4();
  const ext = getExtension(file.originalname);
  const safeName = sanitizeFilename(file.originalname);
  const storedName = `${id}.${ext}`;

  const meta = {
    id,
    originalName: safeName,
    storedName,
    extension: ext,
    mimeType: getMimeType(file.originalname),
    size: file.size,
    category: getCategory(file.originalname),
    uploadDate: new Date().toISOString(),
    isPreviewable: isPreviewable(file.originalname),
    isFavorite: false,
    tags: [],
    notes: '',
    downloadCount: 0,
    ...extraData,
  };

  return meta;
}

/**
 * Saves metadata to a .meta.json file
 */
function saveFileMeta(meta) {
  const metaPath = path.join(UPLOADS_DIR, `${meta.id}.meta.json`);
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
}

/**
 * Renames a file
 */
function renameFile(id, newName) {
  const meta = getFileById(id);
  if (!meta) return null;

  const safeName = sanitizeFilename(newName);
  const newExt = getExtension(safeName) || meta.extension;
  const oldFilePath = path.join(UPLOADS_DIR, meta.storedName);

  // Update stored name if extension changed
  const newStoredName = `${id}.${newExt}`;
  const newFilePath = path.join(UPLOADS_DIR, newStoredName);

  if (oldFilePath !== newFilePath && fs.existsSync(oldFilePath)) {
    fs.renameSync(oldFilePath, newFilePath);
  }

  const updatedMeta = {
    ...meta,
    originalName: safeName,
    storedName: newStoredName,
    extension: newExt,
    mimeType: getMimeType(safeName),
    category: getCategory(safeName),
    lastModified: new Date().toISOString(),
  };

  saveFileMeta(updatedMeta);
  return updatedMeta;
}

/**
 * Deletes a file and its metadata
 */
function deleteFile(id) {
  const meta = getFileById(id);
  if (!meta) return false;

  const filePath = path.join(UPLOADS_DIR, meta.storedName);
  const metaPath = path.join(UPLOADS_DIR, `${id}.meta.json`);

  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  if (fs.existsSync(metaPath)) fs.unlinkSync(metaPath);

  return true;
}

/**
 * Updates file metadata (favorites, tags, notes)
 */
function updateFileMeta(id, updates) {
  const meta = getFileById(id);
  if (!meta) return null;

  const updatedMeta = { ...meta, ...updates, lastModified: new Date().toISOString() };
  saveFileMeta(updatedMeta);
  return updatedMeta;
}

/**
 * Increments download count for a file
 */
function incrementDownloadCount(id) {
  const meta = getFileById(id);
  if (!meta) return;
  saveFileMeta({ ...meta, downloadCount: (meta.downloadCount || 0) + 1 });
}

/**
 * Gets the absolute path to a file
 */
function getFilePath(storedName) {
  // Prevent path traversal
  const resolved = path.resolve(UPLOADS_DIR, storedName);
  if (!resolved.startsWith(UPLOADS_DIR)) {
    throw new Error('Path traversal detected');
  }
  return resolved;
}

module.exports = {
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
};
