import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  AlertTriangle,
  Target,
  TrendingUp,
  Brain,
  Heart,
  Users,
  Lightbulb,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { AIAnalysisResult } from "@/types/types";

export const StrengthWeakness = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [aiData, setAiData] = useState<AIAnalysisResult | null>(null);

  // Fetch AI assessment data
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

  // Show loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Brain className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  // Show empty state if no AI data
  if (!aiData?.strengths || !aiData?.weaknesses) {
    return (
      <Card className='max-w-2xl mx-auto mt-8'>
        <CardContent className='p-12 text-center space-y-6'>
          <div className='relative mx-auto w-24 h-24'>
            <div className='absolute inset-0 bg-primary/10 rounded-full animate-pulse' />
            <Brain className='h-24 w-24 text-primary/60' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-2xl font-bold'>No Assessment Data</h3>
            <p className='text-muted-foreground'>
              Complete your career assessment to see your personalized
              strengths, weaknesses, and development goals.
            </p>
          </div>
          <Button onClick={() => (window.location.href = "/assessment")}>
            Take Career Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Use AI data
  const strengths = aiData.strengths;
  const weaknesses = aiData.weaknesses;
  const developmentGoals = aiData.developmentGoals || [];

  const strengthCategories = {
    Cognitive: { icon: Brain, color: "text-blue-500" },
    Interpersonal: { icon: Users, color: "text-green-500" },
    Behavioral: { icon: Heart, color: "text-purple-500" },
    Leadership: { icon: Target, color: "text-orange-500" },
    Technical: { icon: Zap, color: "text-yellow-500" },
    Creative: { icon: Lightbulb, color: "text-pink-500" },
    Organizational: { icon: Target, color: "text-indigo-500" },
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <Zap className='h-8 w-8 text-primary' />
        <div>
          <h2 className='text-3xl font-bold'>Strengths & Weaknesses</h2>
          <p className='text-muted-foreground'>
            AI-powered insights for professional growth
          </p>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* STRENGTHS CARD */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Zap className='h-5 w-5 text-green-500' />
              Your Strengths
            </CardTitle>
            <CardDescription>
              AI-identified core competencies that set you apart
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {strengths.map((strength, index) => {
              const categoryInfo = strengthCategories[
                strength.category as keyof typeof strengthCategories
              ] || {
                icon: Brain,
                color: "text-gray-500",
              };
              const IconComponent = categoryInfo.icon;

              return (
                <div
                  key={index}
                  className='p-4 rounded-lg border bg-green-50/50 border-green-200'>
                  <div className='flex justify-between items-start mb-3'>
                    <div className='flex items-center gap-2'>
                      <IconComponent
                        className={`h-4 w-4 ${categoryInfo.color}`}
                      />
                      <h4 className='font-semibold'>{strength.name}</h4>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge variant='secondary' className='text-xs'>
                        {strength.category}
                      </Badge>
                      <Badge
                        variant={
                          strength.impact === "High" ? "default" : "secondary"
                        }
                        className='text-xs'>
                        {strength.impact} Impact
                      </Badge>
                    </div>
                  </div>

                  <p className='text-sm text-muted-foreground mb-3'>
                    {strength.description}
                  </p>

                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span>Proficiency Level</span>
                      <span>{strength.level}%</span>
                    </div>
                    <Progress value={strength.level} className='h-2' />
                  </div>

                  {strength.evidence && strength.evidence.length > 0 && (
                    <div className='mt-3'>
                      <p className='text-xs text-muted-foreground mb-1'>
                        Evidence:
                      </p>
                      <ul className='text-xs space-y-1'>
                        {strength.evidence.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className='flex items-start gap-2'>
                            <div className='h-1 w-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0' />
                            <span className='flex-1'>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {strength.careerRelevance && (
                    <div className='mt-3 p-2 bg-green-100/50 rounded text-xs'>
                      <p className='font-medium mb-1'>Career Relevance:</p>
                      <p className='text-muted-foreground'>
                        {strength.careerRelevance}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* WEAKNESSES CARD */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-orange-500' />
              Areas for Improvement
            </CardTitle>
            <CardDescription>
              AI-identified development opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {weaknesses.map((weakness, index) => (
              <div
                key={index}
                className='p-4 rounded-lg border bg-orange-50/50 border-orange-200'>
                <div className='flex justify-between items-start mb-3'>
                  <h4 className='font-semibold'>{weakness.name}</h4>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline' className='text-xs'>
                      {weakness.category}
                    </Badge>
                    <Badge
                      variant={
                        weakness.impact === "High" ? "destructive" : "secondary"
                      }
                      className='text-xs'>
                      {weakness.impact} Impact
                    </Badge>
                  </div>
                </div>

                <p className='text-sm text-muted-foreground mb-3'>
                  {weakness.description}
                </p>

                {weakness.rootCause && (
                  <div className='mb-3 p-2 bg-orange-100/50 rounded text-xs'>
                    <p className='font-medium mb-1'>Root Cause:</p>
                    <p className='text-muted-foreground'>
                      {weakness.rootCause}
                    </p>
                  </div>
                )}

                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Current Level</span>
                    <span>{weakness.level}%</span>
                  </div>
                  <Progress value={weakness.level} className='h-2' />
                </div>

                {weakness.improvementPlan && (
                  <div className='mt-3'>
                    <p className='text-xs font-medium mb-2'>
                      Improvement Plan:
                    </p>

                    {weakness.improvementPlan.actions &&
                      weakness.improvementPlan.actions.length > 0 && (
                        <div className='mb-2'>
                          <p className='text-xs text-muted-foreground mb-1'>
                            Actions:
                          </p>
                          <ul className='text-xs space-y-1'>
                            {weakness.improvementPlan.actions.map(
                              (action, actionIndex) => (
                                <li
                                  key={actionIndex}
                                  className='flex items-start gap-2'>
                                  <div className='h-1 w-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0' />
                                  <span className='flex-1'>{action}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {weakness.improvementPlan.timeline && (
                      <Badge variant='outline' className='text-xs'>
                        Timeline: {weakness.improvementPlan.timeline}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* DEVELOPMENT GOALS CARD */}
      {developmentGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5' />
              Development Goals
            </CardTitle>
            <CardDescription>
              AI-recommended goals for your career advancement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 lg:grid-cols-3'>
              {developmentGoals.map((goal, index) => (
                <div key={index} className='p-4 rounded-lg border space-y-3'>
                  <div className='flex justify-between items-start'>
                    <h4 className='font-semibold text-sm'>{goal.goal}</h4>
                    <Badge
                      variant={
                        goal.priority === "High"
                          ? "destructive"
                          : goal.priority === "Medium"
                          ? "default"
                          : "secondary"
                      }
                      className='text-xs'>
                      {goal.priority}
                    </Badge>
                  </div>

                  <div className='text-sm text-muted-foreground'>
                    Target: {goal.timeline}
                  </div>

                  {goal.progress !== undefined && (
                    <div className='space-y-2'>
                      <div className='flex justify-between text-sm'>
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className='h-2' />
                    </div>
                  )}

                  {goal.actions && goal.actions.length > 0 && (
                    <div className='space-y-1'>
                      <p className='text-xs text-muted-foreground'>
                        Action Items:
                      </p>
                      <ul className='text-xs space-y-1'>
                        {goal.actions.map((action, actionIndex) => (
                          <li
                            key={actionIndex}
                            className='flex items-start gap-2'>
                            <div className='h-1 w-1 bg-primary rounded-full mt-1.5 flex-shrink-0' />
                            <span className='flex-1'>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI CONFIDENCE SCORE */}
      {aiData.metadata && (
        <Card className='border-primary/20'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Brain className='h-5 w-5 text-primary' />
                <span className='text-sm font-medium'>
                  AI Analysis Confidence
                </span>
              </div>
              <Badge variant='secondary'>
                {aiData.metadata.confidenceScore}% Accurate
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
