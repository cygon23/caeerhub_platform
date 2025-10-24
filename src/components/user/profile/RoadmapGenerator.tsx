import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  BookMarked,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle2,
  Target,
  Lightbulb,
  ArrowRight,
  Star,
  Clock,
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

interface RoadmapData {
  phases: RoadmapPhase[];
  total_estimated_duration: string;
  total_estimated_cost_tzs: number;
}

interface OnboardingData {
  id: string;
  education_level: string;
  strongest_subjects: string[];
  interests: string[];
  dream_career: string;
  preferred_path: string;
  habits: any;
  support_preferences: string[];
  ai_personality_summary: string;
  ai_recommended_path: string;
  ai_roadmap: string;
  ai_roadmap_json: RoadmapData;
  ai_generation_status: string;
  completed_at: string;
}

export default function RoadmapGenerator() {
  const [roadmapData, setRoadmapData] = useState<OnboardingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchRoadmap();
  }, [user]);

  const fetchRoadmap = async () => {
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
          setRoadmapData(null);
        } else {
          throw error;
        }
      } else if (data) {
        setRoadmapData(data as OnboardingData);
      }
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      toast({
        title: "Error",
        description: "Failed to load your roadmap.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateRoadmap = async () => {
    if (!roadmapData || !user) return;

    setIsRegenerating(true);

    try {
      toast({
        title: "Regenerating Your Roadmap...",
        description: "AI is creating a fresh personalized roadmap for you.",
      });

      let aiResponse;
      let aiGenerationStatus = "completed";

      try {
        aiResponse = await generateAIRoadmap({
          educationLevel: roadmapData.education_level,
          strongestSubjects: roadmapData.strongest_subjects,
          industriesOfInterest: roadmapData.interests,
          dreamCareer: roadmapData.dream_career,
          preferredPath: roadmapData.preferred_path,
          focusLevel: roadmapData.habits?.focus_level || 5,
          timeManagement: roadmapData.habits?.time_management || 5,
          studySupport: roadmapData.support_preferences,
        });
      } catch (aiError) {
        console.error("AI regeneration failed, using fallback:", aiError);
        aiResponse = generateFallbackRoadmap({
          educationLevel: roadmapData.education_level,
          strongestSubjects: roadmapData.strongest_subjects,
          industriesOfInterest: roadmapData.interests,
          dreamCareer: roadmapData.dream_career,
          preferredPath: roadmapData.preferred_path,
          focusLevel: roadmapData.habits?.focus_level || 5,
          timeManagement: roadmapData.habits?.time_management || 5,
          studySupport: roadmapData.support_preferences,
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

      await fetchRoadmap();
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const downloadRoadmap = () => {
    toast({
      title: "Download Started",
      description: "Your roadmap PDF will be ready shortly.",
    });
    // TODO: Implement PDF generation
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <RefreshCw className='h-8 w-8 animate-spin text-primary' />
        <span className='ml-3 text-muted-foreground'>
          Loading your roadmap...
        </span>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <Card>
        <CardContent className='text-center py-12'>
          <Target className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-xl font-semibold text-foreground mb-2'>
            No Roadmap Found
          </h3>
          <p className='text-muted-foreground mb-4'>
            Complete the onboarding process to generate your personalized career
            roadmap.
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
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl md:text-3xl font-bold text-foreground flex items-center'>
            <Target className='h-7 w-7 mr-2 text-primary' />
            Your Career Roadmap
          </h2>
          <p className='text-muted-foreground mt-1'>
            Generated on{" "}
            {new Date(roadmapData.completed_at).toLocaleDateString()} for{" "}
            <span className='font-medium text-foreground'>
              {roadmapData.dream_career}
            </span>
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={regenerateRoadmap}
            disabled={isRegenerating}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRegenerating ? "animate-spin" : ""}`}
            />
            {isRegenerating ? "Regenerating..." : "Regenerate"}
          </Button>
          <Button variant='outline' onClick={downloadRoadmap}>
            <Download className='h-4 w-4 mr-2' />
            Export PDF
          </Button>
        </div>
      </div>

      {/* AI Generation Status Warning */}
      {roadmapData.ai_generation_status === "failed" && (
        <Card className='border-yellow-500 bg-yellow-50 dark:bg-yellow-950'>
          <CardContent className='p-4 flex items-start'>
            <AlertCircle className='h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0' />
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

      {/* AI Recommendation Summary */}
      <Card className='bg-gradient-hero text-white'>
        <CardHeader>
          <CardTitle className='flex items-center text-white'>
            <Lightbulb className='h-5 w-5 mr-2' />
            AI Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <div>
              <p className='text-sm text-white/80 mb-1'>Recommended Path</p>
              <p className='text-xl font-bold capitalize'>
                {roadmapData.ai_recommended_path.replace("_", " ")} Path
              </p>
            </div>
            <div className='bg-white/10 rounded-lg p-3'>
              <p className='text-white/90 text-sm'>{roadmapData.ai_roadmap}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-muted-foreground text-sm'>Total Duration</p>
                <p className='text-2xl font-bold text-foreground'>
                  {roadmapData.ai_roadmap_json.total_estimated_duration}
                </p>
              </div>
              <Calendar className='h-8 w-8 text-primary' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-muted-foreground text-sm'>
                  Total Investment
                </p>
                <p className='text-xl font-bold text-foreground'>
                  {formatCurrency(
                    roadmapData.ai_roadmap_json.total_estimated_cost_tzs
                  )}
                </p>
              </div>
              <DollarSign className='h-8 w-8 text-primary' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-muted-foreground text-sm'>Roadmap Phases</p>
                <p className='text-2xl font-bold text-foreground'>
                  {roadmapData.ai_roadmap_json.phases.length}
                </p>
              </div>
              <TrendingUp className='h-8 w-8 text-primary' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roadmap Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Calendar className='h-5 w-5 mr-2' />
            Your Step-by-Step Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-8'>
            {roadmapData.ai_roadmap_json.phases.map((phase, index) => (
              <div key={index} className='relative'>
                {/* Timeline connector */}
                {index !== roadmapData.ai_roadmap_json.phases.length - 1 && (
                  <div className='absolute left-6 top-14 bottom-0 w-0.5 bg-gradient-to-b from-primary to-primary/20' />
                )}

                <div className='flex items-start gap-4'>
                  {/* Phase number badge */}
                  <div className='flex-shrink-0 w-12 h-12 rounded-full bg-gradient-hero text-white flex items-center justify-center border-2 border-primary z-10 font-bold text-lg'>
                    {index + 1}
                  </div>

                  {/* Phase content */}
                  <div className='flex-1'>
                    <div className='bg-gradient-accent rounded-lg p-6 border border-border hover:border-primary transition-colors'>
                      <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4'>
                        <div>
                          <Badge variant='outline' className='mb-2'>
                            <Clock className='h-3 w-3 mr-1' />
                            {phase.timeline}
                          </Badge>
                          <h4 className='text-xl font-semibold text-foreground'>
                            {phase.title}
                          </h4>
                        </div>
                        <div className='text-left md:text-right'>
                          <div className='text-xs text-muted-foreground'>
                            Est. Cost
                          </div>
                          <div className='text-lg font-bold text-primary'>
                            {formatCurrency(phase.estimated_cost_tzs)}
                          </div>
                        </div>
                      </div>

                      {/* Milestones */}
                      <div className='mb-4'>
                        <h5 className='text-sm font-semibold mb-3 flex items-center text-foreground'>
                          <CheckCircle2 className='h-4 w-4 mr-2 text-primary' />
                          Key Milestones
                        </h5>
                        <div className='space-y-2'>
                          {phase.milestones.map((milestone, mIndex) => (
                            <div
                              key={mIndex}
                              className='flex items-start gap-2 text-sm'>
                              <ArrowRight className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                              <span className='text-muted-foreground'>
                                {milestone}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      <div>
                        <h5 className='text-sm font-semibold mb-3 flex items-center text-foreground'>
                          <BookMarked className='h-4 w-4 mr-2 text-primary' />
                          Recommended Resources
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

          {/* Total Investment Summary */}
          <div className='mt-8 p-6 bg-gradient-hero text-white rounded-lg'>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
              <div>
                <h4 className='text-lg font-semibold mb-1'>
                  Total Investment Required
                </h4>
                <p className='text-white/80 text-sm'>
                  Estimated total cost to complete your career journey
                </p>
              </div>
              <div className='text-3xl font-bold'>
                {formatCurrency(
                  roadmapData.ai_roadmap_json.total_estimated_cost_tzs
                )}
              </div>
            </div>
            <p className='text-xs text-white/60 mt-4'>
              * Costs are estimates based on current market rates in Tanzania
              and may vary
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps CTA */}
      <Card className='bg-gradient-card border-0'>
        <CardContent className='p-6 text-center'>
          <Star className='h-12 w-12 text-primary mx-auto mb-4' />
          <h3 className='text-xl font-semibold mb-2'>Ready to Take Action?</h3>
          <p className='text-muted-foreground mb-6'>
            Start working on your first milestone today and track your progress.
          </p>
          <div className='flex flex-wrap justify-center gap-3'>
            <Button className='bg-gradient-hero text-white'>
              <CheckCircle2 className='h-4 w-4 mr-2' />
              Start First Milestone
            </Button>
            <Button variant='outline'>
              <Calendar className='h-4 w-4 mr-2' />
              Schedule Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
