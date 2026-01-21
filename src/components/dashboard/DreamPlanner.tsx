import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Target,
  Sparkles,
  RefreshCw,
  Edit,
  Save,
  X,
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Heart,
  Brain,
  Star,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  generateAIRoadmap,
  generateFallbackRoadmap,
} from "@/services/aiRoadmapService";

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
  completed_at: string;
}

export default function DreamPlanner() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newDream, setNewDream] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchDreamData();
  }, [user]);

  const fetchDreamData = async () => {
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
        setOnboardingData(data as OnboardingData);
        setNewDream(data.dream_career);
      }
    } catch (error) {
      console.error("Error fetching dream data:", error);
      toast({
        title: "Error",
        description: "Failed to load your dream career data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewDream(onboardingData?.dream_career || "");
  };

  const updateDreamAndRoadmap = async () => {
    if (!onboardingData || !user || !newDream.trim()) return;

    // Check if dream actually changed
    if (newDream.trim() === onboardingData.dream_career.trim()) {
      toast({
        title: "No Changes",
        description: "Your dream career hasn't changed.",
      });
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);

    try {
      toast({
        title: "Updating Your Dream...",
        description:
          "AI is generating a new roadmap for your updated dream career.",
      });

      // Generate new AI roadmap with updated dream
      let aiResponse;
      let aiGenerationStatus = "completed";

      try {
        aiResponse = await generateAIRoadmap({
          educationLevel: onboardingData.education_level,
          strongestSubjects: onboardingData.strongest_subjects,
          industriesOfInterest: onboardingData.interests,
          dreamCareer: newDream.trim(),
          preferredPath: onboardingData.preferred_path,
          focusLevel: onboardingData.habits?.focus_level || 5,
          timeManagement: onboardingData.habits?.time_management || 5,
          studySupport: onboardingData.support_preferences,
        }, user.id);
      } catch (aiError) {
        console.error("AI generation failed, using fallback:", aiError);
        aiResponse = generateFallbackRoadmap({
          educationLevel: onboardingData.education_level,
          strongestSubjects: onboardingData.strongest_subjects,
          industriesOfInterest: onboardingData.interests,
          dreamCareer: newDream.trim(),
          preferredPath: onboardingData.preferred_path,
          focusLevel: onboardingData.habits?.focus_level || 5,
          timeManagement: onboardingData.habits?.time_management || 5,
          studySupport: onboardingData.support_preferences,
        });
        aiGenerationStatus = "failed";
      }

      // Update database with new dream and regenerated roadmap
      const { error } = await supabase
        .from("onboarding_responses")
        .update({
          dream_career: newDream.trim(),
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
        title: "Dream Updated! ✨",
        description:
          "Your new career dream and personalized roadmap are ready.",
      });

      setIsEditing(false);
      await fetchDreamData();
    } catch (error) {
      console.error("Error updating dream:", error);
      toast({
        title: "Error",
        description: "Failed to update your dream. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <RefreshCw className='h-8 w-8 animate-spin text-primary' />
        <span className='ml-3 text-muted-foreground'>
          Loading your dream...
        </span>
      </div>
    );
  }

  if (!onboardingData) {
    return (
      <Card>
        <CardContent className='text-center py-12'>
          <Target className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-xl font-semibold text-foreground mb-2'>
            No Dream Career Found
          </h3>
          <p className='text-muted-foreground mb-4'>
            Complete the onboarding process to set your dream career.
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
            <Heart className='h-7 w-7 mr-2 text-primary' />
            My Life Dream
          </h2>
          <p className='text-muted-foreground mt-1'>
            Your career aspirations and life goals
          </p>
        </div>
      </div>

      {/* Inspirational Quote */}
      <Card className='bg-gradient-hero text-white border-0'>
        <CardContent className='p-6'>
          <div className='flex items-start gap-4'>
            <Sparkles className='h-8 w-8 flex-shrink-0 mt-1' />
            <div>
              <p className='text-lg italic mb-2'>
                "The future belongs to those who believe in the beauty of their
                dreams."
              </p>
              <p className='text-sm text-white/80'>- Eleanor Roosevelt</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Dream Career */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center'>
              <Target className='h-5 w-5 mr-2' />
              Your Dream Career
            </div>
            {!isEditing && (
              <Button variant='outline' size='sm' onClick={handleEditClick}>
                <Edit className='h-4 w-4 mr-2' />
                Update Dream
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {!isEditing ? (
            <div className='space-y-4'>
              <div className='bg-gradient-accent p-6 rounded-lg border border-primary/20'>
                <div className='flex items-center gap-3 mb-2'>
                  <Star className='h-6 w-6 text-primary' />
                  <h3 className='text-2xl font-bold text-foreground'>
                    {onboardingData.dream_career}
                  </h3>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Set on{" "}
                  {new Date(onboardingData.completed_at).toLocaleDateString()}
                </p>
              </div>

              {/* Dream Alignment */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-base flex items-center'>
                      <Brain className='h-4 w-4 mr-2' />
                      Your Personality
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>
                      {onboardingData.ai_personality_summary}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-base flex items-center'>
                      <TrendingUp className='h-4 w-4 mr-2' />
                      Recommended Path
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant='secondary' className='capitalize mb-2'>
                      {onboardingData.ai_recommended_path.replace("_", " ")}{" "}
                      Path
                    </Badge>
                    <p className='text-xs text-muted-foreground'>
                      Best suited for your profile and goals
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Interests & Strengths */}
              <div>
                <h4 className='font-semibold text-foreground mb-3 flex items-center'>
                  <Lightbulb className='h-4 w-4 mr-2' />
                  Your Interests & Strengths
                </h4>
                <div className='space-y-3'>
                  <div>
                    <p className='text-sm text-muted-foreground mb-2'>
                      Industries:
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {onboardingData.interests.map((interest, index) => (
                        <Badge key={index} variant='outline'>
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground mb-2'>
                      Strongest Subjects:
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {onboardingData.strongest_subjects.map(
                        (subject, index) => (
                          <Badge key={index} variant='default'>
                            {subject}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='space-y-4'>
              <div>
                <Label
                  htmlFor='dream-career'
                  className='text-base font-semibold'>
                  Update Your Dream Career
                </Label>
                <p className='text-sm text-muted-foreground mb-3'>
                  Changing your dream will regenerate your entire career roadmap
                  with AI.
                </p>
                <Textarea
                  id='dream-career'
                  value={newDream}
                  onChange={(e) => setNewDream(e.target.value)}
                  placeholder='e.g., Software Engineer, Doctor, Entrepreneur, Teacher...'
                  className='min-h-[100px]'
                  disabled={isUpdating}
                />
              </div>

              <div className='bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                <div className='flex items-start gap-3'>
                  <Lightbulb className='h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0' />
                  <div>
                    <h5 className='font-medium text-blue-900 dark:text-blue-100 mb-1'>
                      What happens when you update?
                    </h5>
                    <ul className='text-sm text-blue-800 dark:text-blue-200 space-y-1'>
                      <li className='flex items-start gap-2'>
                        <CheckCircle2 className='h-4 w-4 mt-0.5 flex-shrink-0' />
                        AI analyzes your new dream career
                      </li>
                      <li className='flex items-start gap-2'>
                        <CheckCircle2 className='h-4 w-4 mt-0.5 flex-shrink-0' />
                        New personalized roadmap is generated
                      </li>
                      <li className='flex items-start gap-2'>
                        <CheckCircle2 className='h-4 w-4 mt-0.5 flex-shrink-0' />
                        Updated milestones and resource recommendations
                      </li>
                      <li className='flex items-start gap-2'>
                        <CheckCircle2 className='h-4 w-4 mt-0.5 flex-shrink-0' />
                        Fresh cost and timeline estimates
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className='flex gap-3'>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className='bg-gradient-hero text-white'
                      disabled={isUpdating || !newDream.trim()}>
                      {isUpdating ? (
                        <>
                          <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className='h-4 w-4 mr-2' />
                          Save & Regenerate Roadmap
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Dream Update</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will update your dream career from{" "}
                        <strong>"{onboardingData.dream_career}"</strong> to{" "}
                        <strong>"{newDream}"</strong> and regenerate your entire
                        career roadmap with AI. This process may take a few
                        seconds.
                        <br />
                        <br />
                        Are you sure you want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={updateDreamAndRoadmap}
                        className='bg-gradient-hero text-white'>
                        Yes, Update My Dream
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  variant='outline'
                  onClick={handleCancelEdit}
                  disabled={isUpdating}>
                  <X className='h-4 w-4 mr-2' />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dream Journey Progress */}
      {!isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <TrendingUp className='h-5 w-5 mr-2' />
              Your Journey Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>
                  Overall Career Readiness
                </span>
                <span className='text-sm font-medium'>35%</span>
              </div>
              <div className='w-full bg-secondary rounded-full h-3'>
                <div
                  className='bg-gradient-hero h-3 rounded-full transition-all duration-500'
                  style={{ width: "35%" }}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
                <div className='text-center p-4 bg-gradient-accent rounded-lg'>
                  <div className='text-2xl font-bold text-primary'>0/4</div>
                  <div className='text-sm text-muted-foreground'>
                    Phases Completed
                  </div>
                </div>
                <div className='text-center p-4 bg-gradient-accent rounded-lg'>
                  <div className='text-2xl font-bold text-primary'>0</div>
                  <div className='text-sm text-muted-foreground'>
                    Skills Acquired
                  </div>
                </div>
                <div className='text-center p-4 bg-gradient-accent rounded-lg'>
                  <div className='text-2xl font-bold text-primary'>TZS 0</div>
                  <div className='text-sm text-muted-foreground'>
                    Invested So Far
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      {!isEditing && (
        <Card className='bg-gradient-card border-0'>
          <CardContent className='p-6 text-center'>
            <Sparkles className='h-12 w-12 text-primary mx-auto mb-4' />
            <h3 className='text-xl font-semibold mb-2'>
              Ready to Take the Next Step?
            </h3>
            <p className='text-muted-foreground mb-6'>
              View your detailed roadmap and start working on your first
              milestone.
            </p>
            <Button className='bg-gradient-hero text-white'>
              <ArrowRight className='h-4 w-4 mr-2' />
              View My Roadmap
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
