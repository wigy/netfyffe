module.exports = {
    // Server port
    // TODO: Uppercase.
    port: process.env.PORT || 9001,
    // Colon separated paths to the harvester modules.
    harvestModules: process.env.HARVEST_MODULES,
    // Kraken API key.
    krakenApiKey: process.env.KRAKEN_API_KEY,
    // Kraken API private key.
    krakenApiPrivateKey: process.env.KRAKEN_API_PRIVATE_KEY,
    // Database setup.
    DATABASE: {
        client: 'sqlite3',
        connection: {
            filename: './storage.sqlite'
        },
        useNullAsDefault: true
    },
};
