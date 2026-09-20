import axios from 'axios';
import { API_BASE } from '../constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor — normalize error messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// ─── File APIs ────────────────────────────────────────────────────

/**
 * Lists files with optional filters
 */
export const getFiles = (params = {}) => api.get('/files', { params });

/**
 * Gets single file metadata
 */
export const getFile = (id) => api.get(`/file/${id}`);

/**
 * Uploads one or more files with progress callback
 */
export const uploadFiles = (formData, onProgress) => {
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0, // No timeout for uploads
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress(percent, e.loaded, e.total);
      }
    },
  });
};

/**
 * Deletes a file
 */
export const deleteFile = (id) => api.delete(`/file/${id}`);

/**
 * Renames a file
 */
export const renameFile = (id, newName) => api.put(`/rename/${id}`, { newName });

/**
 * Gets the download URL for a file
 */
export const getDownloadUrl = (id) => `${API_BASE}/download/${id}`;

/**
 * Gets the preview URL for a file
 */
export const getPreviewUrl = (id) => `${API_BASE}/preview/${id}`;

/**
 * Updates file metadata (favorites, tags, notes)
 */
export const updateFileMeta = (id, updates) => api.put(`/file/${id}/meta`, updates);

/**
 * Bulk delete files
 */
export const bulkDelete = (ids) => api.post('/bulk-delete', { ids });

/**
 * Bulk download as zip
 */
export const bulkDownloadUrl = () => `${API_BASE}/bulk-download`;

// ─── Stats APIs ───────────────────────────────────────────────────

/**
 * Gets server statistics
 */
export const getStats = () => api.get('/stats');

// ─── Devices APIs ─────────────────────────────────────────────────

/**
 * Gets connected devices
 */
export const getDevices = () => api.get('/devices');

export default api;
