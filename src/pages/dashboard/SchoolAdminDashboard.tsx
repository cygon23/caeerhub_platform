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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  GraduationCap,
  BarChart3,
  Settings,
  Building,
  TrendingUp,
  Activity,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import StudentManagement from "@/components/school/StudentManagement";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function SchoolAdminDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [schoolInfo, setSchoolInfo] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // School profile edit form state
  const [editSchoolForm, setEditSchoolForm] = useState({
    school_name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    city: '',
    region: '',
  });

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

        // Populate edit form with school info
        if (school) {
          setEditSchoolForm({
            school_name: school.school_name || '',
            contact_email: school.contact_email || '',
            contact_phone: school.contact_phone || '',
            address: school.address || '',
            city: school.city || '',
            region: school.region || '',
          });
        }

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

  const handleUpdateSchoolProfile = async () => {
    if (!schoolInfo) return;

    setSaving(true);
    try {
      await adminService.updateSchool(schoolInfo.id, editSchoolForm);

      // Reload school info
      await loadSchoolInfo();

      toast({
        title: "Success",
        description: "School profile updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating school profile:', error);
      toast({
        title: "Error",
        description: "Failed to update school profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
      // Loading state
      if (loading) {
        return (
          <div className='space-y-8'>
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        );
      }

      // Show message if no school is assigned yet
      if (!schoolInfo) {
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
      // Get school_id from profile - use empty string if not available yet
      const schoolId = schoolInfo?.registration_number || '';
      return <StudentManagement schoolId={schoolId} />;
    }

    if (activeSection === "analytics") {
      if (loading) {
        return (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        );
      }

      // Prepare chart data
      const formLevelData = stats?.byFormLevel ? Object.entries(stats.byFormLevel).map(([form, count]) => ({
        form: `Form ${form}`,
        students: count,
      })) : [];

      const statusData = stats?.byStatus ? Object.entries(stats.byStatus).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count as number,
      })) : [];

      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Reports & Analytics</h2>
            <p className="text-muted-foreground">
              Comprehensive analytics and insights about your school's student data
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <h3 className="text-2xl font-bold text-foreground">{stats?.total || 0}</h3>
                  </div>
                  <Users className="h-8 w-8 text-primary opacity-75" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <h3 className="text-2xl font-bold text-green-600">{stats?.byStatus.active || 0}</h3>
                  </div>
                  <Activity className="h-8 w-8 text-green-500 opacity-75" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Graduated</p>
                    <h3 className="text-2xl font-bold text-blue-600">{stats?.byStatus.graduated || 0}</h3>
                  </div>
                  <GraduationCap className="h-8 w-8 text-blue-500 opacity-75" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Form Levels</p>
                    <h3 className="text-2xl font-bold text-foreground">{Object.keys(stats?.byFormLevel || {}).length}</h3>
                  </div>
                  <BarChart3 className="h-8 w-8 text-secondary opacity-75" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Level Distribution Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Students by Form Level</CardTitle>
                <CardDescription>Distribution of students across form levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formLevelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="form" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="students" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Student Status Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Student Status Distribution</CardTitle>
                <CardDescription>Breakdown by active, graduated, and transferred students</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Statistics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Statistics</CardTitle>
              <CardDescription>Comprehensive breakdown of student data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(form => (
                    <div key={form} className="p-4 bg-gradient-accent rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Form {form}</h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          Total: <span className="font-medium text-foreground">{stats?.byFormLevel[form] || 0}</span>
                        </p>
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

    if (activeSection === "profile") {
      if (loading) {
        return (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-96 w-full" />
          </div>
        );
      }

      if (!schoolInfo) {
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No School Information</h3>
              <p className="text-muted-foreground">No school data available to edit.</p>
            </CardContent>
          </Card>
        );
      }

      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">School Profile Settings</h2>
            <p className="text-muted-foreground">
              Update your school's contact information and details
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                School Information
              </CardTitle>
              <CardDescription>
                Edit your school's basic information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateSchoolProfile(); }} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="school_name">School Name</Label>
                      <Input
                        id="school_name"
                        value={editSchoolForm.school_name}
                        onChange={(e) => setEditSchoolForm({...editSchoolForm, school_name: e.target.value})}
                        placeholder="Enter school name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg_number">Registration Number</Label>
                      <Input
                        id="reg_number"
                        value={schoolInfo.registration_number}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">Registration number cannot be changed</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_email" className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Email
                      </Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={editSchoolForm.contact_email}
                        onChange={(e) => setEditSchoolForm({...editSchoolForm, contact_email: e.target.value})}
                        placeholder="school@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_phone" className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Phone
                      </Label>
                      <Input
                        id="contact_phone"
                        type="tel"
                        value={editSchoolForm.contact_phone}
                        onChange={(e) => setEditSchoolForm({...editSchoolForm, contact_phone: e.target.value})}
                        placeholder="+255 XXX XXX XXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Location Information
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Textarea
                        id="address"
                        value={editSchoolForm.address}
                        onChange={(e) => setEditSchoolForm({...editSchoolForm, address: e.target.value})}
                        placeholder="Enter street address"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City/Town</Label>
                        <Input
                          id="city"
                          value={editSchoolForm.city}
                          onChange={(e) => setEditSchoolForm({...editSchoolForm, city: e.target.value})}
                          placeholder="Enter city or town"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="region">Region</Label>
                        <Input
                          id="region"
                          value={editSchoolForm.region}
                          onChange={(e) => setEditSchoolForm({...editSchoolForm, region: e.target.value})}
                          placeholder="Enter region"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* School Status (Read Only) */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">School Status</h3>
                  <div className="flex items-center space-x-4">
                    <Badge variant={schoolInfo.status === 'approved' ? 'default' : 'secondary'} className="capitalize">
                      {schoolInfo.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Registered on {new Date(schoolInfo.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 pt-4 border-t">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={loadSchoolInfo}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
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
