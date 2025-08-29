import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Map,
  Route,
  CheckCircle,
  Clock,
  Lightbulb,
  ArrowRight,
  Plus,
  RefreshCw,
  BookOpen,
  Target,
  Calendar,
} from "lucide-react";

const predefinedRoadmaps = [
  {
    id: 1,
    title: "Frontend Developer Career Path",
    description: "Complete roadmap to become a senior frontend developer",
    duration: "12-18 months",
    difficulty: "Intermediate",
    steps: [
      {
        id: 1,
        title: "Master React Fundamentals",
        completed: true,
        duration: "2 months",
      },
      {
        id: 2,
        title: "Learn TypeScript",
        completed: true,
        duration: "1 month",
      },
      {
        id: 3,
        title: "State Management (Redux/Zustand)",
        completed: false,
        duration: "1.5 months",
      },
      {
        id: 4,
        title: "Testing (Jest, React Testing Library)",
        completed: false,
        duration: "1 month",
      },
      {
        id: 5,
        title: "Performance Optimization",
        completed: false,
        duration: "1 month",
      },
      {
        id: 6,
        title: "Build Portfolio Projects",
        completed: false,
        duration: "3 months",
      },
    ],
  },
  {
    id: 2,
    title: "Product Manager Transition",
    description: "Roadmap for transitioning to product management role",
    duration: "8-12 months",
    difficulty: "Advanced",
    steps: [
      {
        id: 1,
        title: "Product Strategy Fundamentals",
        completed: false,
        duration: "2 months",
      },
      {
        id: 2,
        title: "User Research & Analytics",
        completed: false,
        duration: "1.5 months",
      },
      {
        id: 3,
        title: "Agile & Scrum Certification",
        completed: false,
        duration: "1 month",
      },
      {
        id: 4,
        title: "Product Design Collaboration",
        completed: false,
        duration: "1.5 months",
      },
      {
        id: 5,
        title: "Stakeholder Management",
        completed: false,
        duration: "1 month",
      },
      {
        id: 6,
        title: "Launch Product Feature",
        completed: false,
        duration: "3 months",
      },
    ],
  },
  {
    id: 3,
    title: "Leadership Development",
    description: "Path to develop leadership and management skills",
    duration: "6-9 months",
    difficulty: "Intermediate",
    steps: [
      {
        id: 1,
        title: "Communication Skills Workshop",
        completed: false,
        duration: "1 month",
      },
      {
        id: 2,
        title: "Team Management Basics",
        completed: false,
        duration: "1.5 months",
      },
      {
        id: 3,
        title: "Conflict Resolution Training",
        completed: false,
        duration: "1 month",
      },
      {
        id: 4,
        title: "Strategic Thinking Development",
        completed: false,
        duration: "2 months",
      },
      {
        id: 5,
        title: "Mentoring & Coaching Skills",
        completed: false,
        duration: "1.5 months",
      },
    ],
  },
];

export default function RoadmapGenerator() {
  const [selectedRoadmap, setSelectedRoadmap] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCustom = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-secondary text-secondary-foreground";
      case "intermediate":
        return "bg-accent text-accent-foreground";
      case "advanced":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStepProgress = (steps: any[]) => {
    const completed = steps.filter((step) => step.completed).length;
    return Math.round((completed / steps.length) * 100);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <Card className='bg-gradient-hero text-white shadow-elevation'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-2xl'>
            <Map className='h-6 w-6' />
            Career Roadmaps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-white/90 mb-4'>
            Follow structured learning paths or generate custom roadmaps based
            on your goals
          </p>
          <Button
            onClick={handleGenerateCustom}
            disabled={isGenerating}
            className='bg-white/20 hover:bg-white/30 text-white border-white/30'>
            {isGenerating ? (
              <>
                <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                Generating...
              </>
            ) : (
              <>
                <Plus className='h-4 w-4 mr-2' />
                Generate Custom Roadmap
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Roadmap Selection */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {predefinedRoadmaps.map((roadmap) => {
          const progress = getStepProgress(roadmap.steps);
          return (
            <Card
              key={roadmap.id}
              className={`cursor-pointer transition-all shadow-card hover:shadow-elevation ${
                selectedRoadmap === roadmap.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedRoadmap(roadmap.id)}>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <Route className='h-6 w-6 text-primary mb-2' />
                  <Badge className={getDifficultyColor(roadmap.difficulty)}>
                    {roadmap.difficulty}
                  </Badge>
                </div>
                <CardTitle className='text-lg'>{roadmap.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground text-sm mb-4'>
                  {roadmap.description}
                </p>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='flex items-center gap-1'>
                      <Clock className='h-4 w-4' />
                      {roadmap.duration}
                    </span>
                    <span className='font-medium'>{progress}%</span>
                  </div>
                  <Progress value={progress} className='h-2' />
                  <div className='text-sm text-muted-foreground'>
                    {roadmap.steps.filter((s) => s.completed).length} of{" "}
                    {roadmap.steps.length} steps completed
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Roadmap View */}
      {selectedRoadmap && (
        <Card className='shadow-card'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span className='flex items-center gap-2'>
                <Target className='h-5 w-5 text-primary' />
                {
                  predefinedRoadmaps.find((r) => r.id === selectedRoadmap)
                    ?.title
                }
              </span>
              <Button variant='outline' size='sm'>
                <BookOpen className='h-4 w-4 mr-2' />
                Start Learning
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {predefinedRoadmaps
                .find((r) => r.id === selectedRoadmap)
                ?.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className='flex items-start gap-4 p-4 rounded-lg bg-gradient-card'>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        step.completed
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}>
                      {step.completed ? (
                        <CheckCircle className='h-5 w-5' />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-1'>
                        <h4
                          className={`font-medium ${
                            step.completed
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}>
                          {step.title}
                        </h4>
                        <div className='flex items-center gap-2'>
                          <Badge variant='outline' className='text-xs'>
                            <Calendar className='h-3 w-3 mr-1' />
                            {step.duration}
                          </Badge>
                          {step.completed && (
                            <Badge className='bg-secondary text-secondary-foreground text-xs'>
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {index <
                      predefinedRoadmaps.find((r) => r.id === selectedRoadmap)!
                        .steps.length -
                        1 && (
                      <ArrowRight className='h-4 w-4 text-muted-foreground mt-2' />
                    )}
                  </div>
                ))}
            </div>

            {/* Roadmap Actions */}
            <div className='mt-6 flex flex-wrap gap-3'>
              <Button className='flex items-center gap-2'>
                <Target className='h-4 w-4' />
                Add to My Goals
              </Button>
              <Button variant='outline' className='flex items-center gap-2'>
                <Lightbulb className='h-4 w-4' />
                Get AI Suggestions
              </Button>
              <Button variant='outline' className='flex items-center gap-2'>
                <RefreshCw className='h-4 w-4' />
                Customize Roadmap
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
