/*
# Create Job Tracker Schema

## Overview
This migration creates all necessary tables for the Chase My Career 50-day job search tracker application.

## Tables Created

### 1. user_onboarding
Stores user's initial job search preferences and target role information.
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles.id) - Owner of the onboarding data
- `target_role` (text) - Desired job title/role
- `target_industry` (text) - Target industry
- `experience_level` (text) - Entry/Mid/Senior level
- `location_preference` (text) - Preferred work location
- `work_type` (text) - Remote/Hybrid/Onsite
- `salary_expectation` (text) - Expected salary range
- `completed_at` (timestamptz) - When onboarding was completed
- `created_at` (timestamptz)

### 2. daily_tasks
Tracks the 50-day plan with daily tasks and completion status.
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles.id)
- `day_number` (integer) - Day 1-50
- `title` (text) - Task title
- `description` (text) - Task description
- `completed` (boolean, default: false)
- `notes` (text) - User notes
- `completed_at` (timestamptz)
- `created_at` (timestamptz)

### 3. job_applications
Tracks all job applications with stages and details.
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles.id)
- `company_name` (text, not null)
- `job_title` (text, not null)
- `job_url` (text)
- `status` (application_status enum) - Applied/Screening/Interview/Offer/Rejected
- `applied_date` (date)
- `salary_range` (text)
- `location` (text)
- `notes` (text)
- `follow_up_date` (date)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 4. interviews
Stores interview schedules and details.
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles.id)
- `application_id` (uuid, references job_applications.id)
- `interview_type` (text) - Phone/Video/Onsite/Technical
- `scheduled_at` (timestamptz, not null)
- `duration_minutes` (integer, default: 60)
- `interviewer_name` (text)
- `interviewer_email` (text)
- `meeting_link` (text)
- `location` (text)
- `notes` (text)
- `google_calendar_event_id` (text) - For calendar sync
- `completed` (boolean, default: false)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 5. documents
Stores references to resumes and cover letters.
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles.id)
- `document_type` (document_type enum) - Resume/CoverLetter
- `title` (text, not null)
- `content` (text) - Document content in JSON format
- `file_url` (text) - Optional file upload URL
- `is_default` (boolean, default: false)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 6. networking_contacts
Tracks networking contacts and interactions.
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles.id)
- `name` (text, not null)
- `company` (text)
- `position` (text)
- `email` (text)
- `linkedin_url` (text)
- `phone` (text)
- `notes` (text)
- `last_contact_date` (date)
- `next_follow_up_date` (date)
- `relationship_strength` (integer) - 1-5 scale
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 7. networking_messages
Stores message templates and sent messages.
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles.id)
- `contact_id` (uuid, references networking_contacts.id, nullable)
- `message_type` (text) - Introduction/FollowUp/ThankYou/Request
- `subject` (text)
- `content` (text, not null)
- `is_template` (boolean, default: false)
- `sent_at` (timestamptz)
- `created_at` (timestamptz)

### 8. interview_questions
Question bank for interview practice.
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles.id, nullable) - Null for system questions
- `category` (text) - Behavioral/Technical/Situational
- `question` (text, not null)
- `sample_answer` (text)
- `is_system` (boolean, default: false) - System vs user-created
- `difficulty` (text) - Easy/Medium/Hard
- `created_at` (timestamptz)

### 9. interview_practice_sessions
Tracks mock interview sessions.
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles.id)
- `duration_minutes` (integer)
- `questions_answered` (integer)
- `notes` (text)
- `created_at` (timestamptz)

## Enums
- `application_status`: Applied, Screening, Interview, Offer, Rejected, Withdrawn
- `document_type`: Resume, CoverLetter

## Security
- All tables have RLS enabled
- Users can only access their own data
- System interview questions are readable by all authenticated users

## Indexes
- Created on foreign keys and frequently queried columns for performance
*/

-- Create enums
CREATE TYPE application_status AS ENUM ('Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn');
CREATE TYPE document_type AS ENUM ('Resume', 'CoverLetter');

