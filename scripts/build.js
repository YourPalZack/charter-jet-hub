const fs = require('fs-extra');
const path = require('path');

async function copyPublicFiles() {
  // Ensure the dist directory exists
  await fs.ensureDir('dist');

  // Copy the 404.html file
  await fs.copy('public/404.html', 'dist/404.html');

  // Copy other public files if they exist
  try {
    const files = await fs.readdir('public');
    for (const file of files) {
      if (file !== '404.html') {
        await fs.copy(path.join('public', file), path.join('dist', file));
      }
    }
  } catch (err) {
    console.error('Error copying public files:', err);
  }
}

copyPublicFiles().catch(console.error); 