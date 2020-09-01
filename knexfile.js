// Update with your config settings.

module.exports = {
  client: "postgresql",
  connection: {
    database: "tasks",
    user: "tasksappuser",
    password: "123456",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};
