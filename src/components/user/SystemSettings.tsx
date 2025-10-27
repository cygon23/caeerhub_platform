import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Eye,
  Zap,
  Trash2,
  Save,
  RefreshCw,
  Download,
  Upload,
  Moon,
  Sun,
  Monitor,
  Lock,
  AlertTriangle,
  Crown,
  Smartphone,
} from "lucide-react";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { BillingTab } from "../../components/settings/tabs/BillingTab";

export default function SystemSettings() {
  const settings = useSystemSettings();

  if (settings.loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <RefreshCw className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-5xl mx-auto'>
      <div>
        <h1 className='text-3xl font-bold'>Settings</h1>
        <p className='text-muted-foreground'>
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue='profile' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-3 lg:grid-cols-7'>
          <TabsTrigger value='profile'>
            <User className='h-4 w-4 mr-2' />
            Profile
          </TabsTrigger>
          <TabsTrigger value='notifications'>
            <Bell className='h-4 w-4 mr-2' />
            Notifications
          </TabsTrigger>
          <TabsTrigger value='security'>
            <Shield className='h-4 w-4 mr-2' />
            Security
          </TabsTrigger>
          <TabsTrigger value='appearance'>
            <Palette className='h-4 w-4 mr-2' />
            Appearance
          </TabsTrigger>
          <TabsTrigger value='privacy'>
            <Eye className='h-4 w-4 mr-2' />
            Privacy
          </TabsTrigger>
          <TabsTrigger value='billing'>
            <CreditCard className='h-4 w-4 mr-2' />
            Billing
          </TabsTrigger>
          <TabsTrigger value='advanced'>
            <Zap className='h-4 w-4 mr-2' />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value='profile' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details and avatar
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Avatar Section */}
              <div className='flex items-center gap-6'>
                <Avatar className='w-24 h-24'>
                  <AvatarImage src={settings.avatarUrl} alt='User Avatar' />
                  <AvatarFallback className='text-2xl'>
                    {settings.displayName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className='space-y-2'>
                  <input
                    type='file'
                    id='avatar-upload'
                    accept='image/*'
                    className='hidden'
                    onChange={settings.handleAvatarSelect}
                    disabled={settings.uploading}
                  />
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                    disabled={settings.uploading}>
                    {settings.uploading ? (
                      <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                    ) : (
                      <Upload className='h-4 w-4 mr-2' />
                    )}
                    Change Avatar
                  </Button>
                  {settings.avatarUrl && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-red-600'
                      onClick={settings.removeAvatar}
                      disabled={settings.uploading}>
                      <Trash2 className='h-4 w-4 mr-2' />
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <Separator />

              <div className='grid gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='displayName'>Display Name</Label>
                  <Input
                    id='displayName'
                    value={settings.displayName}
                    onChange={(e) => settings.setDisplayName(e.target.value)}
                    placeholder='Your name'
                  />
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='tagline'>Tagline</Label>
                  <Input
                    id='tagline'
                    value={settings.tagline}
                    onChange={(e) => settings.setTagline(e.target.value)}
                    placeholder='e.g., Software Engineer | Tech Enthusiast'
                  />
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='bio'>Bio</Label>
                  <textarea
                    id='bio'
                    value={settings.bio}
                    onChange={(e) => settings.setBio(e.target.value)}
                    placeholder='Tell us about yourself...'
                    className='min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                  />
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='grid gap-2'>
                    <Label htmlFor='phone'>Phone</Label>
                    <Input
                      id='phone'
                      value={settings.phone}
                      onChange={(e) => settings.setPhone(e.target.value)}
                      placeholder='+255 XXX XXX XXX'
                    />
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='location'>Location</Label>
                    <Select
                      value={settings.location}
                      onValueChange={settings.setLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select location' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='dar_es_salaam'>
                          Dar es Salaam
                        </SelectItem>
                        <SelectItem value='arusha'>Arusha</SelectItem>
                        <SelectItem value='mwanza'>Mwanza</SelectItem>
                        <SelectItem value='dodoma'>Dodoma</SelectItem>
                        <SelectItem value='mbeya'>Mbeya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={settings.saveProfile} disabled={settings.saving}>
                {settings.saving ? (
                  <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Save className='h-4 w-4 mr-2' />
                )}
                Save Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your email and password</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Email Address</Label>
                  <p className='text-sm text-muted-foreground'>
                    {settings.user?.email}
                  </p>
                </div>
                <Button variant='outline' size='sm'>
                  Change Email
                </Button>
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Password</Label>
                  <p className='text-sm text-muted-foreground'>••••••••</p>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => settings.setShowPasswordDialog(true)}>
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value='notifications' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose what email notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>All Email Notifications</Label>
                  <p className='text-sm text-muted-foreground'>
                    Master switch for all email notifications
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={settings.setEmailNotifications}
                />
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Job Recommendations</Label>
                  <p className='text-sm text-muted-foreground'>
                    Receive personalized job matches
                  </p>
                </div>
                <Switch
                  checked={settings.jobAlerts}
                  onCheckedChange={settings.setJobAlerts}
                  disabled={!settings.emailNotifications}
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Weekly Digest</Label>
                  <p className='text-sm text-muted-foreground'>
                    Summary of your activity and opportunities
                  </p>
                </div>
                <Switch
                  checked={settings.weeklyDigest}
                  onCheckedChange={settings.setWeeklyDigest}
                  disabled={!settings.emailNotifications}
                />
              </div>

              <div className='grid gap-2'>
                <Label>Digest Frequency</Label>
                <Select
                  value={settings.digestFrequency}
                  onValueChange={settings.setDigestFrequency}>
                  <SelectTrigger className='w-[200px]'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='daily'>Daily</SelectItem>
                    <SelectItem value='weekly'>Weekly</SelectItem>
                    <SelectItem value='monthly'>Monthly</SelectItem>
                    <SelectItem value='never'>Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={settings.saveNotifications}
                disabled={settings.saving}>
                {settings.saving ? (
                  <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Save className='h-4 w-4 mr-2' />
                )}
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other Notifications</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Push Notifications</Label>
                  <p className='text-sm text-muted-foreground'>
                    Browser and mobile push notifications
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={settings.setPushNotifications}
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-0.5 flex items-center gap-2'>
                  <Label>SMS Notifications</Label>
                  <Badge variant='secondary' className='text-xs'>
                    Coming Soon
                  </Badge>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={settings.setSmsNotifications}
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value='security' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5 flex items-center gap-2'>
                  <div>
                    <Label>Enable 2FA</Label>
                    <p className='text-sm text-muted-foreground'>
                      Require verification code for login
                    </p>
                  </div>
                  <Badge variant='secondary' className='text-xs'>
                    Coming Soon
                  </Badge>
                </div>
                <Switch
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={settings.setTwoFactorEnabled}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Login Security</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Login Notifications</Label>
                  <p className='text-sm text-muted-foreground'>
                    Get notified of new logins
                  </p>
                </div>
                <Switch
                  checked={settings.loginNotifications}
                  onCheckedChange={settings.setLoginNotifications}
                />
              </div>

              <Separator />

              <div className='space-y-2'>
                <Label>Active Sessions</Label>
                <div className='p-4 border rounded-lg space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <Monitor className='h-5 w-5 text-muted-foreground' />
                      <div>
                        <p className='text-sm font-medium'>Current Session</p>
                        <p className='text-xs text-muted-foreground'>
                          Chrome on Windows • Dar es Salaam
                        </p>
                      </div>
                    </div>
                    <Badge variant='outline'>Active</Badge>
                  </div>
                </div>
                <Button variant='outline' size='sm' className='w-full'>
                  View All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* APPEARANCE TAB */}
        <TabsContent value='appearance' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Customize how the platform looks
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-2'>
                <Label>Theme Mode</Label>
                <div className='grid grid-cols-3 gap-2'>
                  <Button
                    variant={settings.theme === "light" ? "default" : "outline"}
                    onClick={() => settings.setTheme("light")}
                    className='justify-start'>
                    <Sun className='h-4 w-4 mr-2' />
                    Light
                  </Button>
                  <Button
                    variant={settings.theme === "dark" ? "default" : "outline"}
                    onClick={() => settings.setTheme("dark")}
                    className='justify-start'>
                    <Moon className='h-4 w-4 mr-2' />
                    Dark
                  </Button>
                  <Button
                    variant={settings.theme === "auto" ? "default" : "outline"}
                    onClick={() => settings.setTheme("auto")}
                    className='justify-start'>
                    <Monitor className='h-4 w-4 mr-2' />
                    Auto
                  </Button>
                </div>
              </div>

              <Separator />

              <div className='grid gap-2'>
                <Label>Accent Color</Label>
                <div className='grid grid-cols-5 gap-2'>
                  {["blue", "pink", "green", "purple", "orange"].map(
                    (color) => (
                      <Button
                        key={color}
                        variant={
                          settings.accentColor === color ? "default" : "outline"
                        }
                        onClick={() => settings.setAccentColor(color)}
                        className='h-10'>
                        <div
                          className='w-4 h-4 rounded-full'
                          style={{
                            backgroundColor:
                              color === "blue"
                                ? "#3B82F6"
                                : color === "pink"
                                ? "#EC4899"
                                : color === "green"
                                ? "#10B981"
                                : color === "purple"
                                ? "#8B5CF6"
                                : "#F59E0B",
                          }}
                        />
                      </Button>
                    )
                  )}
                </div>
              </div>

              <Button
                onClick={settings.savePreferences}
                disabled={settings.saving}>
                {settings.saving ? (
                  <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Save className='h-4 w-4 mr-2' />
                )}
                Save Appearance
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-2'>
                <Label>Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={settings.setLanguage}>
                  <SelectTrigger className='w-[200px]'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='en'>English</SelectItem>
                    <SelectItem value='sw'>Kiswahili</SelectItem>
                    <SelectItem value='fr'>Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRIVACY TAB */}
        <TabsContent value='privacy' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Profile Visibility</CardTitle>
              <CardDescription>
                Control who can see your profile and information
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Profile Discoverable</Label>
                  <p className='text-sm text-muted-foreground'>
                    Allow others to find your profile in search
                  </p>
                </div>
                <Switch
                  checked={settings.profileDiscoverable}
                  onCheckedChange={settings.setProfileDiscoverable}
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Show Online Status</Label>
                  <p className='text-sm text-muted-foreground'>
                    Display when you're online
                  </p>
                </div>
                <Switch
                  checked={settings.showOnlineStatus}
                  onCheckedChange={settings.setShowOnlineStatus}
                />
              </div>

              <Separator />

              <div className='grid gap-2'>
                <Label>Who can message you?</Label>
                <Select
                  value={settings.allowMessagesFrom}
                  onValueChange={settings.setAllowMessagesFrom}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='everyone'>Everyone</SelectItem>
                    <SelectItem value='connections'>
                      Connections only
                    </SelectItem>
                    <SelectItem value='mentors'>Mentors only</SelectItem>
                    <SelectItem value='none'>No one</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={settings.savePreferences}
                disabled={settings.saving}>
                {settings.saving ? (
                  <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Save className='h-4 w-4 mr-2' />
                )}
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Button variant='outline' className='w-full justify-start'>
                <Download className='h-4 w-4 mr-2' />
                Download Your Data
              </Button>
              <Button variant='outline' className='w-full justify-start'>
                <Eye className='h-4 w-4 mr-2' />
                View Privacy Policy
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BILLING TAB */}
        <TabsContent value='billing' className='space-y-6'>
          <BillingTab
            planType={settings.planType}
            aiCreditsRemaining={settings.aiCreditsRemaining}
          />
        </TabsContent>

        {/* ADVANCED TAB */}
        <TabsContent value='advanced' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                API Access
                <Badge variant='secondary' className='text-xs'>
                  Coming Soon
                </Badge>
              </CardTitle>
              <CardDescription>
                Generate and manage API keys for developers
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Enable API Access</Label>
                  <p className='text-sm text-muted-foreground'>
                    Allow external applications to access your data
                  </p>
                </div>
                <Switch
                  checked={settings.apiEnabled}
                  onCheckedChange={settings.setApiEnabled}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          <Card className='border-destructive'>
            <CardHeader>
              <CardTitle className='text-destructive flex items-center gap-2'>
                <AlertTriangle className='h-5 w-5' />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions - proceed with caution
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Button
                  variant='outline'
                  className='w-full justify-start text-orange-600 border-orange-600'>
                  <Lock className='h-4 w-4 mr-2' />
                  Deactivate Account
                </Button>
                <p className='text-xs text-muted-foreground'>
                  Temporarily disable your account. You can reactivate it
                  anytime.
                </p>
              </div>

              <Separator />

              <div className='space-y-2'>
                <Button variant='destructive' className='w-full justify-start'>
                  <Trash2 className='h-4 w-4 mr-2' />
                  Delete Account Permanently
                </Button>
                <p className='text-xs text-muted-foreground'>
                  Permanently delete your account and all data. This cannot be
                  undone.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Password Change Dialog */}
      <Dialog
        open={settings.showPasswordDialog}
        onOpenChange={settings.setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one. Password must be
              at least 8 characters long.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='current-password'>Current Password</Label>
              <Input
                id='current-password'
                type='password'
                value={settings.currentPassword}
                onChange={(e) => settings.setCurrentPassword(e.target.value)}
                placeholder='Enter current password'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='new-password'>New Password</Label>
              <Input
                id='new-password'
                type='password'
                value={settings.newPassword}
                onChange={(e) => settings.setNewPassword(e.target.value)}
                placeholder='Enter new password (min 8 characters)'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirm-password'>Confirm New Password</Label>
              <Input
                id='confirm-password'
                type='password'
                value={settings.confirmPassword}
                onChange={(e) => settings.setConfirmPassword(e.target.value)}
                placeholder='Confirm new password'
              />
            </div>

            {settings.newPassword &&
              settings.confirmPassword &&
              settings.newPassword !== settings.confirmPassword && (
                <p className='text-sm text-destructive flex items-center gap-2'>
                  <AlertTriangle className='h-4 w-4' />
                  Passwords don't match
                </p>
              )}

            {settings.newPassword && settings.newPassword.length < 8 && (
              <p className='text-sm text-destructive flex items-center gap-2'>
                <AlertTriangle className='h-4 w-4' />
                Password must be at least 8 characters
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                settings.setShowPasswordDialog(false);
                settings.setCurrentPassword("");
                settings.setNewPassword("");
                settings.setConfirmPassword("");
              }}
              disabled={settings.passwordLoading}>
              Cancel
            </Button>
            <Button
              onClick={settings.handlePasswordChange}
              disabled={
                settings.passwordLoading ||
                !settings.currentPassword ||
                !settings.newPassword ||
                !settings.confirmPassword ||
                settings.newPassword !== settings.confirmPassword ||
                settings.newPassword.length < 8
              }>
              {settings.passwordLoading ? (
                <>
                  <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                  Changing...
                </>
              ) : (
                <>
                  <Lock className='h-4 w-4 mr-2' />
                  Change Password
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Avatar Preview Dialog */}
      <Dialog
        open={settings.showAvatarDialog}
        onOpenChange={settings.setShowAvatarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Avatar</DialogTitle>
            <DialogDescription>
              Preview your new avatar before uploading
            </DialogDescription>
          </DialogHeader>

          <div className='flex items-center justify-center p-6'>
            <img
              src={settings.avatarPreview}
              alt='Avatar preview'
              className='w-48 h-48 rounded-full object-cover border-4 border-primary/20'
            />
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                settings.setShowAvatarDialog(false);
                settings.setAvatarPreview("");
              }}
              disabled={settings.uploading}>
              Cancel
            </Button>
            <Button
              onClick={settings.uploadAvatar}
              disabled={settings.uploading}>
              {settings.uploading ? (
                <>
                  <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className='h-4 w-4 mr-2' />
                  Upload Avatar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
