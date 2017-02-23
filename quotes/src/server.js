const express = require('express');
const config = require('./config');
const app = express();

app.get('/', (req, res) => {
  res.redirect('/quote/');
});

app.use('/quote', require('./routes/quote'));

app.listen(config.port, function () {
  console.log('App listening on port ' + config.port);
});
