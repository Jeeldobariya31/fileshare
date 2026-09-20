import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiDownload, FiEye, FiTrash2, FiEdit2, FiLink, FiShare2,
  FiStar, FiMoreVertical, FiCheck, FiHeart, FiLock
} from 'react-icons/fi';
import { formatBytes, formatDate, getCategoryIcon, getCategoryClass, truncateMiddle, triggerDownload } from '../utils/fileUtils';
import { getDownloadUrl, getPreviewUrl } from '../services/api';
import { copyToClipboard } from '../utils/fileUtils';
import toast from 'react-hot-toast';
import PreviewModal from './PreviewModal';
import QRModal from './QRModal';
import RenameModal from './RenameModal';
import { useHost } from '../context/HostContext';

/**
 * File card for grid view
 */
export function FileCard({ file, onDelete, onRename, onFavorite, onSelect, isSelected }) {
  const [showPreview, setShowPreview] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const { isHost } = useHost();

  const downloadUrl = getDownloadUrl(file.id);
  const shareUrl = `${window.location.protocol}//${window.location.hostname}:5000/api/download/${file.id}`;
  const previewUrl = getPreviewUrl(file.id);
  const categoryClass = getCategoryClass(file.category);

  const handleCopyLink = async () => {
    await copyToClipboard(shareUrl);
    toast.success('Download link copied!');
  };

  const isImage = file.category === 'image';

  return (
    <>
      <motion.div
        className={`card relative overflow-hidden group ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
        layout
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        {/* Select checkbox */}
        {onSelect && (
          <button
            className="absolute top-2 left-2 z-10 w-6 h-6 rounded-md flex items-center justify-center transition-all"
            style={{
              background: isSelected ? 'var(--color-primary)' : 'rgba(0,0,0,0.5)',
              border: `2px solid ${isSelected ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)'}`,
              opacity: isSelected ? 1 : 0,
            }}
            onClick={() => onSelect(file.id)}
          >
            {isSelected && <FiCheck size={12} color="white" />}
          </button>
        )}

        {/* Favorite indicator */}
        {file.isFavorite && (
          <div className="absolute top-2 right-2 z-10">
            <FiHeart size={14} style={{ color: '#ef4444', fill: '#ef4444' }} />
          </div>
        )}

        {/* Thumbnail / Icon area */}
        <div
          className="flex items-center justify-center relative overflow-hidden"
          style={{
            height: '120px',
            background: 'var(--bg-elevated)',
            cursor: file.isPreviewable ? 'pointer' : 'default',
          }}
          onClick={() => file.isPreviewable && setShowPreview(true)}
        >
          {isImage ? (
            <img
              src={previewUrl}
              alt={file.originalName}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`flex items-center justify-center w-full h-full ${categoryClass}`}
            style={{ display: isImage ? 'none' : 'flex' }}
          >
            <div style={{ fontSize: 40 }}>
              {getCategoryIcon(file.category, 40)}
            </div>
          </div>

          {/* Preview overlay on hover */}
          {file.isPreviewable && (
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(0,0,0,0.5)' }}
            >
              <FiEye size={24} color="white" />
            </div>
          )}
        </div>

        {/* File info */}
        <div className="p-3">
          <div
            className="font-medium text-sm mb-1 truncate"
            style={{ color: 'var(--text-primary)' }}
            title={file.originalName}
          >
            {truncateMiddle(file.originalName, 22)}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="badge badge-purple text-[10px]">{file.extension?.toUpperCase()}</span>
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {formatBytes(file.size)}
            </div>
          </div>

          <div className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {formatDate(file.uploadDate)}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 mt-3">
            <button
              className="btn-icon flex-1 justify-center"
              onClick={() => triggerDownload(downloadUrl, file.originalName)}
              title="Download"
            >
              <FiDownload size={14} />
            </button>
            {file.isPreviewable && (
              <button
                className="btn-icon flex-1 justify-center"
                onClick={() => setShowPreview(true)}
                title="Preview"
              >
                <FiEye size={14} />
              </button>
            )}

            {/* Host-only actions */}
            {isHost ? (
              <>
                <button
                  className="btn-icon flex-1 justify-center"
                  onClick={() => onFavorite?.(file)}
                  title="Favorite"
                >
                  <FiHeart
                    size={14}
                    style={{ fill: file.isFavorite ? '#ef4444' : 'none', color: file.isFavorite ? '#ef4444' : undefined }}
                  />
                </button>
                <button
                  className="btn-icon flex-1 justify-center relative"
                  onClick={() => setShowActions(v => !v)}
                  title="More actions"
                >
                  <FiMoreVertical size={14} />
                </button>
              </>
            ) : (
              /* Guest device — show lock instead of management controls */
              <div
                className="flex-1 flex items-center justify-center gap-1 text-[10px] rounded-8 py-1"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  color: 'var(--text-muted)',
                  border: '1px dashed rgba(239,68,68,0.25)',
                }}
                title="Only the host device can manage files"
              >
                <FiLock size={10} />
                Host only
              </div>
            )}

            {/* Dropdown — only shows for host */}
            <AnimatePresence>
              {isHost && showActions && (
                <motion.div
                  className="absolute bottom-12 right-2 z-20 rounded-12 overflow-hidden shadow-xl"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color-strong)',
                    minWidth: '160px',
                  }}
                  initial={{ opacity: 0, scale: 0.9, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 8 }}
                >
                  {[
                    { icon: FiEdit2, label: 'Rename', action: () => { setShowRename(true); setShowActions(false); } },
                    { icon: FiLink, label: 'Copy Link', action: () => { handleCopyLink(); setShowActions(false); } },
                    { icon: FiShare2, label: 'QR Code', action: () => { setShowQR(true); setShowActions(false); } },
                    { icon: FiTrash2, label: 'Delete', action: () => { onDelete?.(file.id); setShowActions(false); }, danger: true },
                  ].map(({ icon: Icon, label, action, danger }) => (
                    <button
                      key={label}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-card-hover)]"
                      style={{ color: danger ? '#ef4444' : 'var(--text-secondary)' }}
                      onClick={action}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      {showPreview && <PreviewModal file={file} onClose={() => setShowPreview(false)} />}
      {showQR && <QRModal url={shareUrl} title={file.originalName} onClose={() => setShowQR(false)} />}
      {showRename && (
        <RenameModal
          file={file}
          onClose={() => setShowRename(false)}
          onRename={(newName) => { onRename?.(file.id, newName); setShowRename(false); }}
        />
      )}
    </>
  );
}

