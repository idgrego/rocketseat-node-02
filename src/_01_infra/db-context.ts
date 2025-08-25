import { env } from './env-data.js'
import knex from 'knex'

let auxDbContext: knex.Knex | null = null

switch (env.NODE_ENV) {
  case 'development':
    auxDbContext = knex({
      client: 'sqlite3',
      connection: {
        filename: env.DATABASE_URL,
      },
      useNullAsDefault: true,
    })
    break

  case 'test':
    auxDbContext = knex({
      client: 'sqlite3',
      connection: {
        filename: env.DATABASE_URL,
      },
      useNullAsDefault: true,
    })
    break

  default:
    throw new Error(`Not implemented dbContext for ${env.NODE_ENV} environment`)
}

export const dbContext = auxDbContext
