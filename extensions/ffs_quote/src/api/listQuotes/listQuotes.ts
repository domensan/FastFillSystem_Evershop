import { getConnection } from '@evershop/evershop/lib/postgres';

export default async function listQuotes(_request, response, next) {
  const connection = await getConnection();
  try {
    const { rows } = await connection.query(
      `SELECT reference, name, company, email, phone, address_1, address_2,
              city, country, province, postcode, message, items, status, created_at
       FROM ffs_quote_request ORDER BY created_at DESC LIMIT 100`
    );
    response.json({ data: rows });
  } catch (error) {
    next(error);
  } finally {
    connection.release();
  }
}
