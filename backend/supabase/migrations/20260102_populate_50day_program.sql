-- Migration: Populate 50-Day Program Content
-- Created: 2026-01-02
-- Description: Complete curriculum for the 50-day job search program

-- ============================================================================
-- 50-DAY PROGRAM TEMPLATE DATA
-- ============================================================================

-- This creates template tasks that will be copied to each user's daily_tasks
-- when they start the program

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

-- ============================================================================
-- WEEK 1: FOUNDATION & SELF-ASSESSMENT (Days 1-7)
-- ============================================================================

INSERT INTO daily_tasks_template (day_number, title, description, category, estimated_time, tips) VALUES
(1, 'Complete Self-Assessment & Set Goals', 
 'Take time to reflect on your career goals, strengths, weaknesses, and what you''re looking for in your next role. Write down your short-term and long-term career objectives.',
 'preparation', 60,
 ARRAY['Be honest with yourself', 'Think about work-life balance', 'Consider salary expectations', 'Identify your core values']),

(2, 'Update Your LinkedIn Profile',
 'Optimize your LinkedIn profile with a professional photo, compelling headline, detailed experience section, and relevant skills. Request recommendations from former colleagues.',
 'preparation', 90,
 ARRAY['Use a professional headshot', 'Write in first person', 'Add media and projects', 'Turn on "Open to Work"']),

(3, 'Create Your Master Resume',
 'Build a comprehensive master resume with all your experience, skills, and achievements. This will be your source document for tailored resumes.',
 'documents', 120,
 ARRAY['Use action verbs', 'Quantify achievements', 'Keep it ATS-friendly', 'Proofread carefully']),

(4, 'Research and List Target Companies',
 'Identify 20-30 companies you''d love to work for. Research their culture, values, recent news, and open positions.',
 'preparation', 60,
 ARRAY['Use Glassdoor for reviews', 'Check company LinkedIn pages', 'Read recent news articles', 'Note company size and growth']),

(5, 'Set Up Job Search Tools',
 'Create accounts on major job boards (LinkedIn, Indeed, Glassdoor). Set up job alerts for your target roles and locations.',
 'preparation', 45,
 ARRAY['Use specific keywords', 'Set daily email alerts', 'Save interesting jobs', 'Organize with spreadsheet']),

(6, 'Create Cover Letter Template',
 'Write a flexible cover letter template that you can customize for each application. Include your story and value proposition.',
 'documents', 90,
 ARRAY['Keep it to one page', 'Show enthusiasm', 'Address hiring manager by name', 'Explain why you''re interested']),

(7, 'Week 1 Review & Planning',
 'Review your progress from Week 1. Refine your goals and plan for Week 2. Celebrate your accomplishments!',
 'reflection', 30,
 ARRAY['What went well?', 'What needs improvement?', 'Adjust your strategy', 'Stay positive']);

-- ============================================================================
-- WEEK 2: PREPARATION & SKILL BUILDING (Days 8-14)
-- ============================================================================

INSERT INTO daily_tasks_template (day_number, title, description, category, estimated_time, tips) VALUES
(8, 'Research Industry Trends',
 'Stay current with your industry. Read recent articles, reports, and news about trends, challenges, and opportunities in your field.',
 'preparation', 60,
 ARRAY['Follow industry leaders', 'Read trade publications', 'Join relevant subreddits', 'Subscribe to newsletters']),

(9, 'Identify and Address Skills Gaps',
 'Compare your skills with job requirements. Identify gaps and create a plan to address them through online courses or certifications.',
 'skills', 90,
 ARRAY['Check job descriptions', 'Use LinkedIn Learning', 'Consider free courses', 'Focus on in-demand skills']),

(10, 'Create or Update Your Portfolio',
 'Build a personal website or portfolio showcasing your work, projects, and achievements. Include case studies if applicable.',
 'documents', 120,
 ARRAY['Use portfolio platforms', 'Show your best work', 'Include project descriptions', 'Make it mobile-friendly']),

(11, 'Practice Your Elevator Pitch',
 'Craft and practice a 30-second elevator pitch about who you are, what you do, and what you''re looking for.',
 'preparation', 45,
 ARRAY['Keep it concise', 'Practice out loud', 'Record yourself', 'Get feedback']),

