import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiList, FiSearch, FiFilter, FiTrash2,
  FiDownload, FiX, FiRefreshCw, FiHeart, FiStar
} from 'react-icons/fi';
import { useFiles } from '../hooks/useFiles';
import { FileCard, FileRow } from '../components/FileCard';
import { debounce } from '../utils/fileUtils';
import axios from 'axios';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: '', label: 'All Files' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'audio', label: 'Audio' },
  { value: 'pdf', label: 'PDF' },
  { value: 'document', label: 'Documents' },
  { value: 'spreadsheet', label: 'Spreadsheets' },
  { value: 'presentation', label: 'Presentations' },
  { value: 'archive', label: 'Archives' },
  { value: 'code', label: 'Code' },
  { value: 'text', label: 'Text' },
  { value: 'other', label: 'Others' },
];

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest First', sortBy: 'date', sortOrder: 'desc' },
  { value: 'date-asc', label: 'Oldest First', sortBy: 'date', sortOrder: 'asc' },
  { value: 'size-desc', label: 'Largest First', sortBy: 'size', sortOrder: 'desc' },
  { value: 'size-asc', label: 'Smallest First', sortBy: 'size', sortOrder: 'asc' },
  { value: 'name-asc', label: 'Name A–Z', sortBy: 'name', sortOrder: 'asc' },
  { value: 'name-desc', label: 'Name Z–A', sortBy: 'name', sortOrder: 'desc' },
];

