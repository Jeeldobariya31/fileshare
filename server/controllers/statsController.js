const { getStats } = require('../services/statsService');
const { getDeviceCount, SERVER_HOSTNAME, SERVER_LAN_IP, isHostIP } = require('../services/deviceService');
const { getLanIP } = require('../utils/ipUtils');

/**
 * GET /api/stats
 * Returns server and storage statistics
 */
async function getStatsHandler(req, res, next) {
  try {
    const stats = getStats();
    const connectedUsers = getDeviceCount();
    const lanIP = getLanIP();
    
    // Get actual IP of the requester
    const rawIP = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.socket?.remoteAddress || req.ip || '';
    const cleanIP = rawIP.split(',')[0].trim().replace('::ffff:', '');
    const isHost = isHostIP(cleanIP);

    res.json({
      success: true,
      data: {
        ...stats,
        connectedUsers,
        lanIP,
        hostname:   SERVER_HOSTNAME,    // ← actual server PC name
        serverUrl: `http://${lanIP}:${process.env.PORT || 5000}`,
        isHost:     isHost,             // ← backend tells frontend if it's the host
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStatsHandler };
