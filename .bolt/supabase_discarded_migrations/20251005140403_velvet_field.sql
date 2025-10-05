/*
  # Update orders table with proper foreign key and RLS policies

  1. Foreign Key Relationship
    - Add foreign key constraint from orders.user_id to profiles.id
    - This ensures data integrity and proper relationships

  2. RLS Policies
    - Enable RLS on orders table
    - Add policies for authenticated users to manage their own orders
    - Add trigger for automatic updated_at timestamp

  3. Security
    - Users can only see/modify their own orders
    - Proper authentication checks
*/

-- First, ensure the orders table exists and has the correct structure
-- (This assumes the previous migration created the basic table)

-- Add foreign key constraint from orders.user_id to profiles.id
ALTER TABLE orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Enable Row Level Security on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own orders
CREATE POLICY "Users can view their own orders"
ON orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can create their own orders
CREATE POLICY "Users can create their own orders"
ON orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own orders
CREATE POLICY "Users can update their own orders"
ON orders
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own orders (optional - usually not needed)
CREATE POLICY "Users can delete their own orders"
ON orders
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at column
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_order_number_idx ON orders(order_number);
CREATE INDEX IF NOT EXISTS orders_payment_status_idx ON orders(payment_status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);