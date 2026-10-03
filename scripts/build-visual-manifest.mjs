import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist/assets-visual');
const folderPattern = /^(\d{1,2})-(\d{1,2})-(\d{4})-(.+)$/;
const auxiliaryFolders = new Set(['PrimaryAndSecondaryProjectAssets']);

const knownProjects = {
  'airops': { title: 'Principal Brand Designer at AirOps' },
  'brand-guidelines': { title: 'Brand Guidelines' },
  'gloss-ai': { title: 'GlossAI rebrand' },
  'album-art-presage': { title: 'Album art: Presage 2022' },
  'webflow-rebrand': { title: 'Webflow rebrand' },
  'webflow-customer-stories': { title: 'Webflow customer Stories' },
  'webflow-user-guide': { title: 'Webflow “User Guide”' },
  'webflow-conf-process-guidelines': { title: 'Webflow Conf 2022 – Process and guidelines' },
  '3d-scene': { title: '3D scene' },
  'studio-trophy-decks': { title: 'Studio project trophy decks' },
  'design-directory': { title: 'UI design – Deloitte Digital internal directory' },
  'atelier-saady': { title: 'Brand package – Atelier Saady' },
  'stylized-logo': { title: 'Stylized logo' },
  'webflow-conf-grow-room': { title: 'Webflow Conf 2022 – Grow with the ’Flow room' },
  'webflow-conf-themes': { title: 'Webflow Conf 2022 – themes' },
  'webflow-conf': { title: 'Webflow Conf 2022' },
  'thrivent': { title: 'Thrivent Financial app and web' },
  'smart-factory': { title: 'The Smart Factory' },
  'global-marketing-trends': { title: 'Global Marketing Trends 2021' },
  'blackbriar': { title: 'CIA.gov site implementation' },
  'lilly-pulitzer': { title: 'Lilly Pulitzer virtual runway' },
  'rite-of-spring': { title: 'Rite of Spring' },
  'torei': { title: 'TOREI' },
  'looking-glass': { title: 'Looking Glass EP' }
};

const folderAliases = {
  'webflow-oohsf-campaign': 'webflow-rebrand'
};

const embeds = {
  'torei': [
    { src: 'https://open.spotify.com/embed/album/3Zl7gvVauCFpHZK9oZ1h9w?utm_source=generator', type: 'spotify', alt: 'TOREI album on Spotify' },
    { src: 'https://open.spotify.com/embed/album/0UrEig2McwlaCnbfzoW4DH?utm_source=generator', type: 'spotify', alt: 'TOREI album on Spotify' }
  ],
  'looking-glass': [
    { src: 'https://open.spotify.com/embed/album/0nDCFjPyMy93zOOAhb1Eb8?utm_source=generator&theme=0', type: 'spotify', alt: 'Looking Glass EP on Spotify' }
  ],
  'lilly-pulitzer': [
    { src: 'https://www.youtube.com/embed/r7ZTCFzELf8?rel=0&controls=0&autoplay=0&mute=0&start=0', type: 'youtube', alt: 'Lilly Pulitzer Virtual Runway Pitch' }
  ]
};

const mediaType = (filename) => {
  const extension = path.extname(filename).toLowerCase();
  if (['.mp4', '.mov', '.webm'].includes(extension)) return 'video';
  if (extension === '.gif') return 'gif';
  if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(extension)) return 'image';
  return undefined;
};

const publicAssetPath = (...segments) => ['assets-visual', ...segments]
  .map((segment) => encodeURIComponent(segment))
  .join('/');

const humanizeSlug = (slug) => slug
  .split('-')
  .filter(Boolean)
  .map((word) => /^(ai|ui|ux|ep|gov|3d)$/i.test(word) ? word.toUpperCase() : `${word[0].toUpperCase()}${word.slice(1)}`)
  .join(' ');

const parseFolder = (name) => {
  const match = name.match(folderPattern);
  if (!match) throw new Error(`Visual asset folder must use M-D-YYYY-name or MM-DD-YYYY-name: ${name}`);
  const [, month, day, year, rawSlug] = match;
  const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.valueOf()) || date.getUTCMonth() !== Number(month) - 1 || date.getUTCDate() !== Number(day)) {
    throw new Error(`Visual asset folder has an invalid date: ${name}`);
  }
  const folderSlug = rawSlug.toLowerCase();
  const slug = folderAliases[folderSlug] || folderSlug;
  return { name, folderSlug, slug, date: isoDate };
};

const mediaForFolder = async (folder, title) => {
  const names = await readdir(path.join(root, folder.name), { withFileTypes: true });
  return names
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .flatMap((name) => {
      const type = mediaType(name);
      if (!type) return [];
      return [{
        src: publicAssetPath(folder.name, name),
        type,
        alt: `${title} — ${path.parse(name).name}`
      }];
    });
};

const entries = await readdir(root, { withFileTypes: true });
const folders = entries
  .filter((entry) => entry.isDirectory() && !auxiliaryFolders.has(entry.name))
  .map((entry) => parseFolder(entry.name));
const groupedFolders = new Map();

folders.forEach((folder) => {
  const group = groupedFolders.get(folder.slug) || [];
  group.push(folder);
  groupedFolders.set(folder.slug, group);
});

const output = { naming: 'M-D-YYYY-project-name or MM-DD-YYYY-project-name', projects: {} };
const sortedGroups = [...groupedFolders.entries()].sort(([, a], [, b]) => b[0].date.localeCompare(a[0].date));

for (const [slug, projectFolders] of sortedGroups) {
  const title = knownProjects[slug]?.title || humanizeSlug(slug);
  const canonicalFolder = projectFolders.find((folder) => folder.folderSlug === slug) || projectFolders[0];
  const orderedFolders = [canonicalFolder, ...projectFolders.filter((folder) => folder !== canonicalFolder)];
  const folderAssets = (await Promise.all(orderedFolders.map((folder) => mediaForFolder(folder, title)))).flat();
  const seen = new Set();
  const assets = [...folderAssets, ...(embeds[slug] || [])].filter((asset) => {
    if (seen.has(asset.src)) return false;
    seen.add(asset.src);
    return true;
  });
  const preview = folderAssets.find((asset) => /preview/i.test(decodeURIComponent(path.basename(asset.src))))
    || folderAssets.find((asset) => /thumbnail/i.test(decodeURIComponent(path.basename(asset.src))))
    || folderAssets[0];

  output.projects[slug] = {
    slug,
    title,
    date: canonicalFolder.date,
    folders: orderedFolders.map((folder) => folder.name),
    preview: preview?.src,
    assets
  };
}

await writeFile(path.join(root, 'manifest.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${Object.keys(output.projects).length} dated project mappings with ${Object.values(output.projects).reduce((sum, project) => sum + project.assets.length, 0)} assets.`);
