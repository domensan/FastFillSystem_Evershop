// Run after npm run build:custom:
// node --experimental-test-module-mocks --test tests/quote-request.test.mjs
import assert from 'node:assert/strict';
import { mock, test } from 'node:test';

let saved;
mock.module('@evershop/postgres-query-builder', {
  namedExports: { insert: () => ({ given: (data) => ({ execute: async () => { saved = data; } }) }) }
});
mock.module('@evershop/evershop/lib/mail/emailHelper', {
  namedExports: { sendEmail: async () => {} }
});
mock.module('@evershop/evershop/lib/postgres', {
  namedExports: { getConnection: async () => ({ release() {} }) }
});
const { default: createQuote } = await import('../extensions/ffs_quote/dist/api/createQuote/[bodyParser]createQuote.js');

test('quote accepts the remaining fields and still requires city and products', async () => {
  const body = {
    name: 'Test', company: 'FFS', email: 'test@example.com', phone: '123456789',
    address1: 'Test address', city: 'Santiago', country: 'CL',
    items: [{ sku: 'TEST', name: 'Test product', qty: 1 }]
  };
  const response = {
    status(code) { this.code = code; return this; },
    json(data) { this.data = data; return this; }
  };
  await createQuote({ body }, response);
  assert.equal(response.code, 201);
  assert.equal(response.data.success, true);
  assert.equal(saved.city, 'Santiago');
  assert.ok(!('province' in saved));
  assert.ok(!('postcode' in saved));
  for (const invalid of [{ ...body, city: '' }, { ...body, items: [] }]) {
    saved = undefined;
    await createQuote({ body: invalid }, response);
    assert.equal(response.code, 400);
    assert.equal(saved, undefined);
  }
});
