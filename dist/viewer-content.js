window.NativeContentViewer = (() => {
  let articleIndexPromise;
  let youtubeApiPromise;

  const escapeHtml = (value = '') => value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

  const inline = (value) => escapeHtml(value)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<span class="native-inline-link">$1</span>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

  const getJson = (path) => fetch(path).then((response) => {
    if (!response.ok) throw new Error(`${path} unavailable`);
    return response.json();
  });

  const getSource = async (url) => {
    articleIndexPromise ||= getJson('articles/index.json');
    const index = await articleIndexPromise;
    const id = index[url];
    if (!id) throw new Error('Source unavailable');
    const response = await fetch(`articles/${id}.md`);
    if (!response.ok) throw new Error('Content unavailable');
    return response.text();
  };

  const sourceBody = (source) => source.split('Markdown Content:')[1]?.trim() || source;
  const sourceTitle = (source, fallback) => source.match(/^Title:\s*(.+)$/m)?.[1]?.trim() || fallback;

  const renderWriting = (container, source, fallbackTitle) => {
    const title = sourceTitle(source, fallbackTitle);
    const published = source.match(/^Published Time:\s*(.+)$/m)?.[1]?.trim();
    const lines = sourceBody(source).split(/\r?\n/);
    const output = [`<article class="native-reader"><header class="native-reader-header"><h1>${inline(title)}</h1>${published ? `<p class="native-reader-meta">${new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(published))}</p>` : ''}</header>`];
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
      if (/^(Get Patrick Szot’s stories in your inbox|Join Medium for free|Remember me for faster sign in)$/.test(line)) return;
      const images = [...line.matchAll(/!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g)];
      if (images.length) {
        closeList();
        images.forEach((image) => output.push(`<img src="${escapeHtml(image[2])}" alt="${escapeHtml(image[1].replace(/^Image \d+:?\s*/, ''))}" loading="lazy" />`));
        return;
      }
      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        closeList();
        const level = Math.min(3, heading[1].length + 1);
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
    output.push('</article>');
    container.innerHTML = output.join('');
  };

  const youtubeId = (url) => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1);
      if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v') || parsed.pathname.split('/embed/')[1];
    } catch {}
    return undefined;
  };

  const cleanMediaUrl = (url) => url.replaceAll('{width}', '1200').replaceAll('{height}', '900');

  const extractMedia = async (source, url, previewMedia) => {
    let body = sourceBody(source);
    if (url.includes('dribbble.com/shots/')) {
      const projectStart = body.search(/\[!\[Image \d+\]\(https?:\/\//);
      if (projectStart >= 0) body = body.slice(projectStart);
      const recommendationsStart = body.search(/^#{3,5}\s+(More by|You might also like)/m);
      if (recommendationsStart >= 0) body = body.slice(0, recommendationsStart);
    }

    const media = [];
    const seen = new Set();
    const add = (item) => {
      if (!item?.src || seen.has(item.src) || media.length >= 20) return;
      if (/avatar|icon-|caret-|announcements|\.svg(?:\?|$)/i.test(item.src)) return;
      seen.add(item.src);
      media.push(item);
    };

    if (previewMedia?.currentSrc || previewMedia?.src) {
      add({ type: previewMedia instanceof HTMLVideoElement ? 'video' : 'image', src: previewMedia.currentSrc || previewMedia.src, alt: previewMedia.getAttribute('alt') || '' });
    }

    for (const match of body.matchAll(/!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g)) {
      const original = cleanMediaUrl(match[2]);
      if (/\.gif(?:\?|$)/i.test(original)) {
        add({ type: 'gif', src: original, alt: match[1] });
      } else {
        add({ type: 'image', src: original, alt: match[1].replace(/^Image \d+:?\s*/, '') });
      }
    }

    for (const match of body.matchAll(/\[Video \d+\]\((https?:\/\/[^)]+)\)/g)) {
      const id = youtubeId(match[1]);
      if (id) add({ type: 'youtube', src: match[1], id, alt: 'Video' });
      else if (/\.mp4(?:\?|$)/i.test(match[1])) add({ type: 'video', src: match[1], alt: 'Video' });
    }

    return media;
  };

  const loadYoutubeApi = () => {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    if (youtubeApiPromise) return youtubeApiPromise;
    youtubeApiPromise = new Promise((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve(window.YT);
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onerror = () => reject(new Error('YouTube unavailable'));
      document.head.append(script);
      window.setTimeout(() => {
        if (!window.YT?.Player) reject(new Error('YouTube unavailable'));
      }, 7000);
    });
    return youtubeApiPromise;
  };

  const renderCarousel = (container, media, title, reducedMotion) => {
    container.innerHTML = `<div class="native-carousel" aria-label="${escapeHtml(title)} media"><div class="native-carousel-stage"></div><div class="native-carousel-controls"><button class="native-carousel-previous" type="button" aria-label="Previous media"><i class="ri-arrow-left-line" aria-hidden="true"></i></button><span class="native-carousel-count" aria-live="polite"></span><button class="native-carousel-next" type="button" aria-label="Next media"><i class="ri-arrow-right-line" aria-hidden="true"></i></button></div></div>`;
    const stage = container.querySelector('.native-carousel-stage');
    const count = container.querySelector('.native-carousel-count');
    const previousButton = container.querySelector('.native-carousel-previous');
    const nextButton = container.querySelector('.native-carousel-next');
    let index = 0;
    let timer;
    let youtubePlayer;
    let destroyed = false;
    let pointerStartX;

    const stopCurrent = () => {
      window.clearTimeout(timer);
      stage.querySelector('video')?.pause();
      youtubePlayer?.destroy?.();
      youtubePlayer = undefined;
    };

    const removeBroken = () => {
      media.splice(index, 1);
      if (!media.length) {
        stage.innerHTML = `<p class="native-empty">${escapeHtml(title)}</p>`;
        count.textContent = '';
        previousButton.hidden = true;
        nextButton.hidden = true;
        return;
      }
      index %= media.length;
      show(index, 0);
    };

    const scheduleNext = () => {
      window.clearTimeout(timer);
      if (media.length < 2 || reducedMotion) return;
      timer = window.setTimeout(() => show(index + 1, 1), 4400);
    };

    const playGifOnce = async (canvas, item) => {
      if (!('ImageDecoder' in window)) throw new Error('GIF decoder unavailable');
      const response = await fetch(item.src);
      if (!response.ok) throw new Error('GIF unavailable');
      const decoder = new ImageDecoder({ data: await response.arrayBuffer(), type: 'image/gif' });
      await decoder.tracks.ready;
      const frameCount = decoder.tracks.selectedTrack.frameCount;
      const context = canvas.getContext('2d');
      for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
        if (destroyed || !canvas.isConnected) break;
        const result = await decoder.decode({ frameIndex, completeFramesOnly: true });
        if (!canvas.width) {
          canvas.width = result.image.displayWidth;
          canvas.height = result.image.displayHeight;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(result.image, 0, 0, canvas.width, canvas.height);
        const duration = Math.max(20, Math.min(1000, (result.image.duration || 100000) / 1000));
        result.image.close();
        await new Promise((resolve) => { timer = window.setTimeout(resolve, duration); });
      }
      decoder.close();
      if (!destroyed && canvas.isConnected && media.length > 1) show(index + 1, 1);
    };

    const show = (nextIndex, direction = 1) => {
      if (destroyed || !media.length) return;
      stopCurrent();
      index = (nextIndex + media.length) % media.length;
      const item = media[index];
      const slide = document.createElement('figure');
      slide.className = 'native-carousel-slide';
      slide.style.setProperty('--slide-direction', String(direction));
      count.textContent = media.length > 1 ? `${index + 1} / ${media.length}` : '';
      previousButton.hidden = media.length < 2;
      nextButton.hidden = media.length < 2;

      if (item.type === 'image') {
        const image = new Image();
        image.alt = item.alt || '';
        image.decoding = 'async';
        image.onload = scheduleNext;
        image.onerror = () => { if (image.isConnected) removeBroken(); };
        image.src = item.src;
        slide.append(image);
      } else if (item.type === 'gif') {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', item.alt || 'Animation');
        slide.append(canvas);
        playGifOnce(canvas, item).catch(() => { if (canvas.isConnected) removeBroken(); });
      } else if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.src;
        video.muted = true;
        video.playsInline = true;
        video.controls = true;
        video.autoplay = true;
        video.preload = 'metadata';
        video.loop = false;
        video.addEventListener('ended', () => media.length > 1 && show(index + 1, 1), { once: true });
        video.addEventListener('error', () => { if (video.isConnected) removeBroken(); }, { once: true });
        video.addEventListener('canplay', () => video.play().catch(() => {}), { once: true });
        window.setTimeout(() => { if (video.isConnected && video.readyState < 2) removeBroken(); }, 5000);
        slide.append(video);
      } else {
        const youtubeHost = document.createElement('div');
        youtubeHost.className = 'native-youtube';
        slide.append(youtubeHost);
        loadYoutubeApi().then((YT) => {
          if (destroyed || !youtubeHost.isConnected) return;
          youtubePlayer = new YT.Player(youtubeHost, {
            videoId: item.id,
            playerVars: { autoplay: 1, controls: 1, playsinline: 1, rel: 0, mute: 1 },
            events: {
              onReady: (event) => { event.target.mute(); event.target.playVideo(); },
              onStateChange: (event) => { if (event.data === YT.PlayerState.ENDED && media.length > 1) show(index + 1, 1); },
              onError: removeBroken
            }
          });
        }).catch(removeBroken);
      }

      stage.replaceChildren(slide);
      requestAnimationFrame(() => slide.classList.add('is-visible'));
    };

    const next = () => show(index + 1, 1);
    const previous = () => show(index - 1, -1);
    const pauseAuto = () => window.clearTimeout(timer);
    const resumeAuto = () => { if (media[index]?.type === 'image') scheduleNext(); };
    const rememberPointer = (event) => { pointerStartX = event.clientX; };
    const finishPointer = (event) => {
      if (pointerStartX === undefined) return;
      const distance = event.clientX - pointerStartX;
      pointerStartX = undefined;
      if (Math.abs(distance) < 36) return;
      if (distance < 0) next();
      else previous();
    };
    nextButton.addEventListener('click', next);
    previousButton.addEventListener('click', previous);
    container.addEventListener('mouseenter', pauseAuto);
    container.addEventListener('mouseleave', resumeAuto);
    container.addEventListener('focusin', pauseAuto);
    container.addEventListener('focusout', resumeAuto);
    stage.addEventListener('pointerdown', rememberPointer);
    stage.addEventListener('pointerup', finishPointer);
    show(0, 0);

    return {
      next,
      previous,
      destroy: ({ keepContent = false } = {}) => {
        destroyed = true;
        stopCurrent();
        container.removeEventListener('mouseenter', pauseAuto);
        container.removeEventListener('mouseleave', resumeAuto);
        container.removeEventListener('focusin', pauseAuto);
        container.removeEventListener('focusout', resumeAuto);
        stage.removeEventListener('pointerdown', rememberPointer);
        stage.removeEventListener('pointerup', finishPointer);
        if (!keepContent) container.replaceChildren();
      }
    };
  };

  const load = async ({ container, kind, previewMedia, reducedMotion, title, url }) => {
    try {
      const source = await getSource(url);
      const writing = kind === 'writing' || /(^|\.)medium\.com$/.test(new URL(url).hostname) || /\/journal\//.test(new URL(url).pathname);
      if (writing) {
        renderWriting(container, source, title);
        return { destroy: ({ keepContent = false } = {}) => { if (!keepContent) container.replaceChildren(); } };
      }
      const media = await extractMedia(source, url, previewMedia);
      return renderCarousel(container, media, title, reducedMotion);
    } catch {
      const media = [];
      if (previewMedia?.currentSrc || previewMedia?.src) media.push({ type: previewMedia instanceof HTMLVideoElement ? 'video' : 'image', src: previewMedia.currentSrc || previewMedia.src, alt: previewMedia.getAttribute('alt') || '' });
      return renderCarousel(container, media, title, reducedMotion);
    }
  };

  return { load };
})();
