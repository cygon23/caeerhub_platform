import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSystemSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Profile states
  const [displayName, setDisplayName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  // Billing states (NEW)
  const [planType, setPlanType] = useState('free');
  const [aiCreditsRemaining, setAiCreditsRemaining] = useState(0);

  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [digestFrequency, setDigestFrequency] = useState('weekly');

  // Security states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);

  // Appearance states
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('blue');
  const [language, setLanguage] = useState('en');

  // Privacy states
  const [profileDiscoverable, setProfileDiscoverable] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowMessagesFrom, setAllowMessagesFrom] = useState('everyone');

  // Advanced states
  const [apiEnabled, setApiEnabled] = useState(false);

  // UI states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load all settings on mount
  useEffect(() => {
    if (user) {
      loadAllSettings();
    }
  }, [user]);

  const loadAllSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setDisplayName(profile.display_name || '');
        setBio(profile.bio || '');
        setPhone(profile.phone || '');
        setLocation(profile.location || '');
        setAvatarUrl(profile.avatar_url || '');
      }

      // Fetch billing settings (NEW)
      const { data: billing } = await supabase
        .from('billing_settings')
        .select('plan_tier, ai_credits_remaining')
        .eq('user_id', user.id)
        .single();

      if (billing) {
        setPlanType(billing.plan_tier || 'free');
        setAiCreditsRemaining(billing.ai_credits_remaining || 0);
      }

      // Fetch preferences
      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (prefs) {
        setEmailNotifications(prefs.email_notifications);
        setPushNotifications(prefs.push_notifications);
        setTheme(prefs.theme);
        setAccentColor(prefs.accent_color);
        setLanguage(prefs.language);
        setProfileDiscoverable(prefs.profile_discoverable);
        setShowOnlineStatus(prefs.show_online_status);
        setAllowMessagesFrom(prefs.allow_messages_from);
        setApiEnabled(prefs.api_access_enabled);
      }

      // Fetch notification settings
      const { data: notifSettings } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (notifSettings) {
        setJobAlerts(notifSettings.email_job_recommendations);
        setWeeklyDigest(notifSettings.email_weekly_digest);
        setDigestFrequency(notifSettings.digest_frequency);
      }

      // Fetch security settings
      const { data: security } = await supabase
        .from('security_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (security) {
        setTwoFactorEnabled(security.two_factor_enabled);
        setLoginNotifications(security.login_notification_email);
      }

    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          bio: bio,
          phone: phone,
          location: location,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const saveNotifications = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('notification_settings')
        .update({
          email_job_recommendations: jobAlerts,
          email_weekly_digest: weeklyDigest,
          digest_frequency: digestFrequency,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Notification settings saved',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save notifications',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          theme: theme,
          accent_color: accentColor,
          language: language,
          profile_discoverable: profileDiscoverable,
          show_online_status: showOnlineStatus,
          allow_messages_from: allowMessagesFrom,
          email_notifications: emailNotifications,
          push_notifications: pushNotifications,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Preferences saved',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save preferences',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });

      setShowPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
      setShowAvatarDialog(true);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async () => {
    if (!user || !avatarPreview) return;

    setUploading(true);
    try {
      const fileName = `${user.id}-${Date.now()}.png`;
      const blob = await fetch(avatarPreview).then((r) => r.blob());

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setShowAvatarDialog(false);
      setAvatarPreview('');

      toast({
        title: 'Success',
        description: 'Avatar updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload avatar',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!user) return;

    setUploading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', user.id);

      if (error) throw error;

      setAvatarUrl('');
      toast({
        title: 'Success',
        description: 'Avatar removed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove avatar',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return {
    user,
    loading,
    saving,
    uploading,
    passwordLoading,
    
    // Profile
    displayName,
    setDisplayName,
    tagline,
    setTagline,
    bio,
    setBio,
    phone,
    setPhone,
    location,
    setLocation,
    avatarUrl,
    avatarPreview,
    setAvatarPreview,
    
    // Billing (NEW)
    planType,
    aiCreditsRemaining,
    
    // Notifications
    emailNotifications,
    setEmailNotifications,
    jobAlerts,
    setJobAlerts,
    weeklyDigest,
    setWeeklyDigest,
    pushNotifications,
    setPushNotifications,
    smsNotifications,
    setSmsNotifications,
    digestFrequency,
    setDigestFrequency,
    
    // Security
    twoFactorEnabled,
    setTwoFactorEnabled,
    loginNotifications,
    setLoginNotifications,
    showPasswordDialog,
    setShowPasswordDialog,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    
    // Appearance
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    language,
    setLanguage,
    
    // Privacy
    profileDiscoverable,
    setProfileDiscoverable,
    showOnlineStatus,
    setShowOnlineStatus,
    allowMessagesFrom,
    setAllowMessagesFrom,
    
    // Advanced
    apiEnabled,
    setApiEnabled,
    
    // Dialogs
    showAvatarDialog,
    setShowAvatarDialog,
    
    // Actions
    saveProfile,
    saveNotifications,
    savePreferences,
    handlePasswordChange,
    handleAvatarSelect,
    uploadAvatar,
    removeAvatar,
  };
};