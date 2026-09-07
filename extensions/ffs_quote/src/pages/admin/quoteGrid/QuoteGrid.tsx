import React from 'react';

type Quote = {
  reference: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  country?: string;
  province?: string;
  postcode?: string;
  message?: string;
  status: string;
  created_at: string;
  items: Array<{ sku: string; name: string; qty: number }>;
};

export default function QuoteGrid({ listApi }) {
  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    fetch(listApi)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(({ data }) => setQuotes(data))
      .catch(() => setError('We could not load the quotes.'));
  }, [listApi]);

  async function updateStatus(reference, status) {
    const response = await fetch(`${listApi}/${reference}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      setError('We could not update the status.');
      return;
    }
    setQuotes((current) => current.map((quote) =>
      quote.reference === reference ? { ...quote, status } : quote
    ));
  }

  return (
    <div className="page-width py-8">
      <h1 className="text-3xl font-bold mb-6">FFS Quotes</h1>
      {error && <p className="text-destructive">{error}</p>}
      <div className="space-y-4">
        {quotes.map((quote) => (
          <details key={quote.reference} className="border rounded-lg p-5">
            <summary className="cursor-pointer flex justify-between gap-4">
              <span><strong>{quote.reference}</strong> — {quote.company}</span>
              <span>{quote.status} · <time>{new Date(quote.created_at).toLocaleString()}</time></span>
            </summary>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-4">
                  <strong className="block">Status</strong>
                  <select value={quote.status} onChange={(event) => updateStatus(quote.reference, event.target.value)}>
                    <option value="received">New</option>
                    <option value="reviewing">Under Review</option>
                    <option value="quoted">Quoted</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
                <p><strong>Contact:</strong> {quote.name}</p>
                <p><strong>Email:</strong> <a href={`mailto:${quote.email}`}>{quote.email}</a></p>
                {quote.phone && <p><strong>Phone:</strong> {quote.phone}</p>}
                {quote.address_1 && (
                  <address className="not-italic mt-3">
                    <strong className="block">Address:</strong>
                    {quote.address_1}{quote.address_2 && <>, {quote.address_2}</>}<br />
                    {quote.city}, {quote.province} {quote.postcode}<br />
                    {quote.country}
                  </address>
                )}
                {quote.message && <p className="mt-3">{quote.message}</p>}
              </div>
              <ul>
                {quote.items.map((item) => (
                  <li key={`${quote.reference}-${item.sku}`}>{item.qty} × {item.name} <small>({item.sku})</small></li>
                ))}
              </ul>
            </div>
          </details>
        ))}
        {!error && !quotes.length && <p>There are no quotes yet.</p>}
      </div>
    </div>
  );
}

export const layout = { areaId: 'content', sortOrder: 10 };

export const query = `
  query QuoteGrid {
    listApi: url(routeId: "listQuotes")
  }
`;
