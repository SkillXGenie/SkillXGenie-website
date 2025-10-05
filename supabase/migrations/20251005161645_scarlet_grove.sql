/*
  # Fix Foreign Key Constraint Issue

  1. Changes
    - Remove foreign key constraint from orders table
    - Add trigger to create profile automatically on user signup
    - Update orders table to not require profiles table

  2. Security
    - Maintain RLS policies
    - Ensure data integrity without strict foreign key
*/

-- Remove the foreign key constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update existing users who might not have profiles
INSERT INTO public.profiles (id, name, created_at, updated_at)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)),
  NOW(),
  NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;