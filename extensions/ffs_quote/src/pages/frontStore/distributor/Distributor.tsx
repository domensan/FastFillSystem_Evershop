import React from 'react';

export default function Distributor() {
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
          company: values.company,
          email: values.email,
          phone: values.phone,
          message: `Distributor inquiry\nAddress: ${values.address || 'Not provided'}\nIndustry: ${values.industry}\n\n${values.message || ''}`,
          items: [{ sku: 'DISTRIBUTOR', name: `Distributor inquiry — ${values.industry}`, qty: 1 }]
        })
      });
      const result = await response.json();
      setStatus(response.ok
        ? { loading: false, reference: result.reference, error: '' }
        : { loading: false, reference: '', error: result.error || 'We could not send your request.' });
    } catch {
      setStatus({ loading: false, reference: '', error: 'We could not connect to the server.' });
    }
  }

  return (
    <main className="ffs-distributor-page">
      <section className="ffs-distributor-hero">
        <div className="page-width">
          <div className="ffs-distributor-hero__copy ffs-reveal">
            <p className="ffs-kicker">Join Our Global Network</p>
            <h1>Become a Distributor</h1>
            <p>Partner with Fast Fill Systems and bring high-performance fueling solutions, proven reliability, and dedicated support to your market.</p>
            <a className="ffs-button ffs-button--primary" href="#distributor-form">Start Now</a>
            <a className="ffs-distributor-phone" href="tel:+18014913600">+1 801-491-3600</a>
          </div>
          <div className="ffs-distributor-hero__visual ffs-reveal">
            <img src="/ffs/home/distributor-system.jpg" alt="Fast Fill Systems pressureless fueling system" />
            <img src="/ffs/home/distributor-receiver.jpg" alt="Fast Fill Systems fuel receiver" />
          </div>
        </div>
      </section>

      <section id="distributor-form" className="ffs-distributor-form page-width">
        <div className="ffs-distributor-form__intro ffs-reveal">
          <p className="ffs-kicker">Become an FFS Partner</p>
          <h2>Let’s Grow Together</h2>
          <p>Please complete the form to express your interest in becoming a distributor. We value your information and look forward to connecting with you.</p>
          <div>
            <strong>Why Partner With FFS?</strong>
            <span>Reliable, industry-proven products</span>
            <span>Technical guidance and training</span>
            <span>Responsive commercial support</span>
            <span>Global experience with local focus</span>
          </div>
        </div>

        {status.reference ? (
          <div className="ffs-distributor-success ffs-reveal">
            <p className="ffs-kicker">Request Received</p>
            <h2>Thank You for Your Interest</h2>
            <p>Our team will contact you soon. Your reference is <strong>{status.reference}</strong>.</p>
          </div>
        ) : (
          <form className="ffs-distributor-form__fields ffs-reveal" onSubmit={submit}>
            <div><label>First Name<input name="firstName" required /></label><label>Last Name<input name="lastName" required /></label></div>
            <div><label>Phone Number (International)<input type="tel" name="phone" /></label><label>Business Email<input type="email" name="email" required /></label></div>
            <label>Business Name<input name="company" required /></label>
            <label>Address (International)<input name="address" /></label>
            <label>Primary Industry
              <select name="industry" required defaultValue="">
                <option value="" disabled>Select an industry</option>
                <option>Mining</option><option>Construction</option><option>Agriculture</option>
                <option>Forestry</option><option>Fracking</option><option>Rail</option>
                <option>Other</option>
              </select>
            </label>
            <label>Questions or Additional Information<textarea name="message" rows={5} /></label>
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
