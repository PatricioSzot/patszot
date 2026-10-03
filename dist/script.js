const visualManifestData = await fetch('assets-visual/manifest.json?v=20261003-embed-performance')
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
  const visibleProfileHeight = Math.ceil(overviewProfile.getBoundingClientRect().height);
  const previousScenes = overviewProfile.querySelectorAll('.profile-previous-scene');
  const previousScene = previousScenes[previousScenes.length - 1];
  const scrimBottom = previousScene.offsetTop + previousScene.offsetHeight;
  const timelineHandoffGap = window.matchMedia('(max-width: 700px)').matches ? 28 : 72;
  const timelineTop = overviewProfile.offsetTop + visibleProfileHeight + timelineHandoffGap;

  overviewProfile.style.setProperty('--profile-scrim-bottom', `${Math.ceil(scrimBottom)}px`);
  document.documentElement.style.setProperty('--profile-reserved-height', `${visibleProfileHeight}px`);
  document.documentElement.style.setProperty('--timeline-header-space', `${timelineTop}px`);

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
  }, 420);
  overviewRevealTimers.set(group, timer);
};

new ResizeObserver(syncOverviewHeight).observe(overviewProfile);

document.querySelectorAll('.load-line').forEach((line) => {
  line.addEventListener('animationend', () => line.classList.remove('load-line'), { once: true });
});

