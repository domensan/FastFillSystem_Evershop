import React from 'react';

const principles = [
  ['01', 'Quality', 'Before our products are deployed in the field, they undergo rigorous testing and evaluation. Their quality and performance have earned the trust of customers across the fuel industry.'],
  ['02', 'Innovation', 'We continuously expand and adapt our product line, introducing practical solutions that improve workplace safety and operational efficiency.'],
  ['03', 'Service', 'Our worldwide presence gives us the experience to deliver attentive support. We embrace new challenges and provide personal assistance wherever it is needed.']
];

const team = [
  ['Dean Mackey', 'CEO and Founder', '/ffs/home/team-dean.jpg'],
  ['Ben Mackey', 'VP of Operations', '/ffs/home/team-ben.jpg'],
  ['Matt Johnson', 'VP of Sales and Marketing', '/ffs/home/team-matt.jpg'],
  ['Ignacio Villanueva', 'Business Development Manager', '/ffs/home/team-ben.jpg'],
  ['Felipe Guzman', 'Business Development Manager', '/ffs/home/team-ben.jpg'],
  ['Miguel Melo', 'Engineering Manager', '/ffs/home/team-ben.jpg']
];

export default function About() {
  return (
    <main className="ffs-about-page">
      <header className="ffs-about-hero">
        <div className="page-width ffs-reveal">
          <p className="ffs-kicker">Get to Know Fast Fill Systems</p>
          <h1>About Us</h1>
        </div>
      </header>

      <section className="ffs-about-story page-width">
        <div className="ffs-about-story__copy ffs-reveal">
          <p className="ffs-kicker">Where We Started</p>
          <h2>Built From Determination</h2>
          <p>Nozzle Tech, USA LLC started with a single individual who built the company by repairing and revamping damaged diesel nozzles in his small home garage.</p>
          <p>From humble beginnings, the company flourished and earned a strong reputation by upholding exceptionally high standards of quality, service, and innovation.</p>
        </div>
        <div className="ffs-about-story__image ffs-reveal">
          <img src="/ffs/home/about-founder.jpg" alt="The founder of Fast Fill Systems in the original workshop" />
          <span>Our Story</span>
        </div>
      </section>

      <section className="ffs-about-foundation">
        <div className="page-width ffs-reveal">
          <p className="ffs-kicker">The Foundation of Our Success</p>
          <h2>From a Home Garage to an International Organization</h2>
          <p>Quality, service, and innovation have guided Fast Fill Systems since its earliest days. Today, our products and services are recognized and sought after throughout the fuel industry.</p>
        </div>
      </section>

      <section className="ffs-about-pillars page-width">
        <header className="ffs-reveal">
          <p className="ffs-kicker">Our Pillars</p>
          <h2>Strong Principles Maximize Every Outcome</h2>
        </header>
        <div>
          {principles.map(([number, title, text]) => (
            <article className="ffs-reveal" key={title}>
              <span>{number}</span><h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ffs-about-team">
        <div className="page-width">
          <header className="ffs-reveal">
            <p className="ffs-kicker">Fast Fill Systems Team</p>
            <h2>Meet the People Behind FFS</h2>
          </header>
          <div className="ffs-about-team__grid">
            {team.map(([name, role, image]) => (
              <article className="ffs-reveal" key={name}>
                <div><img src={image} alt={name} loading="lazy" /></div>
                <h3>{name}</h3><p>{role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ffs-about-careers page-width">
        <div className="ffs-about-careers__image ffs-reveal">
          <img src="/ffs/home/about-careers.jpg" alt="Fast Fill Systems team collaboration" loading="lazy" />
        </div>
        <div className="ffs-about-careers__copy ffs-reveal">
          <p className="ffs-kicker">Careers</p>
          <h2>Interested in Becoming Part of Our Team?</h2>
          <p>Join a team focused on engineering reliable solutions, delivering exceptional service, and advancing the future of fueling systems.</p>
          <a className="ffs-button ffs-button--primary" href="mailto:contact@fastfillsystems.com">Send Us Your Resume</a>
        </div>
      </section>

      <section className="ffs-services-cta">
        <div className="page-width ffs-reveal">
          <p className="ffs-kicker">Fuel Better</p>
          <h2>Upgrade Your Fuel Efficiency Today!</h2>
          <p>Transform your fuel management system with advanced technology and proven industry experience.</p>
          <a className="ffs-button ffs-button--primary" href="/contact#contact-form">Get a Quote</a>
        </div>
      </section>
    </main>
  );
}

export const layout = { areaId: 'content', sortOrder: 10 };
