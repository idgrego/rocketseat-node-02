import { type FastifyRequest, type FastifyReply, fastify } from "fastify"
import { dbContext } from "../_01_infra/db-context.js"
import { User } from "../_02_models/user.model.js"

export async function authenticationisRequired(request: FastifyRequest, response: FastifyReply)  {
    if (!request.cookies.sessionId)
        return response.status(401).send({ error: 'Unauthorized' })

    const sessionId = request.cookies.sessionId
    const user = await dbContext(User.table).where('sessionId', sessionId).select().first()
    if (!user)
        return response.status(401).send({ error: 'Unauthorized' })
    
    request.headers['userId'] = user.id;
}