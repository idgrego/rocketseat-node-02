import type { Knex } from 'knex'

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './sqlite-dbs/db_dev.sqlite',
    },
    useNullAsDefault: true,
    migrations: {
      extension: 'ts',
      directory: './migrations',
    },
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: './sqlite-dbs/db_test.sqlite',
    },
    useNullAsDefault: true,
    migrations: {
      extension: 'ts',
      directory: './migrations',
    },
  },

  /* staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  }, */
}

module.exports = config
