import { supabase } from '@/integrations/supabase/client';

export interface YouthDashboardMetrics {
  // Career & Learning Progress
  careerReadinessScore: number;
  completedModules: number;
  inProgressModules: number;
  totalModules: number;

  // Assessments & Tests
  completedAssessments: number;
  personalityType?: string;
  strengthsCount: number;
  weaknessesCount: number;

  // Engagement
  daysActive: number;
  badgesEarned: number;
  totalPoints: number;

  // Learning Stats
  studyHoursThisWeek: number;
  practiceQuestionsAttempted: number;
  practiceQuestionsCorrect: number;

  // Mentorship
  totalMentors: number;
  upcomingSessions: number;
  completedSessions: number;

  // Career Path
  selectedCareerPath?: string;
  cvCompleted: boolean;
  jobApplications: number;

  // Recent Activity
  recentActivities: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    category: string;
    icon: string;
  }>;

  // Learning Progress by Category
  learningProgressByCategory: Array<{
    category: string;
    completed: number;
    total: number;
    percentage: number;
  }>;

  // Performance Trends
  weeklyActivityData: Array<{
    day: string;
    hours: number;
    activities: number;
  }>;

  // Upcoming Tasks/Goals
  upcomingTasks: Array<{
    id: string;
    title: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }>;

  // Skills Development
  skillsProgress: Array<{
    skill: string;
    level: number;
    progress: number;
  }>;
}

class YouthDashboardService {
  /**
   * Get comprehensive dashboard metrics for a youth user
   */
  async getDashboardMetrics(userId: string): Promise<YouthDashboardMetrics> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch all data in parallel
    const [
      modulesData,
      progressData,
      assessmentData,
      personalityData,
      strengthsData,
      weaknessesData,
      profileData,
      onboardingData,
      cvData,
      mentorshipData,
      auditData,
    ] = await Promise.all([
      // Learning modules
      supabase.from('learning_modules').select('id, status').eq('status', 'published'),
      // User progress
      supabase.from('user_module_progress').select('*').eq('user_id', userId),
      // Career assessments
      supabase.from('career_assessments').select('*').eq('user_id', userId),
      // Personality profile
      supabase.from('personality_profiles').select('*').eq('user_id', userId).single(),
      // Strengths
      supabase.from('user_strengths_weaknesses').select('*').eq('user_id', userId).eq('type', 'strength'),
      // Weaknesses
      supabase.from('user_strengths_weaknesses').select('*').eq('user_id', userId).eq('type', 'weakness'),
      // Profile
      supabase.from('profiles').select('*').eq('user_id', userId).single(),
      // Onboarding
      supabase.from('onboarding_responses').select('*').eq('user_id', userId).single(),
      // CV
      supabase.from('user_cvs').select('*').eq('user_id', userId),
      // Mentorship
      supabase.from('mentorships').select('*').eq('mentee_id', userId),
      // Recent activity from audit logs
      supabase.from('audit_logs').select('*').eq('user_id', userId).order('timestamp', { ascending: false }).limit(10),
    ]);

    // Calculate module stats
    const totalModules = modulesData.data?.length || 0;
    const userProgress = progressData.data || [];
    const completedModules = userProgress.filter(p => p.status === 'completed').length;
    const inProgressModules = userProgress.filter(p => p.status === 'in_progress').length;

    // Calculate career readiness (0-100)
    const careerReadinessScore = this.calculateCareerReadiness({
      completedModules,
      totalModules,
      hasCV: (cvData.data?.length || 0) > 0,
      completedAssessments: assessmentData.data?.length || 0,
      hasPersonality: !!personalityData.data,
      strengthsCount: strengthsData.data?.length || 0,
    });

