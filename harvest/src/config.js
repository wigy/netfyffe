module.exports = {
    // Server port
    PORT: process.env.PORT || 9001,
    // Colon separated paths to the harvester modules.
    HARVEST_MODULES: process.env.HARVEST_MODULES,
    // Database setup.
    DATABASE: {
        client: 'sqlite3',
        connection: {
            filename: __dirname + '/../storage.sqlite'
        },
        useNullAsDefault: true
    },
};
