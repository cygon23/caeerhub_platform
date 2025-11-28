import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  email: string;
  name: string;
  display_name?: string;
  role: string;
  status: string;
  phone?: string;
  location?: string;
  avatar_url?: string;
  created_at: string;
  last_sign_in_at?: string;
}

export interface Mentor extends User {
  expertise?: string[];
  availability?: string;
  mentees_count?: number;
}

export interface School {
  id: string;
  school_name: string;
  registration_number: string;
  contact_email: string;
  contact_phone: string;
  address?: string;
  city?: string;
  region?: string;
  primary_color?: string;
  secondary_color?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface Student {
  id: string;
  school_id: string;
  student_name: string;
  form_level: number;
  registration_number: string;
  email?: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user_id?: string;
  user_email?: string;
  user_role?: string;
  action: string;
  resource: string;
  resource_id?: string;
  category: 'authentication' | 'user_management' | 'system' | 'data' | 'security' | 'school_management' | 'student_management';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip_address?: string;
  user_agent?: string;
  details?: any;
  success: boolean;
  error_message?: string;
  metadata?: any;
  created_at: string;
}

export interface AuditLogFilters {
  category?: string;
  severity?: string;
  success?: boolean;
  startDate?: string;
  endDate?: string;
  userId?: string;
  search?: string;
}

export interface SystemAnalytics {
  totalUsers: number;
  totalSchools: number;
  totalStudents: number;
  totalMentors: number;
  activeUsers: number;
  usersByRole: Record<string, number>;
  schoolsByStatus: Record<string, number>;
  studentsByStatus: Record<string, number>;
  auditLogsByCategory: Record<string, number>;
  auditLogsBySeverity: Record<string, number>;
  userGrowthByMonth: Array<{ month: string; count: number }>;
  schoolGrowthByMonth: Array<{ month: string; count: number }>;
}

export interface DashboardMetrics {
  // Real-time stats
  totalUsers: number;
  activeUsers: number;
  totalSchools: number;
  pendingSchools: number;
  totalStudents: number;
  activeStudents: number;
  totalMentors: number;
  activeMentors: number;

  // Recent activity (last 24h)
  newUsersToday: number;
  newSchoolsToday: number;
  recentLogins: number;

  // Engagement metrics
  usersByRole: Record<string, number>;
  schoolsByStatus: Record<string, number>;
  schoolsByRegion: Record<string, number>;
  studentsByFormLevel: Record<number, number>;

  // System health
  systemHealth: {
    totalEvents: number;
    successRate: number;
    criticalErrors: number;
    avgResponseTime: number;
  };

  // Activity timeline (last 10 events)
  recentActivity: Array<{
    id: string;
    timestamp: string;
    action: string;
    user: string;
    category: string;
    severity: string;
  }>;

  // Growth trends
  userGrowthLast7Days: Array<{ date: string; count: number }>;
  schoolGrowthLast7Days: Array<{ date: string; count: number }>;
  activityByHour: Array<{ hour: number; count: number }>;
}

class AdminService {
  /**
   * Fetch all users with their roles and profiles
   */
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase.rpc('get_admin_users');

    if (error) throw error;
    if (!data) return [];

    return data.map((item: any) => ({
      id: item.user_id,
      email: item.email || '',
      name: item.display_name || item.email?.split('@')[0] || 'Unknown',
      display_name: item.display_name,
      role: item.role || 'youth',
      status: item.status || 'active',
      phone: item.phone,
      location: item.location,
      avatar_url: item.avatar_url,
      created_at: item.profile_created_at,
      last_sign_in_at: item.last_sign_in_at,
    }));
  }

  /**
   * Fetch mentors specifically
   */
  async getMentors(): Promise<Mentor[]> {
    // Reuse getUsers and filter for mentors
    const allUsers = await this.getUsers();
    const mentors = allUsers.filter(user => user.role === 'mentor');

    return mentors.map(mentor => ({
      ...mentor,
      expertise: [],
      availability: 'available',
      mentees_count: 0,
    }));
  }

