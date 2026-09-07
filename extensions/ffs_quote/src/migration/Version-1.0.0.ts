import { execute } from '@evershop/postgres-query-builder';

export default async (connection) => {
  await execute(connection, `
    CREATE TABLE IF NOT EXISTS ffs_quote_request (
      quote_request_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      reference varchar NOT NULL UNIQUE,
      name varchar NOT NULL,
      company varchar NOT NULL,
      email varchar NOT NULL,
      phone varchar,
      message text,
      items jsonb NOT NULL,
      status varchar NOT NULL DEFAULT 'received',
      created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
