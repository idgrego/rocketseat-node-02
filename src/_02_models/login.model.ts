import { z } from 'zod'

export interface ILogin {
  email: string
  pwd: string
}

export class Login {

  readonly #item: ILogin
  public get data() { return this.#item }

  public get email() { return this.#item.email }
  public set email(v: string) { this.#item.email = v }

  public get pwd() { return this.#item.pwd }
  public set pwd(v: string) { this.#item.pwd = v }

  constructor(item: ILogin | null = null) {
    this.#item = item || {
      email: '',
      pwd: '',
    }
  }

  static #schema: any = null
  public static get schema() {
    if (!this.#schema) {
      this.#schema = z.object({
        email: z.email(),
        pwd: z.string(),
      })  
    }
    return this.#schema
  }

}