(12, 'Set Up Job Alerts and Trackers',
 'Organize your job search with a tracking system. Set up alerts for new postings and create a spreadsheet to track applications.',
 'preparation', 60,
 ARRAY['Track application dates', 'Note follow-up dates', 'Record contact information', 'Update status regularly']),

(13, 'Prepare Your References',
 'Contact 3-5 professional references. Ask permission and brief them on your job search goals.',
 'preparation', 45,
 ARRAY['Choose recent supervisors', 'Provide your resume', 'Give them context', 'Send thank you notes']),

(14, 'Week 2 Review & Reflection',
 'Reflect on your preparation progress. Ensure all your materials are ready. Plan your application strategy for Week 3.',
 'reflection', 30,
 ARRAY['Review all documents', 'Test your pitch', 'Organize your tools', 'Set weekly goals']);

-- ============================================================================
-- WEEK 3: ACTIVE JOB SEARCH BEGINS (Days 15-21)
-- ============================================================================

INSERT INTO daily_tasks_template (day_number, title, description, category, estimated_time, tips) VALUES
(15, 'Apply to 3-5 Jobs',
 'Start applying! Tailor your resume and cover letter for each position. Focus on quality over quantity.',
 'applications', 120,
 ARRAY['Customize each application', 'Follow instructions carefully', 'Save job descriptions', 'Track everything']),

(16, 'Apply to 3-5 Jobs',
 'Continue your application momentum. Research each company before applying.',
 'applications', 120,
 ARRAY['Research company culture', 'Find hiring manager names', 'Check company news', 'Note application deadlines']),

(17, 'Apply to 3-5 Jobs + Network',
 'Apply to jobs and reach out to 2 people in your network. Let them know you''re job searching.',
 'applications', 150,
 ARRAY['Personalize each message', 'Don''t ask for jobs directly', 'Offer value first', 'Be genuine']),

(18, 'Apply to 3-5 Jobs + LinkedIn Engagement',
 'Apply to jobs and engage on LinkedIn. Comment on posts, share articles, and increase your visibility.',
 'applications', 120,
 ARRAY['Comment thoughtfully', 'Share relevant content', 'Tag people appropriately', 'Be professional']),

(19, 'Apply to 3-5 Jobs + Follow Up',
 'Apply to new jobs and follow up on applications from last week. Send polite inquiry emails.',
 'applications', 120,
 ARRAY['Wait 5-7 days before following up', 'Keep it brief', 'Reiterate interest', 'Provide value']),

(20, 'Apply to 3-5 Jobs + Informational Interviews',
 'Apply to jobs and request 2 informational interviews with people in your target companies or roles.',
 'networking', 150,
 ARRAY['Be clear about your ask', 'Respect their time', 'Prepare questions', 'Send thank you notes']),

(21, 'Week 3 Review & Application Analysis',
 'Review your applications. Analyze response rates and adjust your strategy if needed.',
 'reflection', 60,
 ARRAY['Track response rates', 'Identify patterns', 'Refine your approach', 'Celebrate progress']);

-- ============================================================================
-- WEEK 4: NETWORKING INTENSIFIES (Days 22-28)
-- ============================================================================

INSERT INTO daily_tasks_template (day_number, title, description, category, estimated_time, tips) VALUES
(22, 'Apply to 3-5 Jobs + Attend Virtual Event',
 'Continue applications and attend a virtual networking event, webinar, or industry meetup.',
 'networking', 180,
 ARRAY['Prepare questions', 'Engage in chat', 'Connect with speakers', 'Follow up after']),

(23, 'Apply to 3-5 Jobs + LinkedIn Connections',
 'Apply to jobs and send 10 personalized connection requests to people in your target industry.',
 'networking', 120,
 ARRAY['Personalize each request', 'Mention common interests', 'Don''t pitch immediately', 'Engage with their content']),

(24, 'Apply to 3-5 Jobs + Coffee Chats',
 'Apply to jobs and schedule 2 virtual coffee chats with contacts in your network.',
 'networking', 150,
 ARRAY['Prepare talking points', 'Ask for advice, not jobs', 'Take notes', 'Send thank you emails']),

(25, 'Apply to 3-5 Jobs + Alumni Network',
 'Apply to jobs and reach out to 5 alumni from your school who work in your target field.',
 'networking', 120,
 ARRAY['Use alumni databases', 'Mention your school', 'Be respectful of time', 'Offer to help them too']),

