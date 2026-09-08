import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

export default function Contact() {
  const [status, setStatus] = React.useState({ loading: false, reference: '', error: '' });

  async function submit(event) {
    event.preventDefault();
    setStatus({ loading: true, reference: '', error: '' });
    try {
      const values = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch('/ffs/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${values.firstName} ${values.lastName}`.trim(),
          requestType: 'contact',
          email: values.email,
          phone: values.phone,
          message: values.message
        })
      });
      const result = await response.json();
      setStatus(response.ok
        ? { loading: false, reference: result.reference, error: '' }
        : { loading: false, reference: '', error: result.error || _('We could not send your message.') });
    } catch {
      setStatus({ loading: false, reference: '', error: _('We could not connect to the server.') });
    }
  }

  return (
    <main className="ffs-contact-page">
      <section className="ffs-contact-hero">
        <div className="ffs-contact-hero__video" aria-hidden="true">
          <iframe
            src="https://www.youtube-nocookie.com/embed/WvZ1eB_dE-8?autoplay=1&mute=1&loop=1&playlist=WvZ1eB_dE-8&controls=0&modestbranding=1&playsinline=1&rel=0"
            title=""
            allow="autoplay; encrypted-media"
            tabIndex={-1}
          />
        </div>
        <div className="ffs-contact-hero__overlay" />
        <div className="page-width ffs-contact-hero__content">
          <div className="ffs-reveal">
            <p className="ffs-kicker">{_('Get in Touch')}</p>
            <h1>{_('Contact Us')}</h1>
            <p>{_('Contact Fast Fill Systems to learn how our advanced fueling solutions can support your operation. We’re here to answer questions and help fuel your success.')}</p>
            <a className="ffs-button ffs-button--primary" href="#contact-form">{_('Drop Us a Line')}</a>
            <a className="ffs-distributor-phone" href="tel:+18014913600">+1 801-491-3600</a>
          </div>
        </div>
      </section>

      <section className="ffs-distributor-form page-width">
        <div className="ffs-distributor-form__intro ffs-reveal">
          <p className="ffs-kicker">{_('Get in Touch')}</p>
          <h2>{_('Drop Us a Line!')}</h2>
          <p>{_('Ready to enhance your fueling operations? Reach out for inquiries, quotes, or to learn more about what Fast Fill Systems can do for you.')}</p>
          <div>
            <strong>{_('Contact Information')}</strong>
            <span>1195 Spring Creek Pl, Springville, UT 84663</span>
            <span><a href="mailto:contact@fastfillsystems.com">contact@fastfillsystems.com</a></span>
            <span><a href="tel:+18014913600">+1 801-491-3600</a></span>
            <span>{_('Mon–Thu: 8 AM–5 PM · Fri: 8 AM–3 PM (MST/MDT)')}</span>
          </div>
        </div>

        {status.reference ? (
          <div id="contact-form" className="ffs-distributor-success ffs-reveal">
            <p className="ffs-kicker">{_('Message Received')}</p>
            <h2>{_('Thank You')}</h2>
            <p>{_('Our team will contact you soon. Your reference is')} <strong>{status.reference}</strong>.</p>
          </div>
        ) : (
          <form id="contact-form" className="ffs-distributor-form__fields ffs-reveal" onSubmit={submit}>
            <div><label>{_('First Name')}<input name="firstName" required /></label><label>{_('Last Name')}<input name="lastName" required /></label></div>
            <div><label>{_('Phone')}<input type="tel" name="phone" /></label><label>{_('Email')}<input type="email" name="email" required /></label></div>
            <label>{_('Message')}<textarea name="message" placeholder={_('Tell us the part number, quantity, or previous order you want to repeat.')} rows={7} required /></label>
            {status.error && <p role="alert" className="text-critical">{status.error}</p>}
            <button className="ffs-button ffs-button--primary" disabled={status.loading}>
              {status.loading ? _('SENDING…') : _('SEND')}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export const layout = { areaId: 'content', sortOrder: 10 };
