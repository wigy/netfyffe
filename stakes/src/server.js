const { SocketServerAuth } = require('rtds-server');
const config = require('./config');

new SocketServerAuth(config).run();
