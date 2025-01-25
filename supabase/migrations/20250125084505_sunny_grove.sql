-- Create a sample operator
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'luxuryair@example.com',
    crypt('operator-password', gen_salt('bf')),
    now(),
    now(),
    now()
  ) RETURNING id INTO new_user_id;

  -- Create operator profile
  INSERT INTO user_profiles (
    id,
    user_type,
    company_name,
    company_website,
    phone,
    notification_email,
    description,
    fleet
  ) VALUES (
    new_user_id,
    'agency',
    'Luxury Air Charter',
    'https://luxuryair.example.com',
    '1-800-555-0123',
    'charter@luxuryair.example.com',
    'Premium private jet charter service offering luxury travel solutions worldwide. Featuring a modern fleet and exceptional customer service.',
    ARRAY['Gulfstream G650', 'Bombardier Global 6000', 'Citation X']
  );

  -- Add sample reviews
  INSERT INTO operator_reviews (
    operator_id,
    user_id,
    rating,
    comment,
    created_at
  )
  SELECT
    new_user_id,
    new_user_id,
    rating,
    comment,
    created_at
  FROM (VALUES
    (5, 'Exceptional service! The aircraft was immaculate and the crew was outstanding.', now() - interval '5 days'),
    (4, 'Very professional team. Everything was handled perfectly.', now() - interval '10 days'),
    (5, 'Excellent communication and top-tier service. Will definitely use again.', now() - interval '15 days'),
    (5, 'The flight was smooth and the amenities were fantastic.', now() - interval '20 days'),
    (4, 'Great experience overall. The staff went above and beyond.', now() - interval '25 days')
  ) AS reviews(rating, comment, created_at);
END $$;