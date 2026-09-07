import { Button } from '@components/common/ui/Button.js';
import { ShoppingBag } from 'lucide-react';
import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

export const DefaultMiniCartDropdownEmpty = ({ setIsDropdownOpen }) => (
  <div className="p-8 text-center">
    <ShoppingBag width={48} height={48} className="mx-auto text-muted-foreground mb-4" />
    <p className="text-muted-foreground mb-4">{_('Your quote is empty')}</p>
    <Button size="lg" onClick={() => setIsDropdownOpen(false)}>{_('KEEP BROWSING')}</Button>
  </div>
);
