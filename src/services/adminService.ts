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
}

export const adminService = new AdminService();
