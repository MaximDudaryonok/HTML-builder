const { createReadStream } = require('fs');
const { join } = require('path');
const input = createReadStream(join(__dirname, 'text.txt'), 'utf-8');
input.on('data', (chunk) => console.log(chunk.toString()));
