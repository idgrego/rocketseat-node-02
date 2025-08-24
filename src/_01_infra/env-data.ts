import z from 'zod'
import { config } from 'dotenv'

// carrega o .env do respectivo ambiente
switch (process.env.NODE_ENV) {
  case 'development':
    config({ path: './src/environments/.env.dev' })
    break

  case 'test':
    config({ path: './src/environments/.env.test' })
    break

  default:
    break
}

// valida as variáveis carregadas
const schema = z.object({
  DATABASE_URL: z.string(),
  HTTP_PORT: z.coerce.number().default(5000),
})

export const env = schema.parse(process.env)
