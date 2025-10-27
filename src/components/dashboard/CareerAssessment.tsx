import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  assessmentQuestions,
  questionCategories,
  responseScale,
  getCategoryProgress,
  calculateCategoryScores,
} from "@/data/assessmentQuestions";
import type {
  AssessmentQuestion,
  AssessmentResponses,
  AIAnalysisResult,
  CareerAssessment as CareerAssessmentType,
} from "@/types/types";

export default function CareerAssessment() {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponses>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<CareerAssessmentType | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeAssessment = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SUPABASE_URL
        }/functions/v1/analyze-career-assessment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              (
                await supabase.auth.getSession()
              ).data.session?.access_token
            }`,
          },
          body: JSON.stringify({
            questions: assessmentQuestions,
            responses,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const { data, error } = await response.json();
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error("Analysis error:", error);
      throw error;
    }
  };

  const loadPreviousAssessment = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("career_assessments")
        .select(
          `
          *,
          personality_profiles (*),
          user_strengths_weaknesses (*)
        `
        )
        .eq("user_id", user.id)
        .eq("assessment_type", "personality")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        setIsCompleted(true);
        setResults(data);
      }
    } catch (error) {
      console.error("Error loading assessment:", error);
    }
  };

  useEffect(() => {
    loadPreviousAssessment();
  }, [user]);

  const handleResponse = (questionId: number, value: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      submitAssessment();
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    try {
      // Get AI analysis
      const analysisResult = await analyzeAssessment();

      // Save complete assessment with AI analysis
      const { data, error } = await supabase
        .from("career_assessments")
        .insert({
          user_id: user?.id,
          assessment_type: "personality",
          version: 1,
          questions: assessmentQuestions,
          responses: responses,
          results: analysisResult.analysis,
          score: analysisResult.analysis.metadata.confidenceScore,
          confidence_score: analysisResult.analysis.metadata.confidenceScore,
          status: "completed",
          processing_time: analysisResult.processingTime,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setResults(data);
      setIsCompleted(true);
      toast.success("Assessment completed and analyzed successfully!");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Failed to complete assessment analysis");
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setIsCompleted(false);
    setCurrentQuestion(0);
    setResponses({});
    setResults(null);
  };

  if (isCompleted && results) {
    const analysis = results.results as AIAnalysisResult;

    if (!analysis?.personalityProfile) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Old Assessment Format</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Please retake the assessment to get AI-powered insights.
            </p>
            <Button onClick={resetAssessment} className='w-full'>
              Start New AI Assessment
            </Button>
          </CardContent>
        </Card>
      );
    }

     return (
       <div className='space-y-6'>
         <Card>
           <CardHeader>
             <CardTitle className='flex items-center'>
               <CheckCircle className='h-5 w-5 mr-2 text-green-500' />
               Career Assessment Analysis
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className='space-y-6'>
               <div className='text-center p-6 bg-gradient-accent rounded-lg'>
                 <Brain className='h-12 w-12 mx-auto mb-4 text-primary' />
                 <h3 className='text-xl font-semibold mb-2'>
                   {analysis.personalityProfile.type}
                 </h3>
                 <p className='text-muted-foreground mb-4'>
                   {analysis.personalityProfile.description}
                 </p>
                 <Badge variant='secondary'>
                   Confidence Score: {analysis.metadata.confidenceScore}%
                 </Badge>
               </div>

               <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                 <Card>
                   <CardHeader>
                     <CardTitle className='text-lg'>Key Strengths</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <ul className='space-y-2'>
                       {analysis.strengths.map((strength, idx) => (
                         <li key={idx} className='flex items-center gap-2'>
                           <TrendingUp className='h-4 w-4 text-green-500' />
                           <span>{strength.name}</span>
                         </li>
                       ))}
                     </ul>
                   </CardContent>
                 </Card>

                 <Card>
                   <CardHeader>
                     <CardTitle className='text-lg'>
                       Development Areas
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <ul className='space-y-2'>
                       {analysis.developmentGoals.map((goal, idx) => (
                         <li key={idx} className='flex items-center gap-2'>
                           <Clock className='h-4 w-4 text-blue-500' />
                           <span>{goal.goal}</span>
                         </li>
                       ))}
                     </ul>
                   </CardContent>
                 </Card>
               </div>

               <Card>
                 <CardHeader>
                   <CardTitle className='text-lg'>
                     Career Recommendations
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className='grid gap-4'>
                     {analysis.careerRecommendations.map((career, idx) => (
                       <div key={idx} className='p-4 rounded-lg border'>
                         <h4 className='font-medium mb-2'>
                           {career.careerPath}
                         </h4>
                         <p className='text-sm text-muted-foreground'>
                           {career.reasoning}
                         </p>
                         <div className='mt-2'>
                           <Badge variant='secondary'>
                             Match Score: {career.matchScore}%
                           </Badge>
                         </div>
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>

               <Button
                 onClick={resetAssessment}
                 variant='outline'
                 className='w-full'>
                 Retake Assessment
               </Button>
             </div>
           </CardContent>
         </Card>
       </div>
     );
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Brain className='h-5 w-5 mr-2' />
            Career Personality Assessment
          </CardTitle>
          <div className='flex items-center space-x-4'>
            <Progress
              value={(currentQuestion / assessmentQuestions.length) * 100}
              className='flex-1'
            />
            <span className='text-sm text-muted-foreground'>
              {currentQuestion + 1} of {assessmentQuestions.length}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <div className='text-center p-6'>
              <h3 className='text-lg font-medium mb-4'>
                {assessmentQuestions[currentQuestion].question}
              </h3>

              <div className='grid grid-cols-1 sm:grid-cols-5 gap-2 max-w-md mx-auto'>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    variant={
                      responses[assessmentQuestions[currentQuestion].id] ===
                      value
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleResponse(
                        assessmentQuestions[currentQuestion].id,
                        value
                      )
                    }
                    className='h-12'>
                    {value}
                  </Button>
                ))}
              </div>

              <div className='flex justify-between text-xs text-muted-foreground mt-2'>
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
            </div>

            <div className='flex justify-between'>
              <Button
                variant='outline'
                onClick={() =>
                  setCurrentQuestion((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestion === 0}>
                Previous
              </Button>

              <Button
                onClick={nextQuestion}
                disabled={
                  !responses[assessmentQuestions[currentQuestion].id] || loading
                }>
                {loading
                  ? "Processing..."
                  : currentQuestion === assessmentQuestions.length - 1
                  ? "Complete"
                  : "Next"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
