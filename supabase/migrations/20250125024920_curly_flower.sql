/*
  # Add User Profiles and Alerts System

  1. New Tables
    - `user_profiles`
      - Stores user type and preferences
      - Links to auth.users
    - `flight_alerts`
      - Stores user alert preferences
      - Configurable by category, location, and price

  2. Changes
    - Adds user type enum
    - Adds alert frequency enum
    - Updates RLS policies

  3. Security
    - Enables RLS on new tables
    - Adds policies for user access
*/

-- Create user type enum
CREATE TYPE user_type AS ENUM (
  'user',
  'agency'
);

-- Create alert frequency enum
CREATE TYPE alert_frequency AS ENUM (
  'daily',
  'weekly',
  'instant'
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  user_type user_type NOT NULL,
  company_name text,
  company_website text,
  phone text,
  notification_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create flight alerts table
CREATE TABLE IF NOT EXISTS flight_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  category_id uuid REFERENCES categories(id),
  departure_city text,
  arrival_city text,
  min_price decimal(10,2),
  max_price decimal(10,2),
  frequency alert_frequency NOT NULL DEFAULT 'daily',
  is_active boolean DEFAULT true,
  last_notified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for flight_alerts
CREATE POLICY "Users can view their own alerts"
  ON flight_alerts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own alerts"
  ON flight_alerts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX flight_alerts_user_id_idx ON flight_alerts(user_id);
CREATE INDEX flight_alerts_category_id_idx ON flight_alerts(category_id);
CREATE INDEX flight_alerts_is_active_idx ON flight_alerts(is_active);