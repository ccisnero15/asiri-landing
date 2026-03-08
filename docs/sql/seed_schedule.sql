-- ── Actualizar horarios en business_info ─────────────────────────────────────
-- Ejecutar en Supabase SQL Editor
-- Reemplaza el campo schedule de la fila existente

UPDATE business_info
SET schedule = '[
  {
    "label": "Lun – Sáb",
    "hours": ["10:00 – 14:00", "19:00 – 22:00"]
  },
  {
    "label": "Dom",
    "hours": ["10:00 – 14:00"]
  }
]'::jsonb
WHERE id = (SELECT id FROM business_info LIMIT 1);

-- Verificar resultado
SELECT id, schedule FROM business_info;
