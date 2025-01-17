const { createWriteStream } = require('fs');
const { join } = require('path');
const { stdin, stdout } = require('process');

const output = createWriteStream(join(__dirname, 'text.txt'), {
  encoding: 'utf-8',
});

stdout.write('Enter your text:\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdout.write('Good luck!\n');
    process.exit();
  } else {
    output.write(data);
  }
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  console.log('Writing is done');
});
