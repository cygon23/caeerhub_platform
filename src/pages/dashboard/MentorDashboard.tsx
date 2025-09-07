import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  FileText,
  BookOpen,
  BarChart3,
  MessageCircle,
  Star,
  Clock,
  Target
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function MentorDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");

  const sidebarItems = [
    {
      title: "Mentorship",
      items: [
        { title: "Mentees", icon: Users, id: "mentees" },
        { title: "Sessions", icon: Calendar, id: "sessions" },
        { title: "Notes", icon: FileText, id: "notes" },
        { title: "Resources", icon: BookOpen, id: "resources" }
      ]
    }
  ];

  const mentees = [
    { name: "Amina Hassan", progress: 85, sessions: 12, nextSession: "Tomorrow 2 PM" },
    { name: "John Mbeki", progress: 72, sessions: 8, nextSession: "Friday 10 AM" },
    { name: "Grace Mwangi", progress: 94, sessions: 15, nextSession: "Monday 3 PM" }
  ];

  const renderContent = () => {
    if (activeSection === "overview") {
      return (
        <div className='space-y-8'>
          <div className='bg-gradient-hero text-white rounded-lg p-8'>
            <h1 className='text-3xl font-bold mb-2'>
              Welcome, Dr. {user?.name?.split(" ")[1] || "Mwangi"}! 👨‍💻
            </h1>
            <p className='text-white/90 text-lg'>
              You're making a real difference in young lives!
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card>
              <CardContent className='p-6 text-center'>
                <Users className='h-8 w-8 text-primary mx-auto mb-2' />
                <div className='text-2xl font-bold text-foreground'>8</div>
                <div className='text-muted-foreground'>Active Mentees</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6 text-center'>
                <Calendar className='h-8 w-8 text-secondary mx-auto mb-2' />
                <div className='text-2xl font-bold text-foreground'>
                  127
                </div>
                <div className='text-muted-foreground'>Hours Mentored</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6 text-center'>
                <Star className='h-8 w-8 text-primary mx-auto mb-2' />
                <div className='text-2xl font-bold text-foreground'>
                  4.9
                </div>
                <div className='text-muted-foreground'>Mentor Rating</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Mentees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {mentees.map((mentee, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-4 bg-gradient-accent rounded-lg'>
                    <div>
                      <h4 className='font-medium text-foreground'>
                        {mentee.name}
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        {mentee.sessions} sessions completed
                      </p>
                    </div>
                    <div className='text-right'>
                      <Badge variant='secondary'>
                        {mentee.progress}% Progress
                      </Badge>
                      <p className='text-xs text-muted-foreground mt-1'>
                        {mentee.nextSession}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Mentorship Tools */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <MessageCircle className='h-5 w-5 mr-2' />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { mentee: "Amina Hassan", message: "Thank you for the career advice on tech roles!", time: "5 min ago" },
                    { mentee: "John Mbeki", message: "Could we schedule our next session?", time: "1 hour ago" },
                    { mentee: "Grace Mwangi", message: "I completed the assignment you gave me", time: "3 hours ago" }
                  ].map((msg, index) => (
                    <div key={index} className='p-3 bg-gradient-accent rounded-lg'>
                      <div className='flex justify-between items-start mb-1'>
                        <p className='font-medium text-foreground text-sm'>{msg.mentee}</p>
                        <span className='text-xs text-muted-foreground'>{msg.time}</span>
                      </div>
                      <p className='text-sm text-muted-foreground'>{msg.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Target className='h-5 w-5 mr-2' />
                  Mentorship Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    { goal: "Monthly Mentoring Hours", current: 24, target: 30 },
                    { goal: "Mentee Success Rate", current: 89, target: 90 },
                    { goal: "Response Time (hours)", current: 2.1, target: 2.0 }
                  ].map((goal, index) => (
                    <div key={index} className='space-y-2'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>{goal.goal}</span>
                        <span className='font-medium'>{goal.current}/{goal.target}</span>
                      </div>
                      <div className='w-full bg-muted rounded-full h-2'>
                        <div 
                          className='bg-primary h-2 rounded-full transition-all duration-300'
                          style={{ width: `${(goal.current / goal.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    if (activeSection === "mentees") {
      return (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Users className='h-5 w-5 mr-2' />
              My Mentees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {mentees.map((mentee, index) => (
                <Card key={index} className='hover:shadow-primary transition-all duration-300'>
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-3 mb-4'>
                      <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center'>
                        <Users className='h-6 w-6 text-primary' />
                      </div>
                      <div>
                        <h3 className='font-semibold text-foreground'>{mentee.name}</h3>
                        <p className='text-sm text-muted-foreground'>{mentee.sessions} sessions</p>
                      </div>
                    </div>
                    <div className='space-y-3'>
                      <div>
                        <div className='flex justify-between text-sm mb-1'>
                          <span>Progress</span>
                          <span>{mentee.progress}%</span>
                        </div>
                        <div className='w-full bg-muted rounded-full h-2'>
                          <div 
                            className='bg-primary h-2 rounded-full'
                            style={{ width: `${mentee.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className='text-sm'>
                        <p className='text-muted-foreground'>Next Session:</p>
                        <p className='font-medium'>{mentee.nextSession}</p>
                      </div>
                      <Button size="sm" className='w-full'>
                        <MessageCircle className='h-4 w-4 mr-2' />
                        Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    // Other sections
    return (
      <Card>
        <CardContent className='p-12 text-center'>
          <div className='w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4'>
            <Clock className='h-8 w-8 text-white' />
          </div>
          <h3 className='text-xl font-semibold text-foreground mb-2'>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h3>
          <p className='text-muted-foreground'>
            This mentorship feature will be available soon with comprehensive tools.
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <SidebarProvider>
      <div className='min-h-screen flex w-full bg-background'>
        <Sidebar className='border-r border-border'>
          <div className='p-4 border-b border-border'>
            <div className='flex items-center space-x-2'>
              <img
                src='/logo.png'
                alt='Career na Mimi Logo'
                className='h-8 w-8'
                style={{ maxWidth: 120 }}
              />
              <span className='text-black font-bold '>careerHub</span>
            </div>
          </div>

          <SidebarContent>
            <div className='p-4'>
              <Button
                variant={activeSection === "overview" ? "default" : "ghost"}
                className='w-full justify-start mb-4'
                onClick={() => setActiveSection("overview")}>
                <BarChart3 className='h-4 w-4 mr-2' />
                Dashboard Overview
              </Button>
            </div>

            {sidebarItems.map((group, index) => (
              <SidebarGroup key={index}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => setActiveSection(item.id)}
                          className={
                            activeSection === item.id
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }>
                          <item.icon className='h-4 w-4' />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <div className='p-4 border-t border-border'>
            <div className='text-xs text-muted-foreground mb-2'>
              Logged in as:
            </div>
            <div className='text-sm font-medium text-foreground'>
              {user?.name}
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={logout}
              className='w-full mt-2 text-muted-foreground hover:text-foreground'>
              Sign Out
            </Button>
          </div>
        </Sidebar>

        <main className='flex-1'>
          <header className='h-16 border-b border-border bg-background/95 backdrop-blur-sm flex items-center px-6'>
            <SidebarTrigger />
            <div className='ml-4'>
              <h1 className='text-xl font-semibold text-foreground'>
                Mentor Dashboard
              </h1>
            </div>
          </header>

          <div className='p-6'>{renderContent()}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}