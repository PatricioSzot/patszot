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

const timelineData = [
  {
    year: 'Present',
    entries: [
      { date: '2026', kind: 'work', title: 'Brand Engineer, AirOps', url: 'https://www.airops.com/', description: 'Market repositioning, brand and web transformation, image systems, and marketing tooling.', intensity: 150 }
    ]
  },
  {
    year: '2025',
    entries: [
      { date: '2025', kind: 'project', title: 'GlossAI Rebrand', url: 'https://glossgenius.com/', description: 'Brand identity and launch expression for GlossGenius.', intensity: 124 },
      { date: '2025', kind: 'project', title: 'Lovable', description: 'Brand work for a fast-moving product company.', intensity: 92 }
    ]
  },
  {
    year: '2024',
    entries: [
      { date: 'July 29', kind: 'writing', title: 'I Was Separated From My Position at Webflow', url: 'https://patrickszot.webflow.io/journal/i-got-seperated-from-my-position-at-webflow', description: 'A candid reflection on the end of a chapter.', intensity: 80 },
      { date: '2022–24', kind: 'project', title: 'Webflow Rebrand', url: 'https://patrickszot.webflow.io/recent-work/webflow-rebrand', description: 'Visual foundations, motion guidelines, campaigns, customer stories, and event systems.', intensity: 176 }
    ]
  },
  {
    year: '2023',
    entries: [
      { date: 'January 4', kind: 'writing', title: '2022 Retrospective: Leadership and Soft Skills', url: 'https://patrickszot.webflow.io/journal/2022-retrospective', description: 'Notes on leadership, collaboration, and creative practice.', intensity: 72 },
      { date: '2023', kind: 'project', title: 'Webflow visual foundations', url: 'https://patrickszot.webflow.io/recent-work/webflow-rebrand', description: 'Illustration, sub-branding, color, lighting, motion, and more than 1,000 custom icons.', intensity: 148 }
    ]
  },
  {
    year: '2022',
    entries: [
      { date: 'September 20', kind: 'writing', title: 'More Words ≠ More Clarity', url: 'https://patrickszot.webflow.io/journal/more-words-is-not-more-clarity', description: 'On communication, editing, and finding the useful idea.', intensity: 68 },
      { date: '2022', kind: 'project', title: 'Webflow Conf 2022', url: 'https://patrickszot.webflow.io/recent-work/webflow-conf', description: 'A layered event system spanning brand, interface, art direction, and production.', intensity: 170 },
      { date: 'January', kind: 'milestone', title: 'Joined Webflow', url: 'https://patrickszot.webflow.io/about', description: 'Moved from agency work into an in-house startup brand team.', intensity: 116 },
      { date: 'January 2', kind: 'writing', title: '2021 Retrospective: Producing and Cycles', url: 'https://patrickszot.webflow.io/journal/2021-retrospective', description: 'A review of creative production, repetition, and momentum.', intensity: 74 }
    ]
  },
  {
    year: '2021',
    entries: [
      { date: 'November', kind: 'work', title: 'Recruiting Committee', description: 'Supported hiring for UI and brand design.', intensity: 64 },
      { date: 'November', kind: 'project', title: 'WNBA Pursuit', description: 'Led UI tenets and a product vision for digital experiences and brand.', intensity: 102 },
      { date: 'September', kind: 'milestone', title: 'National Studios art commission', description: 'Commissioned print production for eight unique works delivered at a leadership summit.', intensity: 128 },
      { date: 'August', kind: 'project', title: 'Thrivent Financial app and web', url: 'https://patrickszot.webflow.io/older-work/thrivent', description: 'Led brand expansion and UI design across concepting, production, and web development.', intensity: 148 },
      { date: 'June 14', kind: 'writing', title: 'Personality and Clarity: Brands Will Eventually Walk and Talk', url: 'https://patrickszot.webflow.io/journal/personality-and-clarity', description: 'A short essay on expressive brand systems.', intensity: 76 },
      { date: 'June', kind: 'project', title: 'Deloitte Digital National Brand Launch', description: 'Co-led a national localization of the “Hello New” refresh and collateral.', intensity: 108 },
      { date: 'May', kind: 'project', title: 'David Yurman pitch', description: 'Led UI tenets and product vision for the flagship site and app.', intensity: 96 },
      { date: 'March', kind: 'project', title: 'Transamerica', description: 'Led visual identity and brand design for Moving Logistics Partnership.', intensity: 132 },
      { date: 'January', kind: 'project', title: 'UBS mobile app', description: 'Supported production for the mobile onboarding experience.', intensity: 82 },
      { date: 'January', kind: 'milestone', title: 'Promoted to Senior Brand / UI Designer', intensity: 92 }
    ]
  },
  {
    year: '2020',
    entries: [
      { date: 'December', kind: 'project', title: 'FAF guidance sites', description: 'Sole UI designer for Financial Accounting Foundation guidance sites.', intensity: 106 },
      { date: 'October', kind: 'project', title: 'Marriott Vacation Worldwide brand and identity toolkit', description: 'Logo design and visual concepting for an internal brand toolkit.', intensity: 120 },
      { date: 'September', kind: 'project', title: 'SNHU learner portal', description: 'UI design for a Salesforce Communities web product and contract-to-studio transition.', intensity: 114 },
      { date: 'July 31', kind: 'writing', title: 'The Use of the Words “Creativity” and “Innovation”', url: 'https://patrickszot.webflow.io/journal/creativity-innovation', description: 'A critique of two heavily used creative-industry terms.', intensity: 72 },
      { date: 'July', kind: 'project', title: 'The Smart Factory', url: 'https://patrickszot.webflow.io/older-work/the-smart-factory', description: 'Brand concepting, logo development, and usage guidelines for Deloitte Market Offering.', intensity: 152 },
      { date: 'June 2', kind: 'writing', title: 'Winning Fulbright Fellowship Essay', url: 'https://patrickszot.webflow.io/journal/fulbright-fellowship', description: 'The essay behind a Fulbright award.', intensity: 78 },
      { date: 'June', kind: 'project', title: 'Global Marketing Trends 2021', url: 'https://patrickszot.webflow.io/older-work/dolores-debitis-omnis-qui', description: 'Brand concepting, development, and UI for a seven-story trends report.', intensity: 142 },
      { date: 'April', kind: 'project', title: 'Takeda social campaign and COVID-19 microsite', description: 'Visual concepting, asset development, and UI design.', intensity: 96 },
      { date: 'April', kind: 'project', title: 'New Balance', description: 'UI production assets for a flagship web property.', intensity: 76 },
      { date: 'March', kind: 'milestone', title: 'Shifted to fully remote work', intensity: 82 },
      { date: 'March', kind: 'project', title: 'CIA.gov site implementation', url: 'https://patrickszot.webflow.io/older-work/cia', description: 'Co-led brand application, product development, and library design for a recruiting and marketing site.', intensity: 164 },
      { date: 'February 5', kind: 'writing', title: 'When People Say, “I’m Not Creative”', url: 'https://patrickszot.webflow.io/journal/scared-to-try', description: 'On fear, experimentation, and creative identity.', intensity: 66 },
      { date: 'January 14', kind: 'writing', title: 'Recurring Evidence that Everything is a Metaphor', url: 'https://patrickszot.webflow.io/journal/everything-is-a-metaphor', description: 'Notes on analogy as a design and thinking tool.', intensity: 64 }
    ]
  },
  {
    year: '2019',
    entries: [
      { date: 'December', kind: 'project', title: 'Lilly Pulitzer Virtual Runway', url: 'https://patrickszot.webflow.io/older-work/lilly', description: 'A virtual activation pitch shaped with creative directors, designers, and production.', intensity: 132 },
      { date: 'December', kind: 'project', title: 'National Air and Space Museum hackathon', description: 'Led brand engagement and guided junior practitioners through strategy and production.', intensity: 118 },
      { date: 'October', kind: 'project', title: 'G200.GOV rebrand', description: 'Moodboarding, logo and glyph ideation, visual language, presentation development, and product development.', intensity: 144 },
      { date: 'September', kind: 'milestone', title: 'Opened Austin Studio', intensity: 84 },
      { date: 'August', kind: 'project', title: 'Deloitte Digital DC Brand POV', description: 'Formalized and developed a national branding point of view and usage deck.', intensity: 112 },
      { date: 'August', kind: 'project', title: 'Transcom', description: 'Visual identity and brand design for Moving Logistics Partnership.', intensity: 126 },
      { date: 'July 29', kind: 'writing', title: 'Redux: Noble Goblin and The Courage to Leave', url: 'https://patrickszot.webflow.io/journal/redux', description: 'A reflection on change and choosing a new direction.', intensity: 70 },
      { date: 'June', kind: 'milestone', title: 'Started NYC transfer process', intensity: 82 },
      { date: 'June', kind: 'project', title: 'Access Arkansas', description: 'Identity workshop, state-system brand design, and deliverable presentation.', intensity: 120 },
      { date: 'May', kind: 'project', title: 'Fenway agency-of-record pitch', description: 'Evolved, illustrated, and delivered the studio point of view on brand maps.', intensity: 104 },
      { date: 'March', kind: 'project', title: 'NextGen 3.0, Kentucky', description: 'Designed a white-label product and six-figure state-delivery deal.', intensity: 136 }
    ]
  },
  {
    year: '2018',
    entries: [
      { date: 'December', kind: 'project', title: 'CMS Medishield', description: 'UX / UI lead for a high-fidelity prototype.', intensity: 86 },
      { date: 'December', kind: 'project', title: 'Deloitte Digital DC Culture Site', description: 'UX / UI lead collaborating with engineers through rapid development.', intensity: 104 },
      { date: 'December', kind: 'project', title: 'NextGen PMO', description: 'Clarified data-visualization requirements and delegated production.', intensity: 98 },
      { date: 'November', kind: 'project', title: 'GPS 4 GPS', description: 'UX subject-matter expert.', intensity: 70 },
      { date: 'October', kind: 'milestone', title: 'Onboarding Chair', intensity: 74 },
      { date: 'September', kind: 'project', title: 'EMMA proposal', description: 'UX / UI lead for an animated executive presentation.', intensity: 102 },
      { date: 'September', kind: 'milestone', title: 'TFP Instructor', intensity: 76 },
      { date: 'August', kind: 'project', title: 'NextGen 3.0', description: 'UX / UI lead for prototype animation and junior-team delegation.', intensity: 150 },
      { date: 'June', kind: 'project', title: 'ARC visual design', description: 'Developed brand, voice, and visual language.', intensity: 110 },
      { date: 'May', kind: 'project', title: 'LA geographic expansion', description: 'Led a data-visualization lane and developed a Tableau analytical dashboard.', intensity: 130 },
      { date: 'May', kind: 'project', title: 'USPS PA / Covalence', description: 'Led network data visualization and database development.', intensity: 126 },
      { date: 'April', kind: 'milestone', title: 'Won Fulbright Fellowship', url: 'https://patrickszot.webflow.io/journal/fulbright-fellowship', intensity: 90 },
      { date: 'March', kind: 'project', title: 'FDIC E.I.', description: 'Led UX research, executive interviews, and a product-visioning session.', intensity: 114 },
      { date: 'February', kind: 'project', title: 'Deloitte University', description: 'Led a team through technical simulation.', intensity: 82 },
      { date: 'February', kind: 'milestone', title: 'Accepted an offer at Deloitte Digital', intensity: 80 },
      { date: 'January', kind: 'project', title: 'Facebook IQ', description: 'Subcontracted to lead research in Bangkok, Johannesburg, and São Paulo.', intensity: 140 },
      { date: 'January', kind: 'project', title: 'D3 Systems, Inc.', description: 'Led product development, international research, and a contract team.', intensity: 132 }
    ]
  },
  {
    year: '2017',
    entries: [
      { date: 'October 21', kind: 'writing', title: 'Winning Gilman Scholarship Essay', url: 'https://patrickszot.webflow.io/journal/the-ticking-bomb-of-usability', description: 'The essay behind a Gilman Scholarship.', intensity: 76 },
      { date: '2017', kind: 'project', title: 'CIA.gov / Blackbriar design system', url: 'https://patrickszot.webflow.io/older-work/cia', description: 'A recruiting identity shaped by the tension between the Agency’s history and its future.', intensity: 142 }
    ]
  },
  {
    year: '2016',
    entries: [
      { date: 'Early practice', kind: 'milestone', title: 'Independent design work', url: 'https://patrickszot.webflow.io/about', description: 'Freelance and subcontracted work while completing degrees in finance and design.', intensity: 108 },
      { date: 'Independent', kind: 'project', title: 'Rite of Spring', url: 'https://patrickszot.webflow.io/older-work/rite-of-spring', description: 'A self-published novel and visual system spanning a bound book and website.', intensity: 120 },
      { date: 'Independent', kind: 'project', title: 'TOREI (トレイ)', url: 'https://patrickszot.webflow.io/older-work/torei', description: 'Brand, social, and art direction for a double-album release.', intensity: 112 },
      { date: 'Independent', kind: 'project', title: 'Looking Glass EP', url: 'https://patrickszot.webflow.io/older-work/looking-glass', description: 'Album art, audiovisualizers, and Spotify Canvases for a five-track EP.', intensity: 94 }
    ]
  }
];

