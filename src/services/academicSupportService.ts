import { supabase } from '@/integrations/supabase/client';

// ============================================
// Types
// ============================================

export interface AcademicProfile {
  id: string;
  user_id: string;
  education_level: string;
  subjects_need_help: SubjectHelp[];
  help_types: string[];
  specific_struggles: string | null;
  ai_profile_summary: string | null;
  onboarding_completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface SubjectHelp {
  name: string;
  topics: string[];
}

export interface StudyGroup {
  id: string;
  created_by: string;
  name: string;
  subject: string;
  description: string | null;
  max_members: number;
  member_count: number;
  schedule_day: string | null;
  schedule_time: string | null;
  is_recurring: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudyGroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface AcademicAssignment {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  description: string | null;
  due_date: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  group_id: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface AcademicQuiz {
  id: string;
  created_by: string;
  title: string;
  subject: string;
  description: string | null;
  time_limit_minutes: number | null;
  questions: QuizQuestion[];
  question_count: number;
  is_public: boolean;
  group_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  answers: any[];
  score: number;
  total_questions: number;
  percentage: number;
  time_spent_seconds: number | null;
  completed_at: string;
  created_at: string;
}

export interface StudySchedule {
  id: string;
  user_id: string;
  subject: string;
  title: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface GroupDiscussion {
  id: string;
  group_id: string;
  author_id: string;
  title: string;
  content: string;
  type: 'discussion' | 'question' | 'resource' | 'announcement';
  is_pinned: boolean;
  like_count: number;
  dislike_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  author_name?: string;
}

export interface DiscussionComment {
  id: string;
  discussion_id: string;
  author_id: string;
  parent_comment_id: string | null;
  content: string;
  like_count: number;
  dislike_count: number;
  created_at: string;
  updated_at: string;
  author_name?: string;
}

export interface DiscussionReaction {
  id: string;
  user_id: string;
  discussion_id: string | null;
  comment_id: string | null;
  reaction_type: 'like' | 'dislike';
  created_at: string;
}

export interface GroupPoll {
  id: string;
  group_id: string;
  author_id: string;
  question: string;
  options: PollOption[];
  is_anonymous: boolean;
  allows_multiple: boolean;
  ends_at: string | null;
  total_votes: number;
  is_active: boolean;
  created_at: string;
  author_name?: string;
}

export interface PollOption {
  text: string;
  votes?: number;
}

export interface GroupPollVote {
  id: string;
  poll_id: string;
  user_id: string;
  option_index: number;
  created_at: string;
}

// ============================================
// Service
// ============================================

class AcademicSupportService {
  // --- Academic Profile ---

  async getProfile(): Promise<AcademicProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('academic_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createProfile(profile: {
    education_level: string;
    subjects_need_help: SubjectHelp[];
    help_types: string[];
    specific_struggles?: string;
  }): Promise<AcademicProfile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('academic_profiles')
      .insert({
        user_id: user.id,
        education_level: profile.education_level,
        subjects_need_help: profile.subjects_need_help,
        help_types: profile.help_types,
        specific_struggles: profile.specific_struggles || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfile(updates: Partial<{
    education_level: string;
    subjects_need_help: SubjectHelp[];
    help_types: string[];
    specific_struggles: string;
  }>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('academic_profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  // --- Study Groups ---

  async getGroups(filters?: { subject?: string }): Promise<StudyGroup[]> {
    let query = supabase
      .from('study_groups')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (filters?.subject) {
      query = query.eq('subject', filters.subject);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getMyGroups(): Promise<StudyGroup[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: memberships, error: memberError } = await supabase
      .from('study_group_members')
      .select('group_id')
      .eq('user_id', user.id);

    if (memberError) throw memberError;
    if (!memberships || memberships.length === 0) return [];

    const groupIds = memberships.map(m => m.group_id);

    const { data, error } = await supabase
      .from('study_groups')
      .select('*')
      .in('id', groupIds)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createGroup(group: {
    name: string;
    subject: string;
    description?: string;
    max_members?: number;
    schedule_day?: string;
    schedule_time?: string;
    is_recurring?: boolean;
  }): Promise<StudyGroup> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('study_groups')
      .insert({
        created_by: user.id,
        name: group.name,
        subject: group.subject,
        description: group.description || null,
        max_members: group.max_members || 20,
        schedule_day: group.schedule_day || null,
        schedule_time: group.schedule_time || null,
        is_recurring: group.is_recurring || false,
      })
      .select()
      .single();

    if (error) throw error;

    // Auto-join as admin
    await supabase.from('study_group_members').insert({
      group_id: data.id,
      user_id: user.id,
      role: 'admin',
    });

    return data;
  }

  async joinGroup(groupId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.from('study_group_members').insert({
      group_id: groupId,
      user_id: user.id,
      role: 'member',
    });

    if (error) throw error;
  }

  async leaveGroup(groupId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('study_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  async getGroupMembers(groupId: string): Promise<StudyGroupMember[]> {
    const { data, error } = await supabase
      .from('study_group_members')
      .select('*')
      .eq('group_id', groupId)
      .order('joined_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async isGroupMember(groupId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('study_group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .maybeSingle();

    return !!data;
  }

  // --- Assignments ---

  async getAssignments(filters?: { status?: string }): Promise<AcademicAssignment[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let query = supabase
      .from('academic_assignments')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async createAssignment(assignment: {
    title: string;
    subject: string;
    description?: string;
    due_date: string;
    priority?: string;
    group_id?: string;
  }): Promise<AcademicAssignment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('academic_assignments')
      .insert({
        user_id: user.id,
        title: assignment.title,
        subject: assignment.subject,
        description: assignment.description || null,
        due_date: assignment.due_date,
        priority: assignment.priority || 'medium',
        group_id: assignment.group_id || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateAssignment(id: string, updates: Partial<{
    title: string;
    subject: string;
    description: string;
    due_date: string;
    priority: string;
    status: string;
    completed_at: string;
  }>): Promise<void> {
    const { error } = await supabase
      .from('academic_assignments')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  }

  async deleteAssignment(id: string): Promise<void> {
    const { error } = await supabase
      .from('academic_assignments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // --- Quizzes ---

  async getQuizzes(): Promise<AcademicQuiz[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('academic_quizzes')
      .select('*')
      .or(`created_by.eq.${user.id},is_public.eq.true`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createQuiz(quiz: {
    title: string;
    subject: string;
    description?: string;
    time_limit_minutes?: number;
    questions: QuizQuestion[];
    is_public?: boolean;
    group_id?: string;
  }): Promise<AcademicQuiz> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('academic_quizzes')
      .insert({
        created_by: user.id,
        title: quiz.title,
        subject: quiz.subject,
        description: quiz.description || null,
        time_limit_minutes: quiz.time_limit_minutes || null,
        questions: quiz.questions,
        question_count: quiz.questions.length,
        is_public: quiz.is_public || false,
        group_id: quiz.group_id || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteQuiz(id: string): Promise<void> {
    const { error } = await supabase
      .from('academic_quizzes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async submitQuizAttempt(attempt: {
    quiz_id: string;
    answers: any[];
    score: number;
    total_questions: number;
    percentage: number;
    time_spent_seconds?: number;
  }): Promise<QuizAttempt> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('academic_quiz_attempts')
      .insert({
        quiz_id: attempt.quiz_id,
        user_id: user.id,
        answers: attempt.answers,
        score: attempt.score,
        total_questions: attempt.total_questions,
        percentage: attempt.percentage,
        time_spent_seconds: attempt.time_spent_seconds || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getQuizAttempts(quizId: string): Promise<QuizAttempt[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('academic_quiz_attempts')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // --- Study Schedule ---

  async getSchedules(): Promise<StudySchedule[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('study_schedules')
      .select('*')
      .eq('user_id', user.id)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async createSchedule(schedule: {
    subject: string;
    title?: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_recurring?: boolean;
    color?: string;
  }): Promise<StudySchedule> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('study_schedules')
      .insert({
        user_id: user.id,
        subject: schedule.subject,
        title: schedule.title || null,
        day_of_week: schedule.day_of_week,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        is_recurring: schedule.is_recurring ?? true,
        color: schedule.color || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateSchedule(id: string, updates: Partial<{
    subject: string;
    title: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    color: string;
  }>): Promise<void> {
    const { error } = await supabase
      .from('study_schedules')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  }

  async deleteSchedule(id: string): Promise<void> {
    const { error } = await supabase
      .from('study_schedules')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
  // --- Group Discussions ---

  async getDiscussions(groupId: string, options?: { type?: string; sortBy?: 'newest' | 'popular' }): Promise<GroupDiscussion[]> {
    let query = supabase
      .from('group_discussions')
      .select('*')
      .eq('group_id', groupId);

    if (options?.type) {
      query = query.eq('type', options.type);
    }

    if (options?.sortBy === 'popular') {
      query = query.order('like_count', { ascending: false });
    } else {
      query = query.order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async createDiscussion(discussion: {
    group_id: string;
    title: string;
    content: string;
    type?: string;
  }): Promise<GroupDiscussion> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('group_discussions')
      .insert({
        group_id: discussion.group_id,
        author_id: user.id,
        title: discussion.title,
        content: discussion.content,
        type: discussion.type || 'discussion',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteDiscussion(id: string): Promise<void> {
    const { error } = await supabase.from('group_discussions').delete().eq('id', id);
    if (error) throw error;
  }

  async pinDiscussion(id: string, pinned: boolean): Promise<void> {
    const { error } = await supabase
      .from('group_discussions')
      .update({ is_pinned: pinned })
      .eq('id', id);
    if (error) throw error;
  }

  // --- Discussion Comments ---

  async getComments(discussionId: string): Promise<DiscussionComment[]> {
    const { data, error } = await supabase
      .from('discussion_comments')
      .select('*')
      .eq('discussion_id', discussionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async createComment(comment: {
    discussion_id: string;
    content: string;
    parent_comment_id?: string;
  }): Promise<DiscussionComment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('discussion_comments')
      .insert({
        discussion_id: comment.discussion_id,
        author_id: user.id,
        content: comment.content,
        parent_comment_id: comment.parent_comment_id || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteComment(id: string): Promise<void> {
    const { error } = await supabase.from('discussion_comments').delete().eq('id', id);
    if (error) throw error;
  }

  // --- Reactions ---

  async getMyReactions(discussionId?: string, commentIds?: string[]): Promise<DiscussionReaction[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('discussion_reactions')
      .select('*')
      .eq('user_id', user.id);

    if (discussionId) {
      query = query.eq('discussion_id', discussionId);
    }
    if (commentIds && commentIds.length > 0) {
      query = query.in('comment_id', commentIds);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getMyDiscussionReactions(discussionIds: string[]): Promise<DiscussionReaction[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('discussion_reactions')
      .select('*')
      .eq('user_id', user.id)
      .in('discussion_id', discussionIds);

    if (error) throw error;
    return data || [];
  }

  async toggleReaction(target: { discussionId?: string; commentId?: string }, type: 'like' | 'dislike'): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check for existing reaction
    let existingQuery = supabase
      .from('discussion_reactions')
      .select('*')
      .eq('user_id', user.id);

    if (target.discussionId) {
      existingQuery = existingQuery.eq('discussion_id', target.discussionId);
    } else if (target.commentId) {
      existingQuery = existingQuery.eq('comment_id', target.commentId);
    }

    const { data: existing } = await existingQuery;
    const currentReaction = existing?.[0];

    if (currentReaction) {
      // Remove existing reaction
      await supabase.from('discussion_reactions').delete().eq('id', currentReaction.id);

      // If same type, just remove (toggle off). If different type, add new one.
      if (currentReaction.reaction_type === type) return;
    }

    // Add new reaction
    const { error } = await supabase.from('discussion_reactions').insert({
      user_id: user.id,
      discussion_id: target.discussionId || null,
      comment_id: target.commentId || null,
      reaction_type: type,
    });

    if (error) throw error;
  }

  // --- Polls ---

  async getPolls(groupId: string): Promise<GroupPoll[]> {
    const { data, error } = await supabase
      .from('group_polls')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createPoll(poll: {
    group_id: string;
    question: string;
    options: { text: string }[];
    is_anonymous?: boolean;
    allows_multiple?: boolean;
    ends_at?: string;
  }): Promise<GroupPoll> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('group_polls')
      .insert({
        group_id: poll.group_id,
        author_id: user.id,
        question: poll.question,
        options: poll.options,
        is_anonymous: poll.is_anonymous || false,
        allows_multiple: poll.allows_multiple || false,
        ends_at: poll.ends_at || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getMyPollVotes(pollId: string): Promise<GroupPollVote[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('group_poll_votes')
      .select('*')
      .eq('poll_id', pollId)
      .eq('user_id', user.id);

    if (error) throw error;
    return data || [];
  }

  async getPollVoteCounts(pollId: string): Promise<Record<number, number>> {
    const { data, error } = await supabase
      .from('group_poll_votes')
      .select('option_index')
      .eq('poll_id', pollId);

    if (error) throw error;
    const counts: Record<number, number> = {};
    (data || []).forEach(v => {
      counts[v.option_index] = (counts[v.option_index] || 0) + 1;
    });
    return counts;
  }

  async votePoll(pollId: string, optionIndex: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.from('group_poll_votes').insert({
      poll_id: pollId,
      user_id: user.id,
      option_index: optionIndex,
    });

    if (error) throw error;
  }

  async removePollVote(pollId: string, optionIndex: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('group_poll_votes')
      .delete()
      .eq('poll_id', pollId)
      .eq('user_id', user.id)
      .eq('option_index', optionIndex);

    if (error) throw error;
  }

  // --- Author Names (batch fetch) ---

  async getAuthorNames(userIds: string[]): Promise<Record<string, string>> {
    if (userIds.length === 0) return {};
    const uniqueIds = [...new Set(userIds)];

    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, display_name')
      .in('user_id', uniqueIds);

    if (error) return {};
    const map: Record<string, string> = {};
    (data || []).forEach(p => { map[p.user_id] = p.display_name || 'Anonymous'; });
    return map;
  }

  // --- AI Plan Generation ---

  async generateAcademicPlan(profile: AcademicProfile, type: 'full' | 'assignments' | 'quizzes' | 'schedule' = 'full'): Promise<{
    success: boolean;
    plan?: any;
    assignments?: AcademicAssignment[];
    quizzes?: AcademicQuiz[];
    schedules?: StudySchedule[];
    error?: string;
  }> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('generate-academic-plan', {
      body: {
        userId: session.user.id,
        profile: {
          education_level: profile.education_level,
          subjects_need_help: profile.subjects_need_help,
          help_types: profile.help_types,
          specific_struggles: profile.specific_struggles,
        },
        type,
      },
    });

    if (error) throw error;
    return data;
  }

  async getStudyFocus(profile: AcademicProfile): Promise<{ summary: string; weekly_tips: string[]; priority_subject: string } | null> {
    if (!profile.ai_profile_summary) return null;
    try {
      return JSON.parse(profile.ai_profile_summary);
    } catch {
      return null;
    }
  }

  async hasAIContent(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { count } = await supabase
      .from('academic_assignments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    return (count || 0) > 0;
  }

  async clearAllContent(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await Promise.all([
      supabase.from('academic_assignments').delete().eq('user_id', user.id),
      supabase.from('academic_quizzes').delete().eq('created_by', user.id),
      supabase.from('study_schedules').delete().eq('user_id', user.id),
    ]);
  }
}

export const academicSupportService = new AcademicSupportService();
