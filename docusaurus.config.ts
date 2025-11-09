import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Reactive Query',
  tagline: 'A framework-agnostic library for model part in MVVM architectural pattern, automating querying, storing, and caching data in frontend applications',
  favicon: 'img/favicon.ico',

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: 'A framework-agnostic library for model part in MVVM architectural pattern, automating querying, storing, and caching data in frontend applications',
      },
    },
  ],
  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://reactive-query-lab.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Reactive-Query-Lab', // Usually your GitHub org/user name.
  projectName: 'reactive-query', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/Reactive-Query-Lab/reactive-query',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/logo.svg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Reactive Query',
      logo: {
        alt: 'Reactive Query Logo',
        src: 'img/logo.svg',
        className: "header__logo"
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs'
        },
        {
          href: 'https://github.com/Reactive-Query-Lab/reactive-query',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/introduction',
            },
            {
              label: 'Query Model',
              to: '/docs/query-model',
            },
             {
              label: 'Command Model',
              to: '/docs/command-model',
            },
          ],
        },
        {
          title: 'Contact',
          items: [
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/behnam-rahimpour-18b13a210/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/Reactive-Query-Lab/reactive-query',
            },
            {
              label: 'Email',
              href: 'mailto:behnamrahimpour74@gmail.com'
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'ReactVVM Library',
              href: 'https://github.com/behnamrhp/React-VVM',
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Reactive Query Lab.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.github,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
