const config = {

    develop: {
        // Server port
        port: process.env.PORT || 9000,
        // Harvest service URI
        harvest: process.env.NETFYFFE_HARVEST || 'http://localhost:9001',
        // Database settings for Knex
        database: {
            client: 'sqlite3',
            connection: {
                filename: './development.sqlite'
            },
            useNullAsDefault: true
        },
    },

    production: {
        // Server port
        port: process.env.PORT || 9000,
        // Database settings for Knex
        database: {
            client: 'postgresql',
            connection: {
                database: 'netfyffe',
                user:     'username',
                password: 'password'
            },
            pool: {
                min: 2,
                max: 10
            },
            migrations: {
                tableName: 'knex_migrations'
            },
            useNullAsDefault: true
        },
    },
};

const env = process.env.NODE_ENV || 'develop';

module.exports = config[env];
