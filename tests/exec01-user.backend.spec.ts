import { beforeAll, afterAll, describe, test, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/server-setup.js'
//import { execSync } from 'node:child_process'

beforeAll(async () => {
    await app.ready()
    /* poderia ser feito assim, mas quando tem mais de 1 arquivo dá erro.
       nesse caso é melhor usar o setup para executar 1 vez antes de tudo
    execSync('npm run test:knex:rollback -- --all')
    execSync('npm run test:knex:latest') 
    */
})

afterAll(async () => {
    await app.close()
})

describe('UserController', async () => {

    test.sequential('seq-01 - register-success: the user should be able register himself', async () => {

        // esse 1° bloco serve para excluir o usuário caso ele já exista
        // apesar do banco ser recriado, quando o watch detecta a alteração não recria o arquivo do banco.
        const response = await request(app.server).get('/user/teste1@email.com').send()
        if (response.statusCode == 200)
            await request(app.server).delete(`/user/${response.body.user.id}`).send()

        await request(app.server).post('/register') 
            .send({
                  name: 'teste #1',
                  email: 'teste1@email.com', 
                  pwd: '123456',
                  sessionId: null
            }).expect(201)
    })

    test.sequential('seq-02 - register-fail: the backend should not allow the same e-mail twice', async () => {
        const response = await request(app.server).post('/register')
            .send({
                  name: 'teste #2',
                  email: 'teste1@email.com',
                  pwd: '123456',
                  sessionId: null
                })
        expect(response.statusCode).toBe(409)
    })

    test.sequential('seq-03 - login-fail: the user should be able to login', async () => {
        await request(app.server).post('/login')
            .send({
                email: 'teste1@email.com',
                pwd: '1234567'
            }).expect(401)
    })

    test.sequential('seq-04 - login-success: the user should be able to login', async () => {
        await request(app.server).post('/login')
            .send({
                email: 'teste1@email.com',
                pwd: '123456'
            })
            .expect(200)
    })

    test.sequential('seq-05 - the user should be able to logout', async () => {
        await request(app.server).get('/logout')
            .send().expect(204)
    })

})