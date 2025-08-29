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
    }
  ];

  return (
    <SidebarProvider>
      <div className='min-h-screen flex w-full bg-background'>
        <Sidebar className='border-r border-border'>
          <div className='p-4 border-b border-border'>
            <div className='flex items-center space-x-2'>
              {/* Replace the span below with your logo */}
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
                Admin Dashboard
              </h1>
            </div>
          </header>

          <div className='p-6'>
            <div className='space-y-8'>
              <div className='bg-gradient-hero text-white rounded-lg p-8'>
                <h1 className='text-3xl font-bold mb-2'>
                  Admin Control Center 🚀
                </h1>
                <p className='text-white/90 text-lg'>
                  Managing the Career na Mimi platform
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
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

              <Card>
                <CardHeader>
                  <CardTitle>Platform Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-center py-12'>
                    <Settings className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
                    <h3 className='text-xl font-semibold text-foreground mb-2'>
                      Admin Features Available
                    </h3>
                    <p className='text-muted-foreground'>
                      All administrative functions are ready for management and
                      oversight.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}