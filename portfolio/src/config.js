const config = {

    develop: {
        // Server port
        port: process.env.PORT || 9002,
        // Quotes service URI
        quotes: process.env.NETFYFFE_QUOTES || 'http://localhost:9000',
        // Database settings for Knex
        database: {
            client: 'sqlite3',
            connection: {
                filename: './development.sqlite'
            },
            useNullAsDefault: true
        },
    },

    test: {
        database: {
            client: 'sqlite3',
            connection: {
                filename: './test.sqlite'
            },
            useNullAsDefault: true
        },
    },

    production: {
        // Server port
        port: process.env.PORT || 9002,
        // Quotes service URI
        quotes: process.env.NETFYFFE_QUOTES || 'http://localhost:9000',
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
