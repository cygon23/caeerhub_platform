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
import SchoolManagement from "@/components/admin/SchoolManagement";
import PartnerManagement from "@/components/admin/PartnerManagement";
import JobBoardManagement from "@/components/admin/JobBoardManagement";
import LearningModulesManagement from "@/components/admin/LearningModulesManagement";
import NotificationManagement from "@/components/admin/NotificationManagement";
import AdminProfile from "@/components/admin/AdminProfile";
import AuditLog from "@/components/admin/AuditLog";
import SystemAnalytics from "@/components/admin/SystemAnalytics";
import { DashboardOverview } from "@/components/admin/DashboardOverview";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");

  const sidebarItems = [
    {
      title: "Management",
      items: [
        { title: "User Management", icon: Users, id: "users" },
        { title: "Mentor Management", icon: UserCheck, id: "mentors" },
        { title: "School Management", icon: Building, id: "schools" },
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
      return <DashboardOverview />;
    }

    if (activeSection === "users") {
      return <UserManagement />;
    }

    if (activeSection === "mentors") {
      return <MentorManagement />;
    }

    if (activeSection === "schools") {
      return <SchoolManagement />;
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
      return <SystemAnalytics />;
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
