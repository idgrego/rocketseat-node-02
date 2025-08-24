// eslint-disable-next-line
import { Knex } from 'knex'
import type { IUser } from '../_02_models/user.js'
import type { IMeal } from '../_02_models/meal.js'

declare module 'knex/types/tables.js' {
  interface Tables {
    users: IUser
    meals: IMeal
  }
}