export default function FilesPage() {
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('date-desc');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const sortOption = SORT_OPTIONS.find(s => s.value === sort) || SORT_OPTIONS[0];

  const { files, loading, error, fetchFiles, deleteFile, renameFile, toggleFavorite, bulkDeleteFiles } = useFiles({
    category,
    search,
    sortBy: sortOption.sortBy,
    sortOrder: sortOption.sortOrder,
    favorites: favoritesOnly ? 'true' : undefined,
  });

  // Debounced search
  const handleSearch = useCallback(
    debounce((val) => {
      fetchFiles({ search: val, category, sortBy: sortOption.sortBy, sortOrder: sortOption.sortOrder });
    }, 300),
    [category, sortOption]
  );

  const handleSearchChange = (val) => {
    setSearch(val);
    handleSearch(val);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    fetchFiles({ search, category: cat, sortBy: sortOption.sortBy, sortOrder: sortOption.sortOrder });
  };

  const handleSortChange = (val) => {
    setSort(val);
    const opt = SORT_OPTIONS.find(s => s.value === val) || SORT_OPTIONS[0];
    fetchFiles({ search, category, sortBy: opt.sortBy, sortOrder: opt.sortOrder });
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    await bulkDeleteFiles([...selected]);
    setSelected(new Set());
  };

  const handleBulkDownload = async () => {
    if (selected.size === 0) return;
    try {
      const res = await axios.post('/api/bulk-download', { ids: [...selected] }, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `localshare-files-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Downloading ${selected.size} files as ZIP`);
    } catch {
      toast.error('Bulk download failed');
    }
  };

  const filteredFiles = favoritesOnly ? files.filter(f => f.isFavorite) : files;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6 flex-wrap gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-black gradient-text">Files</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
            {category && ` in ${category}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn-icon"
            onClick={() => fetchFiles({ search, category, sortBy: sortOption.sortBy, sortOrder: sortOption.sortOrder })}
            data-tooltip="Refresh"
          >
            <FiRefreshCw size={16} />
          </button>
          <button
            className={`btn-icon ${view === 'grid' ? 'ring-1 ring-purple-500' : ''}`}
            onClick={() => setView('grid')}
            data-tooltip="Grid view"
          >
            <FiGrid size={16} />
          </button>
          <button
            className={`btn-icon ${view === 'list' ? 'ring-1 ring-purple-500' : ''}`}
            onClick={() => setView('list')}
            data-tooltip="List view"
          >
            <FiList size={16} />
          </button>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        className="glass-card p-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 min-w-48">
            <FiSearch size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              className="input"
              placeholder="Search files..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              id="files-search-input"
            />
            {search && (
              <button className="btn-icon" onClick={() => handleSearchChange('')}>
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Category filter */}
          <select
            className="input"
            style={{ width: 'auto', minWidth: '140px' }}
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            id="files-category-filter"
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            className="input"
            style={{ width: 'auto', minWidth: '150px' }}
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            id="files-sort-select"
          >
            {SORT_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {/* Favorites toggle */}
          <button
            className={`btn-icon ${favoritesOnly ? 'ring-1 ring-red-400' : ''}`}
            onClick={() => setFavoritesOnly(v => !v)}
            data-tooltip="Favorites only"
          >
            <FiHeart size={16} style={{ fill: favoritesOnly ? '#ef4444' : 'none', color: favoritesOnly ? '#ef4444' : undefined }} />
          </button>
        </div>
      </motion.div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            className="glass-card p-3 mb-4 flex items-center gap-3 flex-wrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ borderColor: 'rgba(124,58,237,0.4)' }}
          >
            <span className="text-sm font-semibold" style={{ color: '#a855f7' }}>
              {selected.size} selected
            </span>
            <button className="btn-secondary text-sm py-1.5 px-3" onClick={handleBulkDownload}>
              <FiDownload size={14} />
              Download as ZIP
            </button>
            <button className="btn-danger text-sm py-1.5 px-3" onClick={handleBulkDelete}>
              <FiTrash2 size={14} />
              Delete All
            </button>
            <button
              className="btn-icon ml-auto"
              onClick={() => setSelected(new Set())}
            >
              <FiX size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {loading && (
        <div className={view === 'grid' ? 'files-grid' : 'flex flex-col gap-2'}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={view === 'grid' ? 'skeleton h-48 rounded-16' : 'skeleton h-14 rounded-12'} />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div
          className="glass-card p-8 text-center"
          style={{ borderColor: 'rgba(239,68,68,0.3)' }}
        >
          <div className="text-4xl mb-3">⚠️</div>
          <p style={{ color: '#ef4444' }}>{error}</p>
          <button
            className="btn-secondary mt-4"
            onClick={() => fetchFiles()}
          >
            <FiRefreshCw size={16} />
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredFiles.length === 0 && (
        <motion.div
          className="glass-card p-16 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {search ? 'No files match your search' : 'No files yet'}
          </h3>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            {search ? 'Try a different search term' : 'Upload some files to get started'}
          </p>
          {!search && (
            <a href="/upload" className="btn-primary">
              Upload Files
            </a>
          )}
        </motion.div>
      )}

      {/* File grid/list */}
      {!loading && !error && filteredFiles.length > 0 && (
        <>
          {view === 'grid' ? (
            <motion.div
              className="files-grid"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredFiles.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onDelete={deleteFile}
                    onRename={renameFile}
                    onFavorite={toggleFavorite}
                    onSelect={toggleSelect}
                    isSelected={selected.has(file.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* List header */}
              <div
                className="hidden md:flex items-center gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                <div className="w-5 flex-shrink-0" />
                <div className="w-6 flex-shrink-0" />
                <div className="flex-1">Name</div>
                <div style={{ minWidth: '70px', textAlign: 'right' }}>Size</div>
                <div style={{ minWidth: '80px', textAlign: 'right' }}>Date</div>
                <div style={{ minWidth: '60px', textAlign: 'center' }}>Downloads</div>
                <div style={{ minWidth: '200px' }}>Actions</div>
              </div>
              <AnimatePresence mode="popLayout">
                {filteredFiles.map((file) => (
                  <FileRow
                    key={file.id}
                    file={file}
                    onDelete={deleteFile}
                    onRename={renameFile}
                    onFavorite={toggleFavorite}
                    onSelect={toggleSelect}
                    isSelected={selected.has(file.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </div>
  );
}
