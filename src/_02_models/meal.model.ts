import { randomUUID } from "crypto"
import { z } from 'zod'

export interface IMeal {
  id: string
  userId: string
  name: string
  description: string
  belongDiet: boolean
  date: Date | string
}

export class Meal {

  readonly #item: IMeal
  public get data() { return this.#item }

  public id() { return this.#item.id }

  public get userId() { return this.#item.userId }
  public set userId(v: string) { this.#item.userId = v }

  public get name() { return this.#item.name }
  public set name(v: string) { this.#item.name = v }

  public get description() { return this.#item.description }
  public set description(v: string) { this.#item.description = v }

  public get belongDiet() { return this.#item.belongDiet }
  public set belongDiet(v: boolean) { this.#item.belongDiet = v }

  public get date() { return this.#item.date }
  public set date(v: Date | string) { this.#item.date = v }

  constructor(item: IMeal | null = null) {
    this.#item = item || {
      id: randomUUID(),
      userId: '',
      name: '',
      description: '',
      belongDiet: false,
      date: new Date()
    }

    if (!this.#item.id) this.#item.id = randomUUID()
  }

  public static get table() { return 'Meals'}

  static #schema: any = null
  public static get schema() {
    if (!this.#schema) {
      this.#schema = z.object({
        id: z.uuid().default(randomUUID()),
        userId: z.uuid(),
        name: z.string(),
        description: z.string(),
        belongDiet: z.boolean(),
        date: z.date()
      })  
    }
    return this.#schema
  }

}