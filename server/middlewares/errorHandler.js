/**
 * Global error handler middleware
 * Must be registered as the LAST middleware in Express
 */
function errorHandler(err, req, res, next) {
  // Handle Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: 'File too large. Maximum upload size is 500MB.',
      code: 'FILE_TOO_LARGE',
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      error: 'Too many files. Maximum 20 files per upload.',
      code: 'TOO_MANY_FILES',
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'Unexpected file field.',
      code: 'UNEXPECTED_FILE',
    });
  }

  // Path traversal
  if (err.message && err.message.includes('Path traversal')) {
    return res.status(403).json({
      success: false,
      error: 'Access denied.',
      code: 'FORBIDDEN',
    });
  }

  // File type not allowed
  if (err.message && err.message.includes('not allowed')) {
    return res.status(415).json({
      success: false,
      error: err.message,
      code: 'UNSUPPORTED_MEDIA_TYPE',
    });
  }

  // Generic server error
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message,
    code: 'INTERNAL_ERROR',
  });
}

/**
 * 404 handler — catches unmatched routes
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found.`,
    code: 'NOT_FOUND',
  });
}

module.exports = { errorHandler, notFoundHandler };
