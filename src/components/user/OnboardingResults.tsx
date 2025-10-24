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
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  BookMarked,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  generateAIRoadmap,
  generateFallbackRoadmap,
} from "@/services/aiRoadmapService";

interface RoadmapPhase {
  timeline: string;
  title: string;
  milestones: string[];
  estimated_cost_tzs: number;
  resources: string[];
}

interface OnboardingData {
  id: string;
  education_level: string;
  strongest_subjects: string[];
  interests: string[];
  dream_career: string;
  preferred_path: string;
  habits: {
    focus_level: number;
    time_management: number;
    reminder_frequency: string;
  };
  support_preferences: string[];
  ai_personality_summary: string;
  ai_learning_style: string;
  ai_strengths: string[];
  ai_challenges: string[];
  ai_recommended_path: string;
  ai_roadmap: string;
  ai_roadmap_json: {
    phases: RoadmapPhase[];
    total_estimated_duration: string;
    total_estimated_cost_tzs: number;
  };
  ai_generation_status: string;
  completed_at: string;
}

export default function OnboardingResults() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
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
          setOnboardingData(null);
        } else {
          throw error;
        }
      } else if (data) {
        const transformedData = {
          ...data,
          habits:
            typeof data.habits === "object" && data.habits !== null
              ? (data.habits as {
                  focus_level: number;
                  time_management: number;
                  reminder_frequency: string;
                })
              : {
                  focus_level: 5,
                  time_management: 5,
                  reminder_frequency: "daily",
                },
        };
        setOnboardingData(transformedData);
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

  const regenerateRoadmap = async () => {
    if (!onboardingData || !user) return;

    setIsRegenerating(true);

    try {
      toast({
        title: "Regenerating Roadmap...",
        description: "AI is creating a fresh roadmap for you.",
      });

      let aiResponse;
      let aiGenerationStatus = "completed";

      try {
        aiResponse = await generateAIRoadmap({
          educationLevel: onboardingData.education_level,
          strongestSubjects: onboardingData.strongest_subjects,
          industriesOfInterest: onboardingData.interests,
          dreamCareer: onboardingData.dream_career,
          preferredPath: onboardingData.preferred_path,
          focusLevel: onboardingData.habits.focus_level,
          timeManagement: onboardingData.habits.time_management,
          studySupport: onboardingData.support_preferences,
        });
      } catch (aiError) {
        console.error("AI regeneration failed, using fallback:", aiError);
        aiResponse = generateFallbackRoadmap({
          educationLevel: onboardingData.education_level,
          strongestSubjects: onboardingData.strongest_subjects,
          industriesOfInterest: onboardingData.interests,
          dreamCareer: onboardingData.dream_career,
          preferredPath: onboardingData.preferred_path,
          focusLevel: onboardingData.habits.focus_level,
          timeManagement: onboardingData.habits.time_management,
          studySupport: onboardingData.support_preferences,
        });
        aiGenerationStatus = "failed";
      }

      const { error } = await supabase
        .from("onboarding_responses")
        .update({
          ai_personality_summary: aiResponse.personality_summary,
          ai_learning_style: aiResponse.learning_style,
          ai_strengths: aiResponse.strengths,
          ai_challenges: aiResponse.challenges,
          ai_recommended_path: aiResponse.recommended_path,
          ai_roadmap: aiResponse.recommendation_reasoning,
          ai_roadmap_json: aiResponse.roadmap,
          ai_generation_status: aiGenerationStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Roadmap Regenerated! ✨",
        description: "Your new personalized roadmap is ready.",
      });

      await fetchOnboardingData();
    } catch (error) {
      console.error("Error regenerating roadmap:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      maximumFractionDigits: 0,
    }).format(amount);
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
            Your Career Roadmap
          </h2>
          <p className='text-muted-foreground'>
            Generated on{" "}
            {new Date(onboardingData.completed_at).toLocaleDateString()}
          </p>
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            onClick={regenerateRoadmap}
            disabled={isRegenerating}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRegenerating ? "animate-spin" : ""}`}
            />
            {isRegenerating ? "Regenerating..." : "Regenerate"}
          </Button>
          <Button variant='outline'>
            <Download className='h-4 w-4 mr-2' />
            Export PDF
          </Button>
        </div>
      </div>

      {/* AI Generation Status Warning */}
      {onboardingData.ai_generation_status === "failed" && (
        <Card className='border-yellow-500 bg-yellow-50 dark:bg-yellow-950'>
          <CardContent className='p-4 flex items-start'>
            <AlertCircle className='h-5 w-5 text-yellow-600 mr-3 mt-0.5' />
            <div>
              <h4 className='font-medium text-yellow-900 dark:text-yellow-100'>
                Using Generic Roadmap
              </h4>
              <p className='text-sm text-yellow-800 dark:text-yellow-200'>
                AI generation encountered an issue. This is a fallback roadmap.
                Click "Regenerate" to try again with AI.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Summary */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='bg-gradient-hero text-white'>
          <CardHeader>
            <CardTitle className='flex items-center text-white'>
              <Brain className='h-5 w-5 mr-2' />
              Personality Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-white/90 mb-4'>
              {onboardingData.ai_personality_summary}
            </p>
            <div className='bg-white/10 rounded-lg p-3'>
              <p className='text-sm font-medium mb-1'>Learning Style:</p>
              <p className='text-white/80 text-sm'>
                {onboardingData.ai_learning_style}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-accent'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Target className='h-5 w-5 mr-2' />
              AI Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center mb-3'>
              {getPathIcon(onboardingData.ai_recommended_path)}
              <span className='ml-2 text-xl font-bold'>
                {getPathLabel(onboardingData.ai_recommended_path)}
              </span>
            </div>
            <p className='text-sm text-muted-foreground'>
              {onboardingData.ai_roadmap}
            </p>
            {onboardingData.preferred_path !==
              onboardingData.ai_recommended_path && (
              <div className='mt-3 p-2 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800'>
                <p className='text-xs text-blue-800 dark:text-blue-200'>
                  ℹ️ AI suggests a different path than your initial preference
                  for better outcomes
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Challenges */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center text-green-600'>
              <CheckCircle2 className='h-5 w-5 mr-2' />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              {onboardingData.ai_strengths.map((strength, index) => (
                <li key={index} className='flex items-start'>
                  <Star className='h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                  <span className='text-sm'>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center text-orange-600'>
              <Lightbulb className='h-5 w-5 mr-2' />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              {onboardingData.ai_challenges.map((challenge, index) => (
                <li key={index} className='flex items-start'>
                  <AlertCircle className='h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0' />
                  <span className='text-sm'>{challenge}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Career Roadmap Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center'>
              <Calendar className='h-5 w-5 mr-2' />
              Your Career Roadmap
            </div>
            <div className='text-sm font-normal text-muted-foreground'>
              Total Duration:{" "}
              {onboardingData.ai_roadmap_json.total_estimated_duration}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {onboardingData.ai_roadmap_json.phases.map((phase, index) => (
              <div key={index} className='relative'>
                {/* Timeline connector */}
                {index !== onboardingData.ai_roadmap_json.phases.length - 1 && (
                  <div className='absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-primary to-primary/20' />
                )}

                <div className='flex items-start'>
                  {/* Timeline dot */}
                  <div className='flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary z-10'>
                    <span className='text-primary font-bold'>{index + 1}</span>
                  </div>

                  {/* Phase content */}
                  <div className='ml-6 flex-1'>
                    <div className='bg-muted/50 rounded-lg p-4 border border-border'>
                      <div className='flex items-center justify-between mb-3'>
                        <div>
                          <Badge variant='outline' className='mb-2'>
                            {phase.timeline}
                          </Badge>
                          <h4 className='text-lg font-semibold'>
                            {phase.title}
                          </h4>
                        </div>
                        <div className='text-right'>
                          <div className='text-xs text-muted-foreground'>
                            Est. Cost
                          </div>
                          <div className='font-semibold text-primary'>
                            {formatCurrency(phase.estimated_cost_tzs)}
                          </div>
                        </div>
                      </div>

                      {/* Milestones */}
                      <div className='mb-3'>
                        <h5 className='text-sm font-medium mb-2 flex items-center'>
                          <CheckCircle2 className='h-4 w-4 mr-1' />
                          Milestones:
                        </h5>
                        <ul className='space-y-1'>
                          {phase.milestones.map((milestone, mIndex) => (
                            <li
                              key={mIndex}
                              className='text-sm text-muted-foreground pl-5 relative before:content-["•"] before:absolute before:left-0'>
                              {milestone}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Resources */}
                      <div>
                        <h5 className='text-sm font-medium mb-2 flex items-center'>
                          <BookMarked className='h-4 w-4 mr-1' />
                          Resources:
                        </h5>
                        <div className='flex flex-wrap gap-2'>
                          {phase.resources.map((resource, rIndex) => (
                            <Badge
                              key={rIndex}
                              variant='secondary'
                              className='text-xs'>
                              {resource}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Cost Summary */}
          <div className='mt-6 p-4 bg-gradient-accent rounded-lg border border-primary/20'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <DollarSign className='h-5 w-5 text-primary mr-2' />
                <span className='font-medium'>Total Estimated Investment</span>
              </div>
              <span className='text-2xl font-bold text-primary'>
                {formatCurrency(
                  onboardingData.ai_roadmap_json.total_estimated_cost_tzs
                )}
              </span>
            </div>
            <p className='text-xs text-muted-foreground mt-2'>
              * Costs are estimates and may vary based on your choices and
              market rates
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Educational Background Reference */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <BookOpen className='h-5 w-5 mr-2' />
            Your Profile Summary
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <h4 className='font-medium text-foreground mb-2'>
                Education Level
              </h4>
              <Badge variant='secondary' className='text-sm'>
                {onboardingData.education_level}
              </Badge>
            </div>

            <div>
              <h4 className='font-medium text-foreground mb-2'>Dream Career</h4>
              <Badge variant='secondary' className='text-sm'>
                {onboardingData.dream_career}
              </Badge>
            </div>
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
            <h4 className='font-medium text-foreground mb-2'>
              Industries of Interest
            </h4>
            <div className='flex flex-wrap gap-2'>
              {onboardingData.interests.map((interest, index) => (
                <Badge key={index} variant='default'>
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 pt-4 border-t'>
            <div>
              <div className='flex justify-between mb-2'>
                <span className='text-sm font-medium'>Focus Level</span>
                <span className='text-sm text-muted-foreground'>
                  {onboardingData.habits.focus_level}/10
                </span>
              </div>
              <Progress
                value={onboardingData.habits.focus_level * 10}
                className='h-2'
              />
            </div>

            <div>
              <div className='flex justify-between mb-2'>
                <span className='text-sm font-medium'>Time Management</span>
                <span className='text-sm text-muted-foreground'>
                  {onboardingData.habits.time_management}/10
                </span>
              </div>
              <Progress
                value={onboardingData.habits.time_management * 10}
                className='h-2'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps CTA */}
      <Card className='bg-gradient-card border-0'>
        <CardContent className='p-6 text-center'>
          <h3 className='text-xl font-semibold mb-2'>
            Ready to Start Your Journey?
          </h3>
          <p className='text-muted-foreground mb-4'>
            Your roadmap is ready. Take the first step today!
          </p>
          <div className='space-x-4'>
            <Button className='bg-gradient-hero text-white'>
              <Target className='h-4 w-4 mr-2' />
              Set First Goal
            </Button>
            <Button variant='outline' onClick={() => window.print()}>
              <Download className='h-4 w-4 mr-2' />
              Print Roadmap
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
