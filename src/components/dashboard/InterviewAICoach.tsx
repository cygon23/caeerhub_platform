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

  // Render Interview View
  const renderInterviewView = () => {
    if (!currentSession) return null;

    const questions = (currentSession as any).questions;
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Progress Card */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="flex items-center text-lg">
                <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                Question {currentQuestion + 1} of {questions.length}
              </CardTitle>
              <Badge variant={question.type === 'behavioral' ? 'default' : question.type === 'technical' ? 'secondary' : 'outline'}>
                {question.type}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(progress)}% complete
            </p>
          </CardHeader>
        </Card>

        {/* Question Card */}
        <Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tips */}
            <div className="p-4 bg-background rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-primary" />
                <p className="font-semibold">Tips for a great answer:</p>
              </div>
              <ul className="space-y-2">
                {question.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Response Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Your Response</label>
              <Textarea
                placeholder="Type your response here... Aim for a comprehensive 2-3 minute answer when speaking."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{response.split(' ').filter(w => w).length} words</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  💡 Recommended: 150-300 words
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Previous
              </Button>

              <Button
                onClick={submitResponse}
                disabled={analyzing || !response.trim()}
                className="bg-gradient-to-r from-primary to-secondary"
                size="lg"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : currentQuestion === questions.length - 1 ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Complete Interview
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Submit & Next
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Responses Summary */}
        {currentResponses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BarChart3 className="h-5 w-5 mr-2" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gradient-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">{currentResponses.length}</p>
                  <p className="text-xs text-muted-foreground">Answered</p>
                </div>
                <div className="text-center p-3 bg-gradient-accent rounded-lg">
                  <p className={`text-2xl font-bold ${getScoreColor(Math.round(currentResponses.reduce((sum, r) => sum + (r.score || 0), 0) / currentResponses.length))}`}>
                    {Math.round(currentResponses.reduce((sum, r) => sum + (r.score || 0), 0) / currentResponses.length)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
                <div className="text-center p-3 bg-gradient-accent rounded-lg">
                  <p className="text-2xl font-bold text-secondary">
                    {currentResponses.filter(r => (r.score || 0) >= 70).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Strong</p>
                </div>
                <div className="text-center p-3 bg-gradient-accent rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">
                    {currentResponses.filter(r => (r.score || 0) < 70).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Improve</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Render Results View
  const renderResultsView = () => {
    if (!sessionFeedback || !currentSession) return null;

    const feedback = sessionFeedback.feedback || sessionFeedback;
    const overallScore = sessionFeedback.overall_score || 0;

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Overall Score Card */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Interview Complete!</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {currentSession.position} • {currentSession.industry}
                  </p>
                </div>
              </div>
              <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {feedback.readiness_level && (
              <div className="mt-4">
                <Badge className={`text-sm px-4 py-2 ${getReadinessColor(feedback.readiness_level)}`}>
                  {feedback.readiness_level.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        {(feedback.communication_avg || feedback.content_avg || feedback.structure_avg) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Score Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {feedback.communication_avg && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                      <span className={`text-2xl font-bold ${getScoreColor(feedback.communication_avg)}`}>
                        {feedback.communication_avg}%
                      </span>
                    </div>
                    <p className="text-sm font-medium">Communication</p>
                    <p className="text-xs text-muted-foreground mt-1">Clarity & Professionalism</p>
                  </div>
                )}
                {feedback.content_avg && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Brain className="h-5 w-5 text-green-600" />
                      <span className={`text-2xl font-bold ${getScoreColor(feedback.content_avg)}`}>
                        {feedback.content_avg}%
                      </span>
                    </div>
                    <p className="text-sm font-medium">Content</p>
                    <p className="text-xs text-muted-foreground mt-1">Relevance & Depth</p>
                  </div>
                )}
                {feedback.structure_avg && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      <span className={`text-2xl font-bold ${getScoreColor(feedback.structure_avg)}`}>
                        {feedback.structure_avg}%
                      </span>
                    </div>
                    <p className="text-sm font-medium">Structure</p>
                    <p className="text-xs text-muted-foreground mt-1">Organization & Flow</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall Impression */}
        {feedback.overall_impression && (
          <Card className="bg-gradient-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                Overall Impression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {feedback.overall_impression}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Top Strengths */}
        {feedback.top_strengths && feedback.top_strengths.length > 0 && (
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <Star className="h-5 w-5 mr-2" />
                Your Top Strengths ({feedback.top_strengths.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {feedback.top_strengths.map((strength: any, index: number) => (
                <div key={index} className="p-4 bg-white border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">{strength.strength}</h4>
                  {strength.examples && (
                    <p className="text-sm text-green-700 mb-2">
                      <strong>Examples:</strong> {strength.examples}
                    </p>
                  )}
                  {strength.impact && (
                    <p className="text-sm text-green-600">
                      <strong>Impact:</strong> {strength.impact}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Areas for Improvement */}
        {feedback.areas_for_improvement && feedback.areas_for_improvement.length > 0 && (
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <TrendingUp className="h-5 w-5 mr-2" />
                Areas for Improvement ({feedback.areas_for_improvement.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {feedback.areas_for_improvement.map((area: any, index: number) => (
                <div key={index} className="p-4 bg-white border border-orange-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-orange-900">{area.area}</h4>
                    <Badge variant={area.priority === 'high' ? 'destructive' : area.priority === 'medium' ? 'default' : 'secondary'}>
                      {area.priority} priority
                    </Badge>
                  </div>
                  {area.current_level && (
                    <p className="text-sm text-orange-700 mb-1">
                      <strong>Current:</strong> {area.current_level}
                    </p>
                  )}
                  {area.target_level && (
                    <p className="text-sm text-orange-600">
                      <strong>Target:</strong> {area.target_level}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Improvement Plan */}
        {feedback.improvement_plan && feedback.improvement_plan.length > 0 && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Target className="h-5 w-5 mr-2" />
                Your Improvement Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedback.improvement_plan.map((plan: any, index: number) => (
                <div key={index} className="p-4 bg-white border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">{plan.focus_area}</h4>
                  {plan.action_items && plan.action_items.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-blue-800 mb-2">Action Items:</p>
                      <ul className="space-y-1">
                        {plan.action_items.map((item: string, i: number) => (
                          <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-blue-600">
                    {plan.timeframe && (
                      <span>
                        <Clock className="h-3 w-3 inline mr-1" />
                        {plan.timeframe}
                      </span>
                    )}
                    {plan.success_metrics && (
                      <span>
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        {plan.success_metrics}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Individual Response Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-primary" />
              Question-by-Question Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentResponses.map((resp, index) => (
              <details key={index} className="group">
                <summary className="cursor-pointer p-4 bg-gradient-accent rounded-lg hover:bg-gradient-card transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          Question {index + 1}
                        </Badge>
                        <Badge variant={resp.question_type === 'behavioral' ? 'default' : resp.question_type === 'technical' ? 'secondary' : 'outline'}>
                          {resp.question_type}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm">{resp.question_text}</p>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(resp.score || 0)}`}>
                      {resp.score}%
                    </div>
                  </div>
                </summary>
                <div className="mt-4 p-4 border border-border rounded-lg space-y-4">
                  {/* Score Details */}
                  {(resp.communication_score || resp.content_score || resp.structure_score) && (
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className={`font-bold ${getScoreColor(resp.communication_score || 0)}`}>
                          {resp.communication_score}%
                        </p>
                        <p className="text-muted-foreground">Communication</p>
                      </div>
                      <div>
                        <p className={`font-bold ${getScoreColor(resp.content_score || 0)}`}>
                          {resp.content_score}%
                        </p>
                        <p className="text-muted-foreground">Content</p>
                      </div>
                      <div>
                        <p className={`font-bold ${getScoreColor(resp.structure_score || 0)}`}>
                          {resp.structure_score}%
                        </p>
                        <p className="text-muted-foreground">Structure</p>
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {resp.strengths && resp.strengths.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-green-700 mb-2">✓ Strengths:</p>
                      <ul className="space-y-1">
                        {resp.strengths.map((s: any, i: number) => (
                          <li key={i} className="text-sm text-green-600">
                            • {s.point}: {s.explanation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {resp.improvements && resp.improvements.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-orange-700 mb-2">→ Improvements:</p>
                      <ul className="space-y-1">
                        {resp.improvements.map((imp: any, i: number) => (
                          <li key={i} className="text-sm text-orange-600">
                            • {imp.issue}: {imp.suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Your Response */}
                  <details className="text-xs">
                    <summary className="cursor-pointer text-primary font-medium">Your Response</summary>
                    <p className="mt-2 p-3 bg-muted rounded text-muted-foreground whitespace-pre-wrap">
                      {resp.response_text}
                    </p>
                  </details>

                  {/* Suggested Answer */}
                  {resp.suggested_answer && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-secondary font-medium">AI-Suggested Answer</summary>
                      <p className="mt-2 p-3 bg-secondary/5 border border-secondary/20 rounded text-foreground whitespace-pre-wrap">
                        {resp.suggested_answer}
                      </p>
                    </details>
                  )}
                </div>
              </details>
            ))}
          </CardContent>
        </Card>

        {/* Next Steps */}
        {feedback.next_steps && feedback.next_steps.length > 0 && (
          <Card className="border-primary/20 bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.next_steps.map((step: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentSession(null);
              setCurrentResponses([]);
              setSessionFeedback(null);
              setShowResults(false);
              setActiveTab('sessions');
            }}
            className="flex-1"
          >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Sessions
          </Button>
          <Button
            onClick={() => {
              setCurrentSession(null);
              setCurrentResponses([]);
              setSessionFeedback(null);
              setShowResults(false);
              setActiveTab('sessions');
            }}
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Start New Practice
          </Button>
        </div>
      </div>
    );
  };

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
          {renderInterviewView()}
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          {renderResultsView()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
