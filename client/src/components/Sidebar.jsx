import { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiFolder, FiUploadCloud, FiMonitor,
  FiSettings, FiInfo, FiMenu, FiX, FiWifi, FiUsers, FiShield
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import { useHost } from '../context/HostContext';

const navLinks = [
  { path: '/',         label: 'Home',     icon: FiHome },
  { path: '/files',    label: 'Files',    icon: FiFolder },
  { path: '/upload',   label: 'Upload',   icon: FiUploadCloud },
  { path: '/devices',  label: 'Devices',  icon: FiMonitor },
  { path: '/settings', label: 'Settings', icon: FiSettings },
  { path: '/about',    label: 'About',    icon: FiInfo },
];

export default function Sidebar({ isOpen, onClose }) {
  const { theme, setTheme } = useTheme();
  const { isConnected, connectedCount } = useSocket();
  const { isHost } = useHost();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Handle nav link click on mobile — navigate then close
  const handleNavClick = (e, path) => {
    e.preventDefault();
    navigate(path);
    // Small delay so the navigation completes before closing
    setTimeout(() => onClose(), 50);
  };

  return (
    <>
      {/* ── Mobile Backdrop Overlay ─────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar-overlay"
            className="fixed inset-0 md:hidden"
            style={{
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              zIndex: 200,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-label="Close sidebar"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar Panel ───────────────────────────────────────── */}
      <AnimatePresence>
        {/* Desktop: always visible */}
        <motion.aside
          key="sidebar"
          ref={sidebarRef}
          className={`sidebar${isOpen ? ' open' : ''}`}
          style={{ zIndex: 210 }}
          initial={false}
          animate={{}}
        >
          {/* ── Logo & Close ──────────────────────────────────── */}
          <div
            className="flex items-center gap-3 px-5 py-5 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--border-color)' }}
          >
            <div
              className="w-9 h-9 rounded-10 flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              <FiWifi size={18} color="white" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-base gradient-text leading-tight">LocalShare</div>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                LAN File Sharing
              </div>
            </div>

            {/* Close button — only shown on mobile */}
            <button
              id="sidebar-close-btn"
              className="ml-auto flex-shrink-0 w-8 h-8 rounded-8 flex items-center justify-center md:hidden"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-color-strong)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
              onClick={onClose}
              aria-label="Close navigation"
            >
              <FiX size={17} />
            </button>
          </div>

          {/* ── Navigation Links ────────────────────────────────── */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div
              className="text-[10px] font-semibold uppercase tracking-widest px-2 mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              Navigation
            </div>

            {navLinks
              .filter(({ path }) => isHost || path !== '/settings') // Hide settings for guests
              .map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                id={`nav-link-${label.toLowerCase()}`}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={(e) => {
                  // On mobile: prevent default and manually navigate then close
                  if (window.innerWidth < 768) {
                    handleNavClick(e, path);
                  }
                  // On desktop: let NavLink handle navigation normally
                }}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* ── Status Footer ──────────────────────────────────── */}
          <div
            className="px-4 py-4 flex-shrink-0"
            style={{ borderTop: '1px solid var(--border-color)' }}
          >
            {/* Connection status pill */}
            <div
              className="flex items-center gap-2 p-3 rounded-10 mb-3"
              style={{
                background: isConnected ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${isConnected ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
              }}
            >
              <motion.div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: isConnected ? '#10b981' : '#ef4444' }}
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="min-w-0">
                <div
                  className="text-xs font-semibold truncate"
                  style={{ color: isConnected ? '#10b981' : '#ef4444' }}
                >
                  {isConnected ? 'Server Online' : 'Connecting...'}
                </div>
              </div>
            </div>

            {/* Connected device count */}
            <div className="flex items-center gap-2 px-1 mb-4">
              <FiUsers size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {connectedCount} device{connectedCount !== 1 ? 's' : ''} connected
              </span>
            </div>

            {/* Theme switcher */}
            <div
              className="flex items-center rounded-10 p-1"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
              }}
            >
              {[
                { value: 'dark',  label: '🌙' },
                { value: 'light', label: '☀️' },
                { value: 'auto',  label: '⚙️' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  id={`theme-btn-${value}`}
                  onClick={() => setTheme(value)}
                  title={`${value.charAt(0).toUpperCase() + value.slice(1)} mode`}
                  className="flex-1 py-1.5 text-xs font-medium rounded-8 capitalize transition-all"
                  style={{
                    background: theme === value ? 'var(--color-primary)' : 'transparent',
                    color: theme === value ? 'white' : 'var(--text-muted)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  );
}

/**
 * Mobile top navbar with hamburger menu button
 */
export function Topbar({ onMenuClick }) {
  const { isConnected, connectedCount } = useSocket();

  return (
    <div
      id="mobile-topbar"
      className="flex items-center gap-3 px-4 py-3 md:hidden"
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Hamburger */}
      <button
        id="topbar-menu-btn"
        className="w-9 h-9 flex items-center justify-center rounded-10 transition-colors"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
        }}
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <FiMenu size={19} />
      </button>

      {/* App name */}
      <div className="font-bold text-base gradient-text">LocalShare</div>

      {/* Right side status */}
      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: isConnected ? '#10b981' : '#ef4444' }}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="hidden xs:inline">
            {connectedCount}
          </span>
        </div>
      </div>
    </div>
  );
}
