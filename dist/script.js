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

const setPreviewPlayback = (shell, playing) => {
  const video = shell.querySelector('video');
  if (!video) return;
  if (playing) video.play().catch(() => {});
  else video.pause();
};

const closePreviews = (except) => {
  previewShells.forEach((shell) => {
    if (shell === except) return;
    shell.classList.remove('is-open');
    shell.querySelector('.preview-trigger').setAttribute('aria-expanded', 'false');
    shell.querySelector('.preview-card').setAttribute('aria-hidden', 'true');
    setPreviewPlayback(shell, false);
  });
};

previewShells.forEach((shell) => {
  const trigger = shell.querySelector('.preview-trigger');
  const card = shell.querySelector('.preview-card');

  shell.addEventListener('mouseenter', () => setPreviewPlayback(shell, true));
  shell.addEventListener('mouseleave', () => {
    if (!shell.classList.contains('is-open')) setPreviewPlayback(shell, false);
  });
  shell.addEventListener('focusin', () => setPreviewPlayback(shell, true));
  shell.addEventListener('focusout', () => {
    requestAnimationFrame(() => {
      if (!shell.contains(document.activeElement) && !shell.classList.contains('is-open')) {
        setPreviewPlayback(shell, false);
      }
    });
  });

  trigger.addEventListener('click', (event) => {
    const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const isOpen = shell.classList.contains('is-open');

    if (trigger.tagName === 'BUTTON' || (coarsePointer && !isOpen)) event.preventDefault();
    if (trigger.tagName === 'A' && (!coarsePointer || isOpen)) return;

    closePreviews(shell);
    shell.classList.toggle('is-open', !isOpen);
    trigger.setAttribute('aria-expanded', String(!isOpen));
    card.setAttribute('aria-hidden', String(isOpen));
    setPreviewPlayback(shell, !isOpen);
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.preview-shell')) closePreviews();
});
