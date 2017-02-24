const express = require('express');
const config = require('./config');
const app = express();

const d = require('neat-dump');
d.config.showSourceLine = false;
global.d = d;

app.get('/', (req, res) => {
  res.redirect('/quote/');
});

app.use('/quote', require('./routes/quote'));

app.listen(config.port, function () {
  d.info('App listening on port ' + config.port);
});
