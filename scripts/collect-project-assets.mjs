import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { promisify } from 'node:util';

const root = new URL('../', import.meta.url).pathname;
const index = JSON.parse(await readFile(join(root, 'dist/articles/index.json'), 'utf8'));
const outRoot = join(root, 'dist/assets-visual');

const folderForSlug = {
  'gloss-ai': '01-01-2025-gloss-ai',
  '24328431-album-art-presage-2022': '06-10-2024-album-art-presage',
  'webflow-rebrand': '01-01-2024-webflow-rebrand',
  '20635546-webflow-user-guide': '02-12-2023-webflow-user-guide',
  '20567364-webflow-conf-2022-process-and-guidelines': '02-04-2023-webflow-conf-process-guidelines',
  '20509333-3d-scene': '01-29-2023-3d-scene',
  '20509321-studio-project-trophy-decks': '01-29-2023-studio-trophy-decks',
  '20509299-ui-design-deloitte-digital-internal-directory': '01-29-2023-design-directory',
  '20509285-brand-package-atelier-saady': '01-29-2023-atelier-saady',
  '20509280-stylized-logo': '01-29-2023-stylized-logo',
  '20410030-webflow-conf-2022-grow-with-the-flow-room': '01-17-2023-webflow-conf-grow-room',
  '20356384-webflow-conf-2022-themes': '01-11-2023-webflow-conf-themes',
  'webflow-conf': '01-01-2022-webflow-conf',
  'thrivent': '08-01-2021-thrivent',
  'the-smart-factory': '07-01-2020-smart-factory',
  'dolores-debitis-omnis-qui': '06-01-2020-global-marketing-trends',
  'cia': '03-01-2020-blackbriar',
  'lilly': '12-01-2019-lilly-pulitzer',
  'rite-of-spring': '03-01-2016-rite-of-spring',
  'torei': '02-01-2016-torei',
  'looking-glass': '01-01-2016-looking-glass'
};

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
let downloaded = 0;

for (const pageUrl of projectUrls) {
  const id = index[pageUrl];
  const source = await readFile(join(root, `dist/articles/${id}.md`), 'utf8');
  const slug = slugFor(pageUrl);
  const projectFolder = folderForSlug[slug];
  if (!projectFolder) throw new Error(`No dated asset folder configured for ${slug}`);
  const dir = join(outRoot, projectFolder);
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
        src: `assets-visual/${projectFolder}/${filename}`,
        type: item.type === 'video' ? 'video' : extension === '.gif' ? 'gif' : 'image',
        alt: item.alt || `${titleFor(source, pageUrl)} project image`,
        bytes: bytes.length,
        source: item.url
      };
      assets.push(asset);
      downloaded += 1;
    } catch (error) {
      process.stderr.write(`skip ${item.url}: ${error.message}\n`);
    }
  }

  process.stdout.write(`${slug}: ${assets.length}\n`);
}

await promisify(execFile)(process.execPath, [join(root, 'scripts/build-visual-manifest.mjs')], { cwd: root });
process.stdout.write(`downloaded ${downloaded} assets across ${projectUrls.length} projects\n`);
