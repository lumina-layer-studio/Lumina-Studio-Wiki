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
          include: [
            'getting-started/**/*.{md,mdx}',
            'tutorials/**/*.{md,mdx}',
            'knowledge/**/*.{md,mdx}',
            'releases/**/*.{md,mdx}',
            'project/**/*.{md,mdx}',
            'legacy/**/*.{md,mdx}',
          ],
          sidebarPath: './sidebars.ts',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
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
        indexBlog: false,
        indexPages: false,
      },
    ],
  ],

  customFields: {
    artalkServer: process.env.ARTALK_SERVER ?? '',
    artalkSite: 'Lumina Studio Wiki',
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
          type: 'doc',
          docId: 'releases/wikijs-6',
          position: 'left',
          label: '更新日志',
        },
        {type: 'localeDropdown', position: 'right'},
        {
          href: 'https://github.com/lumina-layer-studio/Lumina-Studio-Wiki',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `© ${new Date().getFullYear()} Lumina Studio · <a href="/zh/docs/project/content-license/">内容许可与知识产权</a> · 网站架构由 <a href="https://github.com/Neko-vecter">Neko.vecter</a> 提供建议。使用 <a href="https://docusaurus.io/">Docusaurus</a> 构建。`,
    },
    docs: {
      sidebar: {hideable: true, autoCollapseCategories: true},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