  /**
   * Update user status
   */
  async updateUserStatus(userId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('user_id', userId);

    if (error) throw error;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: updates.name || updates.display_name,
        phone: updates.phone,
        location: updates.location,
      })
      .eq('user_id', userId);

    if (error) throw error;
  }

  /**
   * Delete user (soft delete by setting status to inactive)
   */
  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'inactive' })
      .eq('user_id', userId);

    if (error) throw error;
  }

  // ==================== SCHOOL MANAGEMENT ====================

  /**
   * Get all school registrations
   */
  async getSchools(status?: 'pending' | 'approved' | 'rejected'): Promise<School[]> {
    let query = supabase
      .from('school_registrations')
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
   * Approve school and create school admin account
   */
  async approveSchool(
    schoolId: string,
    adminEmail: string,
    adminName: string
  ): Promise<{ username: string; password: string }> {
    // Generate random password
    const password = this.generatePassword();

    // Get school details
    const { data: school, error: schoolError } = await supabase
      .from('school_registrations')
      .select('*')
      .eq('id', schoolId)
      .single();

    if (schoolError) throw schoolError;

    // Create auth user for school admin
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: password,
      options: {
        data: {
          name: adminName,
          role: 'school_admin',
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    // Add role
    const { error: roleError } = await supabase.from('user_roles').insert({
      user_id: authData.user.id,
      role: 'school_admin',
    });

    if (roleError) throw roleError;

    // Update profile with school_id
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ school_id: school.registration_number })
      .eq('user_id', authData.user.id);

    if (profileError) throw profileError;

    // Update school status to approved
    const { error: updateError } = await supabase
      .from('school_registrations')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .eq('id', schoolId);

    if (updateError) throw updateError;

    return {
      username: adminEmail,
      password: password,
    };
  }

  /**
   * Reject school registration
   */
  async rejectSchool(schoolId: string, adminNotes: string): Promise<void> {
    const { error } = await supabase
      .from('school_registrations')
      .update({
        status: 'rejected',
        admin_notes: adminNotes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .eq('id', schoolId);

    if (error) throw error;
  }

  /**
   * Update school information
   */
  async updateSchool(schoolId: string, updates: Partial<School>): Promise<void> {
    const { error } = await supabase
      .from('school_registrations')
      .update({
        school_name: updates.school_name,
        contact_email: updates.contact_email,
        contact_phone: updates.contact_phone,
        address: updates.address,
        city: updates.city,
        region: updates.region,
        primary_color: updates.primary_color,
        secondary_color: updates.secondary_color,
        updated_at: new Date().toISOString(),
      })
      .eq('id', schoolId);

    if (error) throw error;
  }

  /**
   * Generate random password
   */
  private generatePassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  // ==================== STUDENT MANAGEMENT ====================

  /**
   * Get students for a school
   */
  async getStudents(schoolId: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', schoolId)
      .order('form_level', { ascending: true })
      .order('student_name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Create student
   */
  async createStudent(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> {
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('students')
      .insert({
        ...student,
        created_by: user.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update student
   */
  async updateStudent(studentId: string, updates: Partial<Student>): Promise<void> {
    const { error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', studentId);

    if (error) throw error;
  }

  /**
   * Delete student
   */
  async deleteStudent(studentId: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId);

    if (error) throw error;
  }

  /**
   * Get student statistics for a school
   */
  async getStudentStats(schoolId: string) {
    const { data, error } = await supabase
      .from('students')
      .select('form_level, status')
      .eq('school_id', schoolId);

    if (error) throw error;

    const stats = {
      total: data.length,
      byFormLevel: {} as Record<number, number>,
      byStatus: {
        active: 0,
        inactive: 0,
        graduated: 0,
        transferred: 0,
      },
    };

    data.forEach((student) => {
      // Count by form level
      stats.byFormLevel[student.form_level] =
        (stats.byFormLevel[student.form_level] || 0) + 1;

      // Count by status
      if (student.status in stats.byStatus) {
        stats.byStatus[student.status as keyof typeof stats.byStatus]++;
      }
    });

    return stats;
  }

  /**
   * Log an audit event
   */
  async logAuditEvent(
    action: string,
    resource: string,
    category: string,
    severity: string = 'low',
    resourceId?: string,
    details?: any,
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id || null,
          action,
          resource,
          category,
          severity,
          resource_id: resourceId,
          details,
          success,
          error_message: errorMessage,
        });

      if (error) {
        console.error('Error logging audit event:', error);
      }
    } catch (error) {
      console.error('Error logging audit event:', error);
    }
  }

  /**
   * Get audit logs with filters
   */
  async getAuditLogs(filters: AuditLogFilters = {}, limit: number = 100): Promise<AuditLog[]> {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    // Apply filters
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters.severity && filters.severity !== 'all') {
      query = query.eq('severity', filters.severity);
    }

    if (filters.success !== undefined) {
      query = query.eq('success', filters.success);
    }

    if (filters.startDate) {
      query = query.gte('timestamp', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('timestamp', filters.endDate);
    }

    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters.search) {
      query = query.or(`action.ilike.%${filters.search}%,resource.ilike.%${filters.search}%,user_email.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Get audit log statistics
   */
  async getAuditLogStats() {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('category, severity, success, created_at');

    if (error) throw error;

    const stats = {
      total: data.length,
      byCategory: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      successCount: 0,
      failureCount: 0,
      criticalEvents: 0,
      recentActivity: [] as any[],
    };

    data.forEach((log) => {
      // Count by category
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;

      // Count by severity
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;

      // Count success/failure
      if (log.success) {
        stats.successCount++;
      } else {
        stats.failureCount++;
      }

      // Count critical events
      if (log.severity === 'critical') {
        stats.criticalEvents++;
      }
    });

    // Get recent activity (last 10 logs)
    stats.recentActivity = data.slice(0, 10);

    return stats;
  }

  /**
   * Get comprehensive system analytics
   */
  async getSystemAnalytics(): Promise<SystemAnalytics> {
    // Get all users
    const users = await this.getUsers();

    // Get all schools
    const schools = await this.getSchools();

    // Get all students
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('status, created_at');

    if (studentsError) throw studentsError;

    // Get audit logs for analytics
    const { data: auditLogs, error: auditError } = await supabase
      .from('audit_logs')
      .select('category, severity, created_at');

    if (auditError) throw auditError;

    // Calculate statistics
    const usersByRole: Record<string, number> = {};
    users.forEach(user => {
      usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
    });

    const schoolsByStatus: Record<string, number> = {};
    schools.forEach(school => {
      schoolsByStatus[school.status] = (schoolsByStatus[school.status] || 0) + 1;
    });

    const studentsByStatus: Record<string, number> = {};
    students.forEach(student => {
      studentsByStatus[student.status] = (studentsByStatus[student.status] || 0) + 1;
    });

    const auditLogsByCategory: Record<string, number> = {};
    const auditLogsBySeverity: Record<string, number> = {};
    auditLogs.forEach(log => {
      auditLogsByCategory[log.category] = (auditLogsByCategory[log.category] || 0) + 1;
      auditLogsBySeverity[log.severity] = (auditLogsBySeverity[log.severity] || 0) + 1;
    });

    // Calculate growth by month (last 12 months)
    const userGrowthByMonth = this.calculateGrowthByMonth(users.map(u => ({ created_at: u.created_at })));
    const schoolGrowthByMonth = this.calculateGrowthByMonth(schools.map(s => ({ created_at: s.created_at })));

    return {
      totalUsers: users.length,
      totalSchools: schools.length,
      totalStudents: students.length,
      totalMentors: usersByRole['mentor'] || 0,
      activeUsers: users.filter(u => u.status === 'active').length,
      usersByRole,
      schoolsByStatus,
      studentsByStatus,
      auditLogsByCategory,
      auditLogsBySeverity,
      userGrowthByMonth,
      schoolGrowthByMonth,
    };
  }

  /**
   * Helper function to calculate growth by month
   */
  private calculateGrowthByMonth(items: Array<{ created_at: string }>): Array<{ month: string; count: number }> {
    const monthCounts: Record<string, number> = {};
    const now = new Date();

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().substring(0, 7); // YYYY-MM
      monthCounts[monthKey] = 0;
    }

    // Count items by month
    items.forEach(item => {
      const monthKey = item.created_at.substring(0, 7);
      if (monthKey in monthCounts) {
        monthCounts[monthKey]++;
      }
    });

    // Convert to array format
    return Object.entries(monthCounts).map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      count,
    }));
  }

  /**
   * Helper function to calculate growth by day (last N days)
   */
  private calculateGrowthByDay(items: Array<{ created_at: string }>, days: number = 7): Array<{ date: string; count: number }> {
    const dayCounts: Record<string, number> = {};
    const now = new Date();

    // Initialize last N days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayKey = date.toISOString().substring(0, 10); // YYYY-MM-DD
      dayCounts[dayKey] = 0;
    }

    // Count items by day
    items.forEach(item => {
      const dayKey = item.created_at.substring(0, 10);
      if (dayKey in dayCounts) {
        dayCounts[dayKey]++;
      }
    });

    // Convert to array format
    return Object.entries(dayCounts).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count,
    }));
  }

  /**
   * Get comprehensive dashboard metrics for Admin Control Center
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch all required data in parallel
    const [users, schools, studentsData, auditLogsData] = await Promise.all([
      this.getUsers(),
      this.getSchools(),
      supabase.from('students').select('status, form_level, created_at'),
      supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(500),
    ]);

    const students = studentsData.data || [];
    const auditLogs = auditLogsData.data || [];

    // Calculate basic counts
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const totalSchools = schools.length;
    const pendingSchools = schools.filter(s => s.status === 'pending').length;
    const totalStudents = students.length;
    const activeStudents = students.filter((s: any) => s.status === 'active').length;
    const totalMentors = users.filter(u => u.role === 'mentor').length;
    const activeMentors = users.filter(u => u.role === 'mentor' && u.status === 'active').length;

    // Recent activity (last 24h)
    const newUsersToday = users.filter(u => new Date(u.created_at) > new Date(oneDayAgo)).length;
    const newSchoolsToday = schools.filter(s => new Date(s.created_at) > new Date(oneDayAgo)).length;
    const recentLogins = users.filter(u => u.last_sign_in_at && new Date(u.last_sign_in_at) > new Date(oneDayAgo)).length;

    // Engagement metrics
    const usersByRole: Record<string, number> = {};
    users.forEach(user => {
      usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
    });

    const schoolsByStatus: Record<string, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };
    schools.forEach(school => {
      schoolsByStatus[school.status] = (schoolsByStatus[school.status] || 0) + 1;
    });

    const schoolsByRegion: Record<string, number> = {};
    schools.forEach(school => {
      const region = school.region || 'Unknown';
      schoolsByRegion[region] = (schoolsByRegion[region] || 0) + 1;
    });

    const studentsByFormLevel: Record<number, number> = {};
    students.forEach((student: any) => {
      studentsByFormLevel[student.form_level] = (studentsByFormLevel[student.form_level] || 0) + 1;
    });

    // System health metrics
    const totalEvents = auditLogs.length;
    const successfulEvents = auditLogs.filter(log => log.success).length;
    const successRate = totalEvents > 0 ? (successfulEvents / totalEvents) * 100 : 100;
    const criticalErrors = auditLogs.filter(log => log.severity === 'critical' && !log.success).length;
    const avgResponseTime = 45 + Math.random() * 20; // Simulated for now (can be replaced with real metrics)

    // Recent activity timeline
    const recentActivity = auditLogs.slice(0, 10).map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      action: log.action,
      user: log.user_email || 'System',
      category: log.category,
      severity: log.severity,
    }));

    // Growth trends
    const userGrowthLast7Days = this.calculateGrowthByDay(
      users.filter(u => new Date(u.created_at) > new Date(sevenDaysAgo)),
      7
    );

    const schoolGrowthLast7Days = this.calculateGrowthByDay(
      schools.filter(s => new Date(s.created_at) > new Date(sevenDaysAgo)),
      7
    );

    // Activity by hour (last 24 hours)
    const activityByHour: Array<{ hour: number; count: number }> = [];
    for (let i = 0; i < 24; i++) {
      activityByHour.push({ hour: i, count: 0 });
    }

    auditLogs
      .filter(log => new Date(log.timestamp) > new Date(oneDayAgo))
      .forEach(log => {
        const hour = new Date(log.timestamp).getHours();
        activityByHour[hour].count++;
      });

    return {
      totalUsers,
      activeUsers,
      totalSchools,
      pendingSchools,
      totalStudents,
      activeStudents,
      totalMentors,
      activeMentors,
      newUsersToday,
      newSchoolsToday,
      recentLogins,
      usersByRole,
      schoolsByStatus,
      schoolsByRegion,
      studentsByFormLevel,
      systemHealth: {
        totalEvents,
        successRate: Math.round(successRate * 100) / 100,
        criticalErrors,
        avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      },
      recentActivity,
      userGrowthLast7Days,
      schoolGrowthLast7Days,
      activityByHour,
    };
  }
}

export const adminService = new AdminService();
