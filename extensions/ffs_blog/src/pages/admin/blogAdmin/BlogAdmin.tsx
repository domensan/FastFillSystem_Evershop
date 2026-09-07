import React from 'react';

const emptyPost = {
  post_id: null, title: '', slug: '', excerpt: '', content: '', image: '',
  category: 'Updates', status: 'draft', meta_title: '', meta_description: '',
  published_at: new Date().toISOString().slice(0, 16)
};

export default function BlogAdmin({ postsApi }) {
  const [posts, setPosts] = React.useState<any[]>([]);
  const [form, setForm] = React.useState(emptyPost);
  const [error, setError] = React.useState('');

  const load = () => fetch(postsApi).then((response) => response.json()).then(({ data }) => setPosts(data));
  React.useEffect(() => { load().catch(() => setError('Could not load posts.')); }, [postsApi]);

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function save(event) {
    event.preventDefault();
    setError('');
    const response = await fetch(form.post_id ? `${postsApi}/${form.post_id}` : postsApi, {
      method: form.post_id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title, slug: form.slug, excerpt: form.excerpt, content: form.content,
        image: form.image, category: form.category, status: form.status,
        metaTitle: form.meta_title, metaDescription: form.meta_description,
        publishedAt: form.published_at
      })
    });
    const result = await response.json();
    if (!response.ok) return setError(result.error || 'Could not save the post.');
    setForm(emptyPost);
    return load();
  }

  async function remove(post) {
    if (!window.confirm(`Delete “${post.title}”?`)) return;
    const response = await fetch(`${postsApi}/${post.post_id}`, { method: 'DELETE' });
    if (!response.ok) return setError('Could not delete the post.');
    if (form.post_id === post.post_id) setForm(emptyPost);
    return load();
  }

  function edit(post) {
    setForm({ ...post, published_at: new Date(post.published_at).toISOString().slice(0, 16) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="page-width py-8">
      <h1 className="text-3xl font-bold mb-6">FFS Updates</h1>
      {error && <p role="alert" className="text-destructive mb-4">{error}</p>}
      <form onSubmit={save} className="border rounded-lg p-6 space-y-4 mb-8">
        <h2 className="text-xl font-bold">{form.post_id ? 'Edit Post' : 'New Post'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>Title<input className="form-field mt-1" name="title" value={form.title} onChange={change} required /></label>
          <label>Slug<input className="form-field mt-1" name="slug" value={form.slug} onChange={change} required /></label>
          <label>Category<input className="form-field mt-1" name="category" value={form.category} onChange={change} /></label>
          <label>Image URL<input className="form-field mt-1" name="image" value={form.image || ''} onChange={change} placeholder="/ffs/updates/image.jpg" /></label>
          <label>Status<select className="form-field mt-1" name="status" value={form.status} onChange={change}><option value="draft">Draft</option><option value="published">Published</option></select></label>
          <label>Publish Date<input className="form-field mt-1" type="datetime-local" name="published_at" value={form.published_at} onChange={change} /></label>
        </div>
        <label className="block">Excerpt<textarea className="form-field mt-1" name="excerpt" rows={3} value={form.excerpt} onChange={change} required /></label>
        <label className="block">Content (HTML)<textarea className="form-field mt-1 font-mono" name="content" rows={14} value={form.content} onChange={change} required /></label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>SEO Title<input className="form-field mt-1" name="meta_title" value={form.meta_title || ''} onChange={change} /></label>
          <label>SEO Description<textarea className="form-field mt-1" name="meta_description" rows={2} value={form.meta_description || ''} onChange={change} /></label>
        </div>
        <div className="flex gap-3"><button className="button primary">{form.post_id ? 'Save Changes' : 'Create Post'}</button>{form.post_id && <button type="button" className="button" onClick={() => setForm(emptyPost)}>Cancel</button>}</div>
      </form>
      <div className="space-y-3">
        {posts.map((post) => <article key={post.post_id} className="border rounded-lg p-4 flex justify-between gap-4"><div><strong>{post.title}</strong><p className="text-textSubdued">{post.status} · {new Date(post.published_at).toLocaleDateString()}</p></div><div className="flex gap-3"><button onClick={() => edit(post)}>Edit</button><button className="text-critical" onClick={() => remove(post)}>Delete</button></div></article>)}
      </div>
    </div>
  );
}

export const layout = { areaId: 'content', sortOrder: 10 };
export const query = `query BlogAdmin { postsApi: url(routeId: "manageBlogPosts") }`;
