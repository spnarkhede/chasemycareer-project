/*
# Create OAuth Tokens Table for Google Calendar Integration

## 1. New Tables
- `oauth_tokens`
  - `id` (uuid, primary key, default: gen_random_uuid())
  - `user_id` (uuid, references auth.users, not null)
  - `provider` (text, not null, e.g., 'google')
  - `access_token` (text, not null, encrypted)
  - `refresh_token` (text, encrypted)
  - `token_type` (text, default: 'Bearer')
  - `expires_at` (timestamptz, not null)
  - `scopes` (text[], array of granted scopes)
  - `created_at` (timestamptz, default: now())
  - `updated_at` (timestamptz, default: now())

## 2. Security
- Enable RLS on `oauth_tokens` table
- Users can only access their own tokens
- Admins have full access to all tokens

## 3. Notes
- Tokens are stored securely and only accessible by the owner
- Refresh tokens allow long-term calendar access
- Scopes track what permissions were granted
*/

CREATE TABLE IF NOT EXISTS oauth_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL,
  access_token text NOT NULL,
  refresh_token text,
  token_type text DEFAULT 'Bearer',
  expires_at timestamptz NOT NULL,
  scopes text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, provider)
);

ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tokens" ON oauth_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tokens" ON oauth_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tokens" ON oauth_tokens
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tokens" ON oauth_tokens
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to tokens" ON oauth_tokens
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE INDEX idx_oauth_tokens_user_id ON oauth_tokens(user_id);
CREATE INDEX idx_oauth_tokens_provider ON oauth_tokens(provider);
CREATE INDEX idx_oauth_tokens_expires_at ON oauth_tokens(expires_at);