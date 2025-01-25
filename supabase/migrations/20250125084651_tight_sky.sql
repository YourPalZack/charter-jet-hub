-- Add missing fields to flights table
ALTER TABLE flights ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE flights ADD COLUMN IF NOT EXISTS amenities text[];
ALTER TABLE flights ADD COLUMN IF NOT EXISTS cancellation_policy text;
ALTER TABLE flights ADD COLUMN IF NOT EXISTS baggage_allowance text;
ALTER TABLE flights ADD COLUMN IF NOT EXISTS catering_included boolean DEFAULT false;
ALTER TABLE flights ADD COLUMN IF NOT EXISTS wifi_available boolean DEFAULT false;

-- Add indexes for slug fields
CREATE INDEX IF NOT EXISTS flights_slug_idx ON flights(slug);

-- Update existing flights with slugs
UPDATE flights
SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Create trigger to automatically generate slugs for new flights
CREATE OR REPLACE FUNCTION generate_flight_slug()
RETURNS trigger AS $$
BEGIN
  NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_flight_slug
  BEFORE INSERT ON flights
  FOR EACH ROW
  EXECUTE FUNCTION generate_flight_slug();

-- Add policies for the new fields
CREATE POLICY "Anyone can view flight details"
  ON flights FOR SELECT
  TO public
  USING (true);