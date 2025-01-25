/*
  # Add operator listings and sample data

  1. Updates
    - Add sample flights for each operator
    - Link flights to operators via user_id
    - Add variety of aircraft types and routes
    - Set realistic prices and availability

  2. Data Quality
    - Ensure all references are valid
    - Use realistic dates and times
    - Maintain data consistency
*/

DO $$
DECLARE
  operator record;
  flight_id uuid;
BEGIN
  -- Add flights for each operator
  FOR operator IN 
    SELECT id FROM user_profiles WHERE user_type = 'agency'
  LOOP
    -- Add multiple flights per operator with different routes and aircraft
    FOR i IN 1..3 LOOP
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
        operator.id,
        categories.id,
        CASE (random() * 2)::int
          WHEN 0 THEN 'Luxury ' || arrival_city || ' Charter'
          WHEN 1 THEN 'Private Jet to ' || arrival_city
          ELSE 'Executive Flight to ' || arrival_city
        END,
        'Experience luxury travel at its finest with our private charter flight. Featuring a ' ||
        aircraft_type || ' with full amenities and professional crew.',
        aircraft_type,
        departure_city,
        departure_airport,
        arrival_city,
        arrival_airport,
        departure_time,
        arrival_time,
        price,
        seats_available,
        up.company_name,
        'https://placehold.co/400x200?text=' || replace(up.company_name, ' ', '+'),
        up.notification_email,
        up.phone
      FROM (
        SELECT
          CASE (random() * 4)::int
            WHEN 0 THEN 'Gulfstream G650'
            WHEN 1 THEN 'Bombardier Global 6000'
            WHEN 2 THEN 'Cessna Citation X'
            WHEN 3 THEN 'Embraer Legacy 600'
            ELSE 'Dassault Falcon 7X'
          END as aircraft_type,
          CASE (random() * 4)::int
            WHEN 0 THEN 'New York'
            WHEN 1 THEN 'Los Angeles'
            WHEN 2 THEN 'Miami'
            WHEN 3 THEN 'Las Vegas'
            ELSE 'Chicago'
          END as departure_city,
          CASE (random() * 4)::int
            WHEN 0 THEN 'JFK'
            WHEN 1 THEN 'LAX'
            WHEN 2 THEN 'MIA'
            WHEN 3 THEN 'LAS'
            ELSE 'ORD'
          END as departure_airport,
          CASE (random() * 4)::int
            WHEN 0 THEN 'London'
            WHEN 1 THEN 'Paris'
            WHEN 2 THEN 'Dubai'
            WHEN 3 THEN 'Tokyo'
            ELSE 'Singapore'
          END as arrival_city,
          CASE (random() * 4)::int
            WHEN 0 THEN 'LHR'
            WHEN 1 THEN 'CDG'
            WHEN 2 THEN 'DXB'
            WHEN 3 THEN 'HND'
            ELSE 'SIN'
          END as arrival_airport,
          now() + (random() * interval '30 days') as departure_time,
          now() + (random() * interval '30 days') + interval '8 hours' as arrival_time,
          (random() * 40000 + 10000)::numeric(10,2) as price,
          (random() * 10 + 4)::int as seats_available
      ) flight_data
      CROSS JOIN (
        SELECT id FROM categories ORDER BY random() LIMIT 1
      ) categories
      CROSS JOIN (
        SELECT company_name, notification_email, phone
        FROM user_profiles
        WHERE id = operator.id
      ) up
      RETURNING id INTO flight_id;

      -- Randomly feature some flights
      IF random() < 0.3 THEN
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
          flight_id,
          operator.id,
          category_id,
          CASE (random() * 2)::int
            WHEN 0 THEN '7_days'::feature_duration
            WHEN 1 THEN '14_days'::feature_duration
            ELSE '21_days'::feature_duration
          END,
          now(),
          now() + interval '7 days',
          CASE (random() * 2)::int
            WHEN 0 THEN 199
            WHEN 1 THEN 349
            ELSE 499
          END,
          true
        FROM flights
        WHERE id = flight_id;
      END IF;
    END LOOP;
  END LOOP;
END $$;