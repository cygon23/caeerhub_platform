import { supabase } from '@/integrations/supabase/client';

export type BadgeCategory = 'learning' | 'assessment' | 'activity' | 'career_readiness' | 'milestone' | 'achievement';
export type BadgeTier = 'bronze' | 'silver' | 'gold';

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  tier: BadgeTier;
  icon: string;
  color: string;
  requirement_type: string;
  requirement_value: number;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge: Badge;
}

export interface BadgeWithProgress extends Badge {
  isEarned: boolean;
  earnedAt?: string;
  progress: number; // 0-100 percentage
  currentValue: number; // Current progress value
}

export interface BadgeStats {
  totalBadges: number;
  earnedBadges: number;
  bronzeBadges: number;
  silverBadges: number;
  goldBadges: number;
  totalPoints: number;
  completionPercentage: number;
  recentBadges: UserBadge[];
  featuredBadges: UserBadge[];
}

class BadgeService {
  /**
   * Get all badges with user's progress and earned status
   */
  async getBadgesWithProgress(userId: string): Promise<BadgeWithProgress[]> {
    // Fetch all badges
    const { data: badges, error: badgesError } = await supabase
      .from('badges')
      .select('*')
      .order('tier', { ascending: true })
      .order('requirement_value', { ascending: true });

    if (badgesError) {
      console.error('Error fetching badges:', badgesError);
      return [];
    }

    // Fetch user's earned badges
    const { data: userBadges, error: userBadgesError } = await supabase
      .from('user_badges')
      .select('badge_id, earned_at')
      .eq('user_id', userId);

    if (userBadgesError) {
      console.error('Error fetching user badges:', userBadgesError);
    }

    const earnedBadgeMap = new Map(
      (userBadges || []).map(ub => [ub.badge_id, ub.earned_at])
    );

    // Get user metrics for progress calculation
    const metrics = await this.getUserMetrics(userId);

    // Map badges with progress
    return (badges || []).map(badge => {
      const isEarned = earnedBadgeMap.has(badge.id);
      const earnedAt = earnedBadgeMap.get(badge.id);
      const { progress, currentValue } = this.calculateBadgeProgress(badge, metrics);

      return {
        ...badge,
        isEarned,
        earnedAt,
        progress,
        currentValue,
      };
    });
  }

  /**
   * Get user's badge statistics
   */
  async getBadgeStats(userId: string): Promise<BadgeStats> {
    // Get all badges with progress
    const badgesWithProgress = await this.getBadgesWithProgress(userId);

    // Get user's earned badges with full badge data
    const { data: userBadges, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('Error fetching user badges:', error);
    }

    const earnedBadges = badgesWithProgress.filter(b => b.isEarned);
    const recentBadges = (userBadges || []).slice(0, 5);

    // Featured badges - highest tier earned badges
    const featuredBadges = (userBadges || [])
      .filter(ub => ub.badge?.tier === 'gold')
      .slice(0, 3);

    // If less than 3 gold badges, add silver ones
    if (featuredBadges.length < 3) {
      const silverBadges = (userBadges || [])
        .filter(ub => ub.badge?.tier === 'silver' && !featuredBadges.find(fb => fb.id === ub.id))
        .slice(0, 3 - featuredBadges.length);
      featuredBadges.push(...silverBadges);
    }

    // If still less than 3, add bronze ones
    if (featuredBadges.length < 3) {
      const bronzeBadges = (userBadges || [])
        .filter(ub => ub.badge?.tier === 'bronze' && !featuredBadges.find(fb => fb.id === ub.id))
        .slice(0, 3 - featuredBadges.length);
      featuredBadges.push(...bronzeBadges);
    }

    const totalPoints = earnedBadges.reduce((sum, badge) => sum + badge.points, 0);

    return {
      totalBadges: badgesWithProgress.length,
      earnedBadges: earnedBadges.length,
      bronzeBadges: earnedBadges.filter(b => b.tier === 'bronze').length,
      silverBadges: earnedBadges.filter(b => b.tier === 'silver').length,
      goldBadges: earnedBadges.filter(b => b.tier === 'gold').length,
      totalPoints,
      completionPercentage: Math.round((earnedBadges.length / badgesWithProgress.length) * 100),
      recentBadges: recentBadges as UserBadge[],
      featuredBadges: featuredBadges as UserBadge[],
    };
  }

