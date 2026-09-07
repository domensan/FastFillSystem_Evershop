import { Button } from '@components/common/ui/Button.js';
import { AddToCart } from '@components/frontStore/cart/AddToCart.js';
import { useProduct } from '@components/frontStore/catalog/ProductContext.js';
import React from 'react';
import { toast } from 'react-toastify';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

export function ProductSingleForm() {
  const { sku, inventory: { isInStock } } = useProduct();
  const [qty, setQty] = React.useState(1);

  return (
    <div className="ffs-product-quote">
      <p className="ffs-kicker">{_('Pricing')}</p>
      <h2>{_('Ask for a quote')}</h2>
      <div className="ffs-product-quote__quantity">
        <label htmlFor="quote-qty">{_('Quantity')}</label>
        <input id="quote-qty" type="number" min="1"
          value={qty} onChange={(event) => setQty(Math.max(1, Number(event.target.value)))} />
      </div>
      <AddToCart product={{ sku, isInStock }} qty={qty}
        onError={(message) => toast.error(message)}>
        {(state, actions) => (
          <Button className="w-full py-6 mt-4" size="lg"
            disabled={!state.canAddToCart}
            isLoading={state.isLoading}
            onClick={() => actions.addToCart()}>
            {isInStock ? _('ADD TO QUOTE') : _('UNAVAILABLE')}
          </Button>
        )}
      </AddToCart>
      <details className="ffs-product-quote__details" open>
        <summary>{_('Technical information')}</summary>
        <p>{_('Select a quantity and add this product to My Quote. Our team will confirm the correct configuration and pricing.')}</p>
      </details>
    </div>
  );
}
