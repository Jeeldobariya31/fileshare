const { getAllDevices, getDeviceCount } = require('../services/deviceService');

/**
 * GET /api/devices
 * Returns all currently connected devices
 */
async function getDevices(req, res, next) {
  try {
    const devices = getAllDevices();
    res.json({
      success: true,
      data: devices,
      count: getDeviceCount(),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDevices };
