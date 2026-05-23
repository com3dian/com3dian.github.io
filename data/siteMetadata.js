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
}

module.exports = siteMetadata
