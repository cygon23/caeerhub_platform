import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const {
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
      status,
      created_by,
    } = await req.json();

    // Validate required fields
    if (!school_id || !student_name || !form_level || !registration_number) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
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

    let authUserId = null;

    // Create auth user only if email is provided
    if (email) {
      try {
        // Generate a default password (registration number or a random one)
        const defaultPassword = registration_number || `Student@${Math.random().toString(36).slice(-8)}`;

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
        created_by: created_by || authUserId,
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
        message: authUserId
          ? `Student created successfully. Login credentials sent to ${email}`
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
