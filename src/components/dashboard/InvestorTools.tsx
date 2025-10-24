import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  DollarSign,
  PiggyBank,
  Target,
  LineChart,
  AlertCircle,
  CheckCircle2,
  Wallet,
  Calculator,
  BookOpen,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Award,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RoadmapPhase {
  timeline: string;
  title: string;
  estimated_cost_tzs: number;
}

interface OnboardingData {
  id: string;
  education_level: string;
  interests: string[];
  dream_career: string;
  preferred_path: string;
  ai_recommended_path: string;
  habits: {
    focus_level: number;
    time_management: number;
  };
  ai_roadmap_json: {
    phases: RoadmapPhase[];
    total_estimated_cost_tzs: number;
    total_estimated_duration: string;
  };
}

interface InvestmentRecommendation {
  type: string;
  name: string;
  description: string;
  riskLevel: "Low" | "Medium" | "High";
  expectedReturn: string;
  minInvestment: number;
  relevance: string;
  icon: any;
}

export default function InvestorTools() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [monthsToGoal, setMonthsToGoal] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchInvestorData();
  }, [user]);

  const fetchInvestorData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("onboarding_responses")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          setOnboardingData(null);
        } else {
          throw error;
        }
      } else if (data) {
        setOnboardingData(data as OnboardingData);

        // Calculate savings based on roadmap
        if (data.ai_roadmap_json?.total_estimated_cost_tzs) {
          const totalCost = data.ai_roadmap_json.total_estimated_cost_tzs;
          setSavingsGoal(totalCost);

          // Estimate monthly savings needed (assuming 2 years)
          const estimatedMonths = 24;
          const monthlyAmount = Math.ceil(totalCost / estimatedMonths);
          setMonthlySavings(monthlyAmount);
          setMonthsToGoal(estimatedMonths);
        }
      }
    } catch (error) {
      console.error("Error fetching investor data:", error);
      toast({
        title: "Error",
        description: "Failed to load your investment data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskProfile = () => {
    if (!onboardingData) return "Moderate";

    const focusLevel = onboardingData.habits?.focus_level || 5;
    const timeManagement = onboardingData.habits?.time_management || 5;
    const avgScore = (focusLevel + timeManagement) / 2;

    if (avgScore >= 8) return "Aggressive";
    if (avgScore >= 6) return "Moderate";
    return "Conservative";
  };

  const getPersonalizedRecommendations = (): InvestmentRecommendation[] => {
    if (!onboardingData) return [];

    const interests = onboardingData.interests || [];
    const recommendations: InvestmentRecommendation[] = [];
    const riskProfile = getRiskProfile();

    // Education & Career Investment (Always recommended)
    recommendations.push({
      type: "Education",
      name: "Career Development Fund",
      description: `Invest in courses, certifications, and skills for ${onboardingData.dream_career}`,
      riskLevel: "Low",
      expectedReturn: "200-500% ROI on career earnings",
      minInvestment: 100000,
      relevance: "Direct investment in your career roadmap",
      icon: BookOpen,
    });

    // Technology investments
    if (interests.some((i) => i.includes("Technology") || i.includes("ICT"))) {
      recommendations.push({
        type: "Technology",
        name: "Tech Stocks & Startups",
        description:
          "Invest in technology companies and startups in Tanzania and globally",
        riskLevel: "High",
        expectedReturn: "15-30% annually",
        minInvestment: 500000,
        relevance: "Aligned with your interest in technology sector",
        icon: TrendingUp,
      });
    }

    // Agriculture investments
    if (interests.some((i) => i.includes("Agriculture"))) {
      recommendations.push({
        type: "Agriculture",
        name: "Agribusiness Investments",
        description:
          "Invest in agricultural projects, processing, and agri-tech solutions",
        riskLevel: "Medium",
        expectedReturn: "12-20% annually",
        minInvestment: 1000000,
        relevance: "Matches your agriculture industry interest",
        icon: TrendingUp,
      });
    }

    // Business & Finance
    if (
      interests.some((i) => i.includes("Business") || i.includes("Finance"))
    ) {
      recommendations.push({
        type: "Business",
        name: "SME Investment Fund",
        description: "Invest in small and medium enterprises in Tanzania",
        riskLevel: "Medium",
        expectedReturn: "10-18% annually",
        minInvestment: 2000000,
        relevance: "Aligned with business and finance interests",
        icon: Wallet,
      });
    }

    // Real Estate (Conservative option)
    if (riskProfile === "Conservative" || riskProfile === "Moderate") {
      recommendations.push({
        type: "Real Estate",
        name: "Property Investment",
        description:
          "Invest in residential or commercial real estate in growing areas",
        riskLevel: "Low",
        expectedReturn: "8-15% annually",
        minInvestment: 5000000,
        relevance: "Stable long-term investment option",
        icon: Target,
      });
    }

    // Government Bonds (Safe option)
    recommendations.push({
      type: "Bonds",
      name: "Government Treasury Bonds",
      description:
        "Low-risk government-backed securities with guaranteed returns",
      riskLevel: "Low",
      expectedReturn: "8-12% annually",
      minInvestment: 500000,
      relevance: "Safe option for building your career fund",
      icon: PiggyBank,
    });

    // Stock Market
    if (riskProfile === "Aggressive" || riskProfile === "Moderate") {
      recommendations.push({
        type: "Stocks",
        name: "Dar es Salaam Stock Exchange",
        description: "Invest in publicly traded companies on DSE",
        riskLevel: "Medium",
        expectedReturn: "12-25% annually",
        minInvestment: 1000000,
        relevance: "Build wealth through stock market investing",
        icon: LineChart,
      });
    }

    return recommendations;
  };

  const getSavingsTimeline = () => {
    if (!onboardingData?.ai_roadmap_json?.phases) return [];

    return onboardingData.ai_roadmap_json.phases.map((phase, index) => ({
      phase: phase.title,
      timeline: phase.timeline,
      targetAmount: phase.estimated_cost_tzs,
      monthlyRequired: Math.ceil(
        phase.estimated_cost_tzs / (index === 0 ? 6 : 12)
      ),
    }));
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <TrendingUp className='h-8 w-8 animate-spin text-primary' />
        <span className='ml-3 text-muted-foreground'>
          Loading investment tools...
        </span>
      </div>
    );
  }

  if (!onboardingData) {
    return (
      <Card>
        <CardContent className='text-center py-12'>
          <Wallet className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-xl font-semibold text-foreground mb-2'>
            No Investment Data Found
          </h3>
          <p className='text-muted-foreground mb-4'>
            Complete the onboarding process to get personalized investment
            recommendations.
          </p>
          <Button
            onClick={() => (window.location.href = "/onboarding")}
            className='bg-gradient-hero text-white'>
            Start Onboarding
          </Button>
        </CardContent>
      </Card>
    );
  }

  const recommendations = getPersonalizedRecommendations();
  const savingsTimeline = getSavingsTimeline();
  const riskProfile = getRiskProfile();

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl md:text-3xl font-bold text-foreground flex items-center'>
            <TrendingUp className='h-7 w-7 mr-2 text-primary' />
            Investment Tools
          </h2>
          <p className='text-muted-foreground mt-1'>
            Personalized investment recommendations for your career journey
          </p>
        </div>
        <Badge variant='secondary' className='text-base px-4 py-2'>
          <Award className='h-4 w-4 mr-2' />
          {riskProfile} Investor
        </Badge>
      </div>

      {/* Risk Profile Card */}
      <Card className='bg-gradient-hero text-white'>
        <CardHeader>
          <CardTitle className='flex items-center text-white'>
            <Target className='h-5 w-5 mr-2' />
            Your Investment Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <p className='text-sm text-white/80 mb-1'>Risk Profile</p>
              <p className='text-2xl font-bold'>{riskProfile}</p>
            </div>
            <div>
              <p className='text-sm text-white/80 mb-1'>Focus Level</p>
              <p className='text-2xl font-bold'>
                {onboardingData.habits?.focus_level || 5}/10
              </p>
            </div>
            <div>
              <p className='text-sm text-white/80 mb-1'>Time Management</p>
              <p className='text-2xl font-bold'>
                {onboardingData.habits?.time_management || 5}/10
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue='savings' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='savings'>
            <PiggyBank className='h-4 w-4 mr-2' />
            Savings Plan
          </TabsTrigger>
          <TabsTrigger value='investments'>
            <TrendingUp className='h-4 w-4 mr-2' />
            Investments
          </TabsTrigger>
          <TabsTrigger value='calculator'>
            <Calculator className='h-4 w-4 mr-2' />
            Calculator
          </TabsTrigger>
        </TabsList>

        {/* Savings Plan Tab */}
        <TabsContent value='savings' className='space-y-6'>
          {/* Career Fund Goal */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Target className='h-5 w-5 mr-2' />
                Career Development Fund
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='bg-gradient-accent p-6 rounded-lg'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div>
                    <p className='text-sm text-muted-foreground mb-1'>
                      Total Goal
                    </p>
                    <p className='text-2xl font-bold text-foreground'>
                      {formatCurrency(savingsGoal)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground mb-1'>
                      Monthly Savings
                    </p>
                    <p className='text-2xl font-bold text-primary'>
                      {formatCurrency(monthlySavings)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground mb-1'>
                      Time to Goal
                    </p>
                    <p className='text-2xl font-bold text-foreground'>
                      {monthsToGoal} months
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm text-muted-foreground'>
                    Progress
                  </span>
                  <span className='text-sm font-medium'>0%</span>
                </div>
                <Progress value={0} className='h-3' />
                <p className='text-xs text-muted-foreground mt-2'>
                  You haven't started saving yet. Begin your journey today!
                </p>
              </div>

              <div className='bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                <div className='flex items-start gap-3'>
                  <Lightbulb className='h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0' />
                  <div>
                    <h5 className='font-medium text-blue-900 dark:text-blue-100 mb-1'>
                      Savings Tips
                    </h5>
                    <ul className='text-sm text-blue-800 dark:text-blue-200 space-y-1'>
                      <li>
                        • Open a dedicated savings account for your career fund
                      </li>
                      <li>• Set up automatic transfers on payday</li>
                      <li>• Track your progress monthly</li>
                      <li>• Consider side hustles to boost savings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phase-by-Phase Savings */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Calendar className='h-5 w-5 mr-2' />
                Phase-by-Phase Savings Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {savingsTimeline.map((item, index) => (
                  <div
                    key={index}
                    className='border border-border rounded-lg p-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <div>
                        <Badge variant='outline' className='mb-1'>
                          {item.timeline}
                        </Badge>
                        <h4 className='font-semibold text-foreground'>
                          {item.phase}
                        </h4>
                      </div>
                      <div className='text-right'>
                        <p className='text-sm text-muted-foreground'>Target</p>
                        <p className='font-bold text-primary'>
                          {formatCurrency(item.targetAmount)}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-muted-foreground'>
                        Monthly savings needed:
                      </span>
                      <span className='font-medium text-foreground'>
                        {formatCurrency(item.monthlyRequired)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investments Tab */}
        <TabsContent value='investments' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Lightbulb className='h-5 w-5 mr-2' />
                Personalized Investment Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground mb-6'>
                Based on your career goals, interests in{" "}
                <strong>{onboardingData.interests.join(", ")}</strong>, and{" "}
                <strong>{riskProfile}</strong> risk profile.
              </p>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {recommendations.map((rec, index) => (
                  <Card
                    key={index}
                    className='hover:shadow-lg transition-shadow'>
                    <CardHeader>
                      <CardTitle className='flex items-center justify-between text-base'>
                        <div className='flex items-center'>
                          <rec.icon className='h-5 w-5 mr-2 text-primary' />
                          {rec.name}
                        </div>
                        <Badge
                          variant={
                            rec.riskLevel === "Low"
                              ? "secondary"
                              : rec.riskLevel === "Medium"
                              ? "default"
                              : "destructive"
                          }>
                          {rec.riskLevel} Risk
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      <p className='text-sm text-muted-foreground'>
                        {rec.description}
                      </p>

                      <div className='space-y-2'>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-muted-foreground'>
                            Expected Return:
                          </span>
                          <span className='font-medium text-green-600 flex items-center'>
                            <ArrowUpRight className='h-4 w-4 mr-1' />
                            {rec.expectedReturn}
                          </span>
                        </div>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-muted-foreground'>
                            Min. Investment:
                          </span>
                          <span className='font-medium'>
                            {formatCurrency(rec.minInvestment)}
                          </span>
                        </div>
                      </div>

                      <div className='bg-blue-50 dark:bg-blue-950 rounded p-2'>
                        <p className='text-xs text-blue-800 dark:text-blue-200'>
                          <strong>Why this fits:</strong> {rec.relevance}
                        </p>
                      </div>

                      <Button variant='outline' className='w-full' size='sm'>
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Investment Strategy */}
          <Card className='bg-gradient-card border-0'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Target className='h-5 w-5 mr-2' />
                Recommended Investment Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='h-5 w-5 text-primary mt-0.5 flex-shrink-0' />
                  <div>
                    <h5 className='font-medium mb-1'>
                      Start with Education (Priority #1)
                    </h5>
                    <p className='text-sm text-muted-foreground'>
                      Invest in courses and certifications first - highest ROI
                      for your career
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='h-5 w-5 text-primary mt-0.5 flex-shrink-0' />
                  <div>
                    <h5 className='font-medium mb-1'>Build Emergency Fund</h5>
                    <p className='text-sm text-muted-foreground'>
                      Save 3-6 months of expenses before aggressive investing
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='h-5 w-5 text-primary mt-0.5 flex-shrink-0' />
                  <div>
                    <h5 className='font-medium mb-1'>Diversify Gradually</h5>
                    <p className='text-sm text-muted-foreground'>
                      Start with low-risk options, then add medium-risk as you
                      grow
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calculator Tab */}
        <TabsContent value='calculator' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Calculator className='h-5 w-5 mr-2' />
                Investment Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-center py-12'>
                <Calculator className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
                <h3 className='text-xl font-semibold text-foreground mb-2'>
                  Investment Calculator Coming Soon
                </h3>
                <p className='text-muted-foreground mb-4'>
                  Interactive tools to calculate returns, compound interest, and
                  more.
                </p>
                <Button className='bg-gradient-hero text-white'>
                  Get Notified
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Warning Disclaimer */}
      <Card className='border-yellow-500 bg-yellow-50 dark:bg-yellow-950'>
        <CardContent className='p-4 flex items-start gap-3'>
          <AlertCircle className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
          <div className='text-sm text-yellow-800 dark:text-yellow-200'>
            <strong>Investment Disclaimer:</strong> These are educational
            recommendations only. Always do your own research, consult licensed
            financial advisors, and never invest more than you can afford to
            lose. Past performance doesn't guarantee future results.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
