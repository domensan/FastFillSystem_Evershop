import { getConnection } from '@evershop/evershop/lib/postgres';

const fields = (body) => ({
  title: String(body.title || '').trim(),
  slug: String(body.slug || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  excerpt: String(body.excerpt || '').trim(),
  content: String(body.content || '').trim(),
  image: String(body.image || '').trim(),
  category: String(body.category || 'Updates').trim(),
  status: body.status === 'published' ? 'published' : 'draft',
  metaTitle: String(body.metaTitle || '').trim(),
  metaDescription: String(body.metaDescription || '').trim(),
  publishedAt: body.publishedAt || new Date().toISOString()
});

export default async function blogPosts(request, response, next) {
  const connection = await getConnection();
  try {
    if (request.method === 'GET') {
      const { rows } = await connection.query(`SELECT * FROM ffs_blog_post ORDER BY published_at DESC`);
      return response.json({ data: rows });
    }
    const post = fields(request.body);
    if (!post.title || !post.slug || !post.excerpt || !post.content) {
      return response.status(400).json({ error: 'Title, slug, excerpt, and content are required.' });
    }
    const { rows } = await connection.query(
      `INSERT INTO ffs_blog_post
       (title,slug,excerpt,content,image,category,status,meta_title,meta_description,published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [post.title, post.slug, post.excerpt, post.content, post.image, post.category,
       post.status, post.metaTitle || post.title, post.metaDescription || post.excerpt, post.publishedAt]
    );
    return response.status(201).json({ data: rows[0] });
  } catch (error) {
    if (error?.code === '23505') return response.status(400).json({ error: 'This slug is already in use.' });
    return next(error);
  } finally {
    connection.release();
  }
}
