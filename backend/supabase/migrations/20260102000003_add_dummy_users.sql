-- Add Dummy Users for Testing
-- This migration creates test users with pre-defined credentials

-- Note: Supabase Auth manages the auth.users table
-- We'll create profiles and tasks for users that will be created via the signup API

-- First, let's ensure we have the profiles table structure
-- (This should already exist from previous migrations)

-- Insert dummy profiles (users will be created via Auth API)
-- We'll use specific UUIDs for these test users

-- Admin User Profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@jobtracker.test',
  'Admin User',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Regular User 1 Profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'user@jobtracker.test',
  'Test User',
  'user',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Regular User 2 Profile (Ashwini)
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  'ashwini@cmc.com',
  'Ashwini Kumar',
  'user',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Create 50-day tasks for Admin User
INSERT INTO daily_tasks (id, user_id, day_number, topic, description, completed, created_at)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  day_num,
  CASE day_num
    -- Week 1: Foundation & Self-Assessment
    WHEN 1 THEN 'Career Goals Definition'
    WHEN 2 THEN 'Skills Inventory'
    WHEN 3 THEN 'Industry Research'
    WHEN 4 THEN 'Resume Audit'
    WHEN 5 THEN 'LinkedIn Profile Optimization'
    WHEN 6 THEN 'Personal Branding'
    WHEN 7 THEN 'Week 1 Review'
    -- Week 2: Resume & Cover Letter Mastery
    WHEN 8 THEN 'Resume Format Selection'
    WHEN 9 THEN 'Achievement Quantification'
    WHEN 10 THEN 'Keyword Optimization'
    WHEN 11 THEN 'Cover Letter Template'
    WHEN 12 THEN 'Tailoring Techniques'
    WHEN 13 THEN 'Portfolio Development'
    WHEN 14 THEN 'Week 2 Review'
    -- Week 3: Job Search Strategy
    WHEN 15 THEN 'Job Board Setup'
    WHEN 16 THEN 'Company Target List'
    WHEN 17 THEN 'Application Tracking System'
    WHEN 18 THEN 'Daily Application Goal'
    WHEN 19 THEN 'Networking Strategy'
    WHEN 20 THEN 'Informational Interviews'
    WHEN 21 THEN 'Week 3 Review'
    -- Week 4: Networking & Online Presence
    WHEN 22 THEN 'LinkedIn Connections'
    WHEN 23 THEN 'LinkedIn Engagement'
    WHEN 24 THEN 'Alumni Network'
    WHEN 25 THEN 'Professional Associations'
    WHEN 26 THEN 'Twitter/X Professional Profile'
    WHEN 27 THEN 'Personal Website'
    WHEN 28 THEN 'Week 4 Review'
    -- Week 5: Interview Preparation
    WHEN 29 THEN 'Common Questions'
    WHEN 30 THEN 'STAR Method'
    WHEN 31 THEN 'Behavioral Questions'
    WHEN 32 THEN 'Technical Prep'
    WHEN 33 THEN 'Mock Interview'
    WHEN 34 THEN 'Company Research'
    WHEN 35 THEN 'Week 5 Review'
    -- Week 6: Advanced Interview Skills
    WHEN 36 THEN 'Salary Negotiation'
    WHEN 37 THEN 'Questions to Ask'
    WHEN 38 THEN 'Virtual Interview Setup'
    WHEN 39 THEN 'Body Language'
    WHEN 40 THEN 'Follow-up Strategy'
    WHEN 41 THEN 'Rejection Handling'
    WHEN 42 THEN 'Week 6 Review'
    -- Week 7: Momentum & Persistence
    WHEN 43 THEN 'Application Surge'
    WHEN 44 THEN 'Referral Requests'
    WHEN 45 THEN 'Skills Gap Analysis'
    WHEN 46 THEN 'Online Course Enrollment'
    WHEN 47 THEN 'Volunteer/Freelance'
    WHEN 48 THEN 'Recruiter Outreach'
    WHEN 49 THEN 'Week 7 Review'
    -- Week 8: Final Push
    WHEN 50 THEN 'Offer Evaluation'
  END,
  CASE day_num
    WHEN 1 THEN 'Define your short-term and long-term career objectives'
    WHEN 2 THEN 'List your technical and soft skills'
    WHEN 3 THEN 'Research target industries and companies'
    WHEN 4 THEN 'Review and update your current resume'
    WHEN 5 THEN 'Enhance your LinkedIn profile with keywords'
    WHEN 6 THEN 'Define your unique value proposition'
    WHEN 7 THEN 'Reflect on progress and adjust goals'
    WHEN 8 THEN 'Choose the best resume format for your experience'
    WHEN 9 THEN 'Add metrics to your accomplishments'
    WHEN 10 THEN 'Incorporate industry-specific keywords'
    WHEN 11 THEN 'Create a master cover letter template'
    WHEN 12 THEN 'Learn to customize applications'
    WHEN 13 THEN 'Start building your work portfolio'
    WHEN 14 THEN 'Finalize resume and cover letter versions'
    WHEN 15 THEN 'Create accounts on major job platforms'
    WHEN 16 THEN 'Identify 20 dream companies'
    WHEN 17 THEN 'Set up your application tracker'
    WHEN 18 THEN 'Commit to applying to 2-3 jobs daily'
    WHEN 19 THEN 'Plan your networking approach'
    WHEN 20 THEN 'Reach out for informational interviews'
    WHEN 21 THEN 'Assess application progress'
    WHEN 22 THEN 'Connect with 10 industry professionals'
    WHEN 23 THEN 'Comment on 5 industry posts daily'
    WHEN 24 THEN 'Reach out to alumni in target companies'
    WHEN 25 THEN 'Join relevant industry groups'
    WHEN 26 THEN 'Create or optimize professional social media'
    WHEN 27 THEN 'Start building a personal website or portfolio'
    WHEN 28 THEN 'Evaluate networking effectiveness'
    WHEN 29 THEN 'Practice answers to 10 common interview questions'
    WHEN 30 THEN 'Master the STAR response technique'
    WHEN 31 THEN 'Prepare stories for behavioral interviews'
    WHEN 32 THEN 'Review technical skills and concepts'
    WHEN 33 THEN 'Conduct a mock interview with a friend'
    WHEN 34 THEN 'Deep dive into target company cultures'
    WHEN 35 THEN 'Refine interview responses'
    WHEN 36 THEN 'Research salary ranges and practice negotiation'
    WHEN 37 THEN 'Prepare thoughtful questions for interviewers'
    WHEN 38 THEN 'Test your video interview setup'
    WHEN 39 THEN 'Practice confident body language'
    WHEN 40 THEN 'Learn effective post-interview follow-up'
    WHEN 41 THEN 'Develop resilience strategies'
    WHEN 42 THEN 'Consolidate interview skills'
    WHEN 43 THEN 'Apply to 5 jobs today'
    WHEN 44 THEN 'Ask for referrals from connections'
    WHEN 45 THEN 'Identify and address skill gaps'
    WHEN 46 THEN 'Start a relevant online course'
    WHEN 47 THEN 'Explore short-term projects'
    WHEN 48 THEN 'Connect with 3 recruiters'
    WHEN 49 THEN 'Analyze response rates'
    WHEN 50 THEN 'Learn to evaluate job offers comprehensively'
  END,
  0,
  NOW()
