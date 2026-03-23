# Plan: Landing Page "Asiri" - Angular 19 con SSR/SEO

## Contexto
Se necesita una landing page para **Asiri**, un negocio de venta de huevos. El objetivo es mostrar información del negocio y ofrecer múltiples vías de contacto (WhatsApp, redes sociales, formulario). Solo frontend por ahora. Paleta de colores: verde y violeta pastel. Diseño moderno y limpio inspirado en la imagen de referencia.

---

## 1. Setup del Proyecto

```bash
npm install -g @angular/cli@19
ng new asiri --ssr --style=scss --routing=false
cd asiri
```

- `--ssr`: Habilita `@angular/ssr` con `server.ts`, hydration y prerender
- `--routing=false`: No necesitamos router, es single-page con smooth scroll
- Standalone components por defecto en Angular 19+

---

## 2. Estructura de Archivos

```
src/
├── styles/
│   ├── _variables.scss       # Paleta verde/violeta pastel, spacing, breakpoints
│   ├── _mixins.scss          # respond-to(), flex helpers, card-base
│   ├── _typography.scss      # Font Inter, heading scale
│   ├── _reset.scss           # CSS reset minimal
│   └── _animations.scss      # fadeInUp keyframes
├── styles.scss               # Importa todos los partials + utilidades globales
│
├── app/
│   ├── core/services/
│   │   └── seo.service.ts    # Meta tags, OG, Twitter Card, JSON-LD, canonical
│   │
│   ├── shared/
│   │   ├── components/whatsapp-button/   # FAB flotante WhatsApp
│   │   └── directives/smooth-scroll.directive.ts
│   │
│   ├── components/
│   │   ├── navbar/            # Logo, links con smooth scroll, CTA, hamburger mobile
│   │   ├── hero/              # Headline, subtitle, 2 CTAs, imagen hero
│   │   ├── about/             # Historia, valores (3 cards), stats (4 números)
│   │   ├── products/          # 3 tarjetas de producto con imagen, precio, CTA
│   │   ├── contact/           # Formulario + info de contacto + redes sociales
│   │   └── footer/            # Logo, nav links, redes, copyright
│   │
│   ├── app.component.ts      # Shell: compone todas las secciones
│   └── app.config.ts         # provideClientHydration, provideHttpClient
│
├── assets/images/             # logo.svg, eggs-hero.webp, productos/*.webp
├── robots.txt
├── sitemap.xml
└── index.html                 # lang="es", preconnect fonts, theme-color
```

---

## 3. Paleta de Colores

| Token | Valor | Uso |
|-------|-------|-----|
| `$color-primary` | `#A8D5A2` | Verde pastel - identidad principal |
| `$color-primary-dark` | `#7CBF74` | Hover states, texto sobre blanco |
| `$color-primary-light` | `#D4EDCC` | Fondos de sección |
| `$color-secondary` | `#C9B8E8` | Violeta pastel - acentos |
| `$color-secondary-dark` | `#A88FD4` | Tags, estados activos |
| `$color-secondary-light` | `#EDE7F6` | Fondos alternos de sección |
| `$color-bg` | `#FAFAF8` | Fondo general |
| `$color-text-primary` | `#2D3436` | Headings |
| `$color-text-secondary` | `#636E72` | Body text |

---

## 4. Componentes - Detalle

### 4.1 Navbar
- Fixed top, transparente inicialmente, fondo blur al hacer scroll (signal `isScrolled`)
- Links: Inicio, Sobre Nosotros, Productos, Contacto (smooth scroll con directiva)
- Botón CTA "Contáctanos" → scroll a contacto
- Menú hamburguesa en mobile (signal `mobileMenuOpen`)
- Usa `@for` (control flow de Angular 17+)

### 4.2 Hero
- Gradiente: `linear-gradient(135deg, primary-light, bg, secondary-light)`
- Badge "100% Naturales" en violeta
- Headline: "Huevos frescos directo de granja"
- Subtitle descriptivo del negocio
- 2 botones: "Ver Productos" y "Contáctanos"
- Imagen hero con `NgOptimizedImage` + `priority` (preload en SSR)
- Layout: column en mobile, row en desktop

### 4.3 About (Sobre Nosotros)
- 3 tarjetas de valores: Natural, Familiar, Fresco
- Barra de stats tipo referencia: 15+ años, 2000+ clientes, 50K+ huevos/mes, 100% calidad
- Cards con hover elevado

