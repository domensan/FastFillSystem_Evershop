const mapPost = (post) => post && ({
  postId: post.post_id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: post.content,
  image: post.image,
  category: post.category,
  status: post.status,
  metaTitle: post.meta_title,
  metaDescription: post.meta_description,
  publishedAt: post.published_at.toISOString(),
  url: `/updates/${post.slug}`
});

export default {
  Query: {
    blogPosts: async (_, __, { pool }) => {
      const { rows } = await pool.query(
        `SELECT * FROM ffs_blog_post WHERE status='published' AND published_at <= NOW()
         ORDER BY published_at DESC`
      );
      return rows.map(mapPost);
    },
    currentBlogPost: async (_, __, { currentRoute, pool }) => {
      if (currentRoute?.id !== 'blogPost' || !currentRoute.params?.slug) return null;
      const { rows } = await pool.query(
        `SELECT * FROM ffs_blog_post WHERE slug=$1 AND status='published' AND published_at <= NOW()`,
        [currentRoute.params.slug]
      );
      return mapPost(rows[0]);
    }
  }
};
