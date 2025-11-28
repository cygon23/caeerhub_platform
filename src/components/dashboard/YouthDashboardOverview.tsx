import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
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
import {
  Target,
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  Users,
  Brain,
  Briefcase,
  Clock,
  CheckCircle,
  Activity,
  Zap,
  Star,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { youthDashboardService, YouthDashboardMetrics } from '@/services/youthDashboardService';

const COLORS = {
  primary: '#0ea5e9',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
};

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning];

export default function YouthDashboardOverview() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<YouthDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadMetrics();
    }
  }, [user]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await youthDashboardService.getDashboardMetrics(user!.id);
      setMetrics(data);
    } catch (error) {
      console.error('Error loading dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = user?.name?.split(' ')[0] || 'User';

  return (
    <div className="space-y-6 p-6">
      {/* Header with Welcome and Live Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Habari {userName}! 👋</h1>
          <p className="text-muted-foreground mt-1">Ready to continue building your career journey today?</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
          <span>•</span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Key Metrics Row - Career Readiness & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Career Readiness</CardTitle>
            <Target className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.careerReadinessScore}%</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {metrics.completedModules > 0 ? 'On track' : 'Get started'}
              </div>
              <div className="text-xs text-muted-foreground">
                {metrics.completedModules}/{metrics.totalModules} modules
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Learning Progress</CardTitle>
            <BookOpen className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.completedModules}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-xs text-orange-600">
                <Clock className="h-3 w-3 mr-1" />
                {metrics.inProgressModules} in progress
              </div>
              <div className="text-xs text-muted-foreground">
                of {metrics.totalModules} total
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Days Active</CardTitle>
            <Calendar className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.daysActive}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-xs text-muted-foreground">
                since {new Date(Date.now() - metrics.daysActive * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Points</CardTitle>
            <Award className="h-5 w-5 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.totalPoints.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-xs text-green-600">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +{metrics.completedModules * 100} from modules
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment & Skills Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics.completedAssessments}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tests Completed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {metrics.strengthsCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Skills Identified</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              CV Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.cvCompleted ? '100%' : '0%'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{metrics.cvCompleted ? 'Complete' : 'Not Started'}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Mentors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {metrics.totalMentors}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active Connections</p>
          </CardContent>
        </Card>
      </div>

      {/* Career Readiness Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Career Readiness Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Learning Modules ({metrics.completedModules}/{metrics.totalModules})</span>
                  <span className="font-semibold">
                    {metrics.totalModules > 0 ? Math.round((metrics.completedModules / metrics.totalModules) * 100) : 0}%
                  </span>
                </div>
                <Progress
                  value={metrics.totalModules > 0 ? (metrics.completedModules / metrics.totalModules) * 100 : 0}
                  className="h-3"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>CV Completion</span>
                  <span className="font-semibold">{metrics.cvCompleted ? '100%' : '0%'}</span>
                </div>
                <Progress value={metrics.cvCompleted ? 100 : 0} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Career Assessments ({metrics.completedAssessments})</span>
                  <span className="font-semibold">{Math.min(metrics.completedAssessments * 25, 100)}%</span>
                </div>
                <Progress value={Math.min(metrics.completedAssessments * 25, 100)} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Personality Test</span>
                  <span className="font-semibold">{metrics.personalityType ? '100%' : '0%'}</span>
                </div>
                <Progress value={metrics.personalityType ? 100 : 0} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Strengths Identified ({metrics.strengthsCount})</span>
                  <span className="font-semibold">{Math.min(metrics.strengthsCount * 20, 100)}%</span>
                </div>
                <Progress value={Math.min(metrics.strengthsCount * 20, 100)} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!metrics.personalityType && (
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Brain className="h-4 w-4 mr-2" />
                Take Personality Test
              </Button>
            )}
            {!metrics.cvCompleted && (
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Build Your CV
              </Button>
            )}
            {metrics.inProgressModules > 0 && (
              <Button variant="outline" className="w-full justify-start" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Continue Learning ({metrics.inProgressModules})
              </Button>
            )}
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Find a Mentor
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Briefcase className="h-4 w-4 mr-2" />
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress & Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Progress by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.learningProgressByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={80} />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip />
                <Bar dataKey="completed" fill={COLORS.primary} name="Completed" radius={[8, 8, 0, 0]} />
                <Bar dataKey="total" fill="#e5e7eb" name="Total" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics.weeklyActivityData}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke={COLORS.secondary}
                  fillOpacity={1}
                  fill="url(#colorActivity)"
                  name="Study Hours"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Skills Progress */}
      {metrics.skillsProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Your Top Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.skillsProgress.map((skill, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{skill.skill}</span>
                    <Badge variant="outline">Level {skill.level}</Badge>
                  </div>
                  <Progress value={skill.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{skill.progress}% mastered</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.recentActivities.length > 0 ? (
              metrics.recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent activity yet. Start exploring to see your progress here!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Career Path Info */}
      {metrics.selectedCareerPath && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your Career Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg capitalize">{metrics.selectedCareerPath}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You're on track! Keep building skills and connections in this field.
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline">{metrics.completedModules} modules completed</Badge>
                  {metrics.cvCompleted && <Badge variant="outline">CV Ready</Badge>}
                  {metrics.totalMentors > 0 && <Badge variant="outline">{metrics.totalMentors} mentors</Badge>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
