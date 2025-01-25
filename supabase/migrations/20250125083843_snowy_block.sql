/*
  # Add fleet column to user_profiles
  
  1. Changes
    - Add fleet array column to user_profiles table
*/

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS fleet text[] DEFAULT '{}';

-- Update existing profiles with empty fleet array if not already set
UPDATE user_profiles 
SET fleet = '{}' 
WHERE fleet IS NULL;