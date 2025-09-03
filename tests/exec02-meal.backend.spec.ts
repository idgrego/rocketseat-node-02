import { beforeAll, afterAll, describe, test, expect } from 'vitest'
import st from 'supertest'
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

describe('MealController', async () => {

    let cookies: string[] = []
    let userId: string = ''

    test.sequential('seq-01 - create new user and get sessionId', async () => {

        // esse 1° bloco serve para excluir o usuário caso ele já exista
        // apesar do banco ser recriado, quando o watch detecta a alteração não recria o arquivo do banco.
        let response = await st(app.server).get('/user/teste2@email.com').send()
        if (response.statusCode == 200)
            await st(app.server).delete(`/user/${response.body.user.id}`).send()

        await st(app.server).post('/register')
            .send({
                name: 'teste #2',
                email: 'teste2@email.com',
                pwd: '123456',
                sessionId: null
            })
            .expect(201)

        response = await st(app.server).post('/login')
            .send({
                email: 'teste2@email.com',
                pwd: '123456'
            })
            .expect(200)

        cookies = response.get('Set-Cookie') || []

        response = await st(app.server).get('/user/teste2@email.com')
            .set('Cookie', cookies)
            .send().expect(200)

        userId = response.body.user.id
    })

    test.sequential('seq-02 - create three meals', async () => {  
        if (!userId) expect(!!userId).toBe(true)
        else {

            // esse 1° bloco serve para excluir o usuário caso ele já exista
            // apesar do banco ser recriado, quando o watch detecta a alteração não recria o arquivo do banco.
            await st(app.server).delete(`/meal/byuser/${userId}`).send()

            await st(app.server).post('/meal')
                .set('Cookie', cookies)
                .send({
                    userId: userId,
                    name: 'breakfast',
                    description: 'eggs with bread and milk',
                    belongDiet: true,
                    date: new Date().toISOString()
                })
                .expect(201)

            await st(app.server).post('/meal')
                .set('Cookie', cookies)
                .send({
                    userId: userId,
                    name: 'lunch',
                    description: 'rice, beans and chiken',
                    belongDiet: true,
                    date: new Date().toISOString()
                })
                .expect(201)

            await st(app.server).post('/meal')
                .set('Cookie', cookies)
                .send({
                    userId: userId,
                    name: 'afternoon',
                    description: 'sanduiche',
                    belongDiet: false,
                    date: new Date().toISOString()
                })
                .expect(201)
        }
    })

    test.sequential('seq-03 - list the meals', async () => {
        const res = await st(app.server).get('/meal')
            .set('Cookie', cookies)
            .send().expect(200)
        expect(res.body).toHaveProperty('meals')
        expect(res.body.meals.length).toBe(3)
    })

})