const express = require('express');
const config = require('./config');
const app = express();

global.d = require('neat-dump');
if (!config.harvester_module) {
  throw new Error("The harvester module is not defined in HARVEST_MODULE environment variable.");
}
d.info("Using harvest-module", config.harvester_module);
app.use(d.middleware());
app.use('/doc', express.static('./doc'));
app.use('/ticker', require('./routes/ticker'));

app.listen(config.port, function () {
  d.info('App listening on port ' + config.port);
});
