import React from 'react';

export default function Updates({ posts }) {
  const pageSize = 6;
  const [page, setPage] = React.useState(1);
  const pageCount = Math.max(1, Math.ceil(posts.length / pageSize));
  React.useEffect(() => {
    const requested = Number(new URLSearchParams(window.location.search).get('page'));
    if (requested > 1 && requested <= pageCount) setPage(requested);
  }, [pageCount]);
  const visiblePosts = posts.slice((page - 1) * pageSize, page * pageSize);

  function goToPage(nextPage) {
    setPage(nextPage);
    window.history.replaceState({}, '', nextPage === 1 ? '/updates' : `/updates?page=${nextPage}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="ffs-updates-page">
      <header className="ffs-updates-hero">
        <div className="page-width ffs-reveal">
          <p className="ffs-kicker">News, Insights &amp; Technical Knowledge</p>
          <h1>Updates</h1>
        </div>
      </header>
      <section className="ffs-updates-grid page-width">
        {visiblePosts.map((post, index) => (
          <article className={`ffs-update-card ffs-reveal ${index === 0 ? 'ffs-update-card--featured' : ''}`} key={post.postId}>
            <a className="ffs-update-card__image" href={post.url}>
              <img src={post.image} alt="" loading={index ? 'lazy' : 'eager'} />
            </a>
            <div>
              <p className="ffs-kicker">{post.category}</p>
              <h2><a href={post.url}>{post.title}</a></h2>
              <p>{post.excerpt}</p>
              <footer><time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time><a className="ffs-text-link" href={post.url}>Read More <span>→</span></a></footer>
            </div>
          </article>
        ))}
        {pageCount > 1 && (
          <nav className="ffs-updates-pagination" aria-label="Updates pagination">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <button key={number} type="button" aria-current={number === page ? 'page' : undefined}
                onClick={() => goToPage(number)}>{number}</button>
            ))}
          </nav>
        )}
      </section>
      <section className="ffs-updates-newsletter">
        <div className="page-width">
          <p className="ffs-kicker">Get Updates</p><h2>Join Our Newsletter</h2>
          <p>Stay informed about product developments, technical insights, and the latest news from Fast Fill Systems.</p>
          <a className="ffs-button ffs-button--primary" href="mailto:contact@fastfillsystems.com?subject=FFS%20Newsletter">Subscribe</a>
        </div>
      </section>
    </main>
  );
}

export const layout = { areaId: 'content', sortOrder: 10 };
export const query = `query UpdatesPage { posts: blogPosts { postId title slug excerpt image category publishedAt url } }`;
