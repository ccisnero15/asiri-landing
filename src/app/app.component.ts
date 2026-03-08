import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from './core/services/seo.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { ProductsComponent } from './components/products/products.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { WhatsappButtonComponent } from './shared/components/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ProductsComponent,
    ContactComponent,
    FooterComponent,
    WhatsappButtonComponent
  ],
  template: `
    <app-navbar />
    <main>
      <section id="inicio"><app-hero /></section>
      <section id="sobre-nosotros"><app-about /></section>
      <section id="productos"><app-products /></section>
      <section id="contacto"><app-contact /></section>
    </main>
    <app-footer />
    <app-whatsapp-button />
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateSeo({
      title:        'Asiri | Huevos Frescos de Granja - Calidad Garantizada',
      description:  'Asiri ofrece huevos frescos de granja con entrega directa. Huevos de corral, orgánicos y convencionales. Calidad garantizada en Lima, Perú.',
      keywords:     'huevos frescos, huevos de corral, huevos orgánicos, huevos Lima, huevos Perú, Asiri',
      ogImage:      'https://www.asiri.pe/assets/images/eggs-hero.webp',
      ogUrl:        'https://www.asiri.pe',
      canonicalUrl: 'https://www.asiri.pe'
    });
  }
}
