/*
  # Initial Schema for Charter Jet Marketplace

  1. New Tables
    - `flights`
      - Core flight listing table
      - Stores all flight details and listing information
    - `categories`
      - Flight categories (Charter, One-Way, Empty Leg, Last Minute)
    - `featured_spots`
      - Tracks featured listing purchases and durations
    - `users`
      - Extended user profile information
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create categories enum
CREATE TYPE flight_category AS ENUM (
  'charter',
  'one_way',
  'empty_leg',
  'last_minute'
);

-- Create listing duration enum
CREATE TYPE feature_duration AS ENUM (
  '7_days',
  '14_days',
  '21_days',
  '28_days'
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name flight_category NOT NULL,
  display_name text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Create flights table
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

ALTER TABLE flights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Flights are viewable by everyone"
  ON flights
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create their own flights"
  ON flights
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flights"
  ON flights
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create featured spots table
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

ALTER TABLE featured_spots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Featured spots are viewable by everyone"
  ON featured_spots
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can purchase featured spots"
  ON featured_spots
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create extended user profiles
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

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add some initial categories
INSERT INTO categories (name, display_name, description) VALUES
  ('charter', 'Charter Flights', 'Book a private jet charter for your next trip'),
  ('one_way', 'One-Way Flights', 'Available one-way private jet flights'),
  ('empty_leg', 'Empty Leg Flights', 'Discounted empty leg flight opportunities'),
  ('last_minute', 'Last Minute Deals', 'Last minute private jet charter deals');

-- Create indexes for better query performance
CREATE INDEX flights_category_id_idx ON flights(category_id);
CREATE INDEX flights_departure_city_idx ON flights(departure_city);
CREATE INDEX flights_arrival_city_idx ON flights(arrival_city);
CREATE INDEX featured_spots_category_id_idx ON featured_spots(category_id);
CREATE INDEX featured_spots_is_active_idx ON featured_spots(is_active);