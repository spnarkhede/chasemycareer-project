-- Migration: Add admin functions and triggers
-- Created: 2026-01-02

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

-- Update updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to admin_users
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Log user activity function
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
EXCEPTION WHEN OTHERS THEN
  -- Silently fail to avoid breaking the main operation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add activity logging triggers
DROP TRIGGER IF EXISTS log_job_application_activity ON job_applications;
CREATE TRIGGER log_job_application_activity
  AFTER INSERT OR UPDATE OR DELETE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION log_user_activity();

DROP TRIGGER IF EXISTS log_interview_activity ON interviews;
CREATE TRIGGER log_interview_activity
  AFTER INSERT OR UPDATE OR DELETE ON interviews
  FOR EACH ROW
  EXECUTE FUNCTION log_user_activity();

DROP TRIGGER IF EXISTS log_task_completion_activity ON daily_tasks;
CREATE TRIGGER log_task_completion_activity
  AFTER UPDATE ON daily_tasks
  FOR EACH ROW
  WHEN (OLD.completed = false AND NEW.completed = true)
  EXECUTE FUNCTION log_user_activity();

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_user_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats TO authenticated;