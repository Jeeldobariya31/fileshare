const fs = require('fs');
const os = require('os');
const { getAllFiles, UPLOADS_DIR } = require('./fileService');
const { formatBytes } = require('../utils/fileUtils');

// Disk stats removed for privacy

/**
 * Computes upload directory size
 */
function getUploadsSize() {
  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    let totalSize = 0;
    for (const file of files) {
      if (file.endsWith('.meta.json')) continue;
      try {
        const stat = fs.statSync(`${UPLOADS_DIR}/${file}`);
        totalSize += stat.size;
      } catch {
        // skip
      }
    }
    return totalSize;
  } catch {
    return 0;
  }
}

/**
 * Returns full server statistics
 */
function getStats() {
  const files = getAllFiles();
  const uploadsSize = getUploadsSize();

  // Count by category
  const categoryCounts = {};
  for (const file of files) {
    const cat = file.category || 'other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  return {
    totalFiles: files.length,
    uploadsSize,
    uploadsSizeFormatted: formatBytes(uploadsSize),
    categories: {
      image: categoryCounts.image || 0,
      video: categoryCounts.video || 0,
      audio: categoryCounts.audio || 0,
      pdf: categoryCounts.pdf || 0,
      document: categoryCounts.document || 0,
      spreadsheet: categoryCounts.spreadsheet || 0,
      presentation: categoryCounts.presentation || 0,
      archive: categoryCounts.archive || 0,
      code: categoryCounts.code || 0,
      text: categoryCounts.text || 0,
      other: categoryCounts.other || 0,
    },
    recentFiles: files.slice(0, 10),
    systemInfo: {
      platform: os.platform(),
      hostname: os.hostname(),
      cpus: os.cpus().length,
      totalMemory: formatBytes(os.totalmem()),
      freeMemory: formatBytes(os.freemem()),
      uptime: Math.floor(os.uptime()),
    },
  };
}

module.exports = { getStats, getUploadsSize };
