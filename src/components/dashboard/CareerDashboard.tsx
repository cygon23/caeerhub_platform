import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  Award, 
  BookOpen, 
  Users, 
  Briefcase, 
  Clock, 
  Star,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Calendar,
  Lightbulb,
  FileText,
  MessageCircle,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface CareerMetrics {
  overall_score: number;
  skills_score: number;
  experience_score: number;
  education_score: number;
  network_score: number;
  goal_progress: number;
  applications_sent: number;
  interviews_completed: number;
  offers_received: number;
  skills_learned: number;
  certifications: number;
  mentorship_hours: number;
}

export default function CareerDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<CareerMetrics>({
    overall_score: 72,
    skills_score: 85,
    experience_score: 68,
    education_score: 90,
    network_score: 45,
    goal_progress: 63,
    applications_sent: 12,
    interviews_completed: 4,
    offers_received: 1,
    skills_learned: 8,
    certifications: 3,
    mentorship_hours: 24
  });
  const [loading, setLoading] = useState(false);
  const [activeGoals, setActiveGoals] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Mock data for charts
  const progressData = [
    { month: 'Jan', score: 45, applications: 2, skills: 1 },
    { month: 'Feb', score: 52, applications: 4, skills: 2 },
    { month: 'Mar', score: 59, applications: 6, skills: 3 },
    { month: 'Apr', score: 65, applications: 8, skills: 5 },
    { month: 'May', score: 69, applications: 10, skills: 6 },
    { month: 'Jun', score: 72, applications: 12, skills: 8 }
  ];

  const skillsBreakdown = [
    { name: 'Technical Skills', value: 85, color: 'hsl(var(--primary))' },
    { name: 'Soft Skills', value: 78, color: 'hsl(var(--secondary))' },
    { name: 'Leadership', value: 65, color: 'hsl(var(--accent))' },
    { name: 'Communication', value: 82, color: 'hsl(var(--muted))' }
  ];

  const industryComparison = [
    { category: 'Entry Level', yourScore: 72, average: 58 },
    { category: 'Same Industry', yourScore: 72, average: 64 },
    { category: 'Same Education', yourScore: 72, average: 69 },
    { category: 'Your Age Group', yourScore: 72, average: 61 }
  ];

  useEffect(() => {
    loadCareerData();
  }, [user]);

  const loadCareerData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load career assessment results
      const { data: assessments } = await supabase
        .from('career_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      // Load CV data
      const { data: cvs } = await supabase
        .from('user_cvs')
        .select('*')
        .eq('user_id', user.id);

      // Load learning progress
      const { data: progress } = await supabase
        .from('user_module_progress')
        .select('*')
        .eq('user_id', user.id);

      // Calculate metrics based on real data
      if (assessments && assessments.length > 0) {
        setMetrics(prev => ({
          ...prev,
          overall_score: assessments[0].score || prev.overall_score
        }));
      }

      // Mock recent activities
      setRecentActivities([
        { 
          id: 1, 
          type: 'cv_updated', 
          title: 'CV Updated', 
          description: 'Added new technical skills to your CV',
          time: '2 hours ago',
          icon: FileText,
          color: 'bg-primary/10 text-primary'
        },
        { 
          id: 2, 
          type: 'interview_practice', 
          title: 'Interview Practice', 
          description: 'Completed mock interview with 78% score',
          time: '1 day ago',
          icon: MessageCircle,
          color: 'bg-secondary/10 text-secondary'
        },
        { 
          id: 3, 
          type: 'skill_learned', 
          title: 'New Skill Acquired', 
          description: 'Completed React Development course',
          time: '3 days ago',
          icon: BookOpen,
          color: 'bg-accent/10 text-accent'
        },
        { 
          id: 4, 
          type: 'application', 
          title: 'Job Application', 
          description: 'Applied to Software Developer position at TechCorp',
          time: '1 week ago',
          icon: Briefcase,
          color: 'bg-primary/10 text-primary'
        }
      ]);

      // Mock active goals
      setActiveGoals([
        {
          id: 1,
          title: 'Complete 3 Technical Certifications',
          progress: 66,
          target: 3,
          current: 2,
          deadline: '2024-12-31',
          priority: 'high'
        },
        {
          id: 2,
          title: 'Build Professional Network (50 connections)',
          progress: 34,
          target: 50,
          current: 17,
          deadline: '2024-12-31',
          priority: 'medium'
        },
        {
          id: 3,
          title: 'Land First Developer Job',
          progress: 45,
          target: 1,
          current: 0,
          deadline: '2024-10-31',
          priority: 'high'
        },
        {
          id: 4,
          title: 'Complete Portfolio Website',
          progress: 80,
          target: 1,
          current: 0,
          deadline: '2024-08-31',
          priority: 'medium'
        }
      ]);

    } catch (error) {
      console.error('Error loading career data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-hero text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Career Readiness</p>
                <p className="text-3xl font-bold">{metrics.overall_score}%</p>
                <p className="text-white/60 text-xs mt-1">↗ +5% this month</p>
              </div>
              <Target className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Applications Sent</p>
                <p className="text-2xl font-bold text-foreground">{metrics.applications_sent}</p>
                <p className="text-muted-foreground text-xs">This quarter</p>
              </div>
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Skills Learned</p>
                <p className="text-2xl font-bold text-foreground">{metrics.skills_learned}</p>
                <p className="text-muted-foreground text-xs">This year</p>
              </div>
              <BookOpen className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {metrics.applications_sent > 0 ? Math.round((metrics.offers_received / metrics.applications_sent) * 100) : 0}%
                </p>
                <p className="text-muted-foreground text-xs">Interview to offer</p>
              </div>
              <Award className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Career Progress Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                name="Career Score"
              />
              <Line 
                type="monotone" 
                dataKey="applications" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                name="Applications"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Skills Breakdown and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Skills Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillsBreakdown.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className={`text-sm font-bold ${getScoreColor(skill.value)}`}>
                      {skill.value}%
                    </span>
                  </div>
                  <Progress value={skill.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Active Goals
              <Button variant="outline" size="sm">
                <Target className="h-4 w-4 mr-1" />
                New Goal
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeGoals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">{goal.title}</h4>
                    <Badge variant={goal.priority === 'high' ? 'destructive' : 'default'}>
                      {goal.priority}
                    </Badge>
                  </div>
                  <Progress value={goal.progress} className="h-2 mb-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{goal.current}/{goal.target} completed</span>
                    <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Industry Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={industryComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="yourScore" fill="hsl(var(--primary))" name="Your Score" />
              <Bar dataKey="average" fill="hsl(var(--muted))" name="Average Score" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Skills Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={skillsBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {skillsBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Career Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{metrics.mentorship_hours}</p>
                  <p className="text-sm text-muted-foreground">Mentorship Hours</p>
                </div>
                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                  <Award className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{metrics.certifications}</p>
                  <p className="text-sm text-muted-foreground">Certifications</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Network Growth</span>
                    <span className="text-sm font-medium">{metrics.network_score}%</span>
                  </div>
                  <Progress value={metrics.network_score} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Goal Achievement</span>
                    <span className="text-sm font-medium">{metrics.goal_progress}%</span>
                  </div>
                  <Progress value={metrics.goal_progress} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gradient-accent rounded-lg">
                <div className={`p-2 rounded-lg ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Boost Your Network Score</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your network score is 45%. Consider joining professional groups or attending industry events.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 border-blue-300 text-blue-700">
                    View Networking Tips
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Strong Technical Skills</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your technical skills score of 85% is excellent. Consider showcasing these in your portfolio.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 border-green-300 text-green-700">
                    Update Portfolio
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">Application Success Rate</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Your current success rate is 8%. Try tailoring applications more specifically to job requirements.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 border-orange-300 text-orange-700">
                    Improve Applications
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Career Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {renderOverview()}
            </TabsContent>

            <TabsContent value="analytics">
              {renderAnalytics()}
            </TabsContent>

            <TabsContent value="activities">
              {renderActivities()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}