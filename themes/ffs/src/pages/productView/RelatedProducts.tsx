import { ProductList } from '@components/frontStore/catalog/ProductList.js';
import { useProduct } from '@components/frontStore/catalog/ProductContext.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';

// No admin UI or curated data yet — every product's "Related Products" is
// computed automatically from its own category family (e.g. every Fuel
// Nozzles product suggests other Fuel Nozzles products), so it works for
// the whole catalog with zero maintenance. To hand-pick specific pairings
// later (e.g. always show the matching receiver next to a given nozzle),
// add a SKU -> related SKUs override map here, following the same pattern
// as MODEL_BY_SKU in Media.tsx, and check it before falling back to the
// automatic family lookup below.
//
// This component is mounted explicitly as a coreComponent from this
// theme's ProductView.tsx override, and its GraphQL fields (category,
// category.parent, RelatedProductItem fragment) live in that same file's
// `query`/`fragments` exports rather than its own — a second `query`
// export here sharing the `currentProduct` alias caused the merged
// product-page query to silently drop the category fields.

const MAX_RELATED = 4;

export function RelatedProducts() {
  const product = useProduct();
  const category = (product as any)?.category;
  if (!category) {
    return null;
  }

  // Leaf categories (Atlas, Pitboss, Check Valve...) usually hold just one
  // product, so prefer the parent family's products when there is one
  // (Fuel Nozzles, Fuel Receivers...); fall back to the category itself
  // for families that assign products directly (e.g. Couplers).
  const parentItems = category.parent?.products?.items ?? [];
  const ownItems = category.products?.items ?? [];
  const pool = parentItems.length > 0 ? parentItems : ownItems;

  const related = pool
    .filter((item: any) => item.sku !== product.sku)
    .slice(0, MAX_RELATED);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="ffs-related-products">
      <div className="page-width">
        <header>
          <p className="ffs-kicker">{_('You may also like')}</p>
          <h2>{_('Related Products')}</h2>
        </header>
        <ProductList products={related} gridColumns={4} showAddToCart={true} />
      </div>
    </section>
  );
}
