require('dotenv').config();
// TODO: This is not good way of configuring.
const config = {
    develop: {
        // Server port
        port: process.env.PORT || 9001,
        // Colon separated paths to the harverster modules.
        harvestModules: process.env.HARVEST_MODULES,
        // Kraken API key.
        krakenApiKey: process.env.KRAKEN_API_KEY,
        // Kraken API private key.
        krakenApiPrivateKey: process.env.KRAKEN_API_PRIVATE_KEY,
    },

    production: {
        // Server port
        port: process.env.PORT || 9001,
        // Colon separated paths to the harverster modules.
        harvestModules: process.env.HARVEST_MODULES,
        // Kraken API key.
        krakenApiKey: process.env.KRAKEN_API_KEY,
        // Kraken API private key.
        krakenApiPrivateKey: process.env.KRAKEN_API_PRIVATE_KEY,
    },
};

const env = process.env.NODE_ENV || 'develop';

module.exports = config[env];
