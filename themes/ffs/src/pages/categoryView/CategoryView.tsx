import {
  CategoryData,
  CategoryProvider
} from '@components/frontStore/catalog/CategoryContext.js';
import { CategoryProducts } from '@components/frontStore/catalog/CategoryProducts.js';
import { CategoryProductsPagination } from '@components/frontStore/catalog/CategoryProductsPagination.js';
import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

const categoryGroups = {
  Couplers: ['Standard Crankcase'],
  'Fuel Nozzles': ['Classic', 'Parts', 'Piston Sureloc', 'Pitboss', 'SureLoc', 'Titan'],
  'Fuel Receivers': ['Check Valve', 'Parts', 'Deep Socket Tool', 'Standard Receiver'],
  'Fuel Vents': ['Filtered Fuel Vent', 'Pressureless Filter Vents', 'Standard Fuel Vent', 'Anti-Vandalism Flange', 'Bolt-on Flange', 'Half Coupling', 'High Flow Vent', 'NPT Adapter', 'Safety Relief Fuel Vent', 'Whistle Adapter'],
  Pressureless: ['High Flow Pressureless', 'Parts', 'Small Tank Pressureless']
};

export default function CategoryView({
  category,
  categories,
  searchUrl
}: {
  category: CategoryData;
  categories: { items: Array<{ name: string; url: string; parent: { categoryId: number } | null; categoryId: number }> };
  searchUrl: string;
}) {
  const categoryUrls = new Map(categories.items.map((item) => [item.name.toLowerCase(), item.url]));
  const currentName = category.name.toLowerCase();

  const nozzleRoot = categories.items.find((item) => item.name === 'Fuel Nozzles');
  const isNozzles = currentName === 'fuel nozzles';

  function search(event) {
    event.preventDefault();
    const keyword = new FormData(event.currentTarget).get('keyword')?.toString().trim();
    if (keyword) window.location.href = `${searchUrl}?keyword=${encodeURIComponent(keyword)}`;
  }

  return (
    <CategoryProvider category={category}>
      <main className={`ffs-category-page${isNozzles ? ' ffs-category-page--nozzles' : ''}`}>
        <header className={`ffs-category-title ${isNozzles ? 'ffs-category-banner' : 'page-width'}`}>
          {!isNozzles && <p className="ffs-kicker">Fast Fill Systems</p>}
          <h1>{_(category.name)}</h1>
        </header>
        <div className="ffs-category-layout page-width">
        <aside className="ffs-category-sidebar ffs-products-sidebar">
          <form onSubmit={search} className="ffs-products-search">
            <label className="sr-only" htmlFor="category-search">{_('Search products')}</label>
            <input id="category-search" name="keyword" type="search"
              placeholder={_('Search...')} />
            <button aria-label={_('Search products')}>⌕</button>
          </form>
          <h2>{_('Product Categories')}</h2>
          <nav aria-label={_('Product categories')}>
            {Object.entries(categoryGroups).map(([parent, children]) => {
              const active = parent.toLowerCase() === currentName ||
                children.some((child) => child.toLowerCase() === currentName);
              return (
                <details key={parent} open={active || undefined}>
                  <summary>
                    <a href={categoryUrls.get(parent.toLowerCase()) || '/products'}
                      aria-current={parent.toLowerCase() === currentName ? 'page' : undefined}>
                      {_(parent)}
                    </a>
                  </summary>
                  <div>
                    {children.map((child) => {
                      const nozzleChild = parent === 'Fuel Nozzles' && categories.items.find((item) =>
                        item.parent?.categoryId === nozzleRoot?.categoryId && item.name.toLowerCase() === child.toLowerCase());
                      const url = (nozzleChild && nozzleChild.url) || categoryUrls.get(child.toLowerCase()) ||
                        categoryUrls.get(parent.toLowerCase()) || '/products';
                      return (
                        <a key={`${parent}-${child}`} href={url}
                          aria-current={child.toLowerCase() === currentName ? 'page' : undefined}>
                          {_(child)}
                        </a>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </nav>
        </aside>
        <section className="ffs-category-results">
          <p className="ffs-category-count">
            {category.products.total} {_('products')}
          </p>
          <CategoryProducts />
          <CategoryProductsPagination />
        </section>
        </div>
      </main>
    </CategoryProvider>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 10
};

export const query = `
  query CategoryPage {
    category: currentCategory {
      showProducts
      name
      uuid
      description
      image { alt url }
      products(filters: [{ key: "limit", operation: eq, value: "24" }, { key: "ob", operation: eq, value: "name" }, { key: "od", operation: eq, value: "ASC" }]) {
        items { ...CategoryProduct }
        currentFilters { key operation value }
        total
      }
    }
    categories(filters: [{ key: "limit", operation: eq, value: "100" }]) {
      items { categoryId parent { categoryId } name url }
    }
    searchUrl: url(routeId: "catalogSearch")
  }
`;

export const fragments = `
  fragment CategoryProduct on Product {
    productId
    name
    sku
    inventory { isInStock }
    image { alt url }
    url
  }
`;
