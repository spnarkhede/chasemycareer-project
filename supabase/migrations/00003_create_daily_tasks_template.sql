-- Migration: Create daily tasks template table
-- Created: 2026-01-02

CREATE TABLE IF NOT EXISTS daily_tasks_template (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 50),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('preparation', 'applications', 'networking', 'interviews', 'documents', 'skills', 'reflection')),
  estimated_time INTEGER, -- in minutes
  resources JSONB DEFAULT '[]'::jsonb,
  tips TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_tasks_template_day ON daily_tasks_template(day_number);

-- Function to initialize user daily tasks
CREATE OR REPLACE FUNCTION initialize_user_daily_tasks(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO daily_tasks (user_id, day_number, title, description, category, completed)
  SELECT 
    target_user_id,
    day_number,
    title,
    description,
    category,
    false
  FROM daily_tasks_template
  ORDER BY day_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-initialize tasks for new users
CREATE OR REPLACE FUNCTION auto_initialize_user_tasks()
RETURNS TRIGGER AS $$
BEGIN
  -- Initialize daily tasks for new user
  PERFORM initialize_user_daily_tasks(NEW.user_id);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Continue even if initialization fails
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_initialize_tasks ON profiles;
CREATE TRIGGER trigger_auto_initialize_tasks
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_initialize_user_tasks();

GRANT EXECUTE ON FUNCTION initialize_user_daily_tasks TO authenticated;