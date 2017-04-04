const express = require('express');
const config = require('./config');
const app = express();

global.d = require('neat-dump');
d.config.showSourceLine = false;

app.get('/', (req, res) => {
  res.redirect('/fyffe/');
});

app.use('/fyffe', require('./routes/fyffe'));

app.listen(config.port, function () {
  d.info('App listening on port ' + config.port);
});
