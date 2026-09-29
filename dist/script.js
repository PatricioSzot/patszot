const visualManifestData = await fetch('assets-visual/manifest.json')
  .then((response) => {
    if (!response.ok) throw new Error(`Visual manifest failed: ${response.status}`);
    return response.json();
  })
  .catch((error) => {
    console.error(error);
    return { projects: {} };
  });

const setGroup = (group, open) => {
  const trigger = group.querySelector(':scope > .group-trigger, :scope > .overview-project-heading > .group-trigger, :scope > .nested-trigger, :scope > .previous-row > .group-trigger');
  const panel = group.querySelector(':scope > .overview-project-panel, :scope > .nested-panel, :scope > .group-panel');
  group.classList.toggle('is-open', open);
  trigger.setAttribute('aria-expanded', String(open));
  panel.inert = !open;
};

const overviewProfile = document.querySelector('.profile');
const overviewProjects = [...document.querySelectorAll('.overview-project.group')];
const overviewRevealTimers = new WeakMap();

overviewProjects.forEach((group) => {
  group.querySelectorAll('.overview-project-media img').forEach((image) => {
    image.decoding = 'async';
    const markReady = () => requestAnimationFrame(() => image.classList.add('is-motion-ready'));
    if (image.complete) markReady();
    else {
      image.addEventListener('load', markReady, { once: true });
      image.addEventListener('error', markReady, { once: true });
    }
  });
});

