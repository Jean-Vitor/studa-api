/**
 * @param { import('knex').Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function (knex) {
  return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('users', (table) => {
      table.uuid('id')
        .primary()
        .notNullable()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name')
        .notNullable();
      table.string('email')
        .unique()
        .notNullable();
      table.string('password')
        .notNullable();
      table.boolean('active')
        .notNullable()
        .defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('refresh_tokens', (table) => {
      table.uuid('id')
        .primary()
        .notNullable()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('refresh_token')
        .notNullable();
      table.uuid('user_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('users');
      table.timestamps(true, true);
    })
    .createTable('confirmation_tokens', (table) => {
      table.uuid('id')
        .primary()
        .notNullable()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('confirmation_token')
        .notNullable();
      table.uuid('user_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('users');
      table.timestamps(true, true);
    });
  ;
};

/**
 * @param { import('knex').Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('refresh_tokens').dropTableIfExists('confirmation_tokens').dropTableIfExists('users')
    .raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
};
