import { randomUUID } from "crypto"
import { z } from 'zod'

export interface IUser {
  id: string
  name: string
  email: string
  pwd: string
  sessionId: string | null
}

export class User {

  readonly #item: IUser
  public get data() { return this.#item }

  public get id() { return this.#item.id }

  public get name() { return this.#item.name }
  public set name(v: string) { this.#item.name = v }

  public get email() { return this.#item.email }
  public set email(v: string) { this.#item.email = v }

  public get pwd() { return this.#item.pwd }
  public set pwd(v: string) { this.#item.pwd = v }

  public get sessionId() { return this.#item.sessionId }
  public set sessionId(v: string | null) { this.#item.sessionId = v }

  constructor(item: IUser | null = null) {
    this.#item = item || {
      id: randomUUID(),
      name: '',
      email: '',
      pwd: '',
      sessionId: null
    }

    if (!this.#item.id) this.#item.id = randomUUID() // só por garantia. nunca ocorre por causa do zod (schema)
  }

  public static get table() { return 'Users'}

  static #schema: any = null
  public static get schema() {
    if (!this.#schema) {
      this.#schema = z.object({
        //id: z.uuid().optional(), // se necessário o ID é gerado no construtor
        id: z.uuid().default(randomUUID), // não é para usar randomUUID(), pois trava o valor
        name: z.string(),
        email: z.email(),
        pwd: z.string(),
        sessionId: z.uuid().nullable().default(null),
      })  
    }
    return this.#schema
  }

}