import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Users, Target, Heart, Zap } from "lucide-react";

export const BehavioralInsight = () => {
  const personalityTraits = [
    { name: "Openness", score: 85, description: "Creative and open to new experiences" },
    { name: "Conscientiousness", score: 78, description: "Organized and goal-oriented" },
    { name: "Extraversion", score: 65, description: "Sociable and energetic" },
    { name: "Agreeableness", score: 90, description: "Cooperative and trusting" },
    { name: "Neuroticism", score: 35, description: "Emotionally stable" },
  ];

  const workStyles = [
    { style: "Team Player", strength: 90, icon: Users },
    { style: "Independent Worker", strength: 75, icon: Target },
    { style: "Creative Thinker", strength: 85, icon: Brain },
    { style: "Detail Oriented", strength: 80, icon: Zap },
  ];

  const recommendations = [
    "Consider leadership roles that leverage your high agreeableness",
    "Your creativity makes you ideal for innovation-focused positions",
    "Strong emotional stability suits high-pressure environments",
    "Team collaboration comes naturally to you",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold">Behavioral Insights</h2>
          <p className="text-muted-foreground">Understand your personality and work preferences</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Personality Profile
            </CardTitle>
            <CardDescription>
              Based on the Big Five personality model
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {personalityTraits.map((trait) => (
              <div key={trait.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{trait.name}</span>
                  <span className="text-sm text-muted-foreground">{trait.score}%</span>
                </div>
                <Progress value={trait.score} className="h-2" />
                <p className="text-sm text-muted-foreground">{trait.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Work Style Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workStyles.map((style) => {
              const IconComponent = style.icon;
              return (
                <div key={style.style} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{style.style}</span>
                  </div>
                  <Badge variant="secondary">{style.strength}%</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Career Recommendations</CardTitle>
            <CardDescription>
              Personalized suggestions based on your behavioral profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};