import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta     = inject(Meta);
  private titleSvc = inject(Title);
  private doc      = inject(DOCUMENT);

  updateSeo(config: SeoConfig): void {
    this.titleSvc.setTitle(config.title);

    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'keywords',    content: config.keywords ?? '' });
    this.meta.updateTag({ name: 'robots',      content: 'index, follow' });

    this.meta.updateTag({ property: 'og:type',        content: 'website' });
    this.meta.updateTag({ property: 'og:title',       content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image',       content: config.ogImage ?? '' });
    this.meta.updateTag({ property: 'og:url',         content: config.ogUrl ?? '' });
    this.meta.updateTag({ property: 'og:locale',      content: 'es_PE' });

    this.meta.updateTag({ name: 'twitter:card',        content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title',       content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image',       content: config.ogImage ?? '' });

    if (config.canonicalUrl) {
      this.setCanonical(config.canonicalUrl);
    }

    this.injectJsonLd();
  }

  private setCanonical(url: string): void {
    const existing = this.doc.querySelector('link[rel="canonical"]');
    if (existing) existing.remove();

    const link = this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    this.doc.head.appendChild(link);
  }

  private injectJsonLd(): void {
    const existing = this.doc.querySelector('#asiri-jsonld');
    if (existing) existing.remove();

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Asiri',
      description: 'Huevos frescos de granja. Calidad garantizada, entrega directa al cliente.',
      url: 'https://www.asiri.pe',
      telephone: '+51-XXX-XXX-XXX',
      priceRange: '$$',
      image: 'https://www.asiri.pe/assets/images/eggs-hero.webp',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lima',
        addressCountry: 'PE'
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '18:00'
        }
      ],
      sameAs: [
        'https://www.instagram.com/asiri.pe',
        'https://www.facebook.com/asiri.pe'
      ]
    };

    const script = this.doc.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', 'asiri-jsonld');
    script.textContent = JSON.stringify(schema);
    this.doc.head.appendChild(script);
  }
}
