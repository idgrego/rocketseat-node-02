import { app } from './server-setup.js'
import { env } from './_01_infra/enviroments/env-data.js'

app
  .listen({ port: env.HTTP_PORT })
  .then(() => console.log(`HTTP Server Running at ${env.HTTP_PORT}`))
