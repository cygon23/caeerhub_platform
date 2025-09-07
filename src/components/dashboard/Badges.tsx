import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Star, Trophy, Target, Zap, Users, BookOpen, Briefcase } from "lucide-react";

export const Badges = () => {
  const earnedBadges = [
    { 
      id: 1, 
      name: "First Steps", 
      description: "Completed your first career assessment",
      icon: Target,
      earnedDate: "2024-01-15",
      category: "Getting Started"
    },
    { 
      id: 2, 
      name: "Learning Enthusiast", 
      description: "Completed 5 learning modules",
      icon: BookOpen,
      earnedDate: "2024-02-10",
      category: "Learning"
    },
    { 
      id: 3, 
      name: "Team Player", 
      description: "Participated in 3 mentorship sessions",
      icon: Users,
      earnedDate: "2024-02-20",
      category: "Collaboration"
    },
    { 
      id: 4, 
      name: "Interview Ready", 
      description: "Scored 85%+ in interview practice",
      icon: Briefcase,
      earnedDate: "2024-03-01",
      category: "Career Prep"
    },
  ];

  const availableBadges = [
    { 
      id: 5, 
      name: "Skill Master", 
      description: "Complete 10 learning modules",
      icon: Zap,
      progress: 70,
      category: "Learning"
    },
    { 
      id: 6, 
      name: "Networking Pro", 
      description: "Connect with 5 mentors",
      icon: Users,
      progress: 40,
      category: "Networking"
    },
    { 
      id: 7, 
      name: "Goal Achiever", 
      description: "Complete your first career milestone",
      icon: Trophy,
      progress: 25,
      category: "Achievement"
    },
    { 
      id: 8, 
      name: "Knowledge Seeker", 
      description: "Spend 20 hours learning",
      icon: BookOpen,
      progress: 85,
      category: "Learning"
    },
  ];

  const badgeCategories = ["All", "Getting Started", "Learning", "Career Prep", "Collaboration", "Networking", "Achievement"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Award className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold">Achievement Badges</h2>
          <p className="text-muted-foreground">Track your progress and celebrate milestones</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Earned Badges ({earnedBadges.length})
            </CardTitle>
            <CardDescription>
              Congratulations on your achievements!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {earnedBadges.map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <div key={badge.id} className="p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="p-3 rounded-full bg-primary/10">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {badge.category}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Earned: {new Date(badge.earnedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Available Badges
            </CardTitle>
            <CardDescription>
              Continue your journey to unlock these achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {availableBadges.map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <div key={badge.id} className="p-4 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm">{badge.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {badge.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{badge.progress}%</span>
                          </div>
                          <Progress value={badge.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};