import { Toaster } from '@components/common/ui/Sonner.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';

export function Footer() {
  return (
    <footer className="ffs-footer">
      <div className="page-width ffs-footer__grid">
        <div className="ffs-footer__brand">
          <span className="ffs-footer__brand-logo" role="img" aria-label="Fast Fill Systems">
            <span aria-hidden="true">R</span>
          </span>
          <p>{_('Igniting the Future of Fueling with innovative solutions, quality and service.')}</p>
        </div>
        <div>
          <h2>{_('Navigation')}</h2>
          <nav aria-label={_('Footer navigation')}>
            <a href="/products">{_('Products')}</a>
            <a href="/services">{_('Services')}</a>
            <a href="/about">{_('About Us')}</a>
            <a href="/updates">{_('Updates')}</a>
            <a href="/distributor">{_('Distributor')}</a>
            <a href="/contact#contact-form">{_('Request a Quote')}</a>
          </nav>
        </div>
        <div>
          <h2>{_('Contact Us')}</h2>
          <address>
            <span>2055 S. Tracy Hall Parkway<br />Provo, UT 84606</span>
            <a href="tel:+18014913600">+1 801-491-3600</a>
            <a href="mailto:contact@fastfillsystems.com">contact@fastfillsystems.com</a>
          </address>
        </div>
        <div>
          <h2>{_('Operating Hours')}</h2>
          <p>{_('Monday to Thursday')}<br /><strong>{_('8 AM to 5 PM MST/MDT')}</strong></p>
          <p>{_('Friday')}<br /><strong>{_('8 AM to 3 PM MST/MDT')}</strong></p>
        </div>
      </div>
      <div className="ffs-footer__bottom page-width">
        <span>© {new Date().getFullYear()} Fast Fill Systems</span>
        <a href="/products">{_('Explore products')}</a>
      </div>
      <Toaster />
    </footer>
  );
}
