# 🚀 LocalShare — LAN File Sharing System

<div align="center">

![LocalShare Banner](https://via.placeholder.com/800x200/7c3aed/ffffff?text=LocalShare+%E2%80%94+LAN+File+Sharing)

**Share files instantly across your local network. No internet required.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-68a063?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-white?style=for-the-badge&logo=socket.io)](https://socket.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## 📖 Overview

LocalShare is a **production-quality, full-stack LAN file sharing system** that allows all devices on the same WiFi network to upload, download, preview, and manage files. It works **completely offline** — no internet connection required.

When the server starts, it automatically detects your local IP address and displays:
- ✅ Server URL (e.g., `http://192.168.1.20:5000`)
- 📱 QR Code to open on mobile
- 👥 Number of connected devices
- 💾 Storage usage stats

---

## ✨ Features

### 📤 Upload System
- Drag & Drop file upload
- Multi-file upload (up to 20 files at once)
- Real-time progress bars with speed and ETA
- Upload history with status tracking
- Cancel and retry support

### 📁 File Management
- Grid and List view modes
- Search files in real-time
- Filter by category (Images, Videos, PDF, Code, etc.)
- Sort by date, name, or size
- Rename, delete files
- Favorites and tagging
- Bulk delete and bulk ZIP download

### 👁️ Preview Support
- **Images** — with zoom and drag
- **Videos** — HTML5 player with range requests
- **Audio** — waveform player
- **PDFs** — in-browser iframe viewer
- **Text & Code** — syntax-ready mono display

### 🔗 Sharing
- Copy download link to clipboard
- Generate QR Code for any file
- LAN URL for direct access

### 🔴 Real-Time (Socket.io)
- Live upload/download notifications
- Device connected/disconnected events
- Broadcast file events to all clients
- Heartbeat and ping measurement

### 🖥️ Devices Page
- Shows all connected LAN devices
- Device name, OS, browser, IP
- Ping/latency measurement
- Connection timestamp

### 🎨 UI/UX
- Glassmorphism dark/light theme
- Smooth Framer Motion animations
- Responsive (Desktop, Tablet, Mobile)
- Toast notifications
- Skeleton loading states

---

## 📸 Screenshots

> *Screenshots coming soon — run the app to see it in action!*

| Home Page | Files Page | Upload Page |
|-----------|-----------|-------------|
| `screenshot-home.png` | `screenshot-files.png` | `screenshot-upload.png` |

---

## 🛠️ Tech Stack

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI Framework |
| Vite | 6+ | Build Tool |
| React Router | 7 | Client-side Routing |
| Framer Motion | 11+ | Animations |
| Tailwind CSS | 4 | Styling |
| Socket.io Client | 4 | Real-time Events |
| Axios | 1.6+ | HTTP Client |
| React Dropzone | 14+ | Drag & Drop Upload |
| React Hot Toast | 2.4+ | Notifications |
| qrcode.react | 3+ | QR Code Generation |
| React Icons | 5+ | Icon Library |

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| Express | 4.18+ | Web Framework |
| Socket.io | 4.7+ | WebSocket Server |
| Multer | 2+ | File Upload Handling |
| Helmet | 7 | Security Headers |
| CORS | 2.8 | Cross-Origin Requests |
| compression | 1.7 | Response Compression |
| uuid | 9 | Unique File IDs |
| qrcode | 1.5 | QR in Terminal |
| archiver | 6 | ZIP Downloads |
| mime-types | 2.1 | MIME Detection |

---

## 📁 Project Structure

```
localshare/
│
├── client/                          # React 19 + Vite Frontend
│   ├── src/
│   │   ├── assets/                  # Static assets
│   │   ├── components/              # Reusable UI components
│   │   │   ├── FileCard.jsx         # Grid and list file cards
│   │   │   ├── PreviewModal.jsx     # File preview modal
│   │   │   ├── QRModal.jsx          # QR code sharing modal
│   │   │   ├── RenameModal.jsx      # Rename modal
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   ├── StatsCard.jsx        # Dashboard stat cards
│   │   │   └── UploadZone.jsx       # Drag & drop zone
│   │   ├── context/
│   │   │   ├── SocketContext.jsx    # Socket.io connection
│   │   │   └── ThemeContext.jsx     # Dark/Light theme
│   │   ├── hooks/
│   │   │   ├── useDevices.js        # LAN device tracking
│   │   │   ├── useFiles.js          # File CRUD operations
│   │   │   ├── useStats.js          # Server statistics
│   │   │   └── useUpload.js         # Upload with progress
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx       # App layout wrapper
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Dashboard home
│   │   │   ├── FilesPage.jsx        # File browser
│   │   │   ├── UploadPage.jsx       # Upload interface
│   │   │   ├── DevicesPage.jsx      # Connected devices
│   │   │   ├── SettingsPage.jsx     # App settings
│   │   │   └── AboutPage.jsx        # About page
│   │   ├── services/
│   │   │   └── api.js               # Axios API service
│   │   ├── utils/
│   │   │   └── fileUtils.jsx        # Helper functions
│   │   ├── constants/
│   │   │   └── index.js             # App constants
│   │   ├── App.jsx                  # Root with routing
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Node.js + Express Backend
│   ├── controllers/
│   │   ├── fileController.js        # File CRUD handlers
│   │   ├── statsController.js       # Stats handler
│   │   └── devicesController.js     # Devices handler
│   ├── routes/
│   │   ├── files.js                 # File routes
│   │   ├── stats.js                 # Stats route
│   │   └── devices.js               # Devices route
│   ├── middlewares/
│   │   ├── upload.js                # Multer configuration
│   │   └── errorHandler.js          # Global error handling
│   ├── services/
│   │   ├── fileService.js           # File CRUD logic
│   │   ├── statsService.js          # Storage statistics
│   │   └── deviceService.js         # Device tracking
│   ├── socket/
│   │   └── socketHandler.js         # Socket.io events
│   ├── utils/
│   │   ├── ipUtils.js               # LAN IP detection
│   │   └── fileUtils.js             # File helpers
│   └── server.js                    # Express entry point
│
├── uploads/                         # File storage (auto-created)
│   └── *.meta.json                  # File metadata sidecars
│
├── shared/
│   └── constants.js                 # Shared constants
│
├── package.json                     # Root monorepo config
└── README.md
```

---

## ⚡ Installation

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### Clone and Install

```bash
# Clone the repository
git clone <repo-url>
cd localshare

# Install root dependencies
npm install

# Install all dependencies (server + client)
npm run install:all
```

Or manually:

```bash
# Server dependencies
cd server && npm install

# Client dependencies
cd ../client && npm install
```

---

## 🏃 Running the App

### Development Mode (Recommended)

```bash
# From project root — starts both client and server
npm run dev
```

This starts:
- **Backend** at `http://localhost:5000`
- **Frontend** at `http://localhost:5173`

### Running Separately

```bash
# Terminal 1: Start server
npm run server

# Terminal 2: Start client
npm run client
```

### Production

```bash
# Build the frontend
npm run build

# Start both in production
npm start
```

### Accessing from Other Devices

When the server starts, it prints your **LAN IP address** and a **QR code** in the terminal.

Open the displayed URL on any device connected to the same WiFi:
```
http://192.168.x.x:5173
```

---

## 📡 API Documentation

All endpoints are prefixed with `/api`.

### Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/files` | List files with filters |
| `GET` | `/api/file/:id` | Get single file metadata |
| `POST` | `/api/upload` | Upload files (multipart) |
| `DELETE` | `/api/file/:id` | Delete a file |
| `PUT` | `/api/rename/:id` | Rename a file |
| `PUT` | `/api/file/:id/meta` | Update metadata |
| `GET` | `/api/download/:id` | Download a file |
| `GET` | `/api/preview/:id` | Stream for preview |

### Bulk Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/bulk-delete` | Delete multiple files |
| `POST` | `/api/bulk-download` | Download as ZIP |

### Stats & Devices

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stats` | Server stats |
| `GET` | `/api/devices` | Connected devices |
| `GET` | `/health` | Health check |

### Query Parameters for `/api/files`

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search term |
| `category` | string | File category |
| `sortBy` | string | `date`, `size`, `name` |
| `sortOrder` | string | `asc`, `desc` |
| `favorites` | boolean | Filter favorites |
| `page` | number | Page number |
| `limit` | number | Items per page |

---

## ⚙️ Configuration

### Environment Variables (Server)

Create a `.env` file in the `server/` directory:

```env
PORT=5000
CLIENT_PORT=5173
MAX_FILE_SIZE=524288000
NODE_ENV=development
```

---

## 🔮 Future Improvements

- [ ] Password protection / PIN access
- [ ] File expiration with TTL
- [ ] Folder upload and management
- [ ] Markdown live preview
- [ ] File version history
- [ ] WebRTC peer-to-peer transfer
- [ ] Mobile-native PWA support
- [ ] Dark mode OLED variant
- [ ] File comments/annotations
- [ ] Transfer speed graphs
- [ ] Docker support

---

## 📄 License

MIT License © 2026 LocalShare

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.
