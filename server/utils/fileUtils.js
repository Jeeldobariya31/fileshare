const path = require('path');
const mime = require('mime-types');

/**
 * Returns the file extension (lowercase, no dot)
 */
function getExtension(filename) {
  return path.extname(filename).slice(1).toLowerCase();
}

/**
 * Returns file category based on extension
 */
function getCategory(filename) {
  const ext = getExtension(filename);
  const categories = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'ico'],
    video: ['mp4', 'webm', 'ogg', 'avi', 'mkv', 'mov'],
    audio: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'],
    pdf: ['pdf'],
    document: ['doc', 'docx', 'odt', 'rtf'],
    spreadsheet: ['xls', 'xlsx', 'csv', 'ods'],
    presentation: ['ppt', 'pptx', 'odp'],
    archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
    code: ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'cs', 'php', 'rb', 'go', 'rs', 'html', 'css', 'json', 'xml', 'yaml', 'yml', 'sh', 'bat', 'sql'],
    text: ['txt', 'md', 'log', 'cfg', 'ini'],
  };

  for (const [category, extensions] of Object.entries(categories)) {
    if (extensions.includes(ext)) return category;
  }
  return 'other';
}

/**
 * Sanitizes filename to prevent path traversal attacks.
 * Removes directory separators, leading dots, null bytes.
 */
function sanitizeFilename(filename) {
  return filename
    .replace(/[/\\?%*:|"<>]/g, '-') // Replace special chars
    .replace(/\.\./g, '')            // Remove path traversal
    .replace(/^\.+/, '')             // Remove leading dots
    .replace(/\0/g, '')              // Remove null bytes
    .trim() || 'unnamed-file';
}

/**
 * Formats bytes into human-readable string
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Gets MIME type for a filename
 */
function getMimeType(filename) {
  return mime.lookup(filename) || 'application/octet-stream';
}

/**
 * Checks if a file is previewable in the browser
 */
function isPreviewable(filename) {
  const ext = getExtension(filename);
  const previewable = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp',
    'mp4', 'webm', 'ogg', 'mp3', 'wav', 'flac', 'aac',
    'pdf', 'txt', 'md', 'json', 'xml', 'html', 'css', 'js',
    'py', 'ts', 'jsx', 'tsx', 'log', 'csv'];
  return previewable.includes(ext);
}

module.exports = {
  getExtension,
  getCategory,
  sanitizeFilename,
  formatBytes,
  getMimeType,
  isPreviewable,
};
