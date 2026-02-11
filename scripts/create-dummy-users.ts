import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../backend-api/.env' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface DummyUser {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'user';
  userId: string;
}

const dummyUsers: DummyUser[] = [
  {
    email: 'admin@jobtracker.test',
    password: 'AdminTest123!@#',
    fullName: 'Admin User',
    role: 'admin',
    userId: '00000000-0000-0000-0000-000000000001',
  },
  {
    email: 'user@jobtracker.test',
    password: 'UserTest123!@#',
    fullName: 'Test User',
    role: 'user',
    userId: '00000000-0000-0000-0000-000000000002',
  },
  {
    email: 'ashwini@cmc.com',
    password: 'Ashwini123',
    fullName: 'Ashwini Kumar',
    role: 'user',
    userId: '00000000-0000-0000-0000-000000000003',
  },
];

async function createDummyUsers() {
  console.log('🚀 Creating dummy users for ChaseMyCareer...\n');

  for (const user of dummyUsers) {
    try {
      console.log(`Creating user: ${user.email}`);

      // Create user with admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName,
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`  ⚠️  User already exists: ${user.email}`);
          
          // Update existing user's password
          const { data: users } = await supabase.auth.admin.listUsers();
          const existingUser = users.users.find(u => u.email === user.email);
          
          if (existingUser) {
            await supabase.auth.admin.updateUserById(existingUser.id, {
              password: user.password,
            });
            console.log(`  ✅ Updated password for: ${user.email}`);
          }
        } else {
          throw authError;
        }
      } else {
        console.log(`  ✅ Created auth user: ${authData.user.id}`);
      }

      // Get the user ID
      const { data: users } = await supabase.auth.admin.listUsers();
      const createdUser = users.users.find(u => u.email === user.email);
      
      if (!createdUser) {
        throw new Error(`User not found after creation: ${user.email}`);
      }

      // Create or update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: createdUser.id,
          email: user.email,
          full_name: user.fullName,
          role: user.role,
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.log(`  ⚠️  Profile error: ${profileError.message}`);
      } else {
        console.log(`  ✅ Created/updated profile with role: ${user.role}`);
      }

      // Create 50-day tasks
      const tasks = [];
      const taskTopics = [
        // Week 1
        'Career Goals Definition', 'Skills Inventory', 'Industry Research', 'Resume Audit',
        'LinkedIn Profile Optimization', 'Personal Branding', 'Week 1 Review',
        // Week 2
        'Resume Format Selection', 'Achievement Quantification', 'Keyword Optimization',
        'Cover Letter Template', 'Tailoring Techniques', 'Portfolio Development', 'Week 2 Review',
        // Week 3
        'Job Board Setup', 'Company Target List', 'Application Tracking System',
        'Daily Application Goal', 'Networking Strategy', 'Informational Interviews', 'Week 3 Review',
        // Week 4
        'LinkedIn Connections', 'LinkedIn Engagement', 'Alumni Network',
        'Professional Associations', 'Twitter/X Professional Profile', 'Personal Website', 'Week 4 Review',
        // Week 5
        'Common Questions', 'STAR Method', 'Behavioral Questions', 'Technical Prep',
        'Mock Interview', 'Company Research', 'Week 5 Review',
        // Week 6
        'Salary Negotiation', 'Questions to Ask', 'Virtual Interview Setup', 'Body Language',
        'Follow-up Strategy', 'Rejection Handling', 'Week 6 Review',
        // Week 7
        'Application Surge', 'Referral Requests', 'Skills Gap Analysis',
        'Online Course Enrollment', 'Volunteer/Freelance', 'Recruiter Outreach', 'Week 7 Review',
        // Week 8
        'Offer Evaluation',
      ];

      const taskDescriptions = [
        'Define your short-term and long-term career objectives',
        'List your technical and soft skills',
        'Research target industries and companies',
        'Review and update your current resume',
        'Enhance your LinkedIn profile with keywords',
        'Define your unique value proposition',
        'Reflect on progress and adjust goals',
        'Choose the best resume format for your experience',
        'Add metrics to your accomplishments',
        'Incorporate industry-specific keywords',
        'Create a master cover letter template',
        'Learn to customize applications',
        'Start building your work portfolio',
        'Finalize resume and cover letter versions',
        'Create accounts on major job platforms',
        'Identify 20 dream companies',
        'Set up your application tracker',
        'Commit to applying to 2-3 jobs daily',
        'Plan your networking approach',
        'Reach out for informational interviews',
        'Assess application progress',
        'Connect with 10 industry professionals',
        'Comment on 5 industry posts daily',
        'Reach out to alumni in target companies',
        'Join relevant industry groups',
        'Create or optimize professional social media',
        'Start building a personal website or portfolio',
        'Evaluate networking effectiveness',
        'Practice answers to 10 common interview questions',
        'Master the STAR response technique',
        'Prepare stories for behavioral interviews',
        'Review technical skills and concepts',
        'Conduct a mock interview with a friend',
        'Deep dive into target company cultures',
        'Refine interview responses',
        'Research salary ranges and practice negotiation',
        'Prepare thoughtful questions for interviewers',
        'Test your video interview setup',
        'Practice confident body language',
        'Learn effective post-interview follow-up',
        'Develop resilience strategies',
        'Consolidate interview skills',
        'Apply to 5 jobs today',
        'Ask for referrals from connections',
        'Identify and address skill gaps',
        'Start a relevant online course',
        'Explore short-term projects',
        'Connect with 3 recruiters',
        'Analyze response rates',
        'Learn to evaluate job offers comprehensively',
      ];

      for (let i = 0; i < 50; i++) {
        tasks.push({
          user_id: createdUser.id,
          day_number: i + 1,
          topic: taskTopics[i],
          description: taskDescriptions[i],
          completed: false,
        });
      }

      const { error: tasksError } = await supabase
        .from('daily_tasks')
        .upsert(tasks, { onConflict: 'user_id,day_number' });

      if (tasksError) {
        console.log(`  ⚠️  Tasks error: ${tasksError.message}`);
      } else {
        console.log(`  ✅ Created 50 daily tasks`);
      }

      // Mark some tasks as completed for demo
      if (user.role === 'admin') {
        await supabase
          .from('daily_tasks')
          .update({ completed: true, completed_at: new Date().toISOString() })
          .eq('user_id', createdUser.id)
          .in('day_number', [1, 2, 3, 4, 5]);
        console.log(`  ✅ Marked 5 tasks as completed`);
      } else if (user.email === 'user@jobtracker.test') {
        await supabase
          .from('daily_tasks')
          .update({ completed: true, completed_at: new Date().toISOString() })
          .eq('user_id', createdUser.id)
          .in('day_number', [1, 2, 3]);
        console.log(`  ✅ Marked 3 tasks as completed`);
      } else {
        await supabase
          .from('daily_tasks')
          .update({ completed: true, completed_at: new Date().toISOString() })
          .eq('user_id', createdUser.id)
          .in('day_number', [1, 2]);
        console.log(`  ✅ Marked 2 tasks as completed`);
      }

      console.log(`✅ Successfully set up user: ${user.email}\n`);
    } catch (error: any) {
      console.error(`❌ Error creating user ${user.email}:`, error.message);
    }
  }

  // Add sample job applications
  console.log('📝 Adding sample job applications...');
  
  const { data: users } = await supabase.auth.admin.listUsers();
  const adminUser = users.users.find(u => u.email === 'admin@jobtracker.test');
  const testUser = users.users.find(u => u.email === 'user@jobtracker.test');
  const ashwiniUser = users.users.find(u => u.email === 'ashwini@cmc.com');

  const applications = [
    // Admin applications
    {
      user_id: adminUser?.id,
      company_name: 'Google',
      job_title: 'Senior Software Engineer',
      job_url: 'https://careers.google.com/jobs/123',
      status: 'interview',
      applied_date: '2026-01-15',
      notes: 'Phone screen scheduled for next week',
    },
    {
      user_id: adminUser?.id,
      company_name: 'Microsoft',
      job_title: 'Product Manager',
      job_url: 'https://careers.microsoft.com/jobs/456',
      status: 'applied',
      applied_date: '2026-01-20',
      notes: 'Applied via LinkedIn',
    },
    // Test user applications
    {
      user_id: testUser?.id,
      company_name: 'Amazon',
      job_title: 'Software Development Engineer',
      job_url: 'https://amazon.jobs/en/jobs/789',
      status: 'applied',
      applied_date: '2026-01-18',
      notes: 'Referred by a friend',
    },
    {
      user_id: testUser?.id,
      company_name: 'Meta',
      job_title: 'Frontend Engineer',
      job_url: 'https://metacareers.com/jobs/012',
      status: 'rejected',
      applied_date: '2026-01-10',
      notes: 'Did not move forward after initial screening',
    },
    // Ashwini applications
    {
      user_id: ashwiniUser?.id,
      company_name: 'Apple',
      job_title: 'iOS Developer',
      job_url: 'https://jobs.apple.com/en-us/details/345',
      status: 'interview',
      applied_date: '2026-01-22',
      notes: 'Technical interview scheduled',
    },
    {
      user_id: ashwiniUser?.id,
      company_name: 'Netflix',
      job_title: 'Full Stack Engineer',
      job_url: 'https://jobs.netflix.com/jobs/678',
      status: 'applied',
      applied_date: '2026-01-25',
      notes: 'Applied through company website',
    },
  ];

  const { error: appsError } = await supabase
    .from('job_applications')
    .upsert(applications, { onConflict: 'user_id,company_name,job_title' });

  if (appsError) {
    console.log(`⚠️  Applications error: ${appsError.message}`);
  } else {
    console.log(`✅ Added ${applications.length} sample job applications\n`);
  }

  console.log('🎉 All dummy users created successfully!\n');
  console.log('📋 Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 Admin User:');
  console.log('   Email: admin@jobtracker.test');
  console.log('   Password: AdminTest123!@#');
  console.log('');
  console.log('👤 Test User:');
  console.log('   Email: user@jobtracker.test');
  console.log('   Password: UserTest123!@#');
  console.log('');
  console.log('👤 Ashwini:');
  console.log('   Email: ashwini@cmc.com');
  console.log('   Password: Ashwini123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

createDummyUsers().catch(console.error);
