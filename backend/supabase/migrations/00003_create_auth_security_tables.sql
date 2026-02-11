/*
# Create Authentication Security Tables

## Overview
This migration creates tables for enhanced authentication security including:
- MFA backup codes storage
- Login attempts tracking for rate limiting
- Session management

## Tables Created

### mfa_backup_codes
- `id` (uuid, primary key, auto-generated)
  - Unique identifier for each backup code
- `user_id` (uuid, references profiles.id)
  - User who owns this backup code
- `code_hash` (text, not null)
  - BCrypt hash of the backup code
- `used` (boolean, default: false)
  - Whether this code has been used
- `created_at` (timestamptz, default: now())
  - When the code was generated
- `used_at` (timestamptz, nullable)
  - When the code was used

### login_attempts
- `id` (uuid, primary key, auto-generated)
  - Unique identifier for each attempt
- `email` (text, not null)
  - Email address of login attempt
- `ip_address` (text)
  - IP address of the attempt
- `success` (boolean, not null)
  - Whether the login was successful
- `attempted_at` (timestamptz, default: now())
  - When the attempt occurred

### user_sessions
- `id` (uuid, primary key, auto-generated)
  - Unique session identifier
- `user_id` (uuid, references profiles.id)
  - User who owns this session
- `device_info` (text)
  - Browser/device information
- `ip_address` (text)
  - IP address of the session
- `last_activity` (timestamptz, default: now())
  - Last activity timestamp
- `created_at` (timestamptz, default: now())
  - When session was created

## Security
- RLS enabled on all tables
- Users can only access their own backup codes
- Users can only view their own sessions
- Admins can view all login attempts for monitoring
- Login attempts table has no RLS for security logging

## Functions
- `check_rate_limit(email text)` - Returns true if rate limit exceeded
- `record_login_attempt(email text, ip text, success boolean)` - Records login attempt
- `cleanup_old_login_attempts()` - Removes attempts older than 24 hours
*/

-- Create mfa_backup_codes table
CREATE TABLE IF NOT EXISTS mfa_backup_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code_hash text NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  used_at timestamptz
);

-- Create index for faster lookups
CREATE INDEX idx_mfa_backup_codes_user_id ON mfa_backup_codes(user_id);
CREATE INDEX idx_mfa_backup_codes_used ON mfa_backup_codes(user_id, used);

-- Enable RLS
ALTER TABLE mfa_backup_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mfa_backup_codes
CREATE POLICY "Users can view own backup codes" ON mfa_backup_codes
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own backup codes" ON mfa_backup_codes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own backup codes" ON mfa_backup_codes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to backup codes" ON mfa_backup_codes
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Create login_attempts table
CREATE TABLE IF NOT EXISTS login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  ip_address text,
  success boolean NOT NULL,
  attempted_at timestamptz DEFAULT now()
);

-- Create indexes for rate limiting queries
CREATE INDEX idx_login_attempts_email_time ON login_attempts(email, attempted_at DESC);
CREATE INDEX idx_login_attempts_ip_time ON login_attempts(ip_address, attempted_at DESC);

-- No RLS on login_attempts - it's a security log table
-- Access controlled through RPC functions

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_info text,
  ip_address text,
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create index for session lookups
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_last_activity ON user_sessions(last_activity DESC);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON user_sessions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to sessions" ON user_sessions
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Rate limiting function
-- Checks if user has exceeded 5 failed attempts in last 15 minutes
CREATE OR REPLACE FUNCTION check_rate_limit(check_email text, check_ip text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  failed_count int;
BEGIN
  -- Count failed attempts in last 15 minutes
  SELECT COUNT(*) INTO failed_count
  FROM login_attempts
  WHERE email = check_email
    AND success = false
    AND attempted_at > now() - interval '15 minutes'
    AND (check_ip IS NULL OR ip_address = check_ip);
  
  -- Return true if rate limit exceeded (5 or more failures)
  RETURN failed_count >= 5;
END;
$$;

-- Record login attempt function
CREATE OR REPLACE FUNCTION record_login_attempt(
  attempt_email text,
  attempt_ip text,
  attempt_success boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO login_attempts (email, ip_address, success, attempted_at)
  VALUES (attempt_email, attempt_ip, attempt_success, now());
END;
$$;

-- Cleanup old login attempts (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM login_attempts
  WHERE attempted_at < now() - interval '24 hours';
END;
$$;

-- Get login attempts for admin monitoring
CREATE OR REPLACE FUNCTION get_recent_login_attempts(limit_count int DEFAULT 100)
RETURNS TABLE (
  id uuid,
  email text,
  ip_address text,
  success boolean,
  attempted_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only admins can view login attempts
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  RETURN QUERY
  SELECT la.id, la.email, la.ip_address, la.success, la.attempted_at
  FROM login_attempts la
  ORDER BY la.attempted_at DESC
  LIMIT limit_count;
END;
$$;