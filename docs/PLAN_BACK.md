# Plan Backend: Asiri — FastAPI + Supabase

---

## 1. Datos Dinámicos a Almacenar en Base de Datos

Revisando los componentes actuales, estos son los datos hardcodeados que tienen sentido mover a la DB:

### Tabla: `products`
Del `products.component.ts` — array hardcodeado con 3 productos.

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id` | uuid PK | auto |
| `name` | text | "Huevos de Corral" |
| `description` | text | "Gallinas con libre acceso..." |
| `weight` | text | "60g por huevo" |
| `image_url` | text | "/assets/images/products/eggs-free-range.webp" |
| `badge` | text nullable | "Más Popular" / "Premium" / null |
| `is_active` | bool | true |
| `sort_order` | int | 1, 2, 3 |
| `created_at` | timestamptz | auto |

> Justificación: El campo `price` fue eliminado — el negocio maneja precios por contacto directo (WhatsApp). Se agrega `weight` para diferenciar los tipos de huevo por su peso, dato clave para el cliente.

---

---

### Tabla: `supplies`
Productos de almacén que el negocio vende además de huevos (azúcar, sal, café, papel higiénico, etc.).

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id` | uuid PK | auto |
| `name` | text | "Azúcar" |
| `description` | text | "Venta por unidad o fardo de 10kg" |
| `category` | text | "Endulzantes" / "Condimentos" / "Bebidas" / "Higiene" |
| `icon` | text (emoji) | "🍬" / "🧂" / "☕" / "🧻" |
| `is_active` | bool | true |
| `sort_order` | int | 1, 2, 3... |
| `created_at` | timestamptz | auto |

> El campo `icon` almacena un emoji directamente. No se usan fotos: los productos cambian de marca frecuentemente y gestionar imágenes no es práctico. El emoji es suficiente para identificar visualmente el producto en la tarjeta.

---

### Tabla: `about_stats`
Del `about.component.ts` — 4 stats hardcodeadas.

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id` | uuid PK | auto |
| `value` | text | "2,000+" |
| `label` | text | "Clientes satisfechos" |
| `sort_order` | int | 1, 2, 3, 4 |

> Justificación: El negocio crece, estos números deben actualizarse.

---

### Tabla: `about_values`
Del `about.component.ts` — 3 tarjetas de valores del negocio.

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id` | uuid PK | auto |
| `icon` | text | "🌿" |
| `title` | text | "Natural" |
| `description` | text | "Sin hormonas, sin antibióticos..." |
| `sort_order` | int | 1, 2, 3 |

---

### Tabla: `business_info` *(fila única — configuración global)*
Actualmente disperso en `contact.component.html`, `seo.service.ts` y `whatsapp-button`. Todos con placeholders `XXXXXXXXX`.

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id` | uuid PK | auto |
| `phone` | text | "+51 999 123 456" |
| `whatsapp_number` | text | "51999123456" (para `wa.me/`) |
| `email` | text | "hola@asiri.pe" |
| `address` | text | "Lima, Perú" |
| `schedule` | text | "Lun - Vie: 8:00 am - 6:00 pm" |
| `instagram_url` | text | "https://instagram.com/asiri.pe" |
| `facebook_url` | text | "https://facebook.com/asiri.pe" |
| `hero_badge` | text | "100% Naturales" |
| `hero_headline` | text | "Huevos frescos" |
| `hero_headline_highlight` | text | "directo de granja" |
| `hero_subtitle` | text | "En Asiri creemos que..." |

> Justificación: El número de WhatsApp, email, horarios y textos del hero están todos hardcodeados. Esta tabla actúa como panel de configuración del negocio.

---

### Tabla: `contact_submissions` *(nueva funcionalidad)*
Actualmente el formulario solo abre WhatsApp sin guardar nada.

| Campo | Tipo |
|---|---|
| `id` | uuid PK |
| `name` | text |
| `email` | text |
| `phone` | text nullable |
| `message` | text |
| `created_at` | timestamptz |
| `status` | enum: `'pending'`, `'read'`, `'replied'` |

---

### Supabase Storage: Buckets

| Bucket | Contenido |
|---|---|
| `product-images` | Fotos de productos (dinámicas, gestionadas desde admin) |
| `site-assets` | Logo, hero, íconos e imágenes generales del sitio (estáticas) |

Ambos buckets son públicos (URLs accesibles sin token). Los uploads se realizan siempre con `service_role` key desde FastAPI, nunca desde el cliente Angular.

---

## 2. Endpoints FastAPI

### Endpoints Públicos (sin autenticación)

```
GET  /api/products          → Lista de productos activos (ordenados por sort_order)
GET  /api/supplies          → Lista de productos de almacén activos (ordenados por sort_order)
GET  /api/about/stats       → Lista de stats (ordenados por sort_order)
GET  /api/about/values      → Lista de valores del negocio
GET  /api/business-info     → Objeto único con toda la config del negocio (hero, contacto, redes)
POST /api/contact           → Guardar formulario de contacto en DB
```

### Endpoints Privados (API key en header `X-API-Key`)

```
# Productos (huevos)
POST   /api/admin/products          → Crear producto
PUT    /api/admin/products/{id}     → Editar producto (peso, descripción, etc.)
DELETE /api/admin/products/{id}     → Desactivar (soft delete: is_active = false)

