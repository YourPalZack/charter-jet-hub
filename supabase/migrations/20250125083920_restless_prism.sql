/*
  # Add description column to user_profiles
  
  1. Changes
    - Add description text column to user_profiles table
*/

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS description text;

-- Update existing profiles with empty description if not already set
UPDATE user_profiles 
SET description = 'Professional charter operator providing luxury private jet services.'
WHERE description IS NULL;