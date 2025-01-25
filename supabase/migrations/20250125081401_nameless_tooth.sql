/*
  # Add More Operator Profiles

  1. New Operators
    - Adds 4 more operator profiles with complete company information
    - Creates corresponding auth users
    - Maintains data consistency with existing operators

  2. Reviews
    - Adds realistic reviews for each new operator
    - Includes varied ratings and detailed comments
    - Timestamps distributed over the last 90 days
*/

DO $$
DECLARE
  new_user_id uuid;
  operator_data record;
BEGIN
  -- Create and store new operators
  FOR operator_data IN (
    SELECT * FROM (VALUES
      (
        'Skyway Charter Group',
        'https://skywaycharter.example.com',
        '1-800-555-0107',
        'bookings@skywaycharter.example.com',
        'operator7@example.com'
      ),
      (
        'Prestige Aviation',
        'https://prestigeaviation.example.com',
        '1-800-555-0108',
        'charter@prestigeaviation.example.com',
        'operator8@example.com'
      ),
      (
        'Blue Horizon Jets',
        'https://bluehorizon.example.com',
        '1-800-555-0109',
        'info@bluehorizon.example.com',
        'operator9@example.com'
      ),
      (
        'Crown Air Charter',
        'https://crownair.example.com',
        '1-800-555-0110',
        'flights@crownair.example.com',
        'operator10@example.com'
      )
    ) AS t (company_name, company_website, phone, notification_email, auth_email)
  ) LOOP
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
      operator_data.auth_email,
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
      notification_email
    ) VALUES (
      new_user_id,
      'agency',
      operator_data.company_name,
      operator_data.company_website,
      operator_data.phone,
      operator_data.notification_email
    );

    -- Add reviews for this operator
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
    FROM (
      SELECT 
        CASE floor(random() * 5 + 1)
          WHEN 1 THEN 5
          WHEN 2 THEN 4
          WHEN 3 THEN 5
          WHEN 4 THEN 4
          ELSE 3
        END as rating,
        CASE floor(random() * 10 + 1)
          WHEN 1 THEN 'Outstanding service! The aircraft was immaculate and the crew was exceptional.'
          WHEN 2 THEN 'Very professional team. Everything was handled perfectly from start to finish.'
          WHEN 3 THEN 'Excellent communication and top-tier service. Will definitely use again.'
          WHEN 4 THEN 'The flight was smooth and the amenities were fantastic. Highly recommended.'
          WHEN 5 THEN 'Great experience overall. The staff went above and beyond.'
          WHEN 6 THEN 'Punctual, professional, and luxurious. Everything you want in a private charter.'
          WHEN 7 THEN 'The attention to detail was impressive. A truly five-star experience.'
          WHEN 8 THEN 'Seamless booking process and exceptional in-flight service.'
          WHEN 9 THEN 'The crew was amazing and the aircraft exceeded our expectations.'
          ELSE 'Reliable service with great attention to customer needs.'
        END as comment,
        now() - (random() * interval '90 days') as created_at
      FROM generate_series(1, 5)
    ) reviews;
  END LOOP;
END $$;