const fs = require('fs');
const path = require('path');
const { readdir } = require('fs').promises;

const secretFolder = path.join(__dirname, 'secret-folder');

async function displayFilesInfo() {
  try {
    const files = await readdir(secretFolder, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(secretFolder, file.name);
        const stats = await fs.promises.stat(filePath);
        const fileSize = (stats.size / 1024).toFixed(3); // convert to kB
        const fileExt = path.extname(file.name).slice(1);
        const fileName = path.basename(file.name, `.${fileExt}`);

        console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
      }
    }
  } catch (err) {
    console.error('Error reading files:', err);
  }
}

displayFilesInfo();
