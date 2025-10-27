import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  TrendingUp,
  Users,
  Target,
  Heart,
  Zap,
  Lightbulb,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { AIAnalysisResult } from "@/types/types";

export const BehavioralInsight = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [aiData, setAiData] = useState<AIAnalysisResult | null>(null);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("career_assessments")
          .select("results")
          .eq("user_id", user.id)
          .eq("assessment_type", "personality")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        if (data?.results) {
          setAiData(data.results as AIAnalysisResult);
        }
      } catch (error) {
        console.error("Error fetching assessment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [user]);

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Brain className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  // Empty state - no assessment
  if (!aiData?.personalityProfile) {
    return (
      <Card className='max-w-2xl mx-auto mt-8'>
        <CardContent className='p-12 text-center space-y-6'>
          <div className='relative mx-auto w-24 h-24'>
            <div className='absolute inset-0 bg-primary/10 rounded-full animate-pulse' />
            <Brain className='h-24 w-24 text-primary/60' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-2xl font-bold'>No Behavioral Data</h3>
            <p className='text-muted-foreground'>
              Complete your career assessment to get insights into your
              personality traits and work style.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Extract data from AI analysis
  const personalityProfile = aiData.personalityProfile;
  const categoryScores = personalityProfile.categoryScores;
  const workStylePreferences = personalityProfile.workStylePreferences;
  const traits = personalityProfile.traits || [];
  const keyCharacteristics = personalityProfile.keyCharacteristics || [];

  // Map category scores to personality traits (Big Five-like)
  const personalityTraits = [
    {
      name: "Creativity & Innovation",
      score: Math.round(categoryScores.creativity || 0),
      description: "Ability to think outside the box and generate new ideas",
      category: "creative",
    },
    {
      name: "Analytical Thinking",
      score: Math.round(categoryScores.analytical_thinking || 0),
      description: "Systematic problem-solving and logical reasoning",
      category: "analytical",
    },
    {
      name: "Social Orientation",
      score: Math.round(categoryScores.social_orientation || 0),
      description: "Preference for working with people and collaboration",
      category: "social",
    },
    {
      name: "Leadership",
      score: Math.round(categoryScores.leadership || 0),
      description: "Natural ability to guide and motivate others",
      category: "leadership",
    },
    {
      name: "Adaptability",
      score: Math.round(categoryScores.adaptability || 0),
      description: "Flexibility in changing environments",
      category: "adaptable",
    },
    {
      name: "Organization",
      score: Math.round(categoryScores.organization || 0),
      description: "Structured approach to tasks and time management",
      category: "organized",
    },
  ].filter((trait) => trait.score > 0); // Only show traits with data

  // Work style strengths based on scores
  const workStyles = [
    {
      style: "Team Player",
      strength: Math.round(categoryScores.collaboration || 0),
      icon: Users,
      description: workStylePreferences?.preferredEnvironment || "",
    },
    {
      style: "Independent Worker",
      strength: Math.round(categoryScores.autonomy || 0),
      icon: Target,
      description: workStylePreferences?.decisionMaking || "",
    },
    {
      style: "Creative Thinker",
      strength: Math.round(categoryScores.divergent_thinking || 0),
      icon: Brain,
      description: workStylePreferences?.workPace || "",
    },
    {
      style: "Detail Oriented",
      strength: Math.round(categoryScores.focus_persistence || 0),
      icon: Zap,
      description: workStylePreferences?.communicationStyle || "",
    },
  ].filter((style) => style.strength > 0);

  // Generate recommendations from overall insights or key characteristics
  const recommendations = keyCharacteristics
    .slice(0, 4)
    .map((characteristic) => `${characteristic}`);

  // If no key characteristics, use career recommendations
  const fallbackRecommendations =
    aiData.careerRecommendations
      ?.slice(0, 4)
      .map(
        (career) =>
          `Consider ${career.careerPath} - ${career.reasoning.split(".")[0]}`
      ) || [];

  const displayRecommendations =
    recommendations.length > 0 ? recommendations : fallbackRecommendations;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <Brain className='h-8 w-8 text-primary' />
        <div>
          <h2 className='text-3xl font-bold'>Behavioral Insights</h2>
          <p className='text-muted-foreground'>
            AI-powered analysis of your personality and work preferences
          </p>
        </div>
      </div>

      {/* Personality Type Card */}
      <Card className='border-2 border-primary/20'>
        <CardContent className='p-6'>
          <div className='flex items-start gap-4'>
            <div className='p-3 rounded-full bg-primary/10'>
              <Brain className='h-8 w-8 text-primary' />
            </div>
            <div className='flex-1'>
              <h3 className='text-xl font-bold mb-2'>
                {personalityProfile.type}
              </h3>
              <p className='text-muted-foreground mb-3'>
                {personalityProfile.description}
              </p>
              <div className='flex flex-wrap gap-2'>
                {traits.map((trait, index) => (
                  <Badge key={index} variant='secondary'>
                    {trait}
                  </Badge>
                ))}
              </div>
              {personalityProfile.confidenceScore && (
                <div className='mt-4 flex items-center gap-2 text-sm text-muted-foreground'>
                  <Target className='h-4 w-4' />
                  <span>
                    AI Confidence: {personalityProfile.confidenceScore}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Personality Profile */}
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5' />
              Personality Dimensions
            </CardTitle>
            <CardDescription>
              Your unique behavioral profile across key dimensions
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {personalityTraits.map((trait) => (
              <div key={trait.name} className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <span className='font-medium'>{trait.name}</span>
                  <span className='text-sm text-muted-foreground'>
                    {trait.score}%
                  </span>
                </div>
                <Progress value={trait.score} className='h-2' />
                <p className='text-sm text-muted-foreground'>
                  {trait.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Work Style Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Heart className='h-5 w-5' />
              Work Style Strengths
            </CardTitle>
            <CardDescription>How you prefer to work</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {workStyles.map((style) => {
              const IconComponent = style.icon;
              return (
                <div key={style.style} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <IconComponent className='h-4 w-4 text-primary' />
                      <span className='text-sm font-medium'>{style.style}</span>
                    </div>
                    <Badge variant='secondary'>{style.strength}%</Badge>
                  </div>
                  {style.description && (
                    <p className='text-xs text-muted-foreground pl-6'>
                      {style.description}
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Team Dynamics */}
        {personalityProfile.teamDynamics &&
          personalityProfile.teamDynamics.length > 0 && (
            <Card className='md:col-span-2 lg:col-span-1'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Users className='h-5 w-5' />
                  Team Dynamics
                </CardTitle>
                <CardDescription>Your role in team settings</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3'>
                  {personalityProfile.teamDynamics.map((dynamic, index) => (
                    <li key={index} className='flex items-start gap-2 text-sm'>
                      <div className='h-1.5 w-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0' />
                      <span>{dynamic}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

        {/* Work Preferences */}
        {workStylePreferences && (
          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Lightbulb className='h-5 w-5' />
                Work Environment Preferences
              </CardTitle>
              <CardDescription>
                Ideal conditions for your productivity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='p-4 rounded-lg bg-muted/50 space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Environment
                  </p>
                  <p className='font-medium'>
                    {workStylePreferences.preferredEnvironment}
                  </p>
                </div>
                <div className='p-4 rounded-lg bg-muted/50 space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Communication
                  </p>
                  <p className='font-medium'>
                    {workStylePreferences.communicationStyle}
                  </p>
                </div>
                <div className='p-4 rounded-lg bg-muted/50 space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Decision Making
                  </p>
                  <p className='font-medium'>
                    {workStylePreferences.decisionMaking}
                  </p>
                </div>
                <div className='p-4 rounded-lg bg-muted/50 space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Work Pace
                  </p>
                  <p className='font-medium'>{workStylePreferences.workPace}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Career Recommendations */}
        {displayRecommendations.length > 0 && (
          <Card className='md:col-span-2 lg:col-span-3'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Target className='h-5 w-5' />
                Behavioral Recommendations
              </CardTitle>
              <CardDescription>
                Personalized suggestions based on your behavioral profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-3 md:grid-cols-2'>
                {displayRecommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className='flex items-start gap-2 p-3 rounded-lg bg-muted/50'>
                    <Target className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                    <p className='text-sm'>{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Metadata */}
      {aiData.metadata && (
        <Card className='border-primary/20'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Brain className='h-4 w-4' />
                <span>
                  Analysis generated on{" "}
                  {new Date(aiData.metadata.generatedAt).toLocaleDateString()}
                </span>
              </div>
              <Badge variant='secondary'>
                {aiData.metadata.confidenceScore}% Confidence
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
