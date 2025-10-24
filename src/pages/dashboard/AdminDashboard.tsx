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
  UserCheck,
  Building,
  Briefcase,
  BookOpen,
  Bell,
  BarChart3,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserManagement from "@/components/admin/UserManagement";
import MentorManagement from "@/components/admin/MentorManagement";
import PartnerManagement from "@/components/admin/PartnerManagement";
import JobBoardManagement from "@/components/admin/JobBoardManagement";
import LearningModulesManagement from "@/components/admin/LearningModulesManagement";
import NotificationManagement from "@/components/admin/NotificationManagement";
import AdminProfile from "@/components/admin/AdminProfile";
import AuditLog from "@/components/admin/AuditLog";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");

  const sidebarItems = [
    {
      title: "Management",
      items: [
        { title: "User Management", icon: Users, id: "users" },
        { title: "Mentor Management", icon: UserCheck, id: "mentors" },
        { title: "Partner Management", icon: Building, id: "partners" },
        { title: "Job Board", icon: Briefcase, id: "jobs" },
        { title: "Learning Modules", icon: BookOpen, id: "modules" },
        { title: "Notifications", icon: Bell, id: "notifications" },
        { title: "Analytics", icon: BarChart3, id: "analytics" }
      ]
    },
    {
      title: "System",
      items: [
        { title: "Profile Settings", icon: Settings, id: "profile" },
        { title: "Audit Log", icon: Settings, id: "audit" }
      ]
    }
  ];

  const renderContent = () => {
    if (activeSection === "overview") {
      return (
        <div className='space-y-8'>
          <div className='bg-gradient-hero text-white rounded-lg p-8'>
            <h1 className='text-3xl font-bold mb-2'>
              Admin Control Center 🚀
            </h1>
            <p className='text-white/90 text-lg'>
              Managing the Career na Mimi platform
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
            <Card>
              <CardContent className='p-6 text-center'>
                <Users className='h-8 w-8 text-primary mx-auto mb-2' />
                <div className='text-2xl font-bold text-foreground'>
                  42,156
                </div>
                <div className='text-muted-foreground'>Total Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6 text-center'>
                <UserCheck className='h-8 w-8 text-secondary mx-auto mb-2' />
                <div className='text-2xl font-bold text-foreground'>
                  127
                </div>
                <div className='text-muted-foreground'>Active Mentors</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6 text-center'>
                <Building className='h-8 w-8 text-primary mx-auto mb-2' />
                <div className='text-2xl font-bold text-foreground'>52</div>
                <div className='text-muted-foreground'>Partners</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6 text-center'>
                <BookOpen className='h-8 w-8 text-secondary mx-auto mb-2' />
                <div className='text-2xl font-bold text-foreground'>89</div>
                <div className='text-muted-foreground'>
                  Learning Modules
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Recent User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    { user: "Amina Hassan", action: "Completed Career Assessment", time: "2 min ago" },
                    { user: "John Mbeki", action: "Started ICT Module", time: "15 min ago" },
                    { user: "Grace Mwangi", action: "Joined Mentorship Program", time: "1 hour ago" },
                    { user: "David Keter", action: "Generated CV", time: "2 hours ago" }
                  ].map((activity, index) => (
                    <div key={index} className='flex items-center justify-between p-3 bg-gradient-accent rounded-lg'>
                      <div>
                        <p className='font-medium text-foreground'>{activity.user}</p>
                        <p className='text-sm text-muted-foreground'>{activity.action}</p>
                      </div>
                      <span className='text-xs text-muted-foreground'>{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    { metric: "Server Uptime", value: "99.9%", status: "excellent" },
                    { metric: "API Response Time", value: "245ms", status: "good" },
                    { metric: "Database Performance", value: "Optimal", status: "excellent" },
                    { metric: "Error Rate", value: "0.02%", status: "excellent" }
                  ].map((health, index) => (
                    <div key={index} className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>{health.metric}</span>
                      <div className='flex items-center space-x-2'>
                        <span className='text-sm font-medium text-foreground'>{health.value}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          health.status === 'excellent' ? 'bg-green-500' : 
                          health.status === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
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

    if (activeSection === "users") {
      return <UserManagement />;
    }

    if (activeSection === "mentors") {
      return <MentorManagement />;
    }

    if (activeSection === "partners") {
      return <PartnerManagement />;
    }

    if (activeSection === "jobs") {
      return <JobBoardManagement />;
    }

    if (activeSection === "modules") {
      return <LearningModulesManagement />;
    }

    if (activeSection === "notifications") {
      return <NotificationManagement />;
    }

    if (activeSection === "profile") {
      return <AdminProfile />;
    }

    if (activeSection === "audit") {
      return <AuditLog />;
    }

    if (activeSection === "analytics") {
      return (
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <BarChart3 className='h-5 w-5 mr-2' />
                Platform Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <div className='space-y-2'>
                  <p className='text-sm text-muted-foreground'>Daily Active Users</p>
                  <p className='text-2xl font-bold text-foreground'>8,543</p>
                  <div className='flex items-center text-sm text-green-600'>
                    +12.5% from yesterday
                  </div>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm text-muted-foreground'>Course Completion Rate</p>
                  <p className='text-2xl font-bold text-foreground'>87.3%</p>
                  <div className='flex items-center text-sm text-green-600'>
                    +3.2% from last week
                  </div>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm text-muted-foreground'>Mentor-Youth Matches</p>
                  <p className='text-2xl font-bold text-foreground'>1,247</p>
                  <div className='flex items-center text-sm text-green-600'>
                    +8.7% from last month
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Other sections 
    return (
      <Card>
        <CardContent className='p-12 text-center'>
          <div className='w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4'>
            <Settings className='h-8 w-8 text-white' />
          </div>
          <h3 className='text-xl font-semibold text-foreground mb-2'>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Management
          </h3>
          <p className='text-muted-foreground'>
            This administrative feature will be available soon with comprehensive management tools.
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

        <main className='flex-1 w-full min-w-0'>
          <header className='h-16 border-b border-border bg-background/95 backdrop-blur-sm flex items-center px-4 md:px-6'>
            <SidebarTrigger className='md:hidden' />
            <div className='ml-4'>
              <h1 className='text-lg md:text-xl font-semibold text-foreground'>
                Admin Dashboard
              </h1>
            </div>
          </header>

          <div className='p-4 md:p-6'>{renderContent()}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
