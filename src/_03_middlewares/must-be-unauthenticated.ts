import type { FastifyRequest, FastifyReply } from "fastify"

export async function mustBeUnautheticated(request: FastifyRequest, response: FastifyReply)  {
    if (request.cookies.sessionId) {
        return response.status(403).send({ error: 'You are authenticated' })
    }
}