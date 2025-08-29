import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronRight,
  ChevronLeft,
  Star,
  Brain,
  Target,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OnboardingData {
  educationLevel: string;
  strongestSubjects: string[];
  industriesOfInterest: string[];
  dreamCareer: string;
  preferredPath: string;
  focusLevel: number;
  timeManagement: number;
  studySupport: string[];
  reminderFrequency: string;
}

export default function OnboardingWizard() {
  const { user, updateUserOnboardingStatus } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    educationLevel: "",
    strongestSubjects: [],
    industriesOfInterest: [],
    dreamCareer: "",
    preferredPath: "",
    focusLevel: 5,
    timeManagement: 5,
    studySupport: [],
    reminderFrequency: "daily",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const educationLevels = [
    "Primary School (Form 7)",
    "Secondary School Form 4",
    "Secondary School Form 6",
    "Certificate/Diploma",
    "University Student",
    "University Graduate",
    "Other",
  ];

  const subjects = [
    "Mathematics",
    "English",
    "Swahili",
    "Physics",
    "Chemistry",
    "Biology",
    "Geography",
    "History",
    "ICT/Computer Studies",
    "Business Studies",
    "Economics",
    "Literature",
    "Art & Design",
    "Agriculture",
  ];

  const industries = [
    "Technology & ICT",
    "Healthcare & Medicine",
    "Agriculture & Food",
    "Education & Training",
    "Business & Finance",
    "Tourism & Hospitality",
    "Engineering & Construction",
    "Media & Communications",
    "Arts & Creative",
    "Government & Public Service",
    "NGO & Development",
    "Manufacturing",
  ];

  const paths = [
    {
      value: "employment",
      label: "Employment Path",
      desc: "Work for established companies and organizations",
    },
    {
      value: "self-employment",
      label: "Self-Employment Path",
      desc: "Start your own business or freelance",
    },
    {
      value: "investor",
      label: "Investor Path",
      desc: "Build wealth through investments and assets",
    },
  ];

  const supportTypes = [
    "Time blocking techniques",
    "Study schedule optimization",
    "Motivation & accountability",
    "Goal setting frameworks",
    "Focus improvement tips",
    "Stress management",
  ];

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setData((prev) => ({
      ...prev,
      strongestSubjects: checked
        ? [...prev.strongestSubjects, subject]
        : prev.strongestSubjects.filter((s) => s !== subject),
    }));
  };

  const handleIndustryChange = (industry: string, checked: boolean) => {
    setData((prev) => ({
      ...prev,
      industriesOfInterest: checked
        ? [...prev.industriesOfInterest, industry]
        : prev.industriesOfInterest.filter((i) => i !== industry),
    }));
  };

  const handleSupportChange = (support: string, checked: boolean) => {
    setData((prev) => ({
      ...prev,
      studySupport: checked
        ? [...prev.studySupport, support]
        : prev.studySupport.filter((s) => s !== support),
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    if (isSubmitting || !user?.id) return;

    setIsSubmitting(true);

    try {
      console.log("Starting onboarding completion for user:", user.id);

      // First, check if a record already exists
      const { data: existingRecord, error: checkError } = await supabase
        .from("onboarding_responses")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is "not found" error, which is expected if no record exists
        console.error("Error checking existing record:", checkError);
        throw checkError;
      }

      const onboardingData = {
        user_id: user.id,
        education_level: data.educationLevel,
        strongest_subjects: data.strongestSubjects,
        interests: data.industriesOfInterest,
        dream_career: data.dreamCareer,
        preferred_path: data.preferredPath,
        support_preferences: data.studySupport,
        habits: {
          focus_level: data.focusLevel,
          time_management: data.timeManagement,
          reminder_frequency: data.reminderFrequency,
        },
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Onboarding data to save:", onboardingData);

      let result;
      if (existingRecord) {
        // Update existing record
        console.log("Updating existing onboarding record");
        result = await supabase
          .from("onboarding_responses")
          .update(onboardingData)
          .eq("user_id", user.id);
      } else {
        // Insert new record
        console.log("Inserting new onboarding record");
        result = await supabase
          .from("onboarding_responses")
          .insert([onboardingData]);
      }

      if (result.error) {
        console.error("Database operation error:", result.error);
        throw result.error;
      }

      console.log("Onboarding data saved successfully");

      // Update user's onboarding status in AuthContext
      await updateUserOnboardingStatus();

      // Show processing toast
      toast({
        title: "Processing Your Profile...",
        description:
          "Our AI is analyzing your responses to create your personalized roadmap.",
      });

      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Show completion toast
      toast({
        title: "Profile Complete! 🎉",
        description: "Welcome to your personalized Career na Mimi dashboard.",
      });

      // Role-based navigation
      switch (user?.role) {
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
    } catch (error: any) {
      console.error("Onboarding completion error:", error);

      let errorMessage = "Failed to save onboarding data. Please try again.";

      // Provide more specific error messages
      if (error.code === "23505") {
        errorMessage =
          "Your onboarding data has already been submitted. Redirecting to dashboard...";
        // If it's a duplicate key error, the data is actually there, so redirect anyway
        setTimeout(() => {
          switch (user?.role) {
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
        }, 2000);
      } else if (
        error.message?.includes("network") ||
        error.message?.includes("fetch")
      ) {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='space-y-6'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4'>
                <Star className='h-8 w-8 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-foreground mb-2'>
                Welcome to Your Journey!
              </h2>
              <p className='text-muted-foreground'>
                Let's start by understanding your educational background
              </p>
            </div>

            <div>
              <Label className='text-lg font-medium'>
                What's your current education level?
              </Label>
              <RadioGroup
                value={data.educationLevel}
                onValueChange={(value) =>
                  setData((prev) => ({ ...prev, educationLevel: value }))
                }
                className='mt-4 space-y-3'>
                {educationLevels.map((level) => (
                  <div key={level} className='flex items-center space-x-2'>
                    <RadioGroupItem value={level} id={level} />
                    <Label htmlFor={level} className='cursor-pointer'>
                      {level}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className='space-y-6'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4'>
                <Brain className='h-8 w-8 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-foreground mb-2'>
                Your Strengths
              </h2>
              <p className='text-muted-foreground'>
                Select your strongest subjects or skills (choose up to 5)
              </p>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              {subjects.map((subject) => (
                <div key={subject} className='flex items-center space-x-2'>
                  <Checkbox
                    id={subject}
                    checked={data.strongestSubjects.includes(subject)}
                    onCheckedChange={(checked) =>
                      handleSubjectChange(subject, checked as boolean)
                    }
                    disabled={
                      data.strongestSubjects.length >= 5 &&
                      !data.strongestSubjects.includes(subject)
                    }
                  />
                  <Label htmlFor={subject} className='cursor-pointer text-sm'>
                    {subject}
                  </Label>
                </div>
              ))}
            </div>

            <p className='text-sm text-muted-foreground text-center'>
              Selected: {data.strongestSubjects.length}/5
            </p>
          </div>
        );

      case 3:
        return (
          <div className='space-y-6'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4'>
                <Target className='h-8 w-8 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-foreground mb-2'>
                Your Interests
              </h2>
              <p className='text-muted-foreground'>
                Which industries excite you the most? (choose up to 4)
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {industries.map((industry) => (
                <div key={industry} className='flex items-center space-x-2'>
                  <Checkbox
                    id={industry}
                    checked={data.industriesOfInterest.includes(industry)}
                    onCheckedChange={(checked) =>
                      handleIndustryChange(industry, checked as boolean)
                    }
                    disabled={
                      data.industriesOfInterest.length >= 4 &&
                      !data.industriesOfInterest.includes(industry)
                    }
                  />
                  <Label htmlFor={industry} className='cursor-pointer text-sm'>
                    {industry}
                  </Label>
                </div>
              ))}
            </div>

            <p className='text-sm text-muted-foreground text-center'>
              Selected: {data.industriesOfInterest.length}/4
            </p>
          </div>
        );

      case 4:
        return (
          <div className='space-y-6'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4'>
                <Sparkles className='h-8 w-8 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-foreground mb-2'>
                Your Dream Career
              </h2>
              <p className='text-muted-foreground'>
                Tell us about your ideal career or job title
              </p>
            </div>

            <div>
              <Label htmlFor='dream-career' className='text-lg font-medium'>
                What's your dream career or job?
              </Label>
              <Textarea
                id='dream-career'
                placeholder='e.g., Software Engineer, Doctor, Entrepreneur, Teacher...'
                value={data.dreamCareer}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, dreamCareer: e.target.value }))
                }
                className='mt-2'
                rows={4}
              />
            </div>

            <div>
              <Label className='text-lg font-medium'>
                Which path interests you most?
              </Label>
              <RadioGroup
                value={data.preferredPath}
                onValueChange={(value) =>
                  setData((prev) => ({ ...prev, preferredPath: value }))
                }
                className='mt-4 space-y-4'>
                {paths.map((path) => (
                  <div
                    key={path.value}
                    className='flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors'>
                    <RadioGroupItem
                      value={path.value}
                      id={path.value}
                      className='mt-1'
                    />
                    <div className='flex-1'>
                      <Label
                        htmlFor={path.value}
                        className='cursor-pointer font-medium'>
                        {path.label}
                      </Label>
                      <p className='text-sm text-muted-foreground mt-1'>
                        {path.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 5:
        return (
          <div className='space-y-6'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4'>
                <Target className='h-8 w-8 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-foreground mb-2'>
                Self-Assessment
              </h2>
              <p className='text-muted-foreground'>
                Help us understand your current habits and preferences
              </p>
            </div>

            <div className='space-y-6'>
              <div>
                <Label className='text-lg font-medium'>
                  Focus Level: {data.focusLevel}/10
                </Label>
                <input
                  type='range'
                  min='1'
                  max='10'
                  value={data.focusLevel}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      focusLevel: parseInt(e.target.value),
                    }))
                  }
                  className='w-full mt-2'
                />
                <p className='text-sm text-muted-foreground mt-1'>
                  How well can you focus on tasks without getting distracted?
                </p>
              </div>

              <div>
                <Label className='text-lg font-medium'>
                  Time Management: {data.timeManagement}/10
                </Label>
                <input
                  type='range'
                  min='1'
                  max='10'
                  value={data.timeManagement}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      timeManagement: parseInt(e.target.value),
                    }))
                  }
                  className='w-full mt-2'
                />
                <p className='text-sm text-muted-foreground mt-1'>
                  How good are you at managing your time and meeting deadlines?
                </p>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className='space-y-6'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4'>
                <CheckCircle className='h-8 w-8 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-foreground mb-2'>
                Support Preferences
              </h2>
              <p className='text-muted-foreground'>
                How would you like us to support your journey?
              </p>
            </div>

            <div>
              <Label className='text-lg font-medium'>
                What kind of behavioral support would help you most?
              </Label>
              <div className='mt-4 space-y-3'>
                {supportTypes.map((support) => (
                  <div key={support} className='flex items-center space-x-2'>
                    <Checkbox
                      id={support}
                      checked={data.studySupport.includes(support)}
                      onCheckedChange={(checked) =>
                        handleSupportChange(support, checked as boolean)
                      }
                    />
                    <Label htmlFor={support} className='cursor-pointer'>
                      {support}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className='text-lg font-medium'>Reminder Frequency</Label>
              <RadioGroup
                value={data.reminderFrequency}
                onValueChange={(value) =>
                  setData((prev) => ({ ...prev, reminderFrequency: value }))
                }
                className='mt-4 space-y-3'>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='daily' id='daily' />
                  <Label htmlFor='daily'>Daily reminders and tips</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='weekly' id='weekly' />
                  <Label htmlFor='weekly'>Weekly progress updates</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='monthly' id='monthly' />
                  <Label htmlFor='monthly'>Monthly check-ins</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='none' id='none' />
                  <Label htmlFor='none'>No automatic reminders</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.educationLevel !== "";
      case 2:
        return data.strongestSubjects.length > 0;
      case 3:
        return data.industriesOfInterest.length > 0;
      case 4:
        return data.dreamCareer.trim() !== "" && data.preferredPath !== "";
      case 5:
        return true; // Always can proceed from self-assessment
      case 6:
        return data.reminderFrequency !== "";
      default:
        return false;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-card flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl'>
        <Card className='border-0 shadow-elegant bg-background/95 backdrop-blur-sm'>
          {/* Progress Header */}
          <CardHeader className='text-center border-b border-border'>
            <div className='flex items-center justify-between mb-4'>
              <div className='text-sm text-muted-foreground'>
                Step {currentStep} of {totalSteps}
              </div>
              <div className='text-sm font-medium text-primary'>
                {Math.round(progress)}% Complete
              </div>
            </div>
            <Progress value={progress} className='w-full h-2' />
          </CardHeader>

          {/* Step Content */}
          <CardContent className='p-8'>{renderStep()}</CardContent>

          {/* Navigation Footer */}
          <div className='flex justify-between items-center p-8 border-t border-border'>
            <Button
              variant='outline'
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}>
              <ChevronLeft className='h-4 w-4 mr-2' />
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed() || isSubmitting}
                className='bg-gradient-hero text-white'>
                Continue
                <ChevronRight className='h-4 w-4 ml-2' />
              </Button>
            ) : (
              <Button
                onClick={completeOnboarding}
                disabled={!canProceed() || isSubmitting}
                className='bg-gradient-hero text-white'>
                {isSubmitting ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <Sparkles className='h-4 w-4 ml-2' />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* AI Processing Preview */}
        {currentStep === totalSteps && (
          <Card className='mt-6 border-0 bg-gradient-accent'>
            <CardContent className='p-6 text-center'>
              <div className='flex items-center justify-center mb-3'>
                <Brain className='h-6 w-6 text-primary mr-2 animate-pulse-scale' />
                <span className='font-medium text-foreground'>
                  AI Analysis Preview
                </span>
              </div>
              <div className='text-sm text-muted-foreground space-y-1'>
                <p>
                  ✨ Personality Type:{" "}
                  <span className='text-primary font-medium'>
                    Logical Thinker
                  </span>
                </p>
                <p>
                  🎯 Top Career Match:{" "}
                  <span className='text-primary font-medium'>
                    Software Engineer
                  </span>
                </p>
                <p>
                  📈 Recommended Path:{" "}
                  <span className='text-primary font-medium'>
                    ICT Diploma → Coding Bootcamp → Junior Developer
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
