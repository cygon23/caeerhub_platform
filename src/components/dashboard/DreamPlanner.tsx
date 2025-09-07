import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Target, Calendar, CheckCircle, Plus, Lightbulb, Map } from "lucide-react";

export const DreamPlanner = () => {
  const dreams = [
    {
      id: 1,
      title: "Become a Software Engineer at a Tech Giant",
      description: "Work at Google, Microsoft, or similar company in AI/ML",
      category: "Career",
      priority: "High",
      targetDate: "2026-12-31",
      progress: 45,
      milestones: [
        { task: "Complete Computer Science Degree", completed: true },
        { task: "Learn Python & JavaScript", completed: true },
        { task: "Build 5 Portfolio Projects", completed: false },
        { task: "Complete Internship", completed: false },
        { task: "Prepare for Technical Interviews", completed: false },
      ]
    },
    {
      id: 2,
      title: "Start My Own Tech Startup",
      description: "Launch a mobile app focused on youth career development",
      category: "Entrepreneurship",
      priority: "Medium",
      targetDate: "2028-06-30",
      progress: 20,
      milestones: [
        { task: "Validate Business Idea", completed: true },
        { task: "Learn Business Fundamentals", completed: false },
        { task: "Build MVP", completed: false },
        { task: "Find Co-founder", completed: false },
        { task: "Secure Initial Funding", completed: false },
      ]
    },
    {
      id: 3,
      title: "Travel and Work Remotely",
      description: "Experience digital nomad lifestyle while building career",
      category: "Lifestyle",
      priority: "Low",
      targetDate: "2025-08-01",
      progress: 60,
      milestones: [
        { task: "Develop Remote Work Skills", completed: true },
        { task: "Build Emergency Fund", completed: true },
        { task: "Research Destinations", completed: true },
        { task: "Secure Remote Job", completed: false },
        { task: "Get Travel Documents", completed: false },
      ]
    },
  ];

  const dreamCategories = ["All", "Career", "Education", "Entrepreneurship", "Lifestyle", "Financial"];
  const priorityColors = {
    High: "destructive",
    Medium: "default",
    Low: "secondary"
  };

  const inspirationalQuotes = [
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Dream big and dare to fail. - Norman Vaughan",
    "A goal is a dream with a deadline. - Napoleon Hill"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Star className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold">Dream Planner</h2>
          <p className="text-muted-foreground">Turn your dreams into actionable goals</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Daily Inspiration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center italic text-muted-foreground">
            "{inspirationalQuotes[0]}"
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              My Dreams & Goals
            </CardTitle>
            <CardDescription>
              Track your progress towards your biggest aspirations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {dreams.map((dream) => (
              <div key={dream.id} className="p-4 rounded-lg border space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{dream.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{dream.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{dream.category}</Badge>
                      <Badge 
                        variant={priorityColors[dream.priority as keyof typeof priorityColors] as any}
                        className="text-xs"
                      >
                        {dream.priority} Priority
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Target: {new Date(dream.targetDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{dream.progress}%</span>
                  </div>
                  <Progress value={dream.progress} className="h-3" />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Milestones</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {dream.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                        <CheckCircle 
                          className={`h-4 w-4 ${milestone.completed ? 'text-green-500' : 'text-muted-foreground'}`}
                        />
                        <span className={`text-sm ${milestone.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {milestone.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Map className="h-4 w-4 mr-1" />
                    View Roadmap
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit Dream
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Dream
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Dream title..." />
              <Textarea placeholder="Describe your dream..." className="min-h-[80px]" />
              <select className="w-full p-2 border rounded">
                <option>Select Category</option>
                {dreamCategories.slice(1).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select className="w-full p-2 border rounded">
                <option>Priority Level</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <Button className="w-full">
                Create Dream
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Dream Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Total Dreams</span>
                <span className="font-semibold">{dreams.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>In Progress</span>
                <span className="font-semibold">{dreams.filter(d => d.progress > 0 && d.progress < 100).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Average Progress</span>
                <span className="font-semibold">
                  {Math.round(dreams.reduce((acc, d) => acc + d.progress, 0) / dreams.length)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};