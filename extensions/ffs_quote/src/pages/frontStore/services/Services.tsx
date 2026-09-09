import React from 'react';

const services = [
  {
    number: '01',
    title: 'Bespoke Products',
    tagline: 'Seamless integration. No compromise.',
    text: 'Stop adapting your workflow to your hardware. Our experts engineer tailored solutions that interface flawlessly with your existing equipment. We ensure total compatibility and reliable performance from day one.',
    image: '/ffs/home/distributor.webp'
  },
  {
    number: '02',
    title: 'Rebuild and Repair',
    tagline: 'Reliability restored. Uptime secured.',
    text: 'We don’t just repair; we fully remanufacture your critical fueling components. Our precision shop services all makes and models with exacting standards. We deliver peak efficiency and extended equipment life.',
    image: '/ffs/home/service-repair.jpg'
  },
  {
    number: '03',
    title: 'Engineering',
    tagline: 'Theory to tangible. Strategic project development.',
    text: 'Bring us your complex fueling challenges. We deliver the conceptual design, detailed specifications, and framework your project needs—an engineering blueprint your team can turn into measurable success.',
    image: '/ffs/home/operations.webp'
  }
];

export default function Services() {
  return (
    <main className="ffs-services-page">
      <header className="ffs-services-hero">
        <div className="page-width ffs-reveal">
          <p className="ffs-kicker">Fast Fill Systems</p>
          <h1>Services</h1>
        </div>
      </header>

      <section className="ffs-services-intro page-width ffs-reveal">
        <p className="ffs-kicker">Our Services &amp; Expertise</p>
        <h2>Your Trusted Partner in Fueling Performance</h2>
        <div>
          <p>At Fast Fill Systems, we specialize in reliable, high-performance solutions for fuel and fluid dispensing needs. Our commitment is to efficiency, safety, and operational excellence, ensuring your business runs smoothly with minimal downtime.</p>
          <p>From tailored products to essential maintenance and engineering support, we deliver expert service for the unique demands of commercial, industrial, and fleet sectors.</p>
        </div>
      </section>

      <section className="ffs-services-list page-width">
        {services.map((service, index) => (
          <article className="ffs-service-row ffs-reveal" key={service.title}>
            <div className="ffs-service-row__image">
              <img src={service.image} alt={service.title} loading={index ? 'lazy' : 'eager'} />
              <span>{service.number}</span>
            </div>
            <div className="ffs-service-row__copy">
              <p className="ffs-kicker">{service.tagline}</p>
              <h2>{service.title}</h2>
              <p>{service.text}</p>
              <a className="ffs-text-link" href="/contact#contact-form">Let’s Talk <span>→</span></a>
            </div>
          </article>
        ))}
      </section>

      <section className="ffs-services-cta">
        <div className="page-width ffs-reveal">
          <p className="ffs-kicker">Improve Your Operation</p>
          <h2>Upgrade Your Fuel Efficiency Today!</h2>
          <p>Transform your fuel management system with proven technology. Request a quote and step into a world of enhanced efficiency and cost savings.</p>
          <a className="ffs-button ffs-button--primary" href="/cart">Get a Quote</a>
        </div>
      </section>
    </main>
  );
}

export const layout = { areaId: 'content', sortOrder: 10 };