  /**
   * Get user metrics for badge progress calculation
   */
  private async getUserMetrics(userId: string): Promise<Record<string, number>> {
    const [
      modulesData,
      progressData,
      assessmentData,
      personalityData,
      strengthsData,
      profileData,
      onboardingData,
      cvData,
      mentorshipData,
    ] = await Promise.all([
      supabase.from('learning_modules').select('id, status').eq('status', 'published'),
      supabase.from('user_module_progress').select('*').eq('user_id', userId),
      supabase.from('career_assessments').select('*').eq('user_id', userId),
      supabase.from('personality_profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('user_strengths_weaknesses').select('strengths').eq('user_id', userId).eq('is_active', true).maybeSingle(),
      supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('onboarding_responses').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('user_cvs').select('*').eq('user_id', userId),
      supabase.from('mentorships').select('*').eq('mentee_id', userId),
    ]);

    const userProgress = progressData.data || [];
    const completedModules = userProgress.filter(p => p.status === 'completed').length;
    const totalModules = modulesData.data?.length || 0;

    // Calculate strengths count from JSON array
    const strengthsCount = strengthsData.data?.strengths
      ? (Array.isArray(strengthsData.data.strengths) ? strengthsData.data.strengths.length : 0)
      : 0;

    // Calculate career readiness
    const careerReadiness = this.calculateCareerReadiness({
      completedModules,
      totalModules,
      hasCV: (cvData.data?.length || 0) > 0,
      completedAssessments: assessmentData.data?.length || 0,
      hasPersonality: !!personalityData.data,
      strengthsCount,
    });

    // Calculate days active
    const daysActive = profileData.data?.created_at
      ? Math.floor((new Date().getTime() - new Date(profileData.data.created_at).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Calculate total points
    const totalPoints = completedModules * 100 + (assessmentData.data?.length || 0) * 50;

    return {
      modules_completed: completedModules,
      assessments_completed: assessmentData.data?.length || 0,
      personality_completed: personalityData.data ? 1 : 0,
      strengths_identified: strengthsCount,
      cv_completed: (cvData.data?.length || 0) > 0 ? 1 : 0,
      days_active: daysActive,
      career_readiness: careerReadiness,
      mentors_connected: mentorshipData.data?.length || 0,
      onboarding_completed: onboardingData.data ? 1 : 0,
      points_earned: totalPoints,
      job_applications: 0, // Can be enhanced when job application tracking is added
      category_mastery: 0, // Can be enhanced with category-specific tracking
      full_journey: 0, // Can be enhanced with comprehensive journey tracking
      quick_start: 0, // Can be enhanced with time-based activity tracking
      perfect_score: 0, // Can be enhanced with assessment score tracking
      profile_completed: profileData.data ? 1 : 0,
    };
  }

  /**
   * Calculate career readiness score (0-100)
   */
  private calculateCareerReadiness(data: {
    completedModules: number;
    totalModules: number;
    hasCV: boolean;
    completedAssessments: number;
    hasPersonality: boolean;
    strengthsCount: number;
  }): number {
    let score = 0;

    if (data.totalModules > 0) {
      score += (data.completedModules / data.totalModules) * 40;
    }

    if (data.hasCV) score += 20;
    score += Math.min(data.completedAssessments * 5, 20);
    if (data.hasPersonality) score += 10;
    score += Math.min(data.strengthsCount * 2, 10);

    return Math.round(Math.min(score, 100));
  }

  /**
   * Calculate progress toward earning a badge
   */
  private calculateBadgeProgress(
    badge: Badge,
    metrics: Record<string, number>
  ): { progress: number; currentValue: number } {
    const currentValue = metrics[badge.requirement_type] || 0;
    const progress = Math.min((currentValue / badge.requirement_value) * 100, 100);

    return {
      progress: Math.round(progress),
      currentValue,
    };
  }

  /**
   * Award a badge to a user (called manually or by system)
   */
  async awardBadge(userId: string, badgeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badgeId,
        });

      if (error) {
        console.error('Error awarding badge:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in awardBadge:', error);
      return false;
    }
  }

  /**
   * Check and award eligible badges to user
   * This can be called after user completes activities
   */
  async checkAndAwardBadges(userId: string): Promise<void> {
    const badgesWithProgress = await this.getBadgesWithProgress(userId);

    // Find badges that are eligible but not yet earned
    const eligibleBadges = badgesWithProgress.filter(
      badge => !badge.isEarned && badge.progress >= 100
    );

    // Award each eligible badge
    for (const badge of eligibleBadges) {
      await this.awardBadge(userId, badge.id);
    }
  }
}

export const badgeService = new BadgeService();
