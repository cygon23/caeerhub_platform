import { supabase } from '@/integrations/supabase/client';

export type ContentType = 'video' | 'pdf' | 'article' | 'quiz' | 'external_link' | 'mixed';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ModuleStatus = 'draft' | 'published' | 'archived';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export type ModuleCategory =
  | 'ICT Skills'
  | 'Business & Entrepreneurship'
  | 'Career Development'
  | 'Soft Skills'
  | 'Academic Support'
  | 'Technical Skills'
  | 'Life Skills'
  | 'Other';

export interface LearningModule {
  id: string;
  title: string;
  description?: string;
  content?: string;
  thumbnail_url?: string;
  category: ModuleCategory;
  difficulty_level: DifficultyLevel;
  duration_minutes?: number;
  content_type: ContentType;
  video_url?: string;
  pdf_url?: string;
  external_link?: string;
  prerequisites?: string[];
  learning_objectives?: string[];
  target_audience?: string[];
  status: ModuleStatus;
  views_count: number;
  enrollments_count: number;
  completions_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface UserModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  status: ProgressStatus;
  progress_percentage: number;
  started_at?: string;
  completed_at?: string;
  last_accessed_at: string;
  rating?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface UserLearningPreferences {
  id: string;
  user_id: string;
  selected_topics?: string[];
  learning_goals?: string[];
  skill_gaps?: string[];
  preferred_difficulty?: DifficultyLevel;
  preferred_categories?: string[];
  conversation_history?: any[];
  created_at: string;
  updated_at: string;
}

export interface ModuleWithProgress extends LearningModule {
  user_progress?: UserModuleProgress;
}

class LearningModulesService {
  // ==================== ADMIN: MODULE MANAGEMENT ====================

  /**
   * Get all modules (admin only)
   */
  async getAllModules(status?: ModuleStatus): Promise<LearningModule[]> {
    let query = supabase
      .from('learning_modules')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  /**
   * Get published modules (for users)
   */
  async getPublishedModules(category?: ModuleCategory): Promise<LearningModule[]> {
    let query = supabase
      .from('learning_modules')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  /**
   * Get modules with user progress
   */
  async getModulesWithProgress(userId: string, category?: ModuleCategory): Promise<ModuleWithProgress[]> {
    let query = supabase
      .from('learning_modules')
      .select(`
        *,
        user_progress:user_module_progress(*)
      `)
      .eq('status', 'published')
      .eq('user_module_progress.user_id', userId)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Transform the data
    return (data || []).map((module: any) => ({
      ...module,
      user_progress: module.user_progress?.[0] || null,
    }));
  }

  /**
   * Get single module by ID
   */
  async getModuleById(id: string): Promise<LearningModule | null> {
    const { data, error } = await supabase
      .from('learning_modules')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create new module (admin only)
   */
  async createModule(module: Omit<LearningModule, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'enrollments_count' | 'completions_count'>): Promise<LearningModule> {
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('learning_modules')
      .insert({
        ...module,
        created_by: user.user?.id,
        published_at: module.status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update module (admin only)
   */
  async updateModule(id: string, updates: Partial<LearningModule>): Promise<LearningModule> {
    // If publishing, set published_at
    if (updates.status === 'published' && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('learning_modules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete module (admin only)
   */
  async deleteModule(id: string): Promise<void> {
    const { error } = await supabase
      .from('learning_modules')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ==================== USER: MODULE INTERACTION ====================

  /**
   * Increment module views
   */
  async incrementViews(moduleId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_module_views', {
      module_id: moduleId,
    });

    if (error) console.error('Error incrementing views:', error);
  }

  /**
   * Enroll in module
   */
  async enrollInModule(moduleId: string): Promise<string> {
    const { data, error } = await supabase.rpc('enroll_in_module', {
      p_module_id: moduleId,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Update module progress
   */
  async updateProgress(
    moduleId: string,
    progressPercentage: number,
    status?: ProgressStatus
  ): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const updates: any = {
      progress_percentage: progressPercentage,
      last_accessed_at: new Date().toISOString(),
    };

    if (status) {
      updates.status = status;
    }

    if (progressPercentage === 100 && status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('user_module_progress')
      .update(updates)
      .eq('user_id', user.user.id)
      .eq('module_id', moduleId);

    if (error) throw error;
  }

  /**
   * Complete module
   */
  async completeModule(moduleId: string): Promise<void> {
    const { error } = await supabase.rpc('complete_module', {
      p_module_id: moduleId,
    });

    if (error) throw error;
  }

  /**
   * Rate module
   */
  async rateModule(moduleId: string, rating: number, feedback?: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_module_progress')
      .update({
        rating,
        feedback,
      })
      .eq('user_id', user.user.id)
      .eq('module_id', moduleId);

    if (error) throw error;
  }

  /**
   * Get user's progress for a specific module
   */
  async getUserProgress(moduleId: string): Promise<UserModuleProgress | null> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await supabase
      .from('user_module_progress')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('module_id', moduleId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  }

  /**
   * Get all user's progress
   */
  async getAllUserProgress(): Promise<UserModuleProgress[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];

    const { data, error } = await supabase
      .from('user_module_progress')
      .select('*')
      .eq('user_id', user.user.id)
      .order('last_accessed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // ==================== USER LEARNING PREFERENCES ====================

  /**
   * Get user learning preferences
   */
  async getUserPreferences(): Promise<UserLearningPreferences | null> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await supabase
      .from('user_learning_preferences')
      .select('*')
      .eq('user_id', user.user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Update user learning preferences
   */
  async updateUserPreferences(
    preferences: Partial<Omit<UserLearningPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<UserLearningPreferences> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_learning_preferences')
      .upsert({
        user_id: user.user.id,
        ...preferences,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Add to conversation history (for AI context)
   */
  async addToConversationHistory(message: any): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    // Get current preferences
    const prefs = await this.getUserPreferences();
    const currentHistory = prefs?.conversation_history || [];

    // Add new message
    const updatedHistory = [...currentHistory, message];

    // Keep only last 50 messages
    const trimmedHistory = updatedHistory.slice(-50);

    await this.updateUserPreferences({
      conversation_history: trimmedHistory,
    });
  }

  // ==================== ANALYTICS ====================

  /**
   * Get module statistics (admin only)
   */
  async getModuleStats() {
    const { data, error } = await supabase
      .from('learning_modules')
      .select('category, status, difficulty_level, content_type');

    if (error) throw error;

    const stats = {
      total: data.length,
      byCategory: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      byDifficulty: {} as Record<string, number>,
      byContentType: {} as Record<string, number>,
    };

    data.forEach((module) => {
      stats.byCategory[module.category] = (stats.byCategory[module.category] || 0) + 1;
      stats.byStatus[module.status] = (stats.byStatus[module.status] || 0) + 1;
      stats.byDifficulty[module.difficulty_level] = (stats.byDifficulty[module.difficulty_level] || 0) + 1;
      stats.byContentType[module.content_type] = (stats.byContentType[module.content_type] || 0) + 1;
    });

    return stats;
  }

  /**
   * Get popular modules
   */
  async getPopularModules(limit: number = 5): Promise<LearningModule[]> {
    const { data, error } = await supabase
      .from('learning_modules')
      .select('*')
      .eq('status', 'published')
      .order('enrollments_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Search modules
   */
  async searchModules(query: string): Promise<LearningModule[]> {
    const { data, error } = await supabase
      .from('learning_modules')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export const learningModulesService = new LearningModulesService();
