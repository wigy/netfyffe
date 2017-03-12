const knexfile = require('../knexfile');

const config = {
    develop: {
        // Server port
        port: process.env.PORT || 9001,
        // Database settings for Knex
        database: knexfile.development,
        harvester_module: process.env.NETFYFFE_HARVEST,
    },

    production: {
        // Server port
        port: process.env.PORT || 9001,
        // Database settings for Knex
        database: knexfile.production,
        harvester_module: process.env.NETFYFFE_HARVEST,
    },
};

const env = process.env.NODE_ENV || 'develop';

module.exports = config[env];
