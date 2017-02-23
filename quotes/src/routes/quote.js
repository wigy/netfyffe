const express = require('express');
const quote = express.Router();

// TODO: Move to configuration.
const knex = require('knex')( {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    useNullAsDefault: true
  });

quote.get('/', (req, res) => {
    knex.select().from('tickers').then(data => res.send(data));
});

module.exports = quote;
