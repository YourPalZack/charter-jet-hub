/*
  # Add sample operator data and reviews

  1. Sample Data
    - Create auth users for operators
    - Add operator profiles
    - Add sample reviews
    
  2. Changes
    - Create users with proper array handling
    - Insert operator profiles with array elements
    - Insert reviews for each operator
*/

DO $$
DECLARE
  operator_users uuid[] := ARRAY[]::uuid[];
  new_user_id uuid;
  i integer;
BEGIN
  -- Create 6 users for our operators
  FOR i IN 1..6 LOOP
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
      'operator' || i || '@example.com',
      crypt('operator-password-' || i, gen_salt('bf')),
      now(),
      now(),
      now()
    ) RETURNING id INTO new_user_id;
    
    operator_users := array_append(operator_users, new_user_id);
  END LOOP;

  -- Insert operator profiles
  FOR i IN 1..6 LOOP
    INSERT INTO user_profiles (
      id,
      user_type,
      company_name,
      company_website,
      phone,
      notification_email
    )
    SELECT
      operator_users[i],
      'agency',
      company_data.company_name,
      company_data.company_website,
      company_data.phone,
      company_data.notification_email
    FROM (
      VALUES
        ('Elite Aviation Services', 'https://eliteaviation.example.com', '1-800-555-0101', 'contact@eliteaviation.example.com'),
        ('Luxury Air Charter', 'https://luxuryair.example.com', '1-800-555-0102', 'info@luxuryair.example.com'),
        ('Executive Jets Inc', 'https://executivejets.example.com', '1-800-555-0103', 'charter@executivejets.example.com'),
        ('Premium Charter Solutions', 'https://premiumcharter.example.com', '1-800-555-0104', 'bookings@premiumcharter.example.com'),
        ('Global Aviation Group', 'https://globalaviation.example.com', '1-800-555-0105', 'info@globalaviation.example.com'),
        ('Sky Kings Charter', 'https://skykings.example.com', '1-800-555-0106', 'charter@skykings.example.com')
    ) AS company_data(company_name, company_website, phone, notification_email)
    OFFSET i - 1
    LIMIT 1;
  END LOOP;

  -- Insert sample reviews
  FOR i IN 1..6 LOOP
    -- Add 5 reviews for each operator
    FOR j IN 1..5 LOOP
      INSERT INTO operator_reviews (
        operator_id,
        user_id,
        rating,
        comment,
        created_at
      )
      SELECT
        operator_users[i],
        operator_users[1], -- Use the first operator as the reviewer
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
        now() - (random() * interval '90 days');
    END LOOP;
  END LOOP;
END $$;