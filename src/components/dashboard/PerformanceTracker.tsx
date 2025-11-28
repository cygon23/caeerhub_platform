import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Target, Award, Calendar, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import GoalVisualization from '@/components/user/profile/GoalVisualization';

interface PerformanceData {
  week: string;
  careerReadiness: number;
  skillsDeveloped: number;
  moduleProgress: number;
  mentorshipSessions: number;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'at-risk' | 'behind';
}

export default function PerformanceTracker() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock performance data
  const [performanceData] = useState<PerformanceData[]>([
    { week: 'Week 1', careerReadiness: 45, skillsDeveloped: 2, moduleProgress: 15, mentorshipSessions: 0 },
    { week: 'Week 2', careerReadiness: 52, skillsDeveloped: 4, moduleProgress: 25, mentorshipSessions: 1 },
    { week: 'Week 3', careerReadiness: 58, skillsDeveloped: 6, moduleProgress: 40, mentorshipSessions: 1 },
    { week: 'Week 4', careerReadiness: 65, skillsDeveloped: 8, moduleProgress: 55, mentorshipSessions: 2 },
    { week: 'Week 5', careerReadiness: 72, skillsDeveloped: 12, moduleProgress: 70, mentorshipSessions: 2 },
  ]);

  const [goals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Complete ICT Fundamentals Course',
      description: 'Finish all 12 modules of the ICT fundamentals course',
      progress: 75,
      deadline: '2024-02-15',
      category: 'Learning',
      priority: 'high',
      status: 'on-track'
    },
    {
      id: '2',
      title: 'Build Professional CV',
      description: 'Create and optimize CV using the smart CV builder',
      progress: 60,
      deadline: '2024-02-10',
      category: 'Career Tools',
      priority: 'high',
      status: 'at-risk'
    },
    {
      id: '3',
      title: 'Complete Career Assessment',
      description: 'Take comprehensive career personality assessment',
      progress: 100,
      deadline: '2024-01-31',
      category: 'Assessment',
      priority: 'medium',
      status: 'on-track'
    },
    {
      id: '4',
      title: 'Schedule Mentorship Sessions',
      description: 'Book and complete 3 mentorship sessions this month',
      progress: 33,
      deadline: '2024-02-28',
      category: 'Mentorship',
      priority: 'medium',
      status: 'behind'
    }
  ])

  const skillsData = [
    { name: 'Technical Skills', value: 65, color: '#8884d8' },
    { name: 'Communication', value: 78, color: '#82ca9d' },
    { name: 'Leadership', value: 45, color: '#ffc658' },
    { name: 'Problem Solving', value: 72, color: '#ff7300' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'at-risk': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'behind': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const calculateOverallProgress = () => {
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
    return Math.round(totalProgress / goals.length);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Transform goals data for GoalVisualization component
  const visualizationGoals = goals.map((goal) => ({
    id: parseInt(goal.id),
    title: goal.title,
    type: goal.category.toLowerCase().replace(' ', '-'),
    progress: goal.progress,
    mentorAssisted: false, // Can be added to Goal interface if needed
    shared: false,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Stats Cards - Colorful Dashboard Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Goals */}
        <Card className="overflow-hidden border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Goals</p>
                <p className="text-3xl font-bold text-foreground mt-1">{goals.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Active & Completed</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* With Mentors */}
        <Card className="overflow-hidden border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-500/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">With Mentors</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {goals.filter(g => g.category === 'Mentorship').length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Mentor-assisted</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completed Goals */}
        <Card className="overflow-hidden border-l-4 border-l-green-500 bg-gradient-to-br from-green-500/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {goals.filter(g => g.progress === 100).length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((goals.filter(g => g.progress === 100).length / goals.length) * 100)}% completion rate
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Readiness */}
        <Card className="overflow-hidden border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-500/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Readiness</p>
                <p className="text-3xl font-bold text-foreground mt-1">72%</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8% this week
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="goals" className="gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Goals</span>
              </TabsTrigger>
              <TabsTrigger value="skills" className="gap-2">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Skills</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Trends</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Overall Progress</p>
                        <p className="text-2xl font-bold">{calculateOverallProgress()}%</p>
                      </div>
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Goals</p>
                        <p className="text-2xl font-bold">{goals.filter(g => g.progress < 100).length}</p>
                      </div>
                      <Award className="h-8 w-8 text-secondary" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Career Readiness</p>
                        <p className="text-2xl font-bold">72%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">This Week</p>
                        <p className="text-2xl font-bold">+8%</p>
                      </div>
                      <Calendar className="h-8 w-8 text-secondary" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>5-Week Progress Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="careerReadiness" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.3}
                        name="Career Readiness %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab - Beautiful Visualizations */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Goal Analytics & Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive analytics and visualizations of your career goals progress
                </p>
              </div>
              <GoalVisualization goals={visualizationGoals} />
            </TabsContent>

            <TabsContent value="goals" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Your Career Goals</h3>
                <Badge variant="outline">
                  {goals.filter(g => g.progress === 100).length} of {goals.length} completed
                </Badge>
              </div>

              {goals.map((goal) => (
                <Card key={goal.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{goal.title}</h4>
                            {getStatusIcon(goal.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(goal.priority)}>
                            {goal.priority}
                          </Badge>
                          <Badge variant="outline">{goal.category}</Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                        <span>
                          {getDaysUntilDeadline(goal.deadline) > 0 
                            ? `${getDaysUntilDeadline(goal.deadline)} days left`
                            : 'Overdue'
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={skillsData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {skillsData.map((entry, index) => (
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
                    <CardTitle>Skills Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {skillsData.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{skill.name}</span>
                          <span>{skill.value}%</span>
                        </div>
                        <Progress value={skill.value} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Development Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="careerReadiness" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="Career Readiness"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="skillsDeveloped" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Skills Developed"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="moduleProgress" 
                        stroke="#ffc658" 
                        strokeWidth={2}
                        name="Module Progress"
                      />
                    </LineChart>
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