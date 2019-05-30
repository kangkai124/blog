const javaScript = [
  '',
  'functional-code',
  'js-precise-calculation'
]

const htmlCss = [
  '',
  'awesome-css',
]

const reactVue = [
  {
    title: 'vue',
    children: [
      '',
      'try-mpvue',
      'vue-access',
      'read-vue',
      'how-vue-detect-changes',
    ]
  },
  {
    title: 'react',
    children: [
      'react-high-order-component'
    ]
  }
]

const web = [
  ''
]

const node = [
  ''
]

const project = [
  '',
  'docker',
  'webpack',
  'web-opt',
  'webpack-npm'
]

const interview = [
  '',
  'question1'
]

// const share = [
//   {
//     title: '杂谈',
//     children: performanceOptimization
//   },
//   {
//     title: '前端框架',
//     children: fe
//   },
//   {
//     title: 'css',
//     children: css
//   }
// ]

module.exports = {
  base: '/blog/',
  dest: 'docs',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'KK | FE',
      description: 'Code, Guitar, Photography, and Sports'
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
    docsDir: 'src',
    lastUpdated: 'Last Updated',
    nav: [
      {
        text: '大前端',
        items: [
          { text: 'JavaScript', link: '/fe/javaScript/' },
          { text: 'html/css', link: '/fe/html-css/' },
          { text: 'react/vue', link: '/fe/react-vue/' },
          { text: '工程化', link: '/fe/project/' },
          { text: 'node', link: '/fe/node/' },
          { text: '浏览器', link: '/fe/web/' },
          { text: '面试', link: '/fe/interview/' },
        ],
      },
      {
        text: '编程基础',
        items: [
          { text: '计算机原理', link: '/foundation/computer/'},
          { text: '数据结构与算法', link: '/foundation/data-structure/' },
        ]
      },
      {
        text: '摄影',
        items: [
          { text: '图虫', link: 'https://kangkai.tuchong.com/' },
          { text: '原创文章', link: '/photo/' }
        ]
      }
    ],
    sidebar: {
      '/fe/javaScript/': genSidebarConfig('JavaScript', javaScript),
      '/fe/html-css/': genSidebarConfig('html/css', htmlCss),
      '/fe/react-vue/': genMulSidebarConf(reactVue),
      '/fe/web/': genSidebarConfig('浏览器', web),
      '/fe/node/': genSidebarConfig('node', node),
      '/fe/project/': genSidebarConfig('工程化', project),
      '/fe/interview/': genSidebarConfig('面试', interview),
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
