import {
  FiImage, FiFilm, FiMusic, FiFileText, FiFile, FiGrid,
  FiMonitor, FiArchive, FiCode, FiAlignLeft
} from 'react-icons/fi';
import { PREVIEWABLE_EXTS } from '../constants';

/**
 * Formats bytes into human-readable string
 */
export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Formats a date string into a friendly format
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Formats seconds into HH:MM:SS
 */
export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Returns the file extension
 */
export function getExtension(filename) {
  return (filename || '').split('.').pop().toLowerCase();
}

/**
 * Returns the file category
 */
export function getCategory(filename) {
  const ext = getExtension(filename);
  const categories = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'ico'],
    video: ['mp4', 'webm', 'ogg', 'avi', 'mkv', 'mov'],
    audio: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'],
    pdf: ['pdf'],
    document: ['doc', 'docx', 'odt', 'rtf'],
    spreadsheet: ['xls', 'xlsx', 'csv', 'ods'],
    presentation: ['ppt', 'pptx', 'odp'],
    archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
    code: ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'cs', 'php', 'rb', 'go', 'rs', 'html', 'css', 'json', 'xml', 'yaml', 'yml', 'sh', 'bat', 'sql'],
    text: ['txt', 'md', 'log', 'cfg', 'ini'],
  };
  for (const [cat, exts] of Object.entries(categories)) {
    if (exts.includes(ext)) return cat;
  }
  return 'other';
}

/**
 * Returns the icon component for a file category
 */
export function getCategoryIcon(category, size = 20) {
  const iconMap = {
    image: FiImage,
    video: FiFilm,
    audio: FiMusic,
    pdf: FiFileText,
    document: FiFile,
    spreadsheet: FiGrid,
    presentation: FiMonitor,
    archive: FiArchive,
    code: FiCode,
    text: FiAlignLeft,
    other: FiFile,
  };
  const Icon = iconMap[category] || FiFile;
  return <Icon size={size} />;
}

/**
 * Returns CSS class for category icon color
 */
export function getCategoryClass(category) {
  const map = {
    image: 'file-image',
    video: 'file-video',
    audio: 'file-audio',
    pdf: 'file-pdf',
    document: 'file-doc',
    spreadsheet: 'file-sheet',
    presentation: 'file-ppt',
    archive: 'file-archive',
    code: 'file-code',
    text: 'file-text',
    other: 'file-other',
  };
  return map[category] || 'file-other';
}

/**
 * Checks if a file can be previewed
 */
export function isPreviewable(filename) {
  const ext = getExtension(filename);
  return Object.values(PREVIEWABLE_EXTS).flat().includes(ext);
}

/**
 * Gets preview type for a file
 */
export function getPreviewType(filename) {
  const ext = getExtension(filename);
  for (const [type, exts] of Object.entries(PREVIEWABLE_EXTS)) {
    if (exts.includes(ext)) return type;
  }
  return null;
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return true;
  }
}

/**
 * Truncates a string in the middle: "verylongname...ext"
 */
export function truncateMiddle(str, maxLen = 25) {
  if (!str || str.length <= maxLen) return str;
  const extMatch = str.match(/\.[^.]+$/);
  const ext = extMatch ? extMatch[0] : '';
  const nameLen = maxLen - ext.length - 3;
  return str.slice(0, nameLen) + '...' + ext;
}

/**
 * Generates a download trigger for a URL
 */
export function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'download';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Debounce function
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Formats upload speed in MB/s or KB/s
 */
export function formatSpeed(bytesPerSecond) {
  if (bytesPerSecond >= 1024 * 1024) {
    return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
  }
  return `${(bytesPerSecond / 1024).toFixed(0)} KB/s`;
}

/**
 * Estimates remaining time for upload
 */
export function estimateTimeLeft(loaded, total, startTime) {
  const elapsed = (Date.now() - startTime) / 1000;
  if (elapsed === 0 || loaded === 0) return 'Calculating...';
  const speed = loaded / elapsed;
  const remaining = (total - loaded) / speed;
  if (remaining < 60) return `${Math.round(remaining)}s remaining`;
  return `${Math.round(remaining / 60)}m remaining`;
}
