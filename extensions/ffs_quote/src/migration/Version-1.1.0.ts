import { execute } from '@evershop/postgres-query-builder';

export default async (connection) => {
  await execute(connection, `
    ALTER TABLE ffs_quote_request
      ADD COLUMN IF NOT EXISTS address_1 varchar,
      ADD COLUMN IF NOT EXISTS address_2 varchar,
      ADD COLUMN IF NOT EXISTS city varchar,
      ADD COLUMN IF NOT EXISTS country varchar,
      ADD COLUMN IF NOT EXISTS province varchar,
      ADD COLUMN IF NOT EXISTS postcode varchar
  `);
};
