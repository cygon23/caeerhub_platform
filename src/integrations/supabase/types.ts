export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      career_assessments: {
        Row: {
          ai_analysis: string | null
          assessment_type: string
          completed_at: string | null
          created_at: string | null
          id: string
          questions: Json
          responses: Json
          results: Json | null
          score: number | null
          user_id: string
        }
        Insert: {
          ai_analysis?: string | null
          assessment_type: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          questions: Json
          responses: Json
          results?: Json | null
          score?: number | null
          user_id: string
        }
        Update: {
          ai_analysis?: string | null
          assessment_type?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          questions?: Json
          responses?: Json
          results?: Json | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      interview_sessions: {
        Row: {
          created_at: string
          difficulty: string
          id: string
          industry: string
          overall_score: number | null
          position: string
          questions: Json
          responses: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          difficulty: string
          id?: string
          industry: string
          overall_score?: number | null
          position: string
          questions: Json
          responses?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          difficulty?: string
          id?: string
          industry?: string
          overall_score?: number | null
          position?: string
          questions?: Json
          responses?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_opportunities: {
        Row: {
          application_url: string | null
          company: string
          created_at: string | null
          description: string | null
          employment_type: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          location: string | null
          posted_by: string | null
          requirements: string[] | null
          salary_range: string | null
          skills_required: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_url?: string | null
          company: string
          created_at?: string | null
          description?: string | null
          employment_type?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          posted_by?: string | null
          requirements?: string[] | null
          salary_range?: string | null
          skills_required?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_url?: string | null
          company?: string
          created_at?: string | null
          description?: string | null
          employment_type?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          posted_by?: string | null
          requirements?: string[] | null
          salary_range?: string | null
          skills_required?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      learning_modules: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: number | null
          estimated_duration: number | null
          id: string
          is_published: boolean | null
          prerequisites: string[] | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_duration?: number | null
          id?: string
          is_published?: boolean | null
          prerequisites?: string[] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_duration?: number | null
          id?: string
          is_published?: boolean | null
          prerequisites?: string[] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mentorship_sessions: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          id: string
          mentee_feedback: string | null
          mentor_feedback: string | null
          mentorship_id: string
          notes: string | null
          rating: number | null
          scheduled_at: string
          session_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          mentee_feedback?: string | null
          mentor_feedback?: string | null
          mentorship_id: string
          notes?: string | null
          rating?: number | null
          scheduled_at: string
          session_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          mentee_feedback?: string | null
          mentor_feedback?: string | null
          mentorship_id?: string
          notes?: string | null
          rating?: number | null
          scheduled_at?: string
          session_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_sessions_mentorship_id_fkey"
            columns: ["mentorship_id"]
            isOneToOne: false
            referencedRelation: "mentorships"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorships: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          mentee_id: string
          mentor_id: string
          notes: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          mentee_id: string
          mentor_id: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          mentee_id?: string
          mentor_id?: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      onboarding_responses: {
        Row: {
          ai_personality_summary: string | null
          ai_roadmap: string | null
          completed_at: string | null
          created_at: string | null
          dream_career: string | null
          education_level: string | null
          habits: Json | null
          id: string
          interests: string[] | null
          preferred_path: string | null
          reminder_frequency: string | null
          strongest_subjects: string[] | null
          support_preferences: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_personality_summary?: string | null
          ai_roadmap?: string | null
          completed_at?: string | null
          created_at?: string | null
          dream_career?: string | null
          education_level?: string | null
          habits?: Json | null
          id?: string
          interests?: string[] | null
          preferred_path?: string | null
          reminder_frequency?: string | null
          strongest_subjects?: string[] | null
          support_preferences?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_personality_summary?: string | null
          ai_roadmap?: string | null
          completed_at?: string | null
          created_at?: string | null
          dream_career?: string | null
          education_level?: string | null
          habits?: Json | null
          id?: string
          interests?: string[] | null
          preferred_path?: string | null
          reminder_frequency?: string | null
          strongest_subjects?: string[] | null
          support_preferences?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          added_by: string | null
          contact_email: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          partnership_type: string[] | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          added_by?: string | null
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          partnership_type?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          added_by?: string | null
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          partnership_type?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          location: string | null
          phone: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_cvs: {
        Row: {
          achievements: Json | null
          ai_feedback: string | null
          ai_score: number | null
          created_at: string | null
          education: Json | null
          experience: Json | null
          id: string
          is_primary: boolean | null
          personal_info: Json | null
          skills: Json | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievements?: Json | null
          ai_feedback?: string | null
          ai_score?: number | null
          created_at?: string | null
          education?: Json | null
          experience?: Json | null
          id?: string
          is_primary?: boolean | null
          personal_info?: Json | null
          skills?: Json | null
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievements?: Json | null
          ai_feedback?: string | null
          ai_score?: number | null
          created_at?: string | null
          education?: Json | null
          experience?: Json | null
          id?: string
          is_primary?: boolean | null
          personal_info?: Json | null
          skills?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_module_progress: {
        Row: {
          completed_at: string | null
          id: string
          last_accessed: string | null
          module_id: string
          progress_percentage: number | null
          started_at: string | null
          status: string | null
          time_spent: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          last_accessed?: string | null
          module_id: string
          progress_percentage?: number | null
          started_at?: string | null
          status?: string | null
          time_spent?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          last_accessed?: string | null
          module_id?: string
          progress_percentage?: number | null
          started_at?: string | null
          status?: string | null
          time_spent?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_module_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_test_user: {
        Args: {
          user_email: string
          user_full_name: string
          user_password: string
        }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_mentor: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "youth" | "mentor" | "admin"
      user_status: "active" | "inactive" | "pending" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["youth", "mentor", "admin"],
      user_status: ["active", "inactive", "pending", "suspended"],
    },
  },
} as const
