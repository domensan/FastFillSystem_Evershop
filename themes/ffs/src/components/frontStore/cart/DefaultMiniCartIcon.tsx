import { FileText } from 'lucide-react';
import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

export const DefaultMiniCartIcon = ({ totalQty, onClick, isOpen, disabled = false, syncStatus }) => (
  <button type="button" onClick={onClick} disabled={disabled}
    className={`mini-cart-icon ffs-quote-trigger ${isOpen ? 'active' : ''}`}
    aria-label={`${_('My Quote')} — ${totalQty} ${_('selected products')}`}>
    {syncStatus.syncing
      ? <span className="ffs-quote-trigger__spinner" aria-hidden="true" />
      : <FileText className="w-5 h-5" aria-hidden="true" />}
    <span>{_('My Quote')}</span>
    {totalQty > 0 && <strong>{totalQty > 99 ? '99+' : totalQty}</strong>}
  </button>
);
