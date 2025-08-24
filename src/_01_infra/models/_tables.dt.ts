// eslint-disable-next-line
import { Knex } from 'knex'
import type { IUser } from './user.js'
import type { IMeal } from './meal.js'

declare module 'knex/types/tables.js' {
  interface Tables {
    users: IUser
    meals: IMeal
  }
}
