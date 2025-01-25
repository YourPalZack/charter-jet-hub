/*
  # Add operator reviews functionality

  1. New Tables
    - `operator_reviews`
      - `id` (uuid, primary key)
      - `operator_id` (uuid, references user_profiles)
      - `user_id` (uuid, references auth.users)
      - `rating` (integer, 1-5)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `operator_reviews` table
    - Add policies for authenticated users to create reviews
    - Add policy for public to read reviews
*/

-- Create operator reviews table
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
CREATE POLICY "Operator reviews are viewable by everyone"
  ON operator_reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON operator_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX operator_reviews_operator_id_idx ON operator_reviews(operator_id);
CREATE INDEX operator_reviews_user_id_idx ON operator_reviews(user_id);