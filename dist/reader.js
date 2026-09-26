const reader = document.querySelector('#reader');
const params = new URLSearchParams(window.location.search);
const articleId = params.get('article');
const sourceUrl = params.get('source');
const originalUrl = params.get('original');

const escapeHtml = (value = '') => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const inline = (value) => escapeHtml(value)
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/_([^_]+)_/g, '<em>$1</em>')
  .replace(/\*([^*]+)\*/g, '<em>$1</em>');

const renderArticle = (source) => {
  const title = source.match(/^Title:\s*(.+)$/m)?.[1]?.trim() || 'Article';
  const published = source.match(/^Published Time:\s*(.+)$/m)?.[1]?.trim();
  let body = source.split('Markdown Content:')[1]?.trim() || source;
  if (originalUrl?.includes('dribbble.com/shots/')) {
    const projectStart = body.search(/\[!\[Image \d+\]\(https?:\/\//);
    if (projectStart >= 0) body = body.slice(projectStart);
    const recommendationsStart = body.search(/^#{3,5}\s+(More by|You might also like)/m);
    if (recommendationsStart >= 0) body = body.slice(0, recommendationsStart);
  }
  const lines = body.split(/\r?\n/);
  const output = [`<header class="reader-header"><h1>${inline(title)}</h1>${published ? `<p class="reader-meta">${new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(published))}</p>` : ''}</header>`];
  let listOpen = false;

  const closeList = () => {
    if (!listOpen) return;
    output.push('</ul>');
    listOpen = false;
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line || /^--$/.test(line) || /^\*$/.test(line) || /^\[\]\(https?:\/\/[^)]+\)$/.test(line) || /^Press enter or click to view image/.test(line)) {
      closeList();
      return;
    }
    if (/^\[!\[Image 1:/.test(line) || /^\d+ min read$/.test(line) || /^[A-Z][a-z]{2} \d{1,2}, \d{4}$/.test(line)) return;
    const images = [...line.matchAll(/!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g)];
    if (images.length) {
      closeList();
      images.forEach((image) => output.push(`<img src="${escapeHtml(image[2])}" alt="${escapeHtml(image[1].replace(/^Image \d+:?\s*/, ''))}" loading="lazy" />`));
      return;
    }
    const video = line.match(/^\[Video \d+\]\((https?:\/\/[^)]+\.mp4[^)]*)\)$/);
    if (video) {
      closeList();
      output.push(`<video src="${escapeHtml(video[1])}" controls muted playsinline preload="metadata"></video>`);
      return;
    }
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      output.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      return;
    }
    if (line.startsWith('> ')) {
      closeList();
      output.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
      return;
    }
    const listItem = line.match(/^\*\s+(.+)$/);
    if (listItem) {
      if (!listOpen) {
        output.push('<ul>');
        listOpen = true;
      }
      output.push(`<li>${inline(listItem[1])}</li>`);
      return;
    }
    closeList();
    output.push(`<p>${inline(line)}</p>`);
  });
  closeList();
  reader.innerHTML = output.join('');
  reader.querySelectorAll(':scope > *').forEach((element, index) => element.style.setProperty('--reader-index', index));
  document.title = title;
};

const showError = () => {
  const safeUrl = originalUrl?.startsWith('https://medium.com/') ? originalUrl : '';
  reader.innerHTML = `<p class="reader-error">The article could not be loaded.${safeUrl ? ` <a href="${escapeHtml(safeUrl)}">Open the original</a>.` : ''}</p>`;
};

const resolveArticleId = () => {
  if (/^[a-f0-9]{12}$/.test(articleId || '')) return Promise.resolve(articleId);
  if (!sourceUrl?.startsWith('https://')) return Promise.reject(new Error('Invalid source'));
  return fetch('articles/index.json')
    .then((response) => {
      if (!response.ok) throw new Error('Index unavailable');
      return response.json();
    })
    .then((index) => index[sourceUrl] || Promise.reject(new Error('Source unavailable')));
};

resolveArticleId()
  .then((resolvedId) => fetch(`articles/${resolvedId}.md`))
    .then((response) => {
      if (!response.ok) throw new Error('Article unavailable');
      return response.text();
    })
    .then(renderArticle)
    .catch(showError);
