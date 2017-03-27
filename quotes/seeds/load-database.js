exports.seed = function(knex, Promise) {
  return require('knex-dump').load(__dirname + '/../knexfile.js', __dirname + '/quotes.json');
};
