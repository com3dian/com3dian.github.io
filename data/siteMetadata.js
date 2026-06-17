/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: "Lu's Log",
  author: 'Zehao Lu',
  headerTitle: "Lu's Log",
  description:
    "Hi, this is Zehao Lu. I'm documenting my learning notes in this blog — research, engineering, and things I find worth writing down.",
  language: 'en-us',
  theme: 'dark',
  siteUrl: 'https://com3dian.github.io',
  siteRepo: 'https://github.com/com3dian/com3dian.github.io',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: 'com3dian@outlook.com',
  github: 'https://github.com/com3dian',
  linkedin: 'https://www.linkedin.com/in/zehao-lu/',
  locale: 'en-US',
  stickyNav: false,
  analytics: {
    // umamiAnalytics: { umamiWebsiteId: process.env.NEXT_UMAMI_ID },
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      // Visit https://giscus.app to enable the app and get these values.
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'en',
    },
  },
}

module.exports = siteMetadata
