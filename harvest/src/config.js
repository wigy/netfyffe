const config = {
    develop: {
        // Server port
        port: process.env.PORT || 9001,
        // Path to the harverster implementation.
        harvester_module: process.env.HARVEST_MODULE,
    },

    production: {
        // Server port
        port: process.env.PORT || 9001,
        // Path to the harverster implementation.
        harvester_module: process.env.HARVEST_MODULE,
    },
};

const env = process.env.NODE_ENV || 'develop';

module.exports = config[env];
