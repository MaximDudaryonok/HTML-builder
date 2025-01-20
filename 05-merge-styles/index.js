const fs = require('fs').promises;
const path = require('path');

async function compileStyles() {
  const stylesDir = path.join(__dirname, 'styles');
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
  let styles = [];

  try {
    const files = await fs.readdir(stylesDir, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesDir, file.name);
        const fileContent = await fs.readFile(filePath, 'utf8');
        styles.push(fileContent);
      }
    }

    await fs.writeFile(bundlePath, styles.join('\n'), 'utf8');
    console.log('Styles compiled successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

compileStyles();
