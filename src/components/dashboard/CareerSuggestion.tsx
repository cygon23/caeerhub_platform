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
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Lightbulb,
  TrendingUp,
  DollarSign,
  MapPin,
  Clock,
  Star,
  Users,
  Briefcase,
  RefreshCw,
  AlertCircle,
  BookOpen,
  Target,
  Sparkles,
  Heart,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  generateCareerSuggestions,
  generateFallbackSuggestions,
} from "@/services/careerSuggestionsService";

interface OnboardingData {
  id: string;
  education_level: string;
  strongest_subjects: string[];
  interests: string[];
  dream_career: string;
  preferred_path: string;
  ai_recommended_path: string;
}

interface CareerSuggestion {
  title: string;
  match: number;
  salary_range_tzs: {
    entry: number;
    mid: number;
    senior: number;
  };
  growth_rate: string;
  location: string;
  description: string;
  skills: string[];
  education: string;
  experience: string;
  demand: string;
  reasoning: string;
}

interface IndustryTrend {
  industry: string;
  growth: string;
  hot_jobs: string;
  relevance: string;
}

interface SkillRecommendation {
  skill: string;
  demand: number;
  time_to_learn: string;
  priority: string;
  gap_reason: string;
}

export const CareerSuggestion = () => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(
    null
  );
  const [suggestions, setSuggestions] = useState<CareerSuggestion[]>([]);
  const [industryTrends, setIndustryTrends] = useState<IndustryTrend[]>([]);
  const [skillRecommendations, setSkillRecommendations] = useState<
    SkillRecommendation[]
  >([]);
  const [overallAnalysis, setOverallAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<"ai" | "fallback">(
    "ai"
  );
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAndGenerateSuggestions();
  }, [user]);

  const fetchAndGenerateSuggestions = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Fetch onboarding data
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
        return;
      }

      setOnboardingData(data as OnboardingData);

      // Generate career suggestions with AI
      await generateSuggestions(data as OnboardingData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load career suggestions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSuggestions = async (profile: OnboardingData) => {
    try {
      toast({
        title: "Analyzing Your Profile...",
        description: "AI is generating personalized career suggestions.",
      });

      const aiResponse = await generateCareerSuggestions({
        educationLevel: profile.education_level,
        strongestSubjects: profile.strongest_subjects,
        interests: profile.interests,
        dreamCareer: profile.dream_career,
        preferredPath: profile.preferred_path,
        aiRecommendedPath: profile.ai_recommended_path,
      });

      setSuggestions(aiResponse.alternative_careers);
      setIndustryTrends(aiResponse.industry_trends);
      setSkillRecommendations(aiResponse.skills_to_develop);
      setOverallAnalysis(aiResponse.overall_analysis);
      setGenerationStatus("ai");

      toast({
        title: "Suggestions Ready! ✨",
        description: "Your personalized career alternatives are displayed.",
      });
    } catch (error) {
      console.error("AI generation failed, using fallback:", error);

      const fallbackResponse = generateFallbackSuggestions({
        educationLevel: profile.education_level,
        strongestSubjects: profile.strongest_subjects,
        interests: profile.interests,
        dreamCareer: profile.dream_career,
        preferredPath: profile.preferred_path,
        aiRecommendedPath: profile.ai_recommended_path,
      });

      setSuggestions(fallbackResponse.alternative_careers);
      setIndustryTrends(fallbackResponse.industry_trends);
      setSkillRecommendations(fallbackResponse.skills_to_develop);
      setOverallAnalysis(fallbackResponse.overall_analysis);
      setGenerationStatus("fallback");

      toast({
        title: "Using Generic Suggestions",
        description: "AI generation failed, showing general recommendations.",
      });
    }
  };

  const handleRegenerate = async () => {
    if (!onboardingData) return;

    setIsRegenerating(true);
    await generateSuggestions(onboardingData);
    setIsRegenerating(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleExplorePath = (career: CareerSuggestion) => {
    toast({
      title: "Feature Coming Soon",
      description: `Detailed roadmap for ${career.title} will be available soon.`,
    });
    // TODO: Generate temporary roadmap in modal
  };

  const handleSaveCareer = (career: CareerSuggestion) => {
    toast({
      title: "Career Saved",
      description: `${career.title} has been added to your saved careers.`,
    });
    // TODO: Implement save to database
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <RefreshCw className='h-8 w-8 animate-spin text-primary' />
        <span className='ml-3 text-muted-foreground'>
          Generating personalized suggestions...
        </span>
      </div>
    );
  }

  if (!onboardingData) {
    return (
      <Card>
        <CardContent className='text-center py-12'>
          <Lightbulb className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-xl font-semibold text-foreground mb-2'>
            No Profile Data Found
          </h3>
          <p className='text-muted-foreground mb-4'>
            Complete the onboarding process to get personalized career
            suggestions.
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

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <Lightbulb className='h-8 w-8 text-primary' />
          <div>
            <h2 className='text-3xl font-bold'>Career Suggestions</h2>
            <p className='text-muted-foreground'>
              Personalized alternatives based on your profile
            </p>
          </div>
        </div>
        <Button
          variant='outline'
          onClick={handleRegenerate}
          disabled={isRegenerating}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRegenerating ? "animate-spin" : ""}`}
          />
          {isRegenerating ? "Regenerating..." : "Regenerate"}
        </Button>
      </div>

      {/* Data Collection Warning */}
      <Card className='border-blue-500 bg-blue-50 dark:bg-blue-950'>
        <CardContent className='p-4 flex items-start gap-3'>
          <AlertCircle className='h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0' />
          <div className='text-sm text-blue-800 dark:text-blue-200'>
            <strong>Data Notice:</strong> Salary ranges and market data are
            AI-generated estimates based on Tanzania's job market. We're
            actively collecting and refining accurate local data. Information
            may not reflect current exact figures.
            {generationStatus === "fallback" && (
              <>
                {" "}
                <strong className='text-blue-900 dark:text-blue-100'>
                  Currently showing generic suggestions due to AI service
                  limitations.
                </strong>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Dream Career */}
      <Card className='bg-gradient-accent border-primary/20'>
        <CardContent className='p-6'>
          <div className='flex items-start gap-4'>
            <Heart className='h-6 w-6 text-primary mt-1 flex-shrink-0' />
            <div className='flex-1'>
              <p className='text-sm text-muted-foreground mb-1'>
                Your Current Dream Career
              </p>
              <h3 className='text-2xl font-bold text-foreground mb-2'>
                {onboardingData.dream_career}
              </h3>
              <p className='text-sm text-muted-foreground'>{overallAnalysis}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Career Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Star className='h-5 w-5' />
            Alternative Career Paths to Consider
          </CardTitle>
          <CardDescription>
            Careers that align with your skills, interests, and goals - explore
            options you might not have considered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6 lg:grid-cols-2'>
            {suggestions.map((career, index) => (
              <div
                key={index}
                className='p-6 rounded-lg border space-y-4 hover:border-primary transition-colors'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h3 className='text-xl font-semibold'>{career.title}</h3>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {career.description}
                    </p>
                  </div>
                  <Badge variant='secondary' className='text-sm shrink-0'>
                    {career.match}% Match
                  </Badge>
                </div>

                <div className='space-y-1'>
                  <div className='flex justify-between text-xs'>
                    <span className='text-muted-foreground'>
                      Career Match Score
                    </span>
                    <span className='font-medium'>{career.match}%</span>
                  </div>
                  <Progress value={career.match} className='h-2' />
                </div>

                {/* Why This Matches */}
                <div className='bg-blue-50 dark:bg-blue-950 rounded-lg p-3'>
                  <p className='text-xs text-blue-800 dark:text-blue-200'>
                    <strong>Why this fits:</strong> {career.reasoning}
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div className='flex items-start gap-2'>
                    <DollarSign className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                    <div>
                      <p className='font-medium'>Salary Range</p>
                      <p className='text-muted-foreground text-xs'>
                        Entry: {formatCurrency(career.salary_range_tzs.entry)}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        Mid: {formatCurrency(career.salary_range_tzs.mid)}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-2'>
                    <TrendingUp className='h-4 w-4 text-green-500 mt-0.5 flex-shrink-0' />
                    <div>
                      <p className='font-medium'>Job Growth</p>
                      <p className='text-green-600'>{career.growth_rate}</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-2'>
                    <MapPin className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                    <div>
                      <p className='font-medium'>Location</p>
                      <p className='text-muted-foreground text-xs'>
                        {career.location}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-2'>
                    <Users className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                    <div>
                      <p className='font-medium'>Demand</p>
                      <p className='text-muted-foreground text-xs'>
                        {career.demand}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <h4 className='font-medium text-sm'>Required Skills</h4>
                  <div className='flex flex-wrap gap-1'>
                    {career.skills.map((skill, skillIndex) => (
                      <Badge
                        key={skillIndex}
                        variant='outline'
                        className='text-xs'>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className='space-y-2 text-sm'>
                  <div>
                    <span className='font-medium'>Education: </span>
                    <span className='text-muted-foreground'>
                      {career.education}
                    </span>
                  </div>
                  <div>
                    <span className='font-medium'>Experience Level: </span>
                    <span className='text-muted-foreground'>
                      {career.experience}
                    </span>
                  </div>
                </div>

                <div className='flex gap-2'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size='sm' className='flex-1'>
                        <Briefcase className='h-4 w-4 mr-1' />
                        Explore Path
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Explore {career.title}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will generate a detailed roadmap for{" "}
                          {career.title}. This feature is coming soon and will
                          help you compare this career path with your current
                          dream.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleExplorePath(career)}>
                          Generate Roadmap
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleSaveCareer(career)}>
                    <Heart className='h-4 w-4 mr-1' />
                    Save
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industry Trends & Skills Grid */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Industry Trends */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5' />
              Industry Trends
            </CardTitle>
            <CardDescription>
              Growing industries with promising opportunities in Tanzania
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {industryTrends.map((trend, index) => (
              <div key={index} className='p-4 rounded-lg border space-y-2'>
                <div className='flex justify-between items-center'>
                  <h4 className='font-semibold'>{trend.industry}</h4>
                  <Badge variant='default' className='text-xs'>
                    {trend.growth} growth
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground'>
                  <strong>Hot Jobs:</strong> {trend.hot_jobs}
                </p>
                <p className='text-xs text-muted-foreground italic'>
                  {trend.relevance}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills to Develop */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target className='h-5 w-5' />
              Skills to Develop
            </CardTitle>
            <CardDescription>
              High-demand skills that will boost your career prospects
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {skillRecommendations.map((skill, index) => (
              <div key={index} className='space-y-2'>
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium'>{skill.skill}</span>
                      <Badge
                        variant={
                          skill.priority === "High"
                            ? "destructive"
                            : skill.priority === "Medium"
                            ? "default"
                            : "secondary"
                        }
                        className='text-xs'>
                        {skill.priority}
                      </Badge>
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {skill.gap_reason}
                    </p>
                  </div>
                </div>

                <div className='space-y-1'>
                  <div className='flex justify-between text-xs'>
                    <span className='text-muted-foreground'>Market Demand</span>
                    <span className='font-medium'>{skill.demand}%</span>
                  </div>
                  <Progress value={skill.demand} className='h-2' />
                </div>

                <div className='flex items-center justify-between text-xs'>
                  <div className='flex items-center gap-1'>
                    <Clock className='h-3 w-3 text-muted-foreground' />
                    <span className='text-muted-foreground'>
                      Time to learn:
                    </span>
                  </div>
                  <span className='font-medium'>{skill.time_to_learn}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Career Exploration Tips */}
      <Card className='bg-gradient-card border-0'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5' />
            How to Explore These Careers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='flex items-start gap-3'>
              <div className='bg-primary/10 p-2 rounded-lg'>
                <BookOpen className='h-5 w-5 text-primary' />
              </div>
              <div>
                <h4 className='font-semibold mb-1'>Research & Learn</h4>
                <p className='text-sm text-muted-foreground'>
                  Read about these careers online, watch YouTube videos, and
                  follow professionals in these fields
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='bg-primary/10 p-2 rounded-lg'>
                <Users className='h-5 w-5 text-primary' />
              </div>
              <div>
                <h4 className='font-semibold mb-1'>Network</h4>
                <p className='text-sm text-muted-foreground'>
                  Connect with professionals on LinkedIn, attend industry
                  events, and join relevant communities
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='bg-primary/10 p-2 rounded-lg'>
                <Target className='h-5 w-5 text-primary' />
              </div>
              <div>
                <h4 className='font-semibold mb-1'>Try It Out</h4>
                <p className='text-sm text-muted-foreground'>
                  Look for internships, volunteer work, or side projects to get
                  hands-on experience
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='bg-primary/10 p-2 rounded-lg'>
                <CheckCircle2 className='h-5 w-5 text-primary' />
              </div>
              <div>
                <h4 className='font-semibold mb-1'>Build Skills</h4>
                <p className='text-sm text-muted-foreground'>
                  Take online courses, earn certifications, and practice the
                  skills needed for these careers
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className='bg-gradient-hero text-white border-0'>
        <CardContent className='p-6 text-center'>
          <Sparkles className='h-12 w-12 mx-auto mb-4' />
          <h3 className='text-2xl font-bold mb-2'>
            Ready to Take the Next Step?
          </h3>
          <p className='mb-6 text-white/90'>
            These are just suggestions - your dream career is still your main
            focus. Use these alternatives as backup options or inspiration!
          </p>
          <div className='flex flex-wrap justify-center gap-3'>
            <Button
              variant='secondary'
              size='lg'
              onClick={() =>
                (window.location.href = "/dashboard/youth?section=roadmap")
              }>
              <ArrowRight className='h-4 w-4 mr-2' />
              View My Main Roadmap
            </Button>
            <Button
              variant='outline'
              size='lg'
              className='bg-white/10 text-white hover:bg-white/20 border-white/20'
              onClick={handleRegenerate}
              disabled={isRegenerating}>
              <RefreshCw className='h-4 w-4 mr-2' />
              Get New Suggestions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
