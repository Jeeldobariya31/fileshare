import { motion } from 'framer-motion';
import { FiGithub, FiWifi, FiZap, FiShield, FiHeart } from 'react-icons/fi';

const techStack = [
  { name: 'React 19', desc: 'UI Framework', color: '#61dafb' },
  { name: 'Vite', desc: 'Build Tool', color: '#646cff' },
  { name: 'Node.js', desc: 'Backend Runtime', color: '#68a063' },
  { name: 'Express', desc: 'Web Framework', color: '#fffde7' },
  { name: 'Socket.io', desc: 'Real-time Events', color: '#010101' },
  { name: 'Multer', desc: 'File Upload', color: '#f59e0b' },
  { name: 'Tailwind CSS', desc: 'Styling', color: '#38bdf8' },
  { name: 'Framer Motion', desc: 'Animations', color: '#ff4d94' },
];

const features = [
  { icon: '📤', title: 'Upload & Share', desc: 'Drag & drop multiple files with real-time progress' },
  { icon: '📥', title: 'Download', desc: 'One-click download or bulk ZIP download' },
  { icon: '👁️', title: 'Preview', desc: 'View images, videos, PDFs, and code in-browser' },
  { icon: '🔍', title: 'Search & Filter', desc: 'Real-time search with category and sort filters' },
  { icon: '📱', title: 'QR Code Sharing', desc: 'Generate QR codes for instant mobile access' },
  { icon: '🔴', title: 'Live Updates', desc: 'Real-time notifications via Socket.io' },
  { icon: '🗑️', title: 'File Management', desc: 'Rename, delete, favorite, and bulk operations' },
  { icon: '🖥️', title: 'Device Tracking', desc: 'See all connected devices with ping and OS info' },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <motion.div
        className="glass-card p-8 md:p-12 text-center mb-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15), transparent 70%)',
          }}
        />

        <div className="relative z-10">
          <motion.div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <FiWifi size={36} color="white" />
          </motion.div>

          <h1 className="text-4xl font-black gradient-text mb-3">LocalShare</h1>
          <p className="text-base mb-2" style={{ color: '#a855f7' }}>v1.0.0</p>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            A production-quality LAN file sharing system that works completely offline
            inside your local network.
          </p>

          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-10" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <FiZap size={14} style={{ color: '#a855f7' }} />
              <span className="text-sm" style={{ color: '#a855f7' }}>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-10" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <FiShield size={14} style={{ color: '#10b981' }} />
              <span className="text-sm" style={{ color: '#10b981' }}>Secure</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-10" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <FiWifi size={14} style={{ color: '#06b6d4' }} />
              <span className="text-sm" style={{ color: '#06b6d4' }}>100% Offline</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              className="glass-card-sm p-5 flex items-start gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ x: 4 }}
            >
              <div className="text-2xl flex-shrink-0">{icon}</div>
              <div>
                <div className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
          Tech Stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {techStack.map(({ name, desc, color }, i) => (
            <motion.div
              key={name}
              className="glass-card-sm p-4 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              whileHover={{ y: -3 }}
            >
              <div className="font-bold text-sm mb-1" style={{ color }}>
                {name}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {desc}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="text-center py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ color: 'var(--text-muted)' }}
      >
        <p className="flex items-center justify-center gap-2 text-sm">
          Built with <FiHeart size={14} style={{ color: '#ef4444' }} /> for local sharing
        </p>
        <p className="text-xs mt-1">LocalShare v1.0.0 • MIT License</p>
      </motion.div>
    </div>
  );
}
