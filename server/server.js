/**
 * LocalShare Server — Entry Point
 * LAN File Sharing System
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');

const { getLanIP, getServerUrl } = require('./utils/ipUtils');
const { setupSocketHandlers } = require('./socket/socketHandler');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

// Routes
const fileRoutes = require('./routes/files');
const statsRoutes = require('./routes/stats');
const deviceRoutes = require('./routes/devices');

// ─── Configuration ────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT) || 5000;
const CLIENT_PORT = parseInt(process.env.CLIENT_PORT) || 5173;
const UPLOADS_DIR = path.join(__dirname, '../uploads');
const LAN_IP = getLanIP();
const SERVER_URL = getServerUrl(PORT);
const CLIENT_URL = `http://${LAN_IP}:${CLIENT_PORT}`;

// ─── App Setup ────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ─── Socket.io Setup ─────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  transports: ['websocket', 'polling'],
});

// Make io accessible to routes via app.get('io')
app.set('io', io);

// ─── Security Middleware ──────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow serving files cross-origin
  contentSecurityPolicy: false, // Disabled to allow preview of various file types
}));

// ─── CORS ─────────────────────────────────────────────────────────
app.use(cors({
  origin: '*', // LAN — all devices on same network are trusted
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range'],
  exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length'],
}));

// ─── Compression ─────────────────────────────────────────────────
app.use(compression({
  // Don't compress already-compressed formats
  filter: (req, res) => {
    const type = res.getHeader('Content-Type') || '';
    const skip = ['image/', 'video/', 'audio/', 'application/zip', 'application/gzip'];
    if (skip.some(t => type.includes(t))) return false;
    return compression.filter(req, res);
  },
}));

// ─── Body Parsing ────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static File Serving ─────────────────────────────────────────
// Ensure uploads dir exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ─── API Routes ───────────────────────────────────────────────────
app.use('/api', fileRoutes);
app.use('/api', statsRoutes);
app.use('/api', deviceRoutes);

// ─── Health Check ────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'running',
    uptime: process.uptime(),
    serverUrl: SERVER_URL,
    lanIP: LAN_IP,
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 and Error Handlers ──────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Socket.io Handlers ──────────────────────────────────────────
setupSocketHandlers(io);

// ─── Start Server ────────────────────────────────────────────────
server.listen(PORT, '0.0.0.0', async () => {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║           🚀  LocalShare Server Running!          ║');
  console.log('╠═══════════════════════════════════════════════════╣');
  console.log(`║  Local:       http://localhost:${PORT}              ║`);
  console.log(`║  LAN:         ${SERVER_URL.padEnd(35)} ║`);
  console.log(`║  Client:      ${CLIENT_URL.padEnd(35)} ║`);
  console.log('╠═══════════════════════════════════════════════════╣');
  console.log('║  Share the LAN URL with other devices on your WiFi ║');
  console.log('╚════════════════════════════════════════════════════╝');

  // Generate QR code in terminal
  try {
    const qrString = await QRCode.toString(CLIENT_URL, { type: 'terminal', small: true });
    console.log('\n📱 Scan QR Code to open on mobile:\n');
    console.log(qrString);
  } catch (e) {
    console.log(`\n📱 Open on mobile: ${CLIENT_URL}\n`);
  }
});

// ─── Graceful Shutdown ──────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('\n[Server] SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('[Server] HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n[Server] SIGINT received. Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = { app, server, io };
