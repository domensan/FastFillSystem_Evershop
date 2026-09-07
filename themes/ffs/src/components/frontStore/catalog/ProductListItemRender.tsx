import { Image } from '@components/common/Image.js';
import { ProductNoThumbnail } from '@components/common/ProductNoThumbnail.js';
import { Button } from '@components/common/ui/Button.js';
import { AddToCart } from '@components/frontStore/cart/AddToCart.js';
import React from 'react';
import { toast } from 'react-toastify';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

export const ProductListItemRender = ({ product, imageWidth = 300, imageHeight = 300 }) => (
  <article className="product__list__item__inner group overflow-hidden">
    <a href={product.url} className="block">
      <div className="overflow-hidden flex w-full justify-center bg-white">
        {product.image ? (
          <Image src={product.image.url} alt={product.image.alt || product.name}
            width={imageWidth} height={imageHeight} loading="lazy"
            className="transition-transform duration-500 group-hover:scale-105" />
        ) : <ProductNoThumbnail width={imageWidth} height={imageHeight} />}
      </div>
      <div className="mt-3">
        <h2 className="h5 font-medium">{product.name}</h2>
        <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
      </div>
    </a>
    <AddToCart
      product={{ sku: product.sku, isInStock: product.inventory.isInStock }}
      qty={1}
      onError={(error) => toast.error(error)}
    >
      {(state, actions) => (
        <Button className="w-full mt-4" disabled={!state.canAddToCart || state.isLoading}
          onClick={() => actions.addToCart()}>
          {state.isLoading ? _('ADDING…') : _('ADD TO QUOTE')}
        </Button>
      )}
    </AddToCart>
  </article>
);