FROM generate_series(1, 50) AS day_num
ON CONFLICT (user_id, day_number) DO NOTHING;

-- Create 50-day tasks for Regular User 1
INSERT INTO daily_tasks (id, user_id, day_number, topic, description, completed, created_at)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000002',
  day_num,
  CASE day_num
    -- Week 1: Foundation & Self-Assessment
    WHEN 1 THEN 'Career Goals Definition'
    WHEN 2 THEN 'Skills Inventory'
    WHEN 3 THEN 'Industry Research'
    WHEN 4 THEN 'Resume Audit'
    WHEN 5 THEN 'LinkedIn Profile Optimization'
    WHEN 6 THEN 'Personal Branding'
    WHEN 7 THEN 'Week 1 Review'
    -- Week 2: Resume & Cover Letter Mastery
    WHEN 8 THEN 'Resume Format Selection'
    WHEN 9 THEN 'Achievement Quantification'
    WHEN 10 THEN 'Keyword Optimization'
    WHEN 11 THEN 'Cover Letter Template'
    WHEN 12 THEN 'Tailoring Techniques'
    WHEN 13 THEN 'Portfolio Development'
    WHEN 14 THEN 'Week 2 Review'
    -- Week 3: Job Search Strategy
    WHEN 15 THEN 'Job Board Setup'
    WHEN 16 THEN 'Company Target List'
    WHEN 17 THEN 'Application Tracking System'
    WHEN 18 THEN 'Daily Application Goal'
    WHEN 19 THEN 'Networking Strategy'
    WHEN 20 THEN 'Informational Interviews'
    WHEN 21 THEN 'Week 3 Review'
    -- Week 4: Networking & Online Presence
    WHEN 22 THEN 'LinkedIn Connections'
    WHEN 23 THEN 'LinkedIn Engagement'
    WHEN 24 THEN 'Alumni Network'
    WHEN 25 THEN 'Professional Associations'
    WHEN 26 THEN 'Twitter/X Professional Profile'
    WHEN 27 THEN 'Personal Website'
    WHEN 28 THEN 'Week 4 Review'
    -- Week 5: Interview Preparation
    WHEN 29 THEN 'Common Questions'
    WHEN 30 THEN 'STAR Method'
    WHEN 31 THEN 'Behavioral Questions'
    WHEN 32 THEN 'Technical Prep'
    WHEN 33 THEN 'Mock Interview'
    WHEN 34 THEN 'Company Research'
    WHEN 35 THEN 'Week 5 Review'
    -- Week 6: Advanced Interview Skills
    WHEN 36 THEN 'Salary Negotiation'
    WHEN 37 THEN 'Questions to Ask'
    WHEN 38 THEN 'Virtual Interview Setup'
    WHEN 39 THEN 'Body Language'
    WHEN 40 THEN 'Follow-up Strategy'
    WHEN 41 THEN 'Rejection Handling'
    WHEN 42 THEN 'Week 6 Review'
    -- Week 7: Momentum & Persistence
    WHEN 43 THEN 'Application Surge'
    WHEN 44 THEN 'Referral Requests'
    WHEN 45 THEN 'Skills Gap Analysis'
    WHEN 46 THEN 'Online Course Enrollment'
    WHEN 47 THEN 'Volunteer/Freelance'
    WHEN 48 THEN 'Recruiter Outreach'
    WHEN 49 THEN 'Week 7 Review'
    -- Week 8: Final Push
    WHEN 50 THEN 'Offer Evaluation'
  END,
  CASE day_num
    WHEN 1 THEN 'Define your short-term and long-term career objectives'
    WHEN 2 THEN 'List your technical and soft skills'
    WHEN 3 THEN 'Research target industries and companies'
    WHEN 4 THEN 'Review and update your current resume'
    WHEN 5 THEN 'Enhance your LinkedIn profile with keywords'
    WHEN 6 THEN 'Define your unique value proposition'
    WHEN 7 THEN 'Reflect on progress and adjust goals'
    WHEN 8 THEN 'Choose the best resume format for your experience'
    WHEN 9 THEN 'Add metrics to your accomplishments'
    WHEN 10 THEN 'Incorporate industry-specific keywords'
    WHEN 11 THEN 'Create a master cover letter template'
    WHEN 12 THEN 'Learn to customize applications'
    WHEN 13 THEN 'Start building your work portfolio'
    WHEN 14 THEN 'Finalize resume and cover letter versions'
    WHEN 15 THEN 'Create accounts on major job platforms'
    WHEN 16 THEN 'Identify 20 dream companies'
    WHEN 17 THEN 'Set up your application tracker'
    WHEN 18 THEN 'Commit to applying to 2-3 jobs daily'
    WHEN 19 THEN 'Plan your networking approach'
    WHEN 20 THEN 'Reach out for informational interviews'
    WHEN 21 THEN 'Assess application progress'
    WHEN 22 THEN 'Connect with 10 industry professionals'
    WHEN 23 THEN 'Comment on 5 industry posts daily'
    WHEN 24 THEN 'Reach out to alumni in target companies'
    WHEN 25 THEN 'Join relevant industry groups'
    WHEN 26 THEN 'Create or optimize professional social media'
    WHEN 27 THEN 'Start building a personal website or portfolio'
    WHEN 28 THEN 'Evaluate networking effectiveness'
    WHEN 29 THEN 'Practice answers to 10 common interview questions'
    WHEN 30 THEN 'Master the STAR response technique'
    WHEN 31 THEN 'Prepare stories for behavioral interviews'
    WHEN 32 THEN 'Review technical skills and concepts'
    WHEN 33 THEN 'Conduct a mock interview with a friend'
    WHEN 34 THEN 'Deep dive into target company cultures'
    WHEN 35 THEN 'Refine interview responses'
    WHEN 36 THEN 'Research salary ranges and practice negotiation'
    WHEN 37 THEN 'Prepare thoughtful questions for interviewers'
    WHEN 38 THEN 'Test your video interview setup'
    WHEN 39 THEN 'Practice confident body language'
    WHEN 40 THEN 'Learn effective post-interview follow-up'
    WHEN 41 THEN 'Develop resilience strategies'
    WHEN 42 THEN 'Consolidate interview skills'
    WHEN 43 THEN 'Apply to 5 jobs today'
    WHEN 44 THEN 'Ask for referrals from connections'
    WHEN 45 THEN 'Identify and address skill gaps'
    WHEN 46 THEN 'Start a relevant online course'
    WHEN 47 THEN 'Explore short-term projects'
    WHEN 48 THEN 'Connect with 3 recruiters'
    WHEN 49 THEN 'Analyze response rates'
    WHEN 50 THEN 'Learn to evaluate job offers comprehensively'
  END,
  0,
  NOW()
