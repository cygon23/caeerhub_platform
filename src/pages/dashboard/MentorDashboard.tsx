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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Calendar,
  FileText,
  BookOpen,
  BarChart3,
  MessageCircle,
  Star,
  Clock,
  Target,
  ChevronDown,
  LogOut,
  User,
  TrendingUp,
  Award,
  Video,
  CheckCircle2,
  ArrowUpRight,
  Activity,
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
        <div className='space-y-6'>
          {/* Modern Gradient Header */}
          <div className='bg-gradient-to-r from-primary via-primary/90 to-secondary text-white rounded-xl p-8 shadow-lg relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32' />
            <div className='absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24' />
            <div className='relative z-10'>
              <h1 className='text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2'>
                Welcome back, {user?.name?.split(" ")[0] || "Mentor"}!
                <Award className='h-8 w-8 text-yellow-300' />
              </h1>
              <p className='text-white/90 text-lg mb-4'>
                You're making a real difference in young lives!
              </p>
              <div className='flex flex-wrap gap-3'>
                <Badge variant='secondary' className='bg-white/20 hover:bg-white/30 text-white border-0'>
                  <CheckCircle2 className='h-3 w-3 mr-1' />
                  8 Active Mentees
                </Badge>
                <Badge variant='secondary' className='bg-white/20 hover:bg-white/30 text-white border-0'>
                  <Clock className='h-3 w-3 mr-1' />
                  127 Hours This Year
                </Badge>
                <Badge variant='secondary' className='bg-white/20 hover:bg-white/30 text-white border-0'>
                  <Star className='h-3 w-3 mr-1 fill-yellow-300' />
                  4.9 Rating
                </Badge>
              </div>
            </div>
          </div>

          {/* Modern Stats Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* Active Mentees Card */}
            <Card className='hover:shadow-lg transition-all duration-300 hover:scale-105 border-primary/20'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-3 bg-primary/10 rounded-xl'>
                    <Users className='h-6 w-6 text-primary' />
                  </div>
                  <Badge variant='secondary' className='bg-green-100 text-green-700 hover:bg-green-100'>
                    <TrendingUp className='h-3 w-3 mr-1' />
                    +12%
                  </Badge>
                </div>
                <div className='space-y-1'>
                  <p className='text-2xl font-bold text-foreground'>8</p>
                  <p className='text-sm text-muted-foreground'>Active Mentees</p>
                  <div className='flex items-center gap-1 text-xs text-green-600'>
                    <ArrowUpRight className='h-3 w-3' />
                    <span>2 new this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hours Mentored Card */}
            <Card className='hover:shadow-lg transition-all duration-300 hover:scale-105 border-secondary/20'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-3 bg-secondary/10 rounded-xl'>
                    <Clock className='h-6 w-6 text-secondary' />
                  </div>
                  <Badge variant='secondary' className='bg-blue-100 text-blue-700 hover:bg-blue-100'>
                    <Activity className='h-3 w-3 mr-1' />
                    24h/mo
                  </Badge>
                </div>
                <div className='space-y-1'>
                  <p className='text-2xl font-bold text-foreground'>127</p>
                  <p className='text-sm text-muted-foreground'>Hours This Year</p>
                  <div className='w-full bg-muted rounded-full h-1.5 mt-2'>
                    <div className='bg-secondary h-1.5 rounded-full' style={{ width: '78%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sessions Card */}
            <Card className='hover:shadow-lg transition-all duration-300 hover:scale-105 border-primary/20'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-3 bg-purple-100 rounded-xl'>
                    <Video className='h-6 w-6 text-purple-600' />
                  </div>
                  <Badge variant='secondary' className='bg-purple-100 text-purple-700 hover:bg-purple-100'>
                    3 Today
                  </Badge>
                </div>
                <div className='space-y-1'>
                  <p className='text-2xl font-bold text-foreground'>35</p>
                  <p className='text-sm text-muted-foreground'>Sessions This Month</p>
                  <p className='text-xs text-purple-600'>Next: Today 2:00 PM</p>
                </div>
              </CardContent>
            </Card>

            {/* Rating Card */}
            <Card className='hover:shadow-lg transition-all duration-300 hover:scale-105 border-yellow-200'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-3 bg-yellow-100 rounded-xl'>
                    <Star className='h-6 w-6 text-yellow-600 fill-yellow-600' />
                  </div>
                  <Badge variant='secondary' className='bg-yellow-100 text-yellow-700 hover:bg-yellow-100'>
                    Top 5%
                  </Badge>
                </div>
                <div className='space-y-1'>
                  <p className='text-2xl font-bold text-foreground'>4.9</p>
                  <p className='text-sm text-muted-foreground'>Mentor Rating</p>
                  <div className='flex gap-0.5 mt-2'>
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className='h-3 w-3 text-yellow-500 fill-yellow-500' />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modern Mentees Cards Grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {mentees.map((mentee, index) => (
              <Card key={index} className='hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4' style={{
                borderLeftColor: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : '#8b5cf6'
              }}>
                <CardContent className='p-5'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg' style={{
                      background: index === 0 ? 'linear-gradient(135deg, #10b981, #059669)' :
                                  index === 1 ? 'linear-gradient(135deg, #3b82f6, #2563eb)' :
                                  'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                    }}>
                      {mentee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-semibold text-foreground'>{mentee.name}</h4>
                      <p className='text-xs text-muted-foreground'>{mentee.sessions} sessions</p>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div>
                      <div className='flex justify-between text-xs mb-1'>
                        <span className='text-muted-foreground'>Progress</span>
                        <span className='font-semibold text-foreground'>{mentee.progress}%</span>
                      </div>
                      <div className='w-full bg-muted rounded-full h-2'>
                        <div
                          className='h-2 rounded-full transition-all duration-500'
                          style={{
                            width: `${mentee.progress}%`,
                            background: index === 0 ? 'linear-gradient(90deg, #10b981, #059669)' :
                                       index === 1 ? 'linear-gradient(90deg, #3b82f6, #2563eb)' :
                                       'linear-gradient(90deg, #8b5cf6, #7c3aed)'
                          }}
                        />
                      </div>
                    </div>

                    <div className='flex items-center gap-2 text-xs'>
                      <Clock className='h-3 w-3 text-muted-foreground' />
                      <span className='text-muted-foreground'>{mentee.nextSession}</span>
                    </div>

                    <Button size='sm' variant='outline' className='w-full'>
                      <MessageCircle className='h-3 w-3 mr-1' />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Mentorship Tools */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Modern Messages Card */}
            <Card className='border-primary/20'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex items-center gap-2'>
                    <div className='p-2 bg-primary/10 rounded-lg'>
                      <MessageCircle className='h-5 w-5 text-primary' />
                    </div>
                    Recent Messages
                  </CardTitle>
                  <Badge variant='secondary'>3 New</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {[
                    { mentee: "Amina Hassan", message: "Thank you for the career advice on tech roles!", time: "5 min ago", color: "bg-green-50 border-green-200" },
                    { mentee: "John Mbeki", message: "Could we schedule our next session?", time: "1 hour ago", color: "bg-blue-50 border-blue-200" },
                    { mentee: "Grace Mwangi", message: "I completed the assignment you gave me", time: "3 hours ago", color: "bg-purple-50 border-purple-200" }
                  ].map((msg, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${msg.color} hover:shadow-md transition-shadow`}>
                      <div className='flex justify-between items-start mb-2'>
                        <p className='font-semibold text-foreground text-sm'>{msg.mentee}</p>
                        <span className='text-xs text-muted-foreground'>{msg.time}</span>
                      </div>
                      <p className='text-sm text-muted-foreground leading-relaxed'>{msg.message}</p>
                    </div>
                  ))}
                </div>
                <Button variant='outline' className='w-full mt-4'>View All Messages</Button>
              </CardContent>
            </Card>

            {/* Modern Goals Card */}
            <Card className='border-secondary/20'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex items-center gap-2'>
                    <div className='p-2 bg-secondary/10 rounded-lg'>
                      <Target className='h-5 w-5 text-secondary' />
                    </div>
                    Mentorship Goals
                  </CardTitle>
                  <Badge variant='secondary' className='bg-green-100 text-green-700'>
                    On Track
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-5'>
                  {[
                    { goal: "Monthly Mentoring Hours", current: 24, target: 30, color: "bg-primary", bgColor: "bg-primary/10" },
                    { goal: "Mentee Success Rate", current: 89, target: 90, color: "bg-green-500", bgColor: "bg-green-50" },
                    { goal: "Response Time (hours)", current: 2.1, target: 2.0, color: "bg-blue-500", bgColor: "bg-blue-50" }
                  ].map((goal, index) => (
                    <div key={index} className={`p-3 rounded-lg ${goal.bgColor}`}>
                      <div className='flex justify-between text-sm mb-2'>
                        <span className='font-medium text-foreground'>{goal.goal}</span>
                        <span className='font-bold text-foreground'>{goal.current}/{goal.target}</span>
                      </div>
                      <div className='w-full bg-muted rounded-full h-2.5'>
                        <div
                          className={`${goal.color} h-2.5 rounded-full transition-all duration-500 relative overflow-hidden`}
                          style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                        >
                          <div className='absolute inset-0 bg-white/20 animate-pulse' />
                        </div>
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>
                        {goal.current >= goal.target ? '✓ Goal Achieved!' : `${(goal.target - goal.current).toFixed(1)} to go`}
                      </p>
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
        <Sidebar className='border-r border-border hidden md:flex'>
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

          {/* Professional User Profile Section */}
          <div className='p-3 border-t border-border bg-muted/30'>
            <DropdownMenu>
              <DropdownMenuTrigger className='w-full focus:outline-none'>
                <div className='flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group'>
                  {/* Avatar with Initials */}
                  <Avatar className='h-10 w-10 border-2 border-primary/30'>
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback className='bg-gradient-hero text-primary-foreground font-semibold text-sm'>
                      {user?.name?.charAt(0)?.toUpperCase() || 'M'}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className='flex-1 text-left min-w-0'>
                    <div className='text-sm font-medium text-foreground truncate'>
                      {user?.name || 'Mentor'}
                    </div>
                    <div className='flex items-center gap-1.5 mt-0.5'>
                      <Badge
                        variant='outline'
                        className='text-[10px] px-1.5 py-0 h-4 font-medium border-primary/30 bg-primary/5 text-primary'
                      >
                        Mentor
                      </Badge>
                    </div>
                  </div>

                  {/* Dropdown Icon */}
                  <ChevronDown className='h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0' />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align='end'
                className='w-56 mb-2'
                sideOffset={8}
              >
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      {user?.name || 'Mentor'}
                    </p>
                    <p className='text-xs leading-none text-muted-foreground'>
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveSection('profile')}>
                  <User className='h-4 w-4 mr-2' />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className='text-destructive focus:text-destructive'>
                  <LogOut className='h-4 w-4 mr-2' />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Sidebar>

        <main className='flex-1 w-full min-w-0'>
          <header className='h-16 border-b border-border bg-background/95 backdrop-blur-sm flex items-center px-4 md:px-6'>
            <SidebarTrigger className='md:hidden' />
            <div className='ml-4'>
              <h1 className='text-lg md:text-xl font-semibold text-foreground'>
                Mentor Dashboard
              </h1>
            </div>
          </header>

          <div className='p-4 md:p-6'>{renderContent()}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}