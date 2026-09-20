import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiMoon, FiSun, FiMonitor, FiFolder, FiShield, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [maxUpload, setMaxUpload] = useState(500);
  const [autoDelete, setAutoDelete] = useState(false);
  const [autoDeleteDays, setAutoDeleteDays] = useState(30);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-black gradient-text mb-1">Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Configure LocalShare to your preferences
        </p>
      </motion.div>

      <div className="flex flex-col gap-6">
        {/* Theme */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <FiMonitor size={18} style={{ color: '#7c3aed' }} />
            <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Appearance</h2>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium block mb-3" style={{ color: 'var(--text-secondary)' }}>
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'dark', label: 'Dark', icon: FiMoon, desc: 'Easy on the eyes' },
                { value: 'light', label: 'Light', icon: FiSun, desc: 'Bright and clean' },
                { value: 'auto', label: 'Auto', icon: FiMonitor, desc: 'System preference' },
              ].map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className="p-4 rounded-12 text-left transition-all"
                  style={{
                    background: theme === value ? 'rgba(124,58,237,0.15)' : 'var(--bg-elevated)',
                    border: `1px solid ${theme === value ? 'rgba(124,58,237,0.5)' : 'var(--border-color)'}`,
                  }}
                >
                  <Icon size={20} style={{ color: theme === value ? '#a855f7' : 'var(--text-muted)', marginBottom: 8 }} />
                  <div className="font-semibold text-sm" style={{ color: theme === value ? '#a855f7' : 'var(--text-primary)' }}>
                    {label}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Upload Settings */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <FiFolder size={18} style={{ color: '#06b6d4' }} />
            <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Upload Settings</h2>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>
                Upload Folder
              </label>
              <div className="flex items-center gap-2">
                <input
                  className="input flex-1"
                  defaultValue="/uploads"
                  readOnly
                />
                <button className="btn-secondary">Browse</button>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                All uploaded files are stored in this folder on the server
              </p>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>
                Maximum Upload Size: <span style={{ color: '#a855f7' }}>{maxUpload} MB</span>
              </label>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={maxUpload}
                onChange={(e) => setMaxUpload(parseInt(e.target.value))}
                className="w-full"
                style={{ accentColor: '#7c3aed' }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                <span>10 MB</span>
                <span>2000 MB</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <FiShield size={18} style={{ color: '#10b981' }} />
            <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Security</h2>
          </div>

          <div className="flex flex-col gap-4">
            <div
              className="flex items-center justify-between p-3 rounded-10"
              style={{ background: 'var(--bg-elevated)' }}
            >
              <div>
                <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                  Block Executable Files
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Prevent upload of .exe, .bat, .cmd files
                </div>
              </div>
              <div
                className="w-12 h-6 rounded-full flex items-center px-1 cursor-pointer"
                style={{ background: '#10b981' }}
              >
                <div
                  className="w-4 h-4 rounded-full bg-white"
                  style={{ marginLeft: 'auto' }}
                />
              </div>
            </div>

            <div
              className="flex items-center justify-between p-3 rounded-10"
              style={{ background: 'var(--bg-elevated)' }}
            >
              <div>
                <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                  Path Traversal Protection
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Block attempts to access outside upload folder
                </div>
              </div>
              <div
                className="w-12 h-6 rounded-full flex items-center px-1 cursor-pointer"
                style={{ background: '#10b981' }}
              >
                <div
                  className="w-4 h-4 rounded-full bg-white"
                  style={{ marginLeft: 'auto' }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Auto Delete */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <FiTrash2 size={18} style={{ color: '#f59e0b' }} />
            <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Auto Delete</h2>
          </div>

          <div
            className="flex items-center justify-between p-3 rounded-10 mb-4"
            style={{ background: 'var(--bg-elevated)' }}
          >
            <div>
              <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                Auto-delete old files
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Automatically remove files older than specified days
              </div>
            </div>
            <div
              className="w-12 h-6 rounded-full flex items-center px-1 cursor-pointer"
              style={{ background: autoDelete ? '#7c3aed' : 'var(--border-color-strong)' }}
              onClick={() => setAutoDelete(v => !v)}
            >
              <div
                className="w-4 h-4 rounded-full bg-white transition-all"
                style={{ marginLeft: autoDelete ? 'auto' : 0 }}
              />
            </div>
          </div>

          {autoDelete && (
            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>
                Delete files older than: <span style={{ color: '#a855f7' }}>{autoDeleteDays} days</span>
              </label>
              <input
                type="range"
                min="1"
                max="365"
                value={autoDeleteDays}
                onChange={(e) => setAutoDeleteDays(parseInt(e.target.value))}
                className="w-full"
                style={{ accentColor: '#7c3aed' }}
              />
            </div>
          )}
        </motion.div>

        {/* Save button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button className="btn-primary w-full py-3 text-base justify-center" onClick={handleSave}>
            <FiSave size={18} />
            Save Settings
          </button>
        </motion.div>
      </div>
    </div>
  );
}
