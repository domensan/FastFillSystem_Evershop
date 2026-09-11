import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

const categories = [
  ['Fuel Nozzles', '/fuel-nozzles', '/ffs/home/nozzle.png', 'Crafted for durability, long life, superior control, and accuracy in demanding environments.'],
  ['Couplers', '/couplers', '/ffs/home/couplers.png', 'Our couplers are engineered for quick and efficient fluid transfer, making them indispensable for high demand operations.'],
  ['Fuel Receivers', '/fuel-receivers', '/ffs/home/receivers.png', 'Reliable and robust connection points built for safe, efficient fuel transfer.'],
  ['Fuel Vents', '/fuel-vents', '/ffs/home/vents.png', 'Pioneering vent designs that regulate pressure and help prevent overspilling.'],
  ['Pressureless', '/pressureless', '/ffs/home/pressureless.png', 'A safer, environmentally friendly alternative with consistent and reliable fuel flow.']
];

const advantages = [
  ['Boost efficiency', 'Boost efficiency with cutting-edge fueling solutions.'],
  ['Enhance profitability', 'Enhance profitability through streamlined processes.'],
  ['Durable products', 'Versatile, rugged products tailored for demanding industries.'],
  ['Experience', 'Industry-leading innovation, quality, and support.']
];

const testimonials = [
  ['“FFS transformed our fueling operations. Their couplers and nozzles are easy to handle and incredibly efficient.”', 'John D.', 'Fleet Manager'],
  ['“The reliability and durability of FFS products are unmatched. Our fuel management process is safer and more efficient.”', 'Emily R.', 'Operations Director'],
  ['“Their pressureless fueling options have significantly reduced our environmental impact.”', 'Liam S.', 'Environmental Manager']
];

