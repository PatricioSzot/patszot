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
      { date: 'Present', kind: 'project', title: 'Brand Engineer at AirOps', url: 'https://www.airops.com/', description: 'Brand strategy, market repositioning, web transformation, image systems, and marketing tooling.' },
      { date: 'January 22', kind: 'writing', title: 'My Inner Circle is Made Up of Bad-ass Women', url: 'https://medium.com/@patrick.m.szot/my-inner-circle-is-made-up-of-bad-ass-women-5-powers-they-gave-me-that-id-like-to-share-with-you-0e9117e3693a', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*L6Mz9ArPrUDjh_GrxX7Yrg.png', description: 'Five lessons about power, care, and reflecting the world we actually live in.' }
    ]
  },
  {
    year: '2025',
    entries: [
      { date: 'December 24', kind: 'writing', title: 'The Importance of Celebration and Rest for Creatives', url: 'https://medium.com/@patrick.m.szot/the-importance-of-celebration-and-rest-for-creatives-8cdd66602d74', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*GSVjAl3r5qXH0HcL9gFlSQ.png', description: 'On pausing to recognize the work before moving to the next thing.' },
      { date: 'May 9', kind: 'writing', title: 'Config 2025: It’s The Same, Just Different This Time', url: 'https://medium.com/@patrick.m.szot/config-2025-its-the-same-just-different-this-time-19ab9ed00a52', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*ht0MLlsIZJJpyYASbWi-dw.png', description: 'Thoughts on beauty, efficient production, and working across aisles.' },
      { date: '2025', kind: 'project', title: 'GlossAI Rebrand', url: 'https://glossgenius.com/', cover: 'assets-visual/Gloss AI/Preview 00. Thumbnail-Gloss-LogoCycle_1.mp4', description: 'Brand identity and launch expression for GlossGenius.' },
      { date: '2025', kind: 'project', title: 'Lovable', description: 'Brand work for a fast-moving product company.' }
    ]
  },
  {
    year: '2024',
    entries: [
      { date: 'November 20', kind: 'writing', title: 'Celebrating My 30th And A Decade in Tech', url: 'https://medium.com/@patrick.m.szot/celebrating-my-30th-and-a-decade-in-tech-2014-2024-1347b3b3ef72', cover: 'https://miro.medium.com/v2/resize:fill:320:214/1*zmDBsxxtVsG_WIYBFak_Ug.png', description: 'A decade-in-review across work, practice, and recent flowers from the garden.' },
      { date: 'July 29', kind: 'writing', title: 'I Was Separated From My Position at Webflow', url: 'https://patrickszot.webflow.io/journal/i-got-seperated-from-my-position-at-webflow', description: 'A candid reflection on the end of a chapter.' },
      { date: 'June 10', kind: 'project', title: 'Album Art: Presage 2022', url: 'https://dribbble.com/shots/24328431-Album-Art-Presage-2022', cover: 'https://cdn.dribbble.com/userupload/15032821/file/original-fe6a0e24019319be3d899139d9a02b50.png?crop=237x133-2804x2059&format=webp&resize=800x600&vertical=center' },
      { date: '2022–24', kind: 'project', title: 'Webflow Rebrand', url: 'https://patrickszot.webflow.io/recent-work/webflow-rebrand', cover: 'assets-visual/webflow-rebrand/Preview 04-f3183d6465.jpg', description: 'Visual foundations, motion guidelines, campaigns, customer stories, and event systems.' }
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
      { date: '2023', kind: 'project', title: 'Webflow visual foundations', url: 'https://patrickszot.webflow.io/recent-work/webflow-rebrand', cover: 'assets-visual/webflow-customerStories/Preview VisualFoundations-Example6.jpg', description: 'Illustration, sub-branding, color, lighting, motion, and more than 1,000 custom icons.' }
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
      { date: 'March', kind: 'project', title: 'CIA.gov site implementation', url: 'https://patrickszot.webflow.io/older-work/cia', cover: 'assets-visual/BlackbriarDesignSystem/01-2df8be9eb7.gif', description: 'Co-led brand application, product development, and library design for a recruiting and marketing site.' },
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
      { date: '2017', kind: 'project', title: 'CIA.gov / Blackbriar design system', url: 'https://patrickszot.webflow.io/older-work/cia', cover: 'assets-visual/BlackbriarDesignSystem/01-2df8be9eb7.gif', description: 'A recruiting identity shaped by the tension between the Agency’s history and its future.' }
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
  'Brand Engineer at AirOps': 'airops',
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
  'CIA.gov / Blackbriar design system': 'blackbriar',
  'Lilly Pulitzer Virtual Runway': 'lilly-pulitzer',
  'Rite of Spring': 'rite-of-spring',
  'TOREI (トレイ)': 'torei',
  'Looking Glass EP': 'looking-glass'
}));

const visualPreviewByKey = Object.freeze({
  'airops': 'assets-visual/airops/01-3195b8cc04.avif',
  'gloss-ai': 'assets-visual/Gloss AI/Preview 00. Thumbnail-Gloss-LogoCycle_1.mp4',
  'album-art-presage': 'assets-visual/AlbumArtPresage/Thumbnail 01-6d6cc9cdd4.jpg',
  'webflow-rebrand': 'assets-visual/webflow-rebrand/Preview 04-f3183d6465.jpg',
  'webflow-customer-stories': 'assets-visual/webflow-customerStories/Preview VisualFoundations-Example6.jpg',
  'webflow-user-guide': 'assets-visual/webflow-user-guide/08-3b0c66ad77-Preview.mp4',
  'webflow-conf-process-guidelines': 'assets-visual/webflow-conf-2022-process-and-guidelines/Preview original-d8f26e67a226f3ee3aaf9aebe986d8d9.webp',
  '3d-scene': 'assets-visual/3DScene/original-50e33bfaab1a4bf931dd2ee88c5483fa.webp',
  'studio-trophy-decks': 'assets-visual/TrophyDecks/01-3b08cc0842.gif',
  'design-directory': 'assets-visual/Design Directory/Preview 01-c2b0485fb4.gif',
  'atelier-saady': 'assets-visual/brand-package-atelier-saady/Preview 01-7a487e3d2e.gif',
  'stylized-logo': 'assets-visual/stylized-logo/01-1c7f4b21ad.gif',
  'webflow-conf-grow-room': 'assets-visual/webflow-conf-2022-grow-with-the-flow-room/Preview 01-4bc42b03db.webp',
  'webflow-conf-themes': 'assets-visual/webflow-conf-2022-themes/Preview original-2849102af7a27f96184a86323c719a8d.webp',
  'webflow-conf': 'assets-visual/WebflowConf/Preview 01-cab6fa3076.jpg',
  'thrivent': 'assets-visual/thrivent/Preview 01-20b16a1177.gif',
  'smart-factory': 'assets-visual/the-smart-factory/Preview 02-bff0612e47.png',
  'global-marketing-trends': 'assets-visual/Deloitte Marketing Trends/Preview 01-c676ad19ad.gif',
  'blackbriar': 'assets-visual/BlackbriarDesignSystem/01-2df8be9eb7.gif',
  'rite-of-spring': 'assets-visual/rite-of-spring/Preview 01-c467fa59a9.gif',
  'torei': 'assets-visual/torei/Preview 02-fc1d3b7683.png',
  'looking-glass': 'assets-visual/LookingGlassAlbumArt/Preview 01-3fb54b4b4a.jpg'
});

timelineData.forEach((section) => section.entries.forEach((entry) => {
  entry.assetKey = visualAssetKeyByTitle.get(entry.title);
}));

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
let driftTarget = window.scrollY;
let driftFrame;
let driftAnimating = false;
let driftVelocity = 0;
let driftLastTime = performance.now();

const maxScrollY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
const clampScrollY = (value) => Math.min(maxScrollY(), Math.max(0, value));

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
  if (reducedMotion.matches || event.ctrlKey || event.target.closest('.writing-reader-scroll')) return;
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
  event.preventDefault();
  const impulse = event.deltaY * unit;
  driftVelocity += Math.max(-720, Math.min(720, impulse * 1.4));
  driftTo(driftTarget + impulse * .56);
}, { passive: false });

