-- Create 50-day tasks for all dummy users
-- This script creates tasks for admin, test user, and ashwini

DO $$
DECLARE
  task_data RECORD;
  user_ids UUID[] := ARRAY[
    '00000000-0000-0000-0000-000000000001'::UUID,  -- admin
    '00000000-0000-0000-0000-000000000002'::UUID,  -- test user
    '5d398079-fd02-4392-82b5-d656d4a98da7'::UUID   -- ashwini
  ];
  current_user_id UUID;
BEGIN
  -- Loop through each user
  FOREACH current_user_id IN ARRAY user_ids
  LOOP
    -- Delete existing tasks for this user
    DELETE FROM daily_tasks WHERE user_id = current_user_id;
    
    -- Insert 50 tasks
    FOR i IN 1..50 LOOP
      INSERT INTO daily_tasks (id, user_id, day_number, topic, description, completed, created_at)
      VALUES (
        gen_random_uuid(),
        current_user_id,
        i,
        CASE i
          WHEN 1 THEN 'Career Goals Definition'
          WHEN 2 THEN 'Skills Inventory'
          WHEN 3 THEN 'Industry Research'
          WHEN 4 THEN 'Resume Audit'
          WHEN 5 THEN 'LinkedIn Profile Optimization'
          WHEN 6 THEN 'Personal Branding'
          WHEN 7 THEN 'Week 1 Review'
          WHEN 8 THEN 'Resume Format Selection'
          WHEN 9 THEN 'Achievement Quantification'
          WHEN 10 THEN 'Keyword Optimization'
          WHEN 11 THEN 'Cover Letter Template'
          WHEN 12 THEN 'Tailoring Techniques'
          WHEN 13 THEN 'Portfolio Development'
          WHEN 14 THEN 'Week 2 Review'
          WHEN 15 THEN 'Job Board Setup'
          WHEN 16 THEN 'Company Target List'
          WHEN 17 THEN 'Application Tracking System'
          WHEN 18 THEN 'Daily Application Goal'
          WHEN 19 THEN 'Networking Strategy'
          WHEN 20 THEN 'Informational Interviews'
          WHEN 21 THEN 'Week 3 Review'
          WHEN 22 THEN 'LinkedIn Connections'
          WHEN 23 THEN 'LinkedIn Engagement'
          WHEN 24 THEN 'Alumni Network'
          WHEN 25 THEN 'Professional Associations'
          WHEN 26 THEN 'Twitter/X Professional Profile'
          WHEN 27 THEN 'Personal Website'
          WHEN 28 THEN 'Week 4 Review'
          WHEN 29 THEN 'Common Questions'
          WHEN 30 THEN 'STAR Method'
          WHEN 31 THEN 'Behavioral Questions'
          WHEN 32 THEN 'Technical Prep'
          WHEN 33 THEN 'Mock Interview'
          WHEN 34 THEN 'Company Research'
          WHEN 35 THEN 'Week 5 Review'
          WHEN 36 THEN 'Salary Negotiation'
          WHEN 37 THEN 'Questions to Ask'
          WHEN 38 THEN 'Virtual Interview Setup'
          WHEN 39 THEN 'Body Language'
          WHEN 40 THEN 'Follow-up Strategy'
          WHEN 41 THEN 'Rejection Handling'
          WHEN 42 THEN 'Week 6 Review'
          WHEN 43 THEN 'Application Surge'
          WHEN 44 THEN 'Referral Requests'
          WHEN 45 THEN 'Skills Gap Analysis'
          WHEN 46 THEN 'Online Course Enrollment'
          WHEN 47 THEN 'Volunteer/Freelance'
          WHEN 48 THEN 'Recruiter Outreach'
          WHEN 49 THEN 'Week 7 Review'
          WHEN 50 THEN 'Offer Evaluation'
        END,
        CASE i
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
        FALSE,
        NOW()
      );
    END LOOP;
  END LOOP;
  
  -- Mark some tasks as completed for demo
  UPDATE daily_tasks SET completed = TRUE, completed_at = NOW()
  WHERE user_id = '00000000-0000-0000-0000-000000000001' AND day_number IN (1,2,3,4,5);
  
  UPDATE daily_tasks SET completed = TRUE, completed_at = NOW()
  WHERE user_id = '00000000-0000-0000-0000-000000000002' AND day_number IN (1,2,3);
  
  UPDATE daily_tasks SET completed = TRUE, completed_at = NOW()
  WHERE user_id = '5d398079-fd02-4392-82b5-d656d4a98da7' AND day_number IN (1,2);
  
END $$;

-- Verify tasks were created
SELECT user_id, COUNT(*) as task_count, SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed_count
FROM daily_tasks
WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '5d398079-fd02-4392-82b5-d656d4a98da7'
)
GROUP BY user_id;
