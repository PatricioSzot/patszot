import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist/assets-visual');

const projects = {
  'airops': { title: 'Brand Engineer at AirOps', folders: ['airops'], files: ['Perplexity Ad Jam_4.gif'] },
  'gloss-ai': { title: 'GlossAI rebrand', folders: ['Gloss AI'] },
  'album-art-presage': { title: 'Album art: Presage 2022', folders: ['AlbumArtPresage'] },
  'webflow-rebrand': { title: 'Webflow rebrand', folders: ['webflow-rebrand', 'Webflow-OOHSFCampaign'] },
  'webflow-customer-stories': { title: 'Webflow visual foundations', folders: ['webflow-customerStories'] },
  'webflow-user-guide': { title: 'Webflow “User Guide”', folders: ['webflow-user-guide'] },
  'webflow-conf-process-guidelines': { title: 'Webflow Conf 2022 – Process and guidelines', folders: ['webflow-conf-2022-process-and-guidelines'] },
  '3d-scene': { title: '3D scene', folders: ['3DScene'] },
  'studio-trophy-decks': { title: 'Studio project trophy decks', folders: ['TrophyDecks'] },
  'design-directory': { title: 'UI design – Deloitte Digital internal directory', folders: ['Design Directory'] },
  'atelier-saady': { title: 'Brand package – Atelier Saady', folders: ['brand-package-atelier-saady'] },
  'stylized-logo': { title: 'Stylized logo', folders: ['stylized-logo'] },
  'webflow-conf-grow-room': { title: 'Webflow Conf 2022 – Grow with the ’Flow room', folders: ['webflow-conf-2022-grow-with-the-flow-room'] },
  'webflow-conf-themes': { title: 'Webflow Conf 2022 – themes', folders: ['webflow-conf-2022-themes'] },
  'webflow-conf': { title: 'Webflow Conf 2022', folders: ['WebflowConf'] },
  'thrivent': { title: 'Thrivent Financial app and web', folders: ['thrivent'] },
  'smart-factory': { title: 'The Smart Factory', folders: ['the-smart-factory'] },
  'global-marketing-trends': { title: 'Global Marketing Trends 2021', folders: ['Deloitte Marketing Trends'] },
  'blackbriar': { title: 'CIA.gov / Blackbriar design system', folders: ['BlackbriarDesignSystem'] },
  'lilly-pulitzer': { title: 'Lilly Pulitzer virtual runway', folders: ['LilluPulitzer'] },
  'rite-of-spring': { title: 'Rite of Spring', folders: ['rite-of-spring'] },
  'torei': { title: 'TOREI', folders: ['torei'] },
  'looking-glass': { title: 'Looking Glass EP', folders: ['LookingGlassAlbumArt'] }
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

const mediaForFolder = async (folder, title) => {
  let names = [];
  try {
    names = await readdir(path.join(root, folder));
  } catch {
    return [];
  }

  return names
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .flatMap((name) => {
      const type = mediaType(name);
      if (!type) return [];
      return [{
        src: publicAssetPath(folder, name),
        type,
        alt: `${title} — ${path.parse(name).name}`
      }];
    });
};

const output = { generatedAt: new Date().toISOString(), projects: {} };

for (const [key, project] of Object.entries(projects)) {
  const folderAssets = (await Promise.all(project.folders.map((folder) => mediaForFolder(folder, project.title)))).flat();
  const fileAssets = (project.files || []).flatMap((name) => {
    const type = mediaType(name);
    return type ? [{ src: publicAssetPath(name), type, alt: `${project.title} — ${path.parse(name).name}` }] : [];
  });
  const localAssets = [...folderAssets, ...fileAssets];
  const seen = new Set();
  const assets = [...localAssets, ...(embeds[key] || [])].filter((asset) => {
    if (seen.has(asset.src)) return false;
    seen.add(asset.src);
    return true;
  });
  const preview = localAssets.find((asset) => /preview/i.test(path.basename(asset.src)))
    || localAssets.find((asset) => /thumbnail/i.test(path.basename(asset.src)))
    || localAssets[0];

  output.projects[key] = {
    slug: key,
    title: project.title,
    preview: preview?.src,
    assets
  };
}

await writeFile(path.join(root, 'manifest.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${Object.keys(output.projects).length} project mappings with ${Object.values(output.projects).reduce((sum, project) => sum + project.assets.length, 0)} assets.`);
