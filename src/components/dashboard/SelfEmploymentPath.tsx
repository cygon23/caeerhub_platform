import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Rocket, 
  Target, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock, 
  Star,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Building,
  Award,
  FileText,
  Calculator,
  PieChart,
  BarChart3,
  Zap,
  MapPin,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BusinessIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  startup_cost: string;
  potential_revenue: string;
  difficulty: 'easy' | 'medium' | 'hard';
  market_demand: number;
  skills_required: string[];
  time_to_market: string;
}

interface BusinessStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
  status: 'completed' | 'in-progress' | 'pending';
  tasks: string[];
  resources: string[];
}

export default function SelfEmploymentPath() {
  const { user } = useAuth();
  const [businessIdeas, setBusinessIdeas] = useState<BusinessIdea[]>([]);
  const [businessSteps, setBusinessSteps] = useState<BusinessStep[]>([]);
  const [userBusiness, setUserBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ideas');

  // Mock business ideas data
  const mockBusinessIdeas: BusinessIdea[] = [
    {
      id: '1',
      title: 'Web Development Agency',
      description: 'Offer website and web app development services to local businesses',
      category: 'Technology Services',
      startup_cost: 'KSh 50,000 - 150,000',
      potential_revenue: 'KSh 200,000+ /month',
      difficulty: 'medium',
      market_demand: 85,
      skills_required: ['HTML/CSS', 'JavaScript', 'React', 'Marketing', 'Client Management'],
      time_to_market: '2-3 months'
    },
    {
      id: '2',
      title: 'Digital Marketing Consultancy',
      description: 'Help businesses improve their online presence and digital marketing',
      category: 'Marketing Services',
      startup_cost: 'KSh 30,000 - 80,000',
      potential_revenue: 'KSh 150,000+ /month',
      difficulty: 'easy',
      market_demand: 92,
      skills_required: ['Social Media', 'SEO', 'Content Creation', 'Analytics', 'Communication'],
      time_to_market: '1-2 months'
    },
    {
      id: '3',
      title: 'Mobile App Development',
      description: 'Create mobile applications for Android and iOS platforms',
      category: 'Technology Services',
      startup_cost: 'KSh 100,000 - 300,000',
      potential_revenue: 'KSh 300,000+ /month',
      difficulty: 'hard',
      market_demand: 78,
      skills_required: ['React Native', 'Flutter', 'UI/UX Design', 'App Store Optimization'],
      time_to_market: '4-6 months'
    },
    {
      id: '4',
      title: 'Online Education Platform',
      description: 'Create and sell online courses in your area of expertise',
      category: 'Education Technology',
      startup_cost: 'KSh 40,000 - 120,000',
      potential_revenue: 'KSh 100,000+ /month',
      difficulty: 'medium',
      market_demand: 88,
      skills_required: ['Teaching', 'Content Creation', 'Video Production', 'Platform Management'],
      time_to_market: '3-4 months'
    },
    {
      id: '5',
      title: 'E-commerce Store',
      description: 'Sell products online through your own e-commerce website',
      category: 'Retail',
      startup_cost: 'KSh 80,000 - 250,000',
      potential_revenue: 'KSh 180,000+ /month',
      difficulty: 'medium',
      market_demand: 90,
      skills_required: ['Product Sourcing', 'Digital Marketing', 'Customer Service', 'Logistics'],
      time_to_market: '2-3 months'
    }
  ];

  // Mock business development steps
  const mockBusinessSteps: BusinessStep[] = [
    {
      id: '1',
      phase: 'Planning',
      title: 'Business Idea Validation',
      description: 'Research and validate your business idea with potential customers',
      duration: '2-4 weeks',
      priority: 'high',
      status: 'completed',
      tasks: [
        'Conduct market research',
        'Interview potential customers',
        'Analyze competitors',
        'Define value proposition'
      ],
      resources: ['Market Research Template', 'Customer Interview Guide', 'Competitor Analysis Tool']
    },
    {
      id: '2',
      phase: 'Planning',
      title: 'Create Business Plan',
      description: 'Develop a comprehensive business plan outlining your strategy',
      duration: '3-5 weeks',
      priority: 'high',
      status: 'in-progress',
      tasks: [
        'Write executive summary',
        'Define target market',
        'Create financial projections',
        'Develop marketing strategy'
      ],
      resources: ['Business Plan Template', 'Financial Model Template', 'Marketing Plan Guide']
    },
    {
      id: '3',
      phase: 'Legal & Setup',
      title: 'Business Registration',
      description: 'Register your business and obtain necessary licenses',
      duration: '2-3 weeks',
      priority: 'high',
      status: 'pending',
      tasks: [
        'Choose business structure',
        'Register business name',
        'Obtain business license',
        'Open business bank account'
      ],
      resources: ['Business Registration Guide', 'Legal Requirements Checklist', 'Banking Setup Guide']
    },
    {
      id: '4',
      phase: 'Development',
      title: 'Build Minimum Viable Product',
      description: 'Create the first version of your product or service',
      duration: '6-12 weeks',
      priority: 'high',
      status: 'pending',
      tasks: [
        'Design product/service',
        'Develop MVP',
        'Test with beta users',
        'Iterate based on feedback'
      ],
      resources: ['MVP Development Guide', 'Testing Framework', 'User Feedback Tools']
    },
    {
      id: '5',
      phase: 'Launch',
      title: 'Market Launch',
      description: 'Launch your business and start acquiring customers',
      duration: '4-8 weeks',
      priority: 'medium',
      status: 'pending',
      tasks: [
        'Create marketing materials',
        'Launch website/platform',
        'Start marketing campaigns',
        'Track and analyze metrics'
      ],
      resources: ['Launch Checklist', 'Marketing Templates', 'Analytics Setup Guide']
    },
    {
      id: '6',
      phase: 'Growth',
      title: 'Scale Operations',
      description: 'Optimize and scale your business operations',
      duration: 'Ongoing',
      priority: 'medium',
      status: 'pending',
      tasks: [
        'Optimize processes',
        'Hire team members',
        'Expand product line',
        'Enter new markets'
      ],
      resources: ['Scaling Guide', 'Hiring Templates', 'Process Optimization Tools']
    }
  ];

  useEffect(() => {
    loadBusinessData();
  }, [user]);

  const loadBusinessData = async () => {
    setLoading(true);
    try {
      // Set mock data
      setBusinessIdeas(mockBusinessIdeas);
      setBusinessSteps(mockBusinessSteps);
      
      // Mock user business data
      setUserBusiness({
        name: 'TechSolutions Kenya',
        category: 'Web Development',
        stage: 'planning',
        progress: 35,
        monthly_revenue: 0,
        months_active: 0,
        customers: 0
      });
    } catch (error) {
      console.error('Error loading business data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: BusinessIdea['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: BusinessStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  const renderBusinessIdeas = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-primary" />
            Business Ideas for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Based on your skills and interests, here are some business ideas you could start:
          </p>
          <div className="grid gap-6">
            {businessIdeas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Rocket className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">{idea.title}</h3>
                        <Badge className={getDifficultyColor(idea.difficulty)}>
                          {idea.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{idea.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Startup Cost</p>
                          <p className="font-medium">{idea.startup_cost}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Potential Revenue</p>
                          <p className="font-medium text-green-600">{idea.potential_revenue}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Market Demand</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={idea.market_demand} className="h-2 flex-1" />
                            <span className="text-sm">{idea.market_demand}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Time to Market</p>
                          <p className="font-medium">{idea.time_to_market}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {idea.skills_required.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <Button>
                        Start This Business
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBusinessPlan = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-hero text-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Your Business Development Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/90 mb-4">
            Follow this step-by-step plan to turn your idea into a successful business.
          </p>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">35%</div>
              <div className="text-white/80 text-sm">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">2/6</div>
              <div className="text-white/80 text-sm">Steps Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {businessSteps.map((step, index) => (
          <Card key={step.id} className={`border-l-4 ${
            step.status === 'completed' ? 'border-l-green-500 bg-green-50' :
            step.status === 'in-progress' ? 'border-l-blue-500 bg-blue-50' :
            'border-l-gray-300'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    {getStatusIcon(step.status)}
                    <div>
                      <Badge variant="outline" className="text-xs mb-1">
                        {step.phase}
                      </Badge>
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                    </div>
                    <Badge variant={step.priority === 'high' ? 'destructive' : step.priority === 'medium' ? 'default' : 'secondary'}>
                      {step.priority} priority
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-3 ml-11">{step.description}</p>
                  
                  <div className="ml-11 space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      Duration: {step.duration}
                    </div>
                    
                    <div>
                      <p className="font-medium text-sm mb-2">Tasks:</p>
                      <ul className="space-y-1">
                        {step.tasks.map((task, idx) => (
                          <li key={idx} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-3 w-3 mr-2 text-primary" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <p className="font-medium text-sm w-full mb-1">Resources:</p>
                      {step.resources.map((resource, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          📚 {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Button 
                    variant={step.status === 'pending' ? 'default' : 'outline'} 
                    size="sm"
                    disabled={step.status === 'completed'}
                  >
                    {step.status === 'completed' ? 'Completed' :
                     step.status === 'in-progress' ? 'Continue' : 'Start'}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBusinessTracker = () => (
    <div className="space-y-6">
      {userBusiness && (
        <>
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                {userBusiness.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-background rounded-lg">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">KSh {userBusiness.monthly_revenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{userBusiness.customers}</div>
                  <div className="text-sm text-muted-foreground">Total Customers</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <Calendar className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold">{userBusiness.months_active}</div>
                  <div className="text-sm text-muted-foreground">Months Active</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{userBusiness.progress}%</div>
                  <div className="text-sm text-muted-foreground">Goal Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Financial Planning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Monthly Revenue Goal</label>
                  <Input placeholder="KSh 150,000" />
                </div>
                <div>
                  <label className="text-sm font-medium">Operating Expenses</label>
                  <Input placeholder="KSh 50,000" />
                </div>
                <div>
                  <label className="text-sm font-medium">Target Customers</label>
                  <Input placeholder="100" />
                </div>
                <Button className="w-full">
                  Update Financial Plan
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Business Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { milestone: 'First Customer', target: '1', current: '0', progress: 0 },
                    { milestone: 'KSh 10k Revenue', target: '10,000', current: '0', progress: 0 },
                    { milestone: '10 Customers', target: '10', current: '0', progress: 0 },
                    { milestone: 'Break Even', target: 'KSh 50k', current: '0', progress: 0 }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{item.milestone}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.current}/{item.target}
                        </span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Business Resources & Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Business Registration Guide', description: 'Step-by-step guide to register your business in Kenya', icon: FileText },
              { title: 'Financial Planning Template', description: 'Excel template for business financial planning', icon: Calculator },
              { title: 'Marketing Strategy Toolkit', description: 'Templates and guides for marketing your business', icon: TrendingUp },
              { title: 'Legal Requirements Checklist', description: 'Ensure compliance with all legal requirements', icon: CheckCircle },
              { title: 'Funding & Investment Guide', description: 'Learn about funding options for your business', icon: DollarSign },
              { title: 'Business Networking Events', description: 'Connect with other entrepreneurs and investors', icon: Users }
            ].map((resource, idx) => (
              <Card key={idx} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <resource.icon className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-medium mb-1">{resource.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                  <Button variant="outline" size="sm">
                    Access Resource
                  </Button>
                </CardContent>
              </Card>
            ))}
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
            <Rocket className="h-5 w-5 mr-2" />
            Self-Employment Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ideas">Business Ideas</TabsTrigger>
              <TabsTrigger value="plan">Development Plan</TabsTrigger>
              <TabsTrigger value="tracker">Business Tracker</TabsTrigger>
            </TabsList>

            <TabsContent value="ideas">
              {renderBusinessIdeas()}
            </TabsContent>

            <TabsContent value="plan">
              {renderBusinessPlan()}
            </TabsContent>

            <TabsContent value="tracker">
              {renderBusinessTracker()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}