import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from frontend/.env
dotenv.config({ path: path.join(__dirname, '../frontend/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in frontend/.env');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const dummyUsers = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@jobtracker.test',
    password: 'AdminTest123!@#',
    role: 'admin',
    fullName: 'Admin User'
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'user@jobtracker.test',
    password: 'UserTest123!@#',
    role: 'user',
    fullName: 'Test User'
  },
  {
    id: '5d398079-fd02-4392-82b5-d656d4a98da7',
    email: 'ashwini@cmc.com',
    password: 'Ashwini123',
    role: 'user',
    fullName: 'Ashwini Kumar'
  }
];

async function resetPasswords() {
  console.log('🔄 Resetting dummy user passwords...\n');

  for (const user of dummyUsers) {
    try {
      console.log(`📝 Resetting password for: ${user.email}`);
      
      // Update user password using admin API
      const { data, error } = await supabase.auth.admin.updateUserById(
        user.id,
        {
          password: user.password,
          email_confirm: true
        }
      );

      if (error) {
        console.error(`❌ Error resetting password for ${user.email}:`, error.message);
        continue;
      }

      console.log(`✅ Password reset successfully for ${user.email}`);
      console.log(`   Password: ${user.password}\n`);
    } catch (error) {
      console.error(`❌ Exception resetting password for ${user.email}:`, error);
    }
  }

  console.log('\n✅ Password reset complete!\n');
  console.log('📋 Updated Credentials:\n');
  console.log('┌─────────────────────────────────────────────────────────────┐');
  console.log('│ User          │ Email                    │ Password         │');
  console.log('├─────────────────────────────────────────────────────────────┤');
  console.log('│ Admin         │ admin@jobtracker.test    │ AdminTest123!@#  │');
  console.log('│ Test User     │ user@jobtracker.test     │ UserTest123!@#   │');
  console.log('│ Ashwini       │ ashwini@cmc.com          │ Ashwini123       │');
  console.log('└─────────────────────────────────────────────────────────────┘');
  console.log('\n🎯 You can now login with these credentials!');
}

resetPasswords().catch(console.error);
