import {
  CategoryData,
  CategoryProvider
} from '@components/frontStore/catalog/CategoryContext.js';
import { CategoryProducts } from '@components/frontStore/catalog/CategoryProducts.js';
import { CategoryProductsPagination } from '@components/frontStore/catalog/CategoryProductsPagination.js';
import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

// SKU -> display rank for the Fuel Nozzles grid, grouped by family in the
// order the sidebar itself follows (Atlas, Pitboss, SureLoc 150, SureLoc
// 1000). Anything else (Parts, and the odd item still filed directly under
// Fuel Nozzles) sorts after these, alphabetically by name as usual.
const nozzleFamilyRank: Record<string, number> = {
  N150ATp: 0, // Atlas
  '001': 1, // Pitboss
  '001-3-3': 2, // SureLoc 150
  N1000PSLp: 3 // SureLoc 1000
};

const categoryGroups = {
  'Fuel Nozzles': ['Atlas', 'Pitboss', 'SureLoc 150', 'SureLoc 1000', 'Parts'],
  Couplers: ['Standard Crankcase'],
  'Fuel Receivers': ['Check Valve', 'Standard Receiver', 'Deep Socket Tool', 'Parts'],
  'Fuel Vents': ['Filtered Fuel Vent', 'Standard Fuel Vent', 'Anti-Vandalism Flange', 'Bolt-on Flange', 'Half Coupling', 'High Flow Vent', 'NPT Adapter', 'Safety Relief Fuel Vent', 'Whistle Adapter', 'Parts'],
  Pressureless: ['High Flow Pressureless', 'Parts', 'Small Tank Pressureless']
};

// SKUs that should sort last on the Fuel Receivers grid — the Deep Socket
// Tool and the handful of accessory parts split out of the shared Parts
// bucket into a Fuel-Receivers-specific one.
const receiverPartsSkus = new Set([
  '001-3-7', // Deep Socket Tool
  'FFS-receiver-flange', // Receiver Flange
  '001-3-33f', // Replacement Caps for Fuel Receivers
  '001-3-7-3' // Standard Aluminum Receiver
]);

// SKU -> display rank for the Fuel Vents grid, matching the print catalog's
// page order (Filtered Fuel Vent family, then Standard/Fuel Vents pairs).
// Anything not listed (Breather Adapter, the high-volume top/bottom vent,
// Replacement Filter) sorts after these in the usual alphabetical order.
const ventFamilyRank: Record<string, number> = {
  V15sdf0F: 0, // Remote Mount Filter Vent
  V15sdddaf0F: 1, // High Volume Vacuum Break
  V150F: 2, // Filtered Fuel Vent (Direct Mount)
  sV15sdddaf0Fd: 3, // Low Profile Filter Vent
  'V1502f3d3-1': 4, // Bolt-on Flange
  dV15023d3: 5, // Half Coupling
  ddV15023d3: 6, // Whistle Adapter
  ddV1d5023d3: 7, // High Flow Vent
  V150Fsfsdf: 8, // Standard Fuel Vent
  V150Fsfsdfdg3: 9, // Safety Relief Fuel Vent
  V150233: 10, // Anti-Vandalism Flange
  V15023d3: 11 // NPT Adapter
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
  const categoryRootIds = new Map(categories.items.map((item) => [item.name, item.categoryId]));
  const currentName = category.name.toLowerCase();

  const isNozzles = currentName === 'fuel nozzles';
  const isReceivers = currentName === 'fuel receivers';
  const isVents = currentName === 'fuel vents';

  function receiverRank(product: { name: string; sku: string }) {
    if (receiverPartsSkus.has(product.sku)) return 2; // Parts / Deep Socket Tool, last
    if (product.name.toLowerCase().includes('check valve')) return 0; // most eye-catching, first
    return 1; // the other receivers
  }

  const displayCategory = isNozzles || isReceivers || isVents
    ? {
        ...category,
        products: {
          ...category.products,
          items: [...category.products.items].sort((a, b) => {
            if (isNozzles) {
              return (nozzleFamilyRank[a.sku] ?? Number.MAX_SAFE_INTEGER) -
                (nozzleFamilyRank[b.sku] ?? Number.MAX_SAFE_INTEGER);
            }
            if (isVents) {
              return (ventFamilyRank[a.sku] ?? Number.MAX_SAFE_INTEGER) -
                (ventFamilyRank[b.sku] ?? Number.MAX_SAFE_INTEGER);
            }
            return receiverRank(a) - receiverRank(b);
          })
        }
      }
    : category;

  function search(event) {
    event.preventDefault();
    const keyword = new FormData(event.currentTarget).get('keyword')?.toString().trim();
    if (keyword) window.location.href = `${searchUrl}?keyword=${encodeURIComponent(keyword)}`;
  }

  return (
    <CategoryProvider category={displayCategory}>
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
              const rootId = categoryRootIds.get(parent);
              // Resolve each label to its real category first (scoped to this
              // parent's own children), since several families reuse the same
              // label (e.g. every family has its own "Parts") — matching by
              // name alone would highlight/open every family that has a
              // same-named child at once.
              const resolvedChildren = children.map((child) => {
                const nestedChild = rootId !== undefined && categories.items.find((item) =>
                  item.parent?.categoryId === rootId && item.name.toLowerCase() === child.toLowerCase());
                const fallback = nestedChild ? undefined : categories.items.find((item) =>
                  item.name.toLowerCase() === child.toLowerCase());
                const match = nestedChild || fallback;
                return {
                  label: child,
                  url: match?.url || categoryUrls.get(parent.toLowerCase()) || '/products',
                  categoryId: match?.categoryId
                };
              });
              const active = parent.toLowerCase() === currentName ||
                resolvedChildren.some((rc) => rc.categoryId === category.categoryId);
              return (
                <details key={parent} open={active || undefined}>
                  <summary>
                    <a href={categoryUrls.get(parent.toLowerCase()) || '/products'}
                      aria-current={parent.toLowerCase() === currentName ? 'page' : undefined}>
                      {_(parent)}
                    </a>
                  </summary>
                  <div>
                    {resolvedChildren.map((rc) => (
                      <a key={`${parent}-${rc.label}`} href={rc.url}
                        aria-current={rc.categoryId === category.categoryId ? 'page' : undefined}>
                        {_(rc.label)}
                      </a>
                    ))}
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
      categoryId
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
