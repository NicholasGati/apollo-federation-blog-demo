exports.up = function (knex) {
  return knex.schema
    .createTable("accounts", function (table) {
      table.uuid("id").primary();
      table.string("email").unique();
      table.string("name");
      table.string("password");
      table.string("role");
    })
    .createTable("roles", function (table) {
      table.string("role").primary().unique();
    })
    .createTable("permissions", function (table) {
      table.string("permission").primary().unique();
    })
    .createTable("roles_permissions", function (table) {
      table.string("role");
      table.foreign("role").references("roles.role");
      table.string("permission");
      table.foreign("permission").references("permissions.permission");
    })
    .createTable("posts", function (table) {
      table.uuid("id").primary();
      table.string("title", 150);
      table.text("content");
      table.uuid("author");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.foreign("author").references("accounts.id");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("accounts")
    .dropTable("roles")
    .dropTable("permissions")
    .dropTable("roles_permission")
    .dropTable("posts");
};
