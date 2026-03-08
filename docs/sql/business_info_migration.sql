-- ── business_info table — Asiri Huevos ───────────────────────────────────────
-- Supabase / PostgreSQL migration
-- Run once in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS business_info (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contacto
  phone                    TEXT        NOT NULL,
  whatsapp_number          TEXT        NOT NULL,
  email                    TEXT        NOT NULL,
  address                  TEXT,
  -- JSONB: [{ "label": "Lun – Sáb", "hours": ["10:00 – 14:00", "19:00 – 22:00"] }, ...]
  schedule                 JSONB,

  -- Redes sociales
  instagram_url            TEXT,        -- Ej: https://instagram.com/asiri.pe
  facebook_url             TEXT,        -- Ej: https://facebook.com/asiri.pe

  -- Hero section
  hero_badge               TEXT,
  hero_headline            TEXT,
  hero_headline_highlight  TEXT,
  hero_subtitle            TEXT,

  created_at               TIMESTAMPTZ DEFAULT now(),
  updated_at               TIMESTAMPTZ DEFAULT now()
);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_business_info_updated_at
  BEFORE UPDATE ON business_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed inicial (ajustar valores reales antes de ejecutar)
INSERT INTO business_info (
  phone, whatsapp_number, email, address, schedule,
  instagram_url, facebook_url,
  hero_badge, hero_headline, hero_headline_highlight, hero_subtitle
) VALUES (
  '+51 999 000 000',
  '51999000000',
  'hola@asiri.pe',
  'Lima, Perú',
  '[{"label":"Lun – Sáb","hours":["10:00 – 14:00","19:00 – 22:00"]},{"label":"Dom","hours":["10:00 – 14:00"]}]',
  NULL,   -- completar con URL real de Instagram
  NULL,   -- completar con URL real de Facebook
  '🥚 Huevos Frescos',
  'Huevos frescos',
  'directos de granja',
  'Del campo a tu mesa con la frescura y calidad que tu familia merece.'
);
