import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req: Request) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const demoEmail = "demo@chasemycareer.de";
    const demoPassword = "DemoUser2024!";

    // Check if demo user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingDemoUser = existingUsers?.users?.find(
      (u) => u.email === demoEmail
    );

    let userId: string;

    if (existingDemoUser) {
      // Delete existing demo user's data
      userId = existingDemoUser.id;
      
      // Delete in correct order (respecting foreign keys)
      await supabase.from("task_completions").delete().eq("user_id", userId);
      await supabase.from("contacts").delete().eq("user_id", userId);
      await supabase.from("interviews").delete().eq("user_id", userId);
      await supabase.from("applications").delete().eq("user_id", userId);
      await supabase.from("user_progress").delete().eq("user_id", userId);
      
      // Update user password
      await supabase.auth.admin.updateUserById(userId, {
        password: demoPassword,
      });
    } else {
      // Create new demo user
      const { data: newUser, error: createError } = await supabase.auth.admin
        .createUser({
          email: demoEmail,
          password: demoPassword,
          email_confirm: true,
        });

      if (createError || !newUser.user) {
        throw new Error(`Failed to create demo user: ${createError?.message}`);
      }

      userId = newUser.user.id;

      // Create profile
      await supabase.from("profiles").insert({
        id: userId,
        email: demoEmail,
        role: "user",
      });
    }

    // Create user progress (Day 5, 10 tasks completed)
    const { error: progressError } = await supabase.from("user_progress")
      .insert({
        user_id: userId,
        current_day: 5,
        total_tasks_completed: 10,
        last_activity: new Date().toISOString(),
      });

    if (progressError) {
      throw new Error(`Failed to create progress: ${progressError.message}`);
    }

    // Mark first 10 tasks as completed (Day 1-5, 2 tasks per day)
    const completions = [];
    for (let day = 1; day <= 5; day++) {
      for (let task = 1; task <= 2; task++) {
        completions.push({
          user_id: userId,
          day_number: day,
          task_number: task,
          completed_at: new Date(Date.now() - (6 - day) * 24 * 60 * 60 * 1000)
            .toISOString(),
        });
      }
    }

    const { error: completionsError } = await supabase.from(
      "task_completions"
    ).insert(completions);

    if (completionsError) {
      throw new Error(
        `Failed to create completions: ${completionsError.message}`
      );
    }

    // Create sample applications
    const applications = [
      {
        user_id: userId,
        company: "TechCorp Solutions",
        position: "Senior Software Engineer",
        status: "applied",
        applied_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          .toISOString(),
        job_url: "https://example.com/job1",
        notes: "Great company culture, competitive salary",
      },
      {
        user_id: userId,
        company: "InnovateLabs",
        position: "Full Stack Developer",
        status: "interview",
        applied_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
          .toISOString(),
        job_url: "https://example.com/job2",
        notes: "First round interview scheduled",
      },
      {
        user_id: userId,
        company: "DataDrive Inc",
        position: "Backend Engineer",
        status: "applied",
        applied_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          .toISOString(),
        job_url: "https://example.com/job3",
        notes: "Interesting tech stack with Go and Kubernetes",
      },
      {
        user_id: userId,
        company: "CloudScale Systems",
        position: "DevOps Engineer",
        status: "rejected",
        applied_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
          .toISOString(),
        job_url: "https://example.com/job4",
        notes: "Not a good fit for their requirements",
      },
    ];

    const { error: appsError } = await supabase.from("applications").insert(
      applications
    );

    if (appsError) {
      throw new Error(`Failed to create applications: ${appsError.message}`);
    }

    // Create sample interviews
    const interviews = [
      {
        user_id: userId,
        company: "InnovateLabs",
        position: "Full Stack Developer",
        interview_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          .toISOString(),
        interview_type: "technical",
        status: "scheduled",
        notes: "Prepare system design questions",
      },
      {
        user_id: userId,
        company: "TechCorp Solutions",
        position: "Senior Software Engineer",
        interview_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          .toISOString(),
        interview_type: "behavioral",
        status: "scheduled",
        notes: "Research company values and recent projects",
      },
    ];

    const { error: interviewsError } = await supabase.from("interviews")
      .insert(interviews);

    if (interviewsError) {
      throw new Error(`Failed to create interviews: ${interviewsError.message}`);
    }

    // Create sample contacts
    const contacts = [
      {
        user_id: userId,
        name: "Sarah Johnson",
        company: "TechCorp Solutions",
        position: "Engineering Manager",
        email: "sarah.j@example.com",
        linkedin_url: "https://linkedin.com/in/sarahjohnson",
        notes: "Met at tech conference, very helpful with referral",
        last_contact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          .toISOString(),
      },
      {
        user_id: userId,
        name: "Michael Chen",
        company: "InnovateLabs",
        position: "Senior Developer",
        email: "m.chen@example.com",
        linkedin_url: "https://linkedin.com/in/michaelchen",
        notes: "Former colleague, provided insider tips",
        last_contact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString(),
      },
      {
        user_id: userId,
        name: "Emily Rodriguez",
        company: "DataDrive Inc",
        position: "Tech Recruiter",
        phone: "+1-555-0123",
        email: "emily.r@example.com",
        notes: "Reached out via LinkedIn, very responsive",
        last_contact: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
          .toISOString(),
      },
      {
        user_id: userId,
        name: "David Park",
        company: "CloudScale Systems",
        position: "CTO",
        email: "david.park@example.com",
        linkedin_url: "https://linkedin.com/in/davidpark",
        notes: "Coffee chat scheduled for next week",
        last_contact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          .toISOString(),
      },
    ];

    const { error: contactsError } = await supabase.from("contacts").insert(
      contacts
    );

    if (contactsError) {
      throw new Error(`Failed to create contacts: ${contactsError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        userId,
        tasksCreated: completions.length,
        applicationsCreated: applications.length,
        interviewsCreated: interviews.length,
        contactsCreated: contacts.length,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Connection: "keep-alive",
        },
      }
    );
  } catch (error) {
    console.error("Error creating demo user:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          Connection: "keep-alive",
        },
      }
    );
  }
});
