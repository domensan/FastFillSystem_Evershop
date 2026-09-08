import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

const primaryCategories = [
  ['Couplers', '/couplers', '/ffs/home/couplers.png'],
  ['Fuel Nozzles', '/fuel-nozzles', '/ffs/home/nozzle.png'],
  ['Fuel Receivers', '/fuel-receivers', '/ffs/home/receivers.png'],
  ['Fuel Vents', '/fuel-vents', '/ffs/home/vents.png'],
  ['Pressureless', '/pressureless', '/ffs/home/pressureless.png']
];

const categoryChildren = {
  Couplers: ['Standard Crankcase'],
  'Fuel Nozzles': ['Classic', 'Parts', 'Piston Sureloc', 'Pitboss', 'SureLoc', 'Titan'],
  'Fuel Receivers': ['Check Valve', 'Parts', 'Standard Receiver'],
  'Fuel Vents': ['Filtered Fuel Vent', 'Pressureless Filter Vents', 'Standard Fuel Vent'],
  Pressureless: ['High Flow Pressureless', 'Parts', 'Small Tank Pressureless']
};

export default function Products({ categories, searchUrl }) {
  const categoryUrls = new Map(categories.items.map((item) => [item.name, item.url]));
  const nozzleRoot = categories.items.find((item) => item.name === 'Fuel Nozzles');

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
                  {(categoryChildren[name] || []).map((child) => (
                    <a key={`${name}-${child}`} href={(name === 'Fuel Nozzles' && categories.items.find((item) =>
                      item.parent?.categoryId === nozzleRoot?.categoryId && item.name === child)?.url) || categoryUrls.get(child) || url}>{_(child)}</a>
                  ))}
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
