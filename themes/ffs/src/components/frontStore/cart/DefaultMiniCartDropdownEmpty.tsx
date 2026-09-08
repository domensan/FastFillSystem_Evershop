import { Button } from '@components/common/ui/Button.js';
import { FileText } from 'lucide-react';
import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

export const DefaultMiniCartDropdownEmpty = ({ setIsDropdownOpen }) => (
  <div className="p-8 text-center">
    <FileText width={48} height={48} className="mx-auto text-muted-foreground mb-4" />
    <p className="text-muted-foreground mb-4">{_('No equipment selected yet')}</p>
    <Button size="lg" onClick={() => setIsDropdownOpen(false)}>{_('BROWSE EQUIPMENT')}</Button>
  </div>
);
