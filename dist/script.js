const setGroup = (group, open) => {
  const trigger = group.querySelector(':scope > .group-trigger, :scope > .nested-trigger, :scope > .previous-row > .group-trigger');
  const panel = group.querySelector(':scope > div');
  group.classList.toggle('is-open', open);
  trigger.setAttribute('aria-expanded', String(open));
  panel.inert = !open;
};

document.querySelectorAll('.load-line').forEach((line) => {
  line.addEventListener('animationend', () => line.classList.remove('load-line'), { once: true });
});

document.querySelectorAll('.group').forEach((group) => {
  group.querySelector(':scope > .group-trigger, :scope > .previous-row > .group-trigger').addEventListener('click', () => {
    setGroup(group, !group.classList.contains('is-open'));
  });
});

document.querySelectorAll('.nested-group').forEach((group) => {
  group.querySelector(':scope > .nested-trigger').addEventListener('click', () => {
    setGroup(group, !group.classList.contains('is-open'));
  });
});

const previewShells = [...document.querySelectorAll('.preview-shell')];

const closePreviews = (except) => {
  previewShells.forEach((shell) => {
    if (shell === except) return;
    shell.classList.remove('is-open');
    shell.querySelector('.preview-trigger').setAttribute('aria-expanded', 'false');
    shell.querySelector('.preview-card').setAttribute('aria-hidden', 'true');
  });
};

previewShells.forEach((shell) => {
  const trigger = shell.querySelector('.preview-trigger');
  const card = shell.querySelector('.preview-card');

  trigger.addEventListener('click', (event) => {
    const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const isOpen = shell.classList.contains('is-open');

    if (trigger.tagName === 'BUTTON' || (coarsePointer && !isOpen)) event.preventDefault();
    if (trigger.tagName === 'A' && (!coarsePointer || isOpen)) return;

    closePreviews(shell);
    shell.classList.toggle('is-open', !isOpen);
    trigger.setAttribute('aria-expanded', String(!isOpen));
    card.setAttribute('aria-hidden', String(isOpen));
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.preview-shell')) closePreviews();
});

document.querySelectorAll('[data-cycle-preview]').forEach((shell) => {
  const sources = shell.dataset.sources.split('|');
  const layers = [...shell.querySelectorAll('.cia-cycle-image')];
  let activeLayer = 0;
  let sourceIndex = 0;
  let timer;
  let runId = 0;
  let preloaded = false;

  const reset = () => {
    clearTimeout(timer);
    timer = undefined;
    runId += 1;
    sourceIndex = 0;
    activeLayer = 0;
    layers.forEach((layer, index) => layer.classList.toggle('is-active', index === 0));
    layers[0].src = sources[0];
  };

  const advance = async (id) => {
    if (id !== runId) return;
    const nextSource = (sourceIndex + 1) % sources.length;
    const nextLayer = activeLayer === 0 ? 1 : 0;
    layers[nextLayer].src = sources[nextSource];
    try { await layers[nextLayer].decode(); } catch {}
    if (id !== runId) return;
    layers[activeLayer].classList.remove('is-active');
    layers[nextLayer].classList.add('is-active');
    activeLayer = nextLayer;
    sourceIndex = nextSource;
    timer = setTimeout(() => advance(id), 1050);
  };

  const start = () => {
    if (timer) return;
    if (!preloaded) {
      sources.slice(1).forEach((source) => { const image = new Image(); image.src = source; });
      preloaded = true;
    }
    runId += 1;
    timer = setTimeout(() => advance(runId), 850);
  };

  const stopIfInactive = () => {
    requestAnimationFrame(() => {
      if (!shell.matches(':hover, :focus-within') && !shell.classList.contains('is-open')) reset();
    });
  };

  shell.addEventListener('mouseenter', start);
  shell.addEventListener('mouseleave', stopIfInactive);
  shell.addEventListener('focusin', start);
  shell.addEventListener('focusout', stopIfInactive);
  shell.querySelector('.preview-trigger').addEventListener('click', () => {
    requestAnimationFrame(() => shell.classList.contains('is-open') ? start() : stopIfInactive());
  });
  document.addEventListener('click', stopIfInactive);
});
