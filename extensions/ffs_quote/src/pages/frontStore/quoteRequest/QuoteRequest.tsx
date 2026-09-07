import React from 'react';

export default function QuoteRequest({ cart, saveApi }) {
  const [status, setStatus] = React.useState({ loading: false, reference: '', error: '' });
  const items = cart?.items ?? [];

  async function submit(event) {
    event.preventDefault();
    setStatus({ loading: true, reference: '', error: '' });
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(saveApi, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...fields,
        items: items.map(({ productSku, productName, qty }) => ({ sku: productSku, name: productName, qty }))
      })
    });
    const result = await response.json();
    setStatus(response.ok
      ? { loading: false, reference: result.reference, error: '' }
      : { loading: false, reference: '', error: result.error || 'We could not send your request.' });
  }

  if (status.reference) {
    return (
      <section className="page-width py-20 text-center">
        <p className="ffs-eyebrow">Request received</p>
        <h1 className="text-4xl font-bold my-4">Thank you for contacting us</h1>
        <p>Your reference is <strong>{status.reference}</strong>.</p>
      </section>
    );
  }

  return (
    <section className="page-width py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <p className="ffs-eyebrow">Technical quote</p>
        <h1 className="text-4xl font-bold my-4">Tell us about your operation</h1>
        <p className="text-textSubdued mb-8">We will review compatibility, quantities, and application before quoting.</p>
        <h2 className="font-bold mb-3">Selected Products</h2>
        {items.length ? items.map((item) => (
          <div key={item.productSku} className="border-b py-3 flex justify-between gap-4">
            <span>{item.productName}<small className="block text-textSubdued">{item.productSku}</small></span>
            <strong>x{item.qty}</strong>
          </div>
        )) : <p>There are no products in this request.</p>}
      </div>

      <form onSubmit={submit} className="bg-gray-100 p-8 space-y-5">
        <label className="block">Full Name<input className="form-field mt-2" name="name" required /></label>
        <label className="block">Company<input className="form-field mt-2" name="company" required /></label>
        <label className="block">Email<input className="form-field mt-2" name="email" type="email" required /></label>
        <label className="block">Phone<input className="form-field mt-2" name="phone" type="tel" /></label>
        <label className="block">Application or Comments<textarea className="form-field mt-2" name="message" rows={5} /></label>
        {status.error && <p role="alert" className="text-critical">{status.error}</p>}
        <button className="button primary w-full" disabled={status.loading || !items.length}>
          {status.loading ? 'SENDING…' : 'SEND REQUEST'}
        </button>
      </form>
    </section>
  );
}

export const layout = { areaId: 'content', sortOrder: 10 };

export const query = `
  query Query {
    cart: myCart {
      items {
        productSku
        productName
        qty
      }
    }
    saveApi: url(routeId: "createQuote")
  }
`;