# Almacén
POST   /api/admin/supplies          → Crear producto de almacén
PUT    /api/admin/supplies/{id}     → Editar producto de almacén
DELETE /api/admin/supplies/{id}     → Desactivar (soft delete: is_active = false)

# Stats y Values
PUT    /api/admin/about/stats/{id}  → Actualizar stat
PUT    /api/admin/about/values/{id} → Actualizar value

# Config del negocio
PUT    /api/admin/business-info     → Actualizar teléfono, redes, textos hero, horario

# Submissions
GET    /api/admin/contact           → Ver mensajes recibidos (con filtro por status)
PATCH  /api/admin/contact/{id}      → Actualizar status (pending → read → replied)
```

---

## 3. Estructura del Proyecto FastAPI

```
asiri-api/
├── app/
│   ├── main.py              # FastAPI instance, CORS, routers
│   ├── config.py            # Settings (Supabase URL, keys, API key)
│   ├── db.py                # Cliente Supabase (supabase-py)
│   ├── models/
│   │   ├── product.py       # Pydantic schemas
│   │   ├── about.py
│   │   ├── business_info.py
│   │   └── contact.py
│   └── routers/
│       ├── public.py        # GET endpoints sin auth
│       ├── contact.py       # POST /contact
│       └── admin.py         # Endpoints privados
├── requirements.txt
├── Dockerfile               # Para Railway/Render
└── .env                     # SUPABASE_URL, SUPABASE_KEY, API_KEY
```

**Dependencias clave:**
```
fastapi
uvicorn
supabase          # cliente oficial Python
python-dotenv
pydantic-settings
```

---

## 4. Supabase como Backend-as-a-Service

Supabase provee:
- **PostgreSQL** como base de datos
- **Storage** para imágenes de productos
- **Row Level Security (RLS)**: las tablas públicas solo permiten SELECT; las privadas requieren service-role key (usada solo en FastAPI, nunca expuesta al cliente Angular)
- **Dashboard** para gestionar datos directamente sin panel admin personalizado (suficiente para empezar)

Configuración de RLS por tabla:
```
products, about_stats, about_values, business_info → SELECT público
contact_submissions                                 → INSERT público, SELECT solo service-role
```

---

## 5. Render vs Railway — Evaluación

| Criterio | Render | Railway |
|---|---|---|
| **Free tier** | Duerme tras 15 min sin requests (cold start ~30s) | $5 USD/mes de crédito incluido, sin sleep |
| **Cold start** | Problema real para landing page con poco tráfico | No aplica |
| **DX** | Bueno, deploy desde GitHub | Muy bueno, más simple |
| **Pricing** | $7/mes para always-on | ~$1-2/mes con tráfico bajo (usage-based) |
| **Docker** | Soportado | Soportado |
| **Variables de entorno** | Panel visual claro | Panel visual claro |
| **Logs** | Básicos en free | Mejores en free |

**Recomendación: Railway**

Para una landing page con tráfico bajo-medio, Railway es superior porque:
1. Sin cold starts — el endpoint de `GET /api/products` es llamado en SSR de Angular, un cold start de 30s en Render rompería la experiencia
2. El crédito de $5 cubre perfectamente una FastAPI con poco tráfico
3. Deploy más simple (sin Dockerfile si usas Nixpacks)

---

## 6. Arquitectura de Despliegue

```
Usuario
  │
  ▼
Angular SSR (Vercel / Firebase Hosting)
  │  SSR: llama la API antes de enviar HTML al browser
  │  Client: re-hidrata, no hace más llamadas a la API
  ▼
FastAPI en Railway
  │  Usa service-role key de Supabase (privada, en env vars)
  ▼
Supabase
  ├── PostgreSQL (datos)
  └── Storage (imágenes de productos)
```

> El SSR de Angular llamará `GET /api/products` y `GET /api/business-info` en el servidor, lo que significa que los datos dinámicos quedarán en el HTML inicial — beneficio SEO completo.

---

## 7. Prioridad de Implementación

| Fase | Qué construir |
|---|---|
| **1** | Setup FastAPI + conexión Supabase + tablas en Supabase |
| **2** | Endpoints públicos GET (products, about, business-info) |
| **3** | `POST /api/contact` con almacenamiento en DB |
| **4** | Integrar Angular → reemplazar datos hardcodeados con llamadas a la API |
| **5** | Endpoints admin + autenticación por API key |
| **6** | Deploy Railway + configurar variables de entorno |
