-- Insert sample operator data
DO $$
DECLARE
  new_user_id uuid;
  operator_data record;
BEGIN
  -- Create and store operators
  FOR operator_data IN (
    SELECT * FROM (VALUES
      (
        'Elite Aviation Services',
        'https://eliteaviation.example.com',
        '1-800-555-0101',
        'contact@eliteaviation.example.com',
        'operator1@example.com',
        'Luxury private jet charter services with a modern fleet of aircraft.',
        ARRAY['Gulfstream G650', 'Bombardier Global 6000', 'Cessna Citation X']
      ),
      (
        'Luxury Air Charter',
        'https://luxuryair.example.com',
        '1-800-555-0102',
        'info@luxuryair.example.com',
        'operator2@example.com',
        'Premium charter flights with exceptional service and safety standards.',
        ARRAY['Embraer Legacy 600', 'Dassault Falcon 7X', 'Hawker 800XP']
      ),
      (
        'Executive Jets Inc',
        'https://executivejets.example.com',
        '1-800-555-0103',
        'charter@executivejets.example.com',
        'operator3@example.com',
        'Specialized in corporate and executive private jet charters.',
        ARRAY['Bombardier Challenger 350', 'Citation Sovereign', 'Learjet 75']
      ),
      (
        'Premium Charter Solutions',
        'https://premiumcharter.example.com',
        '1-800-555-0104',
        'bookings@premiumcharter.example.com',
        'operator4@example.com',
        'Comprehensive charter solutions for business and leisure travel.',
        ARRAY['Gulfstream G550', 'Falcon 2000', 'Citation XLS+']
      ),
      (
        'Global Aviation Group',
        'https://globalaviation.example.com',
        '1-800-555-0105',
        'info@globalaviation.example.com',
        'operator5@example.com',
        'Worldwide private jet charter services with 24/7 availability.',
        ARRAY['Boeing Business Jet', 'Airbus ACJ319', 'Global 7500']
      ),
      (
        'Sky Kings Charter',
        'https://skykings.example.com',
        '1-800-555-0106',
        'charter@skykings.example.com',
        'operator6@example.com',
        'VIP charter services with a focus on luxury and comfort.',
        ARRAY['Phenom 300', 'Citation Latitude', 'Legacy 500']
      ),
      (
        'Prestige Aviation',
        'https://prestigeaviation.example.com',
        '1-800-555-0107',
        'info@prestigeaviation.example.com',
        'operator7@example.com',
        'Boutique charter operator specializing in high-end private travel.',
        ARRAY['Challenger 650', 'Citation X+', 'Phenom 100']
      ),
      (
        'Blue Horizon Jets',
        'https://bluehorizon.example.com',
        '1-800-555-0108',
        'charter@bluehorizon.example.com',
        'operator8@example.com',
        'Modern fleet and personalized service for discerning travelers.',
        ARRAY['Global 6500', 'Falcon 8X', 'Citation CJ4']
      )
    ) AS t (
      company_name, 
      company_website, 
      phone, 
      notification_email, 
      auth_email,
      description,
      fleet
    )
  ) LOOP
    -- Create auth user if not exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = operator_data.auth_email) THEN
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
        notification_email,
        description,
        fleet
      ) VALUES (
        new_user_id,
        'agency',
        operator_data.company_name,
        operator_data.company_website,
        operator_data.phone,
        operator_data.notification_email,
        operator_data.description,
        operator_data.fleet
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
    END IF;
  END LOOP;
END $$;