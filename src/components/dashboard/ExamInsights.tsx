import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Brain,
  Award,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SubjectPerformance {
  subject: string;
  total_questions_attempted: number;
  correct_answers: number;
  accuracy_percentage: number;
  average_time_per_question: number;
  topics_mastered: string[];
  topics_needs_improvement: string[];
  study_time_minutes: number;
  exam_readiness_percentage: number;
  last_practice_date: string | null;
}

interface StudySession {
  subject: string;
  duration_minutes: number;
  questions_attempted: number;
  started_at: string;
}

interface WeeklyProgress {
  week: string;
  accuracy: number;
  questions_attempted: number;
  study_minutes: number;
}

export default function ExamInsights() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);
  const [overallStats, setOverallStats] = useState({
    totalQuestionsAttempted: 0,
    totalCorrect: 0,
    overallAccuracy: 0,
    totalStudyTime: 0,
    avgExamReadiness: 0,
    strongestSubject: '',
    weakestSubject: '',
  });

  useEffect(() => {
    if (user?.id) {
      fetchPerformanceData();
    }
  }, [user]);

  const fetchPerformanceData = async () => {
    setIsLoading(true);
    try {
      // Fetch subject performance
      const { data: perfData, error: perfError } = await supabase
        .from('student_performance')
        .select('*')
        .eq('user_id', user.id)
        .order('accuracy_percentage', { ascending: false });

      if (perfError) throw perfError;

      setSubjectPerformance(perfData || []);

      // Fetch recent study sessions (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: sessionsData, error: sessionsError } = await supabase
        .from('study_sessions')
        .select('subject, duration_minutes, questions_attempted, started_at')
        .eq('user_id', user.id)
        .gte('started_at', thirtyDaysAgo.toISOString())
        .order('started_at', { ascending: true });

      if (sessionsError) throw sessionsError;

      setStudySessions(sessionsData || []);

      // Calculate weekly progress
      calculateWeeklyProgress(sessionsData || []);

      // Calculate overall stats
      calculateOverallStats(perfData || []);

    } catch (error: any) {
      console.error('Error fetching performance data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load performance data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateWeeklyProgress = (sessions: StudySession[]) => {
    const weeklyData: { [key: string]: { accuracy: number; questions: number; minutes: number; count: number } } = {};

    sessions.forEach((session) => {
      const weekStart = new Date(session.started_at);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { accuracy: 0, questions: 0, minutes: 0, count: 0 };
      }

      weeklyData[weekKey].questions += session.questions_attempted;
      weeklyData[weekKey].minutes += session.duration_minutes;
      weeklyData[weekKey].count += 1;
    });

    const weeklyArray = Object.entries(weeklyData).map(([week, data]) => ({
      week: `Week ${Object.keys(weeklyData).indexOf(week) + 1}`,
      accuracy: Math.round((data.accuracy / data.count) * 100) || 0,
      questions_attempted: data.questions,
      study_minutes: data.minutes,
    }));

    setWeeklyProgress(weeklyArray.slice(-5)); // Last 5 weeks
  };

  const calculateOverallStats = (perfData: SubjectPerformance[]) => {
    if (perfData.length === 0) {
      setOverallStats({
        totalQuestionsAttempted: 0,
        totalCorrect: 0,
        overallAccuracy: 0,
        totalStudyTime: 0,
        avgExamReadiness: 0,
        strongestSubject: '',
        weakestSubject: '',
      });
      return;
    }

    const totalQuestions = perfData.reduce((sum, p) => sum + p.total_questions_attempted, 0);
    const totalCorrect = perfData.reduce((sum, p) => sum + p.correct_answers, 0);
    const totalStudyTime = perfData.reduce((sum, p) => sum + p.study_time_minutes, 0);
    const avgReadiness = perfData.reduce((sum, p) => sum + p.exam_readiness_percentage, 0) / perfData.length;

    const strongest = perfData[0]?.subject || '';
    const weakest = perfData[perfData.length - 1]?.subject || '';

    setOverallStats({
      totalQuestionsAttempted: totalQuestions,
      totalCorrect,
      overallAccuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      totalStudyTime,
      avgExamReadiness: Math.round(avgReadiness),
      strongestSubject: strongest,
      weakestSubject: weakest,
    });
  };

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getReadinessColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadinessBadge = (percentage: number) => {
    if (percentage >= 80) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (percentage >= 60) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    if (percentage >= 40) return { label: 'Fair', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Needs Work', color: 'bg-red-100 text-red-800' };
  };

  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a78bfa', '#fb923c'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (subjectPerformance.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Exam Performance Insights
          </CardTitle>
          <CardDescription>
            Track your study progress and exam readiness across all subjects
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">No Performance Data Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start uploading study materials and practicing questions to see your performance insights.
              Your progress will be tracked automatically!
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-powered insights coming soon</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Exam Performance Insights
          </CardTitle>
          <CardDescription>
            Track your study progress and exam readiness across all subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subjects">By Subject</TabsTrigger>
              <TabsTrigger value="topics">Topics Mastery</TabsTrigger>
              <TabsTrigger value="trends">Progress Trends</TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Overall Accuracy</p>
                        <Target className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold">{overallStats.overallAccuracy}%</p>
                        {overallStats.totalQuestionsAttempted > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {overallStats.totalCorrect}/{overallStats.totalQuestionsAttempted}
                          </p>
                        )}
                      </div>
                      <Progress value={overallStats.overallAccuracy} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Study Time</p>
                        <Clock className="h-4 w-4 text-secondary" />
                      </div>
                      <p className="text-3xl font-bold">
                        {formatStudyTime(overallStats.totalStudyTime)}
                      </p>
                      <p className="text-xs text-muted-foreground">Total study time logged</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Exam Readiness</p>
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <p className={`text-3xl font-bold ${getReadinessColor(overallStats.avgExamReadiness)}`}>
                        {overallStats.avgExamReadiness}%
                      </p>
                      <Badge className={getReadinessBadge(overallStats.avgExamReadiness).color}>
                        {getReadinessBadge(overallStats.avgExamReadiness).label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Active Subjects</p>
                        <BookOpen className="h-4 w-4 text-secondary" />
                      </div>
                      <p className="text-3xl font-bold">{subjectPerformance.length}</p>
                      <p className="text-xs text-muted-foreground">
                        Strongest: {overallStats.strongestSubject || 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Subject Performance Overview Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="accuracy_percentage" fill="#8884d8" name="Accuracy %" />
                      <Bar dataKey="exam_readiness_percentage" fill="#82ca9d" name="Exam Readiness %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Strongest Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {subjectPerformance.slice(0, 3).map((subject, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">{subject.subject}</span>
                          </div>
                          <Badge variant="outline">{subject.accuracy_percentage}%</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Areas to Improve</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {subjectPerformance.slice(-3).reverse().map((subject, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-medium">{subject.subject}</span>
                          </div>
                          <Badge variant="outline">{subject.accuracy_percentage}%</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* SUBJECTS TAB */}
            <TabsContent value="subjects" className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Subject Performance Details</h3>
                <Badge variant="outline">
                  {subjectPerformance.length} Subject{subjectPerformance.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {subjectPerformance.map((subject, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Subject Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{subject.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            {subject.total_questions_attempted} questions attempted •{' '}
                            {formatStudyTime(subject.study_time_minutes)} studied
                          </p>
                        </div>
                        <Badge className={getReadinessBadge(subject.exam_readiness_percentage).color}>
                          {subject.exam_readiness_percentage}% Ready
                        </Badge>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Accuracy</p>
                          <p className="text-2xl font-bold">{subject.accuracy_percentage}%</p>
                          <Progress value={subject.accuracy_percentage} className="h-1 mt-1" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Correct</p>
                          <p className="text-2xl font-bold">{subject.correct_answers}</p>
                          <p className="text-xs text-muted-foreground">out of {subject.total_questions_attempted}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Time</p>
                          <p className="text-2xl font-bold">{subject.average_time_per_question}s</p>
                          <p className="text-xs text-muted-foreground">per question</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Last Practice</p>
                          <p className="text-sm font-medium">
                            {subject.last_practice_date
                              ? new Date(subject.last_practice_date).toLocaleDateString()
                              : 'Never'}
                          </p>
                        </div>
                      </div>

                      {/* Topics */}
                      {(subject.topics_mastered.length > 0 || subject.topics_needs_improvement.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                          <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              Topics Mastered ({subject.topics_mastered.length})
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {subject.topics_mastered.map((topic, i) => (
                                <Badge key={i} className="bg-green-100 text-green-800">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                              Needs Improvement ({subject.topics_needs_improvement.length})
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {subject.topics_needs_improvement.map((topic, i) => (
                                <Badge key={i} className="bg-orange-100 text-orange-800">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* TOPICS MASTERY TAB */}
            <TabsContent value="topics" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Topics Mastery Radar</CardTitle>
                  <CardDescription>
                    Visual representation of your mastery across different subjects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={subjectPerformance.map(s => ({
                      subject: s.subject,
                      mastery: s.accuracy_percentage,
                      readiness: s.exam_readiness_percentage,
                    }))}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Accuracy" dataKey="mastery" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Radar name="Exam Readiness" dataKey="readiness" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Topics Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">All Mastered Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {subjectPerformance.flatMap(s => s.topics_mastered).length > 0 ? (
                        subjectPerformance.flatMap(s =>
                          s.topics_mastered.map((topic, i) => (
                            <Badge key={`${s.subject}-${i}`} className="bg-green-100 text-green-800">
                              {topic}
                            </Badge>
                          ))
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground">No topics mastered yet. Keep practicing!</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Topics to Focus On</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {subjectPerformance.flatMap(s => s.topics_needs_improvement).length > 0 ? (
                        subjectPerformance.flatMap(s =>
                          s.topics_needs_improvement.map((topic, i) => (
                            <Badge key={`${s.subject}-${i}`} className="bg-orange-100 text-orange-800">
                              {topic}
                            </Badge>
                          ))
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground">Great! No weak topics identified.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TRENDS TAB */}
            <TabsContent value="trends" className="space-y-6 mt-6">
              {weeklyProgress.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Progress Trends</CardTitle>
                    <CardDescription>Your performance over the last 5 weeks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyProgress}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="questions_attempted"
                          stroke="#8884d8"
                          strokeWidth={2}
                          name="Questions Attempted"
                        />
                        <Line
                          type="monotone"
                          dataKey="study_minutes"
                          stroke="#82ca9d"
                          strokeWidth={2}
                          name="Study Time (min)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Not enough data yet. Complete more practice sessions to see trends!
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Study Time Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Study Time by Subject</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subjectPerformance.map((s, i) => ({
                          name: s.subject,
                          value: s.study_time_minutes,
                          fill: COLORS[i % COLORS.length],
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${formatStudyTime(value)}`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {subjectPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
