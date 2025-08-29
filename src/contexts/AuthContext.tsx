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
  const [initialized, setInitialized] = useState(false);

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
  const fetchUserData = async (sessionUser: SupabaseUser): Promise<User> => {
    try {
      console.log("Fetching user data for:", sessionUser.id);

      // Fetch user profile, role, and onboarding status in parallel
      const [profileResponse, roleResponse, onboardingResponse] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("display_name, avatar_url")
            .eq("user_id", sessionUser.id)
            .single(),
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", sessionUser.id)
            .single(),
          supabase
            .from("onboarding_responses")
            .select("id, completed_at")
            .eq("user_id", sessionUser.id)
            .single(),
        ]);

      console.log("Profile response:", profileResponse);
      console.log("Role response:", roleResponse);
      console.log("Onboarding response:", onboardingResponse);

      // Determine user role with email-based fallback
      let userRole: "youth" | "mentor" | "admin" = "youth";

      if (roleResponse.data?.role) {
        userRole = roleResponse.data.role;
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
        onboardingResponse.data && onboardingResponse.data.completed_at;

      // Admin and mentor users should skip onboarding
      const shouldSkipOnboarding =
        userRole === "admin" || userRole === "mentor";

      const userData: User = {
        id: sessionUser.id,
        email: sessionUser.email || "",
        name:
          profileResponse.data?.display_name ||
          sessionUser.user_metadata?.full_name ||
          "User",
        role: userRole,
        isFirstLogin: !hasCompletedOnboarding && !shouldSkipOnboarding,
      };

      console.log("Constructed user data:", userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);

      // Fallback: create user object with email-based role detection
      const email = sessionUser.email || "";
      let fallbackRole: "youth" | "mentor" | "admin" = "youth";

      if (email.startsWith("admin") || email === "admin@test.com") {
        fallbackRole = "admin";
      } else if (email.startsWith("mentor") || email === "mentor@test.com") {
        fallbackRole = "mentor";
      }

      return {
        id: sessionUser.id,
        email: sessionUser.email || "",
        name: sessionUser.user_metadata?.full_name || "User",
        role: fallbackRole,
        isFirstLogin: fallbackRole === "youth", // Only youth users need onboarding
      };
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

  useEffect(() => {
    let mounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");

        // Get current session first
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setSession(null);
            setUser(null);
            setIsLoading(false);
            setInitialized(true);
          }
          return;
        }

        if (currentSession?.user && mounted) {
          console.log(
            "Found existing session for user:",
            currentSession.user.id
          );
          const userData = await fetchUserData(currentSession.user);
          if (mounted) {
            setSession(currentSession);
            setUser(userData);
          }
        } else if (mounted) {
          console.log("No existing session found");
          setSession(null);
          setUser(null);
        }

        if (mounted) {
          setIsLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setIsLoading(false);
          setInitialized(true);
        }
      }
    };

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);

      if (!mounted) return;

      setSession(session);

      if (session?.user) {
        try {
          const userData = await fetchUserData(session.user);
          if (mounted) {
            setUser(userData);
          }
        } catch (error) {
          console.error("Error in auth state change:", error);
          if (mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.full_name || "User",
              role: "youth",
              isFirstLogin: true,
            });
          }
        }
      } else {
        if (mounted) {
          setUser(null);
        }
      }

      // Only set loading to false after initialization is complete
      if (initialized && mounted) {
        setIsLoading(false);
      }
    });

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initialized]);

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
      // Login successful - auth state change will handle user data
    } catch (error: any) {
      if (error.message?.includes("fetch")) {
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      }
      throw error;
    } finally {
      // Don't set loading to false here - let auth state change handle it
      // setIsLoading(false);
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
