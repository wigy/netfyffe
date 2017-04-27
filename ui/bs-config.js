let proxy = require('http-proxy-middleware');

module.exports = {
  "server": {
    "baseDir": "src",
    "routes": {
      "/node_modules": "node_modules",
    },
  }
};
