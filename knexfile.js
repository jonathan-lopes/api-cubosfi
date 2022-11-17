require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  test: {
    client: process.env.DB_CLIENT,
    connection: {
      filename: './test/database.sqlite',
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/database/test_migrations`,
    },
    seeds: {
      directory: `${__dirname}/src/database/seeds`,
    },
  },
  production: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/database/migrations`,
    },
    seeds: {
      directory: `${__dirname}/src/database/seeds`,
    },
  },
  onUpdateTrigger: (table) => `
  CREATE TRIGGER ${table}_update_at
  BEFORE UPDATE ON ${table}
  FOR EACH ROW
  EXECUTE PROCEDURE on_update_timestamp();
`,
};
