import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ArrowLeft, WifiOff, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, login, isOffline, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto-redirect logged-in users
  useEffect(() => {
    if (user && !authLoading) {
      if (user.isFirstLogin) {
        navigate("/onboarding");
      } else {
        // Role-based navigation
        switch (user.role) {
          case 'admin':
            navigate("/dashboard/admin");
            break;
          case 'mentor':
            navigate("/dashboard/mentor");
            break;
          case 'youth':
          default:
            navigate("/dashboard/youth");
            break;
        }
      }
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);

      // Toast will be shown after redirect happens
      // Navigation will be handled by the useEffect above
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Coming Soon",
      description: `${provider} login will be available soon. Please be patient and use email & password for now.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#FE047F]/10 animate-float"
            style={{
              width: `${20 + Math.random() * 80}px`,
              height: `${20 + Math.random() * 80}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="login-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" className="text-foreground" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#login-grid)" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Connection Status */}
        {isOffline && (
          <div className="mb-4 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl flex items-center text-red-600 dark:text-red-400 backdrop-blur-sm">
            <WifiOff className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="text-sm font-medium">No internet connection</span>
          </div>
        )}

        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-all duration-300 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 backdrop-blur-sm">
          <CardHeader className="text-center pb-8 pt-8">
            {/* Logo */}
            <div className="relative inline-block mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-[#FE047F] opacity-20 blur-xl animate-pulse-scale"></div>
              <div className="relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-xl">
                <img
                  src="/logo.png"
                  alt="Career na Mimi Logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>

            <CardTitle className="text-3xl font-bold text-foreground mb-3">Welcome Back</CardTitle>
            <p className="text-muted-foreground text-base">
              Sign in to continue your career journey
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {error && (
              <Alert variant="destructive" className="border-2">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-foreground font-semibold text-sm">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 h-12 border-2 focus:border-[#FE047F] focus:ring-[#FE047F]"
                  disabled={isOffline}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="password" className="text-foreground font-semibold text-sm">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-[#FE047F] hover:text-[#FE047F]/80 text-xs font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-12 h-12 border-2 focus:border-[#FE047F] focus:ring-[#FE047F]"
                    disabled={isOffline}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#FE047F] hover:bg-[#FE047F]/90 text-white text-base font-semibold shadow-xl shadow-[#FE047F]/20 transition-all duration-300 hover:scale-[1.02]"
                disabled={isLoading || isOffline}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-900 text-muted-foreground font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                onClick={() => handleSocialLogin("Google")}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-12 border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                onClick={() => handleSocialLogin("Facebook")}
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-12 border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                onClick={() => handleSocialLogin("Twitter")}
              >
                <svg className="w-5 h-5" fill="#1DA1F2" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-900 text-muted-foreground font-medium">
                  New to Career na Mimi?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link to="/signup">
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-[#00690D] text-[#00690D] hover:bg-[#00690D] hover:text-white text-base font-semibold transition-all duration-300"
              >
                Create Account
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Security Badge */}
        <div className="mt-8 text-center space-y-3">
          <div className="flex items-center justify-center text-muted-foreground">
            <Shield className="h-5 w-5 mr-2 text-[#00690D]" />
            <span className="text-sm font-medium">Secure login powered by Career na Mimi</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your data is encrypted and protected
          </p>
        </div>
      </div>
    </div>
  );
}
