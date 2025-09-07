import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, Clock, Star, Trophy, Bookmark, TrendingUp } from "lucide-react";

export const SelfLearning = () => {
  const inProgressCourses = [
    { 
      title: "Digital Marketing Fundamentals", 
      progress: 65, 
      timeLeft: "2h 30m", 
      category: "Marketing",
      difficulty: "Beginner",
      rating: 4.8
    },
    { 
      title: "Python Programming Basics", 
      progress: 45, 
      timeLeft: "4h 15m", 
      category: "Programming",
      difficulty: "Beginner",
      rating: 4.9
    },
    { 
      title: "Financial Literacy", 
      progress: 80, 
      timeLeft: "1h 20m", 
      category: "Finance",
      difficulty: "Intermediate",
      rating: 4.7
    },
  ];

  const recommendedCourses = [
    { 
      title: "Data Analysis with Excel", 
      duration: "3h 45m", 
      category: "Data Science",
      difficulty: "Beginner",
      rating: 4.6,
      students: 1250
    },
    { 
      title: "Graphic Design Principles", 
      duration: "5h 30m", 
      category: "Design",
      difficulty: "Beginner",
      rating: 4.8,
      students: 890
    },
    { 
      title: "Business Communication", 
      duration: "2h 15m", 
      category: "Soft Skills",
      difficulty: "Intermediate",
      rating: 4.9,
      students: 2100
    },
    { 
      title: "Web Development Basics", 
      duration: "6h 20m", 
      category: "Programming",
      difficulty: "Beginner",
      rating: 4.7,
      students: 1580
    },
  ];

  const learningStats = [
    { label: "Courses Completed", value: "12", icon: Trophy },
    { label: "Hours Learned", value: "48h", icon: Clock },
    { label: "Certificates Earned", value: "8", icon: Star },
    { label: "Current Streak", value: "7 days", icon: TrendingUp },
  ];

  const skillPaths = [
    { name: "Digital Marketing", courses: 8, progress: 40 },
    { name: "Data Science", courses: 12, progress: 25 },
    { name: "Software Development", courses: 15, progress: 60 },
    { name: "Business & Finance", courses: 10, progress: 30 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold">Self-Learning Hub</h2>
          <p className="text-muted-foreground">Develop skills at your own pace</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {learningStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Continue Learning
            </CardTitle>
            <CardDescription>
              Pick up where you left off
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {inProgressCourses.map((course, index) => (
              <div key={index} className="p-4 rounded-lg border space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{course.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{course.category}</Badge>
                      <Badge variant="secondary" className="text-xs">{course.difficulty}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{course.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{course.timeLeft} left</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
                <Button size="sm" className="w-full">
                  Continue Learning
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Skill Paths
            </CardTitle>
            <CardDescription>
              Structured learning journeys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillPaths.map((path, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{path.name}</span>
                  <span className="text-xs text-muted-foreground">{path.courses} courses</span>
                </div>
                <Progress value={path.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">{path.progress}% completed</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              Recommended for You
            </CardTitle>
            <CardDescription>
              Courses tailored to your interests and career goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recommendedCourses.map((course, index) => (
                <div key={index} className="p-4 rounded-lg border space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm">{course.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{course.category}</Badge>
                      <Badge variant="secondary" className="text-xs">{course.difficulty}</Badge>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                      <span>({course.students} students)</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    Start Learning
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};