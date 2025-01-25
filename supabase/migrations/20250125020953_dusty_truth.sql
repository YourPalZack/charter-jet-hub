/*
  # Update RLS policies for public access
  
  1. Changes
    - Add public access policies for flights and featured_spots tables
    - Ensure anonymous users can view flight data
  
  2. Security
    - Maintain existing authenticated user policies
    - Add public read access
*/

-- Update flights policies to allow public access
DROP POLICY IF EXISTS "Flights are viewable by everyone" ON flights;
CREATE POLICY "Flights are viewable by everyone"
  ON flights
  FOR SELECT
  TO public
  USING (true);

-- Update featured spots policies to allow public access
DROP POLICY IF EXISTS "Featured spots are viewable by everyone" ON featured_spots;
CREATE POLICY "Featured spots are viewable by everyone"
  ON featured_spots
  FOR SELECT
  TO public
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_spots ENABLE ROW LEVEL SECURITY;