### 4.4 Products (Productos)
- Grid de 3 tarjetas: Convencionales, De Corral (badge "Más Popular"), Orgánicos (badge "Premium")
- Cada card: imagen con `NgOptimizedImage` lazy, nombre, descripción, peso del huevo, botón "Pedir ahora" → contacto
- El campo `price` fue eliminado. Se muestra `weight` (ej: `"60g por huevo"`) en el footer de la card, donde antes estaba el precio
- Mostrar `weight` con un ícono de balanza (SVG inline) para contexto visual rápido
- Fondo sección violeta suave `#F8F5FF`

### 4.5 Supplies (Almacén)
- Sección `id="almacen"` ubicada entre Productos y Contacto
- Fondo verde pastel `$color-primary-light` para diferenciarse de la sección de huevos
- Pills de categoría arriba del grid (filtro reactivo con signals). Solo se muestran si hay más de una categoría
- Grid: 2 columnas en mobile, 4 en desktop
- Cada tarjeta: emoji en círculo blanco, nombre, descripción (incluye tipo de venta: unidad/fardo), botón "Consultar"
- Sin imágenes — se usa emoji almacenado en el campo `icon` de la DB (cambia de marca frecuentemente, gestionar fotos no es práctico)
- Botón "Consultar" abre WhatsApp con mensaje pre-llenado: `"Hola! Quisiera consultar sobre: {nombre}"`
- `whatsapp_number` obtenido de `businessInfo` vía `ApiService` (misma llamada cacheada de `shareReplay`)

### 4.6 Contact (Contacto)
- Layout 2 columnas: formulario + sidebar info
- Formulario: nombre, email, teléfono, mensaje (con `FormsModule` + `ngModel`)
- Submit abre WhatsApp con mensaje pre-llenado (sin backend)
- Signal `submitted` para mostrar mensaje de éxito
- Sidebar: teléfono, email, dirección, horario, links a Instagram y Facebook

### 4.7 Footer
- 3 columnas: brand + descripción, navegación, redes sociales
- Fondo oscuro `#2D3436` para contraste
- Copyright dinámico con año actual

### 4.8 WhatsApp FAB
- Botón flotante fixed bottom-right, aparece tras scroll > 300px
- Abre chat WhatsApp con mensaje pre-llenado
- Animación pulse en el shadow
- SVG icon inline del logo WhatsApp

---

## 5. SEO Service (`seo.service.ts`)

- Inyecta `Title`, `Meta`, `DOCUMENT` (SSR-safe)
- Método `updateSeo()` llamado en `AppComponent.ngOnInit`:
  - Title: "Asiri | Huevos Frescos de Granja"
  - Meta description, keywords, robots
  - Open Graph: title, description, image, url, locale (es_PE)
  - Twitter Card: summary_large_image
  - Canonical URL
- Método privado `injectJsonLd()`: schema `LocalBusiness` con nombre, dirección, horarios, redes

---

## 6. Archivos SEO Estáticos

- `robots.txt`: Allow all, referencia a sitemap
- `sitemap.xml`: Una sola URL `/` con priority 1.0
- `index.html`: `lang="es"`, `<meta name="theme-color" content="#A8D5A2">`, preconnect Google Fonts (Inter)
- Ambos archivos agregados al array `assets` en `angular.json`

---

## 7. Secuencia de Implementación

| Fase | Tareas |
|------|--------|
| **1. Fundación** | `ng new`, crear SCSS partials (`_variables`, `_mixins`, `_typography`, `_reset`, `_animations`), actualizar `styles.scss` |
| **2. Core** | `SeoService`, `SmoothScrollDirective` |
| **3. Shared** | `WhatsappButtonComponent` |
| **4. Secciones** | Navbar → Hero → About → Products → Contact → Footer |
| **5. App Shell** | `AppComponent` (importar todo), `app.config.ts` (hydration) |
| **6. SEO/Static** | Actualizar `index.html`, crear `robots.txt`, `sitemap.xml`, config `angular.json` |
| **7. Assets** | Imágenes placeholder (logo, hero, productos) |

---

## 8. Verificación

1. `ng serve` - Verificar que compila y renderiza correctamente
2. `ng build --configuration=production` - Build de producción con SSR
3. `npm run serve:ssr:asiri` - Verificar SSR local en `http://localhost:4000`
4. Inspeccionar HTML fuente: meta tags, JSON-LD, canonical deben estar en el HTML estático
5. Chrome Lighthouse en mobile: SEO = 100, Performance > 90
6. Probar responsive: 375px, 768px, 1280px
7. Verificar smooth scroll, hamburger menu, WhatsApp button, formulario
