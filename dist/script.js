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
      { date: 'Present', kind: 'project', title: 'Brand Engineer at AirOps', url: 'https://www.airops.com/', description: 'Brand strategy, market repositioning, web transformation, image systems, and marketing tooling.', intensity: 176 },
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
      { date: 'February 12', kind: 'project', title: 'Webflow “User Guide”', url: 'https://domesticatedhorses.webflow.io/', assetsUrl: 'https://dribbble.com/shots/20635546-Webflow-User-Guide', cover: 'https://cdn.dribbble.com/userupload/4614360/file/still-d9d256a232e6beae624e7aec726c1f2d.png?format=webp&resize=800x600&vertical=center', intensity: 66 },
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

  const linkedTitle = entry.url && entry.kind !== 'milestone'
    ? `<a class="text-link${entry.kind === 'writing' ? ' writing-popup-trigger' : ''}" href="${entry.url}" rel="noopener">${entry.title}</a>`
    : entry.title;
  const marker = entry.kind === 'project' && entry.url
    ? `<button class="timeline-marker project-expand-trigger" type="button" tabindex="-1" aria-label="Show ${entry.title} images" aria-expanded="false"><i class="ri-add-line" aria-hidden="true"></i></button>`
    : '<span class="timeline-marker" aria-hidden="true"></span>';
  return `
    <article class="timeline-entry" data-kind="${entry.kind}" style="--complexity: ${complexity}; --reveal-delay: ${(index % 8) * 45}ms">
      ${marker}
      <div class="timeline-meta"><time>${entry.date}</time><span>${entry.kind}</span></div>
      <h3>${linkedTitle}</h3>
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
const timelineRecords = timelineData.flatMap((section) => section.entries);
timelineEntries.forEach((element, index) => { element.entryData = timelineRecords[index]; });
const previewTimelineEntries = timelineEntries.filter((entry) => entry.dataset.kind === 'project' && entry.entryData.url);
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
    setProjectPreview();
    setPreviewVisibility(true);
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
  setPreviewVisibility(false);
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

let activeTimelineEntry;
let activeTimelineFrame;
let previousScrollY = window.scrollY;
let previousScrollTime = performance.now();
let timelineScrollDirection = 0;
let timelineScrollVelocity = 0;
const projectPreview = document.querySelector('#project-focus-preview');
const previewImages = [...projectPreview.querySelectorAll('.project-focus-preview-image')];
const airOpsUrl = 'https://www.airops.com/';
const airOpsFallback = 'assets/airops-og.jpg';
let previewLayer = 0;
let previewRequest = 0;
let previewTransitioning = false;
let queuedPreview;
previewImages[0].dataset.previewSrc = airOpsFallback;

const youtubeThumbnail = (src) => {
  const id = src.match(/youtube\.com\/embed\/([^?&/]+)/)?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined;
};

const previewSourceFor = (entry, manifest) => {
  if (!entry || entry.url === airOpsUrl) return airOpsFallback;
  if (entry?.cover && !/\.mp4(?:$|\?)/i.test(entry.cover)) return entry.cover;
  const assets = manifest.projects[entry?.assetsUrl || entry?.url]?.assets || [];
  const still = assets.find((asset) => asset.type === 'image') || assets.find((asset) => asset.type === 'gif');
  if (still) return still.src;
  const youtube = assets.find((asset) => asset.type === 'youtube');
  if (youtube) return youtubeThumbnail(youtube.src);
  const airOps = manifest.projects[airOpsUrl]?.assets?.find((asset) => asset.type === 'image');
  return airOps?.src || airOpsFallback;
};

const runPreviewTransition = ({ src, alt, direction, velocity }) => {
  const current = previewImages[previewLayer];
  if (current.dataset.previewSrc === src) {
    current.alt = alt;
    return;
  }

  previewTransitioning = true;
  const nextLayer = previewLayer === 0 ? 1 : 0;
  const next = previewImages[nextLayer];
  next.src = src;
  next.alt = alt;
  next.dataset.previewSrc = src;
  const duration = reducedMotion.matches ? 0 : Math.max(500, 780 - velocity * 80);
  projectPreview.style.setProperty('--preview-out-y', `${-direction * 100}%`);
  projectPreview.style.setProperty('--preview-in-y', `${direction * 100}%`);
  projectPreview.style.setProperty('--preview-duration', `${duration}ms`);
  next.style.transition = 'none';
  next.classList.remove('is-current', 'is-departing');
  void next.offsetHeight;
  next.style.removeProperty('transition');

  requestAnimationFrame(() => {
    current.classList.add('is-departing');
    current.classList.remove('is-current');
    next.classList.add('is-current');
  });

  window.setTimeout(() => {
    current.classList.remove('is-departing');
    current.alt = '';
    previewLayer = nextLayer;
    previewTransitioning = false;
    const queued = queuedPreview;
    queuedPreview = undefined;
    if (queued) runPreviewTransition(queued);
  }, duration + 40);
};

const setProjectPreview = async (entry) => {
  const request = ++previewRequest;
  const manifest = await projectManifest;
  let src = previewSourceFor(entry, manifest) || airOpsFallback;
  let alt = src === airOpsFallback ? 'AirOps project preview' : `${entry?.title || 'AirOps'} project preview`;
  const preload = new Image();
  preload.src = src;
  await preload.decode().catch(() => {});
  if (!preload.naturalWidth && src !== airOpsFallback) {
    src = airOpsFallback;
    alt = 'AirOps project preview';
    preload.src = src;
    await preload.decode().catch(() => {});
  }
  if (!preload.naturalWidth || request !== previewRequest) return;

  const payload = {
    src,
    alt,
    direction: timelineScrollDirection || 1,
    velocity: timelineScrollVelocity
  };
  if (previewTransitioning) {
    queuedPreview = payload;
    return;
  }
  runPreviewTransition(payload);
};

const setPreviewVisibility = (visible) => {
  projectPreview.classList.toggle('is-visible', visible);
  projectPreview.setAttribute('aria-hidden', String(!visible));
};

const clearTimelineActive = () => {
  if (scatterLink) dismissScatter();
  activeTimelineEntry?.classList.remove('is-active');
  activeTimelineEntry?.querySelector('.project-expand-trigger')?.setAttribute('tabindex', '-1');
  activeTimelineEntry = undefined;
  timeline.classList.remove('has-active');
};

const timelineProjectForViewport = () => {
  if (!previewTimelineEntries.length) return undefined;
  if (window.scrollY <= 48) return previewTimelineEntries[0];

  const focusY = window.scrollY + window.innerHeight / 2;
  const projects = previewTimelineEntries.map((entry) => {
    const rect = entry.getBoundingClientRect();
    return { entry, center: window.scrollY + rect.top + rect.height / 2 };
  });
  const upcomingIndex = projects.findIndex((project) => project.center >= focusY);
  if (upcomingIndex === 0) return projects[0].entry;
  if (upcomingIndex === -1) return projects.at(-1).entry;

  const previous = projects[upcomingIndex - 1];
  const upcoming = projects[upcomingIndex];
  const gap = upcoming.center - previous.center;
  const velocityBias = Math.min(.08, timelineScrollVelocity * .025);
  const directionalBias = timelineScrollDirection * gap * (.035 + velocityBias);
  const handoffPoint = previous.center + gap / 2 - directionalBias;
  return focusY < handoffPoint ? previous.entry : upcoming.entry;
};

const updateTimelineActive = () => {
  activeTimelineFrame = undefined;
  if (!document.body.classList.contains('details-open') || document.body.classList.contains('details-opening') || document.body.classList.contains('details-closing') || timelinePanel.hidden) return;

  const closest = timelineProjectForViewport();
  if (!closest) {
    clearTimelineActive();
    setProjectPreview();
    return;
  }
  if (closest !== activeTimelineEntry) {
    if (scatterLink) dismissScatter();
    activeTimelineEntry?.classList.remove('is-active');
    activeTimelineEntry?.querySelector('.project-expand-trigger')?.setAttribute('tabindex', '-1');
    activeTimelineEntry = closest;
    timeline.classList.add('has-active');
    activeTimelineEntry.classList.add('is-active');
    activeTimelineEntry.querySelector('.project-expand-trigger')?.setAttribute('tabindex', '0');
    setProjectPreview(activeTimelineEntry.entryData);
  }
};

const requestTimelineActiveUpdate = () => {
  if (activeTimelineFrame) return;
  activeTimelineFrame = requestAnimationFrame(updateTimelineActive);
};

window.addEventListener('scroll', () => {
  const now = performance.now();
  const delta = window.scrollY - previousScrollY;
  const elapsed = Math.max(16, now - previousScrollTime);
  if (Math.abs(delta) > .5) {
    timelineScrollDirection = Math.sign(delta);
    timelineScrollVelocity = Math.min(3, Math.abs(delta) / Math.max(1, window.innerHeight) * 1000 / elapsed);
  }
  previousScrollY = window.scrollY;
  previousScrollTime = now;
  requestTimelineActiveUpdate();
}, { passive: true });
window.addEventListener('resize', requestTimelineActiveUpdate);

const scatter = document.querySelector('#project-scatter');
const projectManifest = fetch('assets-visual/manifest.json').then((response) => response.json());
const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)');
let scatterLink;
let scatterLocked = false;
let scatterCycle;
let scatterGeneration = 0;

const hashText = (value) => [...value].reduce((hash, character) => Math.imul(hash ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0;
const seeded = (seed) => () => ((seed = Math.imul(seed, 1664525) + 1013904223 >>> 0) / 4294967296);

const stopScatterMedia = () => {
  scatter.querySelectorAll('video').forEach((video) => video.pause());
  scatter.querySelectorAll('canvas').forEach((canvas) => canvas.dispatchEvent(new Event('scatterdestroy')));
};

const dismissScatter = (immediate = false) => {
  window.clearInterval(scatterCycle);
  scatterCycle = undefined;
  scatterGeneration += 1;
  scatterLocked = false;
  scatterLink?.setAttribute('aria-expanded', 'false');
  scatterLink = undefined;
  scatter.style.setProperty('--scatter-out-y', `${-(timelineScrollDirection || 1) * 18}px`);
  scatter.querySelectorAll('.scatter-group').forEach((group) => group.classList.add('is-leaving'));
  scatter.classList.add('is-closing');
  scatter.classList.remove('is-active');
  scatter.setAttribute('aria-hidden', 'true');
  stopScatterMedia();
  const itemCount = scatter.querySelectorAll('.scatter-item').length;
  const delay = immediate || reducedMotion.matches ? 0 : 520 + Math.max(0, itemCount - 1) * 55;
  window.setTimeout(() => {
    scatter.replaceChildren();
    scatter.classList.remove('is-closing');
  }, delay);
};

const gifCanvas = async (asset, generation) => {
  const canvas = document.createElement('canvas');
  if (!('ImageDecoder' in window)) {
    const image = new Image();
    image.src = asset.src;
    image.alt = asset.alt;
    return image;
  }
  const response = await fetch(asset.src);
  const decoder = new ImageDecoder({ data: await response.arrayBuffer(), type: response.headers.get('content-type') || 'image/gif' });
  await decoder.tracks.ready;
  const track = decoder.tracks.selectedTrack;
  const context = canvas.getContext('2d');
  let destroyed = false;
  let markReady;
  const ready = new Promise((resolve) => { markReady = resolve; });
  canvas.addEventListener('scatterdestroy', () => { destroyed = true; decoder.close(); }, { once: true });
  (async () => {
    for (let frameIndex = 0; frameIndex < track.frameCount && !destroyed && generation === scatterGeneration; frameIndex += 1) {
      const { image } = await decoder.decode({ frameIndex });
      if (!canvas.width) { canvas.width = image.displayWidth; canvas.height = image.displayHeight; }
      context.drawImage(image, 0, 0);
      if (frameIndex === 0) markReady();
      const duration = Math.max(20, image.duration / 1000 || 80);
      image.close();
      if (frameIndex < track.frameCount - 1) await new Promise((resolve) => window.setTimeout(resolve, duration));
    }
    markReady();
  })().catch(markReady);
  await ready;
  return canvas;
};

const mediaNode = async (asset, generation) => {
  if (asset.type === 'spotify' || asset.type === 'youtube') {
    const frame = document.createElement('iframe');
    frame.src = asset.src;
    frame.title = asset.alt;
    frame.loading = 'lazy';
    frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    frame.setAttribute('allowfullscreen', '');
    return frame;
  }
  if (asset.type === 'video') {
    const video = document.createElement('video');
    video.src = asset.src;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.loop = false;
    return video;
  }
  if (asset.type === 'gif') {
    const image = new Image();
    image.alt = asset.alt;
    image.decoding = 'async';
    image.src = asset.src;
    await image.decode().catch(() => {});
    return image;
  }
  const image = new Image();
  image.alt = asset.alt;
  image.decoding = 'async';
  image.src = asset.src;
  await image.decode().catch(() => {});
  return image;
};

const positionsFor = (url, count) => {
  const mobile = window.innerWidth <= 700;
  const random = seeded(hashText(url));
  const desktop = [[3,15,22],[27,5,18],[56,7,22],[73,29,23],[5,59,24],[34,65,21],[68,67,25],[43,35,18]];
  const phone = [[4,9,45],[50,16,44],[8,50,52],[46,63,48]];
  const slots = (mobile ? phone : desktop).sort(() => random() - .5);
  return slots.slice(0, count)
    .sort((a, b) => b[0] - a[0])
    .map(([x,y,w], index) => ({ x, y, w, delay: index * 125 }));
};

const renderScatterGroup = async (assets, project, generation) => {
  if (generation !== scatterGeneration) return;
  const count = Math.min(coarsePointer.matches ? 4 : 7, assets.length);
  const positions = positionsFor(project.slug + assets[0]?.src, count);
  const group = document.createElement('div');
  group.className = 'scatter-group';
  scatter.querySelector('.scatter-group')?.classList.add('is-leaving');
  window.setTimeout(() => [...scatter.querySelectorAll('.scatter-group.is-leaving')].forEach((old) => old.remove()), reducedMotion.matches ? 0 : 900);
  scatter.append(group);
  for (let index = 0; index < count; index += 1) {
    let media;
    try {
      media = await mediaNode(assets[index], generation);
    } catch {
      media = new Image();
      media.alt = assets[index].alt || project.title;
      media.src = assets[index].src;
    }
    if (generation !== scatterGeneration) return;
    const item = document.createElement('figure');
    const position = positions[index];
    item.className = 'scatter-item';
    if (media instanceof HTMLIFrameElement) item.classList.add('has-embed');
    item.style.cssText = `--x:${position.x}vw;--y:${position.y}svh;--w:${position.w}vw;--delay:${position.delay}ms;--exit-delay:${index * 55}ms`;
    item.append(media);
    group.append(item);
    if (media instanceof HTMLVideoElement) media.play().catch(() => {});
    requestAnimationFrame(() => item.classList.add('is-visible'));
    if (!reducedMotion.matches) await new Promise((resolve) => window.setTimeout(resolve, 110));
  }
};

const showScatter = async (entry, trigger) => {
  const manifest = await projectManifest;
  const project = manifest.projects[entry.assetsUrl || entry.url];
  if (!project?.assets.length) return;
  const seenAssets = new Set();
  const projectAssets = project.assets.filter((asset) => {
    const key = asset.source || asset.src;
    if (!key || seenAssets.has(key)) return false;
    seenAssets.add(key);
    return true;
  });
  if (!projectAssets.length) return;
  if (scatterLink && scatterLink !== trigger) dismissScatter(true);
  scatterLink = trigger;
  scatterLocked = true;
  scatter.style.setProperty('--scatter-in-y', `${(timelineScrollDirection || 1) * 16}px`);
  scatterGeneration += 1;
  const generation = scatterGeneration;
  trigger.setAttribute('aria-expanded', 'true');
  scatter.setAttribute('aria-hidden', 'false');
  scatter.classList.add('is-active');
  let offset = 0;
  const display = () => {
    const count = coarsePointer.matches ? 4 : 7;
    const nextAssets = projectAssets.slice(offset, offset + count);
    renderScatterGroup(nextAssets, project, generation);
    offset += nextAssets.length;
    if (offset >= projectAssets.length) offset = 0;
  };
  display();
  window.clearInterval(scatterCycle);
  if (projectAssets.length > (coarsePointer.matches ? 4 : 7)) {
    const cycleDuration = projectAssets.some((asset) => asset.type === 'spotify' || asset.type === 'youtube') ? 10000 : 5200;
    scatterCycle = window.setInterval(display, cycleDuration);
  }
};

timeline.querySelectorAll('.project-expand-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const entry = trigger.closest('.timeline-entry');
    if (entry !== activeTimelineEntry) return;
    if (scatterLink === trigger) { dismissScatter(); return; }
    showScatter(entry.entryData, trigger);
  });
});

document.addEventListener('click', (event) => {
  if (scatterLocked && !event.target.closest('.project-expand-trigger') && !event.target.closest('.scatter-item')) dismissScatter();
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && scatterLink) dismissScatter(); });

const writingReader = document.querySelector('#writing-reader');
const writingTitle = writingReader.querySelector('#writing-reader-title');
const writingMeta = writingReader.querySelector('.writing-reader-meta');
const writingContent = writingReader.querySelector('.writing-reader-content');
const writingScroll = writingReader.querySelector('.writing-reader-scroll');
const writingClose = writingReader.querySelector('.writing-reader-close');
const writingManifest = fetch('assets-writing/manifest.json').then((response) => response.json());
let writingReturnTarget;
let writingCloseTimer;

const closeWriting = () => {
  if (writingReader.hidden || writingReader.classList.contains('is-closing')) return;
  window.clearTimeout(writingCloseTimer);
  writingReader.classList.remove('is-open');
  writingReader.classList.add('is-closing');
  writingReader.setAttribute('aria-hidden', 'true');
  writingCloseTimer = window.setTimeout(() => {
    writingReader.hidden = true;
    writingReader.classList.remove('is-closing');
    writingTitle.textContent = '';
    writingMeta.textContent = '';
    writingContent.replaceChildren();
  }, reducedMotion.matches ? 0 : 480);
};

const openWriting = async (link) => {
  dismissScatter(true);
  const manifest = await writingManifest;
  const item = manifest.writings[new URL(link.href).href];
  if (!item) return;
  const response = await fetch(item.file);
  const article = await response.json();
  writingReturnTarget = link;
  const readerSeed = hashText(article.meta.source || link.href);
  writingReader.style.setProperty('--reader-left', `${32 + (readerSeed % 34)}px`);
  writingReader.style.setProperty('--reader-bottom', `${28 + ((readerSeed >>> 5) % 28)}px`);
  writingReader.style.setProperty('--reader-width', `${510 + ((readerSeed >>> 10) % 90)}px`);
  window.clearTimeout(writingCloseTimer);
  writingTitle.textContent = article.title;
  writingMeta.textContent = [article.meta.published, article.meta.author].filter(Boolean).join(' · ');
  writingContent.innerHTML = article.content;
  writingScroll.scrollTop = 0;
  writingReader.hidden = false;
  writingReader.classList.remove('is-closing');
  writingReader.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => {
    writingReader.classList.add('is-open');
    writingClose.focus({ preventScroll: true });
  });
};

document.querySelectorAll('.writing-popup-trigger').forEach((link) => {
  link.setAttribute('aria-controls', 'writing-reader');
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openWriting(link);
  });
});

writingClose.addEventListener('click', () => {
  closeWriting();
  writingReturnTarget?.focus({ preventScroll: true });
});
document.addEventListener('click', (event) => {
  if (writingReader.hidden || event.target.closest('#writing-reader, .writing-popup-trigger')) return;
  closeWriting();
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || writingReader.hidden) return;
  closeWriting();
  writingReturnTarget?.focus({ preventScroll: true });
});
