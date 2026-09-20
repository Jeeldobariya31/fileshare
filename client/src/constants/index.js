// Environment detection
const isDev = import.meta.env.MODE === 'development';
const host = window.location.hostname;
const protocol = window.location.protocol;

// API base URL — talk directly to the server on port 5000 in dev to preserve real IPs
export const API_BASE = isDev ? `${protocol}//${host}:5000/api` : '/api';

// Socket.io server URL
export const SOCKET_URL = isDev ? `${protocol}//${host}:5000` : '/';

// File size limits
export const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

// Pagination
export const DEFAULT_PAGE_SIZE = 50;

// File categories with display info
export const FILE_CATEGORIES = {
  image: { label: 'Images', color: '#10b981', icon: 'FiImage' },
  video: { label: 'Videos', color: '#3b82f6', icon: 'FiFilm' },
  audio: { label: 'Audio', color: '#8b5cf6', icon: 'FiMusic' },
  pdf: { label: 'PDFs', color: '#ef4444', icon: 'FiFileText' },
  document: { label: 'Documents', color: '#3b82f6', icon: 'FiFile' },
  spreadsheet: { label: 'Spreadsheets', color: '#10b981', icon: 'FiGrid' },
  presentation: { label: 'Presentations', color: '#f59e0b', icon: 'FiMonitor' },
  archive: { label: 'Archives', color: '#f59e0b', icon: 'FiArchive' },
  code: { label: 'Code', color: '#06b6d4', icon: 'FiCode' },
  text: { label: 'Text', color: '#9090b0', icon: 'FiAlignLeft' },
  other: { label: 'Others', color: '#6b7280', icon: 'FiFile' },
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'size-desc', label: 'Largest First' },
  { value: 'size-asc', label: 'Smallest First' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
];

// Theme options
export const THEMES = ['dark', 'light', 'auto'];

// Preview-able extensions
export const PREVIEWABLE_EXTS = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
  video: ['mp4', 'webm', 'ogg'],
  audio: ['mp3', 'wav', 'ogg', 'flac', 'aac'],
  pdf: ['pdf'],
  text: ['txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'sh', 'log', 'csv', 'yaml', 'yml'],
};

// Navigation links
export const NAV_LINKS = [
  { path: '/', label: 'Home', icon: 'FiHome' },
  { path: '/files', label: 'Files', icon: 'FiFolder' },
  { path: '/upload', label: 'Upload', icon: 'FiUploadCloud' },
  { path: '/devices', label: 'Devices', icon: 'FiMonitor' },
  { path: '/settings', label: 'Settings', icon: 'FiSettings' },
  { path: '/about', label: 'About', icon: 'FiInfo' },
];
