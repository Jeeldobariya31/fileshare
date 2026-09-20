import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck } from 'react-icons/fi';

/**
 * Rename file modal
 */
export default function RenameModal({ file, onClose, onRename }) {
  const [newName, setNewName] = useState(file.originalName);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim() && newName.trim() !== file.originalName) {
      onRename(newName.trim());
    } else {
      onClose();
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
          className="modal-content p-6"
          style={{ width: '420px', maxWidth: '95vw' }}
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg gradient-text">Rename File</h3>
            <button className="btn-icon" onClick={onClose}><FiX size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                New filename
              </label>
              <input
                className="input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                placeholder="Enter new filename..."
                id="rename-input"
              />
            </div>

            <div className="flex items-center gap-3">
              <button type="button" className="btn-secondary flex-1" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={!newName.trim()}
              >
                <FiCheck size={16} />
                Rename
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
