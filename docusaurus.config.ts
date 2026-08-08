import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Lumina Studio Wiki',
  tagline: 'Lumina Studio 官方使用文档',
  favicon: 'img/favicon.ico',

  future: {v4: true},
  url: 'https://wiki.luminastudio.com.cn',
  baseUrl: '/',
  trailingSlash: true,
  organizationName: 'lumina-layer-studio',
  projectName: 'Lumina-Studio-Wiki',
  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
    localeConfigs: {
      'zh-Hans': {
        label: '简体中文',
        baseUrl: '/zh',
        htmlLang: 'zh-CN',
      },
      en: {
        label: 'English',
        baseUrl: '/en',
        htmlLang: 'en',
      },
    },
  },

  markdown: {
    format: 'detect',
    hooks: {onBrokenMarkdownLinks: 'throw'},
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
        },
        blog: {
          path: 'updates',
          routeBasePath: 'updates',
          blogTitle: 'Wiki 动态',
          blogDescription: 'Lumina Studio Wiki 的新增教程与重要修订',
          blogSidebarTitle: '全部动态',
          blogSidebarCount: 'ALL',
          postsPerPage: 10,
          showReadingTime: false,
          feedOptions: {
            type: 'all',
            copyright: `© ${new Date().getFullYear()} Lumina Studio`,
          },
        },
        sitemap: {changefreq: 'weekly', priority: 0.6},
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['zh', 'en'],
        indexDocs: true,
        indexBlog: true,
        blogDir: ['updates'],
        indexPages: false,
      },
    ],
  ],

  customFields: {
    meowCommentServer:
      process.env.MEOW_COMMENT_SERVER ??
      'https://comments.luminastudio.com.cn',
  },

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Lumina Studio',
      logo: {alt: 'Lumina Studio', src: 'img/logo.png'},
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: '文档',
        },
        {
          type: 'docSidebar',
          sidebarId: 'releasesSidebar',
          position: 'left',
          label: '更新日志',
        },
        {
          to: 'updates',
          position: 'left',
          label: 'Wiki 动态',
        },
        {
          type: 'docSidebar',
          sidebarId: 'feedbackSidebar',
          position: 'left',
          label: 'Wiki 反馈',
        },
        {type: 'localeDropdown', position: 'right'},
        {
          type: 'dropdown',
          label: '支持项目',
          position: 'right',
          items: [
            {
              href: 'https://ifdian.net/a/MMMINNN',
              label: '中国大陆 · 爱发电',
            },
            {
              href: 'https://www.patreon.com/cw/Lumina_studio',
              label: '海外 · Patreon',
            },
          ],
        },
        {
          href: 'https://github.com/lumina-layer-studio/Lumina-Layers',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `© ${new Date().getFullYear()} Lumina Studio`,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
