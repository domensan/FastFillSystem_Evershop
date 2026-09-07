import { getConnection } from '@evershop/evershop/lib/postgres';

const statuses = ['received', 'reviewing', 'quoted', 'closed'];

export default async function updateQuote(request, response, next) {
  if (!statuses.includes(request.body?.status)) {
    return response.status(400).json({ error: 'Invalid status.' });
  }
  const connection = await getConnection();
  try {
    const { rows } = await connection.query(
      `UPDATE ffs_quote_request SET status=$1 WHERE reference=$2
       RETURNING reference, status`,
      [request.body.status, request.params.reference]
    );
    if (!rows.length) return response.status(404).json({ error: 'Quote not found.' });
    return response.json({ data: rows[0] });
  } catch (error) {
    return next(error);
  } finally {
    connection.release();
  }
}
