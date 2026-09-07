import { Image } from '@components/common/Image.js';
import { Button } from '@components/common/ui/Button.js';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@components/common/ui/Card.js';
import { ProductNoThumbnail } from '@components/common/ProductNoThumbnail.js';
import { CartItems } from '@components/frontStore/cart/CartItems.js';
import { useCartState } from '@components/frontStore/cart/CartContext.js';
import { ItemQuantity } from '@components/frontStore/cart/ItemQuantity.js';
import { ShoppingCartEmpty } from '@components/frontStore/cart/ShoppingCartEmpty.js';
import { FileText } from 'lucide-react';
import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

type Country = {
  code: string;
  name: string;
  provinces: Array<{ code: string; name: string }>;
};

export default function ShoppingCart({ saveApi, countries }: { saveApi: string; countries: Country[] }) {
  const { data: cart } = useCartState();
  const [status, setStatus] = React.useState({ loading: false, reference: '', error: '' });
  const [country, setCountry] = React.useState('');
  const provinces = countries.find(({ code }) => code === country)?.provinces ?? [];

  async function submit(event) {
    event.preventDefault();
    setStatus({ loading: true, reference: '', error: '' });
    try {
      const fields = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch(saveApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          items: cart.items.map(({ productSku, productName, qty }) => ({
            sku: productSku,
            name: productName,
            qty
          }))
        })
      });
      const result = await response.json();
      setStatus(response.ok
        ? { loading: false, reference: result.reference, error: '' }
        : { loading: false, reference: '', error: result.error || _('We could not send your request.') });
    } catch {
      setStatus({ loading: false, reference: '', error: _('We could not connect to the server.') });
    }
  }

  if (status.reference) {
    return (
      <section className="page-width py-20 text-center">
        <p className="ffs-eyebrow">{_('Request received')}</p>
        <h1 className="text-4xl font-bold my-4">{_('Thank you for contacting us')}</h1>
        <p>{_('Your reference is')} <strong>{status.reference}</strong>.</p>
      </section>
    );
  }

  return (
    <section className="cart page-width pt-8 pb-8">
      {cart.items.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <form className="ffs-quote-form" onSubmit={submit}>
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <span>{_('Quote Request Form')}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">{_('Full Name')} <span className="text-critical">*</span>
                    <input className="form-field mt-2" name="name" placeholder={_('Full Name')} required />
                  </label>
                  <label className="block">{_('Telephone')} <span className="text-critical">*</span>
                    <input className="form-field mt-2" name="phone" type="tel" placeholder={_('Telephone')} required />
                  </label>
                </div>
                <label className="block">{_('Company')} <span className="text-critical">*</span>
                  <input className="form-field mt-2" name="company" placeholder={_('Company')} required />
                </label>
                <label className="block">{_('Email')} <span className="text-critical">*</span>
                  <input className="form-field mt-2" name="email" type="email" placeholder={_('Email')} required />
                </label>
                <label className="block">{_('Address')} <span className="text-critical">*</span>
                  <input className="form-field mt-2" name="address1" placeholder={_('Address')} required />
                </label>
                <label className="block">{_('City')} <span className="text-critical">*</span>
                  <input className="form-field mt-2" name="city" placeholder={_('City')} required />
                </label>
                <label className="block">{_('Country')} <span className="text-critical">*</span>
                  <select className="form-field mt-2" name="country" value={country}
                    onChange={(event) => setCountry(event.target.value)} required>
                    <option value="">{_('Country')}</option>
                    {countries.map(({ code, name }) => <option key={code} value={code}>{name}</option>)}
                  </select>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">{_('Province')} <span className="text-critical">*</span>
                    {provinces.length ? (
                      <select className="form-field mt-2" name="province" key={country} required>
                        <option value="">{_('Province')}</option>
                        {provinces.map(({ code, name }) => <option key={code} value={code}>{name}</option>)}
                      </select>
                    ) : (
                      <input className="form-field mt-2" name="province" key={country}
                        placeholder={_('Province')} required />
                    )}
                  </label>
                  <label className="block">{_('Postcode')} <span className="text-critical">*</span>
                    <input className="form-field mt-2" name="postcode" placeholder={_('Postcode')} required />
                  </label>
                </div>
                <label className="block">{_('Application or Comments')}<textarea className="form-field mt-2" name="message" rows={5} /></label>
                {status.error && <p role="alert" className="text-critical">{status.error}</p>}
                <Button type="submit" className="w-full" size="xl" disabled={status.loading}>
                  {status.loading ? _('SENDING…') : _('SEND QUOTE REQUEST')}
                </Button>
              </CardContent>
            </Card>
          </form>
          <CartItems>
            {({ items, loading, onRemoveItem }) => (
              <div>
                <h2 className="text-xl font-semibold mb-3">{_('Quote Summary')}</h2>
                <ul className="item__summary__list divide-y divide-divider mb-3">
                {items.map((item) => (
                  <li key={item.cartItemId} className="flex items-start py-3">
                    <div className="relative mr-4 self-center">
                      {item.thumbnail ? (
                        <Image src={item.thumbnail} alt={item.productName} width={100} height={100}
                          className="w-16 h-16 object-cover rounded border p-2 box-border border-border" />
                      ) : (
                        <ProductNoThumbnail className="w-16 h-16 rounded border border-border p-2 box-border" />
                      )}
                      <span className="absolute -top-2 -right-2 bg-muted rounded-full w-6 h-6 flex items-center justify-center text-sm">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">{item.productName}</h3>
                      <p className="text-sm text-textSubdued">SKU: {item.productSku}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <ItemQuantity initialValue={item.qty} cartItemId={item.cartItemId} min={1} max={99}>
                          {({ quantity, increase, decrease }) => (
                            <div className="flex items-center border">
                              <button type="button" className="px-2" onClick={decrease}
                                disabled={loading || quantity <= 1} aria-label={_('Decrease quantity')}>−</button>
                              <span className="min-w-8 text-center text-sm">{quantity}</span>
                              <button type="button" className="px-2" onClick={increase}
                                disabled={loading} aria-label={_('Increase quantity')}>+</button>
                            </div>
                          )}
                        </ItemQuantity>
                        <button type="button" className="text-critical"
                          onClick={() => onRemoveItem(item.cartItemId)}>{_('Remove')}</button>
                      </div>
                    </div>
                  </li>
                ))}
                </ul>
                <a href="/products" className="text-sm underline">{_('Continue adding products')}</a>
              </div>
            )}
          </CartItems>
        </div>
      ) : <ShoppingCartEmpty />}
    </section>
  );
}

export const layout = { areaId: 'content', sortOrder: 10 };

export const query = `
  query QuoteCart {
    saveApi: url(routeId: "createQuote")
    countries: allowedCountries {
      code
      name
      provinces { code name }
    }
  }
`;
