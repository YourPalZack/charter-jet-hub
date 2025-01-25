/*
  # Add operator reviews schema and sample data

  1. New Tables
    - Add operator_reviews table with:
      - id (uuid, primary key)
      - operator_id (uuid, references user_profiles)
      - user_id (uuid, references auth.users)
      - rating (integer, 1-5)
      - comment (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for viewing and creating reviews
*/

-- Create operator reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS operator_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id uuid REFERENCES user_profiles(id),
  user_id uuid REFERENCES auth.users(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE operator_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ BEGIN
  CREATE POLICY "Operator reviews are viewable by everyone"
    ON operator_reviews
    FOR SELECT
    TO public
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can create reviews"
    ON operator_reviews
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS operator_reviews_operator_id_idx ON operator_reviews(operator_id);
CREATE INDEX IF NOT EXISTS operator_reviews_user_id_idx ON operator_reviews(user_id);

-- Insert sample reviews for each operator
DO $$
DECLARE
  operator record;
  reviewer_id uuid;
BEGIN
  -- Get a reviewer ID (using the first operator as reviewer for simplicity)
  SELECT id INTO reviewer_id FROM user_profiles WHERE user_type = 'agency' LIMIT 1;

  -- Add reviews for each operator
  FOR operator IN SELECT id FROM user_profiles WHERE user_type = 'agency'
  LOOP
    -- Add 5 reviews per operator
    FOR i IN 1..5 LOOP
      INSERT INTO operator_reviews (
        operator_id,
        user_id,
        rating,
        comment,
        created_at
      ) VALUES (
        operator.id,
        reviewer_id,
        CASE (random() * 4)::int + 1
          WHEN 1 THEN 5
          WHEN 2 THEN 4
          WHEN 3 THEN 4
          WHEN 4 THEN 5
          ELSE 3
        END,
        CASE (random() * 4)::int + 1
          WHEN 1 THEN 'Excellent service and professional staff. Would highly recommend!'
          WHEN 2 THEN 'Great experience from start to finish. Very responsive team.'
          WHEN 3 THEN 'Top-notch aircraft and exceptional customer service.'
          WHEN 4 THEN 'Reliable and luxurious. Will definitely use again.'
          ELSE 'Good service overall, met all our expectations.'
        END,
        now() - (random() * interval '90 days')
      );
    END LOOP;
  END LOOP;
END $$;