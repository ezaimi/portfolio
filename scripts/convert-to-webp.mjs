import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public/images');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let converted = 0;
let saved = 0;

for await (const file of walk(publicDir)) {
  const ext = extname(file).toLowerCase();
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') continue;

  const outPath = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const origSize = (await stat(file)).size;

  try {
    await sharp(file)
      .webp({ quality: 85, effort: 4 })
      .toFile(outPath);

    const newSize = (await stat(outPath)).size;
    const reduction = Math.round((1 - newSize / origSize) * 100);
    const origMB = (origSize / 1024 / 1024).toFixed(1);
    const newMB  = (newSize  / 1024 / 1024).toFixed(1);
    console.log(`✓ ${basename(file).padEnd(40)} ${origMB}MB → ${newMB}MB  (-${reduction}%)`);
    saved += origSize - newSize;
    converted++;
  } catch (e) {
    console.error(`✗ ${basename(file)}: ${e.message}`);
  }
}

console.log(`\nDone: ${converted} images, ${(saved / 1024 / 1024).toFixed(0)}MB saved total`);
