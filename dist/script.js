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
    year: '2026',
    entries: [
      { date: 'January 22', kind: 'writing', title: 'My Inner Circle is Made Up of Bad-ass Women', url: 'https://medium.com/@patrick.m.szot/my-inner-circle-is-made-up-of-bad-ass-women-5-powers-they-gave-me-that-id-like-to-share-with-you-0e9117e3693a', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*L6Mz9ArPrUDjh_GrxX7Yrg.png', description: 'Five lessons about power, care, and reflecting the world we actually live in.', intensity: 70 }
    ]
  },
  {
    year: '2025',
    entries: [
      { date: 'December 24', kind: 'writing', title: 'The Importance of Celebration and Rest for Creatives', url: 'https://medium.com/@patrick.m.szot/the-importance-of-celebration-and-rest-for-creatives-8cdd66602d74', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*GSVjAl3r5qXH0HcL9gFlSQ.png', description: 'On pausing to recognize the work before moving to the next thing.', intensity: 68 },
      { date: 'May 9', kind: 'writing', title: 'Config 2025: It’s The Same, Just Different This Time', url: 'https://medium.com/@patrick.m.szot/config-2025-its-the-same-just-different-this-time-19ab9ed00a52', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*ht0MLlsIZJJpyYASbWi-dw.png', description: 'Thoughts on beauty, efficient production, and working across aisles.', intensity: 72 },
      { date: '2025', kind: 'project', title: 'GlossAI Rebrand', url: 'https://glossgenius.com/', cover: 'assets/glossgenius-og.webp', description: 'Brand identity and launch expression for GlossGenius.', intensity: 124 },
      { date: '2025', kind: 'project', title: 'Lovable', description: 'Brand work for a fast-moving product company.', intensity: 92 }
    ]
  },
  {
    year: '2024',
    entries: [
      { date: 'November 20', kind: 'writing', title: 'Celebrating My 30th And A Decade in Tech', url: 'https://medium.com/@patrick.m.szot/celebrating-my-30th-and-a-decade-in-tech-2014-2024-1347b3b3ef72', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*zmDBsxxtVsG_WIYBFak_Ug.png', description: 'A decade-in-review across work, practice, and recent flowers from the garden.', intensity: 74 },
      { date: 'July 29', kind: 'writing', title: 'I Was Separated From My Position at Webflow', url: 'https://patrickszot.webflow.io/journal/i-got-seperated-from-my-position-at-webflow', description: 'A candid reflection on the end of a chapter.', intensity: 80 },
      { date: 'June 10', kind: 'project', title: 'Album Art: Presage 2022', url: 'https://dribbble.com/shots/24328431-Album-Art-Presage-2022', cover: 'https://cdn.dribbble.com/userupload/15032821/file/original-fe6a0e24019319be3d899139d9a02b50.png?crop=237x133-2804x2059&format=webp&resize=800x600&vertical=center', intensity: 82 },
      { date: '2022–24', kind: 'project', title: 'Webflow Rebrand', url: 'https://patrickszot.webflow.io/recent-work/webflow-rebrand', cover: 'assets/webflow-motion-guidelines.mp4', description: 'Visual foundations, motion guidelines, campaigns, customer stories, and event systems.', intensity: 176 }
    ]
  },
  {
    year: '2023',
    entries: [
      { date: 'August 21', kind: 'writing', title: 'Care Less: Beneficial Reasons to Loosen Your Grip at Work', url: 'https://medium.com/@patrick.m.szot/care-less-a-case-for-designers-to-loosen-their-grip-at-work-c214fed3ffce', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*lKex14FN1xw8a5k9_Rp5eg.jpeg', description: 'A case for creating enough distance to protect judgment and momentum.', intensity: 70 },
      { date: 'March 11', kind: 'writing', title: 'Personality and Clarity: The Changing Role of Brands in Society', url: 'https://medium.com/@patrick.m.szot/personality-and-clarity-the-changing-role-of-brands-in-society-8d2470076908', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*ChRfyyagLmVHGV__sQozPA.jpeg', description: 'How expressive systems change as brands begin to walk and talk.', intensity: 76 },
      { date: 'February 21', kind: 'writing', title: 'Webflow Conf 2022 Brand System', url: 'https://medium.com/@patrick.m.szot/webflow-conf-2022-brand-system-c9e6c3f13b82', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*OkRIwxUFBv_nq83677bAeQ.jpeg', description: 'The visual system behind Webflow’s 2022 community gathering.', intensity: 82 },
      { date: 'February 13', kind: 'writing', title: 'The Use of the Words “Creativity” and “Innovation”', url: 'https://medium.com/@patrick.m.szot/the-use-of-the-words-creativity-and-innovation-711b20634a15', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*EmXdGmb64afAerxTYXpeQA.png', description: 'On two related words that are often stretched until they lose meaning.', intensity: 68 },
      { date: 'February 12', kind: 'project', title: 'Webflow “User Guide”', url: 'https://dribbble.com/shots/20635546-Webflow-User-Guide', cover: 'https://cdn.dribbble.com/userupload/4614360/file/still-d9d256a232e6beae624e7aec726c1f2d.png?format=webp&resize=800x600&vertical=center', intensity: 66 },
      { date: 'February 5', kind: 'writing', title: 'Winning Fulbright Fellowship Sample Essay', url: 'https://medium.com/@patrick.m.szot/winning-fulbright-fellowship-sample-essays-personal-statement-2018-62a9bebd6708', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*5aWNjUvEs6M-nkmPbqOdew.jpeg', description: 'The personal statement behind a 2018 Fulbright Fellowship.', intensity: 66 },
      { date: 'February 4', kind: 'project', title: 'Webflow Conf 2022 – Process and Guidelines', url: 'https://dribbble.com/shots/20567364-Webflow-Conf-2022-Process-and-Guidelines', cover: 'https://cdn.dribbble.com/userupload/4483551/file/original-4f2dbf8f04413c4c5d18c77e6f5a6b3e.jpg?format=webp&resize=800x600&vertical=center', intensity: 88 },
      { date: 'January 29', kind: 'project', title: '3D Scene', url: 'https://dribbble.com/shots/20509333-3D-Scene', cover: 'https://cdn.dribbble.com/userupload/4444324/file/original-bd42fa6b5f12fe499425bf830b2d67d3.png?crop=0x204-1594x1399&format=webp&resize=800x600&vertical=center', intensity: 52 },
      { date: 'January 29', kind: 'project', title: 'Studio Project Trophy Decks', url: 'https://dribbble.com/shots/20509321-Studio-Project-Trophy-Decks', cover: 'https://cdn.dribbble.com/userupload/4444309/file/still-5c624d0ba182a5c2b957d0687db23250.gif?format=webp&resize=800x600&vertical=center', intensity: 72 },
      { date: 'January 29', kind: 'project', title: 'UI Design – Deloitte Digital Internal Directory', url: 'https://dribbble.com/shots/20509299-UI-Design-Deloitte-Digital-Internal-Directory', cover: 'https://cdn.dribbble.com/userupload/4444285/file/still-f19a182a7cdf6c8b4eb6ae0ec29f7693.gif?format=webp&resize=800x600&vertical=center', intensity: 78 },
      { date: 'January 29', kind: 'project', title: 'Brand Package – Atelier Saady', url: 'https://dribbble.com/shots/20509285-Brand-Package-Atelier-Saady', cover: 'https://cdn.dribbble.com/userupload/4444272/file/original-adb031e59e14d570d577d41332a52485.jpg?crop=0x343-1200x1243&format=webp&resize=800x600&vertical=center', intensity: 70 },
      { date: 'January 29', kind: 'project', title: 'Stylized Logo', url: 'https://dribbble.com/shots/20509280-Stylized-Logo', cover: 'https://cdn.dribbble.com/userupload/4444266/file/still-6a6075d0bf9f167035ecaa292f0f1bf7.gif?format=webp&resize=800x600&vertical=center', intensity: 56 },
      { date: 'January 17', kind: 'project', title: 'Webflow Conf 2022 – Grow with the ’Flow Room', url: 'https://dribbble.com/shots/20410030-Webflow-Conf-2022-Grow-with-the-Flow-room', cover: 'https://cdn.dribbble.com/userupload/4293440/file/original-d1e576e3b7230d2cc45147ed55ac5495.jpg?crop=0x0-1920x1440&format=webp&resize=800x600&vertical=center', intensity: 84 },
      { date: 'January 11', kind: 'project', title: 'Webflow Conf 2022 – Themes', url: 'https://dribbble.com/shots/20356384-Webflow-Conf-2022-Themes', cover: 'https://cdn.dribbble.com/userupload/4272644/file/original-848a983cbfe134a519a90f6802a8dff4.jpg?crop=3x0-1503x1125&format=webp&resize=800x600&vertical=center', intensity: 82 },
      { date: 'January 4', kind: 'writing', title: '2022 Retrospective: Leadership and Soft Skills', url: 'https://patrickszot.webflow.io/journal/2022-retrospective', description: 'Notes on leadership, collaboration, and creative practice.', intensity: 72 },
      { date: '2023', kind: 'project', title: 'Webflow visual foundations', url: 'https://patrickszot.webflow.io/recent-work/webflow-rebrand', cover: 'assets/webflow-motion-guidelines.mp4', description: 'Illustration, sub-branding, color, lighting, motion, and more than 1,000 custom icons.', intensity: 148 }
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
      { date: 'March', kind: 'project', title: 'CIA.gov site implementation', url: 'https://patrickszot.webflow.io/older-work/cia', cover: 'assets/cia-preview.webp', description: 'Co-led brand application, product development, and library design for a recruiting and marketing site.', intensity: 164 },
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
      { date: '2017', kind: 'project', title: 'CIA.gov / Blackbriar design system', url: 'https://patrickszot.webflow.io/older-work/cia', cover: 'assets/cia-preview.webp', description: 'A recruiting identity shaped by the tension between the Agency’s history and its future.', intensity: 142 }
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
let detailsCloseTimer;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const openDuration = () => reducedMotion.matches ? 0 : 900;
const closeDuration = () => reducedMotion.matches ? 0 : 650;

const entryMarkup = (entry, index) => {
  const complexity = Math.max(20, Math.min(100, Math.round(entry.intensity / 1.76)));

  const linkedTitle = entry.url
    ? `<a class="${entry.cover ? 'text-link preview-trigger' : ''}" href="${entry.url}" rel="noopener"${entry.cover ? ' aria-expanded="false"' : ''}>${entry.title}</a>`
    : entry.title;
  const previewMedia = entry.cover?.endsWith('.mp4')
    ? `<video src="${entry.cover}" muted loop playsinline preload="metadata" aria-label="${entry.title} preview"></video>`
    : `<img src="${entry.cover}" alt="${entry.title} thumbnail" />`;
  const title = entry.cover
    ? `<span class="preview-shell">${linkedTitle}<span class="preview-card" aria-hidden="true">${previewMedia}</span></span>`
    : linkedTitle;
  return `
    <article class="timeline-entry" data-kind="${entry.kind}" style="--complexity: ${complexity}; --reveal-delay: ${(index % 8) * 45}ms">
      <span class="timeline-marker" aria-hidden="true"></span>
      <div class="timeline-meta"><time>${entry.date}</time><span>${entry.kind}</span></div>
      <h3>${title}</h3>
      ${entry.description ? `<p>${entry.description}</p>` : ''}
    </article>`;
};

let timelineSequence = 0;
timeline.innerHTML = timelineData.map((section, yearIndex) => `
  <section class="timeline-year" aria-labelledby="year-${section.year.toLowerCase()}">
    <h2 class="timeline-year-heading" id="year-${section.year.toLowerCase()}" style="--year-delay: ${yearIndex * 55}ms">${section.year}</h2>
    <div class="timeline-year-entries">${section.entries.map((entry) => entryMarkup(entry, timelineSequence++)).join('')}</div>
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
  window.clearTimeout(detailsCloseTimer);
  const open = !detailsGroup.classList.contains('is-open');
  detailsTrigger.setAttribute('aria-expanded', String(open));
  detailsLabel.textContent = open ? 'Less detail' : 'More detail';

  if (open) {
    clearTimelineActive();
    document.body.classList.remove('details-closing');
    timeline.querySelectorAll('.is-exiting').forEach((element) => {
      element.classList.remove('is-exiting');
      element.style.removeProperty('--close-delay');
    });
    document.body.classList.add('details-open');
    document.body.classList.add('details-opening');
    timelinePanel.hidden = false;
    timelinePanel.inert = false;
    requestAnimationFrame(() => {
      detailsGroup.classList.add('is-open');
    });
    detailsCloseTimer = window.setTimeout(() => {
      document.body.classList.remove('details-opening');
      requestTimelineActiveUpdate();
    }, openDuration());
    return;
  }

  detailsGroup.classList.remove('is-open');
  document.body.classList.remove('details-opening');
  document.body.classList.add('details-closing');
  clearTimelineActive();

  const visibleMotionItems = [...timeline.querySelectorAll('.timeline-entry.is-visible, .timeline-year-heading')]
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    })
    .sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top);

  visibleMotionItems.forEach((element, index) => {
    element.style.setProperty('--close-delay', `${index * 45}ms`);
    element.classList.add('is-exiting');
  });

  detailsCloseTimer = window.setTimeout(() => {
    timelinePanel.inert = true;
    timelinePanel.hidden = true;
    document.body.classList.remove('details-open', 'details-closing');
    timeline.querySelectorAll('.is-exiting').forEach((element) => {
      element.classList.remove('is-exiting');
      element.style.removeProperty('--close-delay');
    });
    timelineEntries.forEach((entry) => {
      entry.classList.remove('is-visible');
      revealObserver.observe(entry);
    });
  }, closeDuration());
});

const previewShells = [...document.querySelectorAll('.preview-shell')];

let activeTimelineEntry;
let activePreviewEntry;
let activeTimelineFrame;

const clearTimelineActive = () => {
  activeTimelineEntry?.classList.remove('is-active');
  activePreviewEntry?.querySelector('video')?.pause();
  activePreviewEntry?.classList.remove('is-preview-active');
  activePreviewEntry?.querySelector('.preview-card')?.setAttribute('aria-hidden', 'true');
  activeTimelineEntry = undefined;
  activePreviewEntry = undefined;
  timeline.classList.remove('has-active');
};

const updateTimelineActive = () => {
  activeTimelineFrame = undefined;
  if (!document.body.classList.contains('details-open') || document.body.classList.contains('details-opening') || document.body.classList.contains('details-closing') || timelinePanel.hidden) return;

  const viewportCenter = window.innerHeight / 2;
  let closest;
  let closestDistance = Infinity;
  let closestPreview;
  let closestPreviewDistance = Infinity;

  timelineEntries.forEach((entry) => {
    const rect = entry.getBoundingClientRect();
    const distance = Math.abs((rect.top + rect.bottom) / 2 - viewportCenter);
    if (rect.bottom >= 0 && rect.top <= window.innerHeight && distance < closestDistance) {
      closest = entry;
      closestDistance = distance;
    }
    if (entry.querySelector('.preview-card') && distance < closestPreviewDistance) {
      closestPreview = entry;
      closestPreviewDistance = distance;
    }
  });

  if (!closest || closestDistance > window.innerHeight * .32) {
    clearTimelineActive();
    return;
  }
  if (closest !== activeTimelineEntry) {
    activeTimelineEntry?.classList.remove('is-active');
    activeTimelineEntry = closest;
    timeline.classList.add('has-active');
    activeTimelineEntry.classList.add('is-active');
  }

  if (closestPreview === activePreviewEntry) return;
  activePreviewEntry?.querySelector('video')?.pause();
  activePreviewEntry?.classList.remove('is-preview-active');
  activePreviewEntry?.querySelector('.preview-card')?.setAttribute('aria-hidden', 'true');
  activePreviewEntry = closestPreview;
  activePreviewEntry?.classList.add('is-preview-active');
  activePreviewEntry?.querySelector('.preview-card')?.setAttribute('aria-hidden', 'false');
  activePreviewEntry?.querySelector('video')?.play().catch(() => {});
};

const requestTimelineActiveUpdate = () => {
  if (activeTimelineFrame) return;
  activeTimelineFrame = requestAnimationFrame(updateTimelineActive);
};

window.addEventListener('scroll', requestTimelineActiveUpdate, { passive: true });
window.addEventListener('resize', requestTimelineActiveUpdate);

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

const siteViewer = document.querySelector('#site-viewer');
const siteViewerFrame = siteViewer.querySelector('.site-viewer-frame');
const siteViewerPoster = siteViewer.querySelector('.site-viewer-poster');
const siteViewerTitle = siteViewer.querySelector('.site-viewer-title');
const siteViewerClose = siteViewer.querySelector('.site-viewer-close');
let siteViewerLink;
let siteViewerTimer;

const viewerIsOpen = () => siteViewer.classList.contains('is-open') || siteViewer.classList.contains('is-preparing');

document.querySelectorAll('.profile a[href^="http"], .timeline a[href^="http"]').forEach((link) => {
  link.setAttribute('aria-haspopup', 'dialog');
  link.setAttribute('aria-controls', 'site-viewer');
});

const resetSiteViewer = () => {
  siteViewer.hidden = true;
  siteViewer.setAttribute('aria-hidden', 'true');
  siteViewer.className = 'site-viewer';
  siteViewerFrame.removeAttribute('src');
  siteViewerPoster.replaceChildren();
  siteViewerTitle.textContent = '';
  siteViewerLink = undefined;
};

const closeSiteViewer = ({ fromScroll = false } = {}) => {
  if (siteViewer.classList.contains('is-closing')) return;
  if (!viewerIsOpen()) return;
  window.clearTimeout(siteViewerTimer);
  siteViewer.classList.remove('is-open', 'is-preparing', 'is-loaded');
  siteViewer.classList.add('is-closing');
  if (fromScroll) siteViewer.classList.add('is-scroll-closing');
  siteViewer.setAttribute('aria-hidden', 'true');
  siteViewerFrame.inert = true;
  siteViewerTimer = window.setTimeout(resetSiteViewer, reducedMotion.matches ? 0 : (fromScroll ? 340 : 680));
};

const openSiteViewer = (link) => {
  window.clearTimeout(siteViewerTimer);
  const url = new URL(link.href, window.location.href);
  const shell = link.closest('.preview-shell');
  const previewCard = shell?.querySelector('.preview-card') || activePreviewEntry?.querySelector('.preview-card');
  const previewRect = previewCard?.getBoundingClientRect();
  const sourceMedia = previewCard?.querySelector('img, video');

  siteViewerLink = link;
  siteViewer.hidden = false;
  siteViewer.setAttribute('aria-hidden', 'false');
  siteViewerFrame.inert = false;
  siteViewer.className = 'site-viewer is-preparing';
  siteViewer.style.setProperty('--viewer-start-left', `${previewRect?.left ?? 40}px`);
  siteViewer.style.setProperty('--viewer-start-bottom', `${previewRect ? window.innerHeight - previewRect.bottom : 40}px`);
  siteViewer.style.setProperty('--viewer-start-width', `${previewRect?.width ?? 360}px`);
  siteViewer.style.setProperty('--viewer-start-height', `${previewRect?.height ?? 189}px`);
  siteViewerTitle.textContent = url.hostname.replace(/^www\./, '');
  siteViewerFrame.title = `${link.textContent.trim()} website preview`;
  siteViewerPoster.replaceChildren();

  if (sourceMedia) {
    const posterMedia = sourceMedia.cloneNode(true);
    posterMedia.removeAttribute('id');
    if (posterMedia instanceof HTMLVideoElement) {
      posterMedia.muted = true;
      posterMedia.loop = true;
      posterMedia.play().catch(() => {});
    }
    siteViewerPoster.append(posterMedia);
  }

  closePreviews();
  requestAnimationFrame(() => {
    siteViewer.classList.add('is-open');
    siteViewer.classList.remove('is-preparing');
    siteViewerFrame.src = url.href;
    siteViewerClose.focus({ preventScroll: true });
  });
};

siteViewerFrame.addEventListener('load', () => {
  if (!siteViewerFrame.src) return;
  siteViewer.classList.add('is-loaded');
});

siteViewerClose.addEventListener('click', () => {
  const returnTarget = siteViewerLink;
  closeSiteViewer();
  returnTarget?.focus({ preventScroll: true });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !viewerIsOpen()) return;
  const returnTarget = siteViewerLink;
  closeSiteViewer();
  returnTarget?.focus({ preventScroll: true });
});

document.addEventListener('click', (event) => {
  const link = event.target.closest('.profile a[href^="http"], .timeline a[href^="http"]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  openSiteViewer(link);
});

window.addEventListener('scroll', () => {
  if (viewerIsOpen()) closeSiteViewer({ fromScroll: true });
}, { passive: true });
