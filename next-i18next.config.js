module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'cs', 'hu'],
    localeDetection: false,
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