-- Create user_onboarding table
CREATE TABLE user_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  target_role text,
  target_industry text,
  experience_level text,
  location_preference text,
  work_type text,
  salary_expectation text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create daily_tasks table
CREATE TABLE daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  day_number integer NOT NULL CHECK (day_number >= 1 AND day_number <= 50),
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  notes text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create job_applications table
CREATE TABLE job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company_name text NOT NULL,
  job_title text NOT NULL,
  job_url text,
  status application_status DEFAULT 'Applied'::application_status NOT NULL,
  applied_date date,
  salary_range text,
  location text,
  notes text,
  follow_up_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create interviews table
CREATE TABLE interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  application_id uuid REFERENCES job_applications(id) ON DELETE CASCADE,
  interview_type text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  interviewer_name text,
  interviewer_email text,
  meeting_link text,
  location text,
  notes text,
  google_calendar_event_id text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  document_type document_type NOT NULL,
  title text NOT NULL,
  content text,
  file_url text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create networking_contacts table
CREATE TABLE networking_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  company text,
  position text,
  email text,
  linkedin_url text,
  phone text,
  notes text,
  last_contact_date date,
  next_follow_up_date date,
  relationship_strength integer CHECK (relationship_strength >= 1 AND relationship_strength <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create networking_messages table
CREATE TABLE networking_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  contact_id uuid REFERENCES networking_contacts(id) ON DELETE SET NULL,
  message_type text,
  subject text,
  content text NOT NULL,
  is_template boolean DEFAULT false,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create interview_questions table
CREATE TABLE interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  category text,
  question text NOT NULL,
  sample_answer text,
  is_system boolean DEFAULT false,
  difficulty text,
  created_at timestamptz DEFAULT now()
);

-- Create interview_practice_sessions table
CREATE TABLE interview_practice_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  duration_minutes integer,
  questions_answered integer,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE networking_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE networking_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_practice_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_onboarding
