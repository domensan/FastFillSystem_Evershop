import { Button } from '@components/common/ui/Button.js';
import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

export function ShoppingCartEmpty() {
  return (
    <div className="py-24 text-center">
      <h2 className="text-2xl font-bold">{_('Your quote list is empty')}</h2>
      <p className="my-5 text-muted-foreground">{_('Select the equipment you want our team to review.')}</p>
      <Button size="lg" onClick={() => { window.location.href = '/products'; }}>
        {_('BROWSE EQUIPMENT')}
      </Button>
    </div>
  );
}
