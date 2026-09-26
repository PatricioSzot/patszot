import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const index = JSON.parse(await readFile(join(root, 'dist/articles/index.json'), 'utf8'));
const outRoot = join(root, 'dist/assets-visual');

const projectUrls = Object.keys(index).filter((url) =>
  url === 'https://glossgenius.com/' ||
  url.includes('dribbble.com/shots/') ||
  /patrickszot\.webflow\.io\/(?:recent-work|older-work)\//.test(url)
);

const fallbackMedia = {
  'https://dribbble.com/shots/20410030-Webflow-Conf-2022-Grow-with-the-Flow-room': [
    { alt: 'Webflow Conf Grow with the Flow room', url: 'https://cdn.dribbble.com/userupload/4293440/file/original-d1e576e3b7230d2cc45147ed55ac5495.jpg?crop=0x0-1920x1440&format=webp&resize=1600x1200&vertical=center', type: 'image' }
  ]
};

const slugFor = (url) => {
  if (url === 'https://glossgenius.com/') return 'gloss-ai';
  return new URL(url).pathname.split('/').filter(Boolean).pop().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

const titleFor = (source, url) => {
  const body = source.split('Markdown Content:').pop();
  const heading = body.match(/^#\s+(.+)$/m)?.[1]?.replace(/^[①-⑳❶-❿➀-➉\d.\s]+/, '').trim();
  return heading || slugFor(url).replace(/-/g, ' ');
};

const scopedSource = (source, url) => {
  let body = source.split('Markdown Content:').pop();
  if (url.includes('dribbble.com/shots/')) {
    const start = body.search(/^#\s+/m);
    if (start >= 0) body = body.slice(start);
    body = body.split(/\n#{3,4}\s+(?:More by|You might also like)/i)[0];
  } else if (url.includes('patrickszot.webflow.io/')) {
    const start = body.search(/^#\s+/m);
    if (start >= 0) body = body.slice(start);
    body = body.split(/\n##\s+Other Projects/i)[0];
  }
  return body;
};

const normalize = (url) => url.replaceAll('{width}', '1600').replaceAll('{height}', '1200').replaceAll('&amp;', '&');
const mediaFrom = (source) => {
  const found = [];
  for (const match of source.matchAll(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    found.push({ alt: match[1], url: normalize(match[2]), type: 'image' });
  }
  for (const match of source.matchAll(/\[Video\s+\d+\]\((https?:\/\/[^)\s]+)\)/gi)) {
    const url = normalize(match[1]);
    if (/\.(?:mp4|webm)(?:\?|$)/i.test(url)) found.push({ alt: 'Project motion', url, type: 'video' });
  }
  return [...new Map(found
    .filter((item) => !/avatar|profile|icon-|caret|announcement|\.svg(?:\?|$)/i.test(item.url))
    .map((item) => [item.url, item])).values()];
};

const contentExtension = (url, type, contentType) => {
  if (type === 'video') return contentType.includes('webm') ? '.webm' : '.mp4';
  if (contentType.includes('gif')) return '.gif';
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('avif')) return '.avif';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg';
  const ext = extname(new URL(url).pathname).toLowerCase();
  return ['.gif', '.png', '.webp', '.avif', '.jpg', '.jpeg'].includes(ext) ? ext : '.jpg';
};

await mkdir(outRoot, { recursive: true });
const manifest = { generatedAt: new Date().toISOString(), projects: {} };
let downloaded = 0;
const sharedAssets = new Map();

for (const pageUrl of projectUrls) {
  const id = index[pageUrl];
  const source = await readFile(join(root, `dist/articles/${id}.md`), 'utf8');
  const slug = slugFor(pageUrl);
  const dir = join(outRoot, slug);
  await mkdir(dir, { recursive: true });
  let candidates = mediaFrom(scopedSource(source, pageUrl));
  if (slug === 'the-smart-factory') {
    candidates = candidates.filter((item) => /(?:tSF-|SF_)/i.test(item.url));
  }
  if (slug === 'lilly') candidates = [];
  if (!candidates.length && fallbackMedia[pageUrl]) candidates.push(...fallbackMedia[pageUrl]);
  const assets = [];

  for (let i = 0; i < candidates.length; i += 1) {
    const item = candidates[i];
    if (sharedAssets.has(item.url)) {
      assets.push({ ...sharedAssets.get(item.url), alt: item.alt || sharedAssets.get(item.url).alt });
      continue;
    }
    try {
      const response = await fetch(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' });
      if (!response.ok) throw new Error(`${response.status}`);
      const contentType = (response.headers.get('content-type') || '').toLowerCase();
      if (!contentType.startsWith('image/') && !contentType.startsWith('video/')) throw new Error(`unexpected ${contentType}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 1024) throw new Error('empty asset');
      const extension = contentExtension(item.url, item.type, contentType);
      const hash = createHash('sha1').update(bytes).digest('hex').slice(0, 10);
      const filename = `${String(assets.length + 1).padStart(2, '0')}-${hash}${extension}`;
      await writeFile(join(dir, filename), bytes);
      const asset = {
        src: `assets-visual/${slug}/${filename}`,
        type: item.type === 'video' ? 'video' : extension === '.gif' ? 'gif' : 'image',
        alt: item.alt || `${titleFor(source, pageUrl)} project image`,
        bytes: bytes.length,
        source: item.url
      };
      assets.push(asset);
      sharedAssets.set(item.url, asset);
      downloaded += 1;
    } catch (error) {
      process.stderr.write(`skip ${item.url}: ${error.message}\n`);
    }
  }

  manifest.projects[pageUrl] = { slug, title: titleFor(source, pageUrl), assets };
  process.stdout.write(`${slug}: ${assets.length}\n`);
}

try {
  const embeds = JSON.parse(await readFile(join(outRoot, 'project-embeds.json'), 'utf8'));
  for (const [url, assets] of Object.entries(embeds)) {
    if (manifest.projects[url]) manifest.projects[url].assets.unshift(...assets);
  }
} catch {}

await writeFile(join(outRoot, 'manifest.json'), JSON.stringify(manifest, null, 2));
process.stdout.write(`downloaded ${downloaded} assets across ${projectUrls.length} projects\n`);
