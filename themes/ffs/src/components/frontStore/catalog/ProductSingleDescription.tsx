import { _ } from '@evershop/evershop/lib/locale/translate/_';
import { BookOpen, ClipboardList, FileText } from 'lucide-react';
import React from 'react';

const catalogUrl = 'https://drive.google.com/file/d/1bux7X3ec6mlF0glVOmzTjsIqfJ-uwsYy/view?usp=sharing';

export function ProductSingleDescription() {
  return (
    <>
      <section className="ffs-product-technical">
      <div className="page-width">
        <header>
          <p className="ffs-kicker">{_('Product resources')}</p>
          <h2>{_('Technical Information')}</h2>
          <p>{_('Everything you need to specify, install, and support this product.')}</p>
        </header>
        <div className="ffs-product-technical__cards">
          <article className="ffs-product-technical__card">
            <div className="ffs-product-technical__icon"><FileText aria-hidden="true" /></div>
            <div>
              <h3>{_('Marketing Sheets')}</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo eget magna fermentum.</p>
              {/* ponytail: catalog fallback until FFS supplies the product-specific PDF. */}
              <a href={catalogUrl} target="_blank" rel="noopener noreferrer">{_('Download File')}</a>
            </div>
          </article>
          <article className="ffs-product-technical__card">
            <div className="ffs-product-technical__icon"><ClipboardList aria-hidden="true" /></div>
            <div>
              <h3>{_('Spec Sheets')}</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo eget magna fermentum.</p>
              {/* ponytail: catalog fallback until FFS supplies the product-specific spec sheet. */}
              <a href={catalogUrl} target="_blank" rel="noopener noreferrer">{_('Download File')}</a>
            </div>
          </article>
          <article className="ffs-product-technical__card">
            <div className="ffs-product-technical__icon"><BookOpen aria-hidden="true" /></div>
            <div>
              <h3>{_('Fast Fill Systems Catalog')}</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo eget magna fermentum.</p>
              <a href={catalogUrl} target="_blank" rel="noopener noreferrer">{_('Download File')}</a>
            </div>
          </article>
        </div>
      </div>
      </section>
      <section className="ffs-product-newsletter">
        <p>{_('Follow the latest trends')}</p>
        <h2>{_('With our daily newsletter')}</h2>
        <form action="mailto:contact@fastfillsystems.com" method="post" encType="text/plain">
          <label className="sr-only" htmlFor="ffs-newsletter-email">{_('Email')}</label>
          <input id="ffs-newsletter-email" type="email" name="email" placeholder="you@example.com" required />
          <button type="submit">{_('Submit')}</button>
        </form>
      </section>
    </>
  );
}
