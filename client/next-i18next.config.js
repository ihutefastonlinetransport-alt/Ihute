const path = require('path');
const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'sw', 'rw'],
  ns: ['common', 'booking', 'admin', 'driver'],
  defaultNS: 'common',
  localePath: path.resolve('./public/locales'),
};
module.exports = i18n;