document.addEventListener('keydown', (event) => {
  if (reducedMotion.matches || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.target.closest('a, button, input, textarea, select, [contenteditable="true"], .writing-reader-scroll')) return;

  const keyboardDistances = {
    ArrowDown: 72,
    ArrowUp: -72,
    PageDown: window.innerHeight * .72,
    PageUp: window.innerHeight * -.72,
    ' ': window.innerHeight * (event.shiftKey ? -.82 : .82)
  };

  if (event.key === 'Home') {
    event.preventDefault();
    driftTo(0);
  } else if (event.key === 'End') {
    event.preventDefault();
    driftTo(maxScrollY());
  } else if (keyboardDistances[event.key] !== undefined) {
    event.preventDefault();
    driftTo(driftTarget + keyboardDistances[event.key]);
  }
});

window.addEventListener('touchstart', cancelDrift, { passive: true });
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
  const assetCount = entry.kind === 'project' && (entry.assetKey || entry.cover)
    ? '<span class="timeline-asset-count" hidden></span>'
    : '';
  const linkedTitle = entry.kind === 'project' && entry.url
    ? `<button class="project-title-trigger" type="button" tabindex="-1" aria-label="Browse ${displayTitle} media" aria-controls="project-content-well">${displayTitle}</button>`
    : entry.url && entry.kind !== 'milestone'
      ? `<a class="text-link${entry.kind === 'writing' ? ' writing-popup-trigger' : ''}" href="${entry.url}" rel="noopener">${displayTitle}</a>`
      : displayTitle;
  const externalAction = entry.url && entry.kind !== 'milestone'
    ? `<a class="timeline-external" href="${entry.url}" target="_blank" rel="noopener noreferrer"><span>View source</span><i class="ri-external-link-line" aria-hidden="true"></i></a>`
    : '';
  const marker = entry.kind === 'project' && entry.url
    ? `<button class="timeline-marker project-expand-trigger" type="button" tabindex="-1" aria-label="Browse ${entry.title} media" aria-controls="project-content-well"><i class="ri-add-line" aria-hidden="true"></i></button>`
    : entry.kind === 'writing' && entry.url
      ? `<button class="timeline-marker writing-expand-trigger" type="button" tabindex="-1" aria-label="Read ${entry.title}" aria-expanded="false"><i class="ri-add-line" aria-hidden="true"></i></button>`
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
const previewTimelineEntries = timelineEntries.filter((entry) =>
  entry.entryData.assetKey || fixedPreviewSourceFor(entry.entryData)
);
detailsTrigger.addEventListener('click', () => {
  window.clearTimeout(detailsCloseTimer);
  const open = !detailsGroup.classList.contains('is-open');
  detailsTrigger.setAttribute('aria-expanded', String(open));
  detailsTrigger.setAttribute('aria-label', open ? 'Show less detail' : 'Show more detail');

  if (open) {
    clearTimelineActive();
    setProjectPreview();
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
let previewTimelineEntry;
let activeTimelineFrame;
let previousScrollY = window.scrollY;
let previousScrollTime = performance.now();
let timelineScrollDirection = 0;
let timelineScrollVelocity = 0;
const projectPreview = document.querySelector('#project-content-well');
const contentWellScroll = projectPreview.querySelector('.content-well-scroll');
const contentWellProgress = projectPreview.querySelector('.content-well-progress');
const contentWellStatus = projectPreview.querySelector('.content-well-status');
let renderContentWell = () => {};
const setProjectPreview = (entry) => renderContentWell(entry || presentProjectData);

const setPreviewVisibility = (visible) => {
  projectPreview.classList.toggle('is-visible', visible);
  projectPreview.setAttribute('aria-hidden', String(!visible));
  if (!visible) contentWellScroll.querySelectorAll('video').forEach((video) => video.pause());
};

const clearTimelineActive = () => {
  activeTimelineEntry?.classList.remove('is-active');
  activeTimelineEntry?.querySelectorAll('.project-expand-trigger, .project-title-trigger, .writing-expand-trigger').forEach((control) => control.setAttribute('tabindex', '-1'));
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

const previewStateForViewport = () => {
  const focusY = window.scrollY + window.innerHeight / 2;
  const points = [
    { entry: presentProjectData, center: untransformedDocumentCenter(presentProjectTrigger).y },
    ...previewTimelineEntries.map((element) => ({ entry: element.entryData, center: untransformedDocumentCenter(element).y }))
  ];
  const upcomingIndex = points.findIndex((point) => point.center >= focusY);
  let activeIndex;
  if (window.scrollY <= 48 || upcomingIndex <= 0) activeIndex = 0;
  else if (upcomingIndex === -1) activeIndex = points.length - 1;
  else {
    const previous = points[upcomingIndex - 1];
    const upcoming = points[upcomingIndex];
    activeIndex = focusY < previous.center + (upcoming.center - previous.center) / 2
      ? upcomingIndex - 1
      : upcomingIndex;
  }
  return points[activeIndex].entry;
};

const updateTimelineActive = () => {
  activeTimelineFrame = undefined;
  if (!document.body.classList.contains('details-open') || document.body.classList.contains('details-opening') || document.body.classList.contains('details-closing') || timelinePanel.hidden) return;

  const firstTimelineEntry = timelineEntries[0];
  const firstEntryCenter = firstTimelineEntry ? untransformedDocumentCenter(firstTimelineEntry).y : 0;
  const presentOwnsFocus = Boolean(firstTimelineEntry && firstEntryCenter - window.scrollY > window.innerHeight / 2);
  const closest = presentOwnsFocus ? undefined : timelineEntryForViewport(timelineEntries);
  const closestPreview = previewStateForViewport();

  document.body.classList.toggle('present-focus', presentOwnsFocus);
  if (!closest) {
    clearTimelineActive();
    if (closestPreview !== previewTimelineEntry) {
      previewTimelineEntry = closestPreview;
      setProjectPreview(previewTimelineEntry);
    }
    return;
  }
  if (closest !== activeTimelineEntry) {
    activeTimelineEntry?.classList.remove('is-active');
    activeTimelineEntry?.querySelectorAll('.project-expand-trigger, .project-title-trigger, .writing-expand-trigger').forEach((control) => control.setAttribute('tabindex', '-1'));
    activeTimelineEntry = closest;
    timeline.classList.add('has-active');
    activeTimelineEntry.classList.add('is-active');
    activeTimelineEntry.querySelectorAll('.project-expand-trigger, .project-title-trigger, .writing-expand-trigger').forEach((control) => control.setAttribute('tabindex', '0'));
  }
  if (closestPreview !== previewTimelineEntry) {
    previewTimelineEntry = closestPreview;
    setProjectPreview(previewTimelineEntry);
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
  '.timeline-footer-billboard'
].join(','))];
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

const projectManifest = fetch('assets-visual/manifest.json').then((response) => response.json());
const hashText = (value) => [...value].reduce((hash, character) => Math.imul(hash ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0;
const contentWellPositions = new Map();
let contentWellEntry;
let contentWellProjectKey;
let contentWellGeneration = 0;
let contentWellFrame;

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
    video.preload = index < 2 ? 'metadata' : 'none';
    video.controls = true;
    return video;
  }
  const image = new Image();
  image.src = asset.src;
  image.alt = asset.alt || `Project media ${index + 1}`;
  image.decoding = 'async';
  image.loading = index === 0 ? 'eager' : 'lazy';
  if (index === 0) image.fetchPriority = 'high';
  return image;
};

const updateContentWellActive = () => {
  contentWellFrame = undefined;
  const items = [...contentWellScroll.querySelectorAll('.content-well-item')];
  if (!items.length) return;
  const center = contentWellScroll.scrollTop + contentWellScroll.clientHeight / 2;
  let activeIndex = 0;
  let activeDistance = Infinity;
  items.forEach((item, index) => {
    const distance = Math.abs(item.offsetTop + item.offsetHeight / 2 - center);
    if (distance < activeDistance) {
      activeDistance = distance;
      activeIndex = index;
    }
  });
  items.forEach((item, index) => {
    const active = index === activeIndex;
    item.classList.toggle('is-active', active);
    const video = item.querySelector('video');
    if (video) {
      if (active) video.play().catch(() => {});
      else video.pause();
    }
  });
  [...contentWellProgress.children].forEach((button, index) => {
    if (index === activeIndex) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
  contentWellStatus.textContent = `${activeIndex + 1} of ${items.length}`;
};

const requestContentWellActive = () => {
  if (!contentWellFrame) contentWellFrame = requestAnimationFrame(updateContentWellActive);
};

contentWellScroll.addEventListener('scroll', () => {
  if (contentWellProjectKey) contentWellPositions.set(contentWellProjectKey, contentWellScroll.scrollTop);
  requestContentWellActive();
}, { passive: true });

contentWellProgress.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-index]');
  if (!button) return;
  const item = contentWellScroll.children[Number(button.dataset.index)];
  if (!item) return;
  contentWellScroll.scrollTo({ top: item.offsetTop, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
});

renderContentWell = async (entry) => {
  if (!entry) return;
  const projectKey = entry.assetKey || entry.assetsUrl || entry.url || entry.title;
  if (contentWellEntry === entry && contentWellScroll.children.length) return;
  const generation = ++contentWellGeneration;
  const manifest = await projectManifest;
  if (generation !== contentWellGeneration) return;
  const assets = assetsForEntry(manifest, entry);
  if (!assets.length) {
    setPreviewVisibility(false);
    return;
  }
  if (contentWellProjectKey) contentWellPositions.set(contentWellProjectKey, contentWellScroll.scrollTop);
  contentWellEntry = entry;
  contentWellProjectKey = projectKey;
  projectPreview.classList.remove('is-ready');
  const mediaFragment = document.createDocumentFragment();
  const progressFragment = document.createDocumentFragment();
  assets.forEach((asset, index) => {
    const item = document.createElement('figure');
    item.className = 'content-well-item';
    item.dataset.index = String(index);
    item.append(createContentWellMedia(asset, index));
    mediaFragment.append(item);
    const segment = document.createElement('button');
    segment.type = 'button';
    segment.dataset.index = String(index);
    segment.setAttribute('aria-label', `View item ${index + 1} of ${assets.length}`);
    progressFragment.append(segment);
  });
  contentWellScroll.querySelectorAll('video').forEach((video) => video.pause());
  contentWellScroll.replaceChildren(mediaFragment);
  contentWellProgress.replaceChildren(progressFragment);
  const countLabel = `${assets.length} ${assets.length === 1 ? 'item' : 'items'}`;
  projectPreview.setAttribute('aria-label', `${entry.title} project media, ${countLabel}`);
  contentWellScroll.scrollTop = contentWellPositions.get(projectKey) || 0;
  setPreviewVisibility(document.body.classList.contains('details-open'));
  requestAnimationFrame(() => {
    projectPreview.classList.add('is-ready');
    updateContentWellActive();
  });
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

timeline.querySelectorAll('.project-expand-trigger, .project-title-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const element = trigger.closest('.timeline-entry');
    if (element !== activeTimelineEntry) return;
    focusContentWell(element.entryData);
  });
});

presentProjectTrigger.addEventListener('click', () => focusContentWell(presentProjectData));

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

timeline.querySelectorAll('.writing-expand-trigger').forEach((trigger) => {
  trigger.setAttribute('aria-controls', 'writing-reader');
  trigger.addEventListener('click', () => {
    const entry = trigger.closest('.timeline-entry');
    if (entry !== activeTimelineEntry) return;
    const link = entry.querySelector('.writing-popup-trigger');
    if (link) openWriting(link);
  });
});

writingClose.addEventListener('click', () => {
  closeWriting();
  writingReturnTarget?.focus({ preventScroll: true });
});
document.addEventListener('click', (event) => {
  if (writingReader.hidden || event.target.closest('#writing-reader, .writing-popup-trigger, .writing-expand-trigger')) return;
  closeWriting();
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || writingReader.hidden) return;
  closeWriting();
  writingReturnTarget?.focus({ preventScroll: true });
});
