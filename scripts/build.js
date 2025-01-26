import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = dirname(__dirname);

async function copyPublicFiles() {
  const distDir = join(rootDir, 'dist');
  const publicDir = join(rootDir, 'public');

  // Ensure the dist directory exists
  await fs.ensureDir(distDir);

  // Copy the 404.html file
  const notFoundPath = join(publicDir, '404.html');
  if (await fs.pathExists(notFoundPath)) {
    await fs.copy(notFoundPath, join(distDir, '404.html'));
  }

  // Copy other public files if they exist
  try {
    const files = await fs.readdir(publicDir);
    for (const file of files) {
      if (file !== '404.html') {
        await fs.copy(join(publicDir, file), join(distDir, file));
      }
    }
  } catch (err) {
    console.error('Error copying public files:', err);
  }
}

copyPublicFiles().catch(console.error); 