module.exports = {
  // PORT number of service.
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3201,
  // Token encryption secret.
  SECRET: process.env.SECRET || 'dfkljopw3iekdlskjlwjeowpspkwqejfrpeåedjascvsfrwewqsdrwsxzvxfds',
  // User name for Tilitintin.
  TILITINTIN_USER: process.env.TILITINTIN_USER || null,
  // Password for Tilitintin.
  TILITINTIN_PASSWORD: process.env.TILITINTIN_PASSWORD || null,
  // Database name for Tilitintin.
  TILITINTIN_DB: process.env.TILITINTIN_DB || null,
  // URL for Tilitintin.
  TILITINTIN_URL: process.env.TILITINTIN_URL || null,
};
