import { Image } from '@components/common/Image.js';
import { ProductNoThumbnail } from '@components/common/ProductNoThumbnail.js';
import { Button } from '@components/common/ui/Button.js';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@components/common/ui/Sheet.js';
import { CartData } from '@components/frontStore/cart/CartContext.js';
import { CartItems } from '@components/frontStore/cart/CartItems.js';
import { DefaultMiniCartDropdownEmpty } from '@components/frontStore/cart/DefaultMiniCartDropdownEmpty.js';
import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

export const DefaultMiniCartDropdown = ({
  cart,
  isOpen,
  onClose,
  cartUrl = '/cart',
  dropdownPosition = 'right'
}: {
  cart: CartData | null;
  isOpen: boolean;
  onClose: () => void;
  cartUrl?: string;
  checkoutUrl?: string;
  dropdownPosition?: 'left' | 'right';
  setIsDropdownOpen: (isOpen: boolean) => void;
}) => (
  <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <SheetContent side={dropdownPosition} className="w-full md:w-1/3 border-border">
      <SheetHeader className="border-b border-border">
        <SheetTitle className="font-medium text-xl">{_('My Quote List')}</SheetTitle>
      </SheetHeader>
      {!cart?.totalQty ? (
        <DefaultMiniCartDropdownEmpty setIsDropdownOpen={() => onClose()} />
      ) : (
        <div className="flex flex-col px-5 justify-between h-full" style={{ height: 'calc(100vh - 150px)' }}>
          <CartItems>
            {({ items, onRemoveItem }) => (
              <ul className="divide-y divide-divider overflow-y-auto">
                {items.map((item) => (
                  <li key={item.cartItemId} className="flex items-center py-4">
                    <div className="relative mr-4">
                      {item.thumbnail ? (
                        <Image src={item.thumbnail} alt={item.productName} width={80} height={80}
                          className="w-16 h-16 object-cover rounded border p-2" />
                      ) : <ProductNoThumbnail width={64} height={64} />}
                      <span className="absolute -top-2 -right-2 bg-muted rounded-full w-6 h-6 flex items-center justify-center text-sm">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">SKU: {item.productSku}</p>
                      <button className="text-sm text-critical mt-2" onClick={() => onRemoveItem(item.cartItemId)}>
                        {_('Remove from list')}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CartItems>
          <Button size="lg" className="w-full mb-4" onClick={() => { window.location.href = cartUrl; }}>
            {_('REVIEW QUOTE REQUEST')} ({cart.totalQty})
          </Button>
        </div>
      )}
    </SheetContent>
  </Sheet>
);
