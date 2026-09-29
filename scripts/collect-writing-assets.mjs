import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const articleIndex = JSON.parse(await readFile(join(root, 'dist/articles/index.json'), 'utf8'));
const outRoot = join(root, 'dist/assets-writing');
const writingUrls = Object.keys(articleIndex).filter((url) => url.includes('medium.com/@patrick.m.szot/') || url.includes('patrickszot.webflow.io/journal/'));
const manifest = { generatedAt: new Date().toISOString(), writings: {} };
const sharedImages = new Map();

const decode = (value = '') => value
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&nbsp;', ' ');

const stripTags = (value = '') => decode(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const slugFor = (url) => new URL(url).pathname.split('/').filter(Boolean).pop().replace(/-[a-f0-9]{12,}$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const fetchText = async (url) => {
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' });
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.text();
};

const extractBalancedDiv = (html, className) => {
  const start = html.search(new RegExp(`<div[^>]*class="[^"]*${className}[^"]*"[^>]*>`, 'i'));
  if (start < 0) return '';
  const openingEnd = html.indexOf('>', start) + 1;
  const token = /<\/?div\b[^>]*>/gi;
  token.lastIndex = openingEnd;
  let depth = 1;
  let match;
  while ((match = token.exec(html))) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return html.slice(openingEnd, match.index);
  }
  return html.slice(openingEnd);
};

const localizeImages = async (html, slug) => {
  const dir = join(outRoot, slug);
  await mkdir(dir, { recursive: true });
  const imageMatches = [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)];
  let output = html;
  let imageNumber = 0;
  for (const match of imageMatches) {
    const source = decode(match[1]).replaceAll('&amp;', '&');
    if (!/^https?:/.test(source) || /medium\.com\/_\/stat/.test(source)) {
      output = output.replace(match[0], '');
      continue;
    }
    let asset = sharedImages.get(source);
    if (!asset) {
      try {
        const response = await fetch(source, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' });
        if (!response.ok) throw new Error(String(response.status));
        const type = (response.headers.get('content-type') || '').toLowerCase();
        if (!type.startsWith('image/')) throw new Error(type);
        const bytes = Buffer.from(await response.arrayBuffer());
        const extension = type.includes('png') ? '.png' : type.includes('gif') ? '.gif' : type.includes('webp') ? '.webp' : type.includes('avif') ? '.avif' : extname(new URL(source).pathname).toLowerCase() === '.png' ? '.png' : '.jpg';
        const hash = createHash('sha1').update(bytes).digest('hex').slice(0, 10);
        const filename = `${String(++imageNumber).padStart(2, '0')}-${hash}${extension}`;
        await writeFile(join(dir, filename), bytes);
        asset = `assets-writing/${slug}/${filename}`;
        sharedImages.set(source, asset);
      } catch (error) {
        process.stderr.write(`skip image ${source}: ${error.message}\n`);
        output = output.replace(match[0], '');
        continue;
      }
    }
    const alt = decode(match[0].match(/\balt=["']([^"']*)["']/i)?.[1] || '');
    output = output.replace(match[0], `<img src="${asset}" alt="${alt.replaceAll('"', '&quot;')}" loading="lazy">`);
  }
  return output;
};

const sanitize = (html) => html
  .replace(/<(script|style|iframe|form)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/<!--([\s\S]*?)-->/g, '')
  .replace(/\s(?:class|id|style|data-[\w-]+|width|height|loading|referrerpolicy|target|rel)=(?:"[^"]*"|'[^']*')/gi, '')
  .replace(/<a\b([^>]*)>/gi, (tag, attrs) => `<a${attrs.match(/\shref=(?:"[^"]*"|'[^']*')/i)?.[0] || ''}>`)
  .replace(/<(?!\/?(?:p|h2|h3|h4|blockquote|ul|ol|li|strong|b|em|i|a|figure|figcaption|img|hr|br)\b)[^>]+>/gi, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const rss = await fetchText('https://medium.com/feed/@patrick.m.szot');
const mediumItems = new Map();
for (const item of rss.match(/<item>[\s\S]*?<\/item>/g) || []) {
  const url = decode(item.match(/<link>([^<]+)<\/link>/)?.[1] || '').split('?')[0];
  mediumItems.set(url, {
    title: decode(item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] || ''),
    date: new Date(item.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1] || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    body: item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)?.[1] || ''
  });
}

for (const url of writingUrls) {
  const slug = slugFor(url);
  let title = '';
  let date = '';
  let description = '';
  let body = '';

  if (url.includes('medium.com/')) {
    const item = mediumItems.get(url);
    if (!item) { process.stderr.write(`missing Medium feed item ${url}\n`); continue; }
    ({ title, date, body } = item);
  } else {
    const html = await fetchText(url);
    title = stripTags(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
    date = stripTags(html.match(/<p\b[^>]*class="[^"]*meta[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || '');
    description = decode(html.match(/<meta\s+content="([^"]*)"\s+name="description"/i)?.[1] || '');
    body = extractBalancedDiv(html, 'rich-text');
  }

  body = sanitize(await localizeImages(body, slug));
  const record = { title, meta: { author: 'Pat Szot', published: date, description, source: url }, content: body };
  const filename = `${slug}.json`;
  await writeFile(join(outRoot, filename), JSON.stringify(record, null, 2));
  manifest.writings[url] = { title, file: `assets-writing/${filename}` };
  process.stdout.write(`${slug}: ${stripTags(body).length} characters\n`);
}

await writeFile(join(outRoot, 'manifest.json'), JSON.stringify(manifest, null, 2));
process.stdout.write(`saved ${Object.keys(manifest.writings).length} writings\n`);