document.querySelectorAll('.group').forEach((group) => {
  group.querySelector(':scope > .group-trigger, :scope > .overview-project-heading > .group-trigger, :scope > .previous-row > .group-trigger').addEventListener('click', () => {
    if (group.classList.contains('is-open') || overviewRevealTimers.has(group)) setOverviewProjectOpen(group, false);
    else setOverviewProjectOpen(group, true);
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
      { date: 'Present', kind: 'project', title: 'Principal Brand Designer at AirOps', url: 'https://www.airops.com/', description: 'Brand strategy, market repositioning, web transformation, image systems, and marketing tooling' },
      { date: 'January 22', kind: 'writing', title: 'My Inner Circle is Made Up of Bad-ass Women', url: 'https://medium.com/@patrick.m.szot/my-inner-circle-is-made-up-of-bad-ass-women-5-powers-they-gave-me-that-id-like-to-share-with-you-0e9117e3693a', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*L6Mz9ArPrUDjh_GrxX7Yrg.png', description: 'Five lessons about power, care, and reflecting the world we actually live in' }
    ]
  },
  {
    year: '2025',
    entries: [
      { date: 'December 24', kind: 'writing', title: 'The Importance of Celebration and Rest for Creatives', url: 'https://medium.com/@patrick.m.szot/the-importance-of-celebration-and-rest-for-creatives-8cdd66602d74', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*GSVjAl3r5qXH0HcL9gFlSQ.png', description: 'On pausing to recognize the work before moving to the next thing' },
      { date: 'May 9', kind: 'writing', title: 'Config 2025: It’s The Same, Just Different This Time', url: 'https://medium.com/@patrick.m.szot/config-2025-its-the-same-just-different-this-time-19ab9ed00a52', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*ht0MLlsIZJJpyYASbWi-dw.png', description: 'Thoughts on beauty, efficient production, and working across aisles' },
      { date: '2025', kind: 'project', title: 'GlossAI Rebrand', url: 'https://genius.ai/', description: 'Brand identity and launch expression for GlossGenius' },
      { date: '2025', kind: 'project', title: 'Lovable', description: 'Misc. enterprise marketing/brand support' }
    ]
  },
  {
    year: '2024',
    entries: [
      { date: 'November 20', kind: 'writing', title: 'Celebrating My 30th And A Decade in Tech', url: 'https://medium.com/@patrick.m.szot/celebrating-my-30th-and-a-decade-in-tech-2014-2024-1347b3b3ef72', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*zmDBsxxtVsG_WIYBFak_Ug.png', description: 'A decade-in-review across work, practice, and recent flowers from the garden' },
      { date: 'July 29', kind: 'writing', title: 'I Was Separated From My Position at Webflow', url: 'https://patrickszot.webflow.io/journal/i-got-seperated-from-my-position-at-webflow', description: 'A candid reflection on the end of a chapter' },
      { date: 'June 10', kind: 'project', title: 'Album Art: Presage 2022', url: 'https://dribbble.com/shots/24328431-Album-Art-Presage-2022', cover: 'https://cdn.dribbble.com/userupload/15032821/file/original-fe6a0e24019319be3d899139d9a02b50.png?crop=237x133-2804x2059&format=webp&resize=800x600&vertical=center' }
    ]
  },
  {
    year: '2023',
    entries: [
      { date: 'August 21', kind: 'writing', title: 'Care Less: Beneficial Reasons to Loosen Your Grip at Work', url: 'https://medium.com/@patrick.m.szot/care-less-a-case-for-designers-to-loosen-their-grip-at-work-c214fed3ffce', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*lKex14FN1xw8a5k9_Rp5eg.jpeg', description: 'A case for creating enough distance to protect judgment and momentum' },
      { date: 'August 1', kind: 'project', title: 'Webflow Rebrand', url: 'https://patrickszot.webflow.io/recent-work/webflow-rebrand', description: 'Visual foundations, motion guidelines, campaigns, customer stories, and event systems' },
      { date: 'March 11', kind: 'writing', title: 'Personality and Clarity: The Changing Role of Brands in Society', url: 'https://medium.com/@patrick.m.szot/personality-and-clarity-the-changing-role-of-brands-in-society-8d2470076908', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*ChRfyyagLmVHGV__sQozPA.jpeg', description: 'How expressive systems change as brands begin to walk and talk' },
      { date: 'February 21', kind: 'writing', title: 'Webflow Conf 2022 Brand System', url: 'https://medium.com/@patrick.m.szot/webflow-conf-2022-brand-system-c9e6c3f13b82', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*OkRIwxUFBv_nq83677bAeQ.jpeg', description: 'The visual system behind Webflow’s 2022 community gathering' },
      { date: 'February 13', kind: 'writing', title: 'The Use of the Words “Creativity” and “Innovation”', url: 'https://medium.com/@patrick.m.szot/the-use-of-the-words-creativity-and-innovation-711b20634a15', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*EmXdGmb64afAerxTYXpeQA.png', description: 'On two related words that are often stretched until they lose meaning' },
      { date: 'February 12', kind: 'project', title: 'Webflow “User Guide”', url: 'https://domesticatedhorses.webflow.io/', supportingLink: { label: 'view live site', url: 'https://domesticatedhorses.webflow.io/' }, assetsUrl: 'https://dribbble.com/shots/20635546-Webflow-User-Guide', cover: 'https://cdn.dribbble.com/userupload/4614360/file/still-d9d256a232e6beae624e7aec726c1f2d.png?format=webp&resize=800x600&vertical=center' },
      { date: 'February 5', kind: 'writing', title: 'Winning Fulbright Fellowship Sample Essay', url: 'https://medium.com/@patrick.m.szot/winning-fulbright-fellowship-sample-essays-personal-statement-2018-62a9bebd6708', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*5aWNjUvEs6M-nkmPbqOdew.jpeg', description: 'The personal statement behind a 2018 Fulbright Fellowship' },
      { date: 'February 4', kind: 'project', title: 'Webflow Conf 2022 – Process and Guidelines', url: 'https://dribbble.com/shots/20567364-Webflow-Conf-2022-Process-and-Guidelines', cover: 'https://cdn.dribbble.com/userupload/4483551/file/original-4f2dbf8f04413c4c5d18c77e6f5a6b3e.jpg?format=webp&resize=800x600&vertical=center' },
      { date: 'January 29', kind: 'project', title: '3D Scene', url: 'https://dribbble.com/shots/20509333-3D-Scene', cover: 'https://cdn.dribbble.com/userupload/4444324/file/original-bd42fa6b5f12fe499425bf830b2d67d3.png?crop=0x204-1594x1399&format=webp&resize=800x600&vertical=center' },
      { date: 'January 29', kind: 'project', title: 'Brand Package – Atelier Saady', url: 'https://dribbble.com/shots/20509285-Brand-Package-Atelier-Saady', cover: 'https://cdn.dribbble.com/userupload/4444272/file/original-adb031e59e14d570d577d41332a52485.jpg?crop=0x343-1200x1243&format=webp&resize=800x600&vertical=center' },
      { date: 'January 17', kind: 'project', title: 'Webflow Conf 2022 – Grow with the ’Flow Room', url: 'https://dribbble.com/shots/20410030-Webflow-Conf-2022-Grow-with-the-Flow-room', cover: 'https://cdn.dribbble.com/userupload/4293440/file/original-d1e576e3b7230d2cc45147ed55ac5495.jpg?crop=0x0-1920x1440&format=webp&resize=800x600&vertical=center' },
      { date: 'January 11', kind: 'project', title: 'Webflow Conf 2022 – Themes', url: 'https://dribbble.com/shots/20356384-Webflow-Conf-2022-Themes', cover: 'https://cdn.dribbble.com/userupload/4272644/file/original-848a983cbfe134a519a90f6802a8dff4.jpg?crop=3x0-1503x1125&format=webp&resize=800x600&vertical=center' },
      { date: 'January 4', kind: 'writing', title: '2022 Retrospective: Leadership and Soft Skills', url: 'https://patrickszot.webflow.io/journal/2022-retrospective', description: 'Notes on leadership, collaboration, and creative practice' },
      { date: 'January 1', kind: 'project', title: 'Webflow OOH SF Campaign', description: 'Out-of-home campaign across San Francisco and Berkeley' },
      { date: '2023', kind: 'project', title: 'Webflow customer Stories', url: 'https://patrickszot.webflow.io/recent-work/webflow-rebrand', description: 'Illustration, sub-branding, color, lighting, motion, and more than 1,000 custom icons' }
    ]
  },
  {
    year: '2022',
    entries: [
      { date: 'September 20', kind: 'writing', title: 'More Words ≠ More Clarity', url: 'https://patrickszot.webflow.io/journal/more-words-is-not-more-clarity', description: 'On communication, editing, and finding the useful idea' },
      { date: 'March 1', kind: 'project', title: 'Webflow Conf 2022', url: 'https://patrickszot.webflow.io/recent-work/webflow-conf', description: 'A layered event system spanning brand, interface, art direction, and production' },
      { date: 'January 1', kind: 'milestone', title: 'Joined Webflow', url: 'https://patrickszot.webflow.io/about', description: 'Moved from agency work into an in-house startup brand team' },
      { date: 'January 2', kind: 'writing', title: '2021 Retrospective: Producing and Cycles', url: 'https://patrickszot.webflow.io/journal/2021-retrospective', description: 'A review of creative production, repetition, and momentum' },
      { date: 'January 1', kind: 'project', title: 'Looking Glass EP', url: 'https://patrickszot.webflow.io/older-work/looking-glass', description: 'Album art, audiovisualizers, and Spotify Canvases for a five-track EP' }
    ]
  },
  {
    year: '2021',
    entries: [
      { date: 'November', kind: 'work', title: 'NYC Studio Recruiting Committee', description: 'Supported hiring for UI and brand design' },
      { date: 'November', kind: 'project', title: 'WNBA Pursuit', description: 'Led UI tenets and a product vision for digital experiences and brand' },
      { date: 'September', kind: 'milestone', title: 'National Studios art commission', description: 'Commissioned print production for eight unique works delivered at a leadership summit' },
      { date: 'August', kind: 'project', title: 'Thrivent Financial app and web', url: 'https://patrickszot.webflow.io/older-work/thrivent', description: 'Led brand expansion and UI design across concepting, production, and web development' },
      { date: 'June 14', kind: 'writing', title: 'Personality and Clarity: Brands Will Eventually Walk and Talk', url: 'https://patrickszot.webflow.io/journal/personality-and-clarity', description: 'A short essay on expressive brand systems' },
      { date: 'June', kind: 'project', title: 'Deloitte Digital National Brand Launch', description: 'Co-led a national localization of the “Hello New” refresh and collateral' },
      { date: 'May', kind: 'project', title: 'David Yurman pitch', description: 'Led UI tenets and product vision for the flagship site and app' },
      { date: 'March', kind: 'project', title: 'Transamerica', description: 'Led visual identity and brand design for Moving Logistics Partnership' },
      { date: 'February 1', kind: 'project', title: 'TOREI (トレイ)', url: 'https://patrickszot.webflow.io/older-work/torei', description: 'Brand, social, and art direction for a double-album release' },
      { date: 'January', kind: 'project', title: 'UBS mobile app', description: 'Supported production for the mobile onboarding experience' },
      { date: 'January', kind: 'milestone', title: 'Promoted to Senior Brand / UI Designer' }
    ]
  },
  {
    year: '2020',
    entries: [
      { date: '2020', kind: 'milestone', title: 'World’s Greatest Internship Finalist', description: 'Sponsored by Butchershop and Prophet' },
      { date: 'December', kind: 'project', title: 'FAF guidance sites', description: 'Sole UI designer for Financial Accounting Foundation guidance sites' },
      { date: 'October', kind: 'project', title: 'Marriott Vacation Worldwide brand and identity toolkit', description: 'Logo design and visual concepting for an internal brand toolkit' },
      { date: 'September', kind: 'project', title: 'SNHU learner portal', description: 'UI design for a Salesforce Communities web product and contract-to-studio transition' },
      { date: 'July 31', kind: 'writing', title: 'The Use of the Words “Creativity” and “Innovation”', url: 'https://patrickszot.webflow.io/journal/creativity-innovation', description: 'On two related words that are often stretched until they lose meaning' },
      { date: 'July', kind: 'project', title: 'The Smart Factory', url: 'https://patrickszot.webflow.io/older-work/the-smart-factory', description: 'Brand concepting, logo development, and usage guidelines for Deloitte Market Offering' },
      { date: 'June', kind: 'project', title: 'Global Marketing Trends 2021', url: 'https://patrickszot.webflow.io/older-work/dolores-debitis-omnis-qui', description: 'Brand concepting, development, and UI for a seven-story trends report' },
      { date: 'April', kind: 'project', title: 'Takeda social campaign and COVID-19 microsite', description: 'Visual concepting, asset development, and UI design' },
      { date: 'April', kind: 'project', title: 'New Balance', description: 'UI production assets for a flagship web property' },
      { date: 'March', kind: 'milestone', title: 'Shifted to fully remote work' },
      { date: 'March', kind: 'project', title: 'CIA.gov site implementation', url: 'https://patrickszot.webflow.io/older-work/cia', description: 'Co-led brand application, product development, and library design for a recruiting and marketing site' },
      { date: 'February 5', kind: 'writing', title: 'When People Say, “I’m Not Creative”', url: 'https://patrickszot.webflow.io/journal/scared-to-try', description: 'On fear, experimentation, and creative identity' },
      { date: 'January 14', kind: 'writing', title: 'Recurring Evidence that Everything is a Metaphor', url: 'https://patrickszot.webflow.io/journal/everything-is-a-metaphor', description: 'Notes on analogy as a design and thinking tool' },
      { date: 'January 29', kind: 'project', title: 'Stylized Logo', url: 'https://dribbble.com/shots/20509280-Stylized-Logo', cover: 'https://cdn.dribbble.com/userupload/4444266/file/still-6a6075d0bf9f167035ecaa292f0f1bf7.gif?format=webp&resize=800x600&vertical=center' }
    ]
  },
  {
    year: '2019',
    entries: [
      { date: 'December', kind: 'project', title: 'Lilly Pulitzer Virtual Runway', url: 'https://patrickszot.webflow.io/older-work/lilly', description: 'A virtual activation pitch shaped with creative directors, designers, and production' },
      { date: 'December', kind: 'project', title: 'National Air and Space Museum hackathon', description: 'Led brand engagement and guided junior practitioners through strategy and production' },
      { date: 'October', kind: 'project', title: 'CIA.gov rebrand', url: 'https://patrickszot.webflow.io/older-work/cia', description: 'Moodboarding, logo and glyph ideation, visual language, presentation development, and product development' },
      { date: 'September', kind: 'milestone', title: 'Opened Austin Studio' },
      { date: 'August', kind: 'project', title: 'Deloitte Digital DC brand lead IC', description: 'Formalized and developed a national branding point of view and usage deck' },
      { date: 'August', kind: 'project', title: 'Transcom', description: 'Visual identity and brand design for Moving Logistics Partnership' },
      { date: 'June', kind: 'milestone', title: 'Started NYC transfer process' },
      { date: 'June', kind: 'project', title: 'Access Arkansas', description: 'Identity workshop, state-system brand design, and deliverable presentation' },
      { date: 'May', kind: 'project', title: 'Fenway agency-of-record pitch', description: 'Evolved, illustrated, and delivered the studio point of view on brand maps' },
      { date: 'March', kind: 'project', title: 'NextGen 3.0, Kentucky', description: 'Designed a white-label product and six-figure state-delivery deal' }
    ]
  },
  {
    year: '2018',
    entries: [
      { date: 'December', kind: 'project', title: 'CMS Medishield', description: 'UX / UI lead for a high-fidelity prototype' },
      { date: 'December', kind: 'project', title: 'Deloitte Digital DC Culture Site', description: 'UX / UI lead collaborating with engineers through rapid development' },
      { date: 'December', kind: 'project', title: 'NextGen PMO', description: 'Clarified data-visualization requirements and delegated production' },
      { date: 'November', kind: 'project', title: 'GPS 4 GPS', description: 'UX subject-matter expert' },
      { date: 'October', kind: 'milestone', title: 'Onboarding Chair' },
      { date: 'September', kind: 'project', title: 'EMMA proposal', description: 'UX / UI lead for an animated executive presentation' },
      { date: 'September', kind: 'milestone', title: 'TFP Instructor' },
      { date: 'August', kind: 'project', title: 'NextGen 3.0', description: 'UX / UI lead for prototype animation and junior-team delegation' },
      { date: 'June', kind: 'project', title: 'ARC visual design', description: 'Developed brand, voice, and visual language' },
      { date: 'May', kind: 'project', title: 'LA geographic expansion', description: 'Led a data-visualization lane and developed a Tableau analytical dashboard' },
      { date: 'May', kind: 'project', title: 'USPS PA / Covalence', description: 'Led network data visualization and database development' },
      { date: 'April', kind: 'milestone', title: 'Won Fulbright Fellowship', description: 'Aviation Academy of Poland English for UX and aviation interface', url: 'https://patrickszot.webflow.io/journal/fulbright-fellowship' },
      { date: 'March', kind: 'project', title: 'FDIC E.I.', description: 'Led UX research, executive interviews, and a product-visioning session' },
      { date: 'February', kind: 'project', title: 'Deloitte University', description: 'Led a team through technical simulation' },
      { date: 'February', kind: 'milestone', title: 'Accepted an offer at Deloitte Digital' },
      { date: 'January', kind: 'project', title: 'Facebook IQ', description: 'Subcontracted to lead research in Bangkok, Johannesburg, and São Paulo' },
      { date: 'January', kind: 'project', title: 'D3 Systems, Inc.', description: 'Led product development, international research, and a contract team' }
    ]
  },
  {
    year: '2017',
    entries: [
      { date: 'October 21', kind: 'writing', title: 'Winning Gilman Scholarship Essay', url: 'https://patrickszot.webflow.io/journal/redux', description: 'The essay behind a Gilman Scholarship' },
      { date: 'May', kind: 'milestone', title: 'B.S. Finance Degree, Design Minor', description: 'Graduated George Mason University, right outside Washington D.C. with dual degree' },
      { date: 'January 29', kind: 'project', title: 'Studio Project Trophy Decks', url: 'https://dribbble.com/shots/20509321-Studio-Project-Trophy-Decks', cover: 'https://cdn.dribbble.com/userupload/4444309/file/still-5c624d0ba182a5c2b957d0687db23250.gif?format=webp&resize=800x600&vertical=center' },
      { date: 'January 29', kind: 'project', title: 'UI Design – Deloitte Digital Internal Directory', url: 'https://dribbble.com/shots/20509299-UI-Design-Deloitte-Digital-Internal-Directory', cover: 'https://cdn.dribbble.com/userupload/4444285/file/still-f19a182a7cdf6c8b4eb6ae0ec29f7693.gif?format=webp&resize=800x600&vertical=center' }
    ]
  },
  {
    year: '2016',
    entries: [
      { date: 'Early practice', kind: 'milestone', title: 'Independent design work', url: 'https://patrickszot.webflow.io/about', description: 'Freelance and subcontracted work while completing degrees in finance and design' },
      { date: 'Independent', kind: 'project', title: 'Rite of Spring', url: 'https://patrickszot.webflow.io/older-work/rite-of-spring', description: 'A self-published novel and visual system spanning a bound book and website' },
      { date: 'January', kind: 'milestone', title: 'Delta Sigma Pi Professional Fraternity', description: 'Marketing lead and professional mentor' }
    ]
  }
];

const visualAssetKeyByTitle = new Map(Object.entries({
  'Principal Brand Designer at AirOps': 'airops',
  'GlossAI Rebrand': 'gloss-ai',
  'Album Art: Presage 2022': 'album-art-presage',
  'Webflow Rebrand': 'webflow-rebrand',
  'Webflow customer Stories': 'webflow-customer-stories',
  'Webflow OOH SF Campaign': 'webflow-ooh-sf-campaign',
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
  'CIA.gov rebrand': 'blackbriar',
  'Lilly Pulitzer Virtual Runway': 'lilly-pulitzer',
  'Rite of Spring': 'rite-of-spring',
  'TOREI (トレイ)': 'torei',
  'Looking Glass EP': 'looking-glass'
}));

// These projects are represented by the primary/secondary overview accordions.
// Keep their timeline records, but do not duplicate their media in the timeline viewer.
const overviewOnlyAssetKeys = new Set(['airops', 'gloss-ai', 'webflow-rebrand']);

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
      if (overviewOnlyAssetKeys.has(entry.assetKey)) {
        placedKeys.add(entry.assetKey);
        entry.assetKey = undefined;
        return true;
      }
      const project = visualManifestData.projects[entry.assetKey];
      if (!project) return false;
      if (placedKeys.has(entry.assetKey)) {
        // Explicit timeline records may intentionally share one curated asset set.
        // Keep the later record in its authored year while preserving viewer access.
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
      description: project.description,
      url: project.url,
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
const viewportControlsHint = document.querySelector('.viewport-controls-hint');
const historyFilter = document.querySelector('#history-filter');
const historyFilterTrigger = document.querySelector('#history-filter-trigger');
const historyFilterMenu = document.querySelector('#history-filter-menu');
const ndaDialog = document.querySelector('#nda-dialog');
const ndaDialogCancel = ndaDialog.querySelector('.nda-dialog-cancel');
const ndaDialogConfirm = ndaDialog.querySelector('.nda-dialog-confirm');
const coarsePointer = window.matchMedia('(max-width: 700px), (pointer: coarse)');
let pendingInternalToolUrl = '';

document.querySelectorAll('[data-internal-tool]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    pendingInternalToolUrl = link.href;
    ndaDialog.showModal();
  });
});

ndaDialogCancel.addEventListener('click', () => ndaDialog.close());
ndaDialog.addEventListener('click', (event) => {
  if (event.target === ndaDialog) ndaDialog.close();
});
ndaDialog.addEventListener('close', () => {
  if (ndaDialog.returnValue !== 'confirmed') pendingInternalToolUrl = '';
  ndaDialog.returnValue = '';
});
ndaDialogConfirm.addEventListener('click', () => {
  const destination = pendingInternalToolUrl;
  ndaDialog.returnValue = 'confirmed';
  ndaDialog.close();
  pendingInternalToolUrl = '';
  if (!destination) return;
  const opened = window.open(destination, '_blank', 'noopener,noreferrer');
  if (!opened) window.location.assign(destination);
});

let driftTarget = window.scrollY;
let driftFrame;
let driftAnimating = false;
let driftVelocity = 0;
let driftLastTime = performance.now();

const maxScrollY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
const clampScrollY = (value) => Math.min(maxScrollY(), Math.max(0, value));
const isAtScrollEnd = () => {
  const tolerance = coarsePointer.matches
    ? Math.max(120, window.innerHeight * .18)
    : Math.max(4, window.innerHeight * .012);
  return maxScrollY() - window.scrollY <= tolerance;
};
let scrollRevealLocked = false;
let scrollRevealTimer;
let scrollRevealPressure = 0;
let scrollRevealPressureTimer;
let scrollRevealPressureTarget;
let timelineRevealTimer;

const nextScrollRevealTarget = () => (
  overviewProjects.find((group) => !group.classList.contains('is-open'))
  || (!detailsGroup.classList.contains('is-open') ? detailsGroup : null)
);

const clearScrollRevealPressure = () => {
  window.clearTimeout(scrollRevealPressureTimer);
  if (scrollRevealPressureTarget) {
    scrollRevealPressureTarget.classList.remove('is-scroll-tension');
    [
      '--reveal-grow',
      '--reveal-width-grow',
      '--reveal-padding-grow',
      '--reveal-radius',
      '--reveal-shift',
      '--reveal-squeeze',
      '--reveal-color'
    ].forEach((property) => scrollRevealPressureTarget.style.removeProperty(property));
  }
  scrollRevealPressure = 0;
  scrollRevealPressureTarget = undefined;
};

const revealTimeline = () => {
  if (detailsGroup.classList.contains('is-open') || timelineRevealTimer) return;
  if (reducedMotion.matches) {
    detailsTrigger.click();
    return;
  }
  detailsGroup.classList.add('is-reveal-priming');
  document.body.classList.add('timeline-reveal-priming');
  timelineRevealTimer = window.setTimeout(() => {
    timelineRevealTimer = undefined;
    detailsGroup.classList.remove('is-reveal-priming');
    document.body.classList.remove('timeline-reveal-priming');
    detailsTrigger.click();
  }, 680);
};

const advanceScrollReveal = () => {
  if (scrollRevealLocked) return false;

  const nextProject = overviewProjects.find((group) => !group.classList.contains('is-open'));
  if (nextProject) {
    revealOverviewProject(nextProject);
  } else if (!detailsGroup.classList.contains('is-open')) {
    revealTimeline();
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
  }, reducedMotion.matches ? 80 : 1480);
  return true;
};

const pressScrollReveal = (amount) => {
  if (scrollRevealLocked) return true;
  const target = nextScrollRevealTarget();
  if (!target) {
    clearScrollRevealPressure();
    return false;
  }

  if (scrollRevealPressureTarget !== target) {
    clearScrollRevealPressure();
    scrollRevealPressureTarget = target;
  }

  const isMobileReveal = coarsePointer.matches;
  // Mobile delivers one discrete swipe. Keep a clear moment of resistance,
  // while allowing a deliberate end-of-page gesture to complete the reveal.
  const threshold = isMobileReveal ? 72 : 190;
  scrollRevealPressure = Math.min(threshold, scrollRevealPressure + Math.max(0, amount));
  const pressure = scrollRevealPressure / threshold;
  target.classList.add('is-scroll-tension');
  target.style.setProperty('--reveal-grow', `${pressure * (isMobileReveal ? 6 : 10)}px`);
  target.style.setProperty('--reveal-width-grow', `${pressure * (isMobileReveal ? 12 : 20)}px`);
  target.style.setProperty('--reveal-padding-grow', `${pressure * (isMobileReveal ? 2 : 4)}px`);
  target.style.setProperty('--reveal-radius', `${30 - pressure * (isMobileReveal ? 7 : 12)}px`);
  target.style.setProperty('--reveal-shift', `${pressure * (isMobileReveal ? 4 : 7)}px`);
  target.style.setProperty('--reveal-squeeze', String(1 - pressure * (isMobileReveal ? .006 : .012)));
  target.style.setProperty('--reveal-color', `${pressure * 100}%`);

  window.clearTimeout(scrollRevealPressureTimer);
  scrollRevealPressureTimer = window.setTimeout(clearScrollRevealPressure, isMobileReveal ? 1100 : 720);
  if (scrollRevealPressure < threshold) return true;

  clearScrollRevealPressure();
  return advanceScrollReveal();
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
  if (event.ctrlKey) return;
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
  const impulse = event.deltaY * unit;
  if (impulse > 0 && isAtScrollEnd() && pressScrollReveal(Math.min(72, impulse))) {
    event.preventDefault();
    cancelDrift();
    return;
  }
  if (impulse < 0 || !isAtScrollEnd()) clearScrollRevealPressure();
  if (coarsePointer.matches || reducedMotion.matches) return;
  event.preventDefault();
  driftVelocity += Math.max(-420, Math.min(420, impulse * .72));
  driftTo(driftTarget + impulse * .34);
}, { passive: false });

let scrollRevealTouchStartY;
const mobilePageScrollResponse = 1;
const mobileArticleScrollResponse = .94;
window.addEventListener('touchstart', (event) => {
  cancelDrift();
  if (event.target.closest?.('.content-well')) {
    scrollRevealTouchStartY = undefined;
    return;
  }
  scrollRevealTouchStartY = event.touches.length === 1
    ? event.touches[0].clientY
    : undefined;
}, { passive: true });

window.addEventListener('touchend', (event) => {
  if (scrollRevealTouchStartY === undefined || !event.changedTouches.length) return;
  const upwardTravel = scrollRevealTouchStartY - event.changedTouches[0].clientY;
  scrollRevealTouchStartY = undefined;
  if (upwardTravel > 18 && isAtScrollEnd()) {
    pressScrollReveal(Math.min(110, upwardTravel * 1.15));
  }
}, { passive: true });

window.addEventListener('touchcancel', () => {
  scrollRevealTouchStartY = undefined;
}, { passive: true });

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
    if (distance > 0 && isAtScrollEnd() && pressScrollReveal(Math.min(96, distance))) return;
    driftTo(driftTarget + distance);
  }
});

window.addEventListener('resize', () => { driftTarget = clampScrollY(driftTarget); });
const updateBackToTopVisibility = () => {
  const timelineActive = document.body.classList.contains('details-open')
    && !document.body.classList.contains('details-opening')
    && !document.body.classList.contains('details-closing');
  backToTop.classList.toggle('is-visible', timelineActive && window.scrollY > window.innerHeight * .65);
};

backToTop.addEventListener('click', () => driftTo(0));
updateBackToTopVisibility();

const metadataTitleCase = (value) => value.replace(/\b([a-z])([a-z]*)/g, (_, first, rest) => `${first.toUpperCase()}${rest.toLowerCase()}`);
const historyMinorWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into', 'nor', 'of', 'on', 'or', 'over', 'per', 'the', 'to', 'up', 'via', 'vs', 'with']);
const historyTitleCase = (value) => {
  const words = value.trim().split(/\s+/);
  return words.map((word, index) => {
    const match = word.match(/[A-Za-z0-9][A-Za-z0-9.'’/–—-]*/);
    if (!match) return word;
    const token = match[0];
    const isBrandOrAcronym = /[a-z][A-Z]/.test(token) || /^[A-Z0-9][A-Z0-9./–—-]*$/.test(token) || token.includes('.');
    if (isBrandOrAcronym) return word;
    const lower = token.toLowerCase();
    const followsDivider = index > 0 && /[:–—]$/.test(words[index - 1]);
    const cased = historyMinorWords.has(lower) && index > 0 && index < words.length - 1 && !followsDivider
      ? lower
      : lower.replace(/(^|[-–—/])([a-z])/g, (_, divider, letter) => `${divider}${letter.toUpperCase()}`);
    return `${word.slice(0, match.index)}${cased}${word.slice(match.index + token.length)}`;
  }).join(' ');
};
const displayEntryTitle = (entry) => historyTitleCase(entry.title);

const entryMarkup = (entry) => {
  const displayTitle = displayEntryTitle(entry);
  const supportingCopy = entry.supportingLink
    ? `<a href="${entry.supportingLink.url}" target="_blank" rel="noopener noreferrer">${entry.supportingLink.label} <i class="ri-external-link-fill" aria-hidden="true"></i></a>`
    : entry.description || '';
  const assetCount = entry.kind === 'project' && entry.assetKey
    ? '<span class="timeline-asset-count" hidden></span>'
    : '';
  const linkedTitle = entry.kind === 'project' && entry.assetKey
    ? `<button class="project-title-trigger content-well-trigger" type="button" tabindex="-1" aria-label="Browse ${displayTitle} media" aria-controls="content-well">${displayTitle}</button>`
    : entry.kind === 'writing' && entry.url
      ? `<button class="project-title-trigger writing-title-trigger content-well-trigger" type="button" tabindex="-1" aria-label="Read ${displayTitle}" aria-controls="content-well">${displayTitle}</button>`
      : displayTitle;
  const marker = entry.kind === 'project' && entry.assetKey
    ? `<button class="timeline-marker project-expand-trigger content-well-trigger" type="button" tabindex="-1" aria-label="Browse ${entry.title} media" aria-controls="content-well"></button>`
    : entry.kind === 'writing' && entry.url
      ? `<button class="timeline-marker writing-expand-trigger content-well-trigger" type="button" tabindex="-1" aria-label="Read ${entry.title}" aria-controls="content-well"></button>`
      : `<span class="timeline-marker${entry.kind === 'milestone' || (entry.kind === 'project' && !entry.url) ? ' is-muted' : ''}" aria-hidden="true"></span>`;
  return `
    <article class="timeline-entry" data-kind="${entry.kind}">
      ${marker}
      <div class="project-info" aria-label="Project info">
        <div class="project-info-meta"><time>${metadataTitleCase(entry.date)}</time><span aria-hidden="true">•</span><span class="project-info-type">${metadataTitleCase(entry.kind)}${assetCount}</span></div>
        <h3 class="project-info-title">${linkedTitle}</h3>
        ${supportingCopy ? `<p class="project-info-body">${supportingCopy}</p>` : ''}
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
timelineEntries.forEach((element, index) => {
  element.entryData = timelineRecords[index];
  element.style.setProperty('--entry-delay', `${Math.min(index, 8) * 42}ms`);
});
const historyFilterOrder = ['project', 'writing', 'milestone', 'work'];
const historyFilterCounts = new Map();
timelineRecords.forEach((entry) => historyFilterCounts.set(entry.kind, (historyFilterCounts.get(entry.kind) || 0) + 1));
const historyFilterTags = historyFilterOrder.filter((tag) => historyFilterCounts.has(tag));
historyFilterMenu.innerHTML = [
  { tag: 'all', label: 'All', count: timelineRecords.length },
  ...historyFilterTags.map((tag) => ({ tag, label: metadataTitleCase(tag), count: historyFilterCounts.get(tag) }))
].map(({ tag, label, count }) => `
  <button class="history-filter-option" type="button" role="radio" aria-checked="${tag === 'all'}" data-history-filter="${tag}">
    <i class="ri-check-line history-filter-option-check" aria-hidden="true"></i>
    <span>${label}</span>
    <span class="history-filter-option-count" aria-hidden="true">${count}</span>
  </button>`).join('');
const fixedPreviewSourceFor = (entry) => {
  if (!entry) return visualPreviewByKey.airops;
  return visualPreviewByKey[entry.assetKey] || entry.cover;
};
detailsTrigger.addEventListener('click', () => {
  window.clearTimeout(detailsCloseTimer);
  window.clearTimeout(timelineRevealTimer);
  timelineRevealTimer = undefined;
  detailsGroup.classList.remove('is-scroll-tension', 'is-reveal-priming');
  document.body.classList.remove('timeline-reveal-priming');
  clearScrollRevealPressure();
  const open = !detailsGroup.classList.contains('is-open');
  if (!open) setHistoryFilterMenuOpen(false);
  detailsTrigger.setAttribute('aria-expanded', String(open));
  detailsTrigger.setAttribute('aria-label', open ? 'Close history' : 'Open history');

  if (open) {
    clearTimelineActive();
    positionContentWell();
    setPreviewVisibility(false);
    document.body.classList.remove('details-closing');
    timeline.querySelectorAll('.is-exiting').forEach((element) => {
      element.classList.remove('is-exiting');
      element.style.removeProperty('--close-delay');
    });
    document.body.classList.add('details-open');
    document.body.classList.add('details-opening');
    timelinePanel.hidden = false;
    timelinePanel.inert = false;
    invalidateTimelineGeometry();
    requestAnimationFrame(() => {
      detailsGroup.classList.add('is-open');
    });
    detailsCloseTimer = window.setTimeout(() => {
      document.body.classList.remove('details-opening');
      requestTimelineActiveUpdate();
      updateBackToTopVisibility();
    }, openDuration());
    return;
  }

  detailsGroup.classList.remove('is-open');
  document.body.classList.remove('details-opening');
  document.body.classList.remove('present-focus');
  document.body.classList.add('details-closing');
  updateBackToTopVisibility();
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
    updateBackToTopVisibility();
    timeline.querySelectorAll('.is-exiting').forEach((element) => {
      element.classList.remove('is-exiting');
      element.style.removeProperty('--close-delay');
    });
  }, closeDuration());
});

let activeTimelineEntry;
let activeTimelineIndex = -1;
let activeTimelineFrame;
let timelineDistanceStateIndex = Number.NaN;
let timelineFocusGeneration = 0;
let timelineGeometry = {
  valid: false,
  sceneTop: 0,
  firstCenter: 0,
  footerStart: Number.POSITIVE_INFINITY,
  maximumScrollTop: Number.POSITIVE_INFINITY,
  entryCenters: [],
  entryTops: [],
  entryHeights: [],
  entries: []
};
let previousScrollY = window.scrollY;
let previousScrollTime = performance.now();
let timelineScrollDirection = 0;
let timelineScrollVelocity = 0;
let timelineFooterFocusActive = false;
const contentWell = document.querySelector('#content-well');
const contentWellAnchor = document.querySelector('#content-well-anchor');
const contentWellBillboard = contentWellAnchor.querySelector('.content-well-billboard');
const contentWellScroll = contentWell.querySelector('.content-well-scroll');
const contentWellFullscreen = contentWell.querySelector('.content-well-fullscreen');
const contentWellControls = contentWell.querySelector('.content-well-controls');
const contentWellPrevious = contentWell.querySelector('.content-well-previous');
const contentWellNext = contentWell.querySelector('.content-well-next');
const contentWellAutoplay = contentWell.querySelector('.content-well-autoplay');
const contentWellTimer = contentWell.querySelector('.content-well-timer');
const contentWellCount = contentWell.querySelector('.content-well-count');
const contentWellStatus = contentWell.querySelector('.content-well-status');
const viewportControls = document.querySelector('.viewport-controls');
const timelineFooterAnchor = document.querySelector('.timeline-footer-anchor');
const profileTitleSource = document.querySelector('[data-profile-title]');
const profileTitleMirrors = document.querySelectorAll('[data-profile-title-mirror]');
const emailCopyButtons = [...document.querySelectorAll('[data-email-copy]')];
const emailCopyStatus = document.querySelector('.timeline-email-copy-status');
const emailCopyTimers = new WeakMap();
let emailCopyStatusTimer;
let renderContentWell = () => {};
let contentWellFullscreenOpen = false;
let contentWellDefaultWidth = 0;
let writingScrollFrame;
let contentAutoplayFrame;
let contentAutoplayLastTime = 0;
let contentAutoplayElapsed = 0;
let writingAutoplayPosition = 0;
let contentAutoplayUserPaused = false;
let contentAutoplayHoverPaused = false;
let contentAutoplayHoldUntil = 0;
let writingProgressDragging = false;
let timelineFocusAnimations = [];
let contentWellFocusAnimations = [];
let contentWellAssetAnimations = [];
const defaultVisualAutoplayDuration = 4000;
let activeVisualAutoplayDuration = defaultVisualAutoplayDuration;
const writingAutoplaySpeed = 14;
const hoverPauseEnabled = window.matchMedia('(min-width: 701px) and (hover: hover) and (pointer: fine)');

const syncProfileTitle = () => {
  const title = profileTitleSource?.textContent.trim() || '';
  profileTitleMirrors.forEach((mirror) => { mirror.textContent = title; });
};

syncProfileTitle();
if (profileTitleSource) {
  new MutationObserver(syncProfileTitle).observe(profileTitleSource, {
    childList: true,
    characterData: true,
    subtree: true
  });
}

const writeClipboardText = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const helper = document.createElement('textarea');
    helper.value = value;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.append(helper);
    helper.select();
    const copied = document.execCommand('copy');
    helper.remove();
    return copied;
  }
};

emailCopyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const email = button.dataset.email;
    const icon = button.querySelector('i');
    const copied = await writeClipboardText(email);

    clearTimeout(emailCopyTimers.get(button));
    clearTimeout(emailCopyStatusTimer);
    if (!copied) {
      emailCopyStatus.textContent = 'Unable to copy email.';
      return;
    }

    button.classList.add('is-copied');
    button.setAttribute('aria-label', `${email} copied to clipboard`);
    icon.className = 'ri-check-line';
    emailCopyStatus.textContent = 'Email copied to clipboard.';

    const timer = window.setTimeout(() => {
      button.classList.remove('is-copied');
      button.setAttribute('aria-label', `Copy ${email} to clipboard`);
      icon.className = 'ri-file-copy-line';
    }, 1600);
    emailCopyTimers.set(button, timer);
    emailCopyStatusTimer = window.setTimeout(() => { emailCopyStatus.textContent = ''; }, 1600);
  });
});
const animatedDurationCache = new Map();

const syncMobileBackToTopHost = () => {
  const dockInContentControls = coarsePointer.matches
    && contentWell.classList.contains('is-visible')
    && !contentWellControls.hidden;
  const target = dockInContentControls ? contentWellControls : viewportControls;
  if (backToTop.parentElement === target) return;
  if (dockInContentControls) target.prepend(backToTop);
  else target.append(backToTop);
};

const currentContentWellAspect = () => {
  const aspect = Number(contentWell.dataset.assetAspect);
  return Number.isFinite(aspect) && aspect > 0 ? aspect : 16 / 9;
};

const updateContentWellFullscreenGeometry = () => {
  if (!contentWellFullscreenOpen) return;
  if (contentWell.dataset.kind === 'writing') {
    const width = Math.min(contentWellDefaultWidth || 600, window.innerWidth - 40);
    contentWellAnchor.style.setProperty('--fullscreen-width', `${Math.max(280, width)}px`);
    return;
  }
  const aspect = currentContentWellAspect();
  const maxWidth = window.innerWidth * .75;
  const maxMediaHeight = Math.max(180, window.innerHeight - 120);
  const width = Math.min(maxWidth, maxMediaHeight * aspect);
  contentWellAnchor.style.setProperty('--fullscreen-width', `${Math.max(1, width)}px`);
};

const animateContentWellMode = (opening) => {
  if (reducedMotion.matches) return;
  contentWellBillboard.animate(
    opening
      ? [{ opacity: .12, transform: 'translate3d(0, 8px, 0) scale(.97)' }, { opacity: 1, transform: 'none' }]
      : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translate3d(0, 5px, 0) scale(.985)' }],
    { duration: opening ? 560 : 280, easing: 'cubic-bezier(.22, 1, .36, 1)' }
  );
};

const cancelAnimations = (animations) => {
  animations.forEach((animation) => animation.cancel());
  animations.length = 0;
};

const animateTimelineFocus = (entry, direction, previousEntry) => {
  const generation = ++timelineFocusGeneration;
  cancelAnimations(timelineFocusAnimations);
  timeline.querySelectorAll('.is-focus-exiting').forEach((item) => item.classList.remove('is-focus-exiting'));
  const offset = (direction || 1) * 7;
  const reduce = reducedMotion.matches;

  if (previousEntry && previousEntry !== entry) {
    previousEntry.classList.add('is-focus-exiting');
    const outgoingBody = previousEntry.querySelector('.project-info-body');
    const outgoingAnimations = outgoingBody ? [outgoingBody].map((target) => {
      const keyframes = reduce
        ? [{ opacity: 1 }, { opacity: 0 }]
        : [
            { opacity: 1, transform: 'translate3d(0, 0, 0)' },
            { opacity: 0, transform: `translate3d(0, ${offset * -.65}px, 0)` }
          ];
      const animation = target.animate(keyframes, {
        duration: reduce ? 90 : 260,
        easing: reduce ? 'ease-out' : 'cubic-bezier(.4, 0, .2, 1)',
        fill: 'both'
      });
      timelineFocusAnimations.push(animation);
      return animation;
    }) : [];
    Promise.allSettled(outgoingAnimations.map((animation) => animation.finished)).then(() => {
      if (generation !== timelineFocusGeneration) return;
      previousEntry.classList.remove('is-focus-exiting');
      outgoingAnimations.forEach((animation) => animation.cancel());
    });
  }

  const targets = [
    { target: entry.querySelector('.project-info-meta'), opacity: .72, moves: false },
    { target: entry.querySelector('h3'), opacity: .56, moves: false },
    { target: entry.querySelector('.project-info-body'), opacity: 0, moves: true }
  ].filter(({ target }) => target);

  targets.forEach(({ target, opacity, moves }, index) => {
    const keyframes = reduce
      ? [{ opacity }, { opacity: 1 }]
      : moves
        ? [
            { opacity, transform: `translate3d(0, ${offset}px, 0)` },
            { opacity: 1, transform: 'translate3d(0, 0, 0)' }
          ]
        : [{ opacity }, { opacity: 1 }];
    const animation = target.animate(keyframes, {
      duration: reduce ? 140 : 500,
      delay: reduce ? 0 : index * 38,
      easing: reduce ? 'ease-out' : 'cubic-bezier(.22, 1, .36, 1)'
    });
    timelineFocusAnimations.push(animation);
  });
};

const animateContentWellFocus = (direction) => {
  if (!direction || !contentWell.classList.contains('has-content')) return;
  cancelAnimations(contentWellFocusAnimations);
  const offset = direction * 9;
  const reduce = reducedMotion.matches;
  const targets = [
    contentWell.dataset.kind === 'writing' ? contentWellScroll : undefined,
    contentWellControls,
    contentWellFullscreen
  ].filter((target) => target && !target.hidden);

  targets.forEach((target, index) => {
    const keyframes = reduce
      ? [{ opacity: .35 }, { opacity: 1 }]
      : [
          { opacity: index === 0 ? .4 : .62, transform: `translate3d(0, ${index === 0 ? offset : offset * .4}px, 0)` },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' }
        ];
    const animation = target.animate(keyframes, {
      duration: reduce ? 140 : 660,
      delay: reduce ? 0 : 120 + index * 46,
      easing: reduce ? 'ease-out' : 'cubic-bezier(.22, 1, .36, 1)'
    });
    contentWellFocusAnimations.push(animation);
  });
};

const setContentWellFullscreen = (open) => {
  if (open === contentWellFullscreenOpen) return;
  if (open) {
    const rect = contentWellAnchor.getBoundingClientRect();
    contentWellDefaultWidth = rect.width;
    contentWellAnchor.style.setProperty('--fullscreen-left', `${Math.max(16, rect.left)}px`);
    contentWellAnchor.style.setProperty('--fullscreen-bottom', '24px');
  }
  contentWellFullscreenOpen = open;
  if (open) {
    contentWellAnchor.classList.add('is-fullscreen');
    document.body.append(contentWellAnchor);
    updateContentWellFullscreenGeometry();
  } else {
    animateContentWellMode(false);
    contentWellAnchor.classList.remove('is-fullscreen');
    contentWellAnchor.style.removeProperty('--fullscreen-width');
    contentWellAnchor.style.removeProperty('--fullscreen-left');
    contentWellAnchor.style.removeProperty('--fullscreen-bottom');
    syncContentWellHost();
  }
  document.body.classList.toggle('content-well-fullscreen-open', open);
  contentWellFullscreen.setAttribute('aria-pressed', String(open));
  contentWellFullscreen.setAttribute('aria-label', open ? 'Close fullscreen preview' : 'Open preview fullscreen');
  contentWellFullscreen.querySelector('i').className = open ? 'ri-collapse-diagonal-line' : 'ri-expand-diagonal-line';
  if (open) requestAnimationFrame(() => animateContentWellMode(true));
};

const setPreviewVisibility = (visible) => {
  const hasContent = contentWell.classList.contains('has-content');
  const show = visible && hasContent;
  contentWell.classList.toggle('is-visible', show);
  document.body.classList.toggle('content-well-visible', show);
  contentWell.setAttribute('aria-hidden', String(!show));
  contentWellAnchor.setAttribute('aria-hidden', String(!show));
  syncMobileBackToTopHost();
  if (!show) document.documentElement.style.removeProperty('--mobile-content-well-height');
  if (!show && contentWellFullscreenOpen) setContentWellFullscreen(false);
  if (!show) {
    stopContentAutoplay();
    contentWellScroll.querySelectorAll('video').forEach((video) => video.pause());
  } else {
    startContentAutoplay(false);
    requestAnimationFrame(constrainContentWellToViewport);
  }
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

const visibleTimelineEntries = () => timelineEntries.filter((entry) => !entry.hidden);

const positionContentWell = (entryElement, entryIndex = activeTimelineIndex) => {
  const firstEntry = timelineGeometry.valid
    ? timelineGeometry.entries[0]
    : visibleTimelineEntries()[0];
  let top;
  if (entryElement) {
    if (!timelineGeometry.valid) rebuildTimelineGeometry();
    top = timelineGeometry.entryTops[entryIndex] ?? offsetTopWithin(entryElement, timelineScene);
    if (coarsePointer.matches) top += (timelineGeometry.entryHeights[entryIndex] ?? entryElement.offsetHeight) + 24;
  } else {
    const firstTop = firstEntry ? offsetTopWithin(firstEntry, timelineScene) : 400;
    top = coarsePointer.matches
      ? Math.max(180, firstTop + 24)
      : Math.max(160, firstTop - 280);
  }
  contentWellAnchor.style.setProperty('--content-well-lift', '0px');
  contentWellAnchor.style.top = `${Math.round(top)}px`;
  requestAnimationFrame(constrainContentWellToViewport);
};

const constrainContentWellToViewport = () => {
  if (contentWellFullscreenOpen || !contentWell.classList.contains('has-content')) return;
  const bottomInset = coarsePointer.matches ? 20 : 24;
  const currentLift = Number.parseFloat(contentWellAnchor.style.getPropertyValue('--content-well-lift')) || 0;
  const naturalBottom = contentWell.getBoundingClientRect().bottom - currentLift;
  // All preview formats share one lower viewport baseline. Resolving the
  // offset in both directions keeps short embeds from floating upward while
  // allowing taller writing and visual assets to grow toward the top.
  const lift = window.innerHeight - bottomInset - naturalBottom;
  contentWellAnchor.style.setProperty('--content-well-lift', `${lift}px`);
  if (coarsePointer.matches && contentWell.classList.contains('is-visible')) {
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--mobile-content-well-height', `${contentWellAnchor.getBoundingClientRect().height}px`);
    });
  }
};

contentWellAnchor.addEventListener('transitionend', (event) => {
  if (event.target === contentWellAnchor && event.propertyName === 'top') {
    constrainContentWellToViewport();
  }
});

const clearTimelineActive = () => {
  timelineFocusGeneration += 1;
  cancelAnimations(timelineFocusAnimations);
  timeline.querySelectorAll('.is-focus-exiting').forEach((entry) => entry.classList.remove('is-focus-exiting'));
  activeTimelineEntry?.classList.remove('is-active');
  activeTimelineEntry?.querySelectorAll('.content-well-trigger').forEach((control) => control.setAttribute('tabindex', '-1'));
  activeTimelineEntry = undefined;
  activeTimelineIndex = -1;
  timeline.classList.remove('has-active');
};

const updateTimelineDistanceStates = (activeIndex) => {
  if (timelineDistanceStateIndex === activeIndex) return;
  timelineDistanceStateIndex = activeIndex;
  const visibleEntries = timelineGeometry.valid ? timelineGeometry.entries : visibleTimelineEntries();
  const visibleIndexes = new Map(visibleEntries.map((entry, index) => [entry, index]));
  timelineEntries.forEach((entry) => {
    const index = visibleIndexes.get(entry);
    entry.classList.toggle('is-deprioritized', index !== undefined && Math.abs(index - activeIndex) >= 2);
  });
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

const invalidateTimelineGeometry = () => { timelineGeometry.valid = false; };

const rebuildTimelineGeometry = () => {
  const entries = visibleTimelineEntries();
  if (!timelineScene || !entries.length) return;
  const sceneTop = untransformedDocumentCenter(timelineScene).y - timelineScene.offsetHeight / 2;
  const entryTops = entries.map((entry) => offsetTopWithin(entry, timelineScene));
  const entryHeights = entries.map((entry) => entry.offsetHeight);
  const entryCenters = entryTops.map((top, index) => top + entryHeights[index] / 2);
  const footerOffset = timelineFooterAnchor ? offsetTopWithin(timelineFooterAnchor, timelineScene) : Number.POSITIVE_INFINITY;
  const footerHeight = timelineFooterAnchor?.offsetHeight || 0;
  timelineGeometry = {
    valid: true,
    sceneTop,
    firstCenter: sceneTop + entryCenters[0],
    footerStart: sceneTop + footerOffset,
    maximumScrollTop: Number.isFinite(footerOffset)
      ? Math.max(0, sceneTop + footerOffset + footerHeight - window.innerHeight)
      : Number.POSITIVE_INFINITY,
    entryCenters,
    entryTops,
    entryHeights,
    entries
  };
};

const timelineEntryIndexForViewport = () => {
  if (!timelineGeometry.valid) rebuildTimelineGeometry();
  if (!timelineGeometry.entries.length) return -1;
  if (window.scrollY <= 48) return 0;

  const focusOffset = window.scrollY + window.innerHeight / 2 - timelineGeometry.sceneTop;
  const centers = timelineGeometry.entryCenters;
  let low = 0;
  let high = centers.length;
  while (low < high) {
    const middle = (low + high) >> 1;
    if (centers[middle] < focusOffset) low = middle + 1;
    else high = middle;
  }
  const upcomingIndex = low;
  if (upcomingIndex === 0) return 0;
  if (upcomingIndex === timelineGeometry.entries.length) return timelineGeometry.entries.length - 1;

  const previousCenter = centers[upcomingIndex - 1];
  const upcomingCenter = centers[upcomingIndex];
  const gap = upcomingCenter - previousCenter;
  const velocityBias = Math.min(.08, timelineScrollVelocity * .025);
  const directionalBias = timelineScrollDirection * gap * (.035 + velocityBias);
  const handoffPoint = previousCenter + gap / 2 - directionalBias;
  return focusOffset < handoffPoint ? upcomingIndex - 1 : upcomingIndex;
};

const updateTimelineActive = () => {
  activeTimelineFrame = undefined;
  if (!document.body.classList.contains('details-open') || document.body.classList.contains('details-opening') || document.body.classList.contains('details-closing') || timelinePanel.hidden) return;

  if (!timelineGeometry.valid) rebuildTimelineGeometry();
  const presentOwnsFocus = timelineGeometry.firstCenter - window.scrollY > window.innerHeight / 2;
  const footerOwnsFocus = window.scrollY >= timelineFooterFocusStart();
  const nextIndex = presentOwnsFocus || footerOwnsFocus ? -1 : timelineEntryIndexForViewport();
  const closest = nextIndex >= 0 ? timelineGeometry.entries[nextIndex] : undefined;

  document.body.classList.toggle('present-focus', presentOwnsFocus);
  document.body.classList.toggle('timeline-footer-focus', footerOwnsFocus);
  if (footerOwnsFocus !== timelineFooterFocusActive) {
    timelineFooterFocusActive = footerOwnsFocus;
    if (footerOwnsFocus) freezeSceneForFooterHandoff();
  }
  if (!closest) {
    clearTimelineActive();
    updateTimelineDistanceStates(-1);
    positionContentWell();
    setPreviewVisibility(false);
    return;
  }
  updateTimelineDistanceStates(nextIndex);
  if (nextIndex !== activeTimelineIndex) {
    const previousEntry = activeTimelineEntry;
    const previousIndex = activeTimelineIndex;
    const focusDirection = timelineScrollDirection || (previousIndex >= 0 ? Math.sign(nextIndex - previousIndex) : 1);
    activeTimelineEntry?.classList.remove('is-active');
    activeTimelineEntry?.querySelectorAll('.content-well-trigger').forEach((control) => control.setAttribute('tabindex', '-1'));
    activeTimelineEntry = closest;
    activeTimelineIndex = nextIndex;
    timeline.classList.add('has-active');
    activeTimelineEntry.classList.add('is-active');
    animateTimelineFocus(activeTimelineEntry, focusDirection, previousEntry);
    activeTimelineEntry.querySelectorAll('.content-well-trigger').forEach((control) => control.setAttribute('tabindex', '0'));
    positionContentWell(activeTimelineEntry, activeTimelineIndex);
    renderContentWell(activeTimelineEntry.entryData, focusDirection);
  }
};

const requestTimelineActiveUpdate = () => {
  if (activeTimelineFrame) return;
  activeTimelineFrame = requestAnimationFrame(updateTimelineActive);
};

let activeHistoryFilter = 'all';
let historyFilterCloseTimer;

const setHistoryFilterMenuOpen = (open, returnFocus = false) => {
  window.clearTimeout(historyFilterCloseTimer);
  historyFilterTrigger.setAttribute('aria-expanded', String(open));
  if (open) {
    historyFilterMenu.hidden = false;
    requestAnimationFrame(() => {
      historyFilterMenu.classList.add('is-open');
      historyFilterMenu.querySelector('[aria-checked="true"]')?.focus({ preventScroll: true });
    });
    return;
  }
  historyFilterMenu.classList.remove('is-open');
  historyFilterCloseTimer = window.setTimeout(() => { historyFilterMenu.hidden = true; }, reducedMotion.matches ? 0 : 240);
  if (returnFocus) historyFilterTrigger.focus({ preventScroll: true });
};

const syncHistoryFilterControls = () => {
  const activeLabel = activeHistoryFilter === 'all' ? 'All' : metadataTitleCase(activeHistoryFilter);
  historyFilter.classList.toggle('has-filter', activeHistoryFilter !== 'all');
  historyFilterTrigger.setAttribute('aria-label', `Filter history, ${activeLabel} selected`);
  historyFilterTrigger.querySelector('.history-filter-active-label').textContent = activeLabel;
  historyFilterMenu.querySelectorAll('[data-history-filter]').forEach((option) => {
    option.setAttribute('aria-checked', String(option.dataset.historyFilter === activeHistoryFilter));
  });
};

const applyHistoryFilter = async (filter) => {
  if (filter === activeHistoryFilter) {
    setHistoryFilterMenuOpen(false, true);
    return;
  }
  const previousEntry = activeTimelineEntry;
  const previousIndex = Math.max(0, timelineEntries.indexOf(previousEntry));
  timelinePanel.classList.add('is-filter-transitioning');
  setHistoryFilterMenuOpen(false);

  const exitAnimation = timeline.animate(
    [{ opacity: 1 }, { opacity: reducedMotion.matches ? 1 : .38 }],
    { duration: reducedMotion.matches ? 0 : 130, easing: 'ease-out', fill: 'both' }
  );
  await exitAnimation.finished.catch(() => {});

  activeHistoryFilter = filter;
  timelineEntries.forEach((entry) => {
    entry.hidden = filter !== 'all' && entry.dataset.kind !== filter;
  });
  timeline.querySelectorAll('.timeline-year').forEach((year) => {
    year.hidden = !year.querySelector('.timeline-entry:not([hidden])');
  });
  syncHistoryFilterControls();
  clearTimelineActive();
  setPreviewVisibility(false);
  timelineDistanceStateIndex = Number.NaN;
  invalidateTimelineGeometry();
  rebuildTimelineGeometry();

  const visibleEntries = timelineGeometry.entries;
  const targetEntry = previousEntry && !previousEntry.hidden
    ? previousEntry
    : visibleEntries.reduce((nearest, entry) => {
        if (!nearest) return entry;
        return Math.abs(timelineEntries.indexOf(entry) - previousIndex) < Math.abs(timelineEntries.indexOf(nearest) - previousIndex)
          ? entry
          : nearest;
      }, undefined);
  if (targetEntry) {
    const targetIndex = visibleEntries.indexOf(targetEntry);
    const targetTop = clampScrollY(
      timelineGeometry.sceneTop + timelineGeometry.entryCenters[targetIndex] - window.innerHeight / 2
    );
    window.scrollTo({ top: targetTop, left: window.scrollX, behavior: 'auto' });
    driftTarget = targetTop;
  }

  exitAnimation.cancel();
  const enterAnimation = timeline.animate(
    reducedMotion.matches
      ? [{ opacity: 1 }, { opacity: 1 }]
      : [{ opacity: .38, transform: 'translate3d(0, 5px, 0)' }, { opacity: 1, transform: 'translate3d(0, 0, 0)' }],
    { duration: reducedMotion.matches ? 0 : 320, easing: 'cubic-bezier(.22, 1, .36, 1)' }
  );
  await enterAnimation.finished.catch(() => {});
  timelinePanel.classList.remove('is-filter-transitioning');
  requestTimelineActiveUpdate();
};

historyFilterTrigger.addEventListener('click', () => {
  setHistoryFilterMenuOpen(historyFilterTrigger.getAttribute('aria-expanded') !== 'true');
});
historyFilterMenu.addEventListener('click', (event) => {
  const option = event.target.closest('[data-history-filter]');
  if (option) applyHistoryFilter(option.dataset.historyFilter);
});
historyFilterMenu.addEventListener('keydown', (event) => {
  if (!['ArrowUp', 'ArrowDown', 'Home', 'End', 'Escape'].includes(event.key)) return;
  event.preventDefault();
  if (event.key === 'Escape') {
    setHistoryFilterMenuOpen(false, true);
    return;
  }
  const options = [...historyFilterMenu.querySelectorAll('[data-history-filter]')];
  const currentIndex = Math.max(0, options.indexOf(document.activeElement));
  const nextIndex = event.key === 'Home'
    ? 0
    : event.key === 'End'
      ? options.length - 1
      : (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
  options[nextIndex].focus({ preventScroll: true });
});
document.addEventListener('pointerdown', (event) => {
  if (historyFilterTrigger.getAttribute('aria-expanded') === 'true' && !historyFilter.contains(event.target)) {
    setHistoryFilterMenuOpen(false);
  }
});
syncHistoryFilterControls();

const clampTimelineScrollEnd = () => {
  if (!document.body.classList.contains('details-open') || !timelineFooterAnchor) return false;
  if (!timelineGeometry.valid) rebuildTimelineGeometry();
  const maximumScrollTop = timelineGeometry.maximumScrollTop;
  if (window.scrollY <= maximumScrollTop + 1) return false;
  window.scrollTo({ top: maximumScrollTop, left: window.scrollX, behavior: 'auto' });
  return true;
};

window.addEventListener('resize', () => {
  invalidateTimelineGeometry();
  requestTimelineActiveUpdate();
});
document.fonts?.ready.then(() => {
  invalidateTimelineGeometry();
  requestTimelineActiveUpdate();
});

const timelineScene = timelinePanel.querySelector('.timeline-panel-inner');
const profile = document.querySelector('.profile');
const profileScenes = [...document.querySelectorAll('.profile-scene')];
const footerContactScene = document.querySelector('.footer-contact-scene');
const cameraBillboards = [...document.querySelectorAll([
  '.project-info',
  '.timeline-marker',
  '.profile-billboard',
  '.profile-anchor-marker',
  '.present-project-trigger',
  '.footer-contact-billboard',
  '.content-well-billboard'
].join(','))];
const timelineYearHeadings = [...timeline.querySelectorAll('.timeline-year-heading')];

const syncContentWellHost = () => {
  if (contentWellFullscreenOpen) return;
  if (coarsePointer.matches) {
    if (contentWellAnchor.parentElement !== document.body) document.body.append(contentWellAnchor);
    contentWellAnchor.style.removeProperty('top');
    return;
  }
  if (contentWellAnchor.parentElement !== timelineScene) timelineScene.prepend(contentWellAnchor);
  positionContentWell(activeTimelineEntry, activeTimelineIndex);
};

syncContentWellHost();
coarsePointer.addEventListener('change', () => {
  syncContentWellHost();
  syncMobileBackToTopHost();
});

const sceneInteractiveSelector = 'a, button, input, textarea, select, iframe, video, [contenteditable="true"]';
const orbitControlsEnabled = window.matchMedia('(min-width: 701px)');
const sceneLimits = { pitch: 82, yaw: 74 };
const sceneAngles = { pitch: 0, yaw: 0 };
const sceneZoomLimits = { min: .9, max: 1.1 };
const sceneZoom = { value: 1, target: 1 };
let sceneGesture;
let sceneRenderFrame;
let sceneZoomFrame;
let sceneGeometryFrame;
let sceneMotionGeneration = 0;
let sceneMotionFrame;
let sceneScrollFrame;
const sceneScroll = { y: 0, z: 0, velocityY: 0, velocityZ: 0, targetY: 0, targetZ: 0, lastTime: performance.now() };
let renderedScenePitch = Number.NaN;
let renderedSceneYaw = Number.NaN;

const clampScene = (value, limit) => Math.max(-limit, Math.min(limit, value));
const sceneIsRotated = () => Math.abs(sceneAngles.pitch) + Math.abs(sceneAngles.yaw) > 2.25;
const timelineFooterFocusStart = () => (
  timelineGeometry.footerStart + Math.min(180, window.innerHeight * .16)
);
const sceneFooterHandoffIsActive = () => (
  timelineFooterFocusActive
  || (
    timelineGeometry.valid
    && window.scrollY >= timelineFooterFocusStart()
  )
);
const sceneCanPinchZoom = () => (
  orbitControlsEnabled.matches
  && document.body.classList.contains('details-open')
  && sceneIsRotated()
);

const stopSceneMotion = () => {
  sceneMotionGeneration += 1;
  if (sceneMotionFrame) cancelAnimationFrame(sceneMotionFrame);
  sceneMotionFrame = undefined;
  timelinePanel.classList.remove('is-scene-settling');
};

const freezeSceneForFooterHandoff = () => {
  if (!sceneIsRotated()) return;
  stopSceneMotion();
  if (sceneZoomFrame) cancelAnimationFrame(sceneZoomFrame);
  sceneZoomFrame = undefined;
  sceneZoom.target = sceneZoom.value;
  if (sceneScrollFrame) cancelAnimationFrame(sceneScrollFrame);
  sceneScrollFrame = undefined;
  sceneScroll.targetY = sceneScroll.y;
  sceneScroll.targetZ = sceneScroll.z;
  sceneScroll.velocityY = 0;
  sceneScroll.velocityZ = 0;
  requestSceneRender();
};

const renderScene = () => {
  sceneRenderFrame = undefined;
  const forwardTransform = `translate3d(0, ${sceneScroll.y.toFixed(3)}px, ${sceneScroll.z.toFixed(3)}px) rotateY(${sceneAngles.yaw.toFixed(3)}deg) rotateX(${sceneAngles.pitch.toFixed(3)}deg) scale(${sceneZoom.value.toFixed(4)})`;
  timelineScene.style.transform = forwardTransform;
  profileScenes.forEach((element) => { element.style.transform = forwardTransform; });
  footerContactScene.style.transform = forwardTransform;

  const yearBillboardTransform = `rotateX(${(-sceneAngles.pitch).toFixed(3)}deg) rotateY(${(-sceneAngles.yaw).toFixed(3)}deg)`;
  timelineYearHeadings.forEach((heading) => {
    const stickyTop = Number.parseFloat(getComputedStyle(heading).top) || 0;
    const isStuck = heading.getBoundingClientRect().top <= stickyTop + 1;
    heading.classList.toggle('is-stuck', isStuck);
    heading.style.transform = isStuck
      ? `translate3d(0, ${(-sceneScroll.y).toFixed(3)}px, ${(-sceneScroll.z).toFixed(3)}px) ${yearBillboardTransform}`
      : yearBillboardTransform;
  });

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
    viewportControlsHint.textContent = oriented ? 'Rotate back to normal' : 'Click and drag to get a better view';
    renderedScenePitch = sceneAngles.pitch;
    renderedSceneYaw = sceneAngles.yaw;
  }
  requestAnimationFrame(constrainContentWellToViewport);
};

const requestSceneRender = () => {
  renderScene();
};

const setSceneZoomTarget = (target, immediate = false) => {
  sceneZoom.target = Math.max(sceneZoomLimits.min, Math.min(sceneZoomLimits.max, target));
  if (immediate || reducedMotion.matches) {
    if (sceneZoomFrame) cancelAnimationFrame(sceneZoomFrame);
    sceneZoomFrame = undefined;
    sceneZoom.value = sceneZoom.target;
    requestSceneRender();
    return;
  }
  if (sceneZoomFrame) return;
  const tick = () => {
    sceneZoom.value += (sceneZoom.target - sceneZoom.value) * .16;
    requestSceneRender();
    if (Math.abs(sceneZoom.target - sceneZoom.value) < .0002) {
      sceneZoom.value = sceneZoom.target;
      sceneZoomFrame = undefined;
      requestSceneRender();
      return;
    }
    sceneZoomFrame = requestAnimationFrame(tick);
  };
  sceneZoomFrame = requestAnimationFrame(tick);
};

const resetSceneZoom = (animate = true) => setSceneZoomTarget(1, !animate);

const refreshSceneGeometry = () => {
  sceneGeometryFrame = undefined;
  if (timelinePanel.hidden) return;
  // Once the end-material handoff begins, preserve the tilted scene's last
  // projection. Recomputing its viewport-relative transform origin while the
  // scene fades creates a visible pivot jump.
  if (sceneFooterHandoffIsActive() && sceneIsRotated()) return;
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
  // Both profile points share the timeline's exact 50vw axis. The CSS uses
  // this local coordinate for Current and Previous regardless of profile width.
  profile.style.setProperty('--profile-axis-x', `${window.innerWidth / 2 - profileLayoutLeft}px`);
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
  requestAnimationFrame(constrainContentWellToViewport);
};

const requestSceneGeometry = () => {
  if (!sceneGeometryFrame) sceneGeometryFrame = requestAnimationFrame(refreshSceneGeometry);
};

const setSceneAngles = (pitch, yaw) => {
  sceneAngles.pitch = clampScene(pitch, sceneLimits.pitch);
  sceneAngles.yaw = clampScene(yaw, sceneLimits.yaw);
  if (!sceneIsRotated() && sceneZoom.target !== 1) resetSceneZoom();
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
  resetSceneZoom(animate);
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

const contentWellControlAtPoint = (clientX, clientY) => {
  if (!contentWell.classList.contains('is-visible')) return null;
  return [...contentWell.querySelectorAll('button:not([disabled])')].find((button) => {
    if (!button.getClientRects().length || getComputedStyle(button).visibility === 'hidden') return false;
    const rect = button.getBoundingClientRect();
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  }) || null;
};

timelinePanel.addEventListener('pointerdown', (event) => {
  if (!orbitControlsEnabled.matches || !document.body.classList.contains('details-open') || event.button !== 0) return;
  if (event.target.closest(sceneInteractiveSelector)) return;
  const occludedControl = contentWellControlAtPoint(event.clientX, event.clientY);
  if (occludedControl) {
    event.preventDefault();
    event.stopPropagation();
    occludedControl.click();
    return;
  }
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
  const overContentControl = !sceneGesture && Boolean(contentWellControlAtPoint(event.clientX, event.clientY));
  timelinePanel.classList.toggle('is-over-content-control', overContentControl);
  if (overContentControl) return;
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

timelinePanel.addEventListener('wheel', (event) => {
  if (!event.ctrlKey || !sceneCanPinchZoom() || event.target.closest(sceneInteractiveSelector)) return;
  event.preventDefault();
  const zoomFactor = Math.exp(-event.deltaY * .006);
  setSceneZoomTarget(sceneZoom.target * zoomFactor);
}, { passive: false });

timelinePanel.addEventListener('pointerleave', () => {
  timelinePanel.classList.remove('is-over-content-control');
});

window.addEventListener('scroll', () => {
  if (!driftAnimating) driftTarget = window.scrollY;
  updateBackToTopVisibility();
  if (clampTimelineScrollEnd()) return;

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
  if (orbitControlsEnabled.matches) requestSceneGeometry();
}, { passive: true });
window.addEventListener('resize', requestSceneGeometry);
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (contentWellFullscreenOpen) setContentWellFullscreen(false);
  else if (timelinePanel.classList.contains('is-scene-oriented')) resetTimelineScene();
});
detailsTrigger.addEventListener('click', () => {
  if (detailsTrigger.getAttribute('aria-expanded') === 'false') resetTimelineScene(false);
  else {
    requestSceneGeometry();
  }
});

const projectManifest = Promise.resolve(visualManifestData);
const writingManifest = fetch('assets-writing/manifest.json?v=20260928-media-timed-content-well').then((response) => response.json());
const contentWellPositions = new Map();
let contentWellEntry;
let contentWellKey;
let contentWellGeneration = 0;
let contentWellFrame;
let contentWellMediaGeneration = 0;
let contentWellAssets = [];
let contentWellAssetIndex = 0;
let adjacentVisualPreload;
let adjacentVisualPreloadKey = '';

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
  if (unique.some((asset) => asset.type === 'apple')) {
    return unique.filter((asset) => asset.type === 'apple');
  }
  if (!previewSrc) return unique;
  const previewIdentity = assetIdentity({ src: previewSrc });
  const previewIndex = unique.findIndex((asset) => assetIdentity(asset) === previewIdentity);
  if (previewIndex > 0) unique.unshift(unique.splice(previewIndex, 1)[0]);
  return unique;
};

const embeddedMediaTypes = new Set(['apple', 'spotify', 'youtube']);
const youtubePlayerState = new WeakMap();

const sendYouTubeCommand = (frame, func, args = []) => {
  frame.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
};

const syncYouTubeMinimalControls = (frame, info = {}) => {
  const state = youtubePlayerState.get(frame);
  if (!state) return;
  if (Number.isFinite(info.duration) && info.duration > 0) state.duration = info.duration;
  if (Number.isFinite(info.currentTime)) state.currentTime = info.currentTime;
  if (Number.isFinite(info.playerState)) state.playing = info.playerState === 1;
  state.toggle.setAttribute('aria-label', state.playing ? 'Pause video' : 'Play video');
  state.toggle.querySelector('i').className = state.playing ? 'ri-pause-fill' : 'ri-play-fill';
  if (!state.scrubbing && state.duration > 0) {
    state.scrubber.value = String(Math.round((state.currentTime / state.duration) * 1000));
    state.scrubber.setAttribute('aria-valuetext', `${Math.round(state.currentTime)} of ${Math.round(state.duration)} seconds`);
  }
};

const attachYouTubeMinimalControls = (item, frame) => {
  if (item.querySelector('.content-well-youtube-controls')) return;
  const controls = document.createElement('div');
  controls.className = 'content-well-youtube-controls';
  const toggle = document.createElement('button');
  toggle.className = 'content-well-youtube-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Pause video');
  toggle.innerHTML = '<i class="ri-pause-fill" aria-hidden="true"></i>';
  const scrubber = document.createElement('input');
  scrubber.className = 'content-well-youtube-scrubber';
  scrubber.type = 'range';
  scrubber.min = '0';
  scrubber.max = '1000';
  scrubber.step = '1';
  scrubber.value = '0';
  scrubber.setAttribute('aria-label', 'Video timeline');
  const state = { controls, toggle, scrubber, playing: true, scrubbing: false, currentTime: 0, duration: 0 };
  youtubePlayerState.set(frame, state);
  toggle.addEventListener('click', () => sendYouTubeCommand(frame, state.playing ? 'pauseVideo' : 'playVideo'));
  scrubber.addEventListener('pointerdown', () => { state.scrubbing = true; });
  scrubber.addEventListener('input', () => {
    if (!state.duration) return;
    sendYouTubeCommand(frame, 'seekTo', [state.duration * Number(scrubber.value) / 1000, true]);
  });
  const finishScrubbing = () => { state.scrubbing = false; };
  scrubber.addEventListener('change', finishScrubbing);
  scrubber.addEventListener('pointerup', finishScrubbing);
  scrubber.addEventListener('pointercancel', finishScrubbing);
  controls.append(toggle, scrubber);
  item.append(controls);
  frame.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: `content-well-youtube-${Date.now()}` }), '*');
  sendYouTubeCommand(frame, 'getDuration');
  sendYouTubeCommand(frame, 'getCurrentTime');
};

window.addEventListener('message', (event) => {
  const frame = [...document.querySelectorAll('.content-well-youtube-frame')]
    .find((candidate) => candidate.contentWindow === event.source);
  if (!frame) return;
  let payload = event.data;
  if (typeof payload === 'string') {
    try { payload = JSON.parse(payload); } catch { return; }
  }
  if (!payload || typeof payload !== 'object') return;
  if (payload.event === 'onReady') {
    frame.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: 'content-well-youtube' }), '*');
    return;
  }
  if (payload.event === 'onStateChange') {
    syncYouTubeMinimalControls(frame, { playerState: Number(payload.info) });
    return;
  }
  if (payload.event === 'infoDelivery') syncYouTubeMinimalControls(frame, payload.info || {});
});

const createContentWellMedia = (asset, index) => {
  if (embeddedMediaTypes.has(asset.type)) {
    const frame = document.createElement('iframe');
    if (asset.type === 'youtube') {
      frame.dataset.embedSrc = asset.src;
      frame.className = 'content-well-youtube-frame';
      frame.tabIndex = -1;
    } else {
      frame.src = asset.src;
    }
    frame.title = asset.alt || `Project media ${index + 1}`;
    frame.loading = 'eager';
    frame.fetchPriority = 'high';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allow = asset.type === 'youtube'
      ? 'autoplay; encrypted-media; picture-in-picture'
      : 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    if (asset.type !== 'youtube') frame.setAttribute('allowfullscreen', '');
    return frame;
  }
  if (asset.type === 'video') {
    const video = document.createElement('video');
    video.src = asset.src;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
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

const disposeContentWellMedia = (scope = contentWellScroll) => {
  scope.querySelectorAll('video').forEach((video) => {
    video.pause();
    video.removeAttribute('src');
    video.load();
  });
  scope.querySelectorAll('iframe').forEach((frame) => frame.removeAttribute('src'));
};

const preloadAdjacentVisualAsset = (index) => {
  if (contentWellAssets.length < 2) return;
  const asset = contentWellAssets[(index + 1) % contentWellAssets.length];
  if (!asset || !['image', 'gif'].includes(asset.type)) return;
  const key = assetIdentity(asset);
  if (!key || key === adjacentVisualPreloadKey) return;
  if (adjacentVisualPreload) adjacentVisualPreload.src = '';
  const image = new Image();
  image.decoding = 'async';
  image.fetchPriority = 'low';
  image.src = asset.src;
  image.decode?.().catch(() => {});
  adjacentVisualPreload = image;
  adjacentVisualPreloadKey = key;
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
    // Embeds have stable manifest dimensions. Do not delay the viewer's own
    // transition while a third-party document finishes loading.
    return;
  }
};

const animatedMediaDuration = async (media, asset) => {
  if (media instanceof HTMLVideoElement && Number.isFinite(media.duration) && media.duration > 0) {
    return media.duration * 1000;
  }
  if (asset?.type !== 'gif') return defaultVisualAutoplayDuration;
  if (animatedDurationCache.has(asset.src)) return animatedDurationCache.get(asset.src);
  try {
    const response = await fetch(asset.src);
    const bytes = new Uint8Array(await response.arrayBuffer());
    let durationHundredths = 0;
    for (let index = 0; index < bytes.length - 6; index += 1) {
      if (bytes[index] === 0x21 && bytes[index + 1] === 0xf9 && bytes[index + 2] === 0x04) {
        durationHundredths += bytes[index + 4] | (bytes[index + 5] << 8);
      }
    }
    const durationMs = durationHundredths > 0 ? durationHundredths * 10 : defaultVisualAutoplayDuration;
    animatedDurationCache.set(asset.src, durationMs);
    return durationMs;
  } catch {
    return defaultVisualAutoplayDuration;
  }
};

const syncContentWellMediaAspect = (media, preservedControlsBottom, asset) => {
  let width = 16;
  let height = 9;
  if (media instanceof HTMLImageElement && media.naturalWidth && media.naturalHeight) {
    width = media.naturalWidth;
    height = media.naturalHeight;
  } else if (media instanceof HTMLVideoElement && media.videoWidth && media.videoHeight) {
    width = media.videoWidth;
    height = media.videoHeight;
  } else if (media instanceof HTMLIFrameElement && asset?.width && asset?.height) {
    width = asset.width;
    height = asset.height;
  }
  const aspect = width / height;
  const previousHeight = contentWellScroll.offsetHeight;
  const measuredWidth = contentWellScroll.offsetWidth;
  contentWell.dataset.assetAspect = String(aspect);
  contentWellScroll.style.setProperty('--content-aspect', `${width} / ${height}`);
  updateContentWellFullscreenGeometry();
  if (Number.isFinite(preservedControlsBottom) && measuredWidth > 0) {
    const nextHeight = measuredWidth / aspect;
    const currentLift = Number.parseFloat(contentWellAnchor.style.getPropertyValue('--content-well-lift')) || 0;
    contentWellAnchor.style.setProperty('--content-well-lift', `${currentLift + previousHeight - nextHeight}px`);
  } else {
    requestAnimationFrame(constrainContentWellToViewport);
  }
};

const setContentTimerProgress = (progress) => {
  contentWell.style.setProperty('--content-timer-progress', String(Math.max(0, Math.min(1, progress))));
};

const updateContentAutoplayControl = () => {
  const paused = contentAutoplayUserPaused;
  contentWellAutoplay.setAttribute('aria-pressed', String(paused));
  contentWellAutoplay.setAttribute('aria-label', paused ? 'Play automatic writing scroll' : 'Pause automatic writing scroll');
  contentWellAutoplay.querySelector('i').className = paused ? 'ri-play-line' : 'ri-pause-line';
};

const stopContentAutoplay = () => {
  if (contentAutoplayFrame) cancelAnimationFrame(contentAutoplayFrame);
  contentAutoplayFrame = undefined;
  contentAutoplayLastTime = 0;
};

const contentAutoplayTick = (now) => {
  contentAutoplayFrame = requestAnimationFrame(contentAutoplayTick);
  if (!contentWell.classList.contains('is-visible') || contentAutoplayUserPaused || contentAutoplayHoverPaused || writingProgressDragging || now < contentAutoplayHoldUntil) {
    contentAutoplayLastTime = now;
    return;
  }
  const delta = contentAutoplayLastTime ? Math.min(50, now - contentAutoplayLastTime) : 0;
  contentAutoplayLastTime = now;
  if (contentWell.dataset.kind === 'project') {
    if (contentWellAssets.length < 2 || !contentWell.classList.contains('is-ready')) return;
    if (embeddedMediaTypes.has(contentWellAssets[contentWellAssetIndex]?.type)) return;
    const video = contentWellScroll.querySelector('video');
    if (video && Number.isFinite(video.duration) && video.duration > 0) {
      setContentTimerProgress(video.currentTime / video.duration);
      if (video.ended || video.currentTime >= video.duration - .04) {
        showContentWellAsset(contentWellAssetIndex + 1, 1);
      }
      return;
    }
    contentAutoplayElapsed += delta;
    setContentTimerProgress(contentAutoplayElapsed / activeVisualAutoplayDuration);
    if (contentAutoplayElapsed >= activeVisualAutoplayDuration) {
      contentAutoplayElapsed = 0;
      setContentTimerProgress(0);
      showContentWellAsset(contentWellAssetIndex + 1, 1);
    }
    return;
  }
  const range = Math.max(0, contentWellScroll.scrollHeight - contentWellScroll.clientHeight);
  if (!range) {
    setContentTimerProgress(1);
    return;
  }
  writingAutoplayPosition = Math.min(range, writingAutoplayPosition + writingAutoplaySpeed * delta / 1000);
  contentWellScroll.scrollTop = writingAutoplayPosition;
  setContentTimerProgress(writingAutoplayPosition / range);
  if (writingAutoplayPosition >= range - 1) {
    contentAutoplayUserPaused = true;
    updateContentAutoplayControl();
  }
};

const startContentAutoplay = (reset = true) => {
  if (contentWell.dataset.kind === 'writing') writingAutoplayPosition = contentWellScroll.scrollTop;
  if (reset) {
    contentAutoplayElapsed = 0;
    setContentTimerProgress(contentWell.dataset.kind === 'writing'
      ? contentWellScroll.scrollTop / Math.max(1, contentWellScroll.scrollHeight - contentWellScroll.clientHeight)
      : 0);
  }
  contentAutoplayLastTime = 0;
  if (!contentAutoplayFrame && !reducedMotion.matches) contentAutoplayFrame = requestAnimationFrame(contentAutoplayTick);
};

const updateContentWellControls = () => {
  if (contentWell.dataset.kind === 'writing') {
    contentWell.classList.remove('is-single-asset');
    const range = Math.max(0, contentWellScroll.scrollHeight - contentWellScroll.clientHeight);
    contentWell.classList.toggle('has-no-scroll', range <= 1);
    const progress = range ? Math.max(0, Math.min(1, contentWellScroll.scrollTop / range)) : 1;
    contentWellControls.hidden = false;
    contentWellControls.setAttribute('aria-label', 'Writing navigation');
    contentWellPrevious.setAttribute('aria-label', 'Scroll writing up');
    contentWellNext.setAttribute('aria-label', 'Scroll writing down');
    contentWellPrevious.querySelector('i').className = 'ri-arrow-up-line';
    contentWellNext.querySelector('i').className = 'ri-arrow-down-line';
    contentWellPrevious.disabled = contentWellScroll.scrollTop <= 1;
    contentWellNext.disabled = range <= 1 || contentWellScroll.scrollTop >= range - 1;
    contentWellAutoplay.disabled = range <= 1;
    contentWellCount.textContent = `${Math.round(progress * 100)}%`;
    contentWellTimer.setAttribute('aria-hidden', 'false');
    contentWellTimer.setAttribute('role', 'scrollbar');
    contentWellTimer.setAttribute('aria-label', 'Writing scroll position');
    contentWellTimer.setAttribute('aria-orientation', 'vertical');
    contentWellTimer.setAttribute('aria-valuemin', '0');
    contentWellTimer.setAttribute('aria-valuemax', '100');
    contentWellTimer.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    contentWellTimer.tabIndex = range > 1 ? 0 : -1;
    syncMobileBackToTopHost();
    return;
  }
  contentWell.classList.remove('has-no-scroll');
  contentWellTimer.setAttribute('aria-hidden', 'true');
  contentWellTimer.removeAttribute('role');
  contentWellTimer.removeAttribute('aria-label');
  contentWellTimer.removeAttribute('aria-orientation');
  contentWellTimer.removeAttribute('aria-valuemin');
  contentWellTimer.removeAttribute('aria-valuemax');
  contentWellTimer.removeAttribute('aria-valuenow');
  contentWellTimer.tabIndex = -1;
  const total = contentWellAssets.length;
  const isSingleAsset = total === 1;
  contentWell.classList.toggle('is-single-asset', isSingleAsset);
  contentWellControls.hidden = total <= 1;
  contentWellControls.setAttribute('aria-label', 'Project asset navigation');
  contentWellPrevious.setAttribute('aria-label', 'Previous project asset');
  contentWellNext.setAttribute('aria-label', 'Next project asset');
  contentWellPrevious.querySelector('i').className = 'ri-arrow-left-line';
  contentWellNext.querySelector('i').className = 'ri-arrow-right-line';
  contentWellPrevious.disabled = total < 2;
  contentWellNext.disabled = total < 2;
  contentWellCount.textContent = total ? `${String(contentWellAssetIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}` : '';
  syncMobileBackToTopHost();
};

const showContentWellAsset = async (requestedIndex, direction = 0, focusDirection = 0) => {
  if (!contentWellAssets.length) return;
  cancelAnimations(contentWellAssetAnimations);
  const index = (requestedIndex % contentWellAssets.length + contentWellAssets.length) % contentWellAssets.length;
  const generation = ++contentWellMediaGeneration;
  const outgoing = contentWellScroll.querySelector('.content-well-item');
  const preservedControlsBottom = direction && outgoing
    ? contentWellControls.getBoundingClientRect().bottom
    : Number.NaN;
  contentAutoplayElapsed = 0;
  setContentTimerProgress(0);
  contentWellAssetIndex = index;
  const activeAsset = contentWellAssets[index];
  contentWell.classList.toggle('has-interactive-asset', embeddedMediaTypes.has(activeAsset.type));
  updateContentWellControls();
  contentWellStatus.textContent = `Asset ${index + 1} of ${contentWellAssets.length}`;

  const item = document.createElement('figure');
  item.className = 'content-well-item';
  item.dataset.index = String(index);
  const media = createContentWellMedia(activeAsset, index);
  item.append(media);
  if (activeAsset.type === 'apple') item.style.backgroundImage = 'none';
  if (media instanceof HTMLIFrameElement) {
    const posterSrc = activeAsset.poster || contentWellAssets.find((asset) => ['image', 'gif'].includes(asset.type))?.src;
    if (posterSrc) {
      item.classList.add('has-embed-poster');
      item.style.backgroundImage = `url("${posterSrc.replaceAll('"', '%22')}")`;
    }
    if (activeAsset.type === 'youtube') {
      item.classList.add('is-youtube-idle');
      const play = document.createElement('button');
      play.className = 'content-well-youtube-play';
      play.type = 'button';
      play.setAttribute('aria-label', `Play ${activeAsset.alt || 'YouTube video'}`);
      play.innerHTML = '<i class="ri-play-fill" aria-hidden="true"></i>';
      play.addEventListener('click', () => {
        if (!media.dataset.embedSrc) return;
        const source = media.dataset.embedSrc;
        delete media.dataset.embedSrc;
        media.addEventListener('load', () => {
          item.classList.add('is-embed-loaded');
          item.classList.remove('is-youtube-loading');
          media.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: 'content-well-youtube' }), '*');
          sendYouTubeCommand(media, 'getDuration');
          sendYouTubeCommand(media, 'getCurrentTime');
        }, { once: true });
        item.classList.remove('is-youtube-idle');
        item.classList.add('is-youtube-loading');
        media.src = `${source}${source.includes('?') ? '&' : '?'}autoplay=1`;
        play.remove();
        attachYouTubeMinimalControls(item, media);
      });
      item.append(play);
    } else {
      item.classList.add('is-embed-loading');
      item.setAttribute('aria-busy', 'true');
      media.addEventListener('load', () => {
        if (generation !== contentWellMediaGeneration) return;
        item.classList.add('is-embed-loaded');
        item.classList.remove('is-embed-loading');
        item.removeAttribute('aria-busy');
      }, { once: true });
    }
    contentWellScroll.append(item);
  }
  await waitForContentWellMedia(media);
  if (generation !== contentWellMediaGeneration) {
    disposeContentWellMedia(item);
    return;
  }
  activeVisualAutoplayDuration = Math.max(250, await animatedMediaDuration(media, activeAsset));
  if (generation !== contentWellMediaGeneration) {
    disposeContentWellMedia(item);
    return;
  }
  if (media instanceof HTMLVideoElement) {
    media.loop = contentWellAssets.length === 1;
    media.currentTime = 0;
    media.play().catch(() => {});
  }
  syncContentWellMediaAspect(media, preservedControlsBottom, activeAsset);
  item.classList.add('is-transitioning');
  if (!item.isConnected) contentWellScroll.append(item);
  contentWellScroll.scrollTop = 0;

  const visualDirection = direction || focusDirection || 1;
  const duration = reducedMotion.matches ? 100 : 440;
  const incomingAnimation = item.animate(
    reducedMotion.matches
      ? [{ opacity: 0 }, { opacity: 1 }]
      : [
          { opacity: 0, transform: `translate3d(0, ${visualDirection * 6}px, 0) scale(1.012)`, clipPath: 'inset(1.6% round 8px)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)', clipPath: 'inset(0% round 4px)' }
        ],
    { duration, easing: reducedMotion.matches ? 'ease-out' : 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' }
  );
  const outgoingAnimation = outgoing && outgoing !== item
    ? outgoing.animate(
        reducedMotion.matches
          ? [{ opacity: 1 }, { opacity: 0 }]
          : [
              { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)', clipPath: 'inset(0% round 4px)' },
              { opacity: 0, transform: `translate3d(0, ${visualDirection * -4}px, 0) scale(.992)`, clipPath: 'inset(1.2% round 7px)' }
            ],
        { duration: reducedMotion.matches ? 100 : 300, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'both' }
      )
    : undefined;
  contentWellAssetAnimations.push(incomingAnimation);
  if (outgoingAnimation) contentWellAssetAnimations.push(outgoingAnimation);
  animateContentWellFocus(focusDirection);

  await Promise.allSettled([incomingAnimation.finished, outgoingAnimation?.finished].filter(Boolean));
  if (generation !== contentWellMediaGeneration) {
    disposeContentWellMedia(item);
    item.remove();
    return;
  }
  if (outgoing && outgoing !== item) {
    disposeContentWellMedia(outgoing);
    outgoing.remove();
  }
  incomingAnimation.cancel();
  contentWellAssetAnimations = [];
  item.classList.remove('is-transitioning');
  contentWell.classList.add('is-ready');
  startContentAutoplay(false);
  preloadAdjacentVisualAsset(index);
};

const updateContentWellActive = () => {
  contentWellFrame = undefined;
  if (contentWell.dataset.kind === 'writing') {
    const range = Math.max(1, contentWellScroll.scrollHeight - contentWellScroll.clientHeight);
    const progress = Math.max(0, Math.min(1, contentWellScroll.scrollTop / range));
    setContentTimerProgress(progress);
    contentWellStatus.textContent = `${Math.round(progress * 100)}% read`;
    updateContentWellControls();
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

const contentWellOverflowObserver = new ResizeObserver(requestContentWellActive);
contentWellOverflowObserver.observe(contentWellScroll);

contentWellScroll.addEventListener('scroll', () => {
  if (contentWell.dataset.kind === 'writing') {
    if (Math.abs(contentWellScroll.scrollTop - writingAutoplayPosition) > 1) writingAutoplayPosition = contentWellScroll.scrollTop;
    if (contentWellKey) contentWellPositions.set(contentWellKey, contentWellScroll.scrollTop);
  }
  requestContentWellActive();
}, { passive: true });

const seekWritingFromProgress = (clientY) => {
  if (contentWell.dataset.kind !== 'writing') return;
  const range = Math.max(0, contentWellScroll.scrollHeight - contentWellScroll.clientHeight);
  if (!range) return;
  const rect = contentWellTimer.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, (clientY - rect.top) / Math.max(1, rect.height)));
  writingAutoplayPosition = range * progress;
  contentWellScroll.scrollTop = writingAutoplayPosition;
  setContentTimerProgress(progress);
  requestContentWellActive();
};

contentWellTimer.addEventListener('pointerdown', (event) => {
  if (contentWell.dataset.kind !== 'writing' || contentWell.classList.contains('has-no-scroll')) return;
  event.preventDefault();
  if (writingScrollFrame) cancelAnimationFrame(writingScrollFrame);
  writingScrollFrame = undefined;
  writingProgressDragging = true;
  contentAutoplayHoldUntil = Number.POSITIVE_INFINITY;
  contentWellTimer.classList.add('is-dragging');
  contentWellTimer.setPointerCapture(event.pointerId);
  seekWritingFromProgress(event.clientY);
});

const moveWritingProgressDrag = (event) => {
  if (!writingProgressDragging) return;
  event.preventDefault();
  seekWritingFromProgress(event.clientY);
};

const stopWritingProgressDrag = (event) => {
  if (!writingProgressDragging) return;
  writingProgressDragging = false;
  contentAutoplayHoldUntil = performance.now() + 900;
  contentAutoplayLastTime = 0;
  contentWellTimer.classList.remove('is-dragging');
  if (event?.pointerId !== undefined && contentWellTimer.hasPointerCapture(event.pointerId)) {
    contentWellTimer.releasePointerCapture(event.pointerId);
  }
  startContentAutoplay(false);
};

window.addEventListener('pointermove', moveWritingProgressDrag, { passive: false });
window.addEventListener('pointerup', stopWritingProgressDrag);
window.addEventListener('pointercancel', stopWritingProgressDrag);
contentWellTimer.addEventListener('lostpointercapture', stopWritingProgressDrag);
contentWellTimer.addEventListener('keydown', (event) => {
  if (contentWell.dataset.kind !== 'writing') return;
  if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const range = Math.max(0, contentWellScroll.scrollHeight - contentWellScroll.clientHeight);
  const increment = Math.max(40, contentWellScroll.clientHeight * .1);
  if (event.key === 'Home') contentWellScroll.scrollTop = 0;
  else if (event.key === 'End') contentWellScroll.scrollTop = range;
  else contentWellScroll.scrollTop = Math.max(0, Math.min(range, contentWellScroll.scrollTop + (event.key === 'ArrowDown' ? increment : -increment)));
  contentAutoplayHoldUntil = performance.now() + 900;
});

// A wheel over the writing preview continues the main timeline. Article
// movement is intentionally delegated to the preview's navigation buttons.
contentWellScroll.addEventListener('wheel', (event) => {
  if (contentWell.dataset.kind === 'writing') event.preventDefault();
}, { passive: false });

const setActiveVisualPlayback = (playing) => {
  if (contentWell.dataset.kind !== 'project') return;
  const video = contentWellScroll.querySelector('video');
  if (!video) return;
  if (playing) video.play().catch(() => {});
  else video.pause();
};

contentWell.addEventListener('pointerenter', cancelDrift);
if (hoverPauseEnabled.matches) {
  contentWellScroll.addEventListener('pointerenter', () => {
    if (!hoverPauseEnabled.matches) return;
    contentAutoplayHoverPaused = true;
    setActiveVisualPlayback(false);
  });
  contentWellScroll.addEventListener('pointerleave', () => {
    if (!hoverPauseEnabled.matches) return;
    contentAutoplayHoverPaused = false;
    contentAutoplayLastTime = 0;
    if (!contentAutoplayUserPaused) setActiveVisualPlayback(true);
  });
}
hoverPauseEnabled.addEventListener('change', ({ matches }) => {
  if (matches) return;
  contentAutoplayHoverPaused = false;
  contentAutoplayLastTime = 0;
  if (!contentAutoplayUserPaused) setActiveVisualPlayback(true);
});
contentWell.addEventListener('pointerdown', cancelDrift);
contentWell.addEventListener('touchstart', cancelDrift, { passive: true });

let mobileWritingTouchRoute;
let mobileWritingTouchY;
let mobileWritingScrollFrame;
let mobileWritingPendingDelta = 0;
const applyMobileWritingScroll = () => {
  mobileWritingScrollFrame = undefined;
  const delta = mobileWritingPendingDelta;
  mobileWritingPendingDelta = 0;
  if (!delta) return;
  if (mobileWritingTouchRoute === 'article') {
    contentWellScroll.scrollTop += delta * mobileArticleScrollResponse;
  } else if (mobileWritingTouchRoute === 'timeline') {
    window.scrollBy(0, delta * mobilePageScrollResponse);
  }
};
contentWellScroll.addEventListener('touchstart', (event) => {
  if (!coarsePointer.matches || contentWell.dataset.kind !== 'writing' || event.touches.length !== 1) return;
  const touch = event.touches[0];
  const rect = contentWellScroll.getBoundingClientRect();
  mobileWritingTouchRoute = touch.clientX - rect.left >= rect.width * .68 ? 'timeline' : 'article';
  mobileWritingTouchY = touch.clientY;
  if (mobileWritingTouchRoute === 'article') {
    contentAutoplayHoldUntil = performance.now() + 1400;
  }
}, { passive: true });

contentWellScroll.addEventListener('touchmove', (event) => {
  if (!mobileWritingTouchRoute || mobileWritingTouchY === undefined || event.touches.length !== 1) return;
  const nextY = event.touches[0].clientY;
  const delta = mobileWritingTouchY - nextY;
  mobileWritingTouchY = nextY;
  if (Math.abs(delta) < .5) return;
  event.preventDefault();
  mobileWritingPendingDelta += delta;
  if (!mobileWritingScrollFrame) mobileWritingScrollFrame = requestAnimationFrame(applyMobileWritingScroll);
}, { passive: false });

const clearMobileWritingTouch = () => {
  if (mobileWritingScrollFrame) cancelAnimationFrame(mobileWritingScrollFrame);
  applyMobileWritingScroll();
  mobileWritingTouchRoute = undefined;
  mobileWritingTouchY = undefined;
};
contentWellScroll.addEventListener('touchend', clearMobileWritingTouch, { passive: true });
contentWellScroll.addEventListener('touchcancel', clearMobileWritingTouch, { passive: true });

contentWellFullscreen.addEventListener('click', () => setContentWellFullscreen(!contentWellFullscreenOpen));
window.addEventListener('resize', updateContentWellFullscreenGeometry, { passive: true });
contentWellAutoplay.addEventListener('click', () => {
  contentAutoplayUserPaused = !contentAutoplayUserPaused;
  if (!contentAutoplayUserPaused && contentWell.dataset.kind === 'writing') {
    const range = Math.max(0, contentWellScroll.scrollHeight - contentWellScroll.clientHeight);
    if (range && contentWellScroll.scrollTop >= range - 1) contentWellScroll.scrollTop = 0;
  }
  contentAutoplayLastTime = 0;
  updateContentAutoplayControl();
  startContentAutoplay(false);
});

const scrollWriting = (direction) => {
  const range = Math.max(0, contentWellScroll.scrollHeight - contentWellScroll.clientHeight);
  const amount = Math.max(80, contentWellScroll.clientHeight * .42);
  const start = contentWellScroll.scrollTop;
  const target = Math.max(0, Math.min(range, start + direction * amount));
  if (writingScrollFrame) cancelAnimationFrame(writingScrollFrame);
  if (reducedMotion.matches) {
    contentWellScroll.scrollTop = target;
    return;
  }
  const startedAt = performance.now();
  const duration = 880;
  const tick = (now) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = .5 - Math.cos(Math.PI * progress) / 2;
    contentWellScroll.scrollTop = start + (target - start) * eased;
    if (progress < 1) writingScrollFrame = requestAnimationFrame(tick);
    else writingScrollFrame = undefined;
  };
  writingScrollFrame = requestAnimationFrame(tick);
};

contentWellPrevious.addEventListener('click', () => {
  if (contentWell.dataset.kind === 'writing') {
    contentAutoplayHoldUntil = performance.now() + 1200;
    scrollWriting(-1);
  }
  else showContentWellAsset(contentWellAssetIndex - 1, -1);
});
contentWellNext.addEventListener('click', () => {
  if (contentWell.dataset.kind === 'writing') {
    contentAutoplayHoldUntil = performance.now() + 1200;
    scrollWriting(1);
  }
  else showContentWellAsset(contentWellAssetIndex + 1, 1);
});

contentWell.addEventListener('keydown', (event) => {
  if (contentWell.dataset.kind === 'writing') {
    if ((event.key === 'ArrowUp' || event.key === 'PageUp') && !contentWellPrevious.disabled) {
      event.preventDefault();
      scrollWriting(-1);
    } else if ((event.key === 'ArrowDown' || event.key === 'PageDown') && !contentWellNext.disabled) {
      event.preventDefault();
      scrollWriting(1);
    }
  } else if (event.key === 'ArrowLeft' && !contentWellPrevious.disabled) {
    event.preventDefault();
    showContentWellAsset(contentWellAssetIndex - 1, -1);
  } else if (event.key === 'ArrowRight' && !contentWellNext.disabled) {
    event.preventDefault();
    showContentWellAsset(contentWellAssetIndex + 1, 1);
  }
});

renderContentWell = async (entry, focusDirection = 0) => {
  if (!entry) return;
  const key = contentKeyFor(entry);
  if (contentWellEntry === entry) {
    setPreviewVisibility(document.body.classList.contains('details-open'));
    return;
  }
  if (contentWellKey && contentWell.dataset.kind === 'writing') contentWellPositions.set(contentWellKey, contentWellScroll.scrollTop);
  const generation = ++contentWellGeneration;
  ++contentWellMediaGeneration;
  cancelAnimations(contentWellAssetAnimations);
  contentWellAssetAnimations = [];
  if (adjacentVisualPreload) adjacentVisualPreload.src = '';
  adjacentVisualPreload = undefined;
  adjacentVisualPreloadKey = '';
  stopContentAutoplay();
  contentAutoplayElapsed = 0;
  contentAutoplayUserPaused = false;
  contentAutoplayHoverPaused = false;
  contentAutoplayHoldUntil = 0;
  updateContentAutoplayControl();
  setContentTimerProgress(0);
  contentWellEntry = entry;
  contentWellKey = key;
  contentWell.classList.remove('is-ready', 'has-content', 'has-interactive-asset');
  contentWell.dataset.kind = entry.kind;
  delete contentWell.dataset.assetAspect;
  contentWellScroll.style.removeProperty('--content-aspect');
  disposeContentWellMedia();
  contentWellScroll.replaceChildren();
  contentWellOverflowObserver.disconnect();
  contentWellOverflowObserver.observe(contentWellScroll);
  contentWellControls.hidden = true;
  contentWellAssets = [];
  contentWellAssetIndex = 0;

  let label = `${entry.title}, no preview content`;
  let hasContent = false;

  if (entry.kind === 'writing' && entry.url) {
    const manifest = await writingManifest;
    const record = manifest.writings[new URL(entry.url, document.baseURI).href];
    if (record) {
      const response = await fetch(`${record.file}?v=20260928-media-timed-content-well`);
      const article = await response.json();
      if (generation !== contentWellGeneration) return;
      const writingContent = createWritingContent(article);
      contentWellScroll.append(writingContent);
      contentWellOverflowObserver.observe(writingContent);
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
      animateContentWellFocus(focusDirection);
      updateContentWellActive();
      constrainContentWellToViewport();
      startContentAutoplay(false);
    });
    return;
  }

  updateContentWellControls();
  showContentWellAsset(0, 0, focusDirection);
};

projectManifest.then((manifest) => {
  timelineEntries.forEach((element) => {
    const count = assetsForEntry(manifest, element.entryData).length;
    if (element.entryData.kind === 'project') element.classList.toggle('has-no-assets', count === 0);
    const label = element.querySelector('.timeline-asset-count');
    if (!label || !count) return;
    label.textContent = `, ${count} ${count === 1 ? 'asset' : 'assets'}`;
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
