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
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Habari {userName}! 👋
            </h1>
            <p className="text-white/90 text-base md:text-lg">
              Ready to continue building your career journey today?
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center min-w-[120px]">
            <div className="text-3xl font-bold">{metrics.careerReadinessScore}%</div>
            <div className="text-white/90 text-sm">Career Readiness</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Modules Completed</p>
                <p className="text-2xl font-bold text-primary">{metrics.completedModules}</p>
                <p className="text-xs text-muted-foreground mt-1">of {metrics.totalModules} total</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Days Active</p>
                <p className="text-2xl font-bold text-secondary">{metrics.daysActive}</p>
                <p className="text-xs text-muted-foreground mt-1">since joining</p>
              </div>
              <Calendar className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Points</p>
                <p className="text-2xl font-bold text-success">{metrics.totalPoints}</p>
                <p className="text-xs text-muted-foreground mt-1">earned so far</p>
              </div>
              <Award className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Assessments</p>
                <p className="text-2xl font-bold text-warning">{metrics.completedAssessments}</p>
                <p className="text-xs text-muted-foreground mt-1">completed</p>
              </div>
              <Brain className="h-8 w-8 text-warning" />
            </div>
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
