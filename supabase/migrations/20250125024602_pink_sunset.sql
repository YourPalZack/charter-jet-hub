/*
  # Add Sample Flights with Fixed Column References

  1. New Data
    - Adds sample flights for each category
    - Includes varied routes, prices, and aircraft types
    - Adds featured spots for select flights

  2. Changes
    - Uses table aliases to avoid ambiguous column references
    - Includes complete sample data set
    - Maintains data consistency with explicit column references
*/

-- Add sample flights
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
  '00000000-0000-0000-0000-000000000000'::uuid,
  c.id,
  sd.title,
  sd.description,
  sd.aircraft_type,
  sd.departure_city,
  sd.departure_airport,
  sd.arrival_city,
  sd.arrival_airport,
  sd.departure_time,
  sd.arrival_time,
  sd.price,
  sd.seats_available,
  sd.operator_name,
  sd.operator_logo,
  sd.contact_email,
  sd.contact_phone
FROM categories c
CROSS JOIN (
  VALUES
    -- Charter Flights
    (
      'Executive Charter to Aspen',
      'Luxury winter getaway charter perfect for ski enthusiasts. Full aircraft charter with VIP service.',
      'Bombardier Global 6000',
      'New York',
      'TEB',
      'Aspen',
      'ASE',
      now() + interval '2 days',
      now() + interval '2 days 4 hours',
      35000,
      12,
      'Luxury Air',
      'https://placehold.co/200x100?text=Luxury+Air',
      'charter@luxuryair.example.com',
      '1-800-555-0100'
    ),
    (
      'Group Charter to Bahamas',
      'Paradise awaits with this group charter to the Bahamas. Perfect for corporate retreats.',
      'Embraer Legacy 600',
      'Miami',
      'MIA',
      'Nassau',
      'NAS',
      now() + interval '5 days',
      now() + interval '5 days 2 hours',
      28000,
      13,
      'Caribbean Jets',
      'https://placehold.co/200x100?text=Caribbean+Jets',
      'bookings@caribbeanjets.example.com',
      '1-800-555-0101'
    ),
    (
      'VIP Charter to London',
      'Ultra-luxury transatlantic charter with full catering and concierge service.',
      'Gulfstream G700',
      'New York',
      'JFK',
      'London',
      'LTN',
      now() + interval '7 days',
      now() + interval '7 days 7 hours',
      85000,
      14,
      'TransAtlantic Aviation',
      'https://placehold.co/200x100?text=TransAtlantic',
      'vip@transatlantic.example.com',
      '1-800-555-0102'
    ),
    -- One-Way Flights
    (
      'One-Way to San Francisco',
      'Efficient one-way private jet service to San Francisco. Perfect for business travelers.',
      'Citation X',
      'Chicago',
      'MDW',
      'San Francisco',
      'SFO',
      now() + interval '3 days',
      now() + interval '3 days 4 hours',
      18000,
      8,
      'Swift Jets',
      'https://placehold.co/200x100?text=Swift+Jets',
      'bookings@swiftjets.example.com',
      '1-800-555-0103'
    ),
    (
      'One-Way to Las Vegas',
      'Direct one-way flight to Las Vegas. Ideal for weekend getaways.',
      'Phenom 300',
      'Seattle',
      'BFI',
      'Las Vegas',
      'LAS',
      now() + interval '4 days',
      now() + interval '4 days 3 hours',
      15000,
      6,
      'West Coast Aviation',
      'https://placehold.co/200x100?text=West+Coast',
      'flights@westcoast.example.com',
      '1-800-555-0104'
    ),
    (
      'One-Way to Orlando',
      'Convenient one-way service to Orlando. Family-friendly option.',
      'Citation CJ4',
      'Washington',
      'IAD',
      'Orlando',
      'MCO',
      now() + interval '6 days',
      now() + interval '6 days 2 hours',
      12000,
      7,
      'East Coast Jets',
      'https://placehold.co/200x100?text=East+Coast',
      'reservations@eastcoast.example.com',
      '1-800-555-0105'
    ),
    -- Empty Leg Flights
    (
      'Empty Leg: LA to Phoenix',
      'Special empty leg opportunity. Save up to 60% off regular charter prices.',
      'Citation Latitude',
      'Los Angeles',
      'VNY',
      'Phoenix',
      'DVT',
      now() + interval '1 day',
      now() + interval '1 day 1 hour',
      4500,
      8,
      'SoCal Jets',
      'https://placehold.co/200x100?text=SoCal+Jets',
      'empty@socaljets.example.com',
      '1-800-555-0106'
    ),
    (
      'Empty Leg: Dallas to Houston',
      'Quick empty leg flight between Texas cities. Great value for groups.',
      'King Air 350i',
      'Dallas',
      'DAL',
      'Houston',
      'HOU',
      now() + interval '2 days',
      now() + interval '2 days 1 hour',
      3800,
      8,
      'Texas Air',
      'https://placehold.co/200x100?text=Texas+Air',
      'sales@texasair.example.com',
      '1-800-555-0107'
    ),
    (
      'Empty Leg: Boston to NYC',
      'Northeast corridor empty leg special. Perfect for business travelers.',
      'Citation XLS+',
      'Boston',
      'BED',
      'New York',
      'TEB',
      now() + interval '3 days',
      now() + interval '3 days 1 hour',
      3200,
      8,
      'Northeast Aviation',
      'https://placehold.co/200x100?text=Northeast',
      'empty@northeast.example.com',
      '1-800-555-0108'
    ),
    -- Last Minute Deals
    (
      'Last Minute: Miami to Bahamas',
      'Tomorrow''s island getaway at special last-minute pricing.',
      'Phenom 100',
      'Miami',
      'OPF',
      'Nassau',
      'NAS',
      now() + interval '1 day',
      now() + interval '1 day 1 hour',
      6500,
      4,
      'Florida Jets',
      'https://placehold.co/200x100?text=Florida+Jets',
      'lastminute@floridajets.example.com',
      '1-800-555-0109'
    ),
    (
      'Last Minute: Vegas to LA',
      'Special rate on tomorrow''s Vegas to LA flight. Limited availability.',
      'Citation M2',
      'Las Vegas',
      'VGT',
      'Los Angeles',
      'VNY',
      now() + interval '1 day',
      now() + interval '1 day 1 hour',
      4800,
      6,
      'Desert Air',
      'https://placehold.co/200x100?text=Desert+Air',
      'deals@desertair.example.com',
      '1-800-555-0110'
    ),
    (
      'Last Minute: Chicago to Detroit',
      'Today''s special rate on Chicago to Detroit route.',
      'Learjet 45XR',
      'Chicago',
      'PWK',
      'Detroit',
      'DTW',
      now() + interval '1 day',
      now() + interval '1 day 1 hour',
      5200,
      8,
      'Midwest Aviation',
      'https://placehold.co/200x100?text=Midwest',
      'lastminute@midwest.example.com',
      '1-800-555-0111'
    )
) AS sd (
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
WHERE c.name IN ('charter', 'one_way', 'empty_leg', 'last_minute');

-- Add featured spots for select flights
INSERT INTO featured_spots (
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
  f.id,
  f.user_id,
  f.category_id,
  d.duration,
  d.start_date,
  d.end_date,
  d.amount_paid,
  true
FROM (
  SELECT id, user_id, category_id
  FROM flights
  ORDER BY random()
  LIMIT 4
) f
CROSS JOIN (
  VALUES
    ('7_days'::feature_duration, now(), now() + interval '7 days', 199),
    ('14_days'::feature_duration, now(), now() + interval '14 days', 349),
    ('21_days'::feature_duration, now(), now() + interval '21 days', 499)
) AS d (duration, start_date, end_date, amount_paid);