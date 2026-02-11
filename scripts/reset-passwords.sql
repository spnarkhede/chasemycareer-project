-- Reset passwords for dummy users using Supabase Auth Admin functions
-- This needs to be run with service_role permissions

-- Note: You cannot directly update passwords via SQL
-- You need to use one of these methods:

-- METHOD 1: Via Supabase Dashboard (RECOMMENDED)
-- 1. Go to: https://supabase.com/dashboard/project/itazzlbcxisavqxvkmoe/auth/users
-- 2. Find each user (admin@jobtracker.test, user@jobtracker.test, ashwini@cmc.com)
-- 3. Click the three dots (⋮) → "Reset Password"
-- 4. Set the password:
--    - admin@jobtracker.test: AdminTest123!@#
--    - user@jobtracker.test: UserTest123!@#
--    - ashwini@cmc.com: Ashwini123

-- METHOD 2: Send password reset emails
-- Run this to send password reset emails to all dummy users:
SELECT auth.send_password_reset_email('admin@jobtracker.test');
SELECT auth.send_password_reset_email('user@jobtracker.test');
SELECT auth.send_password_reset_email('ashwini@cmc.com');

-- METHOD 3: Ensure emails are confirmed (run this first)
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmation_token = NULL,
  confirmation_sent_at = NULL
WHERE email IN ('admin@jobtracker.test', 'user@jobtracker.test', 'ashwini@cmc.com');

-- Verify users are properly set up
SELECT 
  id,
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  encrypted_password IS NOT NULL as has_password,
  created_at
FROM auth.users
WHERE email IN ('admin@jobtracker.test', 'user@jobtracker.test', 'ashwini@cmc.com')
ORDER BY email;

-- Check profiles
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  u.email_confirmed_at IS NOT NULL as email_confirmed
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email IN ('admin@jobtracker.test', 'user@jobtracker.test', 'ashwini@cmc.com')
ORDER BY p.email;
