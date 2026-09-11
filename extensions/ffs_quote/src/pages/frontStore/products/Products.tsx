import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

const primaryCategories = [
  ['Fuel Nozzles', '/fuel-nozzles', '/ffs/home/nozzle.png'],
  ['Couplers', '/couplers', '/ffs/home/couplers.png'],
  ['Fuel Receivers', '/fuel-receivers', '/ffs/home/receivers.png'],
  ['Fuel Vents', '/fuel-vents', '/ffs/home/vents.png'],
  ['Pressureless', '/pressureless', '/ffs/home/pressureless.png']
];

const categoryChildren = {
  Couplers: ['Standard Crankcase'],
  'Fuel Nozzles': ['Atlas', 'Pitboss', 'SureLoc 150', 'SureLoc 1000', 'Parts'],
  'Fuel Receivers': ['Check Valve', 'Standard Receiver', 'Deep Socket Tool', 'Parts'],
  'Fuel Vents': ['Filtered Fuel Vent', 'Standard Fuel Vent', 'Anti-Vandalism Flange', 'Bolt-on Flange', 'Half Coupling', 'High Flow Vent', 'NPT Adapter', 'Safety Relief Fuel Vent', 'Whistle Adapter', 'Parts'],
  Pressureless: ['High Flow Pressureless', 'Small Tank Pressureless', 'Parts']
};

export default function Products({ categories, searchUrl }) {
  const categoryUrls = new Map(categories.items.map((item) => [item.name, item.url]));
  const categoryRootIds = new Map(categories.items.map((item) => [item.name, item.categoryId]));

  function search(event) {
    event.preventDefault();
    const keyword = new FormData(event.currentTarget).get('keyword')?.toString().trim();
    if (keyword) window.location.href = `${searchUrl}?keyword=${encodeURIComponent(keyword)}`;
  }

  return (
    <main className="ffs-products-page">
      <header className="ffs-products-title page-width">
        <p className="ffs-kicker">Fast Fill Systems</p>
        <h1>{_('Our Products')}</h1>
      </header>
      <div className="ffs-products-layout page-width">
        <aside className="ffs-products-sidebar">
          <form onSubmit={search} className="ffs-products-search">
            <label className="sr-only" htmlFor="product-search">{_('Search products')}</label>
            <input id="product-search" name="keyword" type="search" placeholder={_('Search...')} />
            <button aria-label={_('Search products')}>⌕</button>
          </form>
          <h2>{_('Product Categories')}</h2>
          <nav aria-label={_('Product categories')}>
            {primaryCategories.map(([name, url]) => (
              <details key={name}>
                <summary><a href={url}>{_(name)}</a></summary>
                <div>
                  {(categoryChildren[name] || []).map((child) => {
                    const rootId = categoryRootIds.get(name);
                    const nestedUrl = rootId !== undefined && categories.items.find((item) =>
                      item.parent?.categoryId === rootId && item.name === child)?.url;
                    return (
                      <a key={`${name}-${child}`} href={nestedUrl || categoryUrls.get(child) || url}>{_(child)}</a>
                    );
                  })}
                </div>
              </details>
            ))}
          </nav>
        </aside>

        <section className="ffs-products-categories" aria-label="Primary product categories">
          {primaryCategories.map(([name, url, image], index) => (
            <a className="ffs-products-category ffs-reveal" key={name} href={url}>
              <div><img src={image} alt="" loading={index > 2 ? 'lazy' : 'eager'} /></div>
              <h2>{_(name)}</h2>
            </a>
          ))}
        </section>
      </div>
    </main>
  );
}

export const layout = { areaId: 'content', sortOrder: 10 };

export const query = `
  query ProductsPage {
    categories(filters: [{ key: "limit", operation: eq, value: "100" }]) {
      items { categoryId parent { categoryId } name url }
    }
    searchUrl: url(routeId: "catalogSearch")
  }
`;
