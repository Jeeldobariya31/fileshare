import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiZoomIn, FiZoomOut, FiDownload, FiMaximize2 } from 'react-icons/fi';
import { getPreviewUrl, getDownloadUrl } from '../services/api';
import { getPreviewType, truncateMiddle } from '../utils/fileUtils';
import { triggerDownload } from '../utils/fileUtils';

/**
 * Preview modal supporting images, video, audio, PDF, and text/code
 */
export default function PreviewModal({ file, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [textContent, setTextContent] = useState('');
  const [textLoaded, setTextLoaded] = useState(false);
  const previewUrl = getPreviewUrl(file.id);
  const downloadUrl = getDownloadUrl(file.id);
  const previewType = getPreviewType(file.originalName);

  // Load text content for text/code files
  const loadTextContent = useCallback(async () => {
    if (textLoaded) return;
    try {
      const res = await fetch(previewUrl);
      const text = await res.text();
      setTextContent(text.slice(0, 50000)); // Limit to 50k chars
      setTextLoaded(true);
    } catch {
      setTextContent('Failed to load file content.');
      setTextLoaded(true);
    }
  }, [previewUrl, textLoaded]);

  // Load text when type is text
  if ((previewType === 'text') && !textLoaded) {
    loadTextContent();
  }

  const renderPreview = () => {
    switch (previewType) {
      case 'image':
        return (
          <div className="flex items-center justify-center h-full overflow-auto p-4">
            <motion.img
              src={previewUrl}
              alt={file.originalName}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                transform: `scale(${zoom})`,
                transition: 'transform 0.2s ease',
                borderRadius: 8,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: zoom }}
              drag
              dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            />
          </div>
        );

      case 'video':
        return (
          <div className="flex items-center justify-center p-4">
            <video
              src={previewUrl}
              controls
              autoPlay={false}
              style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 12 }}
            />
          </div>
        );

      case 'audio':
        return (
          <div className="flex flex-col items-center justify-center p-12 gap-6">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center animate-pulse-glow"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              <span className="text-5xl">🎵</span>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                {truncateMiddle(file.originalName, 30)}
              </div>
            </div>
            <audio
              src={previewUrl}
              controls
              style={{ width: '100%', maxWidth: '400px' }}
            />
          </div>
        );

      case 'pdf':
        return (
          <div style={{ height: '75vh', width: '100%' }}>
            <iframe
              src={`${previewUrl}#toolbar=1&navpanes=1`}
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: 8 }}
              title={file.originalName}
            />
          </div>
        );

      case 'text':
        return (
          <div style={{ maxHeight: '70vh', overflow: 'auto', padding: '16px' }}>
            {textLoaded ? (
              <pre
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}
              >
                {textContent}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="text-center" style={{ color: 'var(--text-muted)' }}>
                  <div className="animate-spin text-3xl mb-2">⚙️</div>
                  Loading...
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center p-12 gap-4">
            <div className="text-6xl">📄</div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Preview not available for this file type.
            </p>
            <button
              className="btn-primary"
              onClick={() => triggerDownload(downloadUrl, file.originalName)}
            >
              <FiDownload size={16} />
              Download to view
            </button>
          </div>
        );
    }
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
          className="modal-content"
          style={{ width: '90vw', maxWidth: '1000px' }}
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 280, damping: 25 }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4"
            style={{ borderBottom: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl">
                {previewType === 'image' ? '🖼️'
                  : previewType === 'video' ? '🎬'
                  : previewType === 'audio' ? '🎵'
                  : previewType === 'pdf' ? '📕'
                  : previewType === 'text' ? '📄'
                  : '📁'}
              </span>
              <div className="min-w-0">
                <div
                  className="font-semibold text-sm truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {file.originalName}
                </div>
                <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {file.extension} • {previewType || 'file'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Zoom controls for images */}
              {previewType === 'image' && (
                <>
                  <button
                    className="btn-icon"
                    onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                    data-tooltip="Zoom out"
                  >
                    <FiZoomOut size={16} />
                  </button>
                  <span className="text-xs" style={{ color: 'var(--text-muted)', minWidth: '40px', textAlign: 'center' }}>
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    className="btn-icon"
                    onClick={() => setZoom(z => Math.min(4, z + 0.25))}
                    data-tooltip="Zoom in"
                  >
                    <FiZoomIn size={16} />
                  </button>
                </>
              )}

              {/* Download */}
              <button
                className="btn-icon"
                onClick={() => triggerDownload(downloadUrl, file.originalName)}
                data-tooltip="Download"
              >
                <FiDownload size={16} />
              </button>

              {/* Close */}
              <button className="btn-icon" onClick={onClose} data-tooltip="Close">
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Preview content */}
          <div style={{ background: 'var(--bg-base)' }}>
            {renderPreview()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
