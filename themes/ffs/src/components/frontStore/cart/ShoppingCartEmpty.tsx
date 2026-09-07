import { Button } from '@components/common/ui/Button.js';
import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

export function ShoppingCartEmpty() {
  return (
    <div className="py-24 text-center">
      <h2 className="text-2xl font-bold">{_('Your quote is empty')}</h2>
      <p className="my-5 text-muted-foreground">{_('Add products to prepare your request.')}</p>
      <Button size="lg" onClick={() => { window.location.href = '/products'; }}>
        {_('VIEW PRODUCTS')}
      </Button>
    </div>
  );
}
