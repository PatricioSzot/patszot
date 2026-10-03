import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist/assets-visual');
const folderPattern = /^(\d{1,2})-(\d{1,2})-(\d{4})-(.+)$/;
const auxiliaryFolders = new Set(['PrimaryAndSecondaryProjectAssets']);

const knownProjects = {
  'airops': { title: 'Principal Brand Designer at AirOps' },
  'brand-guidelines': { title: 'AirOps Brand Guidelines' },
  'tildeath-garden-of-flowers': { title: 'Garden of Flowers', description: 'TILDEATH · Alternative · 3 tracks · Everything and Nothing Music', url: 'https://music.apple.com/us/album/garden-of-flowers-single/1825456137', playerOnly: true },
  'tildeath-auto-saved': { title: '(Auto-saved)', description: 'TILDEATH · Pop · 4 tracks · Everything and Nothing Music', url: 'https://music.apple.com/us/album/auto-saved-ep/1786424302', playerOnly: true },
  'tildeath-god-forsaken-love': { title: 'For the (God-forsaken) Love of Heartbreak and Favor!', description: 'TILDEATH · Hardcore · 5 tracks · Everything and Nothing Music', url: 'https://music.apple.com/us/album/for-the-god-forsaken-love-of-heartbreak-and-favor-ep/1758614716', playerOnly: true },
  'tildeath-mercy-like-misery-remixes': { title: 'Mercy Like Misery (REMIXES)', description: 'TILDEATH · Techno · 4 tracks · Everything and Nothing Music', url: 'https://music.apple.com/us/album/mercy-like-misery-remixes-ep/1744194099', playerOnly: true },
  'tildeath-cool': { title: 'Cool', description: 'TILDEATH · Pop · 1 track · Everything and Nothing Music', url: 'https://music.apple.com/us/album/cool-single/1739300146', playerOnly: true },
  'tildeath-loser-like-you': { title: 'Loser Like You', description: 'TILDEATH · Pop · 1 track · Everything and Nothing Music', url: 'https://music.apple.com/us/album/loser-like-you-single/1733410622', playerOnly: true },
  'tildeath-forty-day-trial': { title: 'Forty Day Trial', description: 'TILDEATH · Electronica · 5 tracks · Everything and Nothing Music', url: 'https://music.apple.com/us/album/forty-day-trial-ep/1714095563', playerOnly: true },
  'tildeath-ode-to-joy-video': { title: 'Ode To Joy · Lyric Video', description: 'Video · TILDEATH · YouTube', url: 'https://www.youtube.com/watch?v=C4IZiu8wVeA', playerOnly: true },
  'tildeath-blankstare-video': { title: 'Blankstare · Lyric Video', description: 'Video · TILDEATH · YouTube', url: 'https://www.youtube.com/watch?v=NFg5XFu6SvU', playerOnly: true },
  'tildeath-forty-day-trial-visualizers': { title: 'Album Visualizers', description: '2 visualizers · TILDEATH · YouTube', url: 'https://www.youtube.com/@TildeathMusic', playerOnly: true },
  'rat-highlight-reel': { title: 'Rat Highlight Reel · SSBU 2020', description: 'Video · TILDEATH · YouTube', url: 'https://www.youtube.com/watch?v=vEDD_QvuSzw', playerOnly: true },
  'snakeskin-affection': { title: 'Snakeskin (Affection)', description: 'Music video · TILDEATH · YouTube', url: 'https://www.youtube.com/watch?v=7xrzNP4pTfQ', playerOnly: true },
  'riverwater-wires': { title: 'Riverwater (Wires)', description: 'Music video · TILDEATH · YouTube', url: 'https://www.youtube.com/watch?v=nYY1iqU5L5w', playerOnly: true },
  'lovely-cesspool': { title: 'Lovely (Cesspool)', description: 'Music video · TILDEATH · YouTube', url: 'https://www.youtube.com/watch?v=E_xrUKIr7KM', playerOnly: true },
  'jawtype-shine-acoustic': { title: 'Jawtype (Shine) · Acoustic', description: 'Acoustic performance · TILDEATH · YouTube', url: 'https://www.youtube.com/watch?v=MFwYARfWoJk', playerOnly: true },
  'hello-adele-french-cover': { title: '“Hello” · Adele French Cover', description: 'Cover performance · TILDEATH · YouTube', url: 'https://www.youtube.com/watch?v=gts7360l2_c', playerOnly: true },
  'cascadia-esteem': { title: 'Cascadia (Esteem)', description: 'Music video · TILDEATH · YouTube', url: 'https://www.youtube.com/watch?v=yUxns_dseOk', playerOnly: true },
  'la-vie-tv-show-package': { title: 'La Vie TV Show Package', description: 'Motion design · TILDEATH · YouTube', url: 'https://www.youtube.com/watch?v=7qO9MA80AP0', playerOnly: true },
  'bones-high-hopes': { title: 'Bones (High Hopes)', description: 'Music video · TILDEATH · YouTube', url: 'https://www.youtube.com/watch?v=rQ5guGr3xHY', playerOnly: true },
  'steady-exalt': { title: 'Steady (Exalt)', description: 'Music video · TILDEATH · YouTube', url: 'https://www.youtube.com/watch?v=8i2KSDVaGTA', playerOnly: true },
  'hostage-until-death': { title: 'Hostage (Until Death)', description: 'Music video · TILDEATH · YouTube', url: 'https://www.youtube.com/watch?v=vJDUwuL9eS0', playerOnly: true },
  'gloss-ai': { title: 'GlossAI rebrand' },
  'album-art-presage': { title: 'Album art: Presage 2022' },
  'webflow-rebrand': { title: 'Webflow rebrand' },
  'webflow-ooh-sf-campaign': { title: 'Webflow OOH SF Campaign' },
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
  'blackbriar': { title: 'CIA.gov rebrand' },
  'lilly-pulitzer': { title: 'Lilly Pulitzer virtual runway' },
  'rite-of-spring': { title: 'Rite of Spring' },
  'torei': { title: 'TOREI' },
  'looking-glass': { title: 'Looking Glass EP' }
};

