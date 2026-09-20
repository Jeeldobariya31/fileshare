import { motion } from 'framer-motion';
import {
  FiMonitor, FiSmartphone, FiWifi, FiClock,
  FiRefreshCw, FiShield, FiUser, FiGlobe
} from 'react-icons/fi';
import { useDevices } from '../hooks/useDevices';
import { formatDate } from '../utils/fileUtils';

/* ── Helper: pick icon from OS / device name ─────────────────────── */
function DeviceIcon({ os, deviceName }) {
  const ua = `${os} ${deviceName}`.toLowerCase();
  const isPhone  = /iphone|android phone|mobile/i.test(ua);
  const isTablet = /ipad|android tablet/i.test(ua);
  const Icon = isPhone || isTablet ? FiSmartphone : FiMonitor;
  return <Icon size={26} />;
}

/* ── Ping badge ──────────────────────────────────────────────────── */
function PingBadge({ ping }) {
  if (ping === null || ping === undefined)
    return <span className="badge badge-yellow">Measuring…</span>;
  if (ping < 5)  return <span className="badge badge-green">{ping} ms ⚡</span>;
  if (ping < 30) return <span className="badge badge-cyan">{ping} ms</span>;
  return           <span className="badge badge-yellow">{ping} ms</span>;
}

/* ── OS badge ────────────────────────────────────────────────────── */
function OSBadge({ os }) {
  const lc = (os || '').toLowerCase();
  let color = 'badge-purple';
  if (lc.includes('windows'))  color = 'badge-cyan';
  else if (lc.includes('mac')) color = 'badge-yellow';
  else if (lc.includes('android') || lc.includes('ios')) color = 'badge-green';
  return <span className={`badge ${color}`}>{os || 'Unknown'}</span>;
}

/* ── Access badge ────────────────────────────────────────────────── */
function AccessBadge({ isHost }) {
  return isHost ? (
    <span
      className="badge"
      style={{
        background: 'rgba(124,58,237,0.2)',
        color: '#a855f7',
        border: '1px solid rgba(124,58,237,0.4)',
      }}
    >
      <FiShield size={10} style={{ display: 'inline', marginRight: 4 }} />
      HOST — Full Access
    </span>
  ) : (
    <span
      className="badge"
      style={{
        background: 'rgba(6,182,212,0.12)',
        color: '#06b6d4',
        border: '1px solid rgba(6,182,212,0.3)',
      }}
    >
      <FiUser size={10} style={{ display: 'inline', marginRight: 4 }} />
      Guest — View Only
    </span>
  );
}

export default function DevicesPage() {
  const { devices, loading, refetch } = useDevices(5000);

  return (
    <div className="max-w-5xl mx-auto">
      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div
        className="flex items-center justify-between mb-8 flex-wrap gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-black gradient-text mb-1">Connected Devices</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {devices.length} device{devices.length !== 1 ? 's' : ''} on this network
          </p>
        </div>
        <button className="btn-secondary" onClick={refetch} id="devices-refresh-btn">
          <FiRefreshCw size={15} />
          Refresh
        </button>
      </motion.div>

      {/* ── Access Legend ───────────────────────────────────────── */}
      <motion.div
        className="glass-card p-4 mb-6 flex items-start gap-4 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center gap-2">
          <FiShield size={16} style={{ color: '#a855f7', flexShrink: 0 }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: '#a855f7' }}>
              Host Device — Full Access
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Can upload, download, delete, rename, and manage all files
            </div>
          </div>
        </div>
        <div
          className="hidden md:block w-px self-stretch"
          style={{ background: 'var(--border-color)' }}
        />
        <div className="flex items-center gap-2">
          <FiUser size={16} style={{ color: '#06b6d4', flexShrink: 0 }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: '#06b6d4' }}>
              Guest Devices — View Only
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Can upload and download files, but cannot delete or rename
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Loading skeletons ───────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-16" />
          ))}
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────────────── */}
      {!loading && devices.length === 0 && (
        <motion.div
          className="glass-card p-16 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FiWifi size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            No devices connected
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Open LocalShare on any device on the same WiFi to see it here
          </p>
        </motion.div>
      )}

      {/* ── Device cards ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {devices
          .sort((a, b) => (b.isHost ? 1 : 0) - (a.isHost ? 1 : 0)) // host first
          .map((device, idx) => (
            <motion.div
              key={device.socketId}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
            >
              {/* Host highlight stripe */}
              {device.isHost && (
                <div
                  style={{
                    height: 3,
                    background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                  }}
                />
              )}

              <div className="p-6">
                <div className="flex items-start gap-5 flex-wrap">
                  {/* Device icon */}
                  <div
                    className="w-14 h-14 rounded-16 flex items-center justify-center flex-shrink-0"
                    style={{
                      background: device.isHost
                        ? 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(6,182,212,0.2))'
                        : 'var(--bg-elevated)',
                      border: `1px solid ${device.isHost
                        ? 'rgba(124,58,237,0.4)'
                        : 'var(--border-color)'}`,
                      color: device.isHost ? '#a855f7' : 'var(--text-muted)',
                    }}
                  >
                    <DeviceIcon os={device.os} deviceName={device.deviceName} />
                  </div>

                  {/* Info grid */}
                  <div className="flex-1 min-w-0">
                    {/* Name row */}
                    <div className="flex items-center gap-3 flex-wrap mb-3">
                      <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                        {device.deviceName}
                      </h3>
                      {/* Online dot */}
                      <div className="flex items-center gap-1">
                        <motion.div
                          className="w-2 h-2 rounded-full"
                          style={{ background: '#10b981' }}
                          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-xs" style={{ color: '#10b981' }}>Online</span>
                      </div>
                      {/* Access level badge */}
                      <AccessBadge isHost={device.isHost} />
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                          Hostname / Name
                        </div>
                        <div
                          className="font-mono text-sm font-semibold truncate"
                          style={{ color: 'var(--text-primary)' }}
                          title={device.hostname}
                        >
                          {device.hostname}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                          IP Address
                        </div>
                        <div className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                          {device.ip}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                          Operating System
                        </div>
                        <OSBadge os={device.os} />
                      </div>

                      <div>
                        <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                          Browser
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {device.browser}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                          Ping (Latency)
                        </div>
                        <PingBadge ping={device.ping} />
                      </div>

                      <div>
                        <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                          Connected
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock size={11} style={{ color: 'var(--text-muted)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {formatDate(device.connectedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
