const knexfile = require('../knexfile');

const config = {
    develop: {
        // Server port
        port: process.env.PORT || 9000,
        // Database settings for Knex
        database: knexfile.development,
    },

    production: {
        // Server port
        port: process.env.PORT || 9000,
        // Database settings for Knex
        database: knexfile.production,
    },
};

const env = process.env.NODE_ENV || 'develop';

module.exports = config[env];
