// eslint-disable-next-line
import { Knex } from 'knex'
import type { IUser } from '../_02_models/user.model.js'
import type { IMeal } from '../_02_models/meal.model.js'

declare module 'knex/types/tables.js' {
  interface Tables {
    users: IUser
    meals: IMeal
  }
}