FROM generate_series(1, 50) AS day_num
ON CONFLICT (user_id, day_number) DO NOTHING;

-- Create 50-day tasks for Regular User 2 (Ashwini)
INSERT INTO daily_tasks (id, user_id, day_number, topic, description, completed, created_at)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000003',
  day_num,
  CASE day_num
    -- Week 1: Foundation & Self-Assessment
    WHEN 1 THEN 'Career Goals Definition'
    WHEN 2 THEN 'Skills Inventory'
    WHEN 3 THEN 'Industry Research'
    WHEN 4 THEN 'Resume Audit'
    WHEN 5 THEN 'LinkedIn Profile Optimization'
    WHEN 6 THEN 'Personal Branding'
    WHEN 7 THEN 'Week 1 Review'
    -- Week 2: Resume & Cover Letter Mastery
    WHEN 8 THEN 'Resume Format Selection'
    WHEN 9 THEN 'Achievement Quantification'
    WHEN 10 THEN 'Keyword Optimization'
    WHEN 11 THEN 'Cover Letter Template'
    WHEN 12 THEN 'Tailoring Techniques'
    WHEN 13 THEN 'Portfolio Development'
    WHEN 14 THEN 'Week 2 Review'
    -- Week 3: Job Search Strategy
    WHEN 15 THEN 'Job Board Setup'
    WHEN 16 THEN 'Company Target List'
    WHEN 17 THEN 'Application Tracking System'
    WHEN 18 THEN 'Daily Application Goal'
    WHEN 19 THEN 'Networking Strategy'
    WHEN 20 THEN 'Informational Interviews'
    WHEN 21 THEN 'Week 3 Review'
    -- Week 4: Networking & Online Presence
    WHEN 22 THEN 'LinkedIn Connections'
    WHEN 23 THEN 'LinkedIn Engagement'
    WHEN 24 THEN 'Alumni Network'
    WHEN 25 THEN 'Professional Associations'
    WHEN 26 THEN 'Twitter/X Professional Profile'
    WHEN 27 THEN 'Personal Website'
    WHEN 28 THEN 'Week 4 Review'
    -- Week 5: Interview Preparation
    WHEN 29 THEN 'Common Questions'
    WHEN 30 THEN 'STAR Method'
    WHEN 31 THEN 'Behavioral Questions'
    WHEN 32 THEN 'Technical Prep'
    WHEN 33 THEN 'Mock Interview'
    WHEN 34 THEN 'Company Research'
    WHEN 35 THEN 'Week 5 Review'
    -- Week 6: Advanced Interview Skills
    WHEN 36 THEN 'Salary Negotiation'
    WHEN 37 THEN 'Questions to Ask'
    WHEN 38 THEN 'Virtual Interview Setup'
    WHEN 39 THEN 'Body Language'
    WHEN 40 THEN 'Follow-up Strategy'
    WHEN 41 THEN 'Rejection Handling'
    WHEN 42 THEN 'Week 6 Review'
    -- Week 7: Momentum & Persistence
    WHEN 43 THEN 'Application Surge'
    WHEN 44 THEN 'Referral Requests'
    WHEN 45 THEN 'Skills Gap Analysis'
    WHEN 46 THEN 'Online Course Enrollment'
    WHEN 47 THEN 'Volunteer/Freelance'
    WHEN 48 THEN 'Recruiter Outreach'
    WHEN 49 THEN 'Week 7 Review'
    -- Week 8: Final Push
    WHEN 50 THEN 'Offer Evaluation'
  END,
  CASE day_num
    WHEN 1 THEN 'Define your short-term and long-term career objectives'
    WHEN 2 THEN 'List your technical and soft skills'
    WHEN 3 THEN 'Research target industries and companies'
    WHEN 4 THEN 'Review and update your current resume'
    WHEN 5 THEN 'Enhance your LinkedIn profile with keywords'
    WHEN 6 THEN 'Define your unique value proposition'
    WHEN 7 THEN 'Reflect on progress and adjust goals'
    WHEN 8 THEN 'Choose the best resume format for your experience'
    WHEN 9 THEN 'Add metrics to your accomplishments'
    WHEN 10 THEN 'Incorporate industry-specific keywords'
    WHEN 11 THEN 'Create a master cover letter template'
    WHEN 12 THEN 'Learn to customize applications'
    WHEN 13 THEN 'Start building your work portfolio'
    WHEN 14 THEN 'Finalize resume and cover letter versions'
    WHEN 15 THEN 'Create accounts on major job platforms'
    WHEN 16 THEN 'Identify 20 dream companies'
    WHEN 17 THEN 'Set up your application tracker'
    WHEN 18 THEN 'Commit to applying to 2-3 jobs daily'
    WHEN 19 THEN 'Plan your networking approach'
    WHEN 20 THEN 'Reach out for informational interviews'
    WHEN 21 THEN 'Assess application progress'
    WHEN 22 THEN 'Connect with 10 industry professionals'
    WHEN 23 THEN 'Comment on 5 industry posts daily'
    WHEN 24 THEN 'Reach out to alumni in target companies'
    WHEN 25 THEN 'Join relevant industry groups'
    WHEN 26 THEN 'Create or optimize professional social media'
    WHEN 27 THEN 'Start building a personal website or portfolio'
    WHEN 28 THEN 'Evaluate networking effectiveness'
    WHEN 29 THEN 'Practice answers to 10 common interview questions'
    WHEN 30 THEN 'Master the STAR response technique'
    WHEN 31 THEN 'Prepare stories for behavioral interviews'
    WHEN 32 THEN 'Review technical skills and concepts'
    WHEN 33 THEN 'Conduct a mock interview with a friend'
    WHEN 34 THEN 'Deep dive into target company cultures'
    WHEN 35 THEN 'Refine interview responses'
    WHEN 36 THEN 'Research salary ranges and practice negotiation'
    WHEN 37 THEN 'Prepare thoughtful questions for interviewers'
    WHEN 38 THEN 'Test your video interview setup'
    WHEN 39 THEN 'Practice confident body language'
    WHEN 40 THEN 'Learn effective post-interview follow-up'
    WHEN 41 THEN 'Develop resilience strategies'
    WHEN 42 THEN 'Consolidate interview skills'
    WHEN 43 THEN 'Apply to 5 jobs today'
    WHEN 44 THEN 'Ask for referrals from connections'
    WHEN 45 THEN 'Identify and address skill gaps'
    WHEN 46 THEN 'Start a relevant online course'
    WHEN 47 THEN 'Explore short-term projects'
    WHEN 48 THEN 'Connect with 3 recruiters'
    WHEN 49 THEN 'Analyze response rates'
    WHEN 50 THEN 'Learn to evaluate job offers comprehensively'
  END,
  0,
  NOW()
