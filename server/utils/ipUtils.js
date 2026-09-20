const os = require('os');

/**
 * Gets the local LAN IP address of the machine.
 * Prefers IPv4 addresses that are not loopback.
 */
function getLanIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip loopback and non-IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return '127.0.0.1'; // Fallback to localhost
}

/**
 * Returns full server URL with LAN IP
 */
function getServerUrl(port) {
  const ip = getLanIP();
  return `http://${ip}:${port}`;
}

module.exports = { getLanIP, getServerUrl };
