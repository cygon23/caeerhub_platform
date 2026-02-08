import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ClipboardList,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  Trash2,
  FileQuestion,
  Play,
  Trophy,
} from 'lucide-react';
import {
  academicSupportService,
  AcademicAssignment,
  AcademicQuiz,
  QuizQuestion,
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
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<AcademicQuiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState({ score: 0, total: 0 });

  // Assignment form
  const [newAssignment, setNewAssignment] = useState({
    title: '', subject: '', description: '', due_date: '', priority: 'medium',
  });

  // Quiz form
  const [newQuiz, setNewQuiz] = useState({
    title: '', subject: '', description: '', time_limit_minutes: 0,
    questions: [] as QuizQuestion[], is_public: false,
  });
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    question: '', type: 'multiple_choice', options: ['', '', '', ''], correct_answer: '', explanation: '',
  });

  const subjects = profile.subjects_need_help.map(s => s.name);

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

  // --- Assignments ---
  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.subject || !newAssignment.due_date) {
      toast({ title: 'Error', description: 'Title, subject and due date are required', variant: 'destructive' });
      return;
    }
    try {
      await academicSupportService.createAssignment(newAssignment);
      toast({ title: 'Created', description: 'Assignment added!' });
      setShowCreateAssignment(false);
      setNewAssignment({ title: '', subject: '', description: '', due_date: '', priority: 'medium' });
      await loadData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
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

  const deleteAssignment = async (id: string) => {
    try {
      await academicSupportService.deleteAssignment(id);
      await loadData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  // --- Quizzes ---
  const addQuestionToQuiz = () => {
    if (!currentQuestion.question || !currentQuestion.correct_answer) {
      toast({ title: 'Error', description: 'Question and correct answer are required', variant: 'destructive' });
      return;
    }
    setNewQuiz(p => ({ ...p, questions: [...p.questions, { ...currentQuestion }] }));
    setCurrentQuestion({ question: '', type: 'multiple_choice', options: ['', '', '', ''], correct_answer: '', explanation: '' });
  };

  const handleCreateQuiz = async () => {
    if (!newQuiz.title || !newQuiz.subject || newQuiz.questions.length === 0) {
      toast({ title: 'Error', description: 'Title, subject and at least 1 question are required', variant: 'destructive' });
      return;
    }
    try {
      await academicSupportService.createQuiz(newQuiz);
      toast({ title: 'Quiz created', description: `${newQuiz.questions.length} questions ready!` });
      setShowCreateQuiz(false);
      setNewQuiz({ title: '', subject: '', description: '', time_limit_minutes: 0, questions: [], is_public: false });
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
            <p className="text-sm text-muted-foreground">{assignments.length} assignments</p>
            <Dialog open={showCreateAssignment} onOpenChange={setShowCreateAssignment}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Assignment</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Assignment</DialogTitle>
                  <DialogDescription>Add a new assignment to track</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 mt-2">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input value={newAssignment.title} onChange={e => setNewAssignment(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Math Homework Chapter 5" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <select value={newAssignment.subject} onChange={e => setNewAssignment(p => ({ ...p, subject: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                      <option value="">Select subject</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description (optional)</label>
                    <Textarea value={newAssignment.description} onChange={e => setNewAssignment(p => ({ ...p, description: e.target.value }))} rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Due Date</label>
                      <Input type="datetime-local" value={newAssignment.due_date} onChange={e => setNewAssignment(p => ({ ...p, due_date: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <select value={newAssignment.priority} onChange={e => setNewAssignment(p => ({ ...p, priority: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <Button onClick={handleCreateAssignment} className="w-full">Create Assignment</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {assignments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <ClipboardList className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No assignments yet. Create your first one!</p>
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
                  </div>
                  <Badge variant={priorityColor(a.priority) as any} className="text-xs">{a.priority}</Badge>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => deleteAssignment(a.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{quizzes.length} quizzes</p>
            <Dialog open={showCreateQuiz} onOpenChange={setShowCreateQuiz}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />Create Quiz</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Quiz</DialogTitle>
                  <DialogDescription>Build a quiz with custom questions</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 mt-2">
                  <div>
                    <label className="text-sm font-medium">Quiz Title</label>
                    <Input value={newQuiz.title} onChange={e => setNewQuiz(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Algebra Basics" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <select value={newQuiz.subject} onChange={e => setNewQuiz(p => ({ ...p, subject: e.target.value }))} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                        <option value="">Select</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Time Limit (min)</label>
                      <Input type="number" value={newQuiz.time_limit_minutes || ''} onChange={e => setNewQuiz(p => ({ ...p, time_limit_minutes: parseInt(e.target.value) || 0 }))} placeholder="0 = no limit" />
                    </div>
                  </div>

                  {/* Added questions */}
                  {newQuiz.questions.length > 0 && (
                    <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium">{newQuiz.questions.length} question{newQuiz.questions.length > 1 ? 's' : ''} added</p>
                      {newQuiz.questions.map((q, i) => (
                        <div key={i} className="text-xs p-2 rounded bg-background border flex justify-between items-center">
                          <span className="truncate">{i + 1}. {q.question}</span>
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setNewQuiz(p => ({ ...p, questions: p.questions.filter((_, j) => j !== i) }))}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add question form */}
                  <div className="space-y-2 p-3 rounded-lg border">
                    <p className="text-sm font-medium">Add Question</p>
                    <div>
                      <label className="text-xs font-medium">Question Type</label>
                      <select value={currentQuestion.type} onChange={e => setCurrentQuestion(p => ({ ...p, type: e.target.value as any }))} className="w-full px-3 py-1.5 border rounded-md bg-background text-sm">
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="true_false">True / False</option>
                        <option value="short_answer">Short Answer</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Question</label>
                      <Input value={currentQuestion.question} onChange={e => setCurrentQuestion(p => ({ ...p, question: e.target.value }))} placeholder="Enter your question" />
                    </div>
                    {currentQuestion.type === 'multiple_choice' && (
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Options</label>
                        {currentQuestion.options.map((opt, i) => (
                          <Input key={i} value={opt} onChange={e => {
                            const opts = [...currentQuestion.options];
                            opts[i] = e.target.value;
                            setCurrentQuestion(p => ({ ...p, options: opts }));
                          }} placeholder={`Option ${i + 1}`} />
                        ))}
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-medium">Correct Answer</label>
                      <Input value={currentQuestion.correct_answer} onChange={e => setCurrentQuestion(p => ({ ...p, correct_answer: e.target.value }))} placeholder="Enter correct answer" />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Explanation (optional)</label>
                      <Input value={currentQuestion.explanation} onChange={e => setCurrentQuestion(p => ({ ...p, explanation: e.target.value }))} placeholder="Why is this correct?" />
                    </div>
                    <Button variant="outline" size="sm" onClick={addQuestionToQuiz} className="w-full">Add Question</Button>
                  </div>

                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={newQuiz.is_public} onChange={e => setNewQuiz(p => ({ ...p, is_public: e.target.checked }))} />
                    Make quiz public (others can take it)
                  </label>
                  <Button onClick={handleCreateQuiz} className="w-full" disabled={newQuiz.questions.length === 0}>
                    Create Quiz ({newQuiz.questions.length} questions)
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {quizzes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileQuestion className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No quizzes yet. Create your first one!</p>
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
