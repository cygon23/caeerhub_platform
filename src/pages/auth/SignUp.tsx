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
      <div className='min-h-screen bg-gradient-hero flex items-center justify-center p-4'>
        <div className='w-full max-w-md relative z-10'>
          <Card className='border-0 shadow-elegant bg-background/95 backdrop-blur-sm'>
            <CardContent className='text-center p-8'>
              <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Check className='h-8 w-8 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-foreground mb-2'>
                Confirm Your Email
              </h2>
              <p className='text-muted-foreground mb-4'>
                We've sent a verification link to{" "}
                <span className='font-semibold'>{formData.email}</span>.<br />
                Please check your inbox and click the link to activate your
                account.
              </p>
              <p className='text-sm text-muted-foreground mb-4'>
                Didn&apos;t receive the email? Check your spam or junk folder.
                <br />
                You can resend the verification email after a short delay.
              </p>
              <Button
                className='w-full bg-gradient-hero text-white mb-2'
                onClick={handleResendEmail}
                disabled={resendDelay > 0 || isLoading}>
                {resendDelay > 0
                  ? `Resend Email (${resendDelay}s)`
                  : "Resend Verification Email"}
              </Button>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => navigate("/login")}>
                Continue to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-hero flex items-center justify-center p-4'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]'></div>
      </div>

      <div className='w-full max-w-4xl relative z-10'>
        {/* Connection Status */}
        {isOffline && (
          <div className='mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center text-white'>
            <WifiOff className='h-4 w-4 mr-2' />
            <span className='text-sm'>No internet connection</span>
          </div>
        )}

        {/* Back to Home */}
        <Link
          to='/'
          className='inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back to Home
        </Link>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
          {/* Sign Up Form */}
          <Card className='border-0 shadow-elegant bg-background/95 backdrop-blur-sm'>
            <CardHeader className='text-center pb-6'>
              <div className='w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4'>
                <UserPlus className='h-8 w-8 text-white' />
              </div>
              <CardTitle className='text-2xl text-foreground'>
                Join Career na Mimi
              </CardTitle>
              <p className='text-muted-foreground'>
                Start your journey to career success today
              </p>
            </CardHeader>

            <CardContent className='space-y-6'>
              {error && (
                <Alert variant='destructive'>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='firstName'>First Name</Label>
                    <Input
                      id='firstName'
                      type='text'
                      placeholder='Your first name'
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                      className='mt-1'
                      disabled={isOffline}
                    />
                  </div>
                  <div>
                    <Label htmlFor='lastName'>Last Name</Label>
                    <Input
                      id='lastName'
                      type='text'
                      placeholder='Your last name'
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      required
                      className='mt-1'
                      disabled={isOffline}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='email'>Email Address</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='your.email@example.com'
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className='mt-1'
                    disabled={isOffline}
                  />
                </div>

                <div>
                  <Label htmlFor='password'>Password</Label>
                  <div className='relative mt-1'>
                    <Input
                      id='password'
                      type={showPassword ? "text" : "password"}
                      placeholder='Create a strong password'
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      required
                      className='pr-10'
                      disabled={isOffline}
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-3 flex items-center'
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <EyeOff className='h-4 w-4 text-muted-foreground' />
                      ) : (
                        <Eye className='h-4 w-4 text-muted-foreground' />
                      )}
                    </button>
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Minimum 6 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor='confirmPassword'>Confirm Password</Label>
                  <div className='relative mt-1'>
                    <Input
                      id='confirmPassword'
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder='Confirm your password'
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      required
                      className='pr-10'
                      disabled={isOffline}
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-3 flex items-center'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }>
                      {showConfirmPassword ? (
                        <EyeOff className='h-4 w-4 text-muted-foreground' />
                      ) : (
                        <Eye className='h-4 w-4 text-muted-foreground' />
                      )}
                    </button>
                  </div>
                </div>

                <div className='space-y-3'>
                  <div className='flex items-start space-x-2'>
                    <Checkbox
                      id='terms'
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeToTerms", checked as boolean)
                      }
                      className='mt-1'
                    />
                    <Label htmlFor='terms' className='text-sm leading-relaxed'>
                      I agree to the{" "}
                      <Link
                        to='/terms'
                        className='text-primary hover:text-primary-dark'>
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to='/privacy'
                        className='text-primary hover:text-primary-dark'>
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <div className='flex items-start space-x-2'>
                    <Checkbox
                      id='newsletter'
                      checked={formData.subscribeNewsletter}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "subscribeNewsletter",
                          checked as boolean
                        )
                      }
                      className='mt-1'
                    />
                    <Label htmlFor='newsletter' className='text-sm'>
                      Send me career tips, updates, and success stories
                      (optional)
                    </Label>
                  </div>
                </div>

                <Button
                  type='submit'
                  className='w-full bg-gradient-hero text-white shadow-primary'
                  size='lg'
                  disabled={isLoading || isOffline}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className='text-center text-sm text-muted-foreground'>
                Already have an account?{" "}
                <Link
                  to='/login'
                  className='text-primary hover:text-primary-dark font-medium transition-colors'>
                  Sign in here
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className='text-white space-y-8 animate-fade-in'>
            <div>
              <h2 className='text-3xl font-bold mb-4'>
                Unlock Your Career Potential
              </h2>
              <p className='text-white/90 text-lg'>
                Join thousands of Tanzanian youth who are already building
                successful careers with our AI-powered platform.
              </p>
            </div>

            <div className='space-y-4'>
              <h3 className='text-xl font-semibold'>What you'll get:</h3>
              <div className='space-y-3'>
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className='flex items-start space-x-3 animate-slide-up'
                    style={{ animationDelay: `${index * 0.1}s` }}>
                    <CheckCircle className='h-5 w-5 text-secondary-light mt-0.5 flex-shrink-0' />
                    <span className='text-white/90'>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6'>
              <div className='flex items-center mb-3'>
                <div className='text-3xl mr-3'>🎯</div>
                <div>
                  <h4 className='font-semibold'>Free to Start</h4>
                  <p className='text-white/80 text-sm'>
                    All students get free access to our core features
                  </p>
                </div>
              </div>
            </div>

            <div className='text-center text-white/60 text-sm'>
              <p>🔒 Your information is secure and encrypted</p>
              <p>📱 Available on web and mobile devices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