/**
 * File row for list view
 */
export function FileRow({ file, onDelete, onRename, onFavorite, onSelect, isSelected }) {
  const [showPreview, setShowPreview] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const { isHost } = useHost();
  const downloadUrl = getDownloadUrl(file.id);
  const shareUrl = `${window.location.protocol}//${window.location.hostname}:5000/api/download/${file.id}`;
  const categoryClass = getCategoryClass(file.category);

  const handleCopyLink = async () => {
    await copyToClipboard(shareUrl);
    toast.success('Download link copied!');
  };

  return (
    <>
      <motion.div
        className={`flex items-center gap-4 p-3 rounded-12 group transition-all cursor-default ${isSelected ? 'ring-1 ring-purple-500' : ''}`}
        style={{
          background: isSelected ? 'rgba(124, 58, 237, 0.08)' : 'var(--bg-card)',
          border: '1px solid var(--border-color)',
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        whileHover={{ background: 'var(--bg-card-hover)', borderColor: 'rgba(124,58,237,0.3)' }}
      >
        {/* Checkbox */}
        {onSelect && (
          <button
            className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: isSelected ? 'var(--color-primary)' : 'transparent',
              border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color-strong)'}`,
            }}
            onClick={() => onSelect(file.id)}
          >
            {isSelected && <FiCheck size={11} color="white" />}
          </button>
        )}

        {/* Icon */}
        <div className={`flex-shrink-0 ${categoryClass}`}>
          {getCategoryIcon(file.category, 22)}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div
            className="font-medium text-sm truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {file.originalName}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="badge badge-purple text-[10px]">{file.extension?.toUpperCase()}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{file.category}</span>
          </div>
        </div>

        {/* Size */}
        <div className="text-sm hidden sm:block flex-shrink-0" style={{ color: 'var(--text-secondary)', minWidth: '70px', textAlign: 'right' }}>
          {formatBytes(file.size)}
        </div>

        {/* Date */}
        <div className="text-xs hidden md:block flex-shrink-0" style={{ color: 'var(--text-muted)', minWidth: '80px', textAlign: 'right' }}>
          {formatDate(file.uploadDate)}
        </div>

        {/* Downloads */}
        <div className="text-xs hidden lg:block flex-shrink-0" style={{ color: 'var(--text-muted)', minWidth: '60px', textAlign: 'center' }}>
          {file.downloadCount || 0} DL
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="btn-icon"
            onClick={() => triggerDownload(downloadUrl, file.originalName)}
            title="Download"
          >
            <FiDownload size={14} />
          </button>
          {file.isPreviewable && (
            <button
              className="btn-icon"
              onClick={() => setShowPreview(true)}
              title="Preview"
            >
              <FiEye size={14} />
            </button>
          )}
          <button
            className="btn-icon"
            onClick={handleCopyLink}
            title="Copy Link"
          >
            <FiLink size={14} />
          </button>
          <button
            className="btn-icon"
            onClick={() => setShowQR(true)}
            title="QR Code"
          >
            <FiShare2 size={14} />
          </button>

          {/* Host-only management actions */}
          {isHost ? (
            <>
              <button
                className="btn-icon"
                onClick={() => onFavorite?.(file)}
                title="Favorite"
              >
                <FiHeart
                  size={14}
                  style={{ fill: file.isFavorite ? '#ef4444' : 'none', color: file.isFavorite ? '#ef4444' : undefined }}
                />
              </button>
              <button
                className="btn-icon"
                onClick={() => setShowRename(true)}
                title="Rename"
              >
                <FiEdit2 size={14} />
              </button>
              <button
                className="btn-danger"
                onClick={() => onDelete?.(file.id)}
                title="Delete"
              >
                <FiTrash2 size={14} />
              </button>
            </>
          ) : (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-8 text-[10px]"
              style={{
                background: 'rgba(239,68,68,0.08)',
                color: 'var(--text-muted)',
                border: '1px dashed rgba(239,68,68,0.2)',
              }}
              title="Only the host device can manage files"
            >
              <FiLock size={10} />
              Host only
            </div>
          )}
        </div>
      </motion.div>

      {showPreview && <PreviewModal file={file} onClose={() => setShowPreview(false)} />}
      {showQR && <QRModal url={shareUrl} title={file.originalName} onClose={() => setShowQR(false)} />}
      {showRename && (
        <RenameModal
          file={file}
          onClose={() => setShowRename(false)}
          onRename={(newName) => { onRename?.(file.id, newName); setShowRename(false); }}
        />
      )}
    </>
  );
}
