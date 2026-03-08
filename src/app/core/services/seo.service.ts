import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  phone?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta = inject(Meta);
  private titleSvc = inject(Title);
  private doc = inject(DOCUMENT);

  updateSeo(config: SeoConfig): void {
    this.titleSvc.setTitle(config.title);

    // ── Standard ──────────────────────────────────────────────────────────────
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'keywords', content: config.keywords ?? '' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'author', content: 'Huevos Asiri' });

    // ── Local SEO (Salta, Argentina) ──────────────────────────────────────────
    this.meta.updateTag({ name: 'geo.region',    content: 'AR-A' });
    this.meta.updateTag({ name: 'geo.placename', content: 'Salta, Argentina' });

    // ── Open Graph ────────────────────────────────────────────────────────────
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Huevos Asiri' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({
      property: 'og:description',
      content: config.description,
    });
    this.meta.updateTag({
      property: 'og:image',
      content: config.ogImage ?? '',
    });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/webp' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({
      property: 'og:image:alt',
      content: config.ogImageAlt ?? config.description,
    });
    this.meta.updateTag({ property: 'og:url', content: config.ogUrl ?? '' });
    this.meta.updateTag({ property: 'og:locale', content: 'es_PE' });

    // ── Twitter Card ──────────────────────────────────────────────────────────
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({
      name: 'twitter:description',
      content: config.description,
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content: config.ogImage ?? '',
    });
    this.meta.updateTag({
      name: 'twitter:image:alt',
      content: config.ogImageAlt ?? config.description,
    });

    if (config.canonicalUrl) {
      this.setCanonical(config.canonicalUrl);
    }

    this.injectJsonLd(config);
  }

  private setCanonical(url: string): void {
    const existing = this.doc.querySelector('link[rel="canonical"]');
    if (existing) existing.remove();

    const link = this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    this.doc.head.appendChild(link);
  }

  private injectJsonLd(config: SeoConfig): void {
    const existing = this.doc.querySelector('#asiri-jsonld');
    if (existing) existing.remove();

    const sameAs = [config.instagramUrl, config.facebookUrl].filter(
      (u): u is string => !!u,
    );

    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Asiri',
      description:
        'Huevos frescos de granja. Calidad garantizada, entrega directa al cliente.',
      url: 'https://huevos-asiri.vercel.app',
      priceRange: '$$',
      image: 'https://huevos-asiri.vercel.app/assets/images/eggs-hero.webp',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Salta',
        addressRegion: 'Salta',
        addressCountry: 'AR',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ],
          opens: '08:00',
          closes: '18:00',
        },
      ],
    };

    if (config.phone) schema['telephone'] = config.phone;
    if (sameAs.length) schema['sameAs'] = sameAs;

    const script = this.doc.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', 'asiri-jsonld');
    script.textContent = JSON.stringify(schema);
    this.doc.head.appendChild(script);
  }
}
