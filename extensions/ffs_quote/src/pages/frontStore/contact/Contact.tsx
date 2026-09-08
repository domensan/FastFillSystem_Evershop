import React from 'react';

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
          company: '',
          email: values.email,
          phone: values.phone,
          message: values.message,
          items: [{ sku: 'CONTACT', name: 'Contact inquiry', qty: 1 }]
        })
      });
      const result = await response.json();
      setStatus(response.ok
        ? { loading: false, reference: result.reference, error: '' }
        : { loading: false, reference: '', error: result.error || 'We could not send your message.' });
    } catch {
      setStatus({ loading: false, reference: '', error: 'We could not connect to the server.' });
    }
  }

  return (
    <main className="ffs-distributor-page">
      <section className="ffs-distributor-hero">
        <div className="page-width">
          <div className="ffs-distributor-hero__copy ffs-reveal">
            <p className="ffs-kicker">Get in Touch</p>
            <h1>Contact Us</h1>
            <p>Contact Fast Fill Systems to learn how our advanced fueling solutions can support your operation. We’re here to answer questions and help fuel your success.</p>
            <a className="ffs-button ffs-button--primary" href="#contact-form">Drop Us a Line</a>
            <a className="ffs-distributor-phone" href="tel:+18014913600">+1 801-491-3600</a>
          </div>
          <div className="ffs-distributor-hero__visual ffs-reveal">
            <img src="/ffs/home/distributor-system.jpg" alt="Fast Fill Systems fueling equipment" />
            <img src="/ffs/home/distributor-receiver.jpg" alt="Fast Fill Systems fuel receiver" />
          </div>
        </div>
      </section>

      <section id="contact-form" className="ffs-distributor-form page-width">
        <div className="ffs-distributor-form__intro ffs-reveal">
          <p className="ffs-kicker">Get in Touch</p>
          <h2>Drop Us a Line!</h2>
          <p>Ready to enhance your fueling operations? Reach out for inquiries, quotes, or to learn more about what Fast Fill Systems can do for you.</p>
          <div>
            <strong>Contact Information</strong>
            <span>1195 Spring Creek Pl, Springville, UT 84663</span>
            <span><a href="mailto:contact@fastfillsystems.com">contact@fastfillsystems.com</a></span>
            <span><a href="tel:+18014913600">+1 801-491-3600</a></span>
            <span>Mon–Thu: 8 AM–5 PM · Fri: 8 AM–3 PM (MST/MDT)</span>
          </div>
        </div>

        {status.reference ? (
          <div className="ffs-distributor-success ffs-reveal">
            <p className="ffs-kicker">Message Received</p>
            <h2>Thank You</h2>
            <p>Our team will contact you soon. Your reference is <strong>{status.reference}</strong>.</p>
          </div>
        ) : (
          <form className="ffs-distributor-form__fields ffs-reveal" onSubmit={submit}>
            <div><label>First Name<input name="firstName" required /></label><label>Last Name<input name="lastName" required /></label></div>
            <div><label>Phone<input type="tel" name="phone" /></label><label>Email<input type="email" name="email" required /></label></div>
            <label>Message<textarea name="message" rows={7} required /></label>
            {status.error && <p role="alert" className="text-critical">{status.error}</p>}
            <button className="ffs-button ffs-button--primary" disabled={status.loading}>
              {status.loading ? 'SENDING…' : 'SEND'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export const layout = { areaId: 'content', sortOrder: 10 };
