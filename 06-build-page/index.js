const fs = require('fs');
const path = require('path');

// Create the project-dist folder
fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
});

// Create the HTML file
async function createHtmlFile() {
  const templatePath = path.join(__dirname, 'template.html');
  const templateHtml = await fs.promises.readFile(templatePath, 'utf-8');

  const regex = /\{\{([^}]+)\}\}/g;
  const matches = templateHtml.match(regex);

  let updatedHtml = templateHtml;

  if (matches) {
    for (let i = 0; i < matches.length; i += 1) {
      const componentFileName = matches[i].slice(2, -2) + '.html';
      const componentPath = path.join(
        __dirname,
        'components',
        componentFileName,
      );

      const componentContent = await fs.promises.readFile(
        componentPath,
        'utf-8',
      );
      updatedHtml = updatedHtml.replace(matches[i], componentContent.trim());
    }
  }

  fs.writeFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    updatedHtml,
    (err) => {
      if (err) throw err;
    },
  );
}

createHtmlFile();

// Compile CSS files into a single file
function compileCssFiles() {
  const stylesFolderPath = path.join(__dirname, 'styles');
  const outputFolderPath = path.join(__dirname, 'project-dist');

  const output = fs.createWriteStream(path.join(outputFolderPath, 'style.css'));

  fs.promises
    .readdir(stylesFolderPath, { withFileTypes: true })
    .then((filenames) => {
      for (let filename of filenames) {
        const fileType = path.extname(filename.name).slice(1);
        if (fileType === 'css' && !filename.isDirectory()) {
          let arr = [];
          const input = fs.createReadStream(
            path.join(stylesFolderPath, filename.name),
            'utf-8',
          );
          input.on('data', (chunk) => arr.push(chunk));
          input.on('end', () => output.write(arr.join('') + '\n'));
        }
      }
    });
}

compileCssFiles();

// Copy assets folder to project-dist/assets
function copyAssetsFolder() {
  let assetsFolderPath = path.join(__dirname, 'assets');
  let newAssetsFolderPath = path.join(__dirname, 'project-dist', 'assets');

  fs.rm(newAssetsFolderPath, { recursive: true }, () => {
    fs.promises.mkdir(newAssetsFolderPath, { recursive: true });

    fs.promises
      .readdir(assetsFolderPath, { withFileTypes: true })
      .then((folderNames) => {
        for (let folderName of folderNames) {
          if (folderName.isDirectory()) {
            fs.promises.mkdir(path.join(newAssetsFolderPath, folderName.name), {
              recursive: true,
            });

            const folderInternalPath = path.join(
              assetsFolderPath,
              folderName.name,
            );
            const newFolderInternalPath = path.join(
              newAssetsFolderPath,
              folderName.name,
            );

            fs.promises
              .readdir(path.join(folderInternalPath), { withFileTypes: true })
              .then((fileNames) => {
                for (let fileName of fileNames) {
                  const filePath = path.join(folderInternalPath, fileName.name);
                  const newFilePath = path.join(
                    newFolderInternalPath,
                    fileName.name,
                  );

                  fs.promises.copyFile(filePath, newFilePath);
                }
              });
          }
        }
      });
  });
}

copyAssetsFolder();
