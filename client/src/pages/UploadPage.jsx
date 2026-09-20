import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUploadCloud, FiX, FiCheck, FiAlertCircle, FiRotateCcw,
  FiClock, FiZap, FiTrash2
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import UploadZone from '../components/UploadZone';
import { useUpload, UPLOAD_STATUS } from '../hooks/useUpload';
import { formatBytes } from '../utils/fileUtils';

/**
 * Single upload item in the progress list
 */
function UploadItem({ upload, onRetry, onRemove }) {
  const isSuccess = upload.status === UPLOAD_STATUS.SUCCESS;
  const isError = upload.status === UPLOAD_STATUS.ERROR;
  const isUploading = upload.status === UPLOAD_STATUS.UPLOADING;
  const isCancelled = upload.status === UPLOAD_STATUS.CANCELLED;

  return (
    <motion.div
      className="glass-card-sm p-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
    >
      <div className="flex items-start gap-3">
        {/* Status icon */}
        <div
          className="w-8 h-8 rounded-8 flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{
            background: isSuccess ? 'rgba(16,185,129,0.15)'
              : isError || isCancelled ? 'rgba(239,68,68,0.15)'
              : 'rgba(124,58,237,0.15)',
          }}
        >
          {isSuccess && <FiCheck size={16} style={{ color: '#10b981' }} />}
          {isError && <FiAlertCircle size={16} style={{ color: '#ef4444' }} />}
          {isCancelled && <FiX size={16} style={{ color: '#ef4444' }} />}
          {isUploading && (
            <div
              className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full"
              style={{ animation: 'spin-slow 0.8s linear infinite' }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Filename */}
          <div
            className="font-medium text-sm truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {upload.name}
          </div>

          {/* Size */}
          <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            {formatBytes(upload.size)}
            {isUploading && upload.speed > 0 && (
              <span> • {formatBytes(upload.speed)}/s</span>
            )}
          </div>

          {/* Progress bar */}
          {isUploading && (
            <div className="mb-1.5">
              <div className="progress-track">
                <motion.div
                  className="progress-fill"
                  style={{ width: `${upload.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {upload.timeLeft}
                </span>
                <span className="text-xs font-bold" style={{ color: '#a855f7' }}>
                  {upload.progress}%
                </span>
              </div>
            </div>
          )}

          {/* Error message */}
          {isError && (
            <div className="text-xs mt-1" style={{ color: '#ef4444' }}>
              {upload.error}
            </div>
          )}

          {/* Status labels */}
          {isSuccess && (
            <span className="badge badge-green text-[10px]">Uploaded</span>
          )}
          {isCancelled && (
            <span className="badge badge-red text-[10px]">Cancelled</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {isError && (
            <button
              className="btn-icon"
              onClick={() => onRetry?.(upload)}
              data-tooltip="Retry"
            >
              <FiRotateCcw size={14} />
            </button>
          )}
          {(isSuccess || isError || isCancelled) && (
            <button
              className="btn-icon"
              onClick={() => onRemove?.(upload.id)}
              data-tooltip="Remove"
            >
              <FiX size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function UploadPage() {
  const navigate = useNavigate();

  const { uploads, isUploading, upload, cancelUpload, clearUploads, removeUpload } = useUpload(
    () => {
      // Auto navigate to files after upload
      // setTimeout(() => navigate('/files'), 2000);
    }
  );

  const handleFiles = (files) => {
    upload(files);
  };

  const handleRetry = (uploadItem) => {
    upload([uploadItem.file]);
  };

  const activeUploads = uploads.filter(u => u.status === UPLOAD_STATUS.UPLOADING);
  const completedUploads = uploads.filter(u => u.status !== UPLOAD_STATUS.UPLOADING);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-black gradient-text mb-1">Upload Files</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Share files with all devices on your local network
        </p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <UploadZone onFilesSelected={handleFiles} isUploading={isUploading} />
      </motion.div>

      {/* Upload info cards */}
      <motion.div
        className="grid grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { icon: FiUploadCloud, label: 'Max file size', value: '500 MB' },
          { icon: FiZap, label: 'Max files at once', value: '20 files' },
          { icon: FiClock, label: 'Files stay', value: 'Until deleted' },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="glass-card-sm p-4 text-center"
          >
            <Icon size={20} style={{ color: '#a855f7', margin: '0 auto 8px' }} />
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
            <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{value}</div>
          </div>
        ))}
      </motion.div>

      {/* Active Uploads */}
      <AnimatePresence>
        {activeUploads.length > 0 && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Uploading ({activeUploads.length})
              </h2>
              <button className="btn-danger text-sm py-1.5 px-3" onClick={cancelUpload}>
                <FiX size={14} />
                Cancel All
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {activeUploads.map(u => (
                <UploadItem key={u.id} upload={u} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload History */}
      <AnimatePresence>
        {completedUploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Upload History ({completedUploads.length})
              </h2>
              <button className="btn-secondary text-sm py-1.5 px-3" onClick={clearUploads}>
                <FiTrash2 size={14} />
                Clear History
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {completedUploads.map(u => (
                  <UploadItem
                    key={u.id}
                    upload={u}
                    onRetry={handleRetry}
                    onRemove={removeUpload}
                  />
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-6 text-center">
              <button
                className="btn-primary"
                onClick={() => navigate('/files')}
              >
                View Uploaded Files →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
