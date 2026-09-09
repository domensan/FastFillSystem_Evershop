import { execute } from '@evershop/postgres-query-builder';

export default async (connection) => {
  await execute(connection, `
    ALTER TABLE ffs_quote_request
      ADD COLUMN IF NOT EXISTS industry varchar
  `);
};
