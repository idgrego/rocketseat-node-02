import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { dbContext } from '../_01_infra/db-context.js'
import { z } from 'zod'
import { Meal } from '../_02_models/meal.model.js'
import { authenticationisRequired } from '../_03_middlewares/authentication-is-required.js'

export async function mealRoutes(app: FastifyInstance) {

    app.addHook('preHandler', authenticationisRequired)

    app.get('/', async (request: FastifyRequest, response: FastifyReply) => {
        const { userId } = z.object({ userId: z.uuid() }).parse(request.headers)
        const meals = await dbContext(Meal.table).where('userId', userId).select()
        return { meals }
    })

    app.get('/:id', async (request: FastifyRequest, response: FastifyReply) => {
        const { userId } = z.object({ userId: z.uuid() }).parse(request.headers)
        const { id } = z.object({ id: z.uuid() }).parse(request.params)
        const meal = await dbContext(Meal.table).where({'id': id, 'userId': userId}).select().first()
        if (!meal) {
            response.statusCode = 404
            return { message: 'Item not found'}
        }
        return { meal }
    })

    app.post('/', async (request: FastifyRequest, response: FastifyReply) => {
        const { userId } = z.object({ userId: z.uuid() }).parse(request.headers)
        const newItem = new Meal(Meal.schema.parse(request.body))

        if (!newItem.userId) newItem.userId = userId
        if (newItem.userId != userId) {
            response.statusCode = 400
            return { message: 'Invalid userId' }
        }

        const addedItem = await dbContext(Meal.table).insert(newItem.data).returning('*')
        response.statusCode = 201
        return { addedItem }
    })

    app.put('/', async (request: FastifyRequest, response: FastifyReply) => {
        const { userId } = z.object({ userId: z.uuid() }).parse(request.headers)
        const newData = new Meal(Meal.schema.parse(request.body))
        
        const dbItem = await dbContext(Meal.table).where({'id': newData.id, 'userId': userId}).select().first()
        if (!dbItem) {
            response.statusCode = 404
            return { message: 'Item not found'}
        }
        
        const editedItem = new Meal(dbItem)
        editedItem.belongDiet = newData.belongDiet
        editedItem.date = newData.date
        editedItem.description = newData.description
        editedItem.name = newData.name

        await dbContext(Meal.table).where('id', newData.id).update(editedItem.data)

        response.statusCode = 200
        return { editedItem: editedItem.data }
    })

    app.delete('/:id', async (request: FastifyRequest, response: FastifyReply) => {
        const { userId } = z.object({ userId: z.uuid() }).parse(request.headers)
        const { id } = z.object({ id: z.uuid() }).parse(request.params)
        const dbItem = await dbContext(Meal.table).where({'id': id, 'userId': userId}).select().first()
        if (!dbItem) {
            response.statusCode = 404
            return { message: 'Item not found' }
        }
        await dbContext(Meal.table).where({'id': id, 'userId': userId}).select().first().delete()
        response.statusCode = 204
    })
}