(26, 'Apply to 3-5 Jobs + Industry Groups',
 'Apply to jobs and join 3 industry-specific groups on LinkedIn or Slack. Introduce yourself.',
 'networking', 120,
 ARRAY['Read group rules', 'Introduce yourself', 'Contribute value', 'Don''t spam']),

(27, 'Apply to 3-5 Jobs + Follow-Up Week',
 'Apply to jobs and follow up on all networking conversations from this week.',
 'networking', 120,
 ARRAY['Send thank you notes', 'Share relevant articles', 'Keep relationships warm', 'Be genuine']),

(28, 'Week 4 Review & Network Analysis',
 'Review your networking efforts. Identify which strategies are working best.',
 'reflection', 45,
 ARRAY['Track networking ROI', 'Note helpful contacts', 'Plan next steps', 'Update your tracker']);

-- ============================================================================
-- WEEK 5: INTERVIEW PREPARATION (Days 29-35)
-- ============================================================================

INSERT INTO daily_tasks_template (day_number, title, description, category, estimated_time, tips) VALUES
(29, 'Apply to 3-5 Jobs + Behavioral Questions',
 'Apply to jobs and practice answering 5 common behavioral interview questions using the STAR method.',
 'interviews', 150,
 ARRAY['Use STAR method', 'Prepare specific examples', 'Practice out loud', 'Time yourself']),

(30, 'Apply to 3-5 Jobs + Technical Prep',
 'Apply to jobs and prepare for technical questions relevant to your field.',
 'interviews', 150,
 ARRAY['Review fundamentals', 'Practice coding/skills', 'Use online resources', 'Do mock interviews']),

(31, 'Apply to 3-5 Jobs + Company Research',
 'Apply to jobs and deep-dive research 3 companies you''ve applied to. Prepare company-specific questions.',
 'interviews', 120,
 ARRAY['Read annual reports', 'Check recent news', 'Understand products', 'Know competitors']),

(32, 'Apply to 3-5 Jobs + Mock Interview',
 'Apply to jobs and do a mock interview with a friend or use an online platform.',
 'interviews', 150,
 ARRAY['Treat it seriously', 'Get feedback', 'Record yourself', 'Practice follow-up questions']),

(33, 'Apply to 3-5 Jobs + Questions to Ask',
 'Apply to jobs and prepare 10 thoughtful questions to ask interviewers.',
 'interviews', 120,
 ARRAY['Ask about culture', 'Inquire about growth', 'Understand challenges', 'Show genuine interest']),

(34, 'Apply to 3-5 Jobs + Interview Outfit',
 'Apply to jobs and prepare your interview outfit. Do a test video call to check lighting and background.',
 'interviews', 90,
 ARRAY['Dress professionally', 'Test your tech', 'Check lighting', 'Minimize distractions']),

(35, 'Week 5 Review & Interview Readiness',
 'Review your interview preparation. Practice your responses one more time.',
 'reflection', 60,
 ARRAY['Review common questions', 'Practice your pitch', 'Prepare materials', 'Stay confident']);

-- ============================================================================
-- WEEK 6: CONTINUED MOMENTUM (Days 36-42)
-- ============================================================================

INSERT INTO daily_tasks_template (day_number, title, description, category, estimated_time, tips) VALUES
(36, 'Apply to 3-5 Jobs + Salary Research',
 'Apply to jobs and research salary ranges for your target roles using Glassdoor, Payscale, and Levels.fyi.',
 'preparation', 120,
 ARRAY['Know your worth', 'Consider total compensation', 'Factor in location', 'Prepare to negotiate']),

(37, 'Apply to 3-5 Jobs + Portfolio Update',
 'Apply to jobs and update your portfolio with any new projects or achievements.',
 'documents', 120,
 ARRAY['Add recent work', 'Update metrics', 'Refresh design', 'Check all links']),

(38, 'Apply to 3-5 Jobs + Skills Practice',
 'Apply to jobs and spend time practicing key skills for your target role.',
 'skills', 150,
 ARRAY['Focus on weak areas', 'Use online platforms', 'Build sample projects', 'Document your learning']),

(39, 'Apply to 3-5 Jobs + Recruiter Outreach',
 'Apply to jobs and reach out to 5 recruiters who specialize in your field.',
 'networking', 120,
 ARRAY['Find specialized recruiters', 'Send your resume', 'Be clear about goals', 'Follow up professionally']),

