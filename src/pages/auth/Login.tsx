import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, LogIn, ArrowLeft, Wifi, WifiOff } from "lucide-react";
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
      
      toast({
        title: "Login Successful!",
        description: "Welcome back to Career na Mimi",
      });

      // Navigation will be handled by the auth state change
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

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Connection Status */}
        {isOffline && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center text-white">
            <WifiOff className="h-4 w-4 mr-2" />
            <span className="text-sm">No internet connection</span>
          </div>
        )}

        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="border-0 shadow-elegant bg-background/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-foreground">Welcome Back</CardTitle>
            <p className="text-muted-foreground">
              Sign in to your Career na Mimi account
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                  disabled={isOffline}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                    disabled={isOffline}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-hero text-white shadow-primary"
                size="lg"
                disabled={isLoading || isOffline}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Links */}
            <div className="space-y-4 text-center text-sm">
              <Link 
                to="/forgot-password" 
                className="text-primary hover:text-primary-dark transition-colors"
              >
                Forgot your password?
              </Link>
              
              <div className="text-muted-foreground">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center text-white/80 text-sm">
          <p>Secure login powered by Career na Mimi</p>
          <p className="mt-1">🔒 Your data is encrypted and protected</p>
        </div>
      </div>
    </div>
  );
}