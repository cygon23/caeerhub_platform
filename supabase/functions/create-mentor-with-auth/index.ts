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
    const requestBody = await req.json();

    const {
      name,
      email,
      password,
      phone,
      location,
      bio,
      expertise,
    } = requestBody;

    console.log("Received mentor creation request:", { email, name });

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          missingFields,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          error: "Invalid email format",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return new Response(
        JSON.stringify({
          error: "Password must be at least 6 characters long",
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

    // Check if user with this email already exists
    const { data: existingUser, error: checkError } = await supabaseClient.auth.admin.listUsers();

    if (!checkError && existingUser?.users) {
      const emailExists = existingUser.users.some(user => user.email === email);
      if (emailExists) {
        return new Response(
          JSON.stringify({
            error: "A user with this email already exists",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Create auth user
    const { data: authUser, error: authError } = await supabaseClient.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: name,
        role: 'mentor',
      },
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      throw authError;
    }

    if (!authUser.user) {
      throw new Error("Failed to create user");
    }

    const authUserId = authUser.user.id;
    console.log("Auth user created:", authUserId);

    // Create profile for the mentor
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        user_id: authUserId,
        display_name: name,
        phone: phone || null,
        location: location || null,
        bio: bio || null,
        status: 'active',
      });

    if (profileError) {
      console.error("Error creating profile:", profileError);

      // Clean up auth user if profile creation fails
      try {
        await supabaseClient.auth.admin.deleteUser(authUserId);
      } catch (cleanupError) {
        console.error("Error cleaning up auth user:", cleanupError);
      }

      throw profileError;
    }

    console.log("Profile created for user:", authUserId);

    // Assign mentor role
    const { error: roleError } = await supabaseClient
      .from('user_roles')
      .insert({
        user_id: authUserId,
        role: 'mentor',
      });

    if (roleError) {
      console.error("Error assigning mentor role:", roleError);

      // Clean up profile and auth user if role assignment fails
      try {
        await supabaseClient.from('profiles').delete().eq('user_id', authUserId);
        await supabaseClient.auth.admin.deleteUser(authUserId);
      } catch (cleanupError) {
        console.error("Error cleaning up:", cleanupError);
      }

      throw roleError;
    }

    console.log("Mentor role assigned to user:", authUserId);

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: authUserId,
          email: email,
          name: name,
        },
        credentials: {
          email: email,
          password: password,
        },
        message: "Mentor created successfully with login credentials",
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
        error: error.message || "An error occurred while creating the mentor",
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
