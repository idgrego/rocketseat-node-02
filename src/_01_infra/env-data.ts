import z from 'zod'
import { config } from 'dotenv'

// carrega o .env do respectivo ambiente
if (process.env.NODE_ENV) {
  const node_env = process.env.NODE_ENV.trim().toLowerCase()

  switch (node_env) {
    case 'development':
      config({ path: './environments/.env.dev' })
      break

    case 'test':
      config({ path: './environments/.env.test' })
      break

    default:
      throw new Error(`Invalid environment: ${process.env.NODE_ENV}`)
  }
} else {
  throw new Error(`Invalid environment: -- EMPTY --`)
}

// valida as variáveis carregadas
const schema = z.object({
  NODE_ENV: z.string().nullable().default(null),
  DATABASE_URL: z.string(),
  HTTP_PORT: z.coerce.number().default(5000),
})

export const env = schema.parse(process.env)
env.NODE_ENV = process.env.NODE_ENV.trim().toLowerCase()

