import type { FastifyRequest, FastifyReply } from "fastify"

export async function authenticationisRequired(request: FastifyRequest, response: FastifyReply)  {
    if (!request.cookies.sessionId) {
        return response.status(401).send({ error: 'Unauthorized' })
    }
}