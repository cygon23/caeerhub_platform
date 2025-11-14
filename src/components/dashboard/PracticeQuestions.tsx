import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileQuestion,
  CheckCircle,
  XCircle,
  RefreshCw,
  Sparkles,
  Clock,
  TrendingUp,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Question {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'short_answer' | 'essay';
  difficulty_level: 'easy' | 'medium' | 'hard';
  options?: string[];
  correct_answer: string;
  explanation?: string;
  source_reference?: string;
  subject: string;
}

interface QuestionAttempt {
  isAnswered: boolean;
  selectedAnswer: string;
  isCorrect?: boolean;
  timeSpent: number;
}

export default function PracticeQuestions() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attempts, setAttempts] = useState<Record<string, QuestionAttempt>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAttempt = currentQuestion ? attempts[currentQuestion.id] : null;

  useEffect(() => {
    fetchAvailableSubjects();
  }, [user]);

  useEffect(() => {
    if (selectedSubject) {
      fetchQuestions();
    }
  }, [selectedSubject, difficultyLevel]);

  useEffect(() => {
    if (currentQuestion) {
      setStartTime(Date.now());
      setShowExplanation(false);
    }
  }, [currentQuestionIndex]);

  const fetchAvailableSubjects = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('study_materials')
        .select('subject')
        .eq('user_id', user.id)
        .eq('ai_processed', true);

      if (error) throw error;

      const uniqueSubjects = [...new Set(data.map((m) => m.subject))];
      setSubjects(uniqueSubjects);
      
      if (uniqueSubjects.length > 0 && !selectedSubject) {
        setSelectedSubject(uniqueSubjects[0]);
      }
    } catch (error: any) {
      console.error('Error fetching subjects:', error);
      toast({
        title: "Error",
        description: "Failed to load subjects.",
        variant: "destructive",
      });
    }
  };

  const fetchQuestions = async () => {
    if (!user?.id || !selectedSubject) return;

    setIsLoading(true);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAttempts({});

    try {
      const { data, error } = await supabase
        .from('practice_questions')
        .select('*')
        .eq('user_id', user.id)
        .eq('subject', selectedSubject)
        .eq('difficulty_level', difficultyLevel)
        .limit(10);

      if (error) throw error;

      if (data && data.length > 0) {
        setQuestions(data);
        toast({
          title: "Questions Loaded",
          description: `Found ${data.length} ${difficultyLevel} questions for ${selectedSubject}.`,
        });
      } else {
        // No questions found, prompt to generate
        toast({
          title: "No Questions Available",
          description: `Generate ${difficultyLevel} questions for ${selectedSubject} to get started.`,
        });
      }
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuestions = async () => {
    if (!user?.id || !selectedSubject) return;

    setIsGenerating(true);

    try {
      // Get a random material for this subject
      const { data: materials, error: materialsError } = await supabase
        .from('study_materials')
        .select('id')
        .eq('user_id', user.id)
        .eq('subject', selectedSubject)
        .eq('ai_processed', true)
        .limit(1);

      if (materialsError) throw materialsError;

      if (!materials || materials.length === 0) {
        toast({
          title: "No Materials Found",
          description: `Please upload and process ${selectedSubject} materials first.`,
          variant: "destructive",
        });
        return;
      }

      const materialId = materials[0].id;

      // Determine question type based on difficulty
      const questionType = 
        difficultyLevel === 'easy' ? 'multiple_choice' :
        difficultyLevel === 'medium' ? 'short_answer' : 'essay';

      toast({
        title: "Generating Questions",
        description: "AI is creating personalized questions from your materials...",
      });

      const { data, error } = await supabase.functions.invoke('generate-practice-questions', {
        body: {
          user_id: user.id,
          material_id: materialId,
          subject: selectedSubject,
          difficulty_level: difficultyLevel,
          question_type: questionType,
          count: 10,
        },
      });

      if (error) throw error;

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentQuestionIndex(0);
        setAttempts({});
        
        toast({
          title: "Questions Generated!",
          description: `Created ${data.questions.length} new ${difficultyLevel} questions.`,
          icon: <Sparkles className="h-5 w-5" />,
        });
      }
    } catch (error: any) {
      console.error('Error generating questions:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (answer: string) => {
    if (!currentQuestion || currentAttempt?.isAnswered) return;

    setAttempts({
      ...attempts,
      [currentQuestion.id]: {
        isAnswered: false,
        selectedAnswer: answer,
        timeSpent: Math.floor((Date.now() - startTime) / 1000),
      },
    });
  };

  const submitAnswer = async () => {
    if (!currentQuestion || !currentAttempt?.selectedAnswer) {
      toast({
        title: "No Answer Selected",
        description: "Please select or enter an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const isCorrect = checkAnswer(currentAttempt.selectedAnswer, currentQuestion.correct_answer);

    // Update local state
    setAttempts({
      ...attempts,
      [currentQuestion.id]: {
        ...currentAttempt,
        isAnswered: true,
        isCorrect,
        timeSpent,
      },
    });

    setShowExplanation(true);

    // Save to database
    try {
      const { error } = await supabase
        .from('question_attempts')
        .insert({
          user_id: user.id,
          question_id: currentQuestion.id,
          student_answer: currentAttempt.selectedAnswer,
          is_correct: isCorrect,
          time_spent_seconds: timeSpent,
        });

      if (error) throw error;

      toast({
        title: isCorrect ? "Correct! 🎉" : "Incorrect",
        description: isCorrect 
          ? "Great job! Keep up the good work." 
          : "Don't worry, check the explanation to learn.",
        variant: isCorrect ? "default" : "destructive",
      });
    } catch (error: any) {
      console.error('Error saving attempt:', error);
    }
  };

  const checkAnswer = (studentAnswer: string, correctAnswer: string): boolean => {
    // For multiple choice, exact match
    if (currentQuestion.question_type === 'multiple_choice') {
      return studentAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    }
    
    // For short answer and essay, more lenient comparison
    const studentWords = studentAnswer.toLowerCase().trim().split(/\s+/);
    const correctWords = correctAnswer.toLowerCase().trim().split(/\s+/);
    
    // Check if at least 50% of correct answer words are in student answer
    const matchCount = correctWords.filter(word => studentWords.includes(word)).length;
    return matchCount / correctWords.length >= 0.5;
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[difficulty as keyof typeof colors];
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels = {
      multiple_choice: "Multiple Choice",
      short_answer: "Short Answer",
      essay: "Essay Question",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const calculateProgress = () => {
    const answeredCount = Object.values(attempts).filter(a => a.isAnswered).length;
    return questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  };

  if (subjects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileQuestion className="h-5 w-5 mr-2" />
            Practice Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Study Materials Yet</h3>
            <p className="text-muted-foreground mb-6">
              Upload and process study materials first to generate practice questions.
            </p>
            <Button onClick={() => window.location.href = '#upload-materials'}>
              Upload Materials
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <FileQuestion className="h-5 w-5 mr-2" />
              Practice Questions
            </span>
            <Button
              onClick={generateQuestions}
              disabled={isGenerating || !selectedSubject}
              size="sm"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate New Questions
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Tabs value={difficultyLevel} onValueChange={(v) => setDifficultyLevel(v as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="easy">Easy</TabsTrigger>
                  <TabsTrigger value="medium">Medium</TabsTrigger>
                  <TabsTrigger value="hard">Hard</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {questions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Progress: {Object.values(attempts).filter(a => a.isAnswered).length} / {questions.length}
                </span>
                <span className="text-muted-foreground">
                  {Math.round(calculateProgress())}% Complete
                </span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question Display */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading questions...</p>
            </div>
          </CardContent>
        </Card>
      ) : questions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileQuestion className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Questions Available</h3>
              <p className="text-muted-foreground mb-6">
                Click "Generate New Questions" to create practice questions from your materials.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : currentQuestion && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
                <Badge className={getDifficultyColor(currentQuestion.difficulty_level)}>
                  {currentQuestion.difficulty_level}
                </Badge>
                <Badge variant="secondary">
                  {getQuestionTypeLabel(currentQuestion.question_type)}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {currentAttempt?.timeSpent || 0}s
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Text */}
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg font-medium">{currentQuestion.question_text}</p>
            </div>

            {/* Answer Input */}
            {!currentAttempt?.isAnswered && (
              <div className="space-y-4">
                {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
                  <RadioGroup
                    value={currentAttempt?.selectedAnswer || ""}
                    onValueChange={handleAnswerChange}
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.question_type === 'short_answer' && (
                  <Textarea
                    placeholder="Type your answer here..."
                    value={currentAttempt?.selectedAnswer || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    rows={3}
                  />
                )}

                {currentQuestion.question_type === 'essay' && (
                  <Textarea
                    placeholder="Write your essay answer here..."
                    value={currentAttempt?.selectedAnswer || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    rows={8}
                  />
                )}

                <Button
                  onClick={submitAnswer}
                  disabled={!currentAttempt?.selectedAnswer}
                  className="w-full"
                >
                  Submit Answer
                </Button>
              </div>
            )}

            {/* Feedback */}
            {currentAttempt?.isAnswered && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${
                  currentAttempt.isCorrect
                    ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                    : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {currentAttempt.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-semibold">
                      {currentAttempt.isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    <strong>Your answer:</strong> {currentAttempt.selectedAnswer}
                  </p>
                  {!currentAttempt.isCorrect && (
                    <p className="text-sm">
                      <strong>Correct answer:</strong> {currentQuestion.correct_answer}
                    </p>
                  )}
                </div>

                {showExplanation && currentQuestion.explanation && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Explanation</span>
                    </div>
                    <p className="text-sm">{currentQuestion.explanation}</p>
                    {currentQuestion.source_reference && (
                      <p className="text-xs text-muted-foreground mt-2">
                        <strong>Reference:</strong> {currentQuestion.source_reference}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next Question
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {questions.length > 0 && Object.values(attempts).filter(a => a.isAnswered).length === questions.length && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Practice Session Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {Object.values(attempts).filter(a => a.isCorrect).length}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold text-destructive">
                  {Object.values(attempts).filter(a => !a.isCorrect).length}
                </div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold">
                  {Math.round((Object.values(attempts).filter(a => a.isCorrect).length / questions.length) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold">
                  {Math.round(Object.values(attempts).reduce((acc, a) => acc + a.timeSpent, 0) / questions.length)}s
                </div>
                <div className="text-sm text-muted-foreground">Avg Time</div>
              </div>
            </div>
            <Button onClick={() => {
              setQuestions([]);
              setAttempts({});
              setCurrentQuestionIndex(0);
              fetchQuestions();
            }} className="w-full">
              Start New Practice Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}