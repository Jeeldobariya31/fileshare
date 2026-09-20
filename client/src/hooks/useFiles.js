import { useState, useEffect, useCallback, useRef } from 'react';
import { getFiles as apiGetFiles, deleteFile as apiDelete, renameFile as apiRename, updateFileMeta as apiUpdateMeta, bulkDelete as apiBulkDelete } from '../services/api';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing file list operations
 */
export function useFiles(initialParams = {}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const { latestEvent } = useSocket();
  const paramsRef = useRef(initialParams);

  const fetchFiles = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGetFiles({ ...paramsRef.current, ...params });
      setFiles(res.data || []);
      setPagination(res.pagination || { page: 1, total: 0, totalPages: 1 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // React to socket events
  useEffect(() => {
    if (!latestEvent) return;

    if (latestEvent.type === 'file:uploaded') {
      setFiles(prev => {
        // Add if not already in list
        if (prev.some(f => f.id === latestEvent.data.id)) return prev;
        return [latestEvent.data, ...prev];
      });
    }

    if (latestEvent.type === 'file:deleted') {
      setFiles(prev => prev.filter(f => f.id !== latestEvent.data.id));
    }

    if (latestEvent.type === 'file:renamed') {
      setFiles(prev => prev.map(f =>
        f.id === latestEvent.data.id ? latestEvent.data : f
      ));
    }
  }, [latestEvent]);

  // Delete a file
  const deleteFile = useCallback(async (id) => {
    try {
      await apiDelete(id);
      setFiles(prev => prev.filter(f => f.id !== id));
      toast.success('File deleted successfully');
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  // Rename a file
  const renameFile = useCallback(async (id, newName) => {
    try {
      const res = await apiRename(id, newName);
      setFiles(prev => prev.map(f => f.id === id ? res.data : f));
      toast.success('File renamed successfully');
      return res.data;
    } catch (err) {
      toast.error(err.message);
      return null;
    }
  }, []);

  // Update metadata (favorites, tags, notes)
  const updateMeta = useCallback(async (id, updates) => {
    try {
      const res = await apiUpdateMeta(id, updates);
      setFiles(prev => prev.map(f => f.id === id ? res.data : f));
      return res.data;
    } catch (err) {
      toast.error(err.message);
      return null;
    }
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback(async (file) => {
    const res = await updateMeta(file.id, { isFavorite: !file.isFavorite });
    if (res) {
      toast.success(res.isFavorite ? 'Added to favorites' : 'Removed from favorites');
    }
  }, [updateMeta]);

  // Bulk delete
  const bulkDeleteFiles = useCallback(async (ids) => {
    try {
      await apiBulkDelete(ids);
      setFiles(prev => prev.filter(f => !ids.includes(f.id)));
      toast.success(`Deleted ${ids.length} file(s)`);
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  return {
    files,
    loading,
    error,
    pagination,
    fetchFiles,
    deleteFile,
    renameFile,
    updateMeta,
    toggleFavorite,
    bulkDeleteFiles,
  };
}
