// A simple script to copy Material Design Icons fonts to the public directory
// This avoids 403 errors when trying to load fonts from node_modules

import fs from 'fs';
import path from 'path';

// Create directory if it doesn't exist
const fontDir = path.resolve('./public/fonts');
if (!fs.existsSync(fontDir)) {
  fs.mkdirSync(fontDir, { recursive: true });
  console.log('Created directory:', fontDir);
}

// Source directory containing the fonts
const mdiDir = path.resolve('./node_modules/@mdi/font/fonts');

// Copy each font file
const fontFiles = [
  'materialdesignicons-webfont.eot',
  'materialdesignicons-webfont.ttf',
  'materialdesignicons-webfont.woff',
  'materialdesignicons-webfont.woff2'
];

fontFiles.forEach(file => {
  const source = path.join(mdiDir, file);
  const destination = path.join(fontDir, file);
  
  try {
    fs.copyFileSync(source, destination);
    console.log(`Copied: ${file}`);
  } catch (err) {
    console.error(`Error copying ${file}:`, err);
  }
});

console.log('Font copy completed!'); 