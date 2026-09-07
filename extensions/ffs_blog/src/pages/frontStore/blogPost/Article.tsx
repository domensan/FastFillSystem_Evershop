import React from 'react';

export default function Article({ post, recentPosts }) {
  if (!post) return null;
  return (
    <main className="ffs-article-page">
      <header className="ffs-article-header page-width ffs-reveal">
        <p className="ffs-kicker">{post.category}</p>
        <h1>{post.title}</h1>
        <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
      </header>
      <div className="ffs-article-layout page-width">
        <article className="ffs-article-main ffs-reveal">
          {post.image && <img className="ffs-article-cover" src={post.image} alt="" />}
          <div className="ffs-article-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
        <aside className="ffs-article-recent">
          <p className="ffs-kicker">Our Blog</p><h2>Recent Posts</h2>
          {recentPosts.map((item) => (
            <a href={item.url} key={item.postId}><img src={item.image} alt="" /><span>{item.title}<small>Read More →</small></span></a>
          ))}
        </aside>
      </div>
    </main>
  );
}

export const layout = { areaId: 'content', sortOrder: 10 };
export const query = `query BlogArticle {
  post: currentBlogPost { postId title content image category publishedAt }
  recentPosts: blogPosts { postId title image url }
}`;
