import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useSystemSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile Data
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [tagline, setTagline] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // User Preferences
  const [theme, setTheme] = useState("light");
  const [accentColor, setAccentColor] = useState("blue");
  const [language, setLanguage] = useState("en");
  const [profileDiscoverable, setProfileDiscoverable] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowMessagesFrom, setAllowMessagesFrom] = useState("everyone");

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [digestFrequency, setDigestFrequency] = useState("weekly");

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [apiEnabled, setApiEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);

  // Billing
  const [planType, setPlanType] = useState("free");
  const [aiCreditsRemaining, setAiCreditsRemaining] = useState(100);

  // Password Change
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Avatar Upload
  const [uploading, setUploading] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (user) loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) {
        setDisplayName(profile.display_name || "");
        setBio(profile.bio || "");
        setPhone(profile.phone || "");
        setLocation(profile.location || "");
        setAvatarUrl(profile.avatar_url || "");
      }

      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (prefs) {
        setTheme(prefs.theme || "light");
        setAccentColor(prefs.accent_color || "blue");
        setLanguage(prefs.language || "en");
        setProfileDiscoverable(prefs.profile_discoverable ?? true);
        setShowOnlineStatus(prefs.show_online_status ?? true);
        setAllowMessagesFrom(prefs.allow_messages_from || "everyone");
        setEmailNotifications(prefs.email_notifications ?? true);
        setPushNotifications(prefs.push_notifications ?? true);
        setSmsNotifications(prefs.sms_notifications ?? false);
        setTwoFactorEnabled(prefs.two_factor_enabled ?? false);
        setApiEnabled(prefs.api_access_enabled ?? false);
      }

      const { data: notifs } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (notifs) {
        setJobAlerts(notifs.email_job_recommendations ?? true);
        setWeeklyDigest(notifs.email_weekly_digest ?? true);
        setDigestFrequency(notifs.digest_frequency || "weekly");
      }

      const { data: security } = await supabase
        .from("security_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (security) {
        setLoginNotifications(security.login_notification_email ?? true);
      }

      const { data: billing } = await supabase
        .from("billing_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (billing) {
        setPlanType(billing.plan_type || "free");
        setAiCreditsRemaining(billing.ai_credits_remaining || 100);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").upsert(
        {
          user_id: user.id,
          display_name: displayName,
          bio,
          phone,
          location,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          theme,
          accent_color: accentColor,
          language,
          profile_discoverable: profileDiscoverable,
          show_online_status: showOnlineStatus,
          allow_messages_from: allowMessagesFrom,
          email_notifications: emailNotifications,
          push_notifications: pushNotifications,
          sms_notifications: smsNotifications,
          two_factor_enabled: twoFactorEnabled,
          api_access_enabled: apiEnabled,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
      if (error) throw error;
      toast.success("Preferences saved!");
    } catch (error) {
      toast.error("Failed to save preferences");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const saveNotifications = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("notification_settings").upsert(
        {
          user_id: user.id,
          email_job_recommendations: jobAlerts,
          email_weekly_digest: weeklyDigest,
          digest_frequency: digestFrequency,
          push_new_jobs: pushNotifications,
          sms_urgent_alerts: smsNotifications,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
      if (error) throw error;
      toast.success("Notification settings saved!");
    } catch (error) {
      toast.error("Failed to save notification settings");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        setPasswordLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      await supabase.from("security_settings").upsert(
        {
          user_id: user.id,
          last_password_change: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      toast.success("Password changed successfully!");
      setShowPasswordDialog(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
      console.error(error);
    } finally {
      setPasswordLoading(false);
    }
  };

  // AVATAR UPLOAD LOGIC
  const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, or WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Show preview
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
      // Convert base64 to blob
      const response = await fetch(avatarPreview);
      const blob = await response.blob();

      const fileExt = blob.type.split("/")[1];
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Delete old avatar if exists
      if (avatarUrl) {
        const oldFileName = avatarUrl.split("/").pop();
        if (oldFileName) {
          await supabase.storage.from("avatars").remove([oldFileName]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, blob, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setShowAvatarDialog(false);
      setAvatarPreview("");
      toast.success("Avatar updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload avatar");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!user) return;

    setUploading(true);
    try {
      if (avatarUrl) {
        const fileName = avatarUrl.split("/").pop();
        if (fileName) {
          await supabase.storage.from("avatars").remove([fileName]);
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setAvatarUrl("");
      toast.success("Avatar removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove avatar");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return {
    // State
    loading,
    saving,
    user,
    uploading,
    showAvatarDialog,
    setShowAvatarDialog,
    avatarPreview,

    // Profile
    displayName,
    setDisplayName,
    bio,
    setBio,
    tagline,
    setTagline,
    phone,
    setPhone,
    location,
    setLocation,
    avatarUrl,
    setAvatarUrl,

    // Preferences
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    language,
    setLanguage,
    profileDiscoverable,
    setProfileDiscoverable,
    showOnlineStatus,
    setShowOnlineStatus,
    allowMessagesFrom,
    setAllowMessagesFrom,

    // Notifications
    emailNotifications,
    setEmailNotifications,
    pushNotifications,
    setPushNotifications,
    smsNotifications,
    setSmsNotifications,
    jobAlerts,
    setJobAlerts,
    weeklyDigest,
    setWeeklyDigest,
    digestFrequency,
    setDigestFrequency,

    // Security
    twoFactorEnabled,
    setTwoFactorEnabled,
    apiEnabled,
    setApiEnabled,
    loginNotifications,
    setLoginNotifications,

    // Billing
    planType,
    aiCreditsRemaining,

    // Password
    showPasswordDialog,
    setShowPasswordDialog,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordLoading,

    // Actions
    saveProfile,
    savePreferences,
    saveNotifications,
    handlePasswordChange,
    handleAvatarSelect,
    uploadAvatar,
    removeAvatar,
  };
};
