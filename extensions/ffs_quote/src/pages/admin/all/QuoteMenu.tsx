import { NavigationItemGroup } from '@components/admin/NavigationItemGroup.js';
import { FileText } from 'lucide-react';
import React from 'react';

export default function QuoteMenu({ quoteGrid }) {
  return (
    <NavigationItemGroup
      id="ffsQuoteMenu"
      name="FFS"
      items={[{ Icon: FileText, url: quoteGrid, title: 'Quotes' }]}
    />
  );
}

export const layout = { areaId: 'adminMenu', sortOrder: 25 };

export const query = `
  query QuoteMenu {
    quoteGrid: url(routeId: "quoteGrid")
  }
`;