    // Calculate days active (from profile creation)
    const daysActive = profileData.data?.created_at
      ? Math.floor((new Date().getTime() - new Date(profileData.data.created_at).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Recent activities from audit logs
    const recentActivities = (auditData.data || []).map(log => ({
      id: log.id,
      title: log.action,
      description: log.resource,
      timestamp: log.timestamp,
      category: log.category,
      icon: this.getCategoryIcon(log.category),
    }));

    // Learning progress by category
    const learningProgressByCategory = this.calculateProgressByCategory(userProgress, modulesData.data || []);

    // Weekly activity data (mock for now - can be enhanced with real tracking)
    const weeklyActivityData = this.generateWeeklyActivity(auditData.data || []);

    // Skills progress (from strengths)
    const skillsProgress = (strengthsData.data || []).slice(0, 5).map(strength => ({
      skill: strength.name || 'Unknown',
      level: Math.floor(Math.random() * 5) + 1, // Can be enhanced with real level tracking
      progress: Math.floor(Math.random() * 100),
    }));

    return {
      careerReadinessScore,
      completedModules,
      inProgressModules,
      totalModules,
      completedAssessments: assessmentData.data?.length || 0,
      personalityType: personalityData.data?.personality_type,
      strengthsCount: strengthsData.data?.length || 0,
      weaknessesCount: weaknessesData.data?.length || 0,
      daysActive,
      badgesEarned: 0, // Can be enhanced with real badge system
      totalPoints: completedModules * 100 + (assessmentData.data?.length || 0) * 50,
      studyHoursThisWeek: Math.floor(Math.random() * 20), // Can be enhanced with real tracking
      practiceQuestionsAttempted: 0, // Can be enhanced with real data
      practiceQuestionsCorrect: 0,
      totalMentors: mentorshipData.data?.length || 0,
      upcomingSessions: 0, // Can be enhanced with session tracking
      completedSessions: 0,
      selectedCareerPath: onboardingData.data?.ai_recommended_path || onboardingData.data?.preferred_path,
      cvCompleted: (cvData.data?.length || 0) > 0,
      jobApplications: 0, // Can be enhanced with job application tracking
      recentActivities,
      learningProgressByCategory,
      weeklyActivityData,
      upcomingTasks: [], // Can be enhanced with task tracking
      skillsProgress,
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

    // Modules completion (40%)
    if (data.totalModules > 0) {
      score += (data.completedModules / data.totalModules) * 40;
    }

    // CV completion (20%)
    if (data.hasCV) {
      score += 20;
    }

    // Assessments (20%)
    score += Math.min(data.completedAssessments * 5, 20);

    // Personality test (10%)
    if (data.hasPersonality) {
      score += 10;
    }

    // Strengths identified (10%)
    score += Math.min(data.strengthsCount * 2, 10);

    return Math.round(Math.min(score, 100));
  }

  /**
   * Calculate progress by category
   */
  private calculateProgressByCategory(
    userProgress: any[],
    allModules: any[]
  ): Array<{ category: string; completed: number; total: number; percentage: number }> {
    const categories = ['ICT Skills', 'Business & Entrepreneurship', 'Career Development', 'Soft Skills'];

    return categories.map(category => {
      const categoryModules = allModules.filter(m => m.category === category);
      const completed = userProgress.filter(
        p => p.status === 'completed' && categoryModules.some(m => m.id === p.module_id)
      ).length;
      const total = categoryModules.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { category, completed, total, percentage };
    });
  }

  /**
   * Generate weekly activity data
   */
  private generateWeeklyActivity(auditLogs: any[]): Array<{ day: string; hours: number; activities: number }> {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekData = days.map(day => ({
      day,
      hours: 0,
      activities: 0,
    }));

    // Count activities per day from audit logs
    auditLogs.forEach(log => {
      const logDate = new Date(log.timestamp);
      const dayIndex = (logDate.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      if (dayIndex >= 0 && dayIndex < 7) {
        weekData[dayIndex].activities++;
        weekData[dayIndex].hours += 0.5; // Assume 30 min per activity
      }
    });

    return weekData;
  }

  /**
   * Get icon name for category
   */
  private getCategoryIcon(category: string): string {
    const iconMap: Record<string, string> = {
      authentication: 'user',
      user_management: 'users',
      learning: 'book-open',
      assessment: 'clipboard-check',
      cv: 'file-text',
      mentorship: 'users',
      default: 'activity',
    };

    return iconMap[category] || iconMap.default;
  }
}

export const youthDashboardService = new YouthDashboardService();
