import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { FiX, FiCopy, FiCheck, FiDownload } from 'react-icons/fi';
import { copyToClipboard } from '../utils/fileUtils';
import toast from 'react-hot-toast';

/**
 * QR Code sharing modal
 */
export default function QRModal({ url, title, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="modal-content p-8 text-center"
          style={{ minWidth: '320px', maxWidth: '400px' }}
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 280, damping: 25 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold gradient-text">Share via QR Code</h3>
            <button className="btn-icon" onClick={onClose}>
              <FiX size={18} />
            </button>
          </div>

          {/* File name */}
          {title && (
            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              {title}
            </p>
          )}

          {/* QR Code */}
          <div
            className="mx-auto mb-6 p-4 rounded-16 inline-block"
            style={{
              background: 'white',
              boxShadow: '0 8px 32px rgba(124, 58, 237, 0.2)',
            }}
          >
            <QRCodeSVG
              value={url}
              size={200}
              level="H"
              fgColor="#1a1a2e"
              bgColor="white"
            />
          </div>

          {/* URL display */}
          <div
            className="flex items-center gap-2 p-3 rounded-10 mb-4 text-left"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-color-strong)',
            }}
          >
            <span
              className="flex-1 text-xs font-mono truncate"
              style={{ color: 'var(--text-secondary)' }}
            >
              {url}
            </span>
            <motion.button
              className="btn-icon flex-shrink-0"
              onClick={handleCopy}
              whileTap={{ scale: 0.9 }}
            >
              {copied ? <FiCheck size={16} style={{ color: '#10b981' }} /> : <FiCopy size={16} />}
            </motion.button>
          </div>

          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Scan with any device on the same WiFi network
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
