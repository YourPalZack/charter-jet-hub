/*
  # Update schema for charter jet marketplace
  
  This migration adds tables and policies only if they don't exist yet.
  
  1. Tables
    - categories (flight categories)
    - flights (flight listings)
    - featured_spots (featured listing spots)
    - profiles (extended user profiles)
    
  2. Security
    - Enable RLS on all tables
    - Add policies for public viewing
    - Add policies for authenticated user actions
    
  3. Indexes
    - Add performance indexes for common queries
*/

-- Create tables only if they don't exist
DO $$ BEGIN
  -- Create tables
  CREATE TABLE IF NOT EXISTS categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    display_name text NOT NULL,
    description text NOT NULL,
    created_at timestamptz DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS flights (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    category_id uuid REFERENCES categories(id),
    title text NOT NULL,
    description text NOT NULL,
    aircraft_type text NOT NULL,
    departure_city text NOT NULL,
    departure_airport text NOT NULL,
    arrival_city text NOT NULL,
    arrival_airport text NOT NULL,
    departure_time timestamptz NOT NULL,
    arrival_time timestamptz NOT NULL,
    price decimal(10,2),
    seats_available int NOT NULL,
    operator_name text NOT NULL,
    operator_logo text,
    contact_email text NOT NULL,
    contact_phone text NOT NULL,
    is_verified boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS featured_spots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    flight_id uuid REFERENCES flights(id),
    user_id uuid REFERENCES auth.users(id),
    category_id uuid REFERENCES categories(id),
    duration feature_duration NOT NULL,
    start_date timestamptz NOT NULL,
    end_date timestamptz NOT NULL,
    amount_paid decimal(10,2) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    company_name text,
    company_logo text,
    website text,
    phone text,
    is_operator boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Enable RLS on tables if not already enabled
DO $$ BEGIN
  ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE featured_spots ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create policies if they don't exist
DO $$ BEGIN
  -- Flights policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own flights'
  ) THEN
    CREATE POLICY "Users can create their own flights"
      ON flights
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own flights'
  ) THEN
    CREATE POLICY "Users can update their own flights"
      ON flights
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Featured spots policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can purchase featured spots'
  ) THEN
    CREATE POLICY "Users can purchase featured spots"
      ON featured_spots
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Profiles policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile"
      ON profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;

EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Add initial categories if they don't exist
INSERT INTO categories (name, display_name, description)
SELECT 'charter', 'Charter Flights', 'Book a private jet charter for your next trip'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'charter');

INSERT INTO categories (name, display_name, description)
SELECT 'one_way', 'One-Way Flights', 'Available one-way private jet flights'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'one_way');

INSERT INTO categories (name, display_name, description)
SELECT 'empty_leg', 'Empty Leg Flights', 'Discounted empty leg flight opportunities'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'empty_leg');

INSERT INTO categories (name, display_name, description)
SELECT 'last_minute', 'Last Minute Deals', 'Last minute private jet charter deals'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'last_minute');

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS flights_category_id_idx ON flights(category_id);
CREATE INDEX IF NOT EXISTS flights_departure_city_idx ON flights(departure_city);
CREATE INDEX IF NOT EXISTS flights_arrival_city_idx ON flights(arrival_city);
CREATE INDEX IF NOT EXISTS featured_spots_category_id_idx ON featured_spots(category_id);
CREATE INDEX IF NOT EXISTS featured_spots_is_active_idx ON featured_spots(is_active);