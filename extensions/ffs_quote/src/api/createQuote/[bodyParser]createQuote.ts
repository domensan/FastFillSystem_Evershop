import { insert } from '@evershop/postgres-query-builder';
import { sendEmail } from '@evershop/evershop/lib/mail/emailHelper';
import { getConnection } from '@evershop/evershop/lib/postgres';

export default async (request, response) => {
  const {
    name, company, email, phone, address1, address2 = '', city,
    country, province, postcode, message = '', items
  } = request.body ?? {};
  if (![name, company, email, phone, address1, city, country, province, postcode].every((value) => value?.trim())
    || !Array.isArray(items) || items.length === 0) {
    return response.status(400).json({ error: 'Contact, address, and products are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ error: 'The email address is invalid.' });
  }

  const reference = `FFS-${Date.now().toString(36).toUpperCase()}`;
  const connection = await getConnection();
  try {
    await insert('ffs_quote_request').given({
      reference,
      name: name.trim(),
      company: company.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address_1: address1.trim(),
      address_2: String(address2).trim(),
      city: city.trim(),
      country: country.trim(),
      province: province.trim(),
      postcode: postcode.trim(),
      message: String(message).trim(),
      items
    }).execute(connection);
    const template = `
      <h1>Quote request {{reference}}</h1>
      <p><strong>Customer:</strong> {{name}} — {{company}}</p>
      <p><strong>Email:</strong> {{email}}</p>
      <p><strong>Telephone:</strong> {{phone}}</p>
      <p><strong>Address:</strong> {{address1}}{{#if address2}}, {{address2}}{{/if}}, {{city}}, {{province}} {{postcode}}, {{country}}</p>
      <ul>{{#each items}}<li>{{qty}} × {{name}} ({{sku}})</li>{{/each}}</ul>
      {{#if message}}<p><strong>Comments:</strong> {{message}}</p>{{/if}}
    `;
    const data = { reference, name, company, email, phone, address1, address2, city, country, province, postcode, items, message };
    const notifications = [
      sendEmail('ffs_quote_customer', {
        to: email,
        subject: `We received your request ${reference}`,
        template,
        data
      })
    ];
    if (process.env.FFS_QUOTE_EMAIL) {
      notifications.push(sendEmail('ffs_quote_admin', {
        to: process.env.FFS_QUOTE_EMAIL,
        subject: `New quote ${reference} — ${company}`,
        template,
        data
      }));
    }
    await Promise.allSettled(notifications);
    return response.status(201).json({ success: true, reference });
  } finally {
    connection.release();
  }
};
