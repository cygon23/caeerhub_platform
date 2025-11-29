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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Palette,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import StudentManagement from "@/components/school/StudentManagement";
import SchoolProfile from "@/components/school/SchoolProfile";
import HollandAssessmentManagement from "@/components/school/HollandAssessmentManagement";
import StudyMaterialsManagement from "@/components/school/StudyMaterialsManagement";
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

const COLORS = ['#FE047F', '#006807', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Predefined school color palette
const SCHOOL_COLOR_PALETTE = [
  { name: 'Royal Blue', value: '#FE047F' },
  { name: 'Emerald Green', value: '#006807' },
  { name: 'Navy Blue', value: '#1E3A8A' },
  { name: 'Forest Green', value: '#065F46' },
  { name: 'Crimson Red', value: '#DC2626' },
  { name: 'Maroon', value: '#7F1D1D' },
  { name: 'Deep Purple', value: '#6B21A8' },
  { name: 'Golden Yellow', value: '#FFBB28' },
  { name: 'Orange', value: '#FF8042' },
  { name: 'Teal', value: '#0D9488' },
  { name: 'Indigo', value: '#4F46E5' },
  { name: 'Sky Blue', value: '#0EA5E9' },
  { name: 'Rose Pink', value: '#E11D48' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Slate Gray', value: '#475569' },
  { name: 'Brown', value: '#78350F' },
];

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
    primary_color: '#FE047F',
    secondary_color: '#006807',
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
            primary_color: school.primary_color || '#FE047F',
            secondary_color: school.secondary_color || '#006807',
          });
        }

        // Get student statistics
        const studentStats = await adminService.getStudentStats(profile.school_id);
        setStats(studentStats);
      } else {
        // No school assigned yet - but still fetch students with default school_id
        // Try to get school with default ID
        const schools = await adminService.getSchools();
        const school = schools.find(s => s.registration_number === 'TRD-009890');
        if (school) {
          setSchoolInfo(school);

          // Get student statistics
          const studentStats = await adminService.getStudentStats('TRD-009890');
          setStats(studentStats);
        }
      }
    } catch (error: any) {
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
    {
      title: "Modules",
      items: [
        { title: "Holland RIASEC Assessment", icon: GraduationCap, id: "holland-assessment" },
        { title: "Study Materials", icon: Activity, id: "study-materials" },
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
                  No School Data Yet
                </h3>
                <p className='text-muted-foreground'>
                  Your school admin account has been created, but no school data been assigned yet.
                  Please contact the administrator if your sure u have already add school details.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      }

      return (
        <div className='space-y-8'>
          <div
            className='text-white rounded-lg p-8'
            style={{
              background: schoolInfo?.primary_color && schoolInfo?.secondary_color
                ? `linear-gradient(135deg, ${schoolInfo.primary_color} 0%, ${schoolInfo.secondary_color} 100%)`
                : 'linear-gradient(135deg, #FE047F 0%, #006807 100%)',
            }}
          >
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

          <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6'>
            <Card className='hover:shadow-primary transition-all duration-300'>
              <CardContent className='p-4 md:p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-muted-foreground text-xs md:text-sm'>
                      Total Students
                    </p>
                    <p className='text-xl md:text-2xl font-bold text-foreground'>
                      {stats?.total || 0}
                    </p>
                  </div>
                  <Users
                    className='h-6 w-6 md:h-8 md:w-8'
                    style={{ color: schoolInfo?.primary_color || '#FE047F' }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className='hover:shadow-primary transition-all duration-300'>
              <CardContent className='p-4 md:p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-muted-foreground text-xs md:text-sm'>
                      Active Students
                    </p>
                    <p className='text-xl md:text-2xl font-bold text-foreground'>
                      {stats?.byStatus.active || 0}
                    </p>
                  </div>
                  <GraduationCap
                    className='h-6 w-6 md:h-8 md:w-8'
                    style={{ color: schoolInfo?.secondary_color || '#006807' }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className='hover:shadow-primary transition-all duration-300'>
              <CardContent className='p-4 md:p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-muted-foreground text-xs md:text-sm'>
                      Graduated
                    </p>
                    <p className='text-xl md:text-2xl font-bold text-foreground'>
                      {stats?.byStatus.graduated || 0}
                    </p>
                  </div>
                  <TrendingUp
                    className='h-6 w-6 md:h-8 md:w-8'
                    style={{ color: schoolInfo?.primary_color || '#FE047F' }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className='hover:shadow-primary transition-all duration-300'>
              <CardContent className='p-4 md:p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-muted-foreground text-xs md:text-sm'>
                      Form Levels
                    </p>
                    <p className='text-xl md:text-2xl font-bold text-foreground'>
                      {Object.keys(stats?.byFormLevel || {}).length}
                    </p>
                  </div>
                  <Activity
                    className='h-6 w-6 md:h-8 md:w-8'
                    style={{ color: schoolInfo?.secondary_color || '#006807' }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Students by Form Level */}
          <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" style={{ color: schoolInfo?.primary_color || '#FE047F' }} />
                Students by Form Level
              </CardTitle>
              <CardDescription>Distribution across all form levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4'>
                {[1, 2, 3, 4, 5, 6].map(form => (
                  <div
                    key={form}
                    className="relative text-center p-4 bg-gradient-accent rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer border border-border/50"
                    style={{
                      boxShadow: `0 4px 6px -1px ${schoolInfo?.primary_color || '#FE047F'}20`
                    }}
                  >
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: schoolInfo?.primary_color || '#FE047F' }}></div>
                    <div
                      className="text-3xl font-bold mb-1"
                      style={{ color: schoolInfo?.primary_color || '#FE047F' }}
                    >
                      {stats?.byFormLevel[form] || 0}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Form {form}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" style={{ color: schoolInfo?.primary_color || '#FE047F' }} />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => setActiveSection('students')}
                className="h-24 flex flex-col items-center justify-center space-y-2 text-white hover:opacity-90 transition-opacity"
                style={{
                  background: schoolInfo?.primary_color
                    ? `linear-gradient(135deg, ${schoolInfo.primary_color} 0%, ${schoolInfo.secondary_color} 100%)`
                    : undefined
                }}>
                <Users className="h-7 w-7" />
                <span className="font-semibold">Manage Students</span>
              </Button>
              <Button
                onClick={() => setActiveSection('analytics')}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2 hover:shadow-lg transition-all border-2"
                style={{
                  borderColor: schoolInfo?.primary_color || '#FE047F',
                  color: schoolInfo?.primary_color || '#FE047F'
                }}>
                <BarChart3 className="h-7 w-7" />
                <span className="font-semibold">View Reports</span>
              </Button>
              <Button
                onClick={() => setActiveSection('profile')}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2 hover:shadow-lg transition-all border-2"
                style={{
                  borderColor: schoolInfo?.secondary_color || '#006807',
                  color: schoolInfo?.secondary_color || '#006807'
                }}>
                <Settings className="h-7 w-7" />
                <span className="font-semibold">School Settings</span>
              </Button>
            </CardContent>
          </Card>

          {/* School Info */}
          {schoolInfo && (
            <Card className="shadow-md border-l-4" style={{ borderLeftColor: schoolInfo?.primary_color || '#FE047F' }}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" style={{ color: schoolInfo?.primary_color || '#FE047F' }} />
                  School Information
                </CardTitle>
                <CardDescription>Your school's registered details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">School Name</p>
                    </div>
                    <p className="text-lg font-semibold pl-6">{schoolInfo.school_name}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="h-4 w-4 rounded-full p-0" />
                      <p className="text-sm font-medium text-muted-foreground">Registration Number</p>
                    </div>
                    <p className="pl-6">
                      <code className="bg-muted px-3 py-1.5 rounded font-mono text-sm font-semibold" style={{ color: schoolInfo?.primary_color || '#FE047F' }}>
                        {schoolInfo.registration_number}
                      </code>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                    </div>
                    <p className="font-medium pl-6">{schoolInfo.contact_email}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                    </div>
                    <p className="font-medium pl-6">{schoolInfo.contact_phone}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                    </div>
                    <div className="pl-6">
                      <Badge
                        variant="default"
                        className="capitalize font-semibold"
                        style={{
                          backgroundColor: schoolInfo.status === 'approved' ? (schoolInfo?.primary_color || '#10B981') : undefined
                        }}
                      >
                        {schoolInfo.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">School Colors</p>
                    </div>
                    <div className="pl-6 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div
                          className="w-8 h-8 rounded-md shadow-sm border border-border"
                          style={{ backgroundColor: schoolInfo?.primary_color || '#FE047F' }}
                          title="Primary Color"
                        />
                        <div
                          className="w-8 h-8 rounded-md shadow-sm border border-border"
                          style={{ backgroundColor: schoolInfo?.secondary_color || '#006807' }}
                          title="Secondary Color"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    if (activeSection === "students") {
      // Get school_id - use schoolInfo if available, otherwise use default
      const schoolId = schoolInfo?.registration_number || 'TRD-009890';
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
      return <SchoolProfile schoolInfo={schoolInfo} onUpdate={loadSchoolInfo} />;
    }

                {/* School Branding - Color Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    School Branding Colors
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose colors that represent your school's brand identity
                  </p>

                  {/* Primary Color Selection */}
                  <div className="space-y-3">
                    <Label className="text-base">Primary Color</Label>
                    <div className="flex items-center gap-4 mb-2">
                      <div
                        className="w-16 h-16 rounded-lg border-2 border-border shadow-sm"
                        style={{ backgroundColor: editSchoolForm.primary_color }}
                      />
                      <div className="flex-1">
                        <Input
                          type="text"
                          value={editSchoolForm.primary_color}
                          onChange={(e) => setEditSchoolForm({...editSchoolForm, primary_color: e.target.value})}
                          placeholder="#FE047F"
                          className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Enter a hex color code or select from the palette below
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-8 gap-2">
                      {SCHOOL_COLOR_PALETTE.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setEditSchoolForm({...editSchoolForm, primary_color: color.value})}
                          className={`w-full h-12 rounded-md border-2 transition-all hover:scale-110 hover:shadow-md ${
                            editSchoolForm.primary_color === color.value
                              ? 'border-foreground ring-2 ring-offset-2 ring-primary'
                              : 'border-border'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Secondary Color Selection */}
                  <div className="space-y-3">
                    <Label className="text-base">Secondary Color</Label>
                    <div className="flex items-center gap-4 mb-2">
                      <div
                        className="w-16 h-16 rounded-lg border-2 border-border shadow-sm"
                        style={{ backgroundColor: editSchoolForm.secondary_color }}
                      />
                      <div className="flex-1">
                        <Input
                          type="text"
                          value={editSchoolForm.secondary_color}
                          onChange={(e) => setEditSchoolForm({...editSchoolForm, secondary_color: e.target.value})}
                          placeholder="#006807"
                          className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Enter a hex color code or select from the palette below
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-8 gap-2">
                      {SCHOOL_COLOR_PALETTE.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setEditSchoolForm({...editSchoolForm, secondary_color: color.value})}
                          className={`w-full h-12 rounded-md border-2 transition-all hover:scale-110 hover:shadow-md ${
                            editSchoolForm.secondary_color === color.value
                              ? 'border-foreground ring-2 ring-offset-2 ring-primary'
                              : 'border-border'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="bg-gradient-to-r p-6 rounded-lg border border-border"
                    style={{
                      background: `linear-gradient(135deg, ${editSchoolForm.primary_color} 0%, ${editSchoolForm.secondary_color} 100%)`
                    }}
                  >
                    <div className="text-white text-center">
                      <p className="text-lg font-semibold drop-shadow-md">Color Preview</p>
                      <p className="text-sm opacity-90 drop-shadow-md">This is how your school colors will look together</p>
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

    if (activeSection === "study-materials") {
      return <StudyMaterialsManagement />;
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
                style={
                  activeSection === "overview" && schoolInfo?.primary_color
                    ? { backgroundColor: schoolInfo.primary_color, color: 'white' }
                    : undefined
                }
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
                              ? "text-primary-foreground"
                              : ""
                          }
                          style={
                            activeSection === item.id && schoolInfo?.primary_color
                              ? { backgroundColor: schoolInfo.primary_color, color: 'white' }
                              : undefined
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
                  <Avatar className='h-10 w-10 border-2 border-primary/20 group-hover:border-primary/40 transition-colors'>
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback className='bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold text-sm'>
                      {user?.email?.charAt(0)?.toUpperCase() || 'A'}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className='flex-1 text-left min-w-0'>
                    <div className='text-sm font-medium text-foreground truncate'>
                      {schoolInfo?.school_name || user?.email?.split('@')[0] || 'Admin'}
                    </div>
                    <div className='flex items-center gap-1.5 mt-0.5'>
                      <Badge
                        variant='outline'
                        className='text-[10px] px-1.5 py-0 h-4 border-primary/30 bg-primary/5 text-primary font-medium'
                      >
                        School Admin
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
                      {schoolInfo?.school_name || 'School Admin'}
                    </p>
                    <p className='text-xs leading-none text-muted-foreground'>
                      {user?.email}
                    </p>
                    {schoolInfo?.registration_number && (
                      <p className='text-xs leading-none text-muted-foreground'>
                        Reg: {schoolInfo.registration_number}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setActiveSection('profile')}
                  className='cursor-pointer'
                >
                  <Settings className='mr-2 h-4 w-4' />
                  <span>School Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setActiveSection('students')}
                  className='cursor-pointer'
                >
                  <Users className='mr-2 h-4 w-4' />
                  <span>Manage Students</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  className='cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Log out</span>
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
