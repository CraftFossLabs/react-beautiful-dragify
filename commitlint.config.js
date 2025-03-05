/* eslint-disable linebreak-style */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [(message) => message.includes('[skip-commitlint]')],
};
