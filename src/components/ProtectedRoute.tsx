import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "youth" | "mentor" | "admin";
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

  useEffect(() => {
    if (!isLoading) {
      console.log("ProtectedRoute - User state:", {
        user: user?.id,
        isFirstLogin: user?.isFirstLogin,
        role: user?.role,
        currentPath: location.pathname,
        requireAuth,
        requiredRole,
      });

      // Case 1: Auth required but user not logged in
      if (requireAuth && !user) {
        console.log("Redirecting to login - no user");
        navigate("/login");
        return;
      }

      // Case 2: User logged in but accessing auth pages (login/signup)
      if (user && !requireAuth) {
        console.log("User logged in, redirecting from auth page");

        // Check if user needs onboarding first
        if (user.isFirstLogin && !location.pathname.includes("/onboarding")) {
          console.log("Redirecting to onboarding - first login");
          navigate("/onboarding");
          return;
        }

        // If not first login, redirect to appropriate dashboard
        if (!user.isFirstLogin) {
          console.log("Redirecting to dashboard - returning user");
          switch (user.role) {
            case "admin":
              navigate("/dashboard/admin");
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
      }

      // Case 3: User logged in, check if they need onboarding
      if (user && requireAuth) {
        // Redirect to onboarding if it's their first login and they're not already there
        if (user.isFirstLogin && !location.pathname.includes("/onboarding")) {
          console.log(
            "Redirecting to onboarding - first login from protected route"
          );
          navigate("/onboarding");
          return;
        }

        // If they've completed onboarding but are on onboarding page, redirect to dashboard
        if (!user.isFirstLogin && location.pathname.includes("/onboarding")) {
          console.log(
            "Redirecting to dashboard - onboarding already completed"
          );
          switch (user.role) {
            case "admin":
              navigate("/dashboard/admin");
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
      }

      // Case 4: Check role-based access
      if (user && requiredRole && user.role !== requiredRole) {
        console.log("Redirecting due to role mismatch");
        // Redirect to appropriate dashboard if wrong role
        switch (user.role) {
          case "admin":
            navigate("/dashboard/admin");
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
    }
  }, [user, isLoading, navigate, requiredRole, requireAuth, location.pathname]);

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
