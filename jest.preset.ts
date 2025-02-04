const nxPreset = require('@nrwl/jest/preset').default

const testTimeout = process.env.CI ? 15000 : 20000

const JEST_CONFIG_PATH = `${__dirname}/scripts/jest`

module.exports = {
  ...nxPreset,
  setupFiles: [`${JEST_CONFIG_PATH}/setupFiles.js`],
  // globalSetup: `${JEST_CONFIG_PATH}/globalSetup.js`,
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    // `${JEST_CONFIG_PATH}/setupFilesAfterEnv.js`,
  ],
  testTimeout,
  /**
   * Some NPM modules are written in ES6, and must be transformed with babel. node_modules is ignored by default because there are too many packages to transform, so we only transform the ones we have to.
   */
  // transformIgnorePatterns: [
  //   '<rootDir>/node_modules/(?!(stringify-object|is-regexp|is-obj|cheerio)/)',
  // ],
}
