import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, AlertTriangle, Target, TrendingUp, Brain, Heart, Users, Lightbulb } from "lucide-react";

export const StrengthWeakness = () => {
  const strengths = [
    {
      name: "Problem Solving",
      level: 90,
      description: "Excellent at breaking down complex problems into manageable parts",
      evidence: ["Completed 15 coding challenges", "Resolved team conflicts effectively"],
      impact: "High",
      category: "Cognitive"
    },
    {
      name: "Communication",
      level: 85,
      description: "Strong written and verbal communication skills",
      evidence: ["Led 5 team presentations", "Mentored 3 junior colleagues"],
      impact: "High",
      category: "Interpersonal"
    },
    {
      name: "Adaptability",
      level: 88,
      description: "Quick to adapt to new environments and technologies",
      evidence: ["Learned 3 new programming languages", "Thrived in remote work"],
      impact: "Medium",
      category: "Behavioral"
    },
    {
      name: "Leadership",
      level: 75,
      description: "Natural ability to guide and motivate teams",
      evidence: ["Led 2 successful projects", "Volunteered as team captain"],
      impact: "High",
      category: "Leadership"
    },
  ];

  const weaknesses = [
    {
      name: "Time Management",
      level: 45,
      description: "Struggles with prioritizing tasks and meeting deadlines",
      impact: "High",
      category: "Organizational",
      improvementPlan: [
        "Use project management tools",
        "Practice Pomodoro technique",
        "Set daily priorities"
      ]
    },
    {
      name: "Public Speaking",
      level: 35,
      description: "Feels anxious when presenting to large audiences",
      impact: "Medium",
      category: "Communication",
      improvementPlan: [
        "Join Toastmasters club",
        "Practice with small groups",
        "Take presentation skills course"
      ]
    },
    {
      name: "Technical Writing",
      level: 50,
      description: "Documentation and technical writing needs improvement",
      impact: "Medium",
      category: "Technical",
      improvementPlan: [
        "Study technical writing principles",
        "Review and improve existing docs",
        "Peer review practice"
      ]
    },
  ];

  const developmentGoals = [
    {
      goal: "Improve Time Management",
      priority: "High",
      timeline: "3 months",
      actions: ["Use digital calendar", "Set daily goals", "Track time spent on tasks"],
      progress: 25
    },
    {
      goal: "Enhance Public Speaking",
      priority: "Medium",
      timeline: "6 months",
      actions: ["Join speaking club", "Practice weekly", "Record and review speeches"],
      progress: 15
    },
    {
      goal: "Develop Technical Leadership",
      priority: "High",
      timeline: "12 months",
      actions: ["Lead technical initiatives", "Mentor team members", "Study architecture patterns"],
      progress: 40
    },
  ];

  const strengthCategories = {
    Cognitive: { icon: Brain, color: "text-blue-500" },
    Interpersonal: { icon: Users, color: "text-green-500" },
    Behavioral: { icon: Heart, color: "text-purple-500" },
    Leadership: { icon: Target, color: "text-orange-500" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Zap className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold">Strengths & Weaknesses</h2>
          <p className="text-muted-foreground">Self-awareness for professional growth</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              Your Strengths
            </CardTitle>
            <CardDescription>
              Core competencies that set you apart
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {strengths.map((strength, index) => {
              const categoryInfo = strengthCategories[strength.category as keyof typeof strengthCategories];
              const IconComponent = categoryInfo.icon;
              
              return (
                <div key={index} className="p-4 rounded-lg border bg-green-50/50 border-green-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-4 w-4 ${categoryInfo.color}`} />
                      <h4 className="font-semibold">{strength.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{strength.category}</Badge>
                      <Badge 
                        variant={strength.impact === "High" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {strength.impact} Impact
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{strength.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Proficiency Level</span>
                      <span>{strength.level}%</span>
                    </div>
                    <Progress value={strength.level} className="h-2" />
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">Evidence:</p>
                    <ul className="text-xs space-y-1">
                      {strength.evidence.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-1">
                          <div className="h-1 w-1 bg-green-500 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Areas for Improvement
            </CardTitle>
            <CardDescription>
              Development opportunities to focus on
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {weaknesses.map((weakness, index) => (
              <div key={index} className="p-4 rounded-lg border bg-orange-50/50 border-orange-200">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold">{weakness.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{weakness.category}</Badge>
                    <Badge 
                      variant={weakness.impact === "High" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {weakness.impact} Impact
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{weakness.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Level</span>
                    <span>{weakness.level}%</span>
                  </div>
                  <Progress value={weakness.level} className="h-2" />
                </div>
                
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-1">Improvement Plan:</p>
                  <ul className="text-xs space-y-1">
                    {weakness.improvementPlan.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-center gap-1">
                        <div className="h-1 w-1 bg-orange-500 rounded-full" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Development Goals
          </CardTitle>
          <CardDescription>
            Track your progress on key improvement areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-3">
            {developmentGoals.map((goal, index) => (
              <div key={index} className="p-4 rounded-lg border space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">{goal.goal}</h4>
                  <Badge 
                    variant={goal.priority === "High" ? "destructive" : "default"}
                    className="text-xs"
                  >
                    {goal.priority}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Target: {goal.timeline}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Action Items:</p>
                  <ul className="text-xs space-y-1">
                    {goal.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-center gap-1">
                        <div className="h-1 w-1 bg-primary rounded-full" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button size="sm" variant="outline" className="w-full text-xs">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Update Progress
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};