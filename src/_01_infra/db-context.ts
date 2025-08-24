import { env } from './env-data.js'
import { knex } from 'knex'

let auxDbContext = knex({})

switch (process.env.NODE_ENV) {
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
    break
}

export const dbContext = auxDbContext
