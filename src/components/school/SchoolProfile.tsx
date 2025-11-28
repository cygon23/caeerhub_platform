import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Mail, Phone, MapPin, Globe, Users, Calendar, Award, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SchoolProfileProps {
  schoolInfo?: any;
}

export default function SchoolProfile({ schoolInfo }: SchoolProfileProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    school_name: schoolInfo?.school_name || "",
    registration_number: schoolInfo?.registration_number || "",
    established_year: "",
    school_type: "",
    ownership: "",
    motto: "",
    mission: "",
    vision: "",
    contact_email: schoolInfo?.contact_email || "",
    contact_phone: schoolInfo?.contact_phone || "",
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
  });

  const handleSave = () => {
    setSaving(true);
    // TODO: Implement save logic
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Profile Updated",
        description: "School profile has been successfully updated.",
      });
    }, 1000);
  };

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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Core details about your school</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>School Name *</Label>
                  <Input
                    value={profileForm.school_name}
                    onChange={(e) => setProfileForm({ ...profileForm, school_name: e.target.value })}
                    placeholder="Enter school name"
                  />
                </div>
                <div>
                  <Label>Registration Number *</Label>
                  <Input
                    value={profileForm.registration_number}
                    onChange={(e) => setProfileForm({ ...profileForm, registration_number: e.target.value })}
                    placeholder="REG-2024-001"
                    disabled
                  />
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
      </Tabs>
    </div>
  );
}
