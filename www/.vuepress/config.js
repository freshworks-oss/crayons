const fs = require('fs');
const path = require('path');

const version = require('../../package.json').version;

// Retrieve list of components for the sidebar config
const components = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../components.json'))
);

const coreComponents = components.filter((comp) =>
  comp.startsWith('components/core/')
);
const customObjectsComponents = components.filter((comp) =>
  comp.startsWith('components/crayons-custom-objects/')
);

/** list all versions along with their SHA digest */
let versionsArr = [];
const versionMap = { v2Components: [], v3Components: [], v4Components: [] };

/** This script expects version.json file which can be found in the crayons staging/production s3 bucket.
 * Add the file inside /www/scripts/ and pass the file path in the env variable VERSION_FILE while running commands like npm run build and npm run docs.
 * For eg: VERSION_FILE=www/scripts/version.json npm run build.
 * NOTE: adding version.json file is for local development purpose only, please refrain from committing the file to the repo.
 */
if (!process.env.VERSION_FILE)
  console.warn(
    'Please provide the version.json filepath in env variable VERSION_FILE to create readme files for all versions !'
  );

try {
  versionsArr = JSON.parse(fs.readFileSync(process.env.VERSION_FILE));
} catch (err) {
  console.log('version.json fetch error ', err);
  versionArr = [];
}
versionsArr.forEach((v) => {
  const filePath = `versions/v${v['key']?.split('.')[0]}.x/${v.key}/`;
  v['key'] === '2.13.4' && versionMap['v2Components'].push(filePath);
  v['key'].startsWith('3.') &&
    !v['key'].includes('beta') &&
    versionMap['v3Components'].push(filePath);
  v['key'].startsWith('4.') && versionMap['v4Components'].push(filePath);
});

/** End of listing all versions */

// Generate array of head-scripts based on the www builds of the
// packages that have landed in the public directory
const headScripts = [];
const wwwBuilds = fs.readdirSync(path.resolve(__dirname, 'public/scripts'));
for (const wwwBuild of wwwBuilds) {
  headScripts.push([
    'script',
    { type: 'module', src: `/scripts/${wwwBuild}/build/${wwwBuild}.esm.js` },
  ]);

  headScripts.push([
    'script',
    { nomodule: '', src: `/scripts/${wwwBuild}/build/${wwwBuild}.js` },
  ]);
}

headScripts.push(['script', { type: 'module', src: `/global/header.esm.js` }]);
headScripts.push(['link', { rel: 'stylesheet', href: `/css/crayons-min.css` }]);
headScripts.push(['link', { rel: 'stylesheet', href: `/dew/colors.css` }]);
headScripts.push(['link', { rel: 'stylesheet', href: `/dew/fonts.css` }]);
headScripts.push(['link', { rel: 'stylesheet', href: `/dew/numbers.css` }]);

const getUtils = () =>
  [
    'installation',
    'typography',
    'spacing',
    'border',
    'layout',
    'card',
    'color',
    'examples',
  ].map((util) => `/css-utils/${util}/`);

const getTags = () => [
  'Web Components',
  'Ui Kit',
  'Marketplace',
  'Freshworks Marketplace',
  'Component Library',
  'FDK',
  'Freshworks developers',
  'Freshworks development',
  'Freshworks',
  'Freshworks Development Kit',
];

const getComponents = () => {
  const componentMap = {};
  coreComponents.forEach((item) => {
    const key = item.split('/')[2];
    if (componentMap[key]) {
      if (componentMap[key].children) componentMap[key].children.push(item);
      else
        componentMap[key] = {
          type: 'group',
          title: key[0].toUpperCase() + key.slice(1),
          children: [`components/core/${key}/`, item],
        };
    } else componentMap[key] = item;
  });
  return Object.values(componentMap);
};

const websiteUrl = 'https://crayons.freshworks.com';

module.exports = {
  title: 'Crayons',
  base: '/',
  description: 'A refreshed design library for the Freshworks Developers.',
  dest: 'www-dist',
  head: [...headScripts, ['link', { rel: 'icon', href: '/favicon.png' }]],
  themeConfig: {
    lastUpdated: 'Last Updated',
    smoothScroll: true,
    sidebar: [
      {
        title: 'Introduction',
        collapsable: false,
        sidebarDepth: 1,
        children: ['/introduction/', '/introduction/migrating-to-v4/'],
      },
      {
        title: 'Core Components',
        collapsable: false,
        sidebarDepth: 1,
        children: getComponents(),
      },
      {
        title: 'CSS Utils',
        collapsable: false,
        sidebarDepth: 1,
        children: getUtils(),
      },
      {
        title: 'Utilities',
        collapsable: false,
        sidebarDepth: 1,
        children: ['utilities/i18n/'],
      },
      {
        title: 'Frameworks',
        collapsable: false,
        sidebarDepth: 1,
        children: [
          '/frameworks/react/',
          '/frameworks/vue/',
          '/frameworks/angular/',
        ],
      },
      {
        title: 'Versions',
        collapsable: false,
        sidebarDepth: 1,
        initialOpenGroupIndex: -1,
        children: [
          {
            type: 'group',
            title: 'v4.x',
            children: versionMap['v4Components'].reverse(),
          },
          {
            type: 'group',
            title: 'v3.x',
            children: versionMap['v3Components'].reverse(),
          },
          {
            type: 'group',
            title: 'v2.x',
            children: versionMap['v2Components'].reverse(),
          },
        ],
      },
    ],
    nav: [
      {
        text: 'Migrating to v4',
        link: '/introduction/migrating-to-v4/',
      },
      {
        text: `v${version?.split('.')[0]}.x`,
        items: ['v4.x', 'v3.x', 'v2.x'].map((v, i) => ({
          text: v,
          link: `https://crayons.freshworks.com/${
            i !== 0 ? `${v?.split('.')[0]}/` : ''
          }`,
        })),
      },
    ],
  },
  plugins: [
    [
      'live',
      {
        layout: path.resolve(__dirname, './previewLayout.vue'),
        squiggles: false,
      },
    ],
    ['@vuepress/active-header-links'],
    [
      'vuepress-plugin-google-tag-manager',
      {
        gtm: 'GTM-WQKBJ88',
      },
    ],
    [
      'vuepress-plugin-seo',
      {
        siteTitle: () => 'Crayons',
        title: () => 'Crayons',
        description: () =>
          'A refreshed design library for the Freshworks Developers.',
        author: () => 'Freshworks',
        tags: getTags,
        twitterCard: (_) => 'summary_large_image',
        type: () => 'website',
        url: (_, $site, path) => websiteUrl + path,
        image: ($page, $site) =>
          'https://s3.amazonaws.com/static.freshcloud.io/crayons/assets/crayons.png',
        publishedAt: ($page) =>
          $page.frontmatter.date && new Date($page.frontmatter.date),
        modifiedAt: ($page) => $page.lastUpdated && new Date($page.lastUpdated),
      },
    ],
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@icon-assets': path.resolve(__dirname, '../../packages/crayons-icon'),
      },
    },
  },
};
