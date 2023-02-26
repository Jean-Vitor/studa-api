const { resolve } = require('path');

const root = resolve(__dirname);
const jestGlobalConfig = require(`${root}/jest.config.js`);

module.exports = {
  ...jestGlobalConfig,
  displayName: 'e2e-tests',
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.js'],
  testMatch: ['<rootDir>/test/**/*.test.ts'],
};