CREATE POLICY "Users can view own onboarding" ON user_onboarding
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding" ON user_onboarding
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding" ON user_onboarding
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for daily_tasks
CREATE POLICY "Users can view own tasks" ON daily_tasks
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON daily_tasks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON daily_tasks
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON daily_tasks
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for job_applications
CREATE POLICY "Users can view own applications" ON job_applications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON job_applications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON job_applications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON job_applications
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for interviews
CREATE POLICY "Users can view own interviews" ON interviews
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interviews" ON interviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interviews" ON interviews
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interviews" ON interviews
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for documents
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON documents
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON documents
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON documents
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for networking_contacts
CREATE POLICY "Users can view own contacts" ON networking_contacts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contacts" ON networking_contacts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts" ON networking_contacts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts" ON networking_contacts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for networking_messages
CREATE POLICY "Users can view own messages" ON networking_messages
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON networking_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages" ON networking_messages
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" ON networking_messages
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for interview_questions
CREATE POLICY "Users can view all questions" ON interview_questions
  FOR SELECT TO authenticated USING (is_system = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own questions" ON interview_questions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can update own questions" ON interview_questions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can delete own questions" ON interview_questions
  FOR DELETE TO authenticated USING (auth.uid() = user_id AND is_system = false);

-- RLS Policies for interview_practice_sessions
CREATE POLICY "Users can view own sessions" ON interview_practice_sessions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON interview_practice_sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_daily_tasks_user_day ON daily_tasks(user_id, day_number);
CREATE INDEX idx_job_applications_user_status ON job_applications(user_id, status);
CREATE INDEX idx_job_applications_user_date ON job_applications(user_id, applied_date DESC);
CREATE INDEX idx_interviews_user_scheduled ON interviews(user_id, scheduled_at);
CREATE INDEX idx_interviews_application ON interviews(application_id);
CREATE INDEX idx_documents_user_type ON documents(user_id, document_type);
CREATE INDEX idx_networking_contacts_user ON networking_contacts(user_id);
CREATE INDEX idx_networking_messages_user ON networking_messages(user_id);
CREATE INDEX idx_networking_messages_contact ON networking_messages(contact_id);
CREATE INDEX idx_interview_questions_system ON interview_questions(is_system, category);

-- Create updated_at triggers
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_networking_contacts_updated_at
  BEFORE UPDATE ON networking_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert system interview questions
INSERT INTO interview_questions (category, question, sample_answer, is_system, difficulty) VALUES
('Behavioral', 'Tell me about yourself.', 'Focus on your professional journey, highlighting relevant experiences and skills that align with the role. Keep it concise (2-3 minutes) and end with why you''re interested in this position.', true, 'Easy'),
('Behavioral', 'What are your greatest strengths?', 'Choose 2-3 strengths relevant to the job. Provide specific examples of how you''ve demonstrated these strengths in past roles.', true, 'Easy'),
('Behavioral', 'What is your greatest weakness?', 'Choose a real weakness but show how you''re actively working to improve it. Demonstrate self-awareness and growth mindset.', true, 'Medium'),
('Behavioral', 'Why do you want to work here?', 'Research the company thoroughly. Mention specific aspects of their mission, culture, products, or recent achievements that resonate with you.', true, 'Easy'),
('Behavioral', 'Where do you see yourself in 5 years?', 'Show ambition while staying realistic. Align your goals with potential growth paths at the company.', true, 'Easy'),
('Behavioral', 'Tell me about a time you faced a challenge at work.', 'Use the STAR method (Situation, Task, Action, Result). Choose a relevant challenge and emphasize your problem-solving skills and positive outcome.', true, 'Medium'),
('Behavioral', 'Describe a time you worked in a team.', 'Highlight your collaboration skills, communication, and ability to work toward common goals. Use specific examples.', true, 'Medium'),
('Behavioral', 'Tell me about a time you failed.', 'Be honest but choose a failure that taught you valuable lessons. Focus on what you learned and how you grew from the experience.', true, 'Medium'),
('Behavioral', 'How do you handle stress and pressure?', 'Provide specific strategies you use (prioritization, time management, breaks). Give examples of successfully managing high-pressure situations.', true, 'Medium'),
('Behavioral', 'Why are you leaving your current job?', 'Stay positive. Focus on what you''re looking for (growth, new challenges) rather than what you''re leaving behind.', true, 'Medium'),
('Technical', 'Walk me through your problem-solving process.', 'Describe your systematic approach: understanding the problem, breaking it down, researching solutions, implementing, and testing.', true, 'Medium'),
('Technical', 'What tools and technologies are you most comfortable with?', 'List relevant tools for the role. Provide context on how you''ve used them and your proficiency level.', true, 'Easy'),
('Technical', 'How do you stay updated with industry trends?', 'Mention specific resources: blogs, podcasts, courses, conferences, communities. Show genuine interest in continuous learning.', true, 'Easy'),
('Technical', 'Describe a complex project you worked on.', 'Use STAR method. Explain the technical challenges, your approach, technologies used, and measurable outcomes.', true, 'Hard'),
('Situational', 'How would you handle a disagreement with a coworker?', 'Emphasize open communication, active listening, finding common ground, and focusing on solutions rather than blame.', true, 'Medium'),
('Situational', 'What would you do if you missed a deadline?', 'Show accountability. Discuss proactive communication, proposing solutions, and learning from the situation to prevent future occurrences.', true, 'Medium'),
('Situational', 'How would you prioritize multiple urgent tasks?', 'Explain your prioritization framework (impact, urgency, dependencies). Mention communication with stakeholders.', true, 'Medium'),
('Situational', 'What would you do if you disagreed with your manager?', 'Show respect for hierarchy while advocating for your perspective. Emphasize data-driven discussions and being open to feedback.', true, 'Hard'),
('Behavioral', 'What motivates you?', 'Be genuine. Connect your motivations to aspects of the role and company. Show passion and enthusiasm.', true, 'Easy'),
('Behavioral', 'Do you have any questions for us?', 'Always have 2-3 thoughtful questions prepared about the role, team, company culture, or growth opportunities. Never say no.', true, 'Easy');
