import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Target,
  BookOpen,
  TrendingUp,
  Calendar,
  Users,
  Clock,
  Star,
  Award,
  RefreshCw,
  Download,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OnboardingData {
  id: string;
  education_level: string;
  strongest_subjects: string[];
  interests: string[];
  dream_career: string;
  preferred_path: string;
  habits: {
    focusLevel: number;
    timeManagement: number;
  };
  support_preferences: string[];
  reminder_frequency: string;
  ai_personality_summary: string;
  ai_roadmap: string;
  completed_at: string;
}

export default function OnboardingResults() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOnboardingData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("onboarding_responses")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No data found
          setOnboardingData(null);
        } else {
          throw error;
        }
      } else {
        setOnboardingData(data);
      }
    } catch (error) {
      console.error("Error fetching onboarding data:", error);
      toast({
        title: "Error",
        description: "Failed to load your onboarding results.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOnboardingData();
  }, [user]);

  const getPathIcon = (path: string) => {
    switch (path) {
      case "employment":
        return <Users className='h-5 w-5' />;
      case "self_employment":
        return <Target className='h-5 w-5' />;
      case "investor":
        return <TrendingUp className='h-5 w-5' />;
      default:
        return <Star className='h-5 w-5' />;
    }
  };

  const getPathLabel = (path: string) => {
    switch (path) {
      case "employment":
        return "Employment Path";
      case "self_employment":
        return "Self-Employment Path";
      case "investor":
        return "Investor Path";
      default:
        return path;
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <RefreshCw className='h-8 w-8 animate-spin text-primary' />
        <span className='ml-3 text-muted-foreground'>
          Loading your results...
        </span>
      </div>
    );
  }

  if (!onboardingData) {
    return (
      <Card>
        <CardContent className='text-center py-12'>
          <Brain className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-xl font-semibold text-foreground mb-2'>
            No Onboarding Data Found
          </h3>
          <p className='text-muted-foreground mb-4'>
            It looks like you haven't completed the onboarding process yet.
          </p>
          <Button
            onClick={() => (window.location.href = "/onboarding")}
            className='bg-gradient-hero text-white'>
            Start Onboarding
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-foreground'>
            Your Onboarding Results
          </h2>
          <p className='text-muted-foreground'>
            Completed on{" "}
            {new Date(onboardingData.completed_at).toLocaleDateString()}
          </p>
        </div>
        <div className='space-x-2'>
          <Button variant='outline' onClick={fetchOnboardingData}>
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh
          </Button>
          <Button variant='outline'>
            <Download className='h-4 w-4 mr-2' />
            Export
          </Button>
        </div>
      </div>

      {/* AI Analysis Summary */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='bg-gradient-hero text-white'>
          <CardHeader>
            <CardTitle className='flex items-center text-white'>
              <Brain className='h-5 w-5 mr-2' />
              AI Personality Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold mb-2'>
              {onboardingData.ai_personality_summary}
            </div>
            <p className='text-white/80 text-sm'>
              Based on your strongest subjects and interests
            </p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-accent'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Target className='h-5 w-5 mr-2' />
              Career Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold mb-2 text-foreground'>
              {onboardingData.dream_career}
            </div>
            <p className='text-muted-foreground text-sm'>
              Your dream career goal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Education & Background */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <BookOpen className='h-5 w-5 mr-2' />
            Educational Background
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <h4 className='font-medium text-foreground mb-2'>
              Current Education Level
            </h4>
            <Badge variant='secondary' className='text-sm'>
              {onboardingData.education_level}
            </Badge>
          </div>

          <div>
            <h4 className='font-medium text-foreground mb-2'>
              Strongest Subjects
            </h4>
            <div className='flex flex-wrap gap-2'>
              {onboardingData.strongest_subjects.map((subject, index) => (
                <Badge key={index} variant='outline'>
                  {subject}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className='font-medium text-foreground mb-2'>Interests</h4>
            <div className='flex flex-wrap gap-2'>
              {onboardingData.interests.map((interest, index) => (
                <Badge key={index} variant='default'>
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career Path & Habits */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              {getPathIcon(onboardingData.preferred_path)}
              <span className='ml-2'>Preferred Career Path</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-lg font-semibold mb-2'>
              {getPathLabel(onboardingData.preferred_path)}
            </div>
            <p className='text-sm text-muted-foreground mb-4'>
              Your chosen career direction
            </p>

            <div className='space-y-2'>
              <h5 className='font-medium'>AI Generated Roadmap:</h5>
              <p className='text-sm bg-gradient-accent p-3 rounded-lg'>
                {onboardingData.ai_roadmap}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <BarChart3 className='h-5 w-5 mr-2' />
              Self-Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <div className='flex justify-between mb-2'>
                <span className='text-sm font-medium'>Focus Level</span>
                <span className='text-sm text-muted-foreground'>
                  {onboardingData.habits.focusLevel}/10
                </span>
              </div>
              <Progress
                value={onboardingData.habits.focusLevel * 10}
                className='h-2'
              />
            </div>

            <div>
              <div className='flex justify-between mb-2'>
                <span className='text-sm font-medium'>Time Management</span>
                <span className='text-sm text-muted-foreground'>
                  {onboardingData.habits.timeManagement}/10
                </span>
              </div>
              <Progress
                value={onboardingData.habits.timeManagement * 10}
                className='h-2'
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Award className='h-5 w-5 mr-2' />
            Support Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <h4 className='font-medium text-foreground mb-2'>
              Preferred Support Types
            </h4>
            <div className='flex flex-wrap gap-2'>
              {onboardingData.support_preferences.map((support, index) => (
                <Badge key={index} variant='outline'>
                  {support}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className='font-medium text-foreground mb-2'>
              Reminder Frequency
            </h4>
            <Badge variant='secondary' className='capitalize'>
              <Clock className='h-3 w-3 mr-1' />
              {onboardingData.reminder_frequency}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className='bg-gradient-card border-0'>
        <CardContent className='p-6 text-center'>
          <h3 className='text-xl font-semibold mb-4'>
            Ready to Continue Your Journey?
          </h3>
          <div className='space-x-4'>
            <Button className='bg-gradient-hero text-white'>
              View My Roadmap
            </Button>
            <Button variant='outline'>Retake Assessment</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
