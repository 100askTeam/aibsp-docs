// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AI BSP',
  tagline: 'ACE Linux Dev',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://dshanpi.100ask.net',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: '100askTeam', // Usually your GitHub org/user name.
  projectName: 'aibsp-docs', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/100askTeam/aibsp-docs/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true,
        },
      },
      navbar: {
        title: 'AI BSP',
        logo: {
          alt: 'ACE Linux',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'aigeneralSidebar',
            position: 'left',
            label: 'AI赋能指南',
          }, 
          {
            type: 'dropdown',
            label: 'Allwinner系列',
            position: 'left',
            items: [
              {
              type: 'docSidebar',
              sidebarId: 't113s3proSidebar',
              label: 'T113s3-PRO',
              },
              {
              type: 'docSidebar',
              sidebarId: 't113iSidebar',
              label: 'T113i-Industrial',
              },
              {
              type: 'docSidebar',
              sidebarId: 'a133Sidebar',
              label: 'A133-mCore',
              },
              {
              type: 'docSidebar',
              sidebarId: 't527Sidebar',
              label: 'T527-AvaotaA1',
              },
              {
              type: 'docSidebar',
              sidebarId: 't153mxSidebar',
              label: 'T153-Dual4GGateway',
              },                                 
            ],
          },
          {
            type: 'dropdown',
            label: 'RockChip系列',
            position: 'left',
            items: [
              {
              type: 'docSidebar',
              sidebarId: 'dshannezhastuSidebar',
              label: 'RK3568-DshanPI-R1+',
              },                                            
            ],
          }, 
          {
            type: 'dropdown',
            label: 'NXP系列',
            position: 'left',
            items: [
              {
              type: 'docSidebar',
              sidebarId: 'r818Sidebar',
              label: '100ASK_IMX6ULL-PRO',
              },                           
            ],
          },
          {
            type: 'dropdown',
            label: 'STM32系列',
            position: 'left',
            items: [
              {
              type: 'docSidebar',
              sidebarId: 'a527Sidebar',
              label: 'STM32MP157',
              },                           
            ],
          },                                       
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} 100askTeam, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),

  // Add the Mermaid plugin and enable it in markdown
  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        language: ["en", "zh"],
      },
    ],
  ],
};

export default config;