FROM generate_series(1, 50) AS day_num
ON CONFLICT (user_id, day_number) DO NOTHING;

-- Add some sample job applications for the test users
INSERT INTO job_applications (id, user_id, company_name, position_title, job_url, status, applied_date, notes, created_at)
VALUES
  -- Admin user applications
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Google', 'Senior Software Engineer', 'https://careers.google.com/jobs/123', 'interview', '2026-01-15', 'Phone screen scheduled for next week', NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Microsoft', 'Product Manager', 'https://careers.microsoft.com/jobs/456', 'applied', '2026-01-20', 'Applied via LinkedIn', NOW()),
  
  -- Regular user 1 applications
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'Amazon', 'Software Development Engineer', 'https://amazon.jobs/en/jobs/789', 'applied', '2026-01-18', 'Referred by a friend', NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'Meta', 'Frontend Engineer', 'https://metacareers.com/jobs/012', 'rejected', '2026-01-10', 'Did not move forward after initial screening', NOW()),
  
  -- Ashwini's applications
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', 'Apple', 'iOS Developer', 'https://jobs.apple.com/en-us/details/345', 'interview', '2026-01-22', 'Technical interview scheduled', NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', 'Netflix', 'Full Stack Engineer', 'https://jobs.netflix.com/jobs/678', 'applied', '2026-01-25', 'Applied through company website', NOW())
ON CONFLICT DO NOTHING;

