import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiUploadCloud, FiFolder, FiUsers, FiHardDrive,
  FiWifi, FiActivity, FiImage, FiFilm, FiMusic, FiFileText,
  FiArchive, FiCode, FiFile, FiGrid
} from 'react-icons/fi';
import StatsCard from '../components/StatsCard';
import { useStats } from '../hooks/useStats';
import { useSocket } from '../context/SocketContext';
import { formatBytes, formatDate, getCategoryIcon } from '../utils/fileUtils';
import { QRCodeSVG } from 'qrcode.react';

// Page entry animation
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.08 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { stats, loading } = useStats(15000);
  const { isConnected, connectedCount } = useSocket();

  const lanUrl = stats?.serverUrl || 'http://localhost:5000';
  const clientUrl = lanUrl.replace(':5000', ':5173');

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <motion.div
        className="glass-card relative overflow-hidden mb-8 p-8 md:p-12"
        variants={itemVariants}
      >
        {/* Background decorations */}
        <div
          className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #7c3aed 0%, transparent 60%)',
            transform: 'translate(30%, -30%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #06b6d4 0%, transparent 60%)',
            transform: 'translate(-30%, 30%)',
          }}
        />

        {/* Floating shapes */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-5 pointer-events-none"
            style={{
              width: 60 + i * 30,
              height: 60 + i * 30,
              background: i % 2 === 0 ? '#7c3aed' : '#06b6d4',
              top: `${10 + i * 20}%`,
              right: `${5 + i * 8}%`,
            }}
            animate={{ y: [0, -20, 0], rotate: [0, 180, 0] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        <div className="relative z-10">
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-16 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              <FiWifi size={22} color="white" />
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Welcome to
              </div>
              <h1 className="text-3xl md:text-4xl font-black gradient-text leading-tight">
                LocalShare
              </h1>
            </div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg mb-8 max-w-xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            Share files instantly across your local network. No internet required —
            works on any device connected to your WiFi.
          </motion.p>

          <motion.div variants={itemVariants} className="flex items-center gap-4 flex-wrap">
            <Link to="/upload" className="btn-primary text-base px-6 py-3">
              <FiUploadCloud size={18} />
              Upload Files
            </Link>
            <Link to="/files" className="btn-secondary text-base px-6 py-3">
              <FiFolder size={18} />
              Browse Files
            </Link>
          </motion.div>

          {/* Server URL display */}
          {stats?.lanIP && (
            <motion.div
              variants={itemVariants}
              className="mt-6 flex items-center gap-3 flex-wrap"
            >
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-10 text-sm font-mono"
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: '#10b981',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {clientUrl}
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Share this URL with others on your WiFi
              </span>
            </motion.div>
          )}
        </div>

        {/* QR Code (hidden on small screens) */}
        {stats?.lanIP && (
          <motion.div
            variants={itemVariants}
            className="absolute top-8 right-8 hidden lg:block"
          >
            <div
              className="p-3 rounded-16 text-center"
              style={{
                background: 'white',
                boxShadow: '0 8px 32px rgba(124, 58, 237, 0.2)',
              }}
            >
              <QRCodeSVG value={clientUrl} size={100} level="M" fgColor="#1a1a2e" />
              <div className="text-[10px] mt-1.5 font-medium" style={{ color: '#666' }}>
                Scan to open
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ── Stats Grid ───────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Dashboard Overview
        </h2>
        <div className="stats-grid mb-8">
          <StatsCard
            title="Total Files"
            value={loading ? '...' : stats?.totalFiles || 0}
            icon={FiFolder}
            color="#7c3aed"
            loading={loading}
          />
          <StatsCard
            title="Connected Devices"
            value={connectedCount}
            icon={FiUsers}
            color="#f59e0b"
          />
        </div>
      </motion.div>

      {/* ── Category Breakdown ───────────────────────────────────── */}
      {stats && (
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Files by Category
          </h2>
          <div className="stats-grid">
            {[
              { key: 'image', label: 'Images', icon: FiImage, color: '#10b981' },
              { key: 'video', label: 'Videos', icon: FiFilm, color: '#3b82f6' },
              { key: 'audio', label: 'Audio', icon: FiMusic, color: '#8b5cf6' },
              { key: 'pdf', label: 'PDFs', icon: FiFileText, color: '#ef4444' },
              { key: 'document', label: 'Documents', icon: FiFile, color: '#3b82f6' },
              { key: 'spreadsheet', label: 'Spreadsheets', icon: FiGrid, color: '#10b981' },
              { key: 'archive', label: 'Archives', icon: FiArchive, color: '#f59e0b' },
              { key: 'code', label: 'Code', icon: FiCode, color: '#06b6d4' },
            ].map(({ key, label, icon, color }) => (
              <StatsCard
                key={key}
                title={label}
                value={stats?.categories?.[key] || 0}
                icon={icon}
                color={color}
                loading={loading}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Recent Uploads ───────────────────────────────────────── */}
      {stats?.recentFiles?.length > 0 && (
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Recent Uploads
            </h2>
            <Link
              to="/files"
              className="text-sm font-medium hover:underline"
              style={{ color: '#a855f7' }}
            >
              View all →
            </Link>
          </div>

          <div className="glass-card overflow-hidden">
            {stats.recentFiles.map((file, idx) => (
              <motion.div
                key={file.id}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-[var(--bg-elevated)]"
                style={{
                  borderBottom: idx < stats.recentFiles.length - 1
                    ? '1px solid var(--border-color)'
                    : 'none',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className={`file-${file.category || 'other'}`} style={{ flexShrink: 0 }}>
                  {getCategoryIcon(file.category, 20)}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium text-sm truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {file.originalName}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {formatBytes(file.size)} • {formatDate(file.uploadDate)}
                  </div>
                </div>
                <span className="badge badge-purple text-[10px] flex-shrink-0">
                  {file.extension?.toUpperCase()}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Server Info ──────────────────────────────────────────── */}
      {stats && (
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Server Information
          </h2>
          <div className="glass-card p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Platform', value: stats.systemInfo?.platform },
                { label: 'Hostname', value: stats.systemInfo?.hostname },
                { label: 'CPU Cores', value: stats.systemInfo?.cpus },
                { label: 'Free Memory', value: stats.systemInfo?.freeMemory },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {value || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
