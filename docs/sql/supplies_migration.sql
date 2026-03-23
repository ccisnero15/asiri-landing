-- ── supplies table — Asiri Almacén ────────────────────────────────────────────
-- Supabase / PostgreSQL migration
-- Run once in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS supplies (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  description TEXT        NOT NULL,
  category    TEXT        NOT NULL,
  icon        TEXT        NOT NULL,       -- Emoji para mostrar en la tarjeta
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para las queries más frecuentes
CREATE INDEX IF NOT EXISTS idx_supplies_active_sort
  ON supplies (is_active, sort_order);

-- RLS: SELECT público, escritura solo con service_role key (desde FastAPI)
ALTER TABLE supplies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de supplies activos"
  ON supplies FOR SELECT
  USING (is_active = true);

-- ── Seed inicial ───────────────────────────────────────────────────────────────

INSERT INTO supplies (name, description, category, icon, sort_order) VALUES

  -- Endulzantes
  ('Azúcar',             'Venta por unidad o fardo. Consultar stock y precio.',      'Endulzantes',  '🍚', 10),

  -- Condimentos
  ('Sal fina',           'Venta por unidad o fardo. Consultar stock y precio.',      'Condimentos',  '🧂', 20),
  ('Sal gruesa',         'Venta por unidad o fardo. Consultar stock y precio.',      'Condimentos',  '🧂', 21),

  -- Bebidas
  ('Té en saquitos',     'Venta por caja (unidad). Consultar marcas disponibles.',   'Bebidas',      '🍵', 30),
  ('Café en saquitos',   'Venta por caja (unidad). Consultar marcas disponibles.',   'Bebidas',      '☕', 31),
  ('Yerba mate',         'Venta por unidad o fardo. Consultar stock y precio.',      'Bebidas',      '🧉', 32),

  -- Higiene
  ('Papel higiénico',    'Venta por unidad o fardo. Consultar stock y precio.',      'Higiene',      '🧻', 40),
  ('Servilletas',        'Venta por paquete o fardo. Consultar stock y precio.',     'Higiene',      '🗒️', 41),
  ('Jabón de tocador',   'Venta por unidad o pack. Consultar marcas disponibles.',   'Higiene',      '🧼', 42),

  -- Limpieza
  ('Detergente',         'Venta por unidad o pack. Consultar marcas disponibles.',   'Limpieza',     '🫧', 50),
  ('Lavandina',          'Venta por unidad o pack. Consultar stock y precio.',       'Limpieza',     '🪣', 51);
