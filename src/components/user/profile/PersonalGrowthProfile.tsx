import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Briefcase,
  GraduationCap,
  Trophy,
  TrendingUp,
  Calendar,
  Star,
  Target,
  BookOpen,
  Users,
} from "lucide-react";

interface PersonalGrowthProfileProps {
  goals: Array<{
    id: number;
    title: string;
    type: string;
    progress: number;
    mentorAssisted: boolean;
    shared: boolean;
  }>;
}

export default function PersonalGrowthProfile({
  goals,
}: PersonalGrowthProfileProps) {
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.progress >= 100).length;
  const averageProgress =
    totalGoals > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / totalGoals)
      : 0;
  const mentorGoals = goals.filter((g) => g.mentorAssisted).length;

  // Calculate growth metrics
  const skillAreas = [
    { name: "Goal Setting", progress: 85, icon: Target },
    { name: "Leadership", progress: 72, icon: Users },
    { name: "Learning", progress: 90, icon: BookOpen },
    { name: "Collaboration", progress: 68, icon: Users },
  ];

  const achievements = [
    {
      title: "Goal Achiever",
      description: `Completed ${completedGoals} goals`,
      icon: Trophy,
      earned: completedGoals >= 3,
    },
    {
      title: "Mentor Collaborator",
      description: "Working with mentors",
      icon: Users,
      earned: mentorGoals > 0,
    },
    {
      title: "Consistent Learner",
      description: "Regular progress updates",
      icon: GraduationCap,
      earned: averageProgress > 50,
    },
    {
      title: "Growth Mindset",
      description: "Diverse goal categories",
      icon: TrendingUp,
      earned: new Set(goals.map((g) => g.type)).size >= 2,
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Profile Header */}
      <Card className='bg-gradient-hero text-white shadow-elevation'>
        <CardContent className='p-8'>
          <div className='flex flex-col md:flex-row items-start gap-6'>
            <div className='w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
              <User className='h-12 w-12 text-white' />
            </div>
            <div className='flex-1'>
              <h2 className='text-3xl font-bold mb-2'>Career Growth Profile</h2>
              <p className='text-white/90 mb-4'>
                Track your professional development journey
              </p>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>{totalGoals}</div>
                  <div className='text-sm text-white/80'>Total Goals</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>{completedGoals}</div>
                  <div className='text-sm text-white/80'>Completed</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>{averageProgress}%</div>
                  <div className='text-sm text-white/80'>Avg Progress</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>{mentorGoals}</div>
                  <div className='text-sm text-white/80'>With Mentors</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Skill Development Areas */}
        <Card className='shadow-card'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Briefcase className='h-5 w-5 text-primary' />
              Skill Development Areas
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {skillAreas.map((skill) => {
              const IconComponent = skill.icon;
              return (
                <div key={skill.name} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <IconComponent className='h-4 w-4 text-primary' />
                      <span className='font-medium'>{skill.name}</span>
                    </div>
                    <span className='text-sm font-medium'>
                      {skill.progress}%
                    </span>
                  </div>
                  <Progress value={skill.progress} className='h-2' />
                </div>
              );
            })}
            <Button variant='outline' className='w-full mt-4'>
              <Star className='h-4 w-4 mr-2' />
              Update Skills Assessment
            </Button>
          </CardContent>
        </Card>

        {/* Achievements & Badges */}
        <Card className='shadow-card'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Trophy className='h-5 w-5 text-primary' />
              Achievements & Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4'>
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <div
                    key={achievement.title}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.earned
                        ? "bg-gradient-success text-white border-secondary shadow-primary"
                        : "bg-muted/30 text-muted-foreground border-muted"
                    }`}>
                    <div className='flex items-start gap-3'>
                      <IconComponent
                        className={`h-6 w-6 mt-1 ${
                          achievement.earned
                            ? "text-white"
                            : "text-muted-foreground"
                        }`}
                      />
                      <div className='flex-1'>
                        <h4 className='font-semibold'>{achievement.title}</h4>
                        <p
                          className={`text-sm ${
                            achievement.earned
                              ? "text-white/90"
                              : "text-muted-foreground"
                          }`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <Badge
                          variant='secondary'
                          className='bg-white/20 text-white'>
                          Earned
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Journey Timeline */}
      <Card className='shadow-card'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Calendar className='h-5 w-5 text-primary' />
            Growth Journey Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center gap-4 p-4 bg-gradient-card rounded-lg'>
              <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center'>
                <Target className='h-6 w-6 text-primary' />
              </div>
              <div className='flex-1'>
                <h4 className='font-semibold'>Goal Setting Journey Started</h4>
                <p className='text-sm text-muted-foreground'>
                  Began tracking professional development goals
                </p>
              </div>
              <Badge variant='outline'>Recent</Badge>
            </div>

            {completedGoals > 0 && (
              <div className='flex items-center gap-4 p-4 bg-gradient-success/10 rounded-lg'>
                <div className='w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center'>
                  <Trophy className='h-6 w-6 text-secondary' />
                </div>
                <div className='flex-1'>
                  <h4 className='font-semibold'>First Goals Completed</h4>
                  <p className='text-sm text-muted-foreground'>
                    Successfully completed {completedGoals} goal
                    {completedGoals > 1 ? "s" : ""}
                  </p>
                </div>
                <Badge className='bg-secondary text-secondary-foreground'>
                  Achievement
                </Badge>
              </div>
            )}

            {mentorGoals > 0 && (
              <div className='flex items-center gap-4 p-4 bg-gradient-accent/10 rounded-lg'>
                <div className='w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center'>
                  <Users className='h-6 w-6 text-accent' />
                </div>
                <div className='flex-1'>
                  <h4 className='font-semibold'>Mentor Collaboration</h4>
                  <p className='text-sm text-muted-foreground'>
                    Started working with mentors on {mentorGoals} goal
                    {mentorGoals > 1 ? "s" : ""}
                  </p>
                </div>
                <Badge className='bg-accent text-accent-foreground'>
                  Collaboration
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
