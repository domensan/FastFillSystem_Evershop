import { Button } from '@components/common/ui/Button.js';
import { Editor } from '@components/common/Editor.js';
import { AddToCart } from '@components/frontStore/cart/AddToCart.js';
import { useProduct } from '@components/frontStore/catalog/ProductContext.js';
import React from 'react';
import { toast } from 'react-toastify';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

export function ProductSingleForm() {
  const { sku, inventory: { isInStock }, description } = useProduct();
  const [qty, setQty] = React.useState(1);
  const hasDescription = Array.isArray(description) && description.length > 0;

  return (
    <div className="ffs-product-quote">
      {hasDescription && (
        <div className="ffs-product-quote__description">
          <p className="ffs-kicker">{_('Description')}</p>
          <Editor rows={description} />
        </div>
      )}
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
            {isInStock ? _('ADD TO QUOTE LIST') : _('UNAVAILABLE')}
          </Button>
        )}
      </AddToCart>
    </div>
  );
}
