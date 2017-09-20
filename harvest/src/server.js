const express = require('express');
const config = require('./config');
const app = express();

global.d = require('neat-dump');

app.use(d.middleware());
app.use('/doc', express.static('./doc'));
app.use('/ticker', require('./routes/ticker'));
app.use('/latest', require('./routes/latest'));

app.listen(config.port, function () {
  d.info('App listening on port ' + config.port);
});