const choreographOverviewItems = (group) => {
  if (group.dataset.project !== 'airops' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  group.querySelectorAll('.overview-summary-item').forEach((item, index) => {
    item.getAnimations().forEach((animation) => animation.cancel());
    item.animate(
      [
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      {
        duration: 520,
        delay: 180 + index * 72,
        easing: 'cubic-bezier(.22, 1, .36, 1)',
        fill: 'both'
      }
    );
  });
};

const syncOverviewHeight = () => {
  if (!document.body.classList.contains('overview-expanded')) {
    document.documentElement.style.removeProperty('--profile-document-height');
    return;
  }
  const profileBottom = overviewProfile.offsetTop + overviewProfile.offsetHeight + 440;
  document.documentElement.style.setProperty('--profile-document-height', `${profileBottom}px`);
};

const syncOverviewState = () => {
  document.body.classList.toggle('overview-expanded', overviewProjects.some((group) => group.classList.contains('is-open')));
  requestAnimationFrame(syncOverviewHeight);
};

const setOverviewProjectOpen = (group, open) => {
  const pendingReveal = overviewRevealTimers.get(group);
  if (pendingReveal) window.clearTimeout(pendingReveal);
  overviewRevealTimers.delete(group);
  group.classList.remove('is-reveal-priming');
  setGroup(group, open);
  if (open) choreographOverviewItems(group);
  syncOverviewState();
};

const revealOverviewProject = (group) => {
  if (group.classList.contains('is-open') || overviewRevealTimers.has(group)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setOverviewProjectOpen(group, true);
    return;
  }

  group.classList.add('is-reveal-priming');
  const timer = window.setTimeout(() => {
    overviewRevealTimers.delete(group);
    group.classList.remove('is-reveal-priming');
    setOverviewProjectOpen(group, true);
  }, 190);
  overviewRevealTimers.set(group, timer);
};

new ResizeObserver(syncOverviewHeight).observe(overviewProfile);

document.querySelectorAll('.load-line').forEach((line) => {
  line.addEventListener('animationend', () => line.classList.remove('load-line'), { once: true });
});

document.querySelectorAll('.group').forEach((group) => {
  group.querySelector(':scope > .group-trigger, :scope > .overview-project-heading > .group-trigger, :scope > .previous-row > .group-trigger').addEventListener('click', () => {
    if (group.classList.contains('is-open') || overviewRevealTimers.has(group)) setOverviewProjectOpen(group, false);
    else revealOverviewProject(group);
  });
});

document.querySelectorAll('.nested-group').forEach((group) => {
  group.querySelector(':scope > .nested-trigger').addEventListener('click', () => {
    setGroup(group, !group.classList.contains('is-open'));
  });
});

let timelineData = [
  {
    year: '2026',
    entries: [
      { date: 'Present', kind: 'project', title: 'Principal Brand Designer at AirOps', url: 'https://www.airops.com/', description: 'Brand strategy, market repositioning, web transformation, image systems, and marketing tooling.' },
      { date: 'January 22', kind: 'writing', title: 'My Inner Circle is Made Up of Bad-ass Women', url: 'https://medium.com/@patrick.m.szot/my-inner-circle-is-made-up-of-bad-ass-women-5-powers-they-gave-me-that-id-like-to-share-with-you-0e9117e3693a', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*L6Mz9ArPrUDjh_GrxX7Yrg.png', description: 'Five lessons about power, care, and reflecting the world we actually live in.' }
    ]
  },
  {
    year: '2025',
    entries: [
      { date: 'December 24', kind: 'writing', title: 'The Importance of Celebration and Rest for Creatives', url: 'https://medium.com/@patrick.m.szot/the-importance-of-celebration-and-rest-for-creatives-8cdd66602d74', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*GSVjAl3r5qXH0HcL9gFlSQ.png', description: 'On pausing to recognize the work before moving to the next thing.' },
      { date: 'May 9', kind: 'writing', title: 'Config 2025: It’s The Same, Just Different This Time', url: 'https://medium.com/@patrick.m.szot/config-2025-its-the-same-just-different-this-time-19ab9ed00a52', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*ht0MLlsIZJJpyYASbWi-dw.png', description: 'Thoughts on beauty, efficient production, and working across aisles.' },
      { date: '2025', kind: 'project', title: 'GlossAI Rebrand', url: 'https://genius.ai/', description: 'Brand identity and launch expression for GlossGenius.' },
      { date: '2025', kind: 'project', title: 'Lovable', description: 'Brand work for a fast-moving product company.' }
    ]
  },
  {
    year: '2024',
    entries: [
      { date: 'November 20', kind: 'writing', title: 'Celebrating My 30th And A Decade in Tech', url: 'https://medium.com/@patrick.m.szot/celebrating-my-30th-and-a-decade-in-tech-2014-2024-1347b3b3ef72', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*zmDBsxxtVsG_WIYBFak_Ug.png', description: 'A decade-in-review across work, practice, and recent flowers from the garden.' },
      { date: 'July 29', kind: 'writing', title: 'I Was Separated From My Position at Webflow', url: 'https://patrickszot.webflow.io/journal/i-got-seperated-from-my-position-at-webflow', description: 'A candid reflection on the end of a chapter.' },
      { date: 'June 10', kind: 'project', title: 'Album Art: Presage 2022', url: 'https://dribbble.com/shots/24328431-Album-Art-Presage-2022', cover: 'https://cdn.dribbble.com/userupload/15032821/file/original-fe6a0e24019319be3d899139d9a02b50.png?crop=237x133-2804x2059&format=webp&resize=800x600&vertical=center' },
      { date: '2022–24', kind: 'project', title: 'Webflow Rebrand', url: 'https://patrickszot.webflow.io/recent-work/webflow-rebrand', description: 'Visual foundations, motion guidelines, campaigns, customer stories, and event systems.' }
    ]
  },
  {
    year: '2023',
    entries: [
      { date: 'August 21', kind: 'writing', title: 'Care Less: Beneficial Reasons to Loosen Your Grip at Work', url: 'https://medium.com/@patrick.m.szot/care-less-a-case-for-designers-to-loosen-their-grip-at-work-c214fed3ffce', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*lKex14FN1xw8a5k9_Rp5eg.jpeg', description: 'A case for creating enough distance to protect judgment and momentum.' },
      { date: 'March 11', kind: 'writing', title: 'Personality and Clarity: The Changing Role of Brands in Society', url: 'https://medium.com/@patrick.m.szot/personality-and-clarity-the-changing-role-of-brands-in-society-8d2470076908', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*ChRfyyagLmVHGV__sQozPA.jpeg', description: 'How expressive systems change as brands begin to walk and talk.' },
      { date: 'February 21', kind: 'writing', title: 'Webflow Conf 2022 Brand System', url: 'https://medium.com/@patrick.m.szot/webflow-conf-2022-brand-system-c9e6c3f13b82', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*OkRIwxUFBv_nq83677bAeQ.jpeg', description: 'The visual system behind Webflow’s 2022 community gathering.' },
      { date: 'February 13', kind: 'writing', title: 'The Use of the Words “Creativity” and “Innovation”', url: 'https://medium.com/@patrick.m.szot/the-use-of-the-words-creativity-and-innovation-711b20634a15', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*EmXdGmb64afAerxTYXpeQA.png', description: 'On two related words that are often stretched until they lose meaning.' },
      { date: 'February 12', kind: 'project', title: 'Webflow “User Guide”', url: 'https://domesticatedhorses.webflow.io/', assetsUrl: 'https://dribbble.com/shots/20635546-Webflow-User-Guide', cover: 'https://cdn.dribbble.com/userupload/4614360/file/still-d9d256a232e6beae624e7aec726c1f2d.png?format=webp&resize=800x600&vertical=center' },
      { date: 'February 5', kind: 'writing', title: 'Winning Fulbright Fellowship Sample Essay', url: 'https://medium.com/@patrick.m.szot/winning-fulbright-fellowship-sample-essays-personal-statement-2018-62a9bebd6708', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*5aWNjUvEs6M-nkmPbqOdew.jpeg', description: 'The personal statement behind a 2018 Fulbright Fellowship.' },
      { date: 'February 4', kind: 'project', title: 'Webflow Conf 2022 – Process and Guidelines', url: 'https://dribbble.com/shots/20567364-Webflow-Conf-2022-Process-and-Guidelines', cover: 'https://cdn.dribbble.com/userupload/4483551/file/original-4f2dbf8f04413c4c5d18c77e6f5a6b3e.jpg?format=webp&resize=800x600&vertical=center' },
      { date: 'January 29', kind: 'project', title: '3D Scene', url: 'https://dribbble.com/shots/20509333-3D-Scene', cover: 'https://cdn.dribbble.com/userupload/4444324/file/original-bd42fa6b5f12fe499425bf830b2d67d3.png?crop=0x204-1594x1399&format=webp&resize=800x600&vertical=center' },
      { date: 'January 29', kind: 'project', title: 'Studio Project Trophy Decks', url: 'https://dribbble.com/shots/20509321-Studio-Project-Trophy-Decks', cover: 'https://cdn.dribbble.com/userupload/4444309/file/still-5c624d0ba182a5c2b957d0687db23250.gif?format=webp&resize=800x600&vertical=center' },
      { date: 'January 29', kind: 'project', title: 'UI Design – Deloitte Digital Internal Directory', url: 'https://dribbble.com/shots/20509299-UI-Design-Deloitte-Digital-Internal-Directory', cover: 'https://cdn.dribbble.com/userupload/4444285/file/still-f19a182a7cdf6c8b4eb6ae0ec29f7693.gif?format=webp&resize=800x600&vertical=center' },
      { date: 'January 29', kind: 'project', title: 'Brand Package – Atelier Saady', url: 'https://dribbble.com/shots/20509285-Brand-Package-Atelier-Saady', cover: 'https://cdn.dribbble.com/userupload/4444272/file/original-adb031e59e14d570d577d41332a52485.jpg?crop=0x343-1200x1243&format=webp&resize=800x600&vertical=center' },
      { date: 'January 29', kind: 'project', title: 'Stylized Logo', url: 'https://dribbble.com/shots/20509280-Stylized-Logo', cover: 'https://cdn.dribbble.com/userupload/4444266/file/still-6a6075d0bf9f167035ecaa292f0f1bf7.gif?format=webp&resize=800x600&vertical=center' },
      { date: 'January 17', kind: 'project', title: 'Webflow Conf 2022 – Grow with the ’Flow Room', url: 'https://dribbble.com/shots/20410030-Webflow-Conf-2022-Grow-with-the-Flow-room', cover: 'https://cdn.dribbble.com/userupload/4293440/file/original-d1e576e3b7230d2cc45147ed55ac5495.jpg?crop=0x0-1920x1440&format=webp&resize=800x600&vertical=center' },
      { date: 'January 11', kind: 'project', title: 'Webflow Conf 2022 – Themes', url: 'https://dribbble.com/shots/20356384-Webflow-Conf-2022-Themes', cover: 'https://cdn.dribbble.com/userupload/4272644/file/original-848a983cbfe134a519a90f6802a8dff4.jpg?crop=3x0-1503x1125&format=webp&resize=800x600&vertical=center' },
      { date: 'January 4', kind: 'writing', title: '2022 Retrospective: Leadership and Soft Skills', url: 'https://patrickszot.webflow.io/journal/2022-retrospective', description: 'Notes on leadership, collaboration, and creative practice.' },
      { date: '2023', kind: 'project', title: 'Webflow visual foundations', url: 'https://patrickszot.webflow.io/recent-work/webflow-rebrand', description: 'Illustration, sub-branding, color, lighting, motion, and more than 1,000 custom icons.' }
    ]
  },
  {
    year: '2022',
    entries: [
      { date: 'September 20', kind: 'writing', title: 'More Words ≠ More Clarity', url: 'https://patrickszot.webflow.io/journal/more-words-is-not-more-clarity', description: 'On communication, editing, and finding the useful idea.' },
      { date: '2022', kind: 'project', title: 'Webflow Conf 2022', url: 'https://patrickszot.webflow.io/recent-work/webflow-conf', description: 'A layered event system spanning brand, interface, art direction, and production.' },
      { date: 'January', kind: 'milestone', title: 'Joined Webflow', url: 'https://patrickszot.webflow.io/about', description: 'Moved from agency work into an in-house startup brand team.' },
      { date: 'January 2', kind: 'writing', title: '2021 Retrospective: Producing and Cycles', url: 'https://patrickszot.webflow.io/journal/2021-retrospective', description: 'A review of creative production, repetition, and momentum.' }
    ]
  },
  {
    year: '2021',
    entries: [
      { date: 'November', kind: 'work', title: 'Recruiting Committee', description: 'Supported hiring for UI and brand design.' },
      { date: 'November', kind: 'project', title: 'WNBA Pursuit', description: 'Led UI tenets and a product vision for digital experiences and brand.' },
      { date: 'September', kind: 'milestone', title: 'National Studios art commission', description: 'Commissioned print production for eight unique works delivered at a leadership summit.' },
      { date: 'August', kind: 'project', title: 'Thrivent Financial app and web', url: 'https://patrickszot.webflow.io/older-work/thrivent', description: 'Led brand expansion and UI design across concepting, production, and web development.' },
      { date: 'June 14', kind: 'writing', title: 'Personality and Clarity: Brands Will Eventually Walk and Talk', url: 'https://patrickszot.webflow.io/journal/personality-and-clarity', description: 'A short essay on expressive brand systems.' },
      { date: 'June', kind: 'project', title: 'Deloitte Digital National Brand Launch', description: 'Co-led a national localization of the “Hello New” refresh and collateral.' },
      { date: 'May', kind: 'project', title: 'David Yurman pitch', description: 'Led UI tenets and product vision for the flagship site and app.' },
      { date: 'March', kind: 'project', title: 'Transamerica', description: 'Led visual identity and brand design for Moving Logistics Partnership.' },
      { date: 'January', kind: 'project', title: 'UBS mobile app', description: 'Supported production for the mobile onboarding experience.' },
      { date: 'January', kind: 'milestone', title: 'Promoted to Senior Brand / UI Designer' }
    ]
  },
  {
    year: '2020',
    entries: [
      { date: 'December', kind: 'project', title: 'FAF guidance sites', description: 'Sole UI designer for Financial Accounting Foundation guidance sites.' },
      { date: 'October', kind: 'project', title: 'Marriott Vacation Worldwide brand and identity toolkit', description: 'Logo design and visual concepting for an internal brand toolkit.' },
      { date: 'September', kind: 'project', title: 'SNHU learner portal', description: 'UI design for a Salesforce Communities web product and contract-to-studio transition.' },
      { date: 'July 31', kind: 'writing', title: 'The Use of the Words “Creativity” and “Innovation”', url: 'https://patrickszot.webflow.io/journal/creativity-innovation', description: 'A critique of two heavily used creative-industry terms.' },
      { date: 'July', kind: 'project', title: 'The Smart Factory', url: 'https://patrickszot.webflow.io/older-work/the-smart-factory', description: 'Brand concepting, logo development, and usage guidelines for Deloitte Market Offering.' },
      { date: 'June 2', kind: 'writing', title: 'Winning Fulbright Fellowship Essay', url: 'https://patrickszot.webflow.io/journal/fulbright-fellowship', description: 'The essay behind a Fulbright award.' },
      { date: 'June', kind: 'project', title: 'Global Marketing Trends 2021', url: 'https://patrickszot.webflow.io/older-work/dolores-debitis-omnis-qui', description: 'Brand concepting, development, and UI for a seven-story trends report.' },
      { date: 'April', kind: 'project', title: 'Takeda social campaign and COVID-19 microsite', description: 'Visual concepting, asset development, and UI design.' },
      { date: 'April', kind: 'project', title: 'New Balance', description: 'UI production assets for a flagship web property.' },
      { date: 'March', kind: 'milestone', title: 'Shifted to fully remote work' },
      { date: 'March', kind: 'project', title: 'CIA.gov site implementation', url: 'https://patrickszot.webflow.io/older-work/cia', description: 'Co-led brand application, product development, and library design for a recruiting and marketing site.' },
      { date: 'February 5', kind: 'writing', title: 'When People Say, “I’m Not Creative”', url: 'https://patrickszot.webflow.io/journal/scared-to-try', description: 'On fear, experimentation, and creative identity.' },
      { date: 'January 14', kind: 'writing', title: 'Recurring Evidence that Everything is a Metaphor', url: 'https://patrickszot.webflow.io/journal/everything-is-a-metaphor', description: 'Notes on analogy as a design and thinking tool.' }
    ]
  },
  {
    year: '2019',
    entries: [
      { date: 'December', kind: 'project', title: 'Lilly Pulitzer Virtual Runway', url: 'https://patrickszot.webflow.io/older-work/lilly', description: 'A virtual activation pitch shaped with creative directors, designers, and production.' },
      { date: 'December', kind: 'project', title: 'National Air and Space Museum hackathon', description: 'Led brand engagement and guided junior practitioners through strategy and production.' },
      { date: 'October', kind: 'project', title: 'G200.GOV rebrand', description: 'Moodboarding, logo and glyph ideation, visual language, presentation development, and product development.' },
      { date: 'September', kind: 'milestone', title: 'Opened Austin Studio' },
      { date: 'August', kind: 'project', title: 'Deloitte Digital DC Brand POV', description: 'Formalized and developed a national branding point of view and usage deck.' },
      { date: 'August', kind: 'project', title: 'Transcom', description: 'Visual identity and brand design for Moving Logistics Partnership.' },
      { date: 'July 29', kind: 'writing', title: 'Redux: Noble Goblin and The Courage to Leave', url: 'https://patrickszot.webflow.io/journal/redux', description: 'A reflection on change and choosing a new direction.' },
      { date: 'June', kind: 'milestone', title: 'Started NYC transfer process' },
      { date: 'June', kind: 'project', title: 'Access Arkansas', description: 'Identity workshop, state-system brand design, and deliverable presentation.' },
      { date: 'May', kind: 'project', title: 'Fenway agency-of-record pitch', description: 'Evolved, illustrated, and delivered the studio point of view on brand maps.' },
      { date: 'March', kind: 'project', title: 'NextGen 3.0, Kentucky', description: 'Designed a white-label product and six-figure state-delivery deal.' }
    ]
  },
  {
    year: '2018',
    entries: [
      { date: 'December', kind: 'project', title: 'CMS Medishield', description: 'UX / UI lead for a high-fidelity prototype.' },
      { date: 'December', kind: 'project', title: 'Deloitte Digital DC Culture Site', description: 'UX / UI lead collaborating with engineers through rapid development.' },
      { date: 'December', kind: 'project', title: 'NextGen PMO', description: 'Clarified data-visualization requirements and delegated production.' },
      { date: 'November', kind: 'project', title: 'GPS 4 GPS', description: 'UX subject-matter expert.' },
      { date: 'October', kind: 'milestone', title: 'Onboarding Chair' },
      { date: 'September', kind: 'project', title: 'EMMA proposal', description: 'UX / UI lead for an animated executive presentation.' },
      { date: 'September', kind: 'milestone', title: 'TFP Instructor' },
      { date: 'August', kind: 'project', title: 'NextGen 3.0', description: 'UX / UI lead for prototype animation and junior-team delegation.' },
      { date: 'June', kind: 'project', title: 'ARC visual design', description: 'Developed brand, voice, and visual language.' },
      { date: 'May', kind: 'project', title: 'LA geographic expansion', description: 'Led a data-visualization lane and developed a Tableau analytical dashboard.' },
      { date: 'May', kind: 'project', title: 'USPS PA / Covalence', description: 'Led network data visualization and database development.' },
      { date: 'April', kind: 'milestone', title: 'Won Fulbright Fellowship', url: 'https://patrickszot.webflow.io/journal/fulbright-fellowship' },
      { date: 'March', kind: 'project', title: 'FDIC E.I.', description: 'Led UX research, executive interviews, and a product-visioning session.' },
      { date: 'February', kind: 'project', title: 'Deloitte University', description: 'Led a team through technical simulation.' },
      { date: 'February', kind: 'milestone', title: 'Accepted an offer at Deloitte Digital' },
      { date: 'January', kind: 'project', title: 'Facebook IQ', description: 'Subcontracted to lead research in Bangkok, Johannesburg, and São Paulo.' },
      { date: 'January', kind: 'project', title: 'D3 Systems, Inc.', description: 'Led product development, international research, and a contract team.' }
    ]
  },
  {
    year: '2017',
    entries: [
      { date: 'October 21', kind: 'writing', title: 'Winning Gilman Scholarship Essay', url: 'https://patrickszot.webflow.io/journal/the-ticking-bomb-of-usability', description: 'The essay behind a Gilman Scholarship.' },
      { date: '2017', kind: 'project', title: 'CIA.gov / Blackbriar design system', url: 'https://patrickszot.webflow.io/older-work/cia', description: 'A recruiting identity shaped by the tension between the Agency’s history and its future.' }
    ]
  },
  {
    year: '2016',
    entries: [
      { date: 'Early practice', kind: 'milestone', title: 'Independent design work', url: 'https://patrickszot.webflow.io/about', description: 'Freelance and subcontracted work while completing degrees in finance and design.' },
      { date: 'Independent', kind: 'project', title: 'Rite of Spring', url: 'https://patrickszot.webflow.io/older-work/rite-of-spring', description: 'A self-published novel and visual system spanning a bound book and website.' },
      { date: 'Independent', kind: 'project', title: 'TOREI (トレイ)', url: 'https://patrickszot.webflow.io/older-work/torei', description: 'Brand, social, and art direction for a double-album release.' },
      { date: 'Independent', kind: 'project', title: 'Looking Glass EP', url: 'https://patrickszot.webflow.io/older-work/looking-glass', description: 'Album art, audiovisualizers, and Spotify Canvases for a five-track EP.' }
    ]
  }
];

const visualAssetKeyByTitle = new Map(Object.entries({
  'Principal Brand Designer at AirOps': 'airops',
  'GlossAI Rebrand': 'gloss-ai',
  'Album Art: Presage 2022': 'album-art-presage',
  'Webflow Rebrand': 'webflow-rebrand',
  'Webflow visual foundations': 'webflow-customer-stories',
  'Webflow “User Guide”': 'webflow-user-guide',
  'Webflow Conf 2022 – Process and Guidelines': 'webflow-conf-process-guidelines',
  '3D Scene': '3d-scene',
  'Studio Project Trophy Decks': 'studio-trophy-decks',
  'UI Design – Deloitte Digital Internal Directory': 'design-directory',
  'Brand Package – Atelier Saady': 'atelier-saady',
  'Stylized Logo': 'stylized-logo',
  'Webflow Conf 2022 – Grow with the ’Flow Room': 'webflow-conf-grow-room',
  'Webflow Conf 2022 – Themes': 'webflow-conf-themes',
  'Webflow Conf 2022': 'webflow-conf',
  'Thrivent Financial app and web': 'thrivent',
  'The Smart Factory': 'smart-factory',
  'Global Marketing Trends 2021': 'global-marketing-trends',
  'CIA.gov site implementation': 'blackbriar',
  'Lilly Pulitzer Virtual Runway': 'lilly-pulitzer',
  'Rite of Spring': 'rite-of-spring',
  'TOREI (トレイ)': 'torei',
  'Looking Glass EP': 'looking-glass'
}));

const visualPreviewByKey = Object.freeze(Object.fromEntries(
  Object.entries(visualManifestData.projects).map(([key, project]) => [key, project.preview])
));

const formatVisualDate = (isoDate) => {
  if (!isoDate) return '';
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${isoDate}T00:00:00Z`));
};

const approximateEntryDate = (year, date, order) => {
  if (date === 'Present') return Date.UTC(Number(year), 11, 31, 23, 59, 59);
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  const month = monthNames.findIndex((name) => date.toLowerCase().startsWith(name));
  const day = Number(date.match(/\b(\d{1,2})\b/)?.[1] || 1);
  return Date.UTC(Number(year), month >= 0 ? month : 0, day) - order;
};

const placeVisualProjectsFromFolders = () => {
  const managedEntries = [];
  const placedKeys = new Set();

  timelineData.forEach((section) => {
    section.entries = section.entries.filter((entry) => {
      entry.assetKey = visualAssetKeyByTitle.get(entry.title);
      if (!entry.assetKey) return true;
      const project = visualManifestData.projects[entry.assetKey];
      if (!project) return false;
      if (placedKeys.has(entry.assetKey)) {
        entry.assetKey = undefined;
        return true;
      }
      placedKeys.add(entry.assetKey);
      entry.timelineDate = project.date;
      if (entry.assetKey !== 'airops') entry.date = formatVisualDate(project.date);
      managedEntries.push(entry);
      return false;
    });
  });

  Object.entries(visualManifestData.projects).forEach(([assetKey, project]) => {
    if (placedKeys.has(assetKey)) return;
    managedEntries.push({
      date: formatVisualDate(project.date),
      timelineDate: project.date,
      kind: 'project',
      title: project.title,
      assetKey
    });
  });

  const sectionsByYear = new Map(timelineData.map((section) => [section.year, section]));
  managedEntries.forEach((entry) => {
    const year = entry.timelineDate.slice(0, 4);
    if (!sectionsByYear.has(year)) {
      const section = { year, entries: [] };
      timelineData.push(section);
      sectionsByYear.set(year, section);
    }
    sectionsByYear.get(year).entries.push(entry);
  });

  timelineData.forEach((section) => {
    section.entries = section.entries
      .map((entry, order) => ({ entry, order }))
      .sort((a, b) => {
        const aDate = a.entry.timelineDate
          ? new Date(`${a.entry.timelineDate}T00:00:00Z`).valueOf()
          : approximateEntryDate(section.year, a.entry.date, a.order);
        const bDate = b.entry.timelineDate
          ? new Date(`${b.entry.timelineDate}T00:00:00Z`).valueOf()
          : approximateEntryDate(section.year, b.entry.date, b.order);
        return bDate - aDate || a.order - b.order;
      })
      .map(({ entry }) => entry);
  });

  timelineData = timelineData
    .filter((section) => section.entries.length)
    .sort((a, b) => Number(b.year) - Number(a.year));
};

placeVisualProjectsFromFolders();

const timeline = document.querySelector('#career-timeline');
const detailsGroup = document.querySelector('.details-group');
const detailsTrigger = document.querySelector('#details-trigger');
const presentProjectTrigger = document.querySelector('#present-project-trigger');
const timelinePanel = document.querySelector('#timeline-panel');
let detailsCloseTimer;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const openDuration = () => reducedMotion.matches ? 0 : 900;
const closeDuration = () => reducedMotion.matches ? 0 : 650;

const backToTop = document.querySelector('#back-to-top');
const sceneReset = document.querySelector('#scene-reset');
const coarsePointer = window.matchMedia('(max-width: 700px), (pointer: coarse)');
let driftTarget = window.scrollY;
let driftFrame;
let driftAnimating = false;
let driftVelocity = 0;
let driftLastTime = performance.now();

const maxScrollY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
const clampScrollY = (value) => Math.min(maxScrollY(), Math.max(0, value));
const isAtScrollEnd = () => maxScrollY() - window.scrollY <= Math.max(4, window.innerHeight * .012);
let scrollRevealLocked = false;
let scrollRevealTimer;

const advanceScrollReveal = () => {
  if (scrollRevealLocked) return false;

  const nextProject = overviewProjects.find((group) => !group.classList.contains('is-open'));
  if (nextProject) {
    revealOverviewProject(nextProject);
  } else if (!detailsGroup.classList.contains('is-open')) {
    detailsTrigger.click();
  } else {
    return false;
  }

  scrollRevealLocked = true;
  document.body.classList.add('scroll-reveal-transitioning');
  window.clearTimeout(scrollRevealTimer);
  scrollRevealTimer = window.setTimeout(() => {
    scrollRevealLocked = false;
    document.body.classList.remove('scroll-reveal-transitioning');
    driftTarget = window.scrollY;
  }, reducedMotion.matches ? 80 : 1120);
  return true;
};

const cancelDrift = () => {
  if (driftFrame) cancelAnimationFrame(driftFrame);
  driftFrame = undefined;
  driftAnimating = false;
  driftVelocity = 0;
  driftTarget = window.scrollY;
};

const runDrift = (now) => {
  const deltaTime = Math.min(.032, Math.max(.008, (now - driftLastTime) / 1000));
  driftLastTime = now;
  const distance = driftTarget - window.scrollY;
  if (Math.abs(distance) < .4 && Math.abs(driftVelocity) < 3) {
    window.scrollTo(0, driftTarget);
    driftFrame = undefined;
    driftAnimating = false;
    driftVelocity = 0;
    return;
  }

  driftAnimating = true;
  const acceleration = distance * 58 - driftVelocity * 14;
  driftVelocity += acceleration * deltaTime;
  const nextPosition = clampScrollY(window.scrollY + driftVelocity * deltaTime);
  if ((nextPosition === 0 && driftVelocity < 0) || (nextPosition === maxScrollY() && driftVelocity > 0)) driftVelocity = 0;
  window.scrollTo(0, nextPosition);
  driftFrame = requestAnimationFrame(runDrift);
};

const driftTo = (position) => {
  if (reducedMotion.matches) {
    window.scrollTo(0, clampScrollY(position));
    return;
  }
  driftTarget = clampScrollY(position);
  if (!driftFrame) {
    driftLastTime = performance.now();
    driftFrame = requestAnimationFrame(runDrift);
  }
};

window.addEventListener('wheel', (event) => {
  if (event.ctrlKey || event.target.closest('.content-well-scroll')) return;
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
  const impulse = event.deltaY * unit;
  if (impulse > 0 && isAtScrollEnd() && advanceScrollReveal()) {
    event.preventDefault();
    cancelDrift();
    return;
  }
  if (coarsePointer.matches || reducedMotion.matches) return;
  event.preventDefault();
  driftVelocity += Math.max(-420, Math.min(420, impulse * .72));
  driftTo(driftTarget + impulse * .34);
}, { passive: false });

let scrollRevealTouchStartY;
window.addEventListener('touchstart', (event) => {
  cancelDrift();
  scrollRevealTouchStartY = event.touches.length === 1 && !event.target.closest('.content-well-scroll')
    ? event.touches[0].clientY
    : undefined;
}, { passive: true });

window.addEventListener('touchend', (event) => {
  if (scrollRevealTouchStartY === undefined || !event.changedTouches.length) return;
  const upwardTravel = scrollRevealTouchStartY - event.changedTouches[0].clientY;
  scrollRevealTouchStartY = undefined;
  if (upwardTravel > 28 && isAtScrollEnd()) advanceScrollReveal();
}, { passive: true });

window.addEventListener('touchcancel', () => { scrollRevealTouchStartY = undefined; }, { passive: true });

document.addEventListener('keydown', (event) => {
  if (reducedMotion.matches || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.target.closest('a, button, input, textarea, select, [contenteditable="true"], .content-well-scroll')) return;

  const keyboardDistances = {
    ArrowDown: 52,
    ArrowUp: -52,
    PageDown: window.innerHeight * .52,
    PageUp: window.innerHeight * -.52,
    ' ': window.innerHeight * (event.shiftKey ? -.58 : .58)
  };

  if (event.key === 'Home') {
    event.preventDefault();
    driftTo(0);
  } else if (event.key === 'End') {
    event.preventDefault();
    driftTo(maxScrollY());
  } else if (keyboardDistances[event.key] !== undefined) {
    event.preventDefault();
    const distance = keyboardDistances[event.key];
    if (distance > 0 && isAtScrollEnd() && advanceScrollReveal()) return;
    driftTo(driftTarget + distance);
  }
});

window.addEventListener('resize', () => { driftTarget = clampScrollY(driftTarget); });
window.addEventListener('scroll', () => {
  if (!driftAnimating) driftTarget = window.scrollY;
  backToTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * .65);
}, { passive: true });

backToTop.addEventListener('click', () => driftTo(0));
backToTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * .65);

const projectDisplayTitles = new Map(Object.entries({
  'GlossAI Rebrand': 'GlossAI rebrand',
  'Album Art: Presage 2022': 'Album art: Presage 2022',
  'Webflow Rebrand': 'Webflow rebrand',
  'Webflow “User Guide”': 'Webflow “User guide”',
  'Webflow Conf 2022 – Process and Guidelines': 'Webflow Conf 2022 – Process and guidelines',
  '3D Scene': '3D scene',
  'Studio Project Trophy Decks': 'Studio project trophy decks',
  'UI Design – Deloitte Digital Internal Directory': 'UI design – Deloitte Digital internal directory',
  'Brand Package – Atelier Saady': 'Brand package – Atelier Saady',
  'Stylized Logo': 'Stylized logo',
  'Webflow Conf 2022 – Grow with the ’Flow Room': 'Webflow Conf 2022 – Grow with the ’Flow room',
  'Webflow Conf 2022 – Themes': 'Webflow Conf 2022 – themes',
  'WNBA Pursuit': 'WNBA pursuit',
  'Deloitte Digital National Brand Launch': 'Deloitte Digital national brand launch',
  'Lilly Pulitzer Virtual Runway': 'Lilly Pulitzer virtual runway',
  'Deloitte Digital DC Brand POV': 'Deloitte Digital DC brand POV',
  'Deloitte Digital DC Culture Site': 'Deloitte Digital DC culture site'
}));

const metadataTitleCase = (value) => value.replace(/\b([a-z])([a-z]*)/g, (_, first, rest) => `${first.toUpperCase()}${rest.toLowerCase()}`);
const displayEntryTitle = (entry) => entry.kind === 'project' ? projectDisplayTitles.get(entry.title) || entry.title : entry.title;

const entryMarkup = (entry) => {
  const displayTitle = displayEntryTitle(entry);
  const assetCount = entry.kind === 'project' && entry.assetKey
    ? '<span class="timeline-asset-count" hidden></span>'
    : '';
  const linkedTitle = entry.kind === 'project' && entry.assetKey
    ? `<button class="project-title-trigger content-well-trigger" type="button" tabindex="-1" aria-label="Browse ${displayTitle} media" aria-controls="content-well">${displayTitle}</button>`
    : entry.kind === 'writing' && entry.url
      ? `<button class="text-link writing-title-trigger content-well-trigger" type="button" tabindex="-1" aria-label="Read ${displayTitle}" aria-controls="content-well">${displayTitle}</button>`
      : displayTitle;
  const externalAction = entry.url && entry.kind !== 'milestone'
    ? `<a class="timeline-external" href="${entry.url}" target="_blank" rel="noopener noreferrer"><span>View source</span><i class="ri-external-link-line" aria-hidden="true"></i></a>`
    : '';
  const marker = entry.kind === 'project' && entry.assetKey
    ? `<button class="timeline-marker project-expand-trigger content-well-trigger" type="button" tabindex="-1" aria-label="Browse ${entry.title} media" aria-controls="content-well"></button>`
    : entry.kind === 'writing' && entry.url
      ? `<button class="timeline-marker writing-expand-trigger content-well-trigger" type="button" tabindex="-1" aria-label="Read ${entry.title}" aria-controls="content-well"></button>`
      : `<span class="timeline-marker${entry.kind === 'milestone' || (entry.kind === 'project' && !entry.url) ? ' is-muted' : ''}" aria-hidden="true"></span>`;
  return `
    <article class="timeline-entry" data-kind="${entry.kind}">
      ${marker}
      <div class="timeline-entry-copy">
        <div class="timeline-meta"><time>${metadataTitleCase(entry.date)}</time><span>${metadataTitleCase(entry.kind)}</span>${assetCount}</div>
        <h3>${linkedTitle}</h3>
        ${entry.description ? `<p>${entry.description}</p>` : ''}
        ${externalAction}
      </div>
    </article>`;
};

const presentProjectData = timelineData[0].entries[0];
const displayTimelineData = timelineData.map((section, index) => ({
  ...section,
  entries: index === 0 ? section.entries.slice(1) : section.entries
}));
timeline.innerHTML = displayTimelineData.map((section, yearIndex) => `
  <section class="timeline-year" aria-labelledby="year-${section.year.toLowerCase()}">
    <h2 class="timeline-year-heading" id="year-${section.year.toLowerCase()}" style="--year-delay: ${yearIndex * 55}ms"><span>${section.year}</span></h2>
    <div class="timeline-year-entries">${section.entries.map(entryMarkup).join('')}</div>
  </section>`).join('');

const timelineEntries = [...timeline.querySelectorAll('.timeline-entry')];
const timelineRecords = displayTimelineData.flatMap((section) => section.entries);
timelineEntries.forEach((element, index) => { element.entryData = timelineRecords[index]; });
const fixedPreviewSourceFor = (entry) => {
  if (!entry) return visualPreviewByKey.airops;
  return visualPreviewByKey[entry.assetKey] || entry.cover;
};
detailsTrigger.addEventListener('click', () => {
  window.clearTimeout(detailsCloseTimer);
  const open = !detailsGroup.classList.contains('is-open');
  detailsTrigger.setAttribute('aria-expanded', String(open));
  detailsTrigger.setAttribute('aria-label', open ? 'Close timeline' : 'Open timeline');

  if (open) {
    clearTimelineActive();
    positionContentWell();
    renderContentWell(presentProjectData);
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
  document.body.classList.remove('present-focus');
  document.body.classList.add('details-closing');
  setPreviewVisibility(false);
  clearTimelineActive();

  const visibleMotionItems = [...timeline.querySelectorAll('.timeline-entry, .timeline-year-heading')]
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
  }, closeDuration());
});

let activeTimelineEntry;
let activeTimelineFrame;
let previousScrollY = window.scrollY;
let previousScrollTime = performance.now();
let timelineScrollDirection = 0;
let timelineScrollVelocity = 0;
const contentWell = document.querySelector('#content-well');
const contentWellAnchor = document.querySelector('#content-well-anchor');
const contentWellBillboard = contentWellAnchor.querySelector('.content-well-billboard');
const contentWellScroll = contentWell.querySelector('.content-well-scroll');
const contentWellProgress = contentWell.querySelector('.content-well-progress');
const contentWellControls = contentWell.querySelector('.content-well-controls');
const contentWellPrevious = contentWell.querySelector('.content-well-previous');
const contentWellNext = contentWell.querySelector('.content-well-next');
const contentWellCount = contentWell.querySelector('.content-well-count');
const contentWellStatus = contentWell.querySelector('.content-well-status');
let renderContentWell = () => {};

const setPreviewVisibility = (visible) => {
  const hasContent = contentWell.classList.contains('has-content');
  const show = visible && hasContent;
  contentWell.classList.toggle('is-visible', show);
  contentWell.setAttribute('aria-hidden', String(!show));
  contentWellAnchor.setAttribute('aria-hidden', String(!show));
  if (!show) contentWellScroll.querySelectorAll('video').forEach((video) => video.pause());
};

const offsetTopWithin = (element, ancestor) => {
  let top = 0;
  let node = element;
  while (node && node !== ancestor) {
    top += node.offsetTop;
    node = node.offsetParent;
  }
  return top;
};

const positionContentWell = (entryElement) => {
  const firstEntry = timelineEntries[0];
  let top;
  if (entryElement) {
    top = offsetTopWithin(entryElement, timelineScene);
    if (coarsePointer.matches) top += entryElement.offsetHeight + 24;
  } else {
    const firstTop = firstEntry ? offsetTopWithin(firstEntry, timelineScene) : 400;
    top = coarsePointer.matches
      ? Math.max(180, firstTop + 24)
      : Math.max(160, firstTop - 280);
  }
  contentWellAnchor.style.top = `${Math.round(top)}px`;
};

const clearTimelineActive = () => {
  activeTimelineEntry?.classList.remove('is-active');
  activeTimelineEntry?.querySelectorAll('.content-well-trigger').forEach((control) => control.setAttribute('tabindex', '-1'));
  activeTimelineEntry = undefined;
  timeline.classList.remove('has-active');
};

const untransformedDocumentCenter = (element) => {
  let x = element.offsetWidth / 2;
  let y = element.offsetHeight / 2;
  let node = element;
  while (node) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent;
  }
  return { x, y };
};

const timelineEntryForViewport = (candidateEntries) => {
  if (!candidateEntries.length) return undefined;
  if (window.scrollY <= 48) return candidateEntries[0];

  const focusY = window.scrollY + window.innerHeight / 2;
  const entries = candidateEntries.map((entry) => {
    return { entry, center: untransformedDocumentCenter(entry).y };
  });
  const upcomingIndex = entries.findIndex((item) => item.center >= focusY);
  if (upcomingIndex === 0) return entries[0].entry;
  if (upcomingIndex === -1) return entries.at(-1).entry;

  const previous = entries[upcomingIndex - 1];
  const upcoming = entries[upcomingIndex];
  const gap = upcoming.center - previous.center;
  const velocityBias = Math.min(.08, timelineScrollVelocity * .025);
  const directionalBias = timelineScrollDirection * gap * (.035 + velocityBias);
  const handoffPoint = previous.center + gap / 2 - directionalBias;
  return focusY < handoffPoint ? previous.entry : upcoming.entry;
};

const updateTimelineActive = () => {
  activeTimelineFrame = undefined;
  if (!document.body.classList.contains('details-open') || document.body.classList.contains('details-opening') || document.body.classList.contains('details-closing') || timelinePanel.hidden) return;

  const firstTimelineEntry = timelineEntries[0];
  const firstEntryCenter = firstTimelineEntry ? untransformedDocumentCenter(firstTimelineEntry).y : 0;
  const presentOwnsFocus = Boolean(firstTimelineEntry && firstEntryCenter - window.scrollY > window.innerHeight / 2);
  const closest = presentOwnsFocus ? undefined : timelineEntryForViewport(timelineEntries);

  document.body.classList.toggle('present-focus', presentOwnsFocus);
  if (!closest) {
    clearTimelineActive();
    positionContentWell();
    renderContentWell(presentProjectData);
    return;
  }
  if (closest !== activeTimelineEntry) {
    activeTimelineEntry?.classList.remove('is-active');
    activeTimelineEntry?.querySelectorAll('.content-well-trigger').forEach((control) => control.setAttribute('tabindex', '-1'));
    activeTimelineEntry = closest;
    timeline.classList.add('has-active');
    activeTimelineEntry.classList.add('is-active');
    activeTimelineEntry.querySelectorAll('.content-well-trigger').forEach((control) => control.setAttribute('tabindex', '0'));
    positionContentWell(activeTimelineEntry);
    renderContentWell(activeTimelineEntry.entryData);
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
    respondToSceneScroll(delta);
  }
  previousScrollY = window.scrollY;
  previousScrollTime = now;
  requestTimelineActiveUpdate();
  requestSceneGeometry();
}, { passive: true });
window.addEventListener('resize', requestTimelineActiveUpdate);

const timelineScene = timelinePanel.querySelector('.timeline-panel-inner');
const profile = document.querySelector('.profile');
const profileScenes = [...document.querySelectorAll('.profile-scene')];
const footerContactScene = document.querySelector('.footer-contact-scene');
const cameraBillboards = [...document.querySelectorAll([
  '.timeline-year-heading',
  '.timeline-entry-copy',
  '.timeline-marker',
  '.profile-billboard',
  '.profile-anchor-marker',
  '.present-project-trigger',
  '.footer-contact-billboard',
  '.timeline-footer-billboard',
  '.content-well-billboard'
].join(','))];

const syncContentWellHost = () => {
  if (coarsePointer.matches) {
    if (contentWellAnchor.parentElement !== document.body) document.body.append(contentWellAnchor);
    contentWellAnchor.style.removeProperty('top');
    return;
  }
  if (contentWellAnchor.parentElement !== timelineScene) timelineScene.prepend(contentWellAnchor);
  positionContentWell(activeTimelineEntry);
};

syncContentWellHost();
coarsePointer.addEventListener('change', syncContentWellHost);

const sceneInteractiveSelector = 'a, button, input, textarea, select, iframe, video, [contenteditable="true"]';
const orbitControlsEnabled = window.matchMedia('(min-width: 701px)');
const sceneLimits = { pitch: 82, yaw: 74 };
const sceneAngles = { pitch: 0, yaw: 0 };
let sceneGesture;
let sceneRenderFrame;
let sceneGeometryFrame;
let sceneMotionGeneration = 0;
let sceneMotionFrame;
let sceneScrollFrame;
const sceneScroll = { y: 0, z: 0, velocityY: 0, velocityZ: 0, targetY: 0, targetZ: 0, lastTime: performance.now() };
let renderedScenePitch = Number.NaN;
let renderedSceneYaw = Number.NaN;

const clampScene = (value, limit) => Math.max(-limit, Math.min(limit, value));

const stopSceneMotion = () => {
  sceneMotionGeneration += 1;
  if (sceneMotionFrame) cancelAnimationFrame(sceneMotionFrame);
  sceneMotionFrame = undefined;
  timelinePanel.classList.remove('is-scene-settling');
};

const renderScene = () => {
  sceneRenderFrame = undefined;
  const forwardTransform = `translate3d(0, ${sceneScroll.y.toFixed(3)}px, ${sceneScroll.z.toFixed(3)}px) rotateY(${sceneAngles.yaw.toFixed(3)}deg) rotateX(${sceneAngles.pitch.toFixed(3)}deg)`;
  timelineScene.style.transform = forwardTransform;
  profileScenes.forEach((element) => { element.style.transform = forwardTransform; });
  footerContactScene.style.transform = forwardTransform;

  const anglesChanged = sceneAngles.pitch !== renderedScenePitch || sceneAngles.yaw !== renderedSceneYaw;
  if (anglesChanged) {
    const billboardTransform = `rotateX(${(-sceneAngles.pitch).toFixed(3)}deg) rotateY(${(-sceneAngles.yaw).toFixed(3)}deg)`;
    const sceneValues = {
      '--scene-rx': `${sceneAngles.pitch.toFixed(3)}deg`,
      '--scene-ry': `${sceneAngles.yaw.toFixed(3)}deg`,
      '--scene-counter-rx': `${(-sceneAngles.pitch).toFixed(3)}deg`,
      '--scene-counter-ry': `${(-sceneAngles.yaw).toFixed(3)}deg`
    };
    [timelinePanel, backToTop, ...profileScenes, footerContactScene].forEach((element) => {
      Object.entries(sceneValues).forEach(([property, value]) => element.style.setProperty(property, value));
    });
    cameraBillboards.forEach((element) => { element.style.transform = billboardTransform; });
    const oriented = Math.abs(sceneAngles.pitch) > .08 || Math.abs(sceneAngles.yaw) > .08;
    timelinePanel.classList.toggle('is-scene-oriented', oriented);
    sceneReset.classList.toggle('is-visible', document.body.classList.contains('details-open') && oriented);
    renderedScenePitch = sceneAngles.pitch;
    renderedSceneYaw = sceneAngles.yaw;
  }
};

const requestSceneRender = () => {
  renderScene();
};

const refreshSceneGeometry = () => {
  sceneGeometryFrame = undefined;
  if (timelinePanel.hidden) return;
  const panelRect = timelinePanel.getBoundingClientRect();
  const originY = Math.max(0, Math.min(timelineScene.offsetHeight, window.innerHeight / 2 - panelRect.top));
  timelinePanel.style.setProperty('--scene-origin-y', `${originY}px`);
  const axisMarkers = [...timelineScene.querySelectorAll('.timeline-marker')];
  const markerCenterY = (marker) => {
    let y = marker.offsetHeight / 2;
    let node = marker;
    while (node && node !== timelineScene) {
      y += node.offsetTop;
      node = node.offsetParent;
    }
    return y;
  };
  if (axisMarkers.length) {
    const timelineSceneCenter = untransformedDocumentCenter(timelineScene);
    const timelineSceneTop = timelineSceneCenter.y - timelineScene.offsetHeight / 2;
    const axisStart = untransformedDocumentCenter(presentProjectTrigger).y - timelineSceneTop;
    const axisEnd = markerCenterY(axisMarkers[axisMarkers.length - 1]);
    timelineScene.style.setProperty('--timeline-axis-start', `${axisStart.toFixed(2)}px`);
    timelineScene.style.setProperty('--timeline-axis-length', `${Math.max(0, axisEnd - axisStart).toFixed(2)}px`);
  }
  const profileCenter = untransformedDocumentCenter(profile);
  const profileLayoutLeft = profileCenter.x - profile.offsetWidth / 2;
  const profileLayoutTop = profileCenter.y - profile.offsetHeight / 2;
  profile.style.setProperty('--profile-perspective-origin-x', `${window.innerWidth / 2 - profileLayoutLeft}px`);
  profile.style.setProperty('--profile-perspective-origin-y', `${window.scrollY + window.innerHeight / 2 - profileLayoutTop}px`);
  [...profileScenes, footerContactScene].forEach((element) => {
    const center = untransformedDocumentCenter(element);
    const layoutLeft = center.x - element.offsetWidth / 2;
    const layoutTop = center.y - element.offsetHeight / 2;
    element.style.setProperty('--scene-local-origin-x', `${window.innerWidth / 2 - layoutLeft}px`);
    element.style.setProperty('--scene-local-origin-y', `${window.scrollY + window.innerHeight / 2 - layoutTop}px`);
  });
  requestSceneRender();
};

const requestSceneGeometry = () => {
  if (!sceneGeometryFrame) sceneGeometryFrame = requestAnimationFrame(refreshSceneGeometry);
};

const setSceneAngles = (pitch, yaw) => {
  sceneAngles.pitch = clampScene(pitch, sceneLimits.pitch);
  sceneAngles.yaw = clampScene(yaw, sceneLimits.yaw);
  requestSceneRender();
};

const springSceneTo = (targetPitch, targetYaw, pitchVelocity = 0, yawVelocity = 0) => {
  stopSceneMotion();
  const generation = sceneMotionGeneration;
  targetPitch = clampScene(targetPitch, sceneLimits.pitch);
  targetYaw = clampScene(targetYaw, sceneLimits.yaw);
  if (reducedMotion.matches) {
    setSceneAngles(targetPitch, targetYaw);
    return;
  }

  timelinePanel.classList.add('is-scene-settling');
  let velocityPitch = Math.max(-220, Math.min(220, pitchVelocity));
  let velocityYaw = Math.max(-220, Math.min(220, yawVelocity));
  let lastTime = performance.now();
  const tick = (now) => {
    if (generation !== sceneMotionGeneration) return;
    const deltaTime = Math.min(.032, Math.max(.008, (now - lastTime) / 1000));
    lastTime = now;
    velocityPitch += ((targetPitch - sceneAngles.pitch) * 72 - velocityPitch * 15.5) * deltaTime;
    velocityYaw += ((targetYaw - sceneAngles.yaw) * 72 - velocityYaw * 15.5) * deltaTime;
    setSceneAngles(sceneAngles.pitch + velocityPitch * deltaTime, sceneAngles.yaw + velocityYaw * deltaTime);
    const remaining = Math.abs(targetPitch - sceneAngles.pitch) + Math.abs(targetYaw - sceneAngles.yaw);
    if (remaining < .025 && Math.abs(velocityPitch) + Math.abs(velocityYaw) < .08) {
      setSceneAngles(targetPitch, targetYaw);
      sceneMotionFrame = undefined;
      timelinePanel.classList.remove('is-scene-settling');
      return;
    }
    sceneMotionFrame = requestAnimationFrame(tick);
  };
  sceneMotionFrame = requestAnimationFrame(tick);
};

const settleSceneScroll = (now) => {
  const deltaTime = Math.min(.032, Math.max(.008, (now - sceneScroll.lastTime) / 1000));
  sceneScroll.lastTime = now;
  const targetDecay = Math.exp(-9 * deltaTime);
  sceneScroll.targetY *= targetDecay;
  sceneScroll.targetZ *= targetDecay;
  sceneScroll.velocityY += ((sceneScroll.targetY - sceneScroll.y) * 88 - sceneScroll.velocityY * 18) * deltaTime;
  sceneScroll.velocityZ += ((sceneScroll.targetZ - sceneScroll.z) * 74 - sceneScroll.velocityZ * 17) * deltaTime;
  sceneScroll.y += sceneScroll.velocityY * deltaTime;
  sceneScroll.z += sceneScroll.velocityZ * deltaTime;
  requestSceneRender();
  const energy = Math.abs(sceneScroll.y) + Math.abs(sceneScroll.z) + Math.abs(sceneScroll.velocityY) + Math.abs(sceneScroll.velocityZ);
  if (energy < .025 && Math.abs(sceneScroll.targetY) + Math.abs(sceneScroll.targetZ) < .01) {
    sceneScroll.y = 0;
    sceneScroll.z = 0;
    sceneScroll.velocityY = 0;
    sceneScroll.velocityZ = 0;
    sceneScrollFrame = undefined;
    requestSceneRender();
    return;
  }
  sceneScrollFrame = requestAnimationFrame(settleSceneScroll);
};

const respondToSceneScroll = (delta) => {
  if (reducedMotion.matches || !document.body.classList.contains('details-open')) return;
  sceneScroll.targetY = Math.max(-8, Math.min(8, -delta * .12));
  sceneScroll.targetZ = Math.max(0, Math.min(10, Math.abs(delta) * .1));
  if (!sceneScrollFrame) {
    sceneScroll.lastTime = performance.now();
    sceneScrollFrame = requestAnimationFrame(settleSceneScroll);
  }
};

const resetTimelineScene = (animate = true) => {
  if (animate && (Math.abs(sceneAngles.pitch) > .08 || Math.abs(sceneAngles.yaw) > .08)) springSceneTo(0, 0);
  else {
    stopSceneMotion();
    setSceneAngles(0, 0);
  }
};

const syncOrbitControls = () => {
  if (orbitControlsEnabled.matches) return;
  sceneGesture = undefined;
  timelinePanel.classList.remove('is-scene-dragging');
  document.body.classList.remove('timeline-scene-dragging');
  resetTimelineScene(false);
};

orbitControlsEnabled.addEventListener('change', syncOrbitControls);
syncOrbitControls();

sceneReset.addEventListener('click', () => resetTimelineScene());

timelinePanel.addEventListener('pointerdown', (event) => {
  if (!orbitControlsEnabled.matches || !document.body.classList.contains('details-open') || event.button !== 0 || event.target.closest(sceneInteractiveSelector)) return;
  stopSceneMotion();
  sceneGesture = {
    id: event.pointerId,
    pointerType: event.pointerType,
    startX: event.clientX,
    startY: event.clientY,
    lastX: event.clientX,
    lastY: event.clientY,
    lastTime: performance.now(),
    startPitch: sceneAngles.pitch,
    startYaw: sceneAngles.yaw,
    pitchVelocity: 0,
    yawVelocity: 0,
    dragging: false
  };
});

timelinePanel.addEventListener('pointermove', (event) => {
  if (!sceneGesture || event.pointerId !== sceneGesture.id) return;
  const dx = event.clientX - sceneGesture.startX;
  const dy = event.clientY - sceneGesture.startY;
  if (!sceneGesture.dragging) {
    if (Math.hypot(dx, dy) < 6) return;
    if (sceneGesture.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx) * 1.15) {
      sceneGesture = undefined;
      return;
    }
    sceneGesture.dragging = true;
    timelinePanel.setPointerCapture?.(event.pointerId);
    timelinePanel.classList.add('is-scene-dragging');
    document.body.classList.add('timeline-scene-dragging');
    requestSceneGeometry();
  }

  event.preventDefault();
  const now = performance.now();
  const elapsed = Math.max(8, now - sceneGesture.lastTime);
  const yawPerPixel = 170 / Math.max(720, window.innerWidth);
  const pitchPerPixel = 168 / Math.max(560, window.innerHeight);
  const instantYawVelocity = (event.clientX - sceneGesture.lastX) / elapsed * yawPerPixel * 1000;
  const instantPitchVelocity = -(event.clientY - sceneGesture.lastY) / elapsed * pitchPerPixel * 1000;
  sceneGesture.yawVelocity = sceneGesture.yawVelocity * .68 + instantYawVelocity * .32;
  sceneGesture.pitchVelocity = sceneGesture.pitchVelocity * .68 + instantPitchVelocity * .32;
  sceneGesture.lastX = event.clientX;
  sceneGesture.lastY = event.clientY;
  sceneGesture.lastTime = now;
  setSceneAngles(sceneGesture.startPitch - dy * pitchPerPixel, sceneGesture.startYaw + dx * yawPerPixel);
}, { passive: false });

const finishSceneGesture = (event, cancelled = false) => {
  if (!sceneGesture || event.pointerId !== sceneGesture.id) return;
  const gesture = sceneGesture;
  sceneGesture = undefined;
  if (!gesture.dragging) return;
  if (timelinePanel.hasPointerCapture?.(event.pointerId)) timelinePanel.releasePointerCapture?.(event.pointerId);
  timelinePanel.classList.remove('is-scene-dragging');
  document.body.classList.remove('timeline-scene-dragging');
  if (cancelled || reducedMotion.matches) return;
  const snapAngle = (value, threshold, destination) => {
    if (Math.abs(value) < 2.5) return 0;
    if (Math.abs(value) > threshold) return Math.sign(value) * destination;
    return value;
  };
  const targetPitch = snapAngle(clampScene(sceneAngles.pitch + gesture.pitchVelocity * .07, sceneLimits.pitch), 64, 79);
  const targetYaw = snapAngle(clampScene(sceneAngles.yaw + gesture.yawVelocity * .07, sceneLimits.yaw), 58, 70);
  springSceneTo(targetPitch, targetYaw, gesture.pitchVelocity, gesture.yawVelocity);
};

timelinePanel.addEventListener('pointerup', (event) => finishSceneGesture(event));
timelinePanel.addEventListener('pointercancel', (event) => finishSceneGesture(event, true));
timelinePanel.addEventListener('dblclick', (event) => {
  if (orbitControlsEnabled.matches && !event.target.closest(sceneInteractiveSelector)) resetTimelineScene();
});

window.addEventListener('scroll', requestSceneGeometry, { passive: true });
window.addEventListener('resize', requestSceneGeometry);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && timelinePanel.classList.contains('is-scene-oriented')) resetTimelineScene();
});
detailsTrigger.addEventListener('click', () => {
  if (detailsTrigger.getAttribute('aria-expanded') === 'false') resetTimelineScene(false);
  else {
    requestSceneGeometry();
  }
});

const projectManifest = Promise.resolve(visualManifestData);
const writingManifest = fetch('assets-writing/manifest.json').then((response) => response.json());
const contentWellPositions = new Map();
let contentWellEntry;
let contentWellKey;
let contentWellGeneration = 0;
let contentWellFrame;
let contentWellMediaGeneration = 0;
let contentWellAssets = [];
let contentWellAssetIndex = 0;

const contentKeyFor = (entry) => entry.assetKey || entry.assetsUrl || entry.url || `${entry.kind}:${entry.title}`;

const assetIdentity = (asset) => {
  try { return new URL(asset.source || asset.src, document.baseURI).href; }
  catch { return asset.source || asset.src; }
};

const inferredAssetType = (src) => {
  if (/\.(?:mp4|mov|webm)(?:$|\?)/i.test(src)) return 'video';
  if (/\.gif(?:$|\?)/i.test(src)) return 'gif';
  return 'image';
};

const assetsForEntry = (manifest, entry) => {
  const project = manifest.projects[entry.assetKey || entry.assetsUrl || entry.url];
  const previewSrc = project?.preview || fixedPreviewSourceFor(entry);
  const candidates = project?.assets?.length
    ? [...project.assets]
    : previewSrc
      ? [{ src: previewSrc, type: inferredAssetType(previewSrc), alt: `${entry.title} preview` }]
      : [];
  const unique = [];
  const seen = new Set();
  candidates.forEach((asset) => {
    const identity = assetIdentity(asset);
    if (!identity || seen.has(identity)) return;
    seen.add(identity);
    unique.push(asset);
  });
  if (!previewSrc) return unique;
  const previewIdentity = assetIdentity({ src: previewSrc });
  const previewIndex = unique.findIndex((asset) => assetIdentity(asset) === previewIdentity);
  if (previewIndex > 0) unique.unshift(unique.splice(previewIndex, 1)[0]);
  return unique;
};

const createContentWellMedia = (asset, index) => {
  if (asset.type === 'spotify' || asset.type === 'youtube') {
    const frame = document.createElement('iframe');
    frame.src = asset.src;
    frame.title = asset.alt || `Project media ${index + 1}`;
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
    video.controls = true;
    return video;
  }
  const image = new Image();
  image.src = asset.src;
  image.alt = asset.alt || `Project media ${index + 1}`;
  image.decoding = 'async';
  image.loading = 'eager';
  image.fetchPriority = 'high';
  return image;
};

const createWritingContent = (article) => {
  const documentNode = document.createElement('article');
  documentNode.className = 'content-well-writing';
  const header = document.createElement('header');
  header.className = 'content-well-writing-header';
  const title = document.createElement('h1');
  title.textContent = article.title;
  const meta = document.createElement('p');
  meta.className = 'content-well-writing-meta';
  meta.textContent = [article.meta.published, article.meta.author].filter(Boolean).join(' · ');
  const body = document.createElement('div');
  body.className = 'content-well-writing-body';
  body.innerHTML = article.content;
  body.querySelectorAll('img').forEach((image) => {
    image.loading = 'lazy';
    image.decoding = 'async';
  });
  body.querySelectorAll('iframe').forEach((frame) => { frame.loading = 'lazy'; });
  header.append(title, meta);
  documentNode.append(header, body);
  return documentNode;
};

const disposeContentWellMedia = () => {
  contentWellScroll.querySelectorAll('video').forEach((video) => {
    video.pause();
    video.removeAttribute('src');
    video.load();
  });
  contentWellScroll.querySelectorAll('iframe').forEach((frame) => frame.removeAttribute('src'));
};

const waitForContentWellMedia = async (media) => {
  if (media instanceof HTMLImageElement) {
    if (!media.complete) {
      await new Promise((resolve) => {
        media.addEventListener('load', resolve, { once: true });
        media.addEventListener('error', resolve, { once: true });
      });
    }
    if (media.naturalWidth && media.decode) await media.decode().catch(() => {});
    return;
  }
  if (media instanceof HTMLVideoElement) {
    if (media.readyState < 1) {
      await new Promise((resolve) => {
        media.addEventListener('loadedmetadata', resolve, { once: true });
        media.addEventListener('error', resolve, { once: true });
      });
    }
    return;
  }
  if (media instanceof HTMLIFrameElement) {
    await Promise.race([
      new Promise((resolve) => media.addEventListener('load', resolve, { once: true })),
      new Promise((resolve) => window.setTimeout(resolve, 1600))
    ]);
  }
};

const updateContentWellControls = () => {
  const total = contentWellAssets.length;
  contentWellControls.hidden = !total || contentWell.dataset.kind !== 'project';
  contentWellPrevious.disabled = contentWellAssetIndex <= 0;
  contentWellNext.disabled = contentWellAssetIndex >= total - 1;
  contentWellCount.textContent = total ? `${String(contentWellAssetIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}` : '';
};

const showContentWellAsset = async (requestedIndex, direction = 0) => {
  if (!contentWellAssets.length) return;
  const index = Math.max(0, Math.min(contentWellAssets.length - 1, requestedIndex));
  const generation = ++contentWellMediaGeneration;
  const outgoing = contentWellScroll.querySelector('.content-well-item');
  contentWell.classList.remove('is-ready');
  contentWellAssetIndex = index;
  updateContentWellControls();
  contentWellStatus.textContent = `Asset ${index + 1} of ${contentWellAssets.length}`;

  if (outgoing && direction && !reducedMotion.matches) {
    await outgoing.animate(
      [
        { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
        { opacity: 0, transform: `translate3d(${-direction * 10}px, -2px, 0) scale(.997)` }
      ],
      { duration: 150, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'forwards' }
    ).finished.catch(() => {});
  }
  if (generation !== contentWellMediaGeneration) return;

  disposeContentWellMedia();
  const item = document.createElement('figure');
  item.className = 'content-well-item';
  item.dataset.index = String(index);
  item.style.setProperty('--asset-enter-x', `${direction * 12}px`);
  const media = createContentWellMedia(contentWellAssets[index], index);
  item.append(media);
  contentWellScroll.replaceChildren(item);
  contentWellScroll.scrollTop = 0;
  await waitForContentWellMedia(media);
  if (generation !== contentWellMediaGeneration) return;
  requestAnimationFrame(() => contentWell.classList.add('is-ready'));
};

const updateContentWellActive = () => {
  contentWellFrame = undefined;
  if (contentWell.dataset.kind === 'writing') {
    const range = Math.max(1, contentWellScroll.scrollHeight - contentWellScroll.clientHeight);
    const progress = Math.max(0, Math.min(1, contentWellScroll.scrollTop / range));
    contentWellProgress.style.setProperty('--document-progress', progress.toFixed(4));
    contentWellStatus.textContent = `${Math.round(progress * 100)}% read`;
    return;
  }
  updateContentWellControls();
  contentWellStatus.textContent = contentWellAssets.length
    ? `Asset ${contentWellAssetIndex + 1} of ${contentWellAssets.length}`
    : '';
};

const requestContentWellActive = () => {
  if (!contentWellFrame) contentWellFrame = requestAnimationFrame(updateContentWellActive);
};

contentWellScroll.addEventListener('scroll', () => {
  if (contentWellKey && contentWell.dataset.kind === 'writing') contentWellPositions.set(contentWellKey, contentWellScroll.scrollTop);
  requestContentWellActive();
}, { passive: true });

contentWell.addEventListener('pointerenter', cancelDrift);
contentWell.addEventListener('pointerdown', cancelDrift);
contentWell.addEventListener('touchstart', cancelDrift, { passive: true });

contentWellPrevious.addEventListener('click', () => showContentWellAsset(contentWellAssetIndex - 1, -1));
contentWellNext.addEventListener('click', () => showContentWellAsset(contentWellAssetIndex + 1, 1));

contentWell.addEventListener('keydown', (event) => {
  if (contentWell.dataset.kind !== 'project') return;
  if (event.key === 'ArrowLeft' && !contentWellPrevious.disabled) {
    event.preventDefault();
    showContentWellAsset(contentWellAssetIndex - 1, -1);
  } else if (event.key === 'ArrowRight' && !contentWellNext.disabled) {
    event.preventDefault();
    showContentWellAsset(contentWellAssetIndex + 1, 1);
  }
});

renderContentWell = async (entry) => {
  if (!entry) return;
  const key = contentKeyFor(entry);
  if (contentWellEntry === entry) {
    setPreviewVisibility(document.body.classList.contains('details-open'));
    return;
  }
  if (contentWellKey && contentWell.dataset.kind === 'writing') contentWellPositions.set(contentWellKey, contentWellScroll.scrollTop);
  const generation = ++contentWellGeneration;
  ++contentWellMediaGeneration;
  contentWellEntry = entry;
  contentWellKey = key;
  contentWell.classList.remove('is-ready', 'has-content');
  contentWell.dataset.kind = entry.kind;
  disposeContentWellMedia();
  contentWellScroll.replaceChildren();
  contentWellProgress.replaceChildren();
  contentWellProgress.classList.remove('is-document');
  contentWellControls.hidden = true;
  contentWellAssets = [];
  contentWellAssetIndex = 0;

  let label = `${entry.title}, no preview content`;
  let hasContent = false;

  if (entry.kind === 'writing' && entry.url) {
    const manifest = await writingManifest;
    const record = manifest.writings[new URL(entry.url, document.baseURI).href];
    if (record) {
      const response = await fetch(record.file);
      const article = await response.json();
      if (generation !== contentWellGeneration) return;
      contentWellScroll.append(createWritingContent(article));
      contentWellProgress.classList.add('is-document');
      hasContent = true;
      label = `${entry.title}, writing`;
    }
  } else if (entry.kind === 'project') {
    const manifest = await projectManifest;
    if (generation !== contentWellGeneration) return;
    contentWellAssets = assetsForEntry(manifest, entry);
    hasContent = contentWellAssets.length > 0;
    label = hasContent
      ? `${entry.title}, ${contentWellAssets.length} ${contentWellAssets.length === 1 ? 'asset' : 'assets'}`
      : `${entry.title}, no preview content`;
  }

  if (generation !== contentWellGeneration) return;
  contentWell.classList.toggle('has-content', hasContent);
  contentWell.setAttribute('aria-label', label);
  setPreviewVisibility(document.body.classList.contains('details-open'));
  if (!hasContent) {
    contentWellStatus.textContent = '';
    return;
  }

  if (entry.kind === 'writing') {
    contentWellScroll.scrollTop = contentWellPositions.get(key) || 0;
    requestAnimationFrame(() => {
      contentWell.classList.add('is-ready');
      updateContentWellActive();
    });
    return;
  }

  updateContentWellControls();
  showContentWellAsset(0, 0);
};

projectManifest.then((manifest) => {
  timelineEntries.forEach((element) => {
    const count = assetsForEntry(manifest, element.entryData).length;
    const label = element.querySelector('.timeline-asset-count');
    if (!label || !count) return;
    label.textContent = `${count} ${count === 1 ? 'asset' : 'assets'}`;
    label.hidden = false;
  });
});

const focusContentWell = async (entry) => {
  await renderContentWell(entry);
  contentWellScroll.focus({ preventScroll: true });
};

timeline.querySelectorAll('.content-well-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const element = trigger.closest('.timeline-entry');
    if (element !== activeTimelineEntry) return;
    focusContentWell(element.entryData);
  });
});

presentProjectTrigger.addEventListener('click', () => focusContentWell(presentProjectData));
