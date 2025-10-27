import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  TrendingUp,
  MapPin,
  Briefcase,
  Calendar,
  AlertCircle,
  RefreshCw,
  Brain,
  Sparkles,
  Target,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LocationSelector } from "../LocationSelector";

interface MarketSector {
  name: string;
  growth: string;
  openings: number;
  avgSalary: string;
  demand: string;
  demandLevel: string;
  description: string;
  skills: string[];
  matchReason: string;
  topEmployers: string[];
  entryRequirements: string;
}

interface EmergingOpportunity {
  title: string;
  description: string;
  timeframe: string;
  potential: string;
  potentialLevel: string;
  skillsNeeded: string[];
  whyEmerging: string;
  estimatedJobs: number;
  salaryRange: string;
  entryBarrier: string;
  matchScore: number;
  whyGoodFit: string;
}

export const UbongInsight = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<MarketSector[]>([]);
  const [opportunities, setOpportunities] = useState<EmergingOpportunity[]>([]);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserLocationAndInsights();
    }
  }, [user]);

  const loadUserLocationAndInsights = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get user location
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("location")
        .eq("user_id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error loading profile:", profileError);
        setLoading(false);
        return;
      }

      if (profile?.location) {
        setUserLocation(profile.location);
        // Load insights for this location
        await loadInsights(profile.location);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async (location: string) => {
    try {
      const { data, error } = await supabase
        .from("ubong_insights")
        .select("*")
        .eq("user_id", user!.id)
        .eq("location", location)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading insights:", error);
        return;
      }

      if (data) {
        setMarketData(data.market_overview || []);
        setOpportunities(data.emerging_opportunities || []);
        setLastGenerated(data.generated_at);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateInsights = async () => {
    if (!userLocation || !user) return;

    setGenerating(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SUPABASE_URL
        }/functions/v1/generate-ubong-insights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              (
                await supabase.auth.getSession()
              ).data.session?.access_token
            }`,
          },
          body: JSON.stringify({ location: userLocation }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate insights");
      }

      const result = await response.json();

      if (result.success) {
        setMarketData(result.data.marketOverview);
        setOpportunities(result.data.emergingOpportunities);
        setLastGenerated(result.data.generatedAt);
        toast.success(
          result.data.cached
            ? "Loaded insights"
            : "Insights generated successfully!"
        );
      } else {
        throw new Error(result.error?.message || "Failed to generate insights");
      }
    } catch (error) {
      console.error("Error generating insights:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate insights"
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleLocationSelected = async (location: string) => {
    setUserLocation(location);
    await generateInsights();
  };

  // Show location selector if no location
  if (!userLocation) {
    return <LocationSelector onLocationSelected={handleLocationSelected} />;
  }

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Brain className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  // Empty state - no insights generated yet
  if (marketData.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-[600px]'>
        <Card className='max-w-2xl w-full border-2 border-dashed'>
          <CardContent className='p-12 text-center space-y-6'>
            <div className='relative mx-auto w-32 h-32'>
              <div className='absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full animate-pulse' />
              <div className='absolute inset-4 bg-background rounded-full flex items-center justify-center'>
                <Eye className='w-16 h-16 text-primary' />
              </div>
            </div>

            <div className='space-y-2'>
              <h3 className='text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'>
                Generate Your Ubong Insights
              </h3>
              <p className='text-muted-foreground text-lg'>
                Get AI-powered career intelligence for{" "}
                {getCityName(userLocation)}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4'>
              <div className='p-4 rounded-lg bg-primary/5 space-y-2'>
                <Briefcase className='w-8 h-8 text-primary mx-auto' />
                <p className='text-sm font-medium'>Local Job Market</p>
              </div>
              <div className='p-4 rounded-lg bg-purple-500/5 space-y-2'>
                <TrendingUp className='w-8 h-8 text-purple-600 mx-auto' />
                <p className='text-sm font-medium'>Emerging Opportunities</p>
              </div>
            </div>

            <Button
              size='lg'
              className='mt-6'
              onClick={generateInsights}
              disabled={generating}>
              {generating ? (
                <>
                  <RefreshCw className='w-5 h-5 mr-2 animate-spin' />
                  Generating Insights...
                </>
              ) : (
                <>
                  <Sparkles className='w-5 h-5 mr-2' />
                  Generate Insights
                </>
              )}
            </Button>

            <p className='text-xs text-muted-foreground'>
              Takes about 30 seconds • Based on your career assessment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main content - show insights
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Eye className='h-8 w-8 text-primary' />
          <div>
            <h2 className='text-3xl font-bold'>Ubong Insights</h2>
            <p className='text-muted-foreground'>
              AI-powered career intelligence for {getCityName(userLocation)}
            </p>
          </div>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={generateInsights}
          disabled={generating}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${generating ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Last updated */}
      {lastGenerated && (
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Brain className='h-4 w-4' />
          <span>
            AI-generated {new Date(lastGenerated).toLocaleDateString()}
          </span>
        </div>
      )}

      <div className='grid gap-6'>
        {/* Market Overview */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPin className='h-5 w-5' />
              {getCityName(userLocation)} Job Market Overview
            </CardTitle>
            <CardDescription>
              Growth sectors personalized to your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2'>
              {marketData.map((sector, index) => (
                <div key={index} className='p-4 rounded-lg border space-y-3'>
                  <div className='flex justify-between items-start'>
                    <h3 className='font-semibold'>{sector.name}</h3>
                    <Badge
                      variant={
                        sector.demandLevel === "high" ||
                        sector.demandLevel === "very high"
                          ? "default"
                          : "secondary"
                      }
                      className='text-xs'>
                      {sector.demand}
                    </Badge>
                  </div>

                  <p className='text-sm text-muted-foreground'>
                    {sector.description}
                  </p>

                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    <div>
                      <p className='text-muted-foreground'>Growth Rate</p>
                      <p className='font-medium text-green-600'>
                        {sector.growth}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground'>Open Positions</p>
                      <p className='font-medium'>{sector.openings}</p>
                    </div>
                  </div>

                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Salary Range
                    </p>
                    <p className='font-medium'>{sector.avgSalary}</p>
                  </div>

                  <div className='space-y-1'>
                    <p className='text-xs text-muted-foreground'>
                      In-Demand Skills
                    </p>
                    <div className='flex flex-wrap gap-1'>
                      {sector.skills.map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          variant='outline'
                          className='text-xs'>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className='pt-2 border-t'>
                    <p className='text-xs font-medium mb-1'>
                      Why This Matches You:
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {sector.matchReason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emerging Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5' />
              Emerging Opportunities
            </CardTitle>
            <CardDescription>
              Future career prospects tailored to your strengths
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 lg:grid-cols-3'>
              {opportunities.map((opp, index) => (
                <div key={index} className='p-4 rounded-lg border space-y-3'>
                  <div className='flex justify-between items-start'>
                    <h4 className='font-semibold'>{opp.title}</h4>
                    <Badge
                      variant={opp.matchScore >= 80 ? "default" : "secondary"}
                      className='text-xs'>
                      {opp.matchScore}% Match
                    </Badge>
                  </div>

                  <p className='text-sm text-muted-foreground'>
                    {opp.description}
                  </p>

                  <div className='space-y-2 text-xs'>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Timeline:</span>
                      <span className='font-medium'>{opp.timeframe}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Potential:</span>
                      <Badge variant='outline' className='text-xs'>
                        {opp.potential}
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Est. Jobs:</span>
                      <span className='font-medium'>{opp.estimatedJobs}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>
                        Entry Barrier:
                      </span>
                      <span className='font-medium'>{opp.entryBarrier}</span>
                    </div>
                  </div>

                  <div>
                    <p className='text-xs text-muted-foreground mb-1'>
                      Salary Range:
                    </p>
                    <p className='text-sm font-medium'>{opp.salaryRange}</p>
                  </div>

                  <div className='space-y-1'>
                    <p className='text-xs text-muted-foreground'>
                      Skills Needed:
                    </p>
                    <div className='flex flex-wrap gap-1'>
                      {opp.skillsNeeded.map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          variant='outline'
                          className='text-xs'>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className='pt-2 border-t space-y-2'>
                    <div>
                      <p className='text-xs font-medium'>Why Emerging:</p>
                      <p className='text-xs text-muted-foreground'>
                        {opp.whyEmerging}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs font-medium'>Why Good Fit:</p>
                      <p className='text-xs text-muted-foreground'>
                        {opp.whyGoodFit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper function to get city display name
function getCityName(location: string): string {
  const cityMap: Record<string, string> = {
    dar_es_salaam: "Dar es Salaam",
    arusha: "Arusha",
    mwanza: "Mwanza",
    dodoma: "Dodoma",
    mbeya: "Mbeya",
  };
  return cityMap[location] || location;
}
