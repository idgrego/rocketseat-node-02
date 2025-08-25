import fastify from 'fastify'
import { userRoutes } from './_04_routes/user.route.js'
import { mealRoutes } from './_04_routes/meal.route.js'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)
app.register(userRoutes)
app.register(mealRoutes, {prefix: '/meal'})