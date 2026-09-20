const { isHostIP } = require('../services/deviceService');

/**
 * Host-only middleware
 * Restricts destructive operations (delete, rename, bulk-delete, etc.)
 * to only the server's host machine.
 *
 * Detection: checks if the request IP matches the server's LAN IP or localhost.
 * Non-host devices can still upload, download, and preview files.
 */
function hostOnly(req, res, next) {
  const raw = (
    req.ip ||
    req.headers['x-forwarded-for'] ||
    req.connection?.remoteAddress   ||
    req.socket?.remoteAddress       ||
    ''
  );

  // x-forwarded-for can be a comma-separated list
  const ip = raw.split(',')[0].trim().replace('::ffff:', '');

  if (isHostIP(ip)) {
    return next(); // ✅ Host machine — allow
  }

  // Non-host device — deny with clear message
  return res.status(403).json({
    success: false,
    error:   'Access denied. Only the host device can perform this action.',
    code:    'HOST_ONLY',
    tip:     'To manage files, open LocalShare on the server computer.',
  });
}

module.exports = { hostOnly };
