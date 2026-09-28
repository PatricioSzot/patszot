import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { promisify } from 'node:util';

const root = new URL('../', import.meta.url).pathname;
const outRoot = join(root, 'dist/assets-visual');
const projectFolder = '09-27-2026-airops';
const projectDir = join(outRoot, projectFolder);
const pages = ['https://www.airops.com/', 'https://www.airops.com/why-airops', 'https://www.airops.com/solutions', 'https://www.airops.com/platform'];
const sourceUrls = new Set();

for (const page of pages) {
  const response = await fetch(page, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' });
  if (!response.ok) throw new Error(`${page}: ${response.status}`);
  const html = await response.text();
  for (const match of html.matchAll(/(?:src|poster)=["']([^"']+)["']/gi)) {
    const url = match[1].replaceAll('&amp;', '&');
    if (!/^https?:/.test(url)) continue;
    if (!/\.(?:avif|webp|png|jpe?g|gif|mp4|webm)(?:\?|$)/i.test(url)) continue;
    if (/logo|icon|avatar|favicon|tracking|pixel/i.test(url)) continue;
    sourceUrls.add(url);
  }
}

await mkdir(projectDir, { recursive: true });
const assets = [];
let index = 0;
for (const source of sourceUrls) {
  try {
    const response = await fetch(source, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' });
    if (!response.ok) throw new Error(String(response.status));
    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (!contentType.startsWith('image/') && !contentType.startsWith('video/')) throw new Error(contentType);
    const bytes = Buffer.from(await response.arrayBuffer());
    const fallback = extname(new URL(source).pathname).toLowerCase();
    const extension = contentType.includes('avif') ? '.avif' : contentType.includes('webp') ? '.webp' : contentType.includes('gif') ? '.gif' : contentType.includes('png') ? '.png' : contentType.includes('mp4') ? '.mp4' : contentType.includes('webm') ? '.webm' : ['.jpg','.jpeg'].includes(fallback) ? fallback : '.jpg';
    const hash = createHash('sha1').update(bytes).digest('hex').slice(0, 10);
    const filename = `${String(++index).padStart(2, '0')}-${hash}${extension}`;
    await writeFile(join(projectDir, filename), bytes);
    assets.push({
      src: `assets-visual/${projectFolder}/${filename}`,
      type: extension === '.gif' ? 'gif' : ['.mp4','.webm'].includes(extension) ? 'video' : 'image',
      alt: decodeURIComponent(new URL(source).pathname.split('/').pop()).replace(/^[a-f0-9]+_/, '').replace(/\.[^.]+$/, '').replace(/%20/g, ' '),
      bytes: bytes.length,
      source
    });
  } catch (error) {
    process.stderr.write(`skip ${source}: ${error.message}\n`);
  }
}

await promisify(execFile)(process.execPath, [join(root, 'scripts/build-visual-manifest.mjs')], { cwd: root });
process.stdout.write(`saved ${assets.length} AirOps assets from ${pages.length} pages\n`);
