-- Migration: Add admin functionality and 50-day program content
-- Created: 2026-01-02

-- ============================================================================
-- ADMIN TABLES
-- ============================================================================

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

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_user_messages_to_user ON user_messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_user_messages_from_admin ON user_messages(from_admin_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

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

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = check_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics(target_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_tasks', (SELECT COUNT(*) FROM daily_tasks WHERE user_id = target_user_id),
    'completed_tasks', (SELECT COUNT(*) FROM daily_tasks WHERE user_id = target_user_id AND completed = true),
    'total_applications', (SELECT COUNT(*) FROM job_applications WHERE user_id = target_user_id),
    'total_interviews', (SELECT COUNT(*) FROM interviews WHERE user_id = target_user_id),
    'total_contacts', (SELECT COUNT(*) FROM networking_contacts WHERE user_id = target_user_id),
    'total_documents', (SELECT COUNT(*) FROM documents WHERE user_id = target_user_id),
    'achievements_count', (SELECT COUNT(*) FROM achievements WHERE user_id = target_user_id)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get admin dashboard statistics
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Check if user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users),
    'active_users_today', (
      SELECT COUNT(DISTINCT user_id) 
      FROM user_activity 
      WHERE created_at >= NOW() - INTERVAL '24 hours'
    ),
    'active_users_week', (
      SELECT COUNT(DISTINCT user_id) 
      FROM user_activity 
      WHERE created_at >= NOW() - INTERVAL '7 days'
    ),
    'new_users_today', (
      SELECT COUNT(*) 
      FROM auth.users 
      WHERE created_at >= NOW() - INTERVAL '24 hours'
    ),
    'new_users_week', (
      SELECT COUNT(*) 
      FROM auth.users 
      WHERE created_at >= NOW() - INTERVAL '7 days'
    ),
    'total_applications', (SELECT COUNT(*) FROM job_applications),
    'total_interviews', (SELECT COUNT(*) FROM interviews),
    'total_tasks_completed', (SELECT COUNT(*) FROM daily_tasks WHERE completed = true),
    'completion_rate', (
      SELECT ROUND(
        (COUNT(*) FILTER (WHERE completed = true)::NUMERIC / 
        NULLIF(COUNT(*)::NUMERIC, 0) * 100), 2
      )
      FROM daily_tasks
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Log user activity on important actions
CREATE OR REPLACE FUNCTION log_user_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_activity (user_id, activity_type, activity_data)
  VALUES (
    COALESCE(NEW.user_id, OLD.user_id),
    TG_TABLE_NAME || '_' || TG_OP,
    json_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'record_id', COALESCE(NEW.id, OLD.id)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add activity logging triggers
CREATE TRIGGER log_job_application_activity
  AFTER INSERT OR UPDATE OR DELETE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION log_user_activity();

CREATE TRIGGER log_interview_activity
  AFTER INSERT OR UPDATE OR DELETE ON interviews
  FOR EACH ROW
  EXECUTE FUNCTION log_user_activity();

CREATE TRIGGER log_task_completion_activity
  AFTER UPDATE ON daily_tasks
  FOR EACH ROW
  WHEN (OLD.completed = false AND NEW.completed = true)
  EXECUTE FUNCTION log_user_activity();

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats TO authenticated;
