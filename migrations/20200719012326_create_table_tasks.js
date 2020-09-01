exports.up = function (knex) {
  return knex.schema.createTable("task", (table) => {
    table.increments("id").primary();
    table.string("desc").notNull();
    table.datetime("estimateAt");
    table.datetime("doneAt");
    table.integer("userId").references("id").inTable("user").notNull();
  });
};

exports.down = function (knex) {
  return tableknex.schema.dropTable("task");
};
