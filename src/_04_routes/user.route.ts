import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import {z} from 'zod'
import { randomUUID } from 'crypto'

import { env } from '../_01_infra/env-data.js'
import { dbContext } from '../_01_infra/db-context.js'
import { Login } from '../_02_models/login.model.js'
import { User } from '../_02_models/user.model.js'
import { mustBeUnautheticated } from '../_03_middlewares/must-be-unauthenticated.js'

export async function userRoutes(app: FastifyInstance) {
    app.post('/login', async (request: FastifyRequest, response: FastifyReply) => {
        const { email, pwd } = Login.schema.parse(request.body)

        const user = await dbContext(User.table).where({'email': email, 'pwd': pwd}).select().first()
        if (user) {

            if (!user.sessionId) {
                user.sessionId = randomUUID()
                await dbContext(User.table).where('id', user.id).update(user)
            }

            response.cookie('sessionId', user.sessionId, {
                path: '/', 
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            })

            response.statusCode = 200
            return { name: user.name }
        } else {
            response.statusCode = 401
            return { message: 'Invalid credentials' }
        }
    })

    app.get('/logout', async (request: FastifyRequest, response: FastifyReply) => {
        const sessionId = request.cookies.sessionId
        response.clearCookie('sessionId')
        response.statusCode = 204
        if (sessionId) {
            const user = await dbContext(User.table).where('sessionId', sessionId).select().first()
            if (user) {
                user.sessionId = null
                await dbContext(User.table).where('id', user.id).update(user)
            }
        }
    })

    app.post('/register', { preHandler: [mustBeUnautheticated] }, async (request: FastifyRequest, response: FastifyReply) => {
        const newUser = new User(User.schema.parse(request.body))
        const user = await dbContext(User.table).where('email', newUser.email).select().first()
        if (user) return response.status(409).send({ error: 'The e-mail is already in use.' })
        await dbContext(User.table).insert(newUser.data)
        return response.status(201).send({ message: 'Register has been done' })
    })

    if (env.NODE_ENV == 'test') {
        app.get('/user/:email', async (request: FastifyRequest, response: FastifyReply) => {
            const { email } = z.object({ email: z.email() }).parse(request.params)
            const user = await dbContext(User.table).where('email', email).select().first()
            if (user) return { user }
            response.statusCode = 404
            return { message: 'User not found' }
        })
    
        app.get('/users', async (request: FastifyRequest, response: FastifyReply) => {
            const users = await dbContext(User.table).select()
            return { users }
        })

        app.delete('/user/:id', async (request: FastifyRequest, response: FastifyReply) => {
            const { id } = z.object({ id: z.uuid() }).parse(request.params)
            const dbItem = await dbContext(User.table).where({'id': id}).select().first()
            response.statusCode = 204
            if (dbItem)
                await dbContext(User.table).where({'id': id}).select().first().delete()
        })
    }
}