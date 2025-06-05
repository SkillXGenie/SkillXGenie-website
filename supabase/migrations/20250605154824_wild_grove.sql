/*
  # Create badges and user achievements system

  1. New Tables
    - `badges`
      - `id` (uuid, primary key)
      - `name` (text) - Badge name
      - `description` (text) - Badge description
      - `icon` (text) - Icon URL
      - `created_at` (timestamptz)
    
    - `user_badges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `badge_id` (uuid, references badges)
      - `earned_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Policies for badges table
CREATE POLICY "Anyone can view badges"
  ON badges
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for user_badges table
CREATE POLICY "Users can view their own badges"
  ON user_badges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert first login badge
INSERT INTO badges (id, name, description, icon)
VALUES (
  'f0f0f0f0-0f0f-0f0f-0f0f-0f0f0f0f0f0f',
  'First Day',
  'Welcome to Skill X Genie! Badge earned on your first login.',
  'https://api.dicebear.com/7.x/shapes/svg?seed=first-day'
);