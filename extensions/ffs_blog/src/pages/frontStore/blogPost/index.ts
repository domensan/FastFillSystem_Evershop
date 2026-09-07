import { getConnection } from '@evershop/evershop/lib/postgres';
import { setPageMetaInfo } from '../../../../../../node_modules/@evershop/evershop/dist/modules/cms/services/pageMetaInfo.js';

export default async (request, response, next) => {
  const connection = await getConnection();
  try {
    const { rows } = await connection.query(
      `SELECT title, excerpt, meta_title, meta_description FROM ffs_blog_post
       WHERE slug=$1 AND status='published' AND published_at <= NOW()`,
      [request.params.slug]
    );
    if (!rows.length) {
      response.status(404);
      return next();
    }
    const post = rows[0];
    setPageMetaInfo(request, {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt
    });
    return next();
  } catch (error) {
    return next(error);
  } finally {
    connection.release();
  }
};
