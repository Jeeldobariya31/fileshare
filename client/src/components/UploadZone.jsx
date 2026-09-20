import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFolderPlus, FiFile } from 'react-icons/fi';
import { formatBytes } from '../utils/fileUtils';

/**
 * Drag & Drop upload zone
 */
export default function UploadZone({ onFilesSelected, isUploading, maxSizeMB = 500 }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles);
    }
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: true,
    disabled: isUploading,
  });

  return (
    <motion.div
      {...getRootProps()}
      className={`dropzone flex flex-col items-center justify-center py-16 px-8 text-center cursor-pointer select-none
        ${isDragActive ? 'active' : ''}
        ${isDragReject ? 'border-red-500 bg-red-500/5' : ''}
        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      whileHover={!isUploading ? { scale: 1.01 } : undefined}
      whileTap={!isUploading ? { scale: 0.99 } : undefined}
    >
      <input {...getInputProps()} id="upload-dropzone-input" />

      {/* Animated icon */}
      <motion.div
        className="mb-6"
        animate={isDragActive ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
          style={{
            background: isDragReject
              ? 'rgba(239,68,68,0.15)'
              : 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))',
            border: isDragReject
              ? '2px solid #ef4444'
              : '2px solid rgba(124,58,237,0.4)',
          }}
        >
          <motion.div
            animate={isDragActive ? { y: [-5, 5, -5] } : { y: 0 }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <FiUploadCloud
              size={40}
              style={{
                color: isDragReject ? '#ef4444' : isDragActive ? '#06b6d4' : '#7c3aed',
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Text */}
      <AnimatePresence mode="wait">
        {isDragActive && !isDragReject ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: '#06b6d4' }}>
              Drop files here!
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>Release to upload</p>
          </motion.div>
        ) : isDragReject ? (
          <motion.div
            key="reject"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: '#ef4444' }}>
              File too large!
            </h3>
            <p style={{ color: '#ef4444' }}>Maximum size: {maxSizeMB}MB</p>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h3 className="text-xl font-bold mb-2 gradient-text">
              Drag & Drop Files Here
            </h3>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              or click to browse your computer
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div
                className="flex items-center gap-2 px-5 py-2.5 rounded-10 text-sm font-medium"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  color: 'white',
                }}
              >
                <FiFile size={15} />
                Select Files
              </div>
              <div
                className="flex items-center gap-2 px-5 py-2.5 rounded-10 text-sm font-medium"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color-strong)',
                  color: 'var(--text-secondary)',
                }}
              >
                <FiFolderPlus size={15} />
                Select Folder
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6 flex-wrap justify-center">
              {['Images', 'Videos', 'Documents', 'Archives', 'Code'].map(type => (
                <span
                  key={type}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(124, 58, 237, 0.1)',
                    color: '#a855f7',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                  }}
                >
                  {type}
                </span>
              ))}
            </div>

            <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
              Maximum {maxSizeMB}MB per file • Up to 20 files at once
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