export default function FeaturedProducts() {
  return (
    <>
      <section className="ffs-product-showcase page-width">
        {categories.map(([name, url, image, text], index) => (
          <article className="ffs-product-card ffs-reveal" key={name}>
            <a className="ffs-product-card__image" href={url}>
              <img src={image} alt={name} loading={index > 1 ? 'lazy' : 'eager'} />
            </a>
            <div>
              <h3>{_(name)}</h3>
              <p>{_(text)}</p>
              <a className="ffs-text-link" href={url}>{_('View Products')} <span>→</span></a>
            </div>
          </article>
        ))}
      </section>

      <section id="about" className="ffs-downtime">
        <div className="page-width ffs-split">
          <div className="ffs-downtime__copy ffs-reveal">
            <p className="ffs-kicker">{_('Built for demanding operations')}</p>
            <h2>{_('The cost of downtime is staggering! Your fueling can’t be the weak link!')}</h2>
            <p>{_('From construction and mining to logistics, generic fueling systems fail. We provide specialized, rugged fuel and fluid systems that eliminate bottlenecks and reduce operational costs.')}</p>
            <div className="ffs-advantages">
              {advantages.map(([title, text]) => <article key={title}><h3>{_(title)}</h3><p>{_(text)}</p></article>)}
            </div>
            <a className="ffs-button ffs-button--primary" href="/contact#contact-form">{_('Get a Quote')}</a>
          </div>
          <div className="ffs-downtime__image ffs-reveal">
            <img src="/ffs/home/operations.webp" alt="Fast Fill Systems equipment in operation" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="ffs-promise page-width ffs-split">
        <div className="ffs-promise__visual ffs-reveal">
          <img src="/ffs/home/distributor.webp" alt="Fast Fill Systems fueling equipment" loading="lazy" />
        </div>
        <div className="ffs-promise__copy ffs-reveal">
          <p className="ffs-kicker">{_('Our Promise')}</p>
          <h2>{_('Revolutionizing Fuel Efficiency and Performance')}</h2>
          <p>{_('We are at the forefront of innovative fuel technology. Our commitment to excellence and customer satisfaction sets us apart in the fuel system industry.')}</p>
          <article><span>01</span><div><h3>{_('Unmatched Efficiency')}</h3><p>{_('Products designed for optimal fuel efficiency, reducing operational costs and environmental impact.')}</p></div></article>
          <article><span>02</span><div><h3>{_('Tailored Solutions')}</h3><p>{_('Customized solutions for the unique needs of each industry we serve.')}</p></div></article>
        </div>
      </section>

      <section id="updates" className="ffs-testimonials">
        <div className="page-width">
          <p className="ffs-kicker">{_('Trusted by Industry Leaders')}</p>
          <h2>{_('We Engineer Solutions That Deliver the Outcomes Customers Expect.')}</h2>
          <div className="ffs-testimonial-grid">
            {testimonials.map(([quote, name, role]) => (
              <blockquote className="ffs-reveal" key={name}>
                <p>{_(quote)}</p><footer><strong>{name}</strong><span>{_(role)}</span></footer>
              </blockquote>
            ))}
          </div>
          <div className="ffs-stats" aria-label="Fast Fill Systems at a glance">
            <div><strong>30+</strong><span>{_('Years of Experience')}</span></div>
            <div><strong>{_('Global')}</strong><span>{_('Distributor Network')}</span></div>
            <div><strong>{_('Proven')}</strong><span>{_('Industry Solutions')}</span></div>
            <div><strong>{_('Expert')}</strong><span>{_('Technical Support')}</span></div>
          </div>
        </div>
      </section>

      <section id="distributor" className="ffs-distributor">
        <div className="page-width ffs-split">
          <div className="ffs-distributor__image ffs-reveal"><img src="/ffs/home/distributor.webp" alt="FFS fuel nozzle system" loading="lazy" /></div>
          <div className="ffs-distributor__copy ffs-reveal">
            <p className="ffs-kicker">{_('Discover the Difference')}</p>
            <h2>{_('Become a Distributor Today!')}</h2>
            <ul>
              <li>{_('Experience top-tier, innovative fueling solutions from FFS.')}</li>
              <li>{_('Gain a market edge with high-quality, reliable products.')}</li>
              <li>{_('Enjoy comprehensive support and product training.')}</li>
              <li>{_('Partner with a company aligned with industry growth.')}</li>
            </ul>
            <a className="ffs-button ffs-button--primary" href="/distributor">{_('Become a Distributor')}</a>
          </div>
        </div>
      </section>

      <section className="ffs-contact page-width">
        <div className="ffs-contact__copy ffs-reveal">
          <p className="ffs-kicker">{_('Get in Touch')}</p>
          <h2>{_('Drop Us a Line!')}</h2>
          <p>{_('Ready to enhance your fueling operations? Contact Fast Fill Systems to discover how our advanced solutions can benefit your business.')}</p>
          <address>
            <span><strong>{_('Office')}</strong>2055 S. Tracy Hall Parkway, Provo, UT 84606</span>
            <span><strong>{_('Email')}</strong>sales@fastfillsystems.com</span>
            <span><strong>{_('Phone Number')}</strong>+1 801-491-3600</span>
          </address>
        </div>
        <form className="ffs-contact__form ffs-reveal" action="/cart">
          <div><label>{_('First Name')}<input name="firstName" placeholder={_('First Name')} /></label><label>{_('Last Name')}<input name="lastName" placeholder={_('Last Name')} /></label></div>
          <div><label>{_('Phone')}<input type="tel" name="phone" placeholder={_('Work Number')} /></label><label>{_('Email')}<input type="email" name="email" placeholder={_('Work Email')} /></label></div>
          <label>{_('Message')}<textarea name="message" rows={5} placeholder={_('How can we help?')} /></label>
          <button className="ffs-button ffs-button--primary" type="submit">{_('Send')}</button>
        </form>
      </section>
    </>
  );
}

export const layout = { areaId: 'content', sortOrder: 20 };
