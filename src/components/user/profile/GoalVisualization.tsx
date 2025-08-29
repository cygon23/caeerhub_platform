import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Award, Calendar, BarChart3 } from "lucide-react";

interface GoalVisualizationProps {
  goals: Array<{
    id: number;
    title: string;
    type: string;
    progress: number;
    mentorAssisted: boolean;
    shared: boolean;
  }>;
}

export default function GoalVisualization({ goals }: GoalVisualizationProps) {
  const totalProgress =
    goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
      : 0;
  const completedGoals = goals.filter((g) => g.progress >= 100).length;
  const mentorAssistedGoals = goals.filter((g) => g.mentorAssisted).length;

  // Mock data for visualizations
  const progressData = [
    { month: "Jan", value: 20 },
    { month: "Feb", value: 35 },
    { month: "Mar", value: 45 },
    { month: "Apr", value: 60 },
    { month: "May", value: 75 },
    { month: "Jun", value: totalProgress },
  ];

  const categoryData = [
    {
      name: "Personal",
      count: goals.filter((g) => g.type === "personal").length,
      color: "bg-primary",
    },
    {
      name: "Short-term",
      count: goals.filter((g) => g.type === "short-term").length,
      color: "bg-secondary",
    },
    {
      name: "Long-term",
      count: goals.filter((g) => g.type === "long-term").length,
      color: "bg-accent",
    },
  ];

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* Overall Progress Chart */}
      <Card className='shadow-card'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='h-5 w-5 text-primary' />
            Monthly Progress Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {progressData.map((item, index) => (
              <div key={item.month} className='flex items-center gap-4'>
                <span className='w-8 text-sm font-medium'>{item.month}</span>
                <div className='flex-1'>
                  <Progress value={item.value} className='h-3' />
                </div>
                <span className='w-12 text-sm text-muted-foreground text-right'>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
          <div className='mt-6 p-4 bg-gradient-success rounded-lg text-white'>
            <div className='flex items-center justify-between'>
              <span className='font-medium'>Current Average</span>
              <span className='text-2xl font-bold'>{totalProgress}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Categories Distribution */}
      <Card className='shadow-card'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BarChart3 className='h-5 w-5 text-primary' />
            Goals by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {categoryData.map((category) => (
              <div key={category.name} className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <span className='font-medium'>{category.name}</span>
                  <Badge variant='secondary'>{category.count} goals</Badge>
                </div>
                <div className='w-full bg-muted rounded-full h-3'>
                  <div
                    className={`h-3 rounded-full ${category.color} transition-all duration-500`}
                    style={{
                      width:
                        goals.length > 0
                          ? `${(category.count / goals.length) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Statistics Cards */}
          <div className='mt-6 grid grid-cols-2 gap-4'>
            <div className='p-3 bg-gradient-card rounded-lg text-center'>
              <Award className='h-6 w-6 text-accent mx-auto mb-1' />
              <div className='text-xl font-bold'>{completedGoals}</div>
              <div className='text-sm text-muted-foreground'>Completed</div>
            </div>
            <div className='p-3 bg-gradient-card rounded-lg text-center'>
              <Target className='h-6 w-6 text-secondary mx-auto mb-1' />
              <div className='text-xl font-bold'>{mentorAssistedGoals}</div>
              <div className='text-sm text-muted-foreground'>With Mentor</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Timeline */}
      <Card className='lg:col-span-2 shadow-card'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Calendar className='h-5 w-5 text-primary' />
            Achievement Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='relative'>
            {/* Timeline line */}
            <div className='absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent'></div>

            <div className='space-y-6'>
              {goals
                .filter((goal) => goal.progress > 0)
                .sort((a, b) => b.progress - a.progress)
                .slice(0, 4)
                .map((goal, index) => (
                  <div
                    key={goal.id}
                    className='relative flex items-center gap-4'>
                    {/* Timeline dot */}
                    <div
                      className={`w-3 h-3 rounded-full ${
                        goal.progress >= 100 ? "bg-secondary" : "bg-primary"
                      } border-2 border-white shadow-md`}></div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <h4 className='font-medium truncate'>{goal.title}</h4>
                        <Badge variant='outline' className='ml-2'>
                          {goal.progress}%
                        </Badge>
                      </div>
                      <div className='flex items-center gap-2 mt-1'>
                        <span className='text-sm text-muted-foreground capitalize'>
                          {goal.type}
                        </span>
                        {goal.mentorAssisted && (
                          <Badge variant='secondary' className='text-xs'>
                            Mentor Assisted
                          </Badge>
                        )}
                      </div>
                      <Progress value={goal.progress} className='mt-2 h-1.5' />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
