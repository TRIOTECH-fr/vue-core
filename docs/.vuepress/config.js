module.exports = {
  title: 'VueCore',
  description: 'Vue.js ZeroConf Framework',
  serviceWorker: true,
  locales: {
    '/': {
      lang: 'en-US',
    },
    '/fr/': {
      lang: 'fr-FR',
    },
  },
  themeConfig: {
    repo: 'Triotech-fr/vue-core',
    editLinks: true,
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: [{
          text: 'Guide',
          link: '/guide/',
        }, {
          text: 'API',
          link: '/api/',
        }],
        sidebar: {
          '/guide/': essentialSidebarConfig('Essentials'),
          // '/guide': essentialSidebarConfig('Advanced'),
          // '/api': essentialSidebarConfig('API'),
        },
      },
      '/fr/': {
        label: 'Français',
        selectText: 'Language',
        editLinkText: 'Modifier cette page sur GitHub',
        lastUpdated: 'Dernière modification',
        nav: [{
          text: 'Guide',
          link: '/fr/guide/',
        }, {
          text: 'API',
          link: '/fr/api/',
        }],
        sidebar: [{
          title: 'Essentiels',
          collapsable: false,
          children: [
            '/fr/guide/essentials/',
          ],
        }, {
          title: 'Avancé',
          collapsable: false,
          children: [
            'guide/advanced/',
          ],
        }],
      },
    },
  },
};

function essentialSidebarConfig(title) {
  return sidebarConfig(title, [
    '',
    'getting-started',
    'modules',
    'plugins',
  ]);
}

function advancedSidebarConfig(title) {
  return sidebarConfig(title, [
    'webpack',
  ]);
}

function sidebarConfig(title, children) {
  return [{
    title,
    collapsable: false,
    children,
  }];
}