const timeline = document.querySelector('#career-timeline');
const detailsGroup = document.querySelector('.details-group');
const detailsTrigger = document.querySelector('#details-trigger');
const timelinePanel = document.querySelector('#timeline-panel');
const detailsLabel = detailsTrigger.querySelector('.details-label');

const entryMarkup = (entry) => {
  const title = entry.url
    ? `<a href="${entry.url}" target="_blank" rel="noopener">${entry.title}</a>`
    : entry.title;
  return `
    <article class="timeline-entry" data-kind="${entry.kind}" style="--disc: ${entry.intensity}px">
      <span class="timeline-marker" aria-hidden="true"></span>
      <div class="timeline-meta"><time>${entry.date}</time><span>${entry.kind}</span></div>
      <h3>${title}</h3>
      ${entry.description ? `<p>${entry.description}</p>` : ''}
    </article>`;
};

timeline.innerHTML = timelineData.map((section) => `
  <section class="timeline-year" aria-labelledby="year-${section.year.toLowerCase()}">
    <h2 class="timeline-year-heading" id="year-${section.year.toLowerCase()}">${section.year}</h2>
    ${section.entries.map(entryMarkup).join('')}
  </section>`).join('');

const timelineEntries = [...timeline.querySelectorAll('.timeline-entry')];
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { rootMargin: '0px 0px -10% 0px', threshold: .12 });

timelineEntries.forEach((entry) => revealObserver.observe(entry));

detailsTrigger.addEventListener('click', () => {
  const open = !detailsGroup.classList.contains('is-open');
  detailsTrigger.setAttribute('aria-expanded', String(open));
  detailsLabel.textContent = open ? 'Less detail' : 'More detail';

  if (open) {
    document.body.classList.add('details-open');
    timelinePanel.inert = false;
    requestAnimationFrame(() => detailsGroup.classList.add('is-open'));
    return;
  }

  detailsGroup.classList.remove('is-open');
  timelineEntries.forEach((entry) => entry.classList.remove('is-visible'));
  window.setTimeout(() => {
    timelinePanel.inert = true;
    document.body.classList.remove('details-open');
    timelineEntries.forEach((entry) => revealObserver.observe(entry));
  }, 900);
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
