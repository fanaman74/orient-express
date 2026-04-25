-- Menu items for Orient Express Chinese restaurant
-- Each item has fr/nl/en translations

CREATE TABLE IF NOT EXISTS menu_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  num             TEXT,
  section         TEXT NOT NULL CHECK (section IN ('soupes','entrees','volailles','viandes','fruits-mer','riz-nouilles')),
  name_fr         TEXT NOT NULL,
  name_nl         TEXT,
  name_en         TEXT,
  description_fr  TEXT,
  description_nl  TEXT,
  description_en  TEXT,
  price           NUMERIC(6,2) NOT NULL DEFAULT 0,
  active          BOOLEAN DEFAULT true,
  display_order   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (active = true);
