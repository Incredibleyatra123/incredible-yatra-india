-- Enable uuid extension
create extension if not exists "pgcrypto";

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text UNIQUE,
  phone text,
  password_hash text,
  role text DEFAULT 'customer',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  title text NOT NULL,
  short_desc text,
  long_desc text,
  price numeric NOT NULL,
  duration_days int,
  seats_per_day int DEFAULT 50,
  images jsonb DEFAULT '[]',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  package_id uuid REFERENCES packages(id) ON DELETE CASCADE,
  booking_date date,
  pax_count int DEFAULT 1,
  total_amount numeric,
  payment_status text DEFAULT 'PENDING',
  payment_gateway_id text,
  booking_status text DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  amount numeric,
  gateway_response jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  discount_type text,
  discount_value numeric,
  valid_from date,
  valid_to date,
  usage_limit int DEFAULT 1
);
