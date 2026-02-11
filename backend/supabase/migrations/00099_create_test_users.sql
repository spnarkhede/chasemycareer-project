/*
# Create Test User Accounts

## Overview
This migration creates test user accounts for development and testing purposes.

## Test Accounts Created

### Admin Account
- Email: admin@jobtracker.test
- Password: AdminTest123!@#
- Role: admin
- Full Name: Admin User

### Regular User Account
- Email: user@jobtracker.test
- Password: UserTest123!@#
- Role: user
- Full Name: Test User

## Security Notes
- These are test accounts for development only
- Passwords meet the security requirements (12+ chars, uppercase, lowercase, number, special char)
- Should be removed or disabled in production
- Email confirmation is bypassed for testing

## Usage
After running this migration, you can log in with:
- Admin: admin@jobtracker.test / AdminTest123!@#
- User: user@jobtracker.test / UserTest123!@#
*/

-- Insert admin test user into auth.users
-- Password: AdminTest123!@# (hashed with bcrypt)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  role,
  aud,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'admin@jobtracker.test',
  crypt('AdminTest123!@#', gen_salt('bf')),
  now(),
  '{"full_name": "Admin User", "avatar_url": ""}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now(),
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert regular test user into auth.users
-- Password: UserTest123!@# (hashed with bcrypt)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  role,
  aud,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'user@jobtracker.test',
  crypt('UserTest123!@#', gen_salt('bf')),
  now(),
  '{"full_name": "Test User", "avatar_url": ""}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now(),
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert admin profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  avatar_url,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@jobtracker.test',
  'Admin User',
  '',
  'admin'::user_role,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Insert regular user profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  avatar_url,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  'user@jobtracker.test',
  'Test User',
  '',
  'user'::user_role,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Add identities for email/password authentication
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000001',
  '{"sub": "00000000-0000-0000-0000-000000000001", "email": "admin@jobtracker.test"}'::jsonb,
  'email',
  now(),
  now(),
  now()
) ON CONFLICT (provider, provider_id) DO NOTHING;

INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  '00000000-0000-0000-0000-000000000002'::uuid,
  '00000000-0000-0000-0000-000000000002',
  '{"sub": "00000000-0000-0000-0000-000000000002", "email": "user@jobtracker.test"}'::jsonb,
  'email',
  now(),
  now(),
  now()
) ON CONFLICT (provider, provider_id) DO NOTHING;
