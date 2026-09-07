import { getConnection } from '@evershop/evershop/lib/postgres';

export default async function blogPost(request, response, next) {
  const connection = await getConnection();
  try {
    if (request.method === 'DELETE') {
      const result = await connection.query(`DELETE FROM ffs_blog_post WHERE post_id=$1`, [request.params.id]);
      return result.rowCount ? response.json({ success: true }) : response.status(404).json({ error: 'Post not found.' });
    }
    const body = request.body;
    const slug = String(body.slug || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!body.title?.trim() || !slug || !body.excerpt?.trim() || !body.content?.trim()) {
      return response.status(400).json({ error: 'Title, slug, excerpt, and content are required.' });
    }
    const { rows } = await connection.query(
      `UPDATE ffs_blog_post SET title=$2,slug=$3,excerpt=$4,content=$5,image=$6,category=$7,
       status=$8,meta_title=$9,meta_description=$10,published_at=$11,updated_at=NOW()
       WHERE post_id=$1 RETURNING *`,
      [request.params.id, body.title.trim(), slug, body.excerpt.trim(), body.content.trim(),
       String(body.image || '').trim(), String(body.category || 'Updates').trim(),
       body.status === 'published' ? 'published' : 'draft',
       String(body.metaTitle || body.title).trim(), String(body.metaDescription || body.excerpt).trim(),
       body.publishedAt || new Date().toISOString()]
    );
    return rows.length ? response.json({ data: rows[0] }) : response.status(404).json({ error: 'Post not found.' });
  } catch (error) {
    if (error?.code === '23505') return response.status(400).json({ error: 'This slug is already in use.' });
    return next(error);
  } finally {
    connection.release();
  }
}
