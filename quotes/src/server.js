const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const app = express();

global.d = require('neat-dump');

app.use(d.middleware());
app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => {
  res.redirect('/quote/');
});
app.use('/quote', require('./routes/quote'));
app.use('/latest', require('./routes/latest'));
app.use('/doc', express.static('./doc'));

app.listen(config.port, function () {
  d.info('App listening on port ' + config.port);
});