-- Mark some tasks as completed for demo purposes
UPDATE daily_tasks 
SET completed = true, completed_at = NOW() - INTERVAL '1 day'
WHERE user_id = '00000000-0000-0000-0000-000000000001' 
AND day_number IN (1, 2, 3, 4, 5);

UPDATE daily_tasks 
SET completed = true, completed_at = NOW() - INTERVAL '2 days'
WHERE user_id = '00000000-0000-0000-0000-000000000002' 
AND day_number IN (1, 2, 3);

UPDATE daily_tasks 
SET completed = true, completed_at = NOW() - INTERVAL '1 day'
WHERE user_id = '00000000-0000-0000-0000-000000000003' 
AND day_number IN (1, 2);

-- Add some networking contacts for demo
INSERT INTO networking_contacts (id, user_id, name, email, company, position, relationship, notes, last_contact_date, created_at)
VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'John Smith', 'john.smith@techcorp.com', 'TechCorp', 'Engineering Manager', 'former_colleague', 'Met at tech conference', '2026-01-20', NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'Sarah Johnson', 'sarah.j@startup.io', 'Startup.io', 'CTO', 'linkedin', 'Connected through mutual friend', '2026-01-18', NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', 'Mike Chen', 'mike.chen@bigtech.com', 'BigTech', 'Senior Developer', 'alumni', 'College classmate', '2026-01-22', NOW())
ON CONFLICT DO NOTHING;

-- Add some interviews for demo
INSERT INTO interviews (id, user_id, application_id, interview_type, scheduled_date, interviewer_name, notes, status, created_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  id,
  'phone_screen',
  NOW() + INTERVAL '3 days',
  'Jane Doe',
  'Initial phone screening',
  'scheduled',
  NOW()
FROM job_applications
WHERE user_id = '00000000-0000-0000-0000-000000000001' AND status = 'interview'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO interviews (id, user_id, application_id, interview_type, scheduled_date, interviewer_name, notes, status, created_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000003',
  id,
  'technical',
  NOW() + INTERVAL '5 days',
  'Bob Wilson',
  'Technical coding interview',
  'scheduled',
  NOW()
FROM job_applications
WHERE user_id = '00000000-0000-0000-0000-000000000003' AND status = 'interview'
LIMIT 1
ON CONFLICT DO NOTHING;
