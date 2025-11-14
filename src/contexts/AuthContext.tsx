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
  const [isFetchingUserData, setIsFetchingUserData] = useState(false);

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

  // Handle page visibility changes (when user switches back to app)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        // Only refresh if we detect the session might be stale (optional)
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user && session.user.id !== user.id) {
            console.log("Session user mismatch, refreshing user data");
            fetchUserData(session.user).then(setUser);
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  const fetchUserData = async (sessionUser: SupabaseUser): Promise<User> => {
    // Prevent concurrent fetches for the same user
    if (isFetchingUserData) {
      const cached = getCachedUserData(sessionUser.id);
      if (cached) return cached;
    }

    setIsFetchingUserData(true);

    try {
      function timeoutPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
        return new Promise((resolve, reject) => {
          const timer = setTimeout(
            () => reject(new Error("Database timeout")),
            ms
          );
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
          5000 // Reduced from 10s to 5s for faster UX
        );

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

      if (
        roleData?.role &&
        ["youth", "mentor", "admin"].includes(roleData.role)
      ) {
        userRole = roleData.role as "youth" | "mentor" | "admin";
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

      // Cache successful user data
      cacheUserData(userData);

      return userData;
    } catch (error) {
      // Try to get cached data first
      const cachedUser = getCachedUserData(sessionUser.id);
      if (cachedUser) {
        return cachedUser;
      }

      // Only use email-based fallback if no cache exists
      const email = sessionUser.email || "";
      let fallbackRole: "youth" | "mentor" | "admin" = "youth";

      if (email.startsWith("admin") || email === "admin@test.com") {
        fallbackRole = "admin";
      } else if (email.startsWith("mentor") || email === "mentor@test.com") {
        fallbackRole = "mentor";
      }

      // Check cache for isFirstLogin status to avoid showing onboarding incorrectly
      const cachedData = getCachedUserData(sessionUser.id);
      const isFirstLogin = cachedData
        ? cachedData.isFirstLogin
        : (fallbackRole === "admin" || fallbackRole === "mentor" ? false : false);

      const fallbackData: User = {
        id: sessionUser.id,
        email: sessionUser.email || "",
        name: sessionUser.user_metadata?.full_name || "User",
        role: fallbackRole,
        isFirstLogin: isFirstLogin,
      };
      return fallbackData;
    } finally {
      setIsFetchingUserData(false);
    }
  };

  // Cache helpers
  const cacheUserData = (userData: User) => {
    try {
      localStorage.setItem(
        `user_cache_${userData.id}`,
        JSON.stringify(userData)
      );
      localStorage.setItem(
        `user_cache_timestamp_${userData.id}`,
        Date.now().toString()
      );
    } catch (e) {
      console.warn("Failed to cache user data:", e);
    }
  };

  const getCachedUserData = (userId: string): User | null => {
    try {
      const cached = localStorage.getItem(`user_cache_${userId}`);
      const timestamp = localStorage.getItem(`user_cache_timestamp_${userId}`);

      if (!cached || !timestamp) return null;

      // Cache expires after 1 hour for fresher data
      const age = Date.now() - parseInt(timestamp);
      if (age > 60 * 60 * 1000) {
        localStorage.removeItem(`user_cache_${userId}`);
        localStorage.removeItem(`user_cache_timestamp_${userId}`);
        return null;
      }

      return JSON.parse(cached) as User;
    } catch (e) {
      console.warn("Failed to get cached user data:", e);
      return null;
    }
  };

  // update user's onboarding status after completion
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
      const updatedUser = {
        ...user,
        isFirstLogin: !hasCompletedOnboarding,
      };

      setUser(updatedUser);

      // Update cache with new onboarding status
      cacheUserData(updatedUser);

      console.log("Updated user onboarding status:", !hasCompletedOnboarding);
    } catch (error) {
      console.error("Error updating onboarding status:", error);
    }
  };

  useEffect(() => {
    let mounted = true;
    let debounceTimer: NodeJS.Timeout | null = null;
    let lastFetchTime = 0;

    // Set up auth state listener ONCE
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTime;

      // If less than 2 seconds since last fetch, debounce
      if (timeSinceLastFetch < 2000 && event !== "SIGNED_OUT") {
        if (debounceTimer) clearTimeout(debounceTimer);

        debounceTimer = setTimeout(async () => {
          if (!mounted) return;
          await handleAuthStateChange(event, session);
        }, 1000);

        return;
      }

      await handleAuthStateChange(event, session);
    });

    const handleAuthStateChange = async (
      event: string,
      session: Session | null
    ) => {
      lastFetchTime = Date.now();
      setSession(session);

      if (session?.user) {
        try {
          const userData = await fetchUserData(session.user);
          if (mounted) setUser(userData);
        } catch (error) {}
      } else {
        if (mounted) setUser(null);
      }
    };

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
        console.error("Initial session error:", error);
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
      if (debounceTimer) clearTimeout(debounceTimer);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (isOffline) {
      throw new Error(
        "No internet connection. Please check your network and try again."
      );
    }

    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Immediately fetch user data after successful login
      if (data.user) {
        const userData = await fetchUserData(data.user);
        setUser(userData);
        setSession(data.session);
      }

      // Login successful - user data loaded
    } catch (error: any) {
      if (error.message?.includes("fetch")) {
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      }
      throw error;
    } finally {
      // Always reset loading state
      setIsLoading(false);
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
