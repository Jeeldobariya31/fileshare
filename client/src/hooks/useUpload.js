import { useState, useRef, useCallback } from 'react';
import { uploadFiles as apiUpload } from '../services/api';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

/**
 * Upload status enum
 */
export const UPLOAD_STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
  CANCELLED: 'cancelled',
};

/**
 * Custom hook for managing file uploads with progress tracking
 */
export function useUpload(onSuccess) {
  const [uploads, setUploads] = useState([]); // List of all upload attempts
  const [isUploading, setIsUploading] = useState(false);
  const { emit } = useSocket();
  const abortControllerRef = useRef(null);

  /**
   * Starts upload for an array of File objects
   */
  const upload = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    // Create upload entries
    const uploadEntries = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: UPLOAD_STATUS.UPLOADING,
      startTime: Date.now(),
      speed: 0,
      timeLeft: 'Calculating...',
      result: null,
      error: null,
    }));

    setUploads(prev => [...uploadEntries, ...prev]);
    setIsUploading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    let lastLoaded = 0;
    let lastTime = Date.now();

    try {
      abortControllerRef.current = new AbortController();

      const res = await apiUpload(formData, (percent, loaded, total) => {
        const now = Date.now();
        const elapsed = (now - lastTime) / 1000;
        const speed = elapsed > 0 ? (loaded - lastLoaded) / elapsed : 0;
        lastLoaded = loaded;
        lastTime = now;

        const remaining = speed > 0 ? (total - loaded) / speed : 0;
        const timeLeft = remaining < 60
          ? `${Math.round(remaining)}s remaining`
          : `${Math.round(remaining / 60)}m remaining`;

        setUploads(prev => prev.map(u =>
          uploadEntries.some(e => e.id === u.id)
            ? { ...u, progress: percent, speed, timeLeft }
            : u
        ));

        // Emit progress via socket
        emit('upload:progress', { percent, loaded, total });
      });

      // Update entries with results
      setUploads(prev => prev.map(u => {
        if (!uploadEntries.some(e => e.id === u.id)) return u;
        const matchedResult = res.data?.find(r => r.originalName === u.name);
        return {
          ...u,
          progress: 100,
          status: UPLOAD_STATUS.SUCCESS,
          result: matchedResult,
        };
      }));

      toast.success(`✅ ${files.length} file(s) uploaded successfully!`);

      if (onSuccess) onSuccess(res.data);

    } catch (err) {
      if (err.name === 'AbortError' || err.message === 'canceled') {
        setUploads(prev => prev.map(u =>
          uploadEntries.some(e => e.id === u.id)
            ? { ...u, status: UPLOAD_STATUS.CANCELLED }
            : u
        ));
        toast.error('Upload cancelled');
      } else {
        setUploads(prev => prev.map(u =>
          uploadEntries.some(e => e.id === u.id)
            ? { ...u, status: UPLOAD_STATUS.ERROR, error: err.message }
            : u
        ));
        toast.error(`Upload failed: ${err.message}`);
      }
    } finally {
      setIsUploading(false);
    }
  }, [emit, onSuccess]);

  /**
   * Cancels the current upload
   */
  const cancelUpload = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  /**
   * Clears upload history
   */
  const clearUploads = useCallback(() => {
    setUploads([]);
  }, []);

  /**
   * Removes a single upload from history
   */
  const removeUpload = useCallback((id) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  }, []);

  return {
    uploads,
    isUploading,
    upload,
    cancelUpload,
    clearUploads,
    removeUpload,
  };
}
