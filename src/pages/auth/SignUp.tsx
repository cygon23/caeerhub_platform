import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import {
  Eye,
  EyeOff,
  UserPlus,
  ArrowLeft,
  CheckCircle,
  Check,
  WifiOff,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendDelay, setResendDelay] = useState(0);

  const { signup, isOffline } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const benefits = [
    "AI-powered career personality assessment",
    "Personalized career roadmap generation",
    "Access to expert mentors and coaches",
    "Smart CV builder and interview preparation",
    "Real-time job market insights",
    "Free access to learning resources",
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms of Service to continue.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await signup(formData.email, formData.password, fullName);
      setSuccess(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      setError(errorMessage);
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification email logic
  useEffect(() => {
    if (resendDelay > 0) {
      const timer = setTimeout(() => setResendDelay(resendDelay - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendDelay]);

  const handleResendEmail = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Fallback: call signup again (Supabase will resend if user exists and is unconfirmed)
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await signup(formData.email, formData.password, fullName);
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox (and spam folder).",
      });
      setResendDelay(30); // 30 seconds delay
    } catch (error) {
      setError("Failed to resend verification email. Please try again later.");
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
              {/* Success Icon with Glow */}
              <div className="relative inline-block mx-auto">
                <div className="absolute inset-0 rounded-full bg-[#00690D] opacity-20 blur-xl animate-pulse-scale"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-[#00690D] to-[#00690D]/80 rounded-full flex items-center justify-center shadow-xl">
                  <Check className="h-10 w-10 text-white" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-center mb-3">
                  <Sparkles className="h-5 w-5 text-[#00690D] mr-2" />
                  <h2 className="text-3xl font-bold text-foreground">
                    Confirm Your Email
                  </h2>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed">
                  We've sent a verification link to{" "}
                  <span className="font-semibold text-foreground">{formData.email}</span>.<br />
                  Please check your inbox and click the link to activate your
                  account.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border-2 border-slate-200 dark:border-slate-700">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam or junk folder.
                  <br />
                  You can resend the verification email after a short delay.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  className="w-full h-12 bg-[#00690D] hover:bg-[#00690D]/90 text-white text-base font-semibold shadow-xl shadow-[#00690D]/20 transition-all duration-300 hover:scale-[1.02]"
                  onClick={handleResendEmail}
                  disabled={resendDelay > 0 || isLoading}
                >
                  {resendDelay > 0
                    ? `Resend Email (${resendDelay}s)`
                    : isLoading ? "Sending..." : "Resend Verification Email"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-[#FE047F] text-[#FE047F] hover:bg-[#FE047F] hover:text-white text-base font-semibold transition-all duration-300"
                  onClick={() => navigate("/login")}
                >
                  Continue to Login
                </Button>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center text-muted-foreground pt-2">
                <Shield className="h-4 w-4 mr-2 text-[#00690D]" />
                <span className="text-xs font-medium">🔒 Your data is encrypted and protected</span>
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
            <pattern id="signup-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" className="text-foreground" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#signup-grid)" />
        </svg>
      </div>

      <div className="w-full max-w-6xl relative z-10">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Sign Up Form */}
          <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 backdrop-blur-sm">
            <CardHeader className="text-center pb-6 pt-8">
              {/* Logo/Icon */}
              <div className="relative inline-block mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-[#FE047F] opacity-20 blur-xl animate-pulse-scale"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-[#FE047F] to-[#FE047F]/80 rounded-full flex items-center justify-center shadow-xl">
                  <UserPlus className="h-10 w-10 text-white" />
                </div>
              </div>

              <div className="flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5 text-[#FE047F] mr-2" />
                <CardTitle className="text-3xl font-bold text-foreground">
                  Join Career na Mimi
                </CardTitle>
              </div>
              <p className="text-muted-foreground text-base">
                Start your journey to career success today
              </p>
            </CardHeader>

            <CardContent className="space-y-6 pb-8">
              {error && (
                <Alert variant="destructive" className="border-2">
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-foreground font-semibold text-sm">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Your first name"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                      className="mt-2 h-12 border-2 focus:border-[#FE047F] focus:ring-[#FE047F]"
                      disabled={isOffline}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-foreground font-semibold text-sm">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Your last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      required
                      className="mt-2 h-12 border-2 focus:border-[#FE047F] focus:ring-[#FE047F]"
                      disabled={isOffline}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground font-semibold text-sm">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="mt-2 h-12 border-2 focus:border-[#FE047F] focus:ring-[#FE047F]"
                    disabled={isOffline}
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-foreground font-semibold text-sm">Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
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
                  <p className="text-xs text-muted-foreground mt-1 ml-1">
                    Minimum 6 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-foreground font-semibold text-sm">Confirm Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      required
                      className="pr-12 h-12 border-2 focus:border-[#FE047F] focus:ring-[#FE047F]"
                      disabled={isOffline}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeToTerms", checked as boolean)
                      }
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed font-medium">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-[#FE047F] hover:text-[#FE047F]/80 underline-offset-4 hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-[#FE047F] hover:text-[#FE047F]/80 underline-offset-4 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="newsletter"
                      checked={formData.subscribeNewsletter}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "subscribeNewsletter",
                          checked as boolean
                        )
                      }
                      className="mt-1"
                    />
                    <Label htmlFor="newsletter" className="text-sm font-medium">
                      Send me career tips, updates, and success stories
                      (optional)
                    </Label>
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
                      Creating Account...
                    </span>
                  ) : "Create Account"}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground pt-2">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#00690D] hover:text-[#00690D]/80 font-semibold transition-colors"
                >
                  Sign in here
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="space-y-8 lg:sticky lg:top-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border-2 border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FE047F] to-[#FE047F]/80 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Unlock Your Career Potential
                </h2>
              </div>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                Join thousands of Tanzanian youth who are already building
                successful careers with our AI-powered platform.
              </p>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  What you'll get:
                </h3>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:border-[#FE047F]/50 hover:bg-[#FE047F]/5"
                    >
                      <CheckCircle className="h-5 w-5 text-[#00690D] mt-0.5 flex-shrink-0" />
                      <span className="text-foreground font-medium text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Free Access Badge */}
            <div className="bg-gradient-to-br from-[#00690D] to-[#00690D]/90 rounded-2xl p-6 shadow-xl text-white">
              <div className="flex items-center mb-3">
                <div className="text-4xl mr-3">🎯</div>
                <div>
                  <h4 className="font-bold text-lg">Free to Start</h4>
                  <p className="text-white/90 text-sm">
                    All students get free access to our core features
                  </p>
                </div>
              </div>
            </div>

            {/* Security Footer */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center text-muted-foreground">
                <Shield className="h-5 w-5 mr-2 text-[#00690D]" />
                <span className="text-sm font-medium">Secure & Encrypted</span>
              </div>
              <p className="text-xs text-muted-foreground">
                🔒 Your information is protected | 📱 Available on all devices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
