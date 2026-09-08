import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';

const slides = [
  '/ffs/home/hero-1.webp',
  '/ffs/home/hero-2.webp',
  '/ffs/home/hero-3.webp',
  '/ffs/home/hero-4.webp'
];

export default function Hero() {
  return (
    <>
      <section className="ffs-home-hero">
        <div className="ffs-home-hero__slides" aria-hidden="true">
          {[...slides, slides[0]].map((slide, index) => (
            <img src={slide} alt="" key={`${slide}-${index}`} />
          ))}
        </div>
        <div className="ffs-home-hero__content">
          <h1>{_('Efficiency, minimize costs: experience the unparalleled potential of Fast Fill Systems!')}</h1>
          <p>{_('Fast Fill Systems delivers fast-fill fueling technology for mining, construction, agriculture, bus fleets, rail, and heavy industrial equipment. Fuel faster, safer, and more efficiently.')}</p>
          <div className="ffs-home-actions">
            <a className="ffs-button ffs-button--primary" href="/products">{_('View Products')}</a>
            <a className="ffs-button ffs-button--outline" href="/contact#contact-form">{_('Request a Quote')}</a>
          </div>
        </div>
        <img className="ffs-home-hero__badge" src="/ffs/home/badge.png" alt="Fast Fill Systems — over 30 years" />
      </section>

      <section id="services" className="ffs-home-heading page-width ffs-reveal">
        <p className="ffs-kicker">{_('Our Services')}</p>
        <h2>{_('Featured Products')}</h2>
        <p>{_('Revolutionize your operations and unlock unparalleled productivity and performance with our industry-leading products.')}</p>
      </section>
    </>
  );
}

export const layout = { areaId: 'content', sortOrder: 1 };