(40, 'Apply to 3-5 Jobs + LinkedIn Article',
 'Apply to jobs and write a LinkedIn article about your industry or expertise.',
 'networking', 150,
 ARRAY['Share your knowledge', 'Use relevant hashtags', 'Engage with comments', 'Show thought leadership']),

(41, 'Apply to 3-5 Jobs + Follow-Up Marathon',
 'Apply to jobs and follow up on all pending applications and networking conversations.',
 'applications', 120,
 ARRAY['Be polite and brief', 'Reiterate interest', 'Provide updates', 'Don''t be pushy']),

(42, 'Week 6 Review & Mid-Program Check',
 'Major milestone! Review your progress over 6 weeks. Celebrate wins and adjust strategy.',
 'reflection', 60,
 ARRAY['Count your applications', 'Note interview invites', 'Celebrate progress', 'Adjust goals']);

-- ============================================================================
-- WEEK 7: ADVANCED STRATEGIES (Days 43-49)
-- ============================================================================

INSERT INTO daily_tasks_template (day_number, title, description, category, estimated_time, tips) VALUES
(43, 'Apply to 3-5 Jobs + Direct Outreach',
 'Apply to jobs and reach out directly to hiring managers at 3 target companies.',
 'networking', 150,
 ARRAY['Find decision makers', 'Personalize your message', 'Show value proposition', 'Be respectful']),

(44, 'Apply to 3-5 Jobs + Negotiation Prep',
 'Apply to jobs and prepare your negotiation strategy. Practice discussing salary and benefits.',
 'preparation', 120,
 ARRAY['Know your minimum', 'Research market rates', 'Practice saying numbers', 'Consider total package']),

(45, 'Apply to 3-5 Jobs + Thank You Notes',
 'Apply to jobs and send thank you notes to everyone who''s helped you in your search.',
 'networking', 90,
 ARRAY['Be specific', 'Express gratitude', 'Update them on progress', 'Offer to help them']),

(46, 'Apply to 3-5 Jobs + Final Interview Prep',
 'Apply to jobs and do final interview preparation. Review all your materials.',
 'interviews', 150,
 ARRAY['Review company research', 'Practice responses', 'Prepare questions', 'Stay confident']),

(47, 'Apply to 3-5 Jobs + Backup Plan',
 'Apply to jobs and create a backup plan. Consider contract work, freelancing, or adjacent roles.',
 'preparation', 90,
 ARRAY['Be flexible', 'Consider alternatives', 'Explore freelancing', 'Stay positive']),

(48, 'Apply to 3-5 Jobs + Final Push',
 'Apply to jobs with renewed energy. You''re almost there!',
 'applications', 120,
 ARRAY['Stay motivated', 'Quality over quantity', 'Trust the process', 'Believe in yourself']),

(49, 'Apply to 3-5 Jobs + Week 7 Review',
 'Apply to jobs and review your week. Prepare for the final day.',
 'reflection', 90,
 ARRAY['Review all applications', 'Follow up on pending', 'Stay organized', 'Keep momentum']);

-- ============================================================================
-- DAY 50: CELEBRATION & NEXT STEPS
-- ============================================================================

INSERT INTO daily_tasks_template (day_number, title, description, category, estimated_time, tips) VALUES
(50, 'Celebrate & Plan Next Steps',
 'Congratulations on completing the 50-day program! Reflect on your journey, celebrate your progress, and plan your next steps. Whether you''ve received offers or are still searching, you''ve built incredible momentum.',
 'reflection', 60,
 ARRAY['Celebrate your effort', 'Review what worked', 'Plan to continue', 'Stay connected', 'Help others']);

-- ============================================================================
-- FUNCTION TO INITIALIZE USER TASKS
-- ============================================================================

-- Function to create daily tasks for a new user
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION initialize_user_daily_tasks TO authenticated;

-- ============================================================================
-- TRIGGER TO AUTO-INITIALIZE TASKS FOR NEW USERS
-- ============================================================================

CREATE OR REPLACE FUNCTION auto_initialize_user_tasks()
RETURNS TRIGGER AS $$
BEGIN
  -- Initialize daily tasks for new user
  PERFORM initialize_user_daily_tasks(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_initialize_tasks
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_initialize_user_tasks();
