import React from 'react';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import './ffs.scss';
import { languageUrls as getLanguageUrls } from './languageUrls.js';

export default function FfsNav() {
  const [open, setOpen] = React.useState(false);
  const [languageUrls, setLanguageUrls] = React.useState({
    en: 'https://www.fastfillsystems.com',
    es: 'https://es.fastfillsystems.com'
  });
  React.useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', closeOnEscape);
    setLanguageUrls(getLanguageUrls(window.location));
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  const links = (
    <>
      <a href="/products" onClick={() => setOpen(false)}>{_('Products')}</a>
      <a href="/services" onClick={() => setOpen(false)}>{_('Services')}</a>
      <a href="/about" onClick={() => setOpen(false)}>{_('About Us')}</a>
      <a href="/updates" onClick={() => setOpen(false)}>{_('Updates')}</a>
      <a href="/distributor" onClick={() => setOpen(false)}>{_('Distributor')}</a>
      <a className="ffs-button ffs-button--primary"
        href="https://drive.google.com/file/d/1bux7X3ec6mlF0glVOmzTjsIqfJ-uwsYy/view?usp=sharing"
        target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>{_('Download Catalog')}</a>
      <span className="ffs-language-switcher" aria-label={_('Language')}>
        <a href={languageUrls.en} lang="en" hrefLang="en">EN</a>
        <span aria-hidden="true">/</span>
        <a href={languageUrls.es} lang="es" hrefLang="es">ES</a>
      </span>
    </>
  );

  return (
    <>
      <nav className="ffs-nav" aria-label={_('Main navigation')}>{links}</nav>
      <div className={`ffs-mobile-nav ${open ? 'is-open' : ''}`}>
        <button type="button" aria-expanded={open} aria-controls="ffs-mobile-menu"
          onClick={() => setOpen((current) => !current)}>
          <span className="ffs-mobile-nav__icon" aria-hidden="true"><i /><i /><i /></span>
          <span>{open ? _('Close') : _('Menu')}</span>
        </button>
        <nav id="ffs-mobile-menu" aria-label={_('Mobile navigation')}>{links}</nav>
      </div>
    </>
  );
}

export const layout = {
  areaId: 'headerBottom',
  sortOrder: 10
};
