import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  FileQuestion,
  Play,
  Trophy,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import {
  academicSupportService,
  AcademicAssignment,
  AcademicQuiz,
  AcademicProfile,
} from '@/services/academicSupportService';
import { useToast } from '@/hooks/use-toast';

interface Props {
  profile: AcademicProfile;
}

export default function AssignmentsQuizzesTab({ profile }: Props) {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<AcademicAssignment[]>([]);
  const [quizzes, setQuizzes] = useState<AcademicQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingAssignments, setGeneratingAssignments] = useState(false);
  const [generatingQuizzes, setGeneratingQuizzes] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<AcademicQuiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState({ score: 0, total: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [aData, qData] = await Promise.all([
        academicSupportService.getAssignments(),
        academicSupportService.getQuizzes(),
      ]);
      setAssignments(aData);
      setQuizzes(qData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAssignments = async () => {
    setGeneratingAssignments(true);
    try {
      const result = await academicSupportService.generateAcademicPlan(profile, 'assignments');
      if (result.success) {
        toast({ title: 'Assignments Generated', description: 'New AI-generated assignments are ready!' });
        await loadData();
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to generate', variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setGeneratingAssignments(false);
    }
  };

  const generateQuizzes = async () => {
    setGeneratingQuizzes(true);
    try {
      const result = await academicSupportService.generateAcademicPlan(profile, 'quizzes');
      if (result.success) {
        toast({ title: 'Quizzes Generated', description: 'New AI-generated quizzes are ready!' });
        await loadData();
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to generate', variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setGeneratingQuizzes(false);
    }
  };

  const toggleAssignmentStatus = async (a: AcademicAssignment) => {
    const newStatus = a.status === 'completed' ? 'pending' : 'completed';
    try {
      await academicSupportService.updateAssignment(a.id, {
        status: newStatus,
        completed_at: newStatus === 'completed' ? new Date().toISOString() : undefined,
      });
      await loadData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const startQuiz = (quiz: AcademicQuiz) => {
    setActiveQuiz(quiz);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;
    let score = 0;
    activeQuiz.questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct_answer) score++;
    });
    const total = activeQuiz.questions.length;
    setQuizScore({ score, total });
    setQuizSubmitted(true);

    try {
      await academicSupportService.submitQuizAttempt({
        quiz_id: activeQuiz.id,
        answers: Object.entries(quizAnswers).map(([i, a]) => ({ question_index: parseInt(i), answer: a })),
        score,
        total_questions: total,
        percentage: Math.round((score / total) * 100),
      });
    } catch (error) {
      console.error('Failed to save quiz attempt:', error);
    }
  };

  const priorityColor = (p: string) => {
    switch (p) { case 'high': return 'destructive'; case 'medium': return 'default'; default: return 'secondary'; }
  };

  const statusIcon = (s: string) => {
    switch (s) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Loader2 className="h-4 w-4 text-blue-500" />;
      default: return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const pendingCount = assignments.filter(a => a.status !== 'completed').length;
  const completedCount = assignments.filter(a => a.status === 'completed').length;

  // Quiz taking view
  if (activeQuiz) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{activeQuiz.title}</h3>
            <p className="text-sm text-muted-foreground">{activeQuiz.subject} - {activeQuiz.questions.length} questions</p>
          </div>
          <Button variant="outline" onClick={() => setActiveQuiz(null)}>Exit Quiz</Button>
        </div>

        {quizSubmitted ? (
          <Card className="text-center py-8">
            <CardContent>
              <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
              <p className="text-lg">
                You scored <span className="text-primary font-bold">{quizScore.score}</span> out of <span className="font-bold">{quizScore.total}</span>
              </p>
              <p className="text-muted-foreground mt-1">{Math.round((quizScore.score / quizScore.total) * 100)}%</p>
              <div className="mt-6 space-y-3 text-left max-w-lg mx-auto">
                {activeQuiz.questions.map((q, i) => {
                  const isCorrect = quizAnswers[i] === q.correct_answer;
                  return (
                    <div key={i} className={`p-3 rounded-lg border ${isCorrect ? 'border-green-500/50 bg-green-50 dark:bg-green-950/20' : 'border-red-500/50 bg-red-50 dark:bg-red-950/20'}`}>
                      <p className="text-sm font-medium">{i + 1}. {q.question}</p>
                      <p className="text-xs mt-1">
                        Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{quizAnswers[i] || 'No answer'}</span>
                      </p>
                      {!isCorrect && <p className="text-xs text-green-600">Correct: {q.correct_answer}</p>}
                      {q.explanation && <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>}
                    </div>
                  );
                })}
              </div>
              <Button className="mt-6" onClick={() => setActiveQuiz(null)}>Back to Quizzes</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeQuiz.questions.map((q, i) => (
              <Card key={i}>
                <CardContent className="pt-4">
                  <p className="font-medium text-sm mb-3">{i + 1}. {q.question}</p>
                  {q.type === 'multiple_choice' && (
                    <div className="space-y-2">
                      {q.options.filter(o => o).map((option, oi) => (
                        <button
                          key={oi}
                          onClick={() => setQuizAnswers(p => ({ ...p, [i]: option }))}
                          className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                            quizAnswers[i] === option ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                          }`}>
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  {q.type === 'true_false' && (
                    <div className="flex gap-3">
                      {['True', 'False'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setQuizAnswers(p => ({ ...p, [i]: opt }))}
                          className={`flex-1 p-3 rounded-lg border text-sm transition-all ${
                            quizAnswers[i] === opt ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                          }`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                  {q.type === 'short_answer' && (
                    <Input
                      value={quizAnswers[i] || ''}
                      onChange={e => setQuizAnswers(p => ({ ...p, [i]: e.target.value }))}
                      placeholder="Type your answer..."
                    />
                  )}
                </CardContent>
              </Card>
            ))}
            <Button
              onClick={submitQuiz}
              className="w-full"
              disabled={Object.keys(quizAnswers).length < activeQuiz.questions.length}>
              Submit Quiz ({Object.keys(quizAnswers).length}/{activeQuiz.questions.length} answered)
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments">
            <ClipboardList className="h-4 w-4 mr-1" />Assignments
          </TabsTrigger>
          <TabsTrigger value="quizzes">
            <FileQuestion className="h-4 w-4 mr-1" />Quizzes
          </TabsTrigger>
        </TabsList>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {pendingCount} pending, {completedCount} completed
              </p>
              <Badge variant="secondary" className="text-[10px]">
                <Sparkles className="h-3 w-3 mr-1" />AI Generated
              </Badge>
            </div>
            <Button
              size="sm"
              onClick={generateAssignments}
              disabled={generatingAssignments}>
              {generatingAssignments ? (
                <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Generating...</>
              ) : (
                <><RefreshCw className="h-4 w-4 mr-1" />Generate More</>
              )}
            </Button>
          </div>

          {generatingAssignments && assignments.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Loader2 className="h-8 w-8 mx-auto mb-3 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">AI is generating personalized assignments based on your profile...</p>
              </CardContent>
            </Card>
          )}

          {assignments.length === 0 && !generatingAssignments ? (
            <Card>
              <CardContent className="text-center py-8">
                <ClipboardList className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-3">No assignments yet.</p>
                <Button size="sm" onClick={generateAssignments}>
                  <Sparkles className="h-4 w-4 mr-1" />Generate AI Assignments
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {assignments.map(a => (
                <div key={a.id} className={`flex items-center gap-3 p-3 rounded-lg border ${a.status === 'completed' ? 'opacity-60' : ''}`}>
                  <button onClick={() => toggleAssignmentStatus(a)} className="flex-shrink-0">
                    {statusIcon(a.status)}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${a.status === 'completed' ? 'line-through' : ''}`}>{a.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{a.subject}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(a.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    {a.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description}</p>
                    )}
                  </div>
                  <Badge variant={priorityColor(a.priority) as any} className="text-xs">{a.priority}</Badge>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">{quizzes.length} quizzes</p>
              <Badge variant="secondary" className="text-[10px]">
                <Sparkles className="h-3 w-3 mr-1" />AI Generated
              </Badge>
            </div>
            <Button
              size="sm"
              onClick={generateQuizzes}
              disabled={generatingQuizzes}>
              {generatingQuizzes ? (
                <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Generating...</>
              ) : (
                <><RefreshCw className="h-4 w-4 mr-1" />Generate More</>
              )}
            </Button>
          </div>

          {generatingQuizzes && quizzes.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Loader2 className="h-8 w-8 mx-auto mb-3 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">AI is generating quizzes for your subjects...</p>
              </CardContent>
            </Card>
          )}

          {quizzes.length === 0 && !generatingQuizzes ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileQuestion className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-3">No quizzes yet.</p>
                <Button size="sm" onClick={generateQuizzes}>
                  <Sparkles className="h-4 w-4 mr-1" />Generate AI Quizzes
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {quizzes.map(q => (
                <Card key={q.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{q.title}</p>
                        <Badge variant="outline" className="text-xs mt-1">{q.subject}</Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs">{q.question_count} Q</Badge>
                    </div>
                    {q.description && <p className="text-xs text-muted-foreground mt-2">{q.description}</p>}
                    {q.time_limit_minutes && q.time_limit_minutes > 0 && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />{q.time_limit_minutes} min
                      </p>
                    )}
                    <Button size="sm" className="w-full mt-3" onClick={() => startQuiz(q)}>
                      <Play className="h-3 w-3 mr-1" />Take Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
