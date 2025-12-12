const fs = require('fs');
const path = require('path');

const DOCUMENTS_PATH = 'C:\\Users\\Priyal.Makwana\\Acorn Solution\\Facilities - Insurance_portal Claims';

/**
 * Clean up duplicate files that might have been created by multiple form submissions
 * This function identifies files with similar names and keeps only the most recent one
 */
const cleanupDuplicateFiles = () => {
  try {
    if (!fs.existsSync(DOCUMENTS_PATH)) {
      console.log('Documents directory does not exist');
      return;
    }

    const files = fs.readdirSync(DOCUMENTS_PATH);
    const fileGroups = {};

    // Group files by their base name (without timestamp and random suffix)
    files.forEach(filename => {
      // Extract the base name from filename pattern: TIMESTAMP-RANDOM-BASENAME.ext
      const match = filename.match(/^\d+-\d+-(.+)$/);
      if (match) {
        const baseName = match[1];
        if (!fileGroups[baseName]) {
          fileGroups[baseName] = [];
        }
        fileGroups[baseName].push({
          filename,
          fullPath: path.join(DOCUMENTS_PATH, filename),
          stats: fs.statSync(path.join(DOCUMENTS_PATH, filename))
        });
      }
    });

    // For each group, keep only the most recent file and delete others
    Object.keys(fileGroups).forEach(baseName => {
      const group = fileGroups[baseName];
      if (group.length > 1) {
        // Sort by creation time (most recent first)
        group.sort((a, b) => b.stats.birthtime - a.stats.birthtime);
        
        // Keep the first (most recent) file, delete the rest
        for (let i = 1; i < group.length; i++) {
          try {
            fs.unlinkSync(group[i].fullPath);
            console.log(`Deleted duplicate file: ${group[i].filename}`);
          } catch (err) {
            console.error(`Error deleting file ${group[i].filename}:`, err);
          }
        }
      }
    });

    console.log('File cleanup completed');
  } catch (err) {
    console.error('Error during file cleanup:', err);
  }
};

module.exports = { cleanupDuplicateFiles };