import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { dbContext } from '../_01_infra/db-context.js'
import { z } from 'zod'
import { Meal } from '../_02_models/meal.model.js'
import { authenticationisRequired } from '../_03_middlewares/authentication-is-required.js'

export async function mealRoutes(app: FastifyInstance) {

    app.addHook('preHandler', authenticationisRequired)

    app.get('/', async (request: FastifyRequest, response: FastifyReply) => {
        const meals = await dbContext(Meal.table).select()
        return { meals }
    })

    app.get('/:id', async (request: FastifyRequest, response: FastifyReply) => {
        const { id } = z.object({ id: z.uuid() }).parse(request.params)
        const meal = await dbContext(Meal.table).where('id', id).select().first()
        return { meal }
    })

    app.post('/', async (request: FastifyRequest, response: FastifyReply) => {
        const newItem = new Meal(Meal.schema.parse(request.body))
        const addedItem = await dbContext(Meal.table).insert(newItem.data).returning('*')
        console.log('Meal > POST', newItem, addedItem)
        response.statusCode = 201
        return { newItem }
    })

    app.put('/', async (request: FastifyRequest, response: FastifyReply) => {
        const newItem = new Meal(Meal.schema.parse(request.body))
        const editedItem = await dbContext(Meal.table).update(newItem.data).returning('*')
        console.log('Meal > PUT', newItem, editedItem)
        response.statusCode = 200
        return { editedItem }
    })

    app.delete('/:id', async (request: FastifyRequest, response: FastifyReply) => {
        const { id } = z.object({ id: z.uuid() }).parse(request.params)
        await dbContext(Meal.table).where('id', id).select().first().delete()
        response.statusCode = 204
    })
}