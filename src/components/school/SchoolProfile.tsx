import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Mail, Phone, MapPin, Globe, Users, Calendar, Award, Save, Palette, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminService, School } from "@/services/adminService";
import { Badge } from "@/components/ui/badge";

interface SchoolProfileProps {
  schoolInfo?: School;
  onUpdate?: () => void;
}

// 10 predefined theme colors for schools
const THEME_COLORS = [
  { name: 'Royal Blue', primary: '#2563EB', secondary: '#1E40AF' },
  { name: 'Emerald Green', primary: '#10B981', secondary: '#059669' },
  { name: 'Crimson Red', primary: '#DC2626', secondary: '#B91C1C' },
  { name: 'Purple', primary: '#9333EA', secondary: '#7E22CE' },
  { name: 'Orange', primary: '#F97316', secondary: '#EA580C' },
  { name: 'Teal', primary: '#14B8A6', secondary: '#0D9488' },
  { name: 'Pink', primary: '#EC4899', secondary: '#DB2777' },
  { name: 'Amber', primary: '#F59E0B', secondary: '#D97706' },
  { name: 'Indigo', primary: '#6366F1', secondary: '#4F46E5' },
  { name: 'Slate', primary: '#64748B', secondary: '#475569' },
];

export default function SchoolProfile({ schoolInfo, onUpdate }: SchoolProfileProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [loadedSchool, setLoadedSchool] = useState<School | null>(null);

  const [profileForm, setProfileForm] = useState({
    school_name: "",
    registration_number: "",
    established_year: "",
    school_type: "",
    ownership: "",
    motto: "",
    mission: "",
    vision: "",
    contact_email: "",
    contact_phone: "",
    alternative_phone: "",
    website: "",
    address: "",
    city: "",
    region: "",
    postal_code: "",
    total_capacity: "",
    current_enrollment: "",
    teaching_staff: "",
    non_teaching_staff: "",
    facilities: {
      library: false,
      laboratory: false,
      computer_lab: false,
      sports_ground: false,
      hostel: false,
      cafeteria: false,
    },
    primary_color: THEME_COLORS[0].primary,
    secondary_color: THEME_COLORS[0].secondary,
  });

  // Fetch school data if not provided
  useEffect(() => {
    const fetchSchoolData = async () => {
      if (!schoolInfo && !loadedSchool) {
        setLoading(true);
        try {
          const schools = await adminService.getSchools();

          // Try to find school with registration number TRD-009890
          const school = schools.find(s => s.registration_number === 'TRD-009890');

          if (school) {
            setLoadedSchool(school);
          } else {
            toast({
              title: "Info",
              description: "Please ensure your school is registered first",
              variant: "default",
            });
          }
        } catch (error: any) {
          toast({
            title: "Error",
            description: "Failed to load school data",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSchoolData();
  }, [schoolInfo, loadedSchool]);

  // Load school data into form (from either schoolInfo prop or loaded school)
  useEffect(() => {
    const school = schoolInfo || loadedSchool;

    if (school) {
      // Find matching theme color
      const themeIndex = THEME_COLORS.findIndex(
        (t) => t.primary === school.primary_color
      );
      if (themeIndex !== -1) {
        setSelectedTheme(themeIndex);
      }

      const newFormData = {
        school_name: school.school_name || "",
        registration_number: school.registration_number || "",
        established_year: school.established_year?.toString() || "",
        school_type: school.school_type || "",
        ownership: school.ownership || "",
        motto: school.motto || "",
        mission: school.mission || "",
        vision: school.vision || "",
        contact_email: school.contact_email || "",
        contact_phone: school.contact_phone || "",
        alternative_phone: school.alternative_phone || "",
        website: school.website || "",
        address: school.address || "",
        city: school.city || "",
        region: school.region || "",
        postal_code: school.postal_code || "",
        total_capacity: school.total_capacity?.toString() || "",
        current_enrollment: school.current_enrollment?.toString() || "",
        teaching_staff: school.teaching_staff?.toString() || "",
        non_teaching_staff: school.non_teaching_staff?.toString() || "",
        facilities: school.facilities || {
          library: false,
          laboratory: false,
          computer_lab: false,
          sports_ground: false,
          hostel: false,
          cafeteria: false,
        },
        primary_color: school.primary_color || THEME_COLORS[0].primary,
        secondary_color: school.secondary_color || THEME_COLORS[0].secondary,
      };

      setProfileForm(newFormData);
    }
  }, [schoolInfo, loadedSchool]);

  const handleThemeSelect = (index: number) => {
    setSelectedTheme(index);
    setProfileForm({
      ...profileForm,
      primary_color: THEME_COLORS[index].primary,
      secondary_color: THEME_COLORS[index].secondary,
    });
  };

  const handleSave = async () => {
    // Use either schoolInfo or loadedSchool
    const school = schoolInfo || loadedSchool;

    if (!school?.id) {
      toast({
        title: "Error",
        description: "School information not available. Please try refreshing the page.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // Prepare update data
      const updateData: Partial<School> = {
        contact_email: profileForm.contact_email,
        contact_phone: profileForm.contact_phone,
        address: profileForm.address,
        city: profileForm.city,
        region: profileForm.region,
        primary_color: profileForm.primary_color,
        secondary_color: profileForm.secondary_color,
        established_year: profileForm.established_year ? parseInt(profileForm.established_year) : undefined,
        school_type: profileForm.school_type as any,
        ownership: profileForm.ownership as any,
        motto: profileForm.motto,
        mission: profileForm.mission,
        vision: profileForm.vision,
        alternative_phone: profileForm.alternative_phone,
        website: profileForm.website,
        postal_code: profileForm.postal_code,
        total_capacity: profileForm.total_capacity ? parseInt(profileForm.total_capacity) : undefined,
        current_enrollment: profileForm.current_enrollment ? parseInt(profileForm.current_enrollment) : undefined,
        teaching_staff: profileForm.teaching_staff ? parseInt(profileForm.teaching_staff) : undefined,
        non_teaching_staff: profileForm.non_teaching_staff ? parseInt(profileForm.non_teaching_staff) : undefined,
        facilities: profileForm.facilities,
      };

      await adminService.updateSchool(school.id, updateData);

      toast({
        title: "Success",
        description: "School profile has been successfully updated.",
      });

      // Call onUpdate callback if provided
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error('Error saving school profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update school profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Show loading state while fetching
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">School Profile</h2>
          <p className="text-muted-foreground">Loading school information...</p>
        </div>
        <div className="space-y-4">
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">School Profile</h2>
          <p className="text-muted-foreground">Manage your school's information and settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Core details about your school (Name and Registration Number cannot be changed)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>School Name *</Label>
                  <Input
                    value={profileForm.school_name}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">This field cannot be changed</p>
                </div>
                <div>
                  <Label>Registration Number *</Label>
                  <Input
                    value={profileForm.registration_number}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">This field cannot be changed</p>
                </div>
                <div>
                  <Label>Established Year</Label>
                  <Input
                    type="number"
                    value={profileForm.established_year}
                    onChange={(e) => setProfileForm({ ...profileForm, established_year: e.target.value })}
                    placeholder="2000"
                  />
                </div>
                <div>
                  <Label>School Type</Label>
                  <Select value={profileForm.school_type} onValueChange={(v) => setProfileForm({ ...profileForm, school_type: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="secondary">Secondary School</SelectItem>
                      <SelectItem value="primary">Primary School</SelectItem>
                      <SelectItem value="combined">Combined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ownership</Label>
                  <Select value={profileForm.ownership} onValueChange={(v) => setProfileForm({ ...profileForm, ownership: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="religious">Religious</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>School Motto</Label>
                  <Input
                    value={profileForm.motto}
                    onChange={(e) => setProfileForm({ ...profileForm, motto: e.target.value })}
                    placeholder="Enter school motto"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>How to reach your school</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Primary Email *
                  </Label>
                  <Input
                    type="email"
                    value={profileForm.contact_email}
                    onChange={(e) => setProfileForm({ ...profileForm, contact_email: e.target.value })}
                    placeholder="school@example.com"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Primary Phone *
                  </Label>
                  <Input
                    value={profileForm.contact_phone}
                    onChange={(e) => setProfileForm({ ...profileForm, contact_phone: e.target.value })}
                    placeholder="+255 712 345 678"
                  />
                </div>
                <div>
                  <Label>Alternative Phone</Label>
                  <Input
                    value={profileForm.alternative_phone}
                    onChange={(e) => setProfileForm({ ...profileForm, alternative_phone: e.target.value })}
                    placeholder="+255 712 345 679"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    value={profileForm.website}
                    onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                    placeholder="https://www.schoolwebsite.com"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Physical Address
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>Street Address</Label>
                    <Input
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      placeholder="Enter street address"
                    />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label>Region</Label>
                    <Input
                      value={profileForm.region}
                      onChange={(e) => setProfileForm({ ...profileForm, region: e.target.value })}
                      placeholder="Region"
                    />
                  </div>
                  <div>
                    <Label>Postal Code</Label>
                    <Input
                      value={profileForm.postal_code}
                      onChange={(e) => setProfileForm({ ...profileForm, postal_code: e.target.value })}
                      placeholder="P.O. Box"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Infrastructure */}
        <TabsContent value="infrastructure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Capacity & Staffing
              </CardTitle>
              <CardDescription>School capacity and human resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Total Student Capacity</Label>
                  <Input
                    type="number"
                    value={profileForm.total_capacity}
                    onChange={(e) => setProfileForm({ ...profileForm, total_capacity: e.target.value })}
                    placeholder="500"
                  />
                </div>
                <div>
                  <Label>Current Enrollment</Label>
                  <Input
                    type="number"
                    value={profileForm.current_enrollment}
                    onChange={(e) => setProfileForm({ ...profileForm, current_enrollment: e.target.value })}
                    placeholder="450"
                  />
                </div>
                <div>
                  <Label>Teaching Staff</Label>
                  <Input
                    type="number"
                    value={profileForm.teaching_staff}
                    onChange={(e) => setProfileForm({ ...profileForm, teaching_staff: e.target.value })}
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label>Non-Teaching Staff</Label>
                  <Input
                    type="number"
                    value={profileForm.non_teaching_staff}
                    onChange={(e) => setProfileForm({ ...profileForm, non_teaching_staff: e.target.value })}
                    placeholder="15"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Facilities
              </CardTitle>
              <CardDescription>Available infrastructure and facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(profileForm.facilities).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          facilities: { ...profileForm.facilities, [key]: e.target.checked },
                        })
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="capitalize">{key.replace(/_/g, " ")}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About */}
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mission Statement</CardTitle>
              <CardDescription>Your school's mission and purpose</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={profileForm.mission}
                onChange={(e) => setProfileForm({ ...profileForm, mission: e.target.value })}
                placeholder="Enter your school's mission statement"
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vision Statement</CardTitle>
              <CardDescription>Your school's vision for the future</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={profileForm.vision}
                onChange={(e) => setProfileForm({ ...profileForm, vision: e.target.value })}
                placeholder="Enter your school's vision statement"
                rows={4}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Colors */}
        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                School Theme Colors
              </CardTitle>
              <CardDescription>Choose your school's brand colors from our curated palette</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {THEME_COLORS.map((theme, index) => (
                  <div
                    key={index}
                    onClick={() => handleThemeSelect(index)}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedTheme === index ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'
                    }`}
                  >
                    {selectedTheme === index && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary">
                          <Check className="h-3 w-3 mr-1" />
                          Selected
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <div
                          className="w-12 h-12 rounded-lg shadow-sm"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <div
                          className="w-12 h-12 rounded-lg shadow-sm"
                          style={{ backgroundColor: theme.secondary }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{theme.name}</p>
                        <div className="text-xs text-muted-foreground space-y-0.5">
                          <div>Primary: {theme.primary}</div>
                          <div>Secondary: {theme.secondary}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Preview</h4>
                <p className="text-sm text-muted-foreground mb-3">This is how your selected colors will appear:</p>
                <div className="flex gap-2">
                  <Button style={{ backgroundColor: profileForm.primary_color }}>
                    Primary Button
                  </Button>
                  <Button variant="outline" style={{ borderColor: profileForm.secondary_color, color: profileForm.secondary_color }}>
                    Secondary Button
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
