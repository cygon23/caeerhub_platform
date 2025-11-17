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
  ArrowLeft,
  Check,
  WifiOff,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SignUp() {
  const [userType, setUserType] = useState<"individual" | "school" | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: true,
    // School-specific fields
    schoolName: "",
    registrationNumber: "",
    contactPhone: "",
    contactEmail: "",
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (userType === "school") {
      // School validation
      if (!formData.schoolName || !formData.registrationNumber ||
          !formData.contactEmail || !formData.contactPhone) {
        setError("Please fill in all required fields.");
        return false;
      }

      if (!formData.agreeToTerms) {
        setError("Please agree to the Terms of Service to continue.");
        return false;
      }

      return true;
    }

    // Individual validation
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
      if (userType === "school") {
        // Handle school registration - will be stored separately
        await handleSchoolRegistration();
      } else {
        // Handle individual registration
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();

        // Call signup - we need to check the raw Supabase response
        const { supabase } = await import("@/integrations/supabase/client");
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          throw error;
        }

        // Check if user already exists
        // When email confirmation is enabled and user exists, Supabase returns:
        // - data.user is populated
        // - but data.user.identities is empty (no new identity created)
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          // User already exists
          throw new Error("User already registered");
        }

        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });

        setSuccess(true);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";

      // Check for duplicate email error or database errors
      if (errorMessage.includes("User already registered") ||
          errorMessage.includes("already been registered") ||
          errorMessage.includes("already exists") ||
          errorMessage.includes("duplicate") ||
          errorMessage.includes("identities") ||
          errorMessage.includes("already in use")) {
        setError("This email is already registered. Please sign in instead.");
        toast({
          title: "Account Already Exists",
          description: "This email is already registered. Redirecting to login...",
          variant: "destructive",
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (errorMessage.includes("Database error")) {
        setError("Unable to create account. Please try again later or contact support.");
        toast({
          title: "Registration Error",
          description: "There was a problem creating your account. Please try again later.",
          variant: "destructive",
        });
      } else {
        setError(errorMessage);
        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchoolRegistration = async () => {
    // For school registration, we'll create a pending registration
    // This will be stored in a separate table for admin approval
    const { supabase } = await import("@/integrations/supabase/client");

    const { error } = await supabase
      .from("school_registrations")
      .insert({
        school_name: formData.schoolName,
        registration_number: formData.registrationNumber,
        contact_phone: formData.contactPhone,
        contact_email: formData.contactEmail,
        status: "pending",
      });

    if (error) {
      if (error.message.includes("duplicate") || error.message.includes("already exists")) {
        throw new Error("This school is already registered. Please contact support.");
      }
      throw error;
    }

    toast({
      title: "School Registration Submitted",
      description: "Your registration has been submitted. We will send a verification email within 24 hours.",
    });

    setSuccess(true);
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

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Coming Soon",
      description: `${provider} login will be available soon. Please be patient and use email & password for now.`,
    });
  };

  if (success) {
    // If school registration, show different success message
    if (userType === "school") {
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

          <div className="w-full max-w-md relative z-10">
            <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 backdrop-blur-sm">
              <CardContent className="text-center p-10 space-y-6">
                <div className="relative inline-block mx-auto">
                  <div className="absolute inset-0 rounded-full bg-[#00690D] opacity-20 blur-xl animate-pulse-scale"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-[#00690D] to-[#00690D]/80 rounded-full flex items-center justify-center shadow-xl">
                    <Check className="h-10 w-10 text-white" />
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-3">
                    Registration Submitted
                  </h2>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    Thank you for your interest! We have received your school registration.
                    <br />
                    Our team will review your application and send a verification email to{" "}
                    <span className="font-semibold text-foreground">{formData.contactEmail}</span>{" "}
                    within 24 hours.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border-2 border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-muted-foreground">
                    After verification, you will receive further instructions on how to complete your school profile and access the platform.
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-[#00690D] text-[#00690D] hover:bg-[#00690D] hover:text-white text-base font-semibold transition-all duration-300"
                  onClick={() => navigate("/")}
                >
                  Return to Home
                </Button>

                <div className="flex items-center justify-center text-muted-foreground pt-2">
                  <Shield className="h-4 w-4 mr-2 text-[#00690D]" />
                  <span className="text-xs font-medium">Your data is encrypted and protected</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Individual registration success - show email verification screen
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
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  Confirm Your Email
                </h2>
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
                <span className="text-xs font-medium">Your data is encrypted and protected</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // User type selection screen
  if (!userType) {
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

        <div className="w-full max-w-4xl relative z-10">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-all duration-300 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>

          <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 backdrop-blur-sm">
            <CardHeader className="text-center pb-6 pt-8">
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
              <CardTitle className="text-3xl font-bold text-foreground mb-3">
                Join Career na Mimi
              </CardTitle>
              <p className="text-muted-foreground text-base">
                Choose your registration type to get started
              </p>
            </CardHeader>

            <CardContent className="space-y-6 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Individual Registration Card */}
                <button
                  onClick={() => setUserType("individual")}
                  className="group relative p-8 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-[#FE047F] hover:shadow-xl transition-all duration-300 text-left bg-white dark:bg-slate-800"
                >
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#FE047F]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-[#FE047F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-3">Individual</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Join as a student or youth looking to explore career opportunities, access mentorship, and develop your skills.
                  </p>

                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-[#00690D]" />
                        <span>AI-powered career assessment</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-[#00690D]" />
                        <span>Personalized learning paths</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-[#00690D]" />
                        <span>Mentor matching</span>
                      </li>
                    </ul>
                  </div>
                </button>

                {/* School Registration Card */}
                <button
                  onClick={() => setUserType("school")}
                  className="group relative p-8 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-[#00690D] hover:shadow-xl transition-all duration-300 text-left bg-white dark:bg-slate-800"
                >
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#00690D]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-[#00690D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-3">School</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Register your educational institution to connect your students with career opportunities and resources.
                  </p>

                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-[#00690D]" />
                        <span>Bulk student registration</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-[#00690D]" />
                        <span>School dashboard analytics</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-[#00690D]" />
                        <span>Career guidance resources</span>
                      </li>
                    </ul>
                  </div>
                </button>
              </div>

              <div className="text-center text-sm text-muted-foreground pt-4">
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

              <CardTitle className="text-3xl font-bold text-foreground mb-3">
                {userType === "school" ? "School Registration" : "Join Career na Mimi"}
              </CardTitle>
              <p className="text-muted-foreground text-base">
                {userType === "school"
                  ? "Register your institution to empower your students"
                  : "Start your journey to career success today"}
              </p>
              {userType && (
                <button
                  onClick={() => setUserType(null)}
                  className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Change registration type
                </button>
              )}
            </CardHeader>

            <CardContent className="space-y-6 pb-8">
              {error && (
                <Alert variant="destructive" className="border-2">
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {userType === "school" ? (
                  // School registration fields
                  <>
                    <div>
                      <Label htmlFor="schoolName" className="text-foreground font-semibold text-sm">School Name</Label>
                      <Input
                        id="schoolName"
                        type="text"
                        placeholder="Full school name"
                        value={formData.schoolName}
                        onChange={(e) =>
                          handleInputChange("schoolName", e.target.value)
                        }
                        required
                        className="mt-2 h-12 border-2 focus:border-[#00690D] focus:ring-[#00690D]"
                        disabled={isOffline}
                      />
                    </div>

                    <div>
                      <Label htmlFor="registrationNumber" className="text-foreground font-semibold text-sm">Registration Number</Label>
                      <Input
                        id="registrationNumber"
                        type="text"
                        placeholder="School registration number"
                        value={formData.registrationNumber}
                        onChange={(e) =>
                          handleInputChange("registrationNumber", e.target.value)
                        }
                        required
                        className="mt-2 h-12 border-2 focus:border-[#00690D] focus:ring-[#00690D]"
                        disabled={isOffline}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactEmail" className="text-foreground font-semibold text-sm">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="school@example.com"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                        required
                        className="mt-2 h-12 border-2 focus:border-[#00690D] focus:ring-[#00690D]"
                        disabled={isOffline}
                      />
                      <p className="text-xs text-muted-foreground mt-1 ml-1">
                        We'll send verification details to this email
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="contactPhone" className="text-foreground font-semibold text-sm">Contact Phone Number</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="+255 XXX XXX XXX"
                        value={formData.contactPhone}
                        onChange={(e) =>
                          handleInputChange("contactPhone", e.target.value)
                        }
                        required
                        className="mt-2 h-12 border-2 focus:border-[#00690D] focus:ring-[#00690D]"
                        disabled={isOffline}
                      />
                    </div>
                  </>
                ) : (
                  // Individual registration fields
                  <>
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
                  </>
                )}

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

                  {userType === "individual" && (
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
                  )}
                </div>

                <Button
                  type="submit"
                  className={`w-full h-12 text-white text-base font-semibold shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                    userType === "school"
                      ? "bg-[#00690D] hover:bg-[#00690D]/90 shadow-[#00690D]/20"
                      : "bg-[#FE047F] hover:bg-[#FE047F]/90 shadow-[#FE047F]/20"
                  }`}
                  disabled={isLoading || isOffline}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {userType === "school" ? "Submitting..." : "Creating Account..."}
                    </span>
                  ) : userType === "school" ? "Submit School Registration" : "Create Account"}
                </Button>
              </form>

              {/* Social Login - Only for Individual Registration */}
              {userType === "individual" && (
                <>
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
                </>
              )}

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

          {/* Animated Benefits Diagrams */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* AI Assessment Diagram */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-sm overflow-hidden relative group hover:border-[#FE047F]/30 transition-all duration-300">
              <svg className="w-full h-32" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
                {/* AI Brain */}
                <circle cx="60" cy="60" r="35" fill="#FE047F" fillOpacity="0.1" className="animate-pulse"/>
                <path d="M 50 50 Q 60 30, 70 50 T 90 50" stroke="#FE047F" strokeWidth="3" fill="none" className="animate-pulse"/>
                <circle cx="55" cy="55" r="3" fill="#FE047F"/>
                <circle cx="65" cy="55" r="3" fill="#FE047F"/>
                <path d="M 55 65 Q 60 70, 65 65" stroke="#FE047F" strokeWidth="2" fill="none"/>

                {/* Arrow */}
                <line x1="100" y1="60" x2="150" y2="60" stroke="#00690D" strokeWidth="2" className="animate-pulse">
                  <animate attributeName="x2" values="140;150;140" dur="2s" repeatCount="indefinite"/>
                </line>
                <polygon points="150,60 145,55 145,65" fill="#00690D"/>

                {/* Results */}
                <rect x="170" y="30" width="200" height="15" rx="7" fill="#00690D" fillOpacity="0.2"/>
                <rect x="170" y="30" width="160" height="15" rx="7" fill="#00690D" fillOpacity="0.3" className="animate-pulse"/>
                <rect x="170" y="55" width="180" height="15" rx="7" fill="#FE047F" fillOpacity="0.2"/>
                <rect x="170" y="55" width="140" height="15" rx="7" fill="#FE047F" fillOpacity="0.3" className="animate-pulse"/>
                <rect x="170" y="80" width="160" height="15" rx="7" fill="#00690D" fillOpacity="0.2"/>
                <rect x="170" y="80" width="120" height="15" rx="7" fill="#00690D" fillOpacity="0.3" className="animate-pulse"/>
              </svg>
              <p className="text-center text-sm font-semibold text-foreground mt-2">AI-Powered Assessment</p>
            </div>

            {/* Career Roadmap Diagram */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-sm overflow-hidden relative group hover:border-[#00690D]/30 transition-all duration-300">
              <svg className="w-full h-32" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
                {/* Path */}
                <path d="M 30 100 Q 100 20, 200 60 T 370 40" stroke="#FE047F" strokeWidth="4" fill="none" strokeDasharray="8,4"/>

                {/* Milestones */}
                <circle cx="30" cy="100" r="12" fill="#00690D" className="animate-bounce" style={{animationDelay: '0s', animationDuration: '2s'}}/>
                <circle cx="30" cy="100" r="18" fill="#00690D" fillOpacity="0.2" className="animate-ping"/>

                <circle cx="130" cy="40" r="10" fill="#FE047F" className="animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2s'}}/>
                <circle cx="130" cy="40" r="15" fill="#FE047F" fillOpacity="0.2" className="animate-ping" style={{animationDelay: '0.5s'}}/>

                <circle cx="260" cy="70" r="10" fill="#00690D" className="animate-bounce" style={{animationDelay: '1s', animationDuration: '2s'}}/>
                <circle cx="260" cy="70" r="15" fill="#00690D" fillOpacity="0.2" className="animate-ping" style={{animationDelay: '1s'}}/>

                <circle cx="370" cy="40" r="12" fill="#FE047F" className="animate-bounce" style={{animationDelay: '1.5s', animationDuration: '2s'}}/>
                <circle cx="370" cy="40" r="18" fill="#FE047F" fillOpacity="0.2" className="animate-ping" style={{animationDelay: '1.5s'}}/>

                {/* Flag at end */}
                <line x1="370" y1="40" x2="370" y2="15" stroke="#FE047F" strokeWidth="2"/>
                <polygon points="370,15 385,20 370,25" fill="#FE047F"/>
              </svg>
              <p className="text-center text-sm font-semibold text-foreground mt-2">Personalized Career Roadmap</p>
            </div>

            {/* Mentorship Network Diagram */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-sm overflow-hidden relative group hover:border-[#FE047F]/30 transition-all duration-300">
              <svg className="w-full h-32" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
                {/* Center User */}
                <circle cx="200" cy="60" r="25" fill="#FE047F" fillOpacity="0.2"/>
                <circle cx="200" cy="60" r="20" fill="#FE047F"/>
                <circle cx="200" cy="55" r="8" fill="white"/>
                <path d="M 185 75 Q 200 85, 215 75" stroke="white" strokeWidth="3" fill="none"/>

                {/* Mentors */}
                <circle cx="80" cy="30" r="15" fill="#00690D" className="animate-pulse" style={{animationDelay: '0s'}}/>
                <circle cx="80" cy="30" r="7" fill="white"/>

                <circle cx="320" cy="30" r="15" fill="#00690D" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
                <circle cx="320" cy="30" r="7" fill="white"/>

                <circle cx="80" cy="90" r="15" fill="#00690D" className="animate-pulse" style={{animationDelay: '1s'}}/>
                <circle cx="80" cy="90" r="7" fill="white"/>

                <circle cx="320" cy="90" r="15" fill="#00690D" className="animate-pulse" style={{animationDelay: '1.5s'}}/>
                <circle cx="320" cy="90" r="7" fill="white"/>

                {/* Connection Lines */}
                <line x1="95" y1="35" x2="180" y2="55" stroke="#FE047F" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse"/>
                <line x1="305" y1="35" x2="220" y2="55" stroke="#FE047F" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse"/>
                <line x1="95" y1="85" x2="180" y2="65" stroke="#FE047F" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse"/>
                <line x1="305" y1="85" x2="220" y2="65" stroke="#FE047F" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse"/>
              </svg>
              <p className="text-center text-sm font-semibold text-foreground mt-2">Expert Mentors & Coaches</p>
            </div>

            {/* CV & Job Market Diagram */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-sm overflow-hidden relative group hover:border-[#00690D]/30 transition-all duration-300">
              <svg className="w-full h-32" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
                {/* CV Document */}
                <rect x="30" y="20" width="120" height="80" rx="8" fill="#FE047F" fillOpacity="0.1" stroke="#FE047F" strokeWidth="2"/>
                <rect x="45" y="35" width="90" height="8" rx="4" fill="#FE047F" fillOpacity="0.3"/>
                <rect x="45" y="50" width="70" height="6" rx="3" fill="#00690D" fillOpacity="0.3"/>
                <rect x="45" y="62" width="80" height="6" rx="3" fill="#00690D" fillOpacity="0.3"/>
                <rect x="45" y="74" width="60" height="6" rx="3" fill="#00690D" fillOpacity="0.3"/>

                {/* Arrow */}
                <line x1="160" y1="60" x2="210" y2="60" stroke="#FE047F" strokeWidth="2">
                  <animate attributeName="x2" values="200;210;200" dur="2s" repeatCount="indefinite"/>
                </line>
                <polygon points="210,60 205,55 205,65" fill="#FE047F"/>

                {/* Chart */}
                <line x1="240" y1="100" x2="360" y2="100" stroke="#00690D" strokeWidth="2"/>
                <line x1="240" y1="100" x2="240" y2="30" stroke="#00690D" strokeWidth="2"/>

                <rect x="255" y="70" width="20" height="30" fill="#FE047F" className="animate-pulse" style={{animationDelay: '0s'}}/>
                <rect x="285" y="55" width="20" height="45" fill="#00690D" className="animate-pulse" style={{animationDelay: '0.3s'}}/>
                <rect x="315" y="45" width="20" height="55" fill="#FE047F" className="animate-pulse" style={{animationDelay: '0.6s'}}/>
              </svg>
              <p className="text-center text-sm font-semibold text-foreground mt-2">Smart CV & Market Insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
