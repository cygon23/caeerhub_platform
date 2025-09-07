import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Calculator, 
  Target, 
  Building2,
  Users,
  FileText,
  Lightbulb,
  ArrowUpRight,
  Plus,
  Briefcase
} from "lucide-react";

export default function InvestorTools() {
  const [activeTab, setActiveTab] = useState("overview");
  const [pitchIdea, setPitchIdea] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");

  const investmentOptions = [
    {
      title: "Tech Startup Fund",
      description: "Investment in emerging technology startups",
      minInvestment: "KSh 50,000",
      expectedReturn: "15-25%",
      riskLevel: "High",
      duration: "3-5 years",
      icon: Lightbulb,
      color: "text-primary"
    },
    {
      title: "Green Energy Portfolio",
      description: "Sustainable energy projects and companies",
      minInvestment: "KSh 25,000",
      expectedReturn: "8-12%",
      riskLevel: "Medium",
      duration: "5-7 years",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Real Estate Investment Trust",
      description: "Commercial and residential property investments",
      minInvestment: "KSh 100,000",
      expectedReturn: "10-15%",
      riskLevel: "Low-Medium",
      duration: "7-10 years",
      icon: Building2,
      color: "text-blue-600"
    }
  ];

  const pitchTemplates = [
    {
      title: "Problem Statement",
      description: "What problem are you solving?",
      example: "Young people in Kenya lack access to quality career guidance..."
    },
    {
      title: "Solution Overview",
      description: "How does your solution address this problem?",
      example: "Our AI-powered platform provides personalized career recommendations..."
    },
    {
      title: "Market Opportunity",
      description: "What's the size of your target market?",
      example: "The career guidance market in East Africa is worth $2.3B annually..."
    },
    {
      title: "Business Model",
      description: "How will you make money?",
      example: "Subscription-based model with freemium tier for students..."
    }
  ];

  const myInvestments = [
    {
      name: "EduTech Kenya",
      amount: "KSh 75,000",
      currentValue: "KSh 92,500",
      return: "+23.3%",
      status: "Active",
      type: "Equity"
    },
    {
      name: "AgriConnect Platform",
      amount: "KSh 50,000",
      currentValue: "KSh 58,750",
      return: "+17.5%",
      status: "Active",
      type: "Convertible Note"
    },
    {
      name: "Green Housing Co.",
      amount: "KSh 100,000",
      currentValue: "KSh 95,000",
      return: "-5.0%",
      status: "Under Review",
      type: "Equity"
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Investment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Invested</p>
                <p className="text-2xl font-bold text-foreground">KSh 225,000</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Current Value</p>
                <p className="text-2xl font-bold text-foreground">KSh 246,250</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Return</p>
                <p className="text-2xl font-bold text-green-600">+9.4%</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Investments</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
              <PieChart className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Investments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            My Investment Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myInvestments.map((investment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-accent rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{investment.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Invested: {investment.amount} • Type: {investment.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{investment.currentValue}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={investment.return.startsWith('+') ? 'default' : 'destructive'}>
                      {investment.return}
                    </Badge>
                    <Badge variant="outline">{investment.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOpportunities = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Investment Opportunities</CardTitle>
          <CardDescription>
            Discover vetted startups and investment opportunities in Kenya
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-primary transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <option.icon className={`h-8 w-8 ${option.color}`} />
                    <Badge variant="outline">{option.riskLevel}</Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min Investment:</span>
                      <span className="font-medium">{option.minInvestment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected Return:</span>
                      <span className="font-medium text-green-600">{option.expectedReturn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{option.duration}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPitchBuilder = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Business Pitch Builder
          </CardTitle>
          <CardDescription>
            Create compelling pitches for your business ideas and startup concepts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="pitch-idea">Business Idea Title</Label>
            <Input
              id="pitch-idea"
              placeholder="e.g., AI-Powered Career Guidance Platform"
              value={pitchIdea}
              onChange={(e) => setPitchIdea(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pitchTemplates.map((template, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-4">
                  <h4 className="font-medium text-foreground mb-2">{template.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <Textarea
                    placeholder={template.example}
                    className="min-h-[100px] text-sm"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button size="lg" className="px-8">
              <Plus className="h-4 w-4 mr-2" />
              Generate Complete Pitch Deck
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCalculator = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Investment Calculator
          </CardTitle>
          <CardDescription>
            Calculate potential returns and plan your investment strategy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="investment-amount">Investment Amount (KSh)</Label>
                <Input
                  id="investment-amount"
                  type="number"
                  placeholder="50000"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
                <Input
                  id="expected-return"
                  type="number"
                  placeholder="15"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="time-horizon">Investment Period (Years)</Label>
                <Input
                  id="time-horizon"
                  type="number"
                  placeholder="5"
                  className="mt-2"
                />
              </div>
              
              <Button className="w-full">
                Calculate Returns
              </Button>
            </div>
            
            <div className="space-y-4">
              <Card className="bg-gradient-card border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h4 className="font-semibold text-foreground mb-4">Projected Results</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Initial Investment:</span>
                        <span className="font-medium">KSh {investmentAmount || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Final Value:</span>
                        <span className="font-medium text-green-600">
                          KSh {investmentAmount ? (parseFloat(investmentAmount) * 2.01).toLocaleString() : '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Profit:</span>
                        <span className="font-medium text-green-600">
                          KSh {investmentAmount ? (parseFloat(investmentAmount) * 1.01).toLocaleString() : '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-sm text-muted-foreground">
                <p>* Calculations are estimates based on assumed compound returns</p>
                <p>* Past performance does not guarantee future results</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Portfolio Overview", icon: PieChart },
    { id: "opportunities", label: "Investment Opportunities", icon: Target },
    { id: "pitch", label: "Pitch Builder", icon: FileText },
    { id: "calculator", label: "ROI Calculator", icon: Calculator }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-hero text-white rounded-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Investor Tools 💰</h1>
            <p className="text-white/90 text-lg">
              Build your investment portfolio and grow your wealth strategically
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">+9.4%</div>
            <div className="text-white/80 text-sm">Portfolio Return</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center"
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "opportunities" && renderOpportunities()}
      {activeTab === "pitch" && renderPitchBuilder()}
      {activeTab === "calculator" && renderCalculator()}
    </div>
  );
}