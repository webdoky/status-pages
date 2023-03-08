/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    mainNav: [
      {
        path: '/uk/docs/Web/',
        title: 'Технології',
      },
      { path: '/docs/', title: 'Про проєкт' },
    ],
    licenseLink: '/docs/licensing/',
    ourGithub: 'https://github.com/webdoky',
    analyticsFile: './analytics.json',
  },
  trailingSlash: true,
};

module.exports = nextConfig;
