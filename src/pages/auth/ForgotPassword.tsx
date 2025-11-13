import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send reset email";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-[#00690D]/10 animate-float"
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
              <pattern id="success-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="currentColor" className="text-foreground" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#success-grid)" />
          </svg>
        </div>

        <div className="w-full max-w-md relative z-10">
          <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 backdrop-blur-sm">
            <CardContent className="text-center p-10 space-y-6">
              {/* Success Icon */}
              <div className="relative inline-block mx-auto">
                <div className="absolute inset-0 rounded-full bg-[#00690D] opacity-20 blur-xl animate-pulse-scale"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-[#00690D] to-[#00690D]/80 rounded-full flex items-center justify-center shadow-xl">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  Check Your Email
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  We've sent a password reset link to{" "}
                  <span className="font-semibold text-foreground">{email}</span>.
                  <br />
                  Please check your inbox and follow the instructions.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border-2 border-slate-200 dark:border-slate-700">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam or junk folder.
                  <br />
                  The link will expire in 1 hour.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link to="/login">
                  <Button className="w-full h-12 bg-[#FE047F] hover:bg-[#FE047F]/90 text-white text-base font-semibold shadow-xl shadow-[#FE047F]/20 transition-all duration-300 hover:scale-[1.02]">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <pattern id="forgot-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" className="text-foreground" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#forgot-grid)" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Login */}
        <Link
          to="/login"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-all duration-300 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Login</span>
        </Link>

        <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 backdrop-blur-sm">
          <CardHeader className="text-center pb-8 pt-8">
            {/* Icon */}
            <div className="relative inline-block mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-[#FE047F] opacity-20 blur-xl animate-pulse-scale"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-[#FE047F] to-[#FE047F]/80 rounded-full flex items-center justify-center shadow-xl">
                <Mail className="h-10 w-10 text-white" />
              </div>
            </div>

            <CardTitle className="text-3xl font-bold text-foreground mb-3">
              Forgot Password?
            </CardTitle>
            <p className="text-muted-foreground text-base">
              No worries! Enter your email and we'll send you reset instructions
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
                <Label htmlFor="email" className="text-foreground font-semibold text-sm">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 h-12 border-2 focus:border-[#FE047F] focus:ring-[#FE047F]"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#FE047F] hover:bg-[#FE047F]/90 text-white text-base font-semibold shadow-xl shadow-[#FE047F]/20 transition-all duration-300 hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending Reset Link...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground pt-2">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-[#00690D] hover:text-[#00690D]/80 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
