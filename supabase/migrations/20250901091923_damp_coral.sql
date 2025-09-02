/*
  # Initial Database Schema for Food Ordering System

  1. New Tables
    - `users` - Customer and admin user accounts
      - `id` (uuid, primary key)
      - `name` (text, user's full name)
      - `email` (text, unique email address)
      - `phone` (text, contact number)
      - `address` (text, delivery address)
      - `role` (enum, customer or admin)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `menu_items` - Restaurant menu with dishes
      - `id` (uuid, primary key)
      - `name` (text, dish name)
      - `description` (text, dish description)
      - `price` (numeric, price in rupees)
      - `category` (text, food category)
      - `image` (text, image URL)
      - `is_veg` (boolean, vegetarian flag)
      - `is_available` (boolean, availability status)
      - `ingredients` (jsonb, list of ingredients)
      - `spice_level` (enum, mild/medium/spicy)
      - `preparation_time` (integer, minutes)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `orders` - Customer orders
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `items` (jsonb, ordered items with quantities)
      - `total_amount` (numeric, total order value)
      - `status` (enum, order status)
      - `order_time` (timestamp)
      - `estimated_delivery_time` (timestamp)
      - `delivery_address` (text)
      - `payment_status` (enum, payment status)
      - `payment_method` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `chat_messages` - AI chatbot conversation history
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `message` (text, chat message content)
      - `is_bot` (boolean, bot or user message)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Admin users can access all data
    - Public read access for menu items

  3. Indexes
    - Add indexes for frequently queried columns
    - Optimize for order lookups and menu filtering
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE spice_level AS ENUM ('mild', 'medium', 'spicy');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  address text,
  role user_role DEFAULT 'customer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price > 0),
  category text NOT NULL,
  image text NOT NULL,
  is_veg boolean DEFAULT true,
  is_available boolean DEFAULT true,
  ingredients jsonb NOT NULL DEFAULT '[]',
  spice_level spice_level DEFAULT 'medium',
  preparation_time integer NOT NULL CHECK (preparation_time > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  items jsonb NOT NULL DEFAULT '[]',
  total_amount numeric(10,2) NOT NULL CHECK (total_amount > 0),
  status order_status DEFAULT 'pending',
  order_time timestamptz DEFAULT now(),
  estimated_delivery_time timestamptz NOT NULL,
  delivery_address text NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  payment_method text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_bot boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for menu_items table
CREATE POLICY "Anyone can read available menu items"
  ON menu_items
  FOR SELECT
  TO anon, authenticated
  USING (is_available = true);

CREATE POLICY "Admins can manage menu items"
  ON menu_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for orders table
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for chat_messages table
CREATE POLICY "Users can read own chat messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own chat messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all chat messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();