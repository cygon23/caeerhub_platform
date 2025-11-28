import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedSelect from "@/components/ui/enhanced-select";
import RoadmapGenerator from "@/components/user/profile/RoadmapGenerator";
import {
  Target,
  Star,
  Users,
  Calendar,
  CheckCircle,
  MessageCircle,
  Share2,
  Lock,
  Download,
  BarChart3,
  User,
  Map,
  Plus,
  Filter,
  TrendingUp,
  Award,
} from "lucide-react";

export default function GoalsDashboard() {
  const [newGoal, setNewGoal] = useState("");
  const [goalType, setGoalType] = useState("personal");
  const [activeTab, setActiveTab] = useState("all");
  const [mainTab, setMainTab] = useState("goals");
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Complete React Course",
      type: "short-term",
      progress: 60,
      mentorAssisted: false,
      shared: false,
      category: "Technical Skills",
      priority: "high",
      deadline: "2024-03-15",
    },
    {
      id: 2,
      title: "Prepare for Job Interview",
      type: "personal",
      progress: 30,
      mentorAssisted: true,
      shared: true,
      category: "Career Development",
      priority: "high",
      deadline: "2024-02-28",
    },
    {
      id: 3,
      title: "Publish Portfolio Website",
      type: "long-term",
      progress: 85,
      mentorAssisted: false,
      shared: false,
      category: "Personal Branding",
      priority: "medium",
      deadline: "2024-04-30",
    },
    {
      id: 4,
      title: "Learn Data Analysis",
      type: "long-term",
      progress: 15,
      mentorAssisted: true,
      shared: true,
      category: "Technical Skills",
      priority: "low",
      deadline: "2024-06-30",
    },
  ]);

  const goalTypeOptions = [
    { value: "personal", label: "Personal" },
    { value: "short-term", label: "Short-Term" },
    { value: "long-term", label: "Long-Term" },
  ];

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([
      ...goals,
      {
        id: goals.length + 1,
        title: newGoal,
        type: goalType,
        progress: 0,
        mentorAssisted: false,
        shared: false,
        category: "General",
        priority: "medium",
        deadline: "",
      },
    ]);
    setNewGoal("");
  };

  const updateGoalProgress = (id: number, increment: number) => {
    setGoals(
      goals.map((g) =>
        g.id === id
          ? {
              ...g,
              progress: Math.min(100, Math.max(0, g.progress + increment)),
            }
          : g
      )
    );
  };

  const toggleMentorAssistance = (id: number) => {
    setGoals(
      goals.map((g) =>
        g.id === id ? { ...g, mentorAssisted: !g.mentorAssisted } : g
      )
    );
  };

  const toggleShared = (id: number) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, shared: !g.shared } : g)));
  };

  const exportGoals = () => {
    const dataStr = JSON.stringify(goals, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-career-goals.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredGoals =
    activeTab === "all" ? goals : goals.filter((g) => g.type === activeTab);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-accent text-accent-foreground";
      case "low":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Redesigned Header Section - Consistent with Dashboard */}
      <div className='border-b border-border bg-muted/30'>
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold tracking-tight text-foreground'>
                Craft Your Career Journey
              </h1>
              <p className='text-muted-foreground max-w-2xl'>
                Set ambitious goals, track meaningful progress, and collaborate with
                mentors to accelerate your professional growth.
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-wrap gap-3'>
              <Button onClick={exportGoals} variant='outline' className='gap-2'>
                <Download className='h-4 w-4' />
                Export Goals
              </Button>
              <Button className='gap-2 bg-primary'>
                <Plus className='h-4 w-4' />
                New Goal
              </Button>
            </div>
          </div>

          {/* Feature Badges */}
          <div className='flex flex-wrap gap-3 mt-6'>
            <Badge variant='secondary' className='px-3 py-1.5 text-sm gap-2'>
              <Target className='h-4 w-4' />
              Goal Setting
            </Badge>
            <Badge variant='secondary' className='px-3 py-1.5 text-sm gap-2'>
              <TrendingUp className='h-4 w-4' />
              Progress Tracking
            </Badge>
            <Badge variant='secondary' className='px-3 py-1.5 text-sm gap-2'>
              <Users className='h-4 w-4' />
              Mentor Collaboration
            </Badge>
            <Badge variant='secondary' className='px-3 py-1.5 text-sm gap-2'>
              <Award className='h-4 w-4' />
              Career Roadmaps
            </Badge>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Main Navigation Tabs - Only Goals and Roadmaps */}
        <Tabs value={mainTab} onValueChange={setMainTab} className='mb-8'>
          <TabsList className='grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2 mb-8'>
            <TabsTrigger value='goals' className='flex items-center gap-2'>
              <Target className='h-4 w-4' />
              <span>Goals</span>
            </TabsTrigger>
            <TabsTrigger value='roadmaps' className='flex items-center gap-2'>
              <Map className='h-4 w-4' />
              <span>Roadmaps</span>
            </TabsTrigger>
          </TabsList>

          {/* Goals Tab */}
          <TabsContent value='goals' className='space-y-8'>
            {/* Goal Creation Section */}
            <Card className='shadow-card'>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <span className='flex items-center gap-2'>
                    <Plus className='h-5 w-5 text-primary' />
                    Set New Goal
                  </span>
                  <Button onClick={exportGoals} variant='outline' size='sm'>
                    <Download className='h-4 w-4 mr-2' />
                    Export Goals
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex flex-col lg:flex-row gap-4'>
                  <Input
                    placeholder='What would you like to achieve? Be specific...'
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    className='flex-1 text-foreground placeholder:text-muted-foreground'
                    onKeyPress={(e) => e.key === "Enter" && addGoal()}
                  />
                  <EnhancedSelect
                    value={goalType}
                    onValueChange={setGoalType}
                    options={goalTypeOptions}
                    placeholder='Goal Type'
                    className='w-full lg:w-48 bg-background border-border text-foreground'
                  />
                  <Button onClick={addGoal} className='lg:w-auto'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Goal
                  </Button>
                </div>

                {/* Goal Type Filters */}
                <div className='flex flex-wrap gap-2'>
                  {["all", "personal", "short-term", "long-term"].map((tab) => (
                    <Button
                      key={tab}
                      variant={activeTab === tab ? "default" : "outline"}
                      onClick={() => setActiveTab(tab)}
                      size='sm'>
                      <Filter className='h-3 w-3 mr-1' />
                      {tab.charAt(0).toUpperCase() +
                        tab.slice(1).replace("-", " ")}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Goals Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
              {filteredGoals.map((goal) => (
                <Card
                  key={goal.id}
                  className='group hover:shadow-elevation transition-all duration-300 shadow-card'>
                  <CardHeader>
                    <CardTitle className='flex items-start justify-between gap-2'>
                      <span className='text-lg leading-tight'>
                        {goal.title}
                      </span>
                      <div className='flex gap-1 flex-shrink-0'>
                        {goal.shared ? (
                          <Share2 className='h-4 w-4 text-secondary' />
                        ) : (
                          <Lock className='h-4 w-4 text-muted-foreground' />
                        )}
                        {goal.mentorAssisted && (
                          <Users className='h-4 w-4 text-accent' />
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex items-center justify-between text-sm'>
                      <Badge variant='outline' className='capitalize'>
                        {goal.type.replace("-", " ")}
                      </Badge>
                      <Badge className={getPriorityColor(goal.priority)}>
                        {goal.priority}
                      </Badge>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm font-medium'>Progress</span>
                        <span className='text-lg font-bold text-primary'>
                          {goal.progress}%
                        </span>
                      </div>
                      <Progress value={goal.progress} className='h-3' />

                      {/* Progress Controls */}
                      <div className='flex justify-center gap-1 pt-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => updateGoalProgress(goal.id, -10)}
                          className='h-7 w-7 p-0'>
                          -
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => updateGoalProgress(goal.id, 10)}
                          className='h-7 w-7 p-0'>
                          +
                        </Button>
                      </div>
                    </div>

                    <div className='flex flex-col gap-2'>
                      <Button
                        size='sm'
                        variant={goal.mentorAssisted ? "default" : "outline"}
                        onClick={() => toggleMentorAssistance(goal.id)}
                        className='w-full justify-start'>
                        <MessageCircle className='h-4 w-4 mr-2' />
                        {goal.mentorAssisted
                          ? "Mentor Connected"
                          : "Request Mentor"}
                      </Button>
                      <Button
                        size='sm'
                        variant={goal.shared ? "default" : "outline"}
                        onClick={() => toggleShared(goal.id)}
                        className='w-full justify-start'>
                        {goal.shared ? (
                          <Share2 className='h-4 w-4 mr-2' />
                        ) : (
                          <Lock className='h-4 w-4 mr-2' />
                        )}
                        {goal.shared ? "Public Goal" : "Keep Private"}
                      </Button>
                    </div>

                    {goal.progress >= 100 && (
                      <div className='flex items-center justify-center p-2 bg-gradient-success rounded-lg text-white'>
                        <Award className='h-4 w-4 mr-2' />
                        <span className='text-sm font-medium'>Completed!</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Stats */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <Card className='text-center shadow-card'>
                <CardContent className='pt-6'>
                  <div className='text-2xl font-bold text-primary'>
                    {goals.length}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Total Goals
                  </div>
                </CardContent>
              </Card>
              <Card className='text-center shadow-card'>
                <CardContent className='pt-6'>
                  <div className='text-2xl font-bold text-secondary'>
                    {goals.filter((g) => g.mentorAssisted).length}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    With Mentors
                  </div>
                </CardContent>
              </Card>
              <Card className='text-center shadow-card'>
                <CardContent className='pt-6'>
                  <div className='text-2xl font-bold text-accent'>
                    {goals.filter((g) => g.shared).length}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Shared Goals
                  </div>
                </CardContent>
              </Card>
              <Card className='text-center shadow-card'>
                <CardContent className='pt-6'>
                  <div className='text-2xl font-bold text-primary'>
                    {goals.filter((g) => g.progress >= 100).length}
                  </div>
                  <div className='text-sm text-muted-foreground'>Completed</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Roadmaps Tab */}
          <TabsContent value='roadmaps'>
            <RoadmapGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
