const express = require('express');
const config = require('./config');
const app = express();

global.d = require('neat-dump');
if (!config.harvestModules) {
  throw new Error("The harvester modules are not defined in HARVEST_MODULES environment variable.");
}
d.info("Using harvest-modules", config.harvestModules);
app.use(d.middleware());
app.use('/doc', express.static('./doc'));
app.use('/ticker', require('./routes/ticker'));

app.listen(config.port, function () {
  d.info('App listening on port ' + config.port);
});
