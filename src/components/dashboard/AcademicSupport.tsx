import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, GraduationCap, Calendar, Clock, Users, Award, FileText } from "lucide-react";

export const AcademicSupport = () => {
  const subjects = [
    { name: "Mathematics", progress: 75, grade: "B+", assignments: 3 },
    { name: "Science", progress: 88, grade: "A-", assignments: 2 },
    { name: "English", progress: 92, grade: "A", assignments: 1 },
    { name: "History", progress: 68, grade: "B", assignments: 4 },
  ];

  const upcomingAssignments = [
    { title: "Math Calculus Project", subject: "Mathematics", dueDate: "2024-03-15", priority: "High" },
    { title: "Science Lab Report", subject: "Science", dueDate: "2024-03-18", priority: "Medium" },
    { title: "History Essay", subject: "History", dueDate: "2024-03-22", priority: "Low" },
  ];

  const studyGroups = [
    { name: "Math Study Circle", members: 8, nextSession: "Today 4:00 PM", subject: "Mathematics" },
    { name: "Science Lab Partners", members: 6, nextSession: "Tomorrow 2:00 PM", subject: "Science" },
    { name: "Literature Discussion", members: 12, nextSession: "Friday 3:30 PM", subject: "English" },
  ];

  const resources = [
    { title: "Khan Academy Integration", type: "Online Learning", status: "Available" },
    { title: "Digital Library Access", type: "Research", status: "Available" },
    { title: "Tutoring Sessions", type: "One-on-One", status: "Book Now" },
    { title: "Study Guides", type: "Materials", status: "Download" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold">Academic Support</h2>
          <p className="text-muted-foreground">Track progress and access learning resources</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subject Progress
            </CardTitle>
            <CardDescription>
              Your current academic performance overview
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{subject.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{subject.grade}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {subject.assignments} pending
                    </span>
                  </div>
                </div>
                <Progress value={subject.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{subject.progress}% completed</span>
                  <span>This semester</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Assignments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAssignments.map((assignment, index) => (
              <div key={index} className="p-3 rounded-lg border space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{assignment.title}</h4>
                  <Badge 
                    variant={assignment.priority === "High" ? "destructive" : 
                            assignment.priority === "Medium" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {assignment.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Study Groups
            </CardTitle>
            <CardDescription>
              Collaborative learning sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {studyGroups.map((group, index) => (
              <div key={index} className="p-3 rounded-lg border space-y-2">
                <h4 className="font-medium text-sm">{group.name}</h4>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{group.members} members</span>
                  <span>{group.subject}</span>
                </div>
                <p className="text-xs text-primary font-medium">{group.nextSession}</p>
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Join Session
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Learning Resources
            </CardTitle>
            <CardDescription>
              Tools and materials to support your academic journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{resource.title}</p>
                      <p className="text-xs text-muted-foreground">{resource.type}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    {resource.status}
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