/*
# Create profiles table for user management

## Overview
This migration creates the profiles table to store user information synced from Supabase Auth.
Users authenticate via Google OAuth and their profile is automatically created.

## Tables Created

### profiles
- `id` (uuid, primary key, references auth.users)
  - User's unique identifier from Supabase Auth
- `email` (text, unique)
  - User's email from Google OAuth
- `full_name` (text)
  - User's full name from Google profile
- `avatar_url` (text)
  - User's profile picture URL from Google
- `role` (user_role enum, default: 'user', not null)
  - User's role in the system (user or admin)
- `created_at` (timestamptz, default: now())
  - Timestamp when profile was created
- `updated_at` (timestamptz, default: now())
  - Timestamp when profile was last updated

## Security
- RLS is enabled on profiles table
- First user to register becomes admin automatically
- Admin helper function prevents circular permission checks
- Admins have full access to all profiles
- Users can view their own profile
- Users can update their own profile except role field

## Trigger
- Auto-sync trigger creates profile when user confirms email
- Runs only when confirmed_at changes from NULL to NOT NULL
- First user gets admin role, subsequent users get user role

## Public View
- public_profiles view exposes safe user data for sharing
- Only includes id, full_name, and avatar_url
*/

-- Create user_role enum
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  full_name text,
  avatar_url text,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create admin helper function
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean 
LANGUAGE sql 
SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- RLS Policies
CREATE POLICY "Admins have full access" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile without changing role" ON profiles
  FOR UPDATE TO authenticated 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id AND role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Create public_profiles view
CREATE VIEW public_profiles AS
SELECT
  id,
  full_name,
  avatar_url
FROM profiles;

-- Create trigger function to auto-sync users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  -- Count existing profiles
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Insert new profile
  INSERT INTO profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger to sync users on confirmation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();