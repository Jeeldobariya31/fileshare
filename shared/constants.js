/**
 * Shared constants used by both client and server
 */

const SHARED_CONSTANTS = {
  // Server defaults
  SERVER_PORT: 5000,
  CLIENT_PORT: 5173,

  // File limits
  MAX_FILE_SIZE_MB: 500,
  MAX_FILE_SIZE_BYTES: 500 * 1024 * 1024, // 500MB

  // Allowed MIME types
  ALLOWED_MIME_TYPES: [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'image/bmp', 'image/tiff', 'image/ico',
    // Videos
    'video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mkv',
    'video/quicktime', 'video/x-msvideo',
    // Audio
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac',
    'audio/mp4', 'audio/webm',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Text
    'text/plain', 'text/html', 'text/css', 'text/javascript', 'text/csv',
    'text/markdown', 'text/xml',
    // Code
    'application/json', 'application/xml', 'application/javascript',
    // Archives
    'application/zip', 'application/x-zip-compressed',
    'application/x-rar-compressed', 'application/x-7z-compressed',
    'application/x-tar', 'application/gzip',
    // Others
    'application/octet-stream',
  ],

  // File categories
  FILE_CATEGORIES: {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'ico'],
    video: ['mp4', 'webm', 'ogg', 'avi', 'mkv', 'mov'],
    audio: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'],
    pdf: ['pdf'],
    document: ['doc', 'docx', 'odt', 'rtf'],
    spreadsheet: ['xls', 'xlsx', 'csv', 'ods'],
    presentation: ['ppt', 'pptx', 'odp'],
    archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
    code: ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'cs', 'php', 'rb', 'go', 'rs', 'html', 'css', 'json', 'xml', 'yaml', 'yml', 'sh', 'bat', 'sql'],
    text: ['txt', 'md', 'log', 'cfg', 'ini', 'env'],
  },

  // Pagination
  DEFAULT_PAGE_SIZE: 50,

  // App info
  APP_NAME: 'LocalShare',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'LAN File Sharing System',
};

// CommonJS export (works in Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SHARED_CONSTANTS;
}

// ES Module export (works in browser/Vite)
if (typeof window !== 'undefined') {
  window.SHARED_CONSTANTS = SHARED_CONSTANTS;
}
