import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Helper function to generate smart password from school name
function generateSchoolPassword(schoolName: string): string {
  // Remove spaces and special characters, take first part
  const cleanName = schoolName.replace(/[^a-zA-Z0-9]/g, '');

  // Take first 4 characters of school name (capitalized)
  const schoolPart = cleanName.substring(0, 4).toUpperCase();

  // Generate random 4 digits
  const randomPart = Math.floor(1000 + Math.random() * 9000).toString();

  // Combine to create 8-character password
  return `${schoolPart}${randomPart}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const requestBody = await req.json();

    const {
      student_name,
      form_level,
      email,
      phone,
      gender,
      date_of_birth,
      guardian_name,
      guardian_phone,
      guardian_email,
      status,
      created_by,
    } = requestBody;

    console.log("Received request body:", JSON.stringify(requestBody, null, 2));

    // Validate required fields
    const missingFields = [];
    if (!student_name) missingFields.push('student_name');
    if (!form_level) missingFields.push('form_level');
    if (!created_by) missingFields.push('created_by');

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          missingFields,
          received: requestBody
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the admin's profile to find their school_id
    const { data: adminProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('school_id')
      .eq('user_id', created_by)
      .single();

    if (profileError || !adminProfile?.school_id) {
      console.error("Error fetching admin profile:", profileError);
      return new Response(
        JSON.stringify({
          error: "Could not find school ID for admin user",
          details: profileError
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const school_id = adminProfile.school_id;

    // Get school details to generate registration number
    const { data: school, error: schoolError } = await supabaseClient
      .from('school_registrations')
      .select('school_name, registration_number')
      .eq('registration_number', school_id)
      .single();

    if (schoolError || !school) {
      console.error("Error fetching school details:", schoolError);
      return new Response(
        JSON.stringify({
          error: "Could not find school details",
          details: schoolError
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Count existing students for this school to get next student number
    const { count, error: countError } = await supabaseClient
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', school_id);

    if (countError) {
      console.error("Error counting students:", countError);
      return new Response(
        JSON.stringify({
          error: "Error counting existing students",
          details: countError
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate registration number: AB-1234-0001
    const schoolNameInitials = school.school_name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const schoolRegNumber = school.registration_number.padStart(4, '0');
    const studentNumber = String((count || 0) + 1).padStart(4, '0');
    const registration_number = `${schoolNameInitials}-${schoolRegNumber}-${studentNumber}`;

    // Generate smart default password
    const defaultPassword = generateSchoolPassword(school.school_name);

    console.log("Generated registration number:", registration_number);
    console.log("Generated password:", defaultPassword);

    let authUserId = null;

    // Create auth user only if email is provided
    if (email) {
      try {
        // Create auth user
        const { data: authUser, error: authError } = await supabaseClient.auth.admin.createUser({
          email: email,
          password: defaultPassword,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            full_name: student_name,
            role: 'student',
            school_id: school_id,
            registration_number: registration_number,
          },
        });

        if (authError) {
          console.error("Error creating auth user:", authError);
          throw authError;
        }

        authUserId = authUser.user.id;

        // Create profile for the student
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .insert({
            user_id: authUserId,
            display_name: student_name,
            role: 'student',
            status: status || 'active',
            school_id: school_id,
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          // Don't fail the whole operation if profile creation fails
        }
      } catch (error) {
        console.error("Auth creation error:", error);
        // Continue without auth if email creation fails
        // The student record will still be created
      }
    }

    // Create student record
    const { data: student, error: studentError } = await supabaseClient
      .from('students')
      .insert({
        school_id,
        student_name,
        form_level,
        registration_number,
        email,
        phone,
        gender,
        date_of_birth,
        guardian_name,
        guardian_phone,
        guardian_email,
        status: status || 'active',
        created_by,
      })
      .select()
      .single();

    if (studentError) {
      console.error("Error creating student:", studentError);

      // If student creation fails but auth was created, clean up the auth user
      if (authUserId) {
        try {
          await supabaseClient.auth.admin.deleteUser(authUserId);
        } catch (cleanupError) {
          console.error("Error cleaning up auth user:", cleanupError);
        }
      }

      throw studentError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        student,
        authCreated: !!authUserId,
        defaultPassword: authUserId ? defaultPassword : null,
        registrationNumber: registration_number,
        message: authUserId
          ? `Student created successfully with login credentials`
          : "Student created successfully (no email provided, auth account not created)",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred while creating the student",
        details: error
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
