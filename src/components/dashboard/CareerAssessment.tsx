import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const assessmentQuestions = [
  {
    id: 1,
    question: "I prefer working with people rather than data and numbers",
    category: "social"
  },
  {
    id: 2,
    question: "I enjoy solving complex problems step by step",
    category: "analytical"
  },
  {
    id: 3,
    question: "I like to create new ideas and think outside the box",
    category: "creative"
  },
  {
    id: 4,
    question: "I feel comfortable leading group discussions",
    category: "leadership"
  },
  {
    id: 5,
    question: "I prefer structured tasks with clear guidelines",
    category: "organized"
  },
  {
    id: 6,
    question: "I enjoy hands-on activities and practical work",
    category: "practical"
  },
  {
    id: 7,
    question: "I like helping others achieve their goals",
    category: "social"
  },
  {
    id: 8,
    question: "I'm comfortable with technology and digital tools",
    category: "technical"
  }
];

export default function CareerAssessment() {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPreviousAssessment();
  }, [user]);

  const loadPreviousAssessment = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('career_assessments')
        .select('*')
        .eq('user_id', user.id)
        .eq('assessment_type', 'personality')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setIsCompleted(true);
        setResults(data[0]);
      }
    } catch (error) {
      console.error('Error loading assessment:', error);
    }
  };

  const handleResponse = (questionId: number, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      submitAssessment();
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    try {
      const scores = calculateScores();
      const personality = determinePrimaryPersonality(scores);
      
      const { data, error } = await supabase
        .from('career_assessments')
        .insert({
          user_id: user?.id,
          assessment_type: 'personality',
          questions: assessmentQuestions,
          responses: responses,
          results: {
            scores,
            personality,
            completedAt: new Date().toISOString()
          },
          score: Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length)
        })
        .select()
        .single();

      if (error) throw error;

      setResults(data);
      setIsCompleted(true);
      toast.success('Assessment completed successfully!');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  };

  const calculateScores = () => {
    const categoryScores: Record<string, number[]> = {};
    
    assessmentQuestions.forEach(q => {
      const response = responses[q.id] || 0;
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = [];
      }
      categoryScores[q.category].push(response);
    });

    const averageScores: Record<string, number> = {};
    Object.entries(categoryScores).forEach(([category, scores]) => {
      averageScores[category] = scores.reduce((a, b) => a + b, 0) / scores.length;
    });

    return averageScores;
  };

  const determinePrimaryPersonality = (scores: Record<string, number>) => {
    const sortedScores = Object.entries(scores).sort(([,a], [,b]) => b - a);
    const primary = sortedScores[0][0];
    
    const personalityMap: Record<string, string> = {
      social: 'The Helper - People-focused and supportive',
      analytical: 'The Thinker - Logic-driven problem solver',
      creative: 'The Innovator - Original and imaginative',
      leadership: 'The Leader - Natural team organizer',
      organized: 'The Organizer - Structured and methodical',
      practical: 'The Doer - Hands-on and action-oriented',
      technical: 'The Technologist - Tech-savvy and digital'
    };

    return personalityMap[primary] || 'Balanced Profile';
  };

  const resetAssessment = () => {
    setIsCompleted(false);
    setCurrentQuestion(0);
    setResponses({});
    setResults(null);
  };

  if (isCompleted && results) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Assessment Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-accent rounded-lg">
                <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">
                  Your Personality Type: {results.results.personality}
                </h3>
                <p className="text-muted-foreground">Overall Score: {results.score}%</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(results.results.scores).map(([category, score]) => (
                  <Card key={category}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="capitalize font-medium">{category}</span>
                        <span className="text-sm text-muted-foreground">{Math.round(score as number)}%</span>
                      </div>
                      <Progress value={score as number} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button onClick={resetAssessment} variant="outline" className="w-full">
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Career Personality Assessment
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Progress value={(currentQuestion / assessmentQuestions.length) * 100} className="flex-1" />
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} of {assessmentQuestions.length}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center p-6">
              <h3 className="text-lg font-medium mb-4">
                {assessmentQuestions[currentQuestion].question}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 max-w-md mx-auto">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    variant={responses[assessmentQuestions[currentQuestion].id] === value ? "default" : "outline"}
                    onClick={() => handleResponse(assessmentQuestions[currentQuestion].id, value)}
                    className="h-12"
                  >
                    {value}
                  </Button>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              <Button
                onClick={nextQuestion}
                disabled={!responses[assessmentQuestions[currentQuestion].id] || loading}
              >
                {loading ? 'Processing...' : currentQuestion === assessmentQuestions.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}