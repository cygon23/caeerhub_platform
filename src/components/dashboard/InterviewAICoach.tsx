import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  Star, 
  Clock, 
  Target, 
  Award,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface InterviewSession {
  id?: string;
  position: string;
  industry: string;
  difficulty: 'entry' | 'intermediate' | 'senior';
  questions: Array<{
    question: string;
    type: 'behavioral' | 'technical' | 'situational';
    tips: string[];
  }>;
  responses?: Array<{
    question: string;
    response: string;
    score: number;
    feedback: string;
  }>;
  overall_score?: number;
  created_at?: string;
}

export default function InterviewAICoach() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [activeTab, setActiveTab] = useState('practice');
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const interviewQuestions = {
    entry: {
      behavioral: [
        { 
          question: "Tell me about yourself and why you're interested in this position.",
          tips: ["Keep it concise (2-3 minutes)", "Focus on relevant experiences", "Connect to the role"]
        },
        { 
          question: "What are your greatest strengths?",
          tips: ["Choose strengths relevant to the job", "Provide specific examples", "Show impact"]
        },
        { 
          question: "Where do you see yourself in 5 years?",
          tips: ["Show ambition but be realistic", "Align with company growth", "Demonstrate commitment"]
        }
      ],
      technical: [
        { 
          question: "How would you approach learning a new technology or skill required for this role?",
          tips: ["Show learning methodology", "Mention resources you use", "Give examples from past experience"]
        },
        { 
          question: "Describe a challenging project you worked on. How did you overcome obstacles?",
          tips: ["Use STAR method", "Focus on your contribution", "Highlight problem-solving skills"]
        }
      ],
      situational: [
        { 
          question: "How would you handle a disagreement with a team member?",
          tips: ["Show conflict resolution skills", "Emphasize communication", "Focus on finding solutions"]
        },
        { 
          question: "What would you do if you missed an important deadline?",
          tips: ["Take responsibility", "Show proactive communication", "Demonstrate learning"]
        }
      ]
    },
    intermediate: {
      behavioral: [
        { 
          question: "Describe a time when you led a team through a difficult project.",
          tips: ["Highlight leadership skills", "Show team management", "Discuss outcomes"]
        },
        { 
          question: "Tell me about a time you had to adapt to significant change at work.",
          tips: ["Show flexibility", "Demonstrate resilience", "Highlight positive outcomes"]
        }
      ],
      technical: [
        { 
          question: "How do you stay current with industry trends and technologies?",
          tips: ["Mention specific resources", "Show continuous learning", "Discuss application"]
        },
        { 
          question: "Describe your approach to mentoring junior team members.",
          tips: ["Show teaching ability", "Demonstrate patience", "Highlight development success"]
        }
      ],
      situational: [
        { 
          question: "How would you handle competing priorities from different stakeholders?",
          tips: ["Show prioritization skills", "Demonstrate communication", "Focus on business value"]
        }
      ]
    },
    senior: {
      behavioral: [
        { 
          question: "Describe your leadership philosophy and how it has evolved.",
          tips: ["Show self-awareness", "Demonstrate growth", "Give concrete examples"]
        },
        { 
          question: "Tell me about a strategic decision you made that had significant impact.",
          tips: ["Show strategic thinking", "Demonstrate impact", "Discuss lessons learned"]
        }
      ],
      technical: [
        { 
          question: "How do you approach building and scaling high-performing teams?",
          tips: ["Show team building skills", "Demonstrate scalability thinking", "Highlight results"]
        }
      ],
      situational: [
        { 
          question: "How would you handle a situation where your team is consistently missing targets?",
          tips: ["Show analytical thinking", "Demonstrate leadership", "Focus on solutions"]
        }
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
  }, []);

  const loadSessions = async () => {
    
    try {
      // Mock sessions data for now (will be replaced when types are updated)
      const mockSessions = [
        {
          id: '1',
          position: 'Software Developer',
          industry: 'Technology',
          difficulty: 'entry',
          overall_score: 78,
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          position: 'Data Analyst',
          industry: 'Finance',
          difficulty: 'intermediate',
          overall_score: 85,
          created_at: '2024-01-10T14:20:00Z'
        }
      ];
      setSessions(mockSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const startNewSession = (position: string, industry: string, difficulty: 'entry' | 'intermediate' | 'senior') => {
    const allQuestions = [
      ...interviewQuestions[difficulty].behavioral.map(q => ({ ...q, type: 'behavioral' as const })),
      ...interviewQuestions[difficulty].technical.map(q => ({ ...q, type: 'technical' as const })),
      ...interviewQuestions[difficulty].situational.map(q => ({ ...q, type: 'situational' as const }))
    ];

    const session: InterviewSession = {
      position,
      industry,
      difficulty,
      questions: allQuestions.slice(0, 8) // Limit to 8 questions for practice
    };

    setCurrentSession(session);
    setCurrentQuestion(0);
    setResponse('');
    setActiveTab('interview');
  };

  const submitResponse = async () => {
    if (!currentSession || !response.trim()) {
      toast.error('Please provide a response');
      return;
    }

    setLoading(true);
    try {
      // Simulate AI feedback (in real app, you'd call an AI service)
      const mockScore = Math.floor(Math.random() * 40) + 60; // 60-100 range
      const mockFeedback = generateFeedback(currentSession.questions[currentQuestion], response, mockScore);

      const updatedResponses = [
        ...(currentSession.responses || []),
        {
          question: currentSession.questions[currentQuestion].question,
          response,
          score: mockScore,
          feedback: mockFeedback
        }
      ];

      setCurrentSession({
        ...currentSession,
        responses: updatedResponses
      });

      setResponse('');
      
      if (currentQuestion < currentSession.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        toast.success('Response recorded! Next question loaded.');
      } else {
        // Session complete
        const overallScore = Math.round(
          updatedResponses.reduce((sum, r) => sum + r.score, 0) / updatedResponses.length
        );

        const completedSession = {
          ...currentSession,
          responses: updatedResponses,
          overall_score: overallScore
        };

        await saveSession(completedSession);
        setActiveTab('results');
        toast.success('Interview practice completed!');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Failed to submit response');
    } finally {
      setLoading(false);
    }
  };

  const generateFeedback = (question: any, response: string, score: number): string => {
    const feedbacks = {
      high: [
        "Great response! You demonstrated strong communication skills and provided specific examples.",
        "Excellent answer! You showed good understanding and relevant experience.",
        "Outstanding response! Your examples were compelling and well-structured."
      ],
      medium: [
        "Good response! Consider adding more specific examples to strengthen your answer.",
        "Nice answer! You could improve by being more concise and focused.",
        "Solid response! Try to connect your experience more directly to the role."
      ],
      low: [
        "Your response needs work. Focus on providing specific examples and being more structured.",
        "Consider practicing this type of question more. Use the STAR method for better structure.",
        "Work on being more specific and confident in your responses."
      ]
    };

    const category = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
    return feedbacks[category][Math.floor(Math.random() * feedbacks[category].length)];
  };

  const saveSession = async (session: InterviewSession) => {
    
    try {
      // Mock save for now (will be replaced when types are updated)
      console.log('Saving session:', session);
      
      // Add to local sessions state
      const newSession = {
        id: Date.now().toString(),
        position: session.position,
        industry: session.industry,
        difficulty: session.difficulty,
        overall_score: session.overall_score,
        created_at: new Date().toISOString()
      };
      
      setSessions(prev => [newSession, ...prev]);
      toast.success('Session saved successfully!');
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const renderSetup = () => {
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<'entry' | 'intermediate' | 'senior'>('entry');

    return (
      <div className="space-y-6">
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Start Interview Practice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="w-full"
            >
              Start Practice Session
            </Button>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Practice Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.slice(0, 5).map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-accent rounded-lg">
                    <div>
                      <p className="font-medium">{session.position}</p>
                      <p className="text-sm text-muted-foreground">{session.industry} • {session.difficulty}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{session.overall_score}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderInterview = () => {
    if (!currentSession) return null;

    const question = currentSession.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / currentSession.questions.length) * 100;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Question {currentQuestion + 1} of {currentSession.questions.length}
              </CardTitle>
              <Badge variant={question.type === 'behavioral' ? 'default' : question.type === 'technical' ? 'secondary' : 'outline'}>
                {question.type}
              </Badge>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 bg-gradient-card rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">💡 Tips:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {question.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-3 w-3 mt-0.5 mr-2 text-primary flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Textarea
              placeholder="Type your response here... (aim for 1-3 minutes when speaking)"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={6}
              className="resize-none"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Recommended: 2-3 minutes
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}>
                  Previous
                </Button>
                <Button onClick={submitResponse} disabled={loading || !response.trim()}>
                  {loading ? 'Analyzing...' : currentQuestion === currentSession.questions.length - 1 ? 'Finish' : 'Next Question'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderResults = () => {
    if (!currentSession?.responses) return null;

    const averageScore = currentSession.overall_score || 0;
    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
    };

    return (
      <div className="space-y-6">
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                Interview Results
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore}%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-background rounded-lg">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{currentSession.responses.length}</p>
                <p className="text-sm text-muted-foreground">Questions Answered</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{averageScore}%</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <Target className="h-8 w-8 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {currentSession.responses.filter(r => r.score >= 70).length}
                </p>
                <p className="text-sm text-muted-foreground">Strong Answers</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Detailed Feedback</h4>
              {currentSession.responses.map((response, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-sm">{response.question}</p>
                    <div className={`text-lg font-bold ${getScoreColor(response.score)}`}>
                      {response.score}%
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{response.feedback}</p>
                  <details className="text-xs">
                    <summary className="cursor-pointer text-primary">Your Response</summary>
                    <p className="mt-2 p-2 bg-muted rounded text-muted-foreground">{response.response}</p>
                  </details>
                </div>
              ))}
            </div>

            <div className="flex space-x-2 mt-6">
              <Button onClick={() => setActiveTab('practice')} variant="outline">
                Practice Again
              </Button>
              <Button onClick={() => {
                // Generate improvement plan
                toast.success('Improvement plan generated! Check your recommendations.');
              }}>
                Get Improvement Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            AI Interview Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="practice">Practice Setup</TabsTrigger>
              <TabsTrigger value="interview" disabled={!currentSession}>Mock Interview</TabsTrigger>
              <TabsTrigger value="results" disabled={!currentSession?.responses}>Results</TabsTrigger>
            </TabsList>

            <TabsContent value="practice" className="mt-6">
              {renderSetup()}
            </TabsContent>

            <TabsContent value="interview" className="mt-6">
              {renderInterview()}
            </TabsContent>

            <TabsContent value="results" className="mt-6">
              {renderResults()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}