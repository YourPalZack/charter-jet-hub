/*
  # Add sample flight data
  
  1. Changes
    - Add sample flights with a fixed UUID
    - Add featured spots for sample flights
  
  2. Security
    - All data remains publicly readable
    - Protected by existing RLS policies
*/

-- Add sample flights using a fixed UUID for consistency
INSERT INTO flights (
  id,
  user_id,
  category_id,
  title,
  description,
  aircraft_type,
  departure_city,
  departure_airport,
  arrival_city,
  arrival_airport,
  departure_time,
  arrival_time,
  price,
  seats_available,
  operator_name,
  operator_logo,
  contact_email,
  contact_phone
) 
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid, -- Fixed system user ID
  c.id,
  CASE c.name
    WHEN 'charter' THEN 'Luxury Charter to Las Vegas'
    WHEN 'one_way' THEN 'One-Way Flight to Miami'
    WHEN 'empty_leg' THEN 'Empty Leg Special to NYC'
    WHEN 'last_minute' THEN 'Last Minute Deal to LA'
  END,
  CASE c.name
    WHEN 'charter' THEN 'Experience luxury travel at its finest with our private charter to Las Vegas. Perfect for groups up to 8 passengers.'
    WHEN 'one_way' THEN 'Direct one-way flight to Miami. Ideal for business travelers or small groups.'
    WHEN 'empty_leg' THEN 'Take advantage of this empty leg opportunity to New York City at a fraction of the regular price.'
    WHEN 'last_minute' THEN 'Special last-minute deal to Los Angeles. Limited time offer with premium service.'
  END,
  'Gulfstream G650',
  'Chicago',
  'ORD',
  CASE c.name
    WHEN 'charter' THEN 'Las Vegas'
    WHEN 'one_way' THEN 'Miami'
    WHEN 'empty_leg' THEN 'New York'
    WHEN 'last_minute' THEN 'Los Angeles'
  END,
  CASE c.name
    WHEN 'charter' THEN 'LAS'
    WHEN 'one_way' THEN 'MIA'
    WHEN 'empty_leg' THEN 'JFK'
    WHEN 'last_minute' THEN 'LAX'
  END,
  now() + interval '1 day',
  now() + interval '1 day' + interval '3 hours',
  CASE c.name
    WHEN 'charter' THEN 25000
    WHEN 'one_way' THEN 15000
    WHEN 'empty_leg' THEN 8000
    WHEN 'last_minute' THEN 12000
  END,
  8,
  'Elite Jets',
  'https://placehold.co/200x100?text=Elite+Jets',
  'bookings@elitejets.example.com',
  '1-800-555-0123'
FROM categories c
WHERE NOT EXISTS (SELECT 1 FROM flights);

-- Add featured spots for some flights
INSERT INTO featured_spots (
  id,
  flight_id,
  user_id,
  category_id,
  duration,
  start_date,
  end_date,
  amount_paid,
  is_active
)
SELECT 
  gen_random_uuid(),
  f.id,
  f.user_id,
  f.category_id,
  '7_days'::feature_duration,
  now(),
  now() + interval '7 days',
  500.00,
  true
FROM flights f
WHERE NOT EXISTS (SELECT 1 FROM featured_spots)
LIMIT 2;