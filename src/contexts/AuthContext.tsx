import React, { createContext, useContext, useState, useEffect } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "youth" | "mentor" | "admin";
  isFirstLogin?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  updateUserOnboardingStatus: () => Promise<void>;
  isLoading: boolean;
  isOffline: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch user profile data and check onboarding status
  // const fetchUserData = async (sessionUser: SupabaseUser): Promise<User> => {
  //   try {
  //     console.log("Fetching user data for:", sessionUser.id);

  //     // Fetch user profile, role, and onboarding status in parallel
  //     const [profileResponse, roleResponse, onboardingResponse] =
  //       await Promise.all([
  //         supabase
  //           .from("profiles")
  //           .select("display_name, avatar_url")
  //           .eq("user_id", sessionUser.id)
  //           .maybeSingle(), // Use maybeSingle to handle no rows gracefully
  //         supabase
  //           .from("user_roles")
  //           .select("role")
  //           .eq("user_id", sessionUser.id)
  //           .maybeSingle(), // Use maybeSingle to handle no rows gracefully
  //         supabase
  //           .from("onboarding_responses")
  //           .select("id, completed_at")
  //           .eq("user_id", sessionUser.id)
  //           .maybeSingle(), // Use maybeSingle to handle no rows gracefully
  //       ]);

  //     console.log("Profile response:", profileResponse);
  //     console.log("Role response:", roleResponse);
  //     console.log("Onboarding response:", onboardingResponse);

  //     // Handle profile data
  //     const profileData = profileResponse.error ? null : profileResponse.data;

  //     // Handle role data
  //     const roleData = roleResponse.error ? null : roleResponse.data;

  //     // Handle onboarding data
  //     const onboardingData = onboardingResponse.error
  //       ? null
  //       : onboardingResponse.data;

  //     // Determine user role with email-based fallback
  //     let userRole: "youth" | "mentor" | "admin" = "youth";

  //     if (roleData?.role) {
  //       userRole = roleData.role;
  //     } else {
  //       // Fallback: determine role based on email if no role in database
  //       const email = sessionUser.email || "";
  //       if (email.startsWith("admin") || email === "admin@test.com") {
  //         userRole = "admin";
  //       } else if (email.startsWith("mentor") || email === "mentor@test.com") {
  //         userRole = "mentor";
  //       }
  //     }

  //     // Check if onboarding is completed
  //     const hasCompletedOnboarding =
  //       onboardingData && onboardingData.completed_at;

  //     // Admin and mentor users should skip onboarding
  //     const shouldSkipOnboarding =
  //       userRole === "admin" || userRole === "mentor";

  //     const userData: User = {
  //       id: sessionUser.id,
  //       email: sessionUser.email || "",
  //       name:
  //         profileData?.display_name ||
  //         sessionUser.user_metadata?.full_name ||
  //         "User",
  //       role: userRole,
  //       isFirstLogin: !hasCompletedOnboarding && !shouldSkipOnboarding,
  //     };

  //     console.log("Constructed user data:", userData);
  //     return userData;
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);

  //     // Fallback: create user object with email-based role detection
  //     const email = sessionUser.email || "";
  //     let fallbackRole: "youth" | "mentor" | "admin" = "youth";

  //     if (email.startsWith("admin") || email === "admin@test.com") {
  //       fallbackRole = "admin";
  //     } else if (email.startsWith("mentor") || email === "mentor@test.com") {
  //       fallbackRole = "mentor";
  //     }

  //     return {
  //       id: sessionUser.id,
  //       email: sessionUser.email || "",
  //       name: sessionUser.user_metadata?.full_name || "User",
  //       role: fallbackRole,
  //       isFirstLogin: fallbackRole === "youth", // Only youth users need onboarding
  //     };
  //   }
  // };

  const fetchUserData = async (sessionUser: SupabaseUser): Promise<User> => {
    // Helper to add a timeout to any promise
    function timeoutPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Timeout")), ms);
        promise
          .then((value) => {
            clearTimeout(timer);
            resolve(value);
          })
          .catch((err) => {
            clearTimeout(timer);
            reject(err);
          });
      });
    }

    try {
      console.log("Fetching user data for:", sessionUser.id);

      // Fetch user profile, role, and onboarding status in parallel, with timeout
      const [profileResponse, roleResponse, onboardingResponse] =
        await timeoutPromise(
          Promise.all([
            supabase
              .from("profiles")
              .select("display_name, avatar_url")
              .eq("user_id", sessionUser.id)
              .maybeSingle(),
            supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", sessionUser.id)
              .maybeSingle(),
            supabase
              .from("onboarding_responses")
              .select("id, completed_at")
              .eq("user_id", sessionUser.id)
              .maybeSingle(),
          ]),
          7000 // 7 seconds timeout
        );

      console.log("Profile response:", profileResponse);
      console.log("Role response:", roleResponse);
      console.log("Onboarding response:", onboardingResponse);

      // Handle profile data
      const profileData = profileResponse.error ? null : profileResponse.data;

      // Handle role data
      const roleData = roleResponse.error ? null : roleResponse.data;

      // Handle onboarding data
      const onboardingData = onboardingResponse.error
        ? null
        : onboardingResponse.data;

      // Determine user role with email-based fallback
      let userRole: "youth" | "mentor" | "admin" = "youth";

      if (roleData?.role) {
        userRole = roleData.role;
      } else {
        // Fallback: determine role based on email if no role in database
        const email = sessionUser.email || "";
        if (email.startsWith("admin") || email === "admin@test.com") {
          userRole = "admin";
        } else if (email.startsWith("mentor") || email === "mentor@test.com") {
          userRole = "mentor";
        }
      }

      // Check if onboarding is completed
      const hasCompletedOnboarding =
        onboardingData && onboardingData.completed_at;

      // Admin and mentor users should skip onboarding
      const shouldSkipOnboarding =
        userRole === "admin" || userRole === "mentor";

      const userData: User = {
        id: sessionUser.id,
        email: sessionUser.email || "",
        name:
          profileData?.display_name ||
          sessionUser.user_metadata?.full_name ||
          "User",
        role: userRole,
        isFirstLogin: !hasCompletedOnboarding && !shouldSkipOnboarding,
      };

      console.log("Constructed user data:", userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Function to update user's onboarding status after completion
  const updateUserOnboardingStatus = async () => {
    if (!user) return;

    try {
      console.log("Updating onboarding status for user:", user.id);

      // Check onboarding status again
      const { data: onboardingResponse } = await supabase
        .from("onboarding_responses")
        .select("id, completed_at")
        .eq("user_id", user.id)
        .single();

      const hasCompletedOnboarding =
        onboardingResponse && onboardingResponse.completed_at;

      // Update user state
      setUser((prev) =>
        prev
          ? {
              ...prev,
              isFirstLogin: !hasCompletedOnboarding,
            }
          : null
      );

      console.log("Updated user onboarding status:", !hasCompletedOnboarding);
    } catch (error) {
      console.error("Error updating onboarding status:", error);
    }
  };

  // ...existing code...
  useEffect(() => {
    let mounted = true;

    // Set up auth state listener ONCE
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      // Only set loading for explicit sign in/out
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        setIsLoading(true);
      }

      setSession(session);

      if (session?.user) {
        try {
          const userData = await fetchUserData(session.user);
          if (mounted) setUser(userData);
        } catch (error) {
          if (mounted)
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.full_name || "User",
              role: "youth",
              isFirstLogin: true,
            });
        }
      } else {
        if (mounted) setUser(null);
      }

      // Only set loading to false for sign in/out, not for INITIAL_SESSION
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        if (mounted) setIsLoading(false);
      }
    });

    // Initial session check
    (async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();
        if (error || !currentSession?.user) {
          if (mounted) {
            setSession(null);
            setUser(null);
          }
        } else {
          if (mounted) {
            setSession(currentSession);
            const userData = await fetchUserData(currentSession.user);
            setUser(userData);
          }
        }
      } catch (error) {
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) setIsLoading(false); // Always set loading to false after initial check
      }
    })();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  // ...existing code...

  const login = async (email: string, password: string) => {
    if (isOffline) {
      throw new Error(
        "No internet connection. Please check your network and try again."
      );
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      // Login successful - auth state change will handle user data and stop loading
    } catch (error: any) {
      // Set loading to false on error since auth state won't change
      setIsLoading(false);

      if (error.message?.includes("fetch")) {
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      }
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    if (isOffline) {
      throw new Error(
        "No internet connection. Please check your network and try again."
      );
    }

    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      if (error.message?.includes("fetch")) {
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      // Force local logout even if network request fails
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        signup,
        logout,
        updateUserOnboardingStatus,
        isLoading,
        isOffline,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
