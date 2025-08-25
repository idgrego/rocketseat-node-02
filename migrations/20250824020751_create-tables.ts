import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Users', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('email').notNullable()
    table.text('pwd').notNullable()
    table.uuid('sessionId').nullable()
  })

  await knex.schema.createTable('Meals', (table) => {
    table.uuid('id').primary()
    table.uuid('userId').notNullable().references('id').inTable('Users')
    table.text('name').notNullable()
    table.text('description')
    table.boolean('belongDiet').notNullable().defaultTo(false)
    table.date('date').notNullable().defaultTo(new Date())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('Meals')
  await knex.schema.dropTable('Users')
}
