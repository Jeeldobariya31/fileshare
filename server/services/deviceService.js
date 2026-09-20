const os = require('os');
const { getLanIP } = require('../utils/ipUtils');

/**
 * Device tracking service
 * Manages connected socket clients and their metadata
 */

const connectedDevices = new Map();
const SERVER_HOSTNAME = os.hostname();
const SERVER_LAN_IP  = getLanIP();

/**
 * Determines if an IP belongs to the host machine
 * (loopback OR the server's own LAN IP)
 */
function isHostIP(ip) {
  if (!ip) return false;
  const cleaned = ip.replace('::ffff:', ''); // strip IPv6-mapped IPv4 prefix
  return (
    cleaned === '127.0.0.1'   ||
    cleaned === '::1'          ||
    cleaned === 'localhost'    ||
    cleaned === SERVER_LAN_IP
  );
}

/**
 * Registers a new device when it connects via socket
 */
function registerDevice(socketId, deviceInfo) {
  const rawIP  = deviceInfo.ip || 'Unknown';
  const cleanIP = rawIP.replace('::ffff:', '');
  const isHost  = isHostIP(cleanIP);

  connectedDevices.set(socketId, {
    socketId,
    ip:            cleanIP,
    userAgent:     deviceInfo.userAgent || '',
    deviceName:    isHost ? SERVER_HOSTNAME : parseDeviceName(deviceInfo.userAgent),
    hostname:      isHost ? SERVER_HOSTNAME : cleanIP,   // best available name
    os:            parseOS(deviceInfo.userAgent),
    browser:       parseBrowser(deviceInfo.userAgent),
    connectedAt:   new Date().toISOString(),
    lastSeen:      new Date().toISOString(),
    status:        'online',
    ping:          null,
    isHost,                                               // ← marks the server machine
  });
}

function updateDevice(socketId) {
  const d = connectedDevices.get(socketId);
  if (d) d.lastSeen = new Date().toISOString();
}

function removeDevice(socketId) {
  connectedDevices.delete(socketId);
}

function updateDevicePing(socketId, ping) {
  const d = connectedDevices.get(socketId);
  if (d) {
    d.ping    = ping;
    d.lastSeen = new Date().toISOString();
  }
}

function getAllDevices() {
  return Array.from(connectedDevices.values());
}

function getDeviceCount() {
  return connectedDevices.size;
}

/**
 * Looks up whether a given socket is the host
 */
function isHostSocket(socketId) {
  return connectedDevices.get(socketId)?.isHost || false;
}

// ── User-Agent parsers ──────────────────────────────────────────────

function parseDeviceName(ua = '') {
  if (/iPhone/i.test(ua))                return 'iPhone';
  if (/iPad/i.test(ua))                  return 'iPad';
  if (/Android.*Mobile/i.test(ua))       return 'Android Phone';
  if (/Android/i.test(ua))               return 'Android Tablet';
  if (/Windows NT 10/i.test(ua))         return 'Windows 10/11 PC';
  if (/Windows NT 6\.1/i.test(ua))       return 'Windows 7 PC';
  if (/Windows/i.test(ua))               return 'Windows PC';
  if (/Macintosh/i.test(ua))             return 'Mac';
  if (/Linux/i.test(ua))                 return 'Linux PC';
  return 'Unknown Device';
}

function parseOS(ua = '') {
  if (/Windows NT 10\.0/i.test(ua))      return 'Windows 10/11';
  if (/Windows NT 6\.1/i.test(ua))       return 'Windows 7';
  if (/Windows/i.test(ua))               return 'Windows';
  if (/Mac OS X/i.test(ua))              return 'macOS';
  if (/Android/i.test(ua)) {
    const m = ua.match(/Android\s([\d.]+)/i);
    return m ? `Android ${m[1]}` : 'Android';
  }
  if (/iPhone|iPad/i.test(ua)) {
    const m = ua.match(/OS\s([\d_]+)/i);
    return m ? `iOS ${m[1].replace(/_/g, '.')}` : 'iOS';
  }
  if (/Linux/i.test(ua))                 return 'Linux';
  return 'Unknown OS';
}

function parseBrowser(ua = '') {
  if (/Edg\//i.test(ua))                 return 'Edge';
  if (/OPR\//i.test(ua))                 return 'Opera';
  if (/Chrome\/[\d]+/i.test(ua))         return 'Chrome';
  if (/Firefox\/[\d]+/i.test(ua))        return 'Firefox';
  if (/Safari\/[\d]+/i.test(ua))         return 'Safari';
  return 'Unknown Browser';
}

module.exports = {
  registerDevice,
  updateDevice,
  removeDevice,
  updateDevicePing,
  getAllDevices,
  getDeviceCount,
  isHostIP,
  isHostSocket,
  SERVER_HOSTNAME,
  SERVER_LAN_IP,
};
