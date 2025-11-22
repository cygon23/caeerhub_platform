import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "youth" | "mentor" | "admin" | "school_admin";
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;

    // Prevent multiple navigations in the same render cycle
    if (hasNavigated) return;

    // Auth required but user not logged in
    if (requireAuth && !user) {
      setHasNavigated(true);
      navigate("/login");
      return;
    }

    // User logged in but accessing auth pages (login/signup)
    if (user && !requireAuth) {
      // Non-youth users skip onboarding - go straight to their dashboard
      if (user.role !== 'youth') {
        setHasNavigated(true);
        switch (user.role) {
          case "admin":
            navigate("/dashboard/admin");
            break;
          case "school_admin":
            navigate("/dashboard/school-admin");
            break;
          case "mentor":
            navigate("/dashboard/mentor");
            break;
          default:
            navigate("/dashboard/youth");
            break;
        }
        return;
      }

      // Only youth users go through onboarding
      if (user.role === 'youth') {
        // Check if youth user needs onboarding
        if (user.isFirstLogin && !location.pathname.includes("/onboarding")) {
          console.log("Redirecting to onboarding - first login (youth)");
          setHasNavigated(true);
          navigate("/onboarding");
          return;
        }

        // If youth completed onboarding, redirect to dashboard
        if (!user.isFirstLogin) {
          console.log("Redirecting to dashboard - returning youth user");
          setHasNavigated(true);
          navigate("/dashboard/youth");
          return;
        }
      }
    }

    //User logged in, check if they need onboarding
    if (user && requireAuth) {
      // Non-youth users should never access onboarding
      if (user.role !== 'youth' && location.pathname.includes("/onboarding")) {
        setHasNavigated(true);
        switch (user.role) {
          case "admin":
            navigate("/dashboard/admin");
            break;
          case "school_admin":
            navigate("/dashboard/school-admin");
            break;
          case "mentor":
            navigate("/dashboard/mentor");
            break;
          default:
            navigate("/dashboard/youth");
            break;
        }
        return;
      }

      // Only youth users go through onboarding
      if (user.role === 'youth') {
        // Redirect to onboarding if it's their first login and they're not already there
        if (user.isFirstLogin && !location.pathname.includes("/onboarding")) {
          setHasNavigated(true);
          navigate("/onboarding");
          return;
        }

        // If they've completed onboarding but are on onboarding page, redirect to dashboard
        if (!user.isFirstLogin && location.pathname.includes("/onboarding")) {
          setHasNavigated(true);
          navigate("/dashboard/youth");
          return;
        }
      }
    }

    // Check role-based access
    if (user && requiredRole && user.role !== requiredRole) {
      setHasNavigated(true);
      // Redirect to appropriate dashboard if wrong role
      switch (user.role) {
        case "admin":
          navigate("/dashboard/admin");
          break;
        case "school_admin":
          navigate("/dashboard/school-admin");
          break;
        case "mentor":
          navigate("/dashboard/mentor");
          break;
        case "youth":
        default:
          navigate("/dashboard/youth");
          break;
      }
      return;
    }
  }, [
    user,
    isLoading,
    navigate,
    requiredRole,
    requireAuth,
    location.pathname,
    hasNavigated,
  ]);

  // Reset navigation flag when location changes (for subsequent navigations)
  useEffect(() => {
    setHasNavigated(false);
  }, [location.pathname]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <div className='w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse'>
            <span className='text-white font-bold text-sm'>C</span>
          </div>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
