const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  try {
    const sourceStats = await fs.stat(sourceDir);
    let destStats;
    try {
      destStats = await fs.stat(destDir);
      if (destStats.mtimeMs >= sourceStats.mtimeMs) {
        console.log('No need to copy.');
        return;
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(destDir, { recursive: true });
      } else {
        throw error;
      }
    }

    const sourceFiles = await fs.readdir(sourceDir, { withFileTypes: true });
    const destFiles = await fs.readdir(destDir, { withFileTypes: true });

    for (const file of destFiles) {
      if (!sourceFiles.some((f) => f.name === file.name)) {
        const destPath = path.join(destDir, file.name);
        await fs.rm(destPath, { recursive: true, force: true });
        console.log(`Deleted ${file.name} from destDir.`);
      }
    }

    for (const item of sourceFiles) {
      const sourcePath = path.join(sourceDir, item.name);
      const destPath = path.join(destDir, item.name);
      if (item.isDirectory()) {
        await copyDirRecursive(sourcePath, destPath);
      } else {
        await fs.copyFile(sourcePath, destPath);
      }
    }

    console.log('Files copied successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function copyDirRecursive(sourceDir, destDir) {
  await fs.mkdir(destDir, { recursive: true });
  const items = await fs.readdir(sourceDir, { withFileTypes: true });
  for (const item of items) {
    const sourcePath = path.join(sourceDir, item.name);
    const destPath = path.join(destDir, item.name);
    if (item.isDirectory()) {
      await copyDirRecursive(sourcePath, destPath);
    } else {
      await fs.copyFile(sourcePath, destPath);
    }
  }
}

copyDir();
