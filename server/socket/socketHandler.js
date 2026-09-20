const {
  registerDevice,
  updateDevice,
  removeDevice,
  updateDevicePing,
  getAllDevices,
  getDeviceCount,
} = require('../services/deviceService');

/**
 * Socket.io event handler
 * Manages real-time connections, device tracking, and file events
 */
function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    const ip = socket.handshake.headers['x-forwarded-for'] ||
               socket.handshake.address ||
               'Unknown';
    const userAgent = socket.handshake.headers['user-agent'] || '';

    console.log(`[Socket] Device connected: ${socket.id} from ${ip}`);

    // Register device
    registerDevice(socket.id, { ip, userAgent });

    // Notify all clients of new device
    io.emit('device:connected', {
      ...getAllDevices().find(d => d.socketId === socket.id),
      totalConnected: getDeviceCount(),
    });

    // Send current stats to newly connected client
    socket.emit('server:welcome', {
      message: 'Connected to LocalShare server',
      totalDevices: getDeviceCount(),
      serverTime: new Date().toISOString(),
    });

    // Handle ping/pong for latency measurement
    socket.on('ping:send', () => {
      socket.emit('ping:response', { timestamp: Date.now() });
    });

    // Handle ping result from client
    socket.on('ping:result', ({ ping }) => {
      updateDevicePing(socket.id, ping);
    });

    // Handle heartbeat
    socket.on('heartbeat', () => {
      updateDevice(socket.id);
    });

    // Handle upload progress from client
    socket.on('upload:progress', (data) => {
      // Broadcast to all OTHER clients
      socket.broadcast.emit('upload:progress', data);
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Device disconnected: ${socket.id} (${reason})`);
      removeDevice(socket.id);

      io.emit('device:disconnected', {
        socketId: socket.id,
        totalConnected: getDeviceCount(),
      });
    });

    // Error handling
    socket.on('error', (err) => {
      console.error(`[Socket] Error on ${socket.id}:`, err);
    });
  });

  console.log('[Socket] Socket.io handlers initialized');
}

module.exports = { setupSocketHandlers };
