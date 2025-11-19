import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  MessageCircle,
  Target,
  Award,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Clock,
  Sparkles,
  BarChart3,
  RefreshCw,
  Eye,
  Trash2,
  Plus,
  ArrowRight,
  FileText,
  Zap,
  Star,
  Brain
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface InterviewSession {
  id?: string;
  position: string;
  industry: string;
  difficulty: 'entry' | 'intermediate' | 'senior';
  status?: string;
  current_question?: number;
  total_questions?: number;
  overall_score?: number;
  created_at?: string;
  completed_at?: string;
}

interface InterviewResponse {
  id?: string;
  question_number: number;
  question_text: string;
  question_type: 'behavioral' | 'technical' | 'situational';
  response_text: string;
  score?: number;
  communication_score?: number;
  content_score?: number;
  structure_score?: number;
  strengths?: any[];
  improvements?: any[];
  suggested_answer?: string;
  key_points_covered?: string[];
  key_points_missed?: string[];
}

export default function InterviewAICoach() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [currentResponses, setCurrentResponses] = useState<InterviewResponse[]>([]);
  const [activeTab, setActiveTab] = useState('sessions');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [sessionFeedback, setSessionFeedback] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingSession, setDeletingSession] = useState<string | null>(null);

  // Interview questions database
  const interviewQuestions = {
    entry: {
      behavioral: [
        { question: "Tell me about yourself and why you're interested in this position.", tips: ["Keep it concise (2-3 minutes)", "Focus on relevant experiences", "Connect to the role"] },
        { question: "What are your greatest strengths?", tips: ["Choose strengths relevant to the job", "Provide specific examples", "Show impact"] },
        { question: "Describe a challenging situation you faced and how you overcame it.", tips: ["Use STAR method", "Show problem-solving", "Highlight learning"] }
      ],
      technical: [
        { question: "How would you approach learning a new technology or skill required for this role?", tips: ["Show learning methodology", "Mention resources", "Give examples"] },
        { question: "Describe a project you're proud of and your contribution to it.", tips: ["Be specific about your role", "Show technical skills", "Quantify impact"] }
      ],
      situational: [
        { question: "How would you handle a disagreement with a team member?", tips: ["Show conflict resolution", "Emphasize communication", "Focus on solutions"] },
        { question: "What would you do if you missed an important deadline?", tips: ["Take responsibility", "Show proactive communication", "Demonstrate learning"] }
      ]
    },
    intermediate: {
      behavioral: [
        { question: "Describe a time when you led a team through a difficult project.", tips: ["Highlight leadership skills", "Show team management", "Discuss outcomes"] },
        { question: "Tell me about a time you had to adapt to significant change at work.", tips: ["Show flexibility", "Demonstrate resilience", "Highlight positive outcomes"] }
      ],
      technical: [
        { question: "How do you stay current with industry trends and technologies?", tips: ["Mention specific resources", "Show continuous learning", "Discuss application"] },
        { question: "Describe your approach to mentoring junior team members.", tips: ["Show teaching ability", "Demonstrate patience", "Highlight development success"] }
      ],
      situational: [
        { question: "How would you handle competing priorities from different stakeholders?", tips: ["Show prioritization skills", "Demonstrate communication", "Focus on business value"] }
      ]
    },
    senior: {
      behavioral: [
        { question: "Describe your leadership philosophy and how it has evolved.", tips: ["Show self-awareness", "Demonstrate growth", "Give concrete examples"] },
        { question: "Tell me about a strategic decision you made that had significant impact.", tips: ["Show strategic thinking", "Demonstrate impact", "Discuss lessons learned"] }
      ],
      technical: [
        { question: "How do you approach building and scaling high-performing teams?", tips: ["Show team building skills", "Demonstrate scalability thinking", "Highlight results"] }
      ],
      situational: [
        { question: "How would you handle a situation where your team is consistently missing targets?", tips: ["Show analytical thinking", "Demonstrate leadership", "Focus on solutions"] }
      ]
    }
  };

  const industryPositions = {
    'Technology': ['Software Developer', 'Data Analyst', 'Product Manager', 'UX Designer', 'DevOps Engineer'],
    'Healthcare': ['Nurse', 'Medical Assistant', 'Health Administrator', 'Lab Technician'],
    'Education': ['Teacher', 'Education Coordinator', 'Curriculum Developer', 'Academic Advisor'],
    'Finance': ['Financial Analyst', 'Accountant', 'Bank Teller', 'Investment Advisor'],
    'Business': ['Marketing Coordinator', 'Sales Representative', 'HR Assistant', 'Operations Manager']
  };

  useEffect(() => {
    loadSessions();
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const startNewSession = async (position: string, industry: string, difficulty: 'entry' | 'intermediate' | 'senior') => {
    if (!user) return;

    try {
      const allQuestions = [
        ...interviewQuestions[difficulty].behavioral.map(q => ({ ...q, type: 'behavioral' as const })),
        ...interviewQuestions[difficulty].technical.map(q => ({ ...q, type: 'technical' as const })),
        ...interviewQuestions[difficulty].situational.map(q => ({ ...q, type: 'situational' as const }))
      ];

      const questions = allQuestions.slice(0, 6); // 6 questions per session

      const { data, error } = await supabase
        .from('interview_sessions')
        .insert({
          user_id: user.id,
          position,
          industry,
          difficulty,
          status: 'in_progress',
          total_questions: questions.length
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSession({ ...data, questions } as any);
      setCurrentQuestion(0);
      setCurrentResponses([]);
      setResponse('');
      setActiveTab('interview');
      toast.success('Interview session started!');
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Failed to start session');
    }
  };

  const submitResponse = async () => {
    if (!currentSession || !response.trim()) {
      toast.error('Please provide a response');
      return;
    }

    setAnalyzing(true);
    try {
      const questions = (currentSession as any).questions;
      const question = questions[currentQuestion];

      const { data, error } = await supabase.functions.invoke('analyze-interview-response', {
        body: {
          session_id: currentSession.id,
          question_number: currentQuestion,
          question_text: question.question,
          question_type: question.type,
          response_text: response,
          position: currentSession.position,
          industry: currentSession.industry,
          difficulty: currentSession.difficulty
        }
      });

      if (error) throw error;

      if (data.success) {
        const analysis = data.data.analysis;

        setCurrentResponses(prev => [
          ...prev,
          {
            question_number: currentQuestion,
            question_text: question.question,
            question_type: question.type,
            response_text: response,
            ...analysis
          }
        ]);

        setResponse('');

        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          toast.success(`Score: ${analysis.score}%! Next question loaded.`);
        } else {
          // Session complete, generate overall feedback
          await generateSessionFeedback();
        }
      } else {
        throw new Error(data.error?.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Failed to analyze response');
    } finally {
      setAnalyzing(false);
    }
  };

  const generateSessionFeedback = async () => {
    if (!currentSession) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-interview-feedback', {
        body: { session_id: currentSession.id }
      });

      if (error) throw error;

      if (data.success) {
        setSessionFeedback(data.data);
        setShowResults(true);
        setActiveTab('results');
        toast.success(`Interview complete! Overall score: ${data.data.overall_score}%`);
        loadSessions();
      } else {
        throw new Error(data.error?.message || 'Feedback generation failed');
      }
    } catch (error) {
      console.error('Error generating feedback:', error);
      toast.error('Failed to generate feedback');
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('interview_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Session deleted successfully');
      loadSessions();
      setShowDeleteDialog(false);
      setDeletingSession(null);
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };

  const confirmDelete = (sessionId: string) => {
    setDeletingSession(sessionId);
    setShowDeleteDialog(true);
  };

  const viewSessionResults = async (session: any) => {
    try {
      // Load responses
      const { data: responses, error: respError } = await supabase
        .from('interview_responses')
        .select('*')
        .eq('session_id', session.id)
        .order('question_number', { ascending: true });

      if (respError) throw respError;

      // Load feedback
      const { data: feedback, error: feedError } = await supabase
        .from('interview_feedback')
        .select('*')
        .eq('session_id', session.id)
        .single();

      if (feedError) throw feedError;

      setCurrentSession(session);
      setCurrentResponses(responses || []);
      setSessionFeedback({ ...feedback, overall_score: session.overall_score });
      setShowResults(true);
      setActiveTab('results');
    } catch (error) {
      console.error('Error loading session results:', error);
      toast.error('Failed to load results');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadinessColor = (level: string) => {
    if (level === 'well_prepared') return 'text-green-600 bg-green-50 border-green-200';
    if (level === 'ready') return 'text-blue-600 bg-blue-50 border-blue-200';
    if (level === 'developing') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Render Sessions Management View
  const renderSessionsView = () => {
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<'entry' | 'intermediate' | 'senior'>('entry');

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Setup Card */}
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Start Interview Practice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Industry</label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(industryPositions).map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Position</label>
                <Select
                  value={selectedPosition}
                  onValueChange={setSelectedPosition}
                  disabled={!selectedIndustry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedIndustry && industryPositions[selectedIndustry as keyof typeof industryPositions].map(position => (
                      <SelectItem key={position} value={position}>{position}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Experience Level</label>
                <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={() => startNewSession(selectedPosition, selectedIndustry, selectedDifficulty)}
              disabled={!selectedIndustry || !selectedPosition}
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-secondary"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Start AI Interview Practice
            </Button>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        {sessions.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Practice Sessions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <Card
                  key={session.id}
                  className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 cursor-pointer relative overflow-hidden"
                  onClick={() => session.status === 'completed' ? viewSessionResults(session) : null}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <CardHeader className="relative">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                          {session.position}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {session.industry} • {session.difficulty}
                        </p>
                        <Badge
                          className="mt-2"
                          variant={session.status === 'completed' ? 'default' : session.status === 'in_progress' ? 'secondary' : 'outline'}
                        >
                          {session.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {session.status === 'completed' && session.overall_score && (
                          <div className={`text-2xl font-bold ${getScoreColor(session.overall_score)}`}>
                            {session.overall_score}%
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(session.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative">
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.created_at).toLocaleDateString()}
                      {session.completed_at && ` - Completed ${new Date(session.completed_at).toLocaleDateString()}`}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="border-2 border-dashed border-muted">
            <CardContent className="p-12 text-center">
              <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Practice Sessions Yet</h3>
              <p className="text-muted-foreground">
                Start your first AI-powered interview practice to get personalized feedback
              </p>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Delete Interview Session
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this session? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeletingSession(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deletingSession && deleteSession(deletingSession)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Rest of the component continues in next part...
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">AI Interview Coach</CardTitle>
                <p className="text-sm text-muted-foreground">Practice with real AI feedback</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="sessions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="interview" disabled={!currentSession} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
            <MessageCircle className="h-4 w-4 mr-2" />
            Interview
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!showResults} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="mt-6">
          {renderSessionsView()}
        </TabsContent>

        <TabsContent value="interview" className="mt-6">
          {/* Interview content will go here */}
          <p className="text-muted-foreground text-center">Interview view coming next...</p>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          {/* Results content will go here */}
          <p className="text-muted-foreground text-center">Results view coming next...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
