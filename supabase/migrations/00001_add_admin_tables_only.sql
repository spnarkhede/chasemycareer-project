-- Migration: Add admin tables
-- Created: 2026-01-02

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions JSONB DEFAULT '{"view_users": true, "edit_users": false, "delete_users": false, "send_messages": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User messages (admin to user communication)
CREATE TABLE IF NOT EXISTS user_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User activity log
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_user_messages_to_user ON user_messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_user_messages_from_admin ON user_messages(from_admin_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage admin users"
  ON admin_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- User messages policies
CREATE POLICY "Users can view their own messages"
  ON user_messages FOR SELECT
  USING (to_user_id = auth.uid());

CREATE POLICY "Admins can view all messages"
  ON user_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can send messages"
  ON user_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND id = from_admin_id
    )
  );

CREATE POLICY "Users can mark messages as read"
  ON user_messages FOR UPDATE
  USING (to_user_id = auth.uid())
  WITH CHECK (to_user_id = auth.uid());

-- User activity policies
CREATE POLICY "Users can view their own activity"
  ON user_activity FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activity"
  ON user_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert activity"
  ON user_activity FOR INSERT
  WITH CHECK (true);

-- Achievements policies
CREATE POLICY "Users can view their own achievements"
  ON achievements FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all achievements"
  ON achievements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert achievements"
  ON achievements FOR INSERT
  WITH CHECK (true);