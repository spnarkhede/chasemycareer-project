import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Delete existing test users if they exist
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const testEmails = ['admin@jobtracker.test', 'user@jobtracker.test'];
    
    for (const user of existingUsers?.users || []) {
      if (testEmails.includes(user.email || '')) {
        await supabaseAdmin.auth.admin.deleteUser(user.id);
      }
    }

    // Create admin user
    const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@jobtracker.test',
      password: 'AdminTest123!@#',
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin User',
        avatar_url: ''
      }
    });

    if (adminError) {
      throw new Error(`Failed to create admin user: ${adminError.message}`);
    }

    // Update admin profile role
    await supabaseAdmin
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', adminUser.user.id);

    // Create regular user
    const { data: regularUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: 'user@jobtracker.test',
      password: 'UserTest123!@#',
      email_confirm: true,
      user_metadata: {
        full_name: 'Test User',
        avatar_url: ''
      }
    });

    if (userError) {
      throw new Error(`Failed to create regular user: ${userError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test users created successfully',
        users: {
          admin: {
            email: 'admin@jobtracker.test',
            password: 'AdminTest123!@#',
            id: adminUser.user.id
          },
          user: {
            email: 'user@jobtracker.test',
            password: 'UserTest123!@#',
            id: regularUser.user.id
          }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating test users:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
