import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  PieChart, 
  Shield, 
  Calendar, 
  Star,
  Wallet,
  CheckCircle,
  ArrowRight,
  Building,
  Award,
  BookOpen,
  Calculator,
  BarChart3,
  Zap,
  AlertTriangle,
  Info,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface InvestmentOption {
  id: string;
  name: string;
  type: 'stocks' | 'bonds' | 'real_estate' | 'crypto' | 'business';
  minimum_investment: number;
  expected_return: string;
  risk_level: 'low' | 'medium' | 'high';
  time_horizon: string;
  description: string;
  pros: string[];
  cons: string[];
}

interface LearningModule {
  id: string;
  title: string;
  category: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  topics: string[];
  completed: boolean;
}

export default function InvestorPath() {
  const { user } = useAuth();
  const [investmentGoals, setInvestmentGoals] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [learningModules, setLearningModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('education');

  // Mock investment options
  const investmentOptions: InvestmentOption[] = [
    {
      id: '1',
      name: 'Kenyan Government Bonds',
      type: 'bonds',
      minimum_investment: 50000,
      expected_return: '8-12% annually',
      risk_level: 'low',
      time_horizon: '1-10 years',
      description: 'Secure investment backed by the Kenyan government with fixed returns',
      pros: ['Government backed', 'Fixed returns', 'Low risk'],
      cons: ['Lower returns', 'Inflation risk', 'Liquidity constraints']
    },
    {
      id: '2',
      name: 'Nairobi Securities Exchange (NSE)',
      type: 'stocks',
      minimum_investment: 10000,
      expected_return: '12-20% annually',
      risk_level: 'medium',
      time_horizon: '3-10+ years',
      description: 'Invest in publicly traded Kenyan companies through the stock market',
      pros: ['Higher potential returns', 'Dividend income', 'Liquidity'],
      cons: ['Market volatility', 'Requires research', 'No guaranteed returns']
    },
    {
      id: '3',
      name: 'Real Estate Investment Trusts (REITs)',
      type: 'real_estate',
      minimum_investment: 100000,
      expected_return: '10-15% annually',
      risk_level: 'medium',
      time_horizon: '5-15 years',
      description: 'Invest in real estate without directly owning property',
      pros: ['Real estate exposure', 'Professional management', 'Regular dividends'],
      cons: ['Market risk', 'Higher minimum', 'Management fees']
    },
    {
      id: '4',
      name: 'Unit Trust Funds',
      type: 'stocks',
      minimum_investment: 5000,
      expected_return: '8-15% annually',
      risk_level: 'medium',
      time_horizon: '2-10 years',
      description: 'Professionally managed investment funds with diversified portfolios',
      pros: ['Professional management', 'Diversification', 'Low minimum'],
      cons: ['Management fees', 'No direct control', 'Market risk']
    },
    {
      id: '5',
      name: 'Small Business Investment',
      type: 'business',
      minimum_investment: 250000,
      expected_return: '15-30% annually',
      risk_level: 'high',
      time_horizon: '3-7 years',
      description: 'Invest in or start small businesses with high growth potential',
      pros: ['High returns potential', 'Direct involvement', 'Job creation'],
      cons: ['High risk', 'Requires expertise', 'Illiquid']
    }
  ];

  // Mock learning modules
  const mockLearningModules: LearningModule[] = [
    {
      id: '1',
      title: 'Introduction to Investing',
      category: 'Basics',
      duration: '2 hours',
      difficulty: 'beginner',
      description: 'Learn the fundamentals of investing and building wealth',
      topics: ['What is investing?', 'Types of investments', 'Risk vs Return', 'Getting started'],
      completed: true
    },
    {
      id: '2',
      title: 'Understanding the Kenyan Stock Market',
      category: 'Stocks',
      duration: '3 hours',
      difficulty: 'beginner',
      description: 'Navigate the Nairobi Securities Exchange and stock investing',
      topics: ['NSE overview', 'How to buy stocks', 'Reading financial statements', 'Stock analysis'],
      completed: false
    },
    {
      id: '3',
      title: 'Bond Investing in Kenya',
      category: 'Bonds',
      duration: '2.5 hours',
      difficulty: 'intermediate',
      description: 'Master government and corporate bond investing',
      topics: ['Government bonds', 'Corporate bonds', 'Yield calculations', 'Bond strategies'],
      completed: false
    },
    {
      id: '4',
      title: 'Real Estate Investment Strategies',
      category: 'Real Estate',
      duration: '4 hours',
      difficulty: 'intermediate',
      description: 'Learn to invest in Kenyan real estate markets',
      topics: ['Property analysis', 'REITs', 'Rental properties', 'Market trends'],
      completed: false
    },
    {
      id: '5',
      title: 'Portfolio Management & Diversification',
      category: 'Advanced',
      duration: '3.5 hours',
      difficulty: 'advanced',
      description: 'Build and manage a diversified investment portfolio',
      topics: ['Asset allocation', 'Risk management', 'Rebalancing', 'Performance tracking'],
      completed: false
    },
    {
      id: '6',
      title: 'Tax-Efficient Investing in Kenya',
      category: 'Advanced',
      duration: '2 hours',
      difficulty: 'advanced',
      description: 'Optimize your investments for tax efficiency',
      topics: ['Capital gains tax', 'Tax-free investments', 'Investment accounts', 'Tax strategies'],
      completed: false
    }
  ];

  // Mock portfolio data
  const portfolioData = [
    { month: 'Jan', value: 50000, returns: 0 },
    { month: 'Feb', value: 52500, returns: 5 },
    { month: 'Mar', value: 49000, returns: -2 },
    { month: 'Apr', value: 53200, returns: 6.4 },
    { month: 'May', value: 58100, returns: 16.2 },
    { month: 'Jun', value: 61750, returns: 23.5 }
  ];

  const assetAllocation = [
    { name: 'Stocks', value: 40, color: 'hsl(var(--primary))' },
    { name: 'Bonds', value: 35, color: 'hsl(var(--secondary))' },
    { name: 'Real Estate', value: 15, color: 'hsl(var(--accent))' },
    { name: 'Cash', value: 10, color: 'hsl(var(--muted))' }
  ];

  useEffect(() => {
    loadInvestmentData();
  }, [user]);

  const loadInvestmentData = async () => {
    setLoading(true);
    try {
      setLearningModules(mockLearningModules);
      setInvestmentGoals({
        monthly_investment: 15000,
        target_amount: 1000000,
        time_horizon: 60, // months
        risk_tolerance: 'medium',
        current_value: 61750
      });
      setPortfolio([
        { asset: 'NSE Stocks', amount: 24700, percentage: 40 },
        { asset: 'Government Bonds', amount: 21612, percentage: 35 },
        { asset: 'REITs', amount: 9262, percentage: 15 },
        { asset: 'Money Market', amount: 6175, percentage: 10 }
      ]);
    } catch (error) {
      console.error('Error loading investment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: InvestmentOption['risk_level']) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: LearningModule['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderEducation = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            Investment Education Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Master the art of investing through our comprehensive learning modules. Start with the basics and progress to advanced strategies.
          </p>
          
          <div className="grid gap-4">
            {learningModules.map((module) => (
              <Card key={module.id} className={`hover:shadow-md transition-shadow ${module.completed ? 'bg-green-50 border-green-200' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {module.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-primary" />
                        )}
                        <h3 className="font-semibold text-lg">{module.title}</h3>
                        <Badge variant="outline">{module.category}</Badge>
                        <Badge className={getDifficultyColor(module.difficulty)}>
                          {module.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{module.description}</p>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {module.duration}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {module.topics.map((topic, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Button 
                        variant={module.completed ? 'outline' : 'default'}
                        disabled={module.completed}
                      >
                        {module.completed ? 'Completed' : 'Start Learning'}
                        {!module.completed && <ArrowRight className="h-4 w-4 ml-1" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Investment Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Monthly Investment</label>
              <Input placeholder="KSh 10,000" />
            </div>
            <div>
              <label className="text-sm font-medium">Time Period (years)</label>
              <Input placeholder="10" />
            </div>
            <div>
              <label className="text-sm font-medium">Expected Return (%)</label>
              <Input placeholder="12" />
            </div>
            <Button className="w-full">Calculate</Button>
            <div className="text-center p-4 bg-primary/5 rounded">
              <p className="text-sm text-muted-foreground">Projected Value</p>
              <p className="text-2xl font-bold text-primary">KSh 2,320,000</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="font-medium">Your Risk Profile</p>
              <Badge className="text-yellow-600 bg-yellow-50 border-yellow-200">
                Moderate Investor
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Conservative</span>
                <span className="text-sm">25%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Moderate</span>
                <span className="text-sm font-bold">60%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Aggressive</span>
                <span className="text-sm">15%</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">Retake Assessment</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Investment Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              'Market Analysis Reports',
              'Investment Research Tools',
              'Tax Planning Guides',
              'Economic Calendar',
              'Industry News Updates'
            ].map((resource, idx) => (
              <Button key={idx} variant="ghost" className="w-full justify-start text-left">
                <Info className="h-4 w-4 mr-2" />
                {resource}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderOpportunities = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-hero text-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Investment Opportunities in Kenya
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/90">
            Discover carefully selected investment opportunities tailored to your risk profile and financial goals.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {investmentOptions.map((option) => (
          <Card key={option.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {option.type === 'stocks' && <TrendingUp className="h-5 w-5 text-primary" />}
                      {option.type === 'bonds' && <Shield className="h-5 w-5 text-primary" />}
                      {option.type === 'real_estate' && <Building className="h-5 w-5 text-primary" />}
                      {option.type === 'business' && <Zap className="h-5 w-5 text-primary" />}
                    </div>
                    <h3 className="font-semibold text-lg">{option.name}</h3>
                    <Badge className={getRiskColor(option.risk_level)}>
                      {option.risk_level} risk
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{option.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Minimum Investment</p>
                      <p className="font-medium">KSh {option.minimum_investment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Expected Return</p>
                      <p className="font-medium text-green-600">{option.expected_return}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time Horizon</p>
                      <p className="font-medium">{option.time_horizon}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Risk Level</p>
                      <p className="font-medium">{option.risk_level}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-sm mb-2 text-green-600">✅ Advantages</p>
                      <ul className="space-y-1">
                        {option.pros.map((pro, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-2 text-red-600">⚠️ Considerations</p>
                      <ul className="space-y-1">
                        {option.cons.map((con, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  <Button>
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Compare Options
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="space-y-6">
      {investmentGoals && (
        <>
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Investment Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-background rounded-lg">
                  <Wallet className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">KSh {investmentGoals.current_value.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">+23.5%</div>
                  <div className="text-sm text-muted-foreground">Total Return</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <Target className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {Math.round((investmentGoals.current_value / investmentGoals.target_amount) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Goal Progress</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg">
                  <Calendar className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold">{Math.round(investmentGoals.time_horizon / 12)}</div>
                  <div className="text-sm text-muted-foreground">Years to Goal</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={portfolioData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'value' ? `KSh ${Number(value).toLocaleString()}` : `${value}%`,
                      name === 'value' ? 'Portfolio Value' : 'Returns'
                    ]} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      name="value"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={assetAllocation}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Investment Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolio.map((holding, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gradient-accent rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: assetAllocation[idx]?.color }} />
                      <div>
                        <p className="font-medium">{holding.asset}</p>
                        <p className="text-sm text-muted-foreground">{holding.percentage}% of portfolio</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">KSh {holding.amount.toLocaleString()}</p>
                      <p className="text-sm text-green-600">+8.2%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Investor Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="education">Investment Education</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
            </TabsList>

            <TabsContent value="education">
              {renderEducation()}
            </TabsContent>

            <TabsContent value="opportunities">
              {renderOpportunities()}
            </TabsContent>

            <TabsContent value="portfolio">
              {renderPortfolio()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}