const folderAliases = {
  'tildeath-snakeskin-visualizer': 'tildeath-forty-day-trial-visualizers',
  'tildeath-my-fathers-eyes-burned-out-stars': 'tildeath-forty-day-trial-visualizers'
};

const embeds = {
  'tildeath-garden-of-flowers': [
    { src: 'https://embed.music.apple.com/us/album/garden-of-flowers-single/1825456137', type: 'apple', alt: 'Garden of Flowers on Apple Music', width: 600, height: 450 }
  ],
  'tildeath-auto-saved': [
    { src: 'https://embed.music.apple.com/us/album/auto-saved-ep/1786424302', type: 'apple', alt: '(Auto-saved) on Apple Music', width: 600, height: 450 }
  ],
  'tildeath-god-forsaken-love': [
    { src: 'https://embed.music.apple.com/us/album/for-the-god-forsaken-love-of-heartbreak-and-favor-ep/1758614716', type: 'apple', alt: 'For the (God-forsaken) Love of Heartbreak and Favor! on Apple Music', width: 600, height: 450 }
  ],
  'tildeath-mercy-like-misery-remixes': [
    { src: 'https://embed.music.apple.com/us/album/mercy-like-misery-remixes-ep/1744194099', type: 'apple', alt: 'Mercy Like Misery (REMIXES) on Apple Music', width: 600, height: 450 }
  ],
  'tildeath-cool': [
    { src: 'https://embed.music.apple.com/us/album/cool-single/1739300146', type: 'apple', alt: 'Cool on Apple Music', width: 600, height: 450 }
  ],
  'tildeath-loser-like-you': [
    { src: 'https://embed.music.apple.com/us/album/loser-like-you-single/1733410622', type: 'apple', alt: 'Loser Like You on Apple Music', width: 600, height: 450 }
  ],
  'tildeath-forty-day-trial': [
    { src: 'https://embed.music.apple.com/us/album/forty-day-trial-ep/1714095563', type: 'apple', alt: 'Forty Day Trial on Apple Music', width: 600, height: 450 }
  ],
  'tildeath-ode-to-joy-video': [
    { src: 'https://www.youtube-nocookie.com/embed/C4IZiu8wVeA?rel=0', type: 'youtube', alt: 'Ode To Joy lyric video', width: 16, height: 9, poster: 'assets-visual/12-01-2024-tildeath-ode-to-joy-video/thumbnail.jpg' }
  ],
  'tildeath-blankstare-video': [
    { src: 'https://www.youtube-nocookie.com/embed/NFg5XFu6SvU?rel=0', type: 'youtube', alt: 'Blankstare lyric video', width: 16, height: 9, poster: 'assets-visual/07-20-2024-tildeath-blankstare-video/thumbnail.jpg' }
  ],
  'tildeath-forty-day-trial-visualizers': [
    { src: 'https://www.youtube-nocookie.com/embed/fnCa2zAGlwM?rel=0', type: 'youtube', alt: 'My Father’s Eyes and Burned Out Stars visualizer', width: 16, height: 9, poster: 'assets-visual/02-20-2024-tildeath-my-fathers-eyes-burned-out-stars/thumbnail.jpg' },
    { src: 'https://www.youtube-nocookie.com/embed/ZjXskPWHI1I?rel=0', type: 'youtube', alt: 'Snakeskin visualizer', width: 16, height: 9, poster: 'assets-visual/02-20-2024-tildeath-snakeskin-visualizer/thumbnail.jpg' }
  ],
  'rat-highlight-reel': [{ src: 'https://www.youtube-nocookie.com/embed/vEDD_QvuSzw?rel=0', type: 'youtube', alt: 'Rat Highlight Reel', width: 16, height: 9, poster: 'assets-visual/10-10-2020-rat-highlight-reel/thumbnail.jpg' }],
  'snakeskin-affection': [{ src: 'https://www.youtube-nocookie.com/embed/7xrzNP4pTfQ?rel=0', type: 'youtube', alt: 'Snakeskin (Affection)', width: 16, height: 9, poster: 'assets-visual/08-05-2019-snakeskin-affection/thumbnail.jpg' }],
  'riverwater-wires': [{ src: 'https://www.youtube-nocookie.com/embed/nYY1iqU5L5w?rel=0', type: 'youtube', alt: 'Riverwater (Wires)', width: 16, height: 9, poster: 'assets-visual/04-07-2019-riverwater-wires/thumbnail.jpg' }],
  'lovely-cesspool': [{ src: 'https://www.youtube-nocookie.com/embed/E_xrUKIr7KM?rel=0', type: 'youtube', alt: 'Lovely (Cesspool)', width: 16, height: 9, poster: 'assets-visual/03-31-2019-lovely-cesspool/thumbnail.jpg' }],
  'jawtype-shine-acoustic': [{ src: 'https://www.youtube-nocookie.com/embed/MFwYARfWoJk?rel=0', type: 'youtube', alt: 'Jawtype (Shine) acoustic performance', width: 16, height: 9, poster: 'assets-visual/12-17-2017-jawtype-shine-acoustic/thumbnail.jpg' }],
  'hello-adele-french-cover': [{ src: 'https://www.youtube-nocookie.com/embed/gts7360l2_c?rel=0', type: 'youtube', alt: 'Hello Adele French cover', width: 16, height: 9, poster: 'assets-visual/12-04-2017-hello-adele-french-cover/thumbnail.jpg' }],
  'cascadia-esteem': [{ src: 'https://www.youtube-nocookie.com/embed/yUxns_dseOk?rel=0', type: 'youtube', alt: 'Cascadia (Esteem)', width: 16, height: 9, poster: 'assets-visual/05-11-2017-cascadia-esteem/thumbnail.jpg' }],
  'la-vie-tv-show-package': [{ src: 'https://www.youtube-nocookie.com/embed/7qO9MA80AP0?rel=0', type: 'youtube', alt: 'La Vie TV Show Package', width: 16, height: 9, poster: 'assets-visual/04-05-2017-la-vie-tv-show-package/thumbnail.jpg' }],
  'bones-high-hopes': [{ src: 'https://www.youtube-nocookie.com/embed/rQ5guGr3xHY?rel=0', type: 'youtube', alt: 'Bones (High Hopes)', width: 16, height: 9, poster: 'assets-visual/03-22-2017-bones-high-hopes/thumbnail.jpg' }],
  'steady-exalt': [{ src: 'https://www.youtube-nocookie.com/embed/8i2KSDVaGTA?rel=0', type: 'youtube', alt: 'Steady (Exalt)', width: 16, height: 9, poster: 'assets-visual/03-19-2017-steady-exalt/thumbnail.jpg' }],
  'hostage-until-death': [{ src: 'https://www.youtube-nocookie.com/embed/vJDUwuL9eS0?rel=0', type: 'youtube', alt: 'Hostage (Until Death)', width: 16, height: 9, poster: 'assets-visual/08-18-2016-hostage-until-death/thumbnail.jpg' }],
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

const normalizedYouTubeEmbed = (source) => {
  const url = new URL(source);
  url.searchParams.set('rel', '0');
  url.searchParams.set('cc_load_policy', '0');
  url.searchParams.set('fs', '0');
  url.searchParams.set('playsinline', '1');
  return url.toString();
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
  const projectConfig = knownProjects[slug] || {};
  const title = projectConfig.title || humanizeSlug(slug);
  const canonicalFolder = projectFolders.find((folder) => folder.folderSlug === slug) || projectFolders[0];
  const orderedFolders = [canonicalFolder, ...projectFolders.filter((folder) => folder !== canonicalFolder)];
  const folderAssets = (await Promise.all(orderedFolders.map((folder) => mediaForFolder(folder, title)))).flat();
  const seen = new Set();
  const rawAssetCandidates = projectConfig.playerOnly ? (embeds[slug] || []) : [...folderAssets, ...(embeds[slug] || [])];
  const assetCandidates = rawAssetCandidates.map((asset) => asset.type === 'youtube'
    ? { ...asset, src: normalizedYouTubeEmbed(asset.src) }
    : asset);
  const assets = assetCandidates.filter((asset) => {
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
    ...(projectConfig.description ? { description: projectConfig.description } : {}),
    ...(projectConfig.url ? { url: projectConfig.url } : {}),
    assets
  };
}

await writeFile(path.join(root, 'manifest.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${Object.keys(output.projects).length} dated project mappings with ${Object.values(output.projects).reduce((sum, project) => sum + project.assets.length, 0)} assets.`);
