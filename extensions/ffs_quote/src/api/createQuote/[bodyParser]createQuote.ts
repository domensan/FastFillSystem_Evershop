import { insert } from '@evershop/postgres-query-builder';
import { sendEmail } from '@evershop/evershop/lib/mail/emailHelper';
import { getConnection } from '@evershop/evershop/lib/postgres';

export default async (request, response) => {
  const {
    name, company = '', email, phone = '', address1 = '', address2 = '', city = '',
    country = '', message = '', items, requestType
  } = request.body ?? {};
  const isContact = requestType === 'contact';
  const required = isContact ? [name, email, message] : [name, company, email, phone, address1, city, country];
  if (!required.every((value) => typeof value === 'string' && value.trim())
    || (!isContact && (!Array.isArray(items) || items.length === 0))) {
    return response.status(400).json({ error: isContact
      ? 'Name, email, and message are required.'
      : 'Contact, address, and products are required.' });
  }
  const requestItems = isContact ? [{ sku: 'CONTACT', name: 'Contact inquiry', qty: 1 }] : items;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ error: 'The email address is invalid.' });
  }

  const reference = `FFS-${Date.now().toString(36).toUpperCase()}`;
  const connection = await getConnection();
  try {
    await insert('ffs_quote_request').given({
      reference,
      name: name.trim(),
      company: isContact ? '' : company.trim(),
      email: email.trim().toLowerCase(),
      phone: typeof phone === 'string' ? phone.trim() : '',
      address_1: isContact ? '' : address1.trim(),
      address_2: String(address2).trim(),
      city: isContact ? '' : city.trim(),
      country: isContact ? '' : country.trim(),
      message: String(message).trim(),
      items: requestItems
    }).execute(connection);
    const template = `
      <h1>Quote request {{reference}}</h1>
      <p><strong>Customer:</strong> {{name}} — {{company}}</p>
      <p><strong>Email:</strong> {{email}}</p>
      <p><strong>Telephone:</strong> {{phone}}</p>
      {{#if address1}}<p><strong>Address:</strong> {{address1}}{{#if address2}}, {{address2}}{{/if}}, {{city}}, {{country}}</p>{{/if}}
      <ul>{{#each items}}<li>{{qty}} × {{name}} ({{sku}})</li>{{/each}}</ul>
      {{#if message}}<p><strong>Comments:</strong> {{message}}</p>{{/if}}
    `;
    const data = { reference, name, company, email, phone, address1, address2, city, country, items: requestItems, message };
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
