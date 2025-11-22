import { useState, useEffect } from "react";
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
  GraduationCap,
  BarChart3,
  Settings,
  Building,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import StudentManagement from "@/components/school/StudentManagement";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";

export default function SchoolAdminDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [schoolInfo, setSchoolInfo] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSchoolInfo();
  }, [user]);

  const loadSchoolInfo = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get user's profile to find school_id
      const { data: profile, error: profileError } = await (await import("@/integrations/supabase/client")).supabase
        .from('profiles')
        .select('school_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (profile?.school_id) {
        // Get school info
        const schools = await adminService.getSchools();
        const school = schools.find(s => s.registration_number === profile.school_id);
        setSchoolInfo(school);

        // Get student statistics
        const studentStats = await adminService.getStudentStats(profile.school_id);
        setStats(studentStats);
      } else {
        // No school assigned yet - show message
        console.log('No school assigned to this school admin yet');
      }
    } catch (error: any) {
      console.error('Error loading school info:', error);
      toast({
        title: "Error",
        description: "Failed to load school information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    {
      title: "School Management",
      items: [
        { title: "Student Management", icon: Users, id: "students" },
        { title: "Reports & Analytics", icon: BarChart3, id: "analytics" },
        { title: "School Profile", icon: Settings, id: "profile" },
      ]
    },
  ];

  const renderContent = () => {
    if (activeSection === "overview") {
      // Show message if no school is assigned yet
      if (!loading && !schoolInfo) {
        return (
          <div className='space-y-8'>
            <div className='bg-gradient-hero text-white rounded-lg p-8'>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className='text-3xl font-bold mb-2'>
                    School Admin Dashboard
                  </h1>
                  <p className='text-white/90 text-lg'>
                    Welcome! Your account is being set up.
                  </p>
                </div>
                <Building className="h-16 w-16 text-white/50" />
              </div>
            </div>

            <Card>
              <CardContent className='p-12 text-center'>
                <div className='w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Building className='h-8 w-8 text-white' />
                </div>
                <h3 className='text-xl font-semibold text-foreground mb-2'>
                  No School Assigned Yet
                </h3>
                <p className='text-muted-foreground'>
                  Your school admin account has been created, but no school has been assigned yet.
                  Please contact the administrator to link your account to a school.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      }

      return (
        <div className='space-y-8'>
          <div className='bg-gradient-hero text-white rounded-lg p-8'>
            <div className="flex items-center justify-between">
              <div>
                <h1 className='text-3xl font-bold mb-2'>
                  {schoolInfo?.school_name || 'School'} Dashboard
                </h1>
                <p className='text-white/90 text-lg'>
                  Welcome back! Manage your students and view school statistics.
                </p>
              </div>
              <Building className="h-16 w-16 text-white/50" />
            </div>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
            <Card>
              <CardContent className='p-6 text-center'>
                <Users className='h-8 w-8 text-primary mx-auto mb-2' />
                <div className='text-2xl font-bold text-foreground'>
                  {stats?.total || 0}
                </div>
                <div className='text-muted-foreground'>Total Students</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6 text-center'>
                <GraduationCap className='h-8 w-8 text-secondary mx-auto mb-2' />
                <div className='text-2xl font-bold text-foreground'>
                  {stats?.byStatus.active || 0}
                </div>
                <div className='text-muted-foreground'>Active Students</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6 text-center'>
                <TrendingUp className='h-8 w-8 text-green-500 mx-auto mb-2' />
                <div className='text-2xl font-bold text-foreground'>
                  {stats?.byStatus.graduated || 0}
                </div>
                <div className='text-muted-foreground'>Graduated</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-6 text-center'>
                <Users className='h-8 w-8 text-orange-500 mx-auto mb-2' />
                <div className='text-2xl font-bold text-foreground'>
                  {Object.keys(stats?.byFormLevel || {}).length}
                </div>
                <div className='text-muted-foreground'>Form Levels</div>
              </CardContent>
            </Card>
          </div>

          {/* Students by Form Level */}
          <Card>
            <CardHeader>
              <CardTitle>Students by Form Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
                {[1, 2, 3, 4, 5, 6].map(form => (
                  <div key={form} className="text-center p-4 bg-gradient-accent rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {stats?.byFormLevel[form] || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Form {form}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => setActiveSection('students')}
                className="h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span>Manage Students</span>
              </Button>
              <Button
                onClick={() => setActiveSection('analytics')}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span>View Reports</span>
              </Button>
              <Button
                onClick={() => setActiveSection('profile')}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2">
                <Settings className="h-6 w-6" />
                <span>School Settings</span>
              </Button>
            </CardContent>
          </Card>

          {/* School Info */}
          {schoolInfo && (
            <Card>
              <CardHeader>
                <CardTitle>School Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">School Name</p>
                    <p className="font-medium">{schoolInfo.school_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Registration Number</p>
                    <p className="font-medium"><code className="bg-muted px-2 py-1 rounded">{schoolInfo.registration_number}</code></p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Email</p>
                    <p className="font-medium">{schoolInfo.contact_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Phone</p>
                    <p className="font-medium">{schoolInfo.contact_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="default" className="capitalize">{schoolInfo.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    if (activeSection === "students") {
      // Get school_id from profile
      const schoolId = schoolInfo?.registration_number;
      if (!schoolId) {
        return <div>Loading school information...</div>;
      }
      return <StudentManagement schoolId={schoolId} />;
    }

    if (activeSection === "analytics") {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Reports & Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Detailed reports and analytics will be available here. Track student performance,
              attendance, and other metrics.
            </p>
          </CardContent>
        </Card>
      );
    }

    if (activeSection === "profile") {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              School Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Update school contact information and preferences here.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardContent className='p-12 text-center'>
          <div className='w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4'>
            <Settings className='h-8 w-8 text-white' />
          </div>
          <h3 className='text-xl font-semibold text-foreground mb-2'>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h3>
          <p className='text-muted-foreground'>
            This feature will be available soon.
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
              <div>
                <span className='text-black font-bold block'>careerHub</span>
                <span className='text-xs text-muted-foreground'>School Admin</span>
              </div>
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
              {user?.email}
            </div>
            {schoolInfo && (
              <div className='text-xs text-muted-foreground mt-1'>
                {schoolInfo.school_name}
              </div>
            )}
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
                {schoolInfo?.school_name || 'School'} Admin Dashboard
              </h1>
            </div>
          </header>

          <div className='p-4 md:p-6'>{renderContent()}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
