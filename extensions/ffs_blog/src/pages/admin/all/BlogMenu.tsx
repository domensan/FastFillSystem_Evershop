import { NavigationItemGroup } from '@components/admin/NavigationItemGroup.js';
import { Newspaper } from 'lucide-react';
import React from 'react';

export default function BlogMenu({ blogAdmin }) {
  return <NavigationItemGroup id="ffs-blog" name="FFS Content"
    items={[{ Icon: Newspaper, url: blogAdmin, title: 'Updates' }]} />;
}
export const layout = { areaId: 'adminMenu', sortOrder: 26 };
export const query = `query BlogMenu { blogAdmin: url(routeId: "blogAdmin") }`;
