const fs = require('fs').promises;
const path = require('path');

function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  let sourceStats;
  fs.stat(sourceDir)
    .then(() => (sourceStats = fs.stat(destDir)))
    .then((destStats) => {
      if (destStats.mtimeMs >= sourceStats.mtimeMs) {
        console.log('No need to copy.');
      }
    })
    .catch(async (error) => {
      if (error.code === 'ENOENT') {
        // Directory does not exist, proceed with copying
        await fs.mkdir(destDir, { recursive: true });
      } else {
        throw error;
      }
    })
    .then(async () => {
      fs.readdir(sourceDir, { withFileTypes: true }).then((items) => {
        items.forEach((item) => {
          const sourcePath = path.join(sourceDir, item.name);
          const destPath = path.join(destDir, item.name);
          if (item.isDirectory()) {
            copyDirRecursive(sourcePath, destPath);
          } else {
            fs.copyFile(sourcePath, destPath);
          }
        });
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function copyDirRecursive(sourceDir, destDir) {
  fs.mkdir(destDir, { recursive: true })
    .then(() => fs.readdir(sourceDir, { withFileTypes: true }))
    .then((items) => {
      items.forEach((item) => {
        const sourcePath = path.join(sourceDir, item.name);
        const destPath = path.join(destDir, item.name);
        if (item.isDirectory()) {
          copyDirRecursive(sourcePath, destPath);
        } else {
          fs.copyFile(sourcePath, destPath);
        }
      });
    });
}

copyDir();
