const javaScript = [
  '',
  'this',
]

const build = [
  '',
  'webpack',
]

const reactVue = [
  '',
  'try-mpvue',
  'read-vue'
]

const performanceOptimization = [
  '',
  'functional-code',
  'sso-cas',
]

const fe = [
  'how-vue-detect-changes',
  'vue-access',
]

// const k2data = [
//   ''
// ]

const share = [
  {
    title: '杂谈',
    children: performanceOptimization
  },
  {
    title: '前端框架',
    children: fe
  }
]

module.exports = {
  dest: 'vuepress',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'KK | FE',
      description: 'Code, Photography, and Sports'
    }
  },
  head: [
    ['link', { rel: 'icon', href: `/logo_small.jpg` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  serviceWorker: true,
  theme: 'vue',
  themeConfig: {
    repo: 'kangkai124',
    editLinks: true,
    docsDir: 'docs',
    nav: [
      {
        text: '笔记',
        items: [
          { text: 'JavaScript', link: '/javaScript/' },
          { text: 'html/css', link: '/html-css/' },
          { text: 'react/vue', link: '/react-vue/' },
          { text: 'nodeJs', link: '/nodeJs/' },
          { text: 'build', link: '/build/' },
          { text: 'thoughts', link: '/thoughts/' }
        ],
      },
      {
        text: '转载',
        items: [
          { text: 'K2data', link: '/share/k2data/'},
          { text: '大佬博客', link: '/share/fe/' },
        ]
      },
      {
        text: '摄影',
        link: 'https://kangkai.tuchong.com/'
      }
    ],
    sidebar: {
      '/javaScript/': genSidebarConfig('JavaScript', javaScript),
      '/react-vue/': genSidebarConfig('react/vue', reactVue),
      '/build/': genSidebarConfig('项目构建', build),
      '/share/fe/': genMulSidebarConf(share),
    },
  }
}

function genSidebarConfig (title, children) {
  return [
    {
      title,
      children,
      collapsable: true,
    }
  ]
}

function genMulSidebarConf (list) {
  return list.map(l => ({
    title: l.title,
    children: l.children,
    collapsable: true
  }))
}
