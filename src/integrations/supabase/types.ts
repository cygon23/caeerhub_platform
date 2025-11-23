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
      ai_analysis_logs: {
        Row: {
          ai_response: string | null
          assessment_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          model_used: string | null
          processing_time: number | null
          prompt_used: string | null
          stage: string
          success: boolean | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          ai_response?: string | null
          assessment_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          model_used?: string | null
          processing_time?: number | null
          prompt_used?: string | null
          stage: string
          success?: boolean | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          ai_response?: string | null
          assessment_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          model_used?: string | null
          processing_time?: number | null
          prompt_used?: string | null
          stage?: string
          success?: boolean | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_analysis_logs_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "career_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analysis_logs_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "user_latest_assessment"
            referencedColumns: ["assessment_id"]
          },
        ]
      }
      assessment_progress: {
        Row: {
          assessment_type: string
          current_question: number | null
          expires_at: string | null
          id: string
          is_completed: boolean | null
          last_updated: string | null
          responses: Json | null
          started_at: string | null
          total_questions: number
          user_id: string
        }
        Insert: {
          assessment_type: string
          current_question?: number | null
          expires_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_updated?: string | null
          responses?: Json | null
          started_at?: string | null
          total_questions: number
          user_id: string
        }
        Update: {
          assessment_type?: string
          current_question?: number | null
          expires_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_updated?: string | null
          responses?: Json | null
          started_at?: string | null
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      billing_settings: {
        Row: {
          ai_credits_remaining: number | null
          ai_credits_used: number | null
          api_calls_this_month: number | null
          auto_renew: boolean | null
          billing_address: Json | null
          billing_email: string | null
          billing_name: string | null
          cancel_at_period_end: boolean | null
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string | null
          credits_monthly_allowance: number | null
          credits_rollover_enabled: boolean | null
          grace_period_ends_at: string | null
          id: string
          last_payment_amount: number | null
          last_payment_date: string | null
          last_payment_failure_date: string | null
          monthly_api_limit: number | null
          monthly_storage_limit_mb: number | null
          next_billing_date: string | null
          payment_failed_count: number | null
          payment_method: string | null
          plan_tier: string | null
          plan_type: string | null
          storage_used_mb: number | null
          stripe_customer_id: string | null
          stripe_payment_method_id: string | null
          stripe_subscription_id: string | null
          subscription_end: string | null
          subscription_start: string | null
          subscription_status: string | null
          trial_end: string | null
          trial_start: string | null
          trial_used: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_credits_remaining?: number | null
          ai_credits_used?: number | null
          api_calls_this_month?: number | null
          auto_renew?: boolean | null
          billing_address?: Json | null
          billing_email?: string | null
          billing_name?: string | null
          cancel_at_period_end?: boolean | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          credits_monthly_allowance?: number | null
          credits_rollover_enabled?: boolean | null
          grace_period_ends_at?: string | null
          id?: string
          last_payment_amount?: number | null
          last_payment_date?: string | null
          last_payment_failure_date?: string | null
          monthly_api_limit?: number | null
          monthly_storage_limit_mb?: number | null
          next_billing_date?: string | null
          payment_failed_count?: number | null
          payment_method?: string | null
          plan_tier?: string | null
          plan_type?: string | null
          storage_used_mb?: number | null
          stripe_customer_id?: string | null
          stripe_payment_method_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_start?: string | null
          subscription_status?: string | null
          trial_end?: string | null
          trial_start?: string | null
          trial_used?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_credits_remaining?: number | null
          ai_credits_used?: number | null
          api_calls_this_month?: number | null
          auto_renew?: boolean | null
          billing_address?: Json | null
          billing_email?: string | null
          billing_name?: string | null
          cancel_at_period_end?: boolean | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          credits_monthly_allowance?: number | null
          credits_rollover_enabled?: boolean | null
          grace_period_ends_at?: string | null
          id?: string
          last_payment_amount?: number | null
          last_payment_date?: string | null
          last_payment_failure_date?: string | null
          monthly_api_limit?: number | null
          monthly_storage_limit_mb?: number | null
          next_billing_date?: string | null
          payment_failed_count?: number | null
          payment_method?: string | null
          plan_tier?: string | null
          plan_type?: string | null
          storage_used_mb?: number | null
          stripe_customer_id?: string | null
          stripe_payment_method_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_start?: string | null
          subscription_status?: string | null
          trial_end?: string | null
          trial_start?: string | null
          trial_used?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      career_assessments: {
        Row: {
          ai_analysis: string | null
          assessment_type: string
          completed_at: string | null
          confidence_score: number | null
          created_at: string | null
          id: string
          processing_time: number | null
          questions: Json
          responses: Json
          results: Json | null
          score: number | null
          status: string | null
          updated_at: string | null
          user_id: string
          version: number
        }
        Insert: {
          ai_analysis?: string | null
          assessment_type: string
          completed_at?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          processing_time?: number | null
          questions: Json
          responses: Json
          results?: Json | null
          score?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          version?: number
        }
        Update: {
          ai_analysis?: string | null
          assessment_type?: string
          completed_at?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          processing_time?: number | null
          questions?: Json
          responses?: Json
          results?: Json | null
          score?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      career_skills: {
        Row: {
          career_title: string
          created_at: string | null
          id: string
          skills: Json
          updated_at: string | null
        }
        Insert: {
          career_title: string
          created_at?: string | null
          id?: string
          skills: Json
          updated_at?: string | null
        }
        Update: {
          career_title?: string
          created_at?: string | null
          id?: string
          skills?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string | null
          created_by: string | null
          description: string | null
          expires_at: string | null
          feature_key: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          reference_table: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          feature_key?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_table?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          feature_key?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_table?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      cv_analysis: {
        Row: {
          ai_model_used: string | null
          ats_compatibility: Json | null
          ats_score: number | null
          content_quality: number | null
          created_at: string | null
          cv_id: string | null
          experience_analysis: Json | null
          id: string
          improvements: Json | null
          keyword_optimization: number | null
          keyword_suggestions: Json | null
          overall_score: number | null
          processing_time: number | null
          skills_analysis: Json | null
          strengths: Json | null
          structure_score: number | null
          summary: string | null
          target_industry: string | null
          target_role: string | null
          tokens_used: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_model_used?: string | null
          ats_compatibility?: Json | null
          ats_score?: number | null
          content_quality?: number | null
          created_at?: string | null
          cv_id?: string | null
          experience_analysis?: Json | null
          id?: string
          improvements?: Json | null
          keyword_optimization?: number | null
          keyword_suggestions?: Json | null
          overall_score?: number | null
          processing_time?: number | null
          skills_analysis?: Json | null
          strengths?: Json | null
          structure_score?: number | null
          summary?: string | null
          target_industry?: string | null
          target_role?: string | null
          tokens_used?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_model_used?: string | null
          ats_compatibility?: Json | null
          ats_score?: number | null
          content_quality?: number | null
          created_at?: string | null
          cv_id?: string | null
          experience_analysis?: Json | null
          id?: string
          improvements?: Json | null
          keyword_optimization?: number | null
          keyword_suggestions?: Json | null
          overall_score?: number | null
          processing_time?: number | null
          skills_analysis?: Json | null
          strengths?: Json | null
          structure_score?: number | null
          summary?: string | null
          target_industry?: string | null
          target_role?: string | null
          tokens_used?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cv_analysis_cv_id_fkey"
            columns: ["cv_id"]
            isOneToOne: false
            referencedRelation: "user_cvs"
            referencedColumns: ["id"]
          },
        ]
      }
      cv_improvements_applied: {
        Row: {
          analysis_id: string
          applied_at: string | null
          applied_content: string | null
          created_at: string | null
          cv_id: string
          id: string
          improvement_category: string | null
          improvement_type: string
          original_content: string | null
          suggested_content: string | null
          user_id: string
        }
        Insert: {
          analysis_id: string
          applied_at?: string | null
          applied_content?: string | null
          created_at?: string | null
          cv_id: string
          id?: string
          improvement_category?: string | null
          improvement_type: string
          original_content?: string | null
          suggested_content?: string | null
          user_id: string
        }
        Update: {
          analysis_id?: string
          applied_at?: string | null
          applied_content?: string | null
          created_at?: string | null
          cv_id?: string
          id?: string
          improvement_category?: string | null
          improvement_type?: string
          original_content?: string | null
          suggested_content?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cv_improvements_applied_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "cv_analysis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cv_improvements_applied_cv_id_fkey"
            columns: ["cv_id"]
            isOneToOne: false
            referencedRelation: "user_cvs"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_restrictions: {
        Row: {
          base_cost: number | null
          cost_per_token: number | null
          created_at: string | null
          credit_cost: number
          daily_rate_limit: number | null
          description: string | null
          enabled: boolean | null
          feature_category: string | null
          feature_key: string
          feature_name: string
          free_tier_limit: number | null
          hourly_rate_limit: number | null
          icon_name: string | null
          id: string
          professional_tier_limit: number | null
          requires_subscription: boolean | null
          student_tier_limit: number | null
          updated_at: string | null
        }
        Insert: {
          base_cost?: number | null
          cost_per_token?: number | null
          created_at?: string | null
          credit_cost?: number
          daily_rate_limit?: number | null
          description?: string | null
          enabled?: boolean | null
          feature_category?: string | null
          feature_key: string
          feature_name: string
          free_tier_limit?: number | null
          hourly_rate_limit?: number | null
          icon_name?: string | null
          id?: string
          professional_tier_limit?: number | null
          requires_subscription?: boolean | null
          student_tier_limit?: number | null
          updated_at?: string | null
        }
        Update: {
          base_cost?: number | null
          cost_per_token?: number | null
          created_at?: string | null
          credit_cost?: number
          daily_rate_limit?: number | null
          description?: string | null
          enabled?: boolean | null
          feature_category?: string | null
          feature_key?: string
          feature_name?: string
          free_tier_limit?: number | null
          hourly_rate_limit?: number | null
          icon_name?: string | null
          id?: string
          professional_tier_limit?: number | null
          requires_subscription?: boolean | null
          student_tier_limit?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      interview_feedback: {
        Row: {
          areas_for_improvement: Json | null
          communication_avg: number | null
          content_avg: number | null
          created_at: string | null
          id: string
          improvement_plan: Json | null
          next_steps: Json | null
          overall_impression: string | null
          practice_questions: Json | null
          readiness_level: string | null
          recommended_resources: Json | null
          session_id: string
          structure_avg: number | null
          top_strengths: Json | null
          user_id: string
        }
        Insert: {
          areas_for_improvement?: Json | null
          communication_avg?: number | null
          content_avg?: number | null
          created_at?: string | null
          id?: string
          improvement_plan?: Json | null
          next_steps?: Json | null
          overall_impression?: string | null
          practice_questions?: Json | null
          readiness_level?: string | null
          recommended_resources?: Json | null
          session_id: string
          structure_avg?: number | null
          top_strengths?: Json | null
          user_id: string
        }
        Update: {
          areas_for_improvement?: Json | null
          communication_avg?: number | null
          content_avg?: number | null
          created_at?: string | null
          id?: string
          improvement_plan?: Json | null
          next_steps?: Json | null
          overall_impression?: string | null
          practice_questions?: Json | null
          readiness_level?: string | null
          recommended_resources?: Json | null
          session_id?: string
          structure_avg?: number | null
          top_strengths?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interview_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_responses: {
        Row: {
          ai_model_used: string | null
          communication_score: number | null
          content_score: number | null
          created_at: string | null
          id: string
          improvements: Json | null
          key_points_covered: Json | null
          key_points_missed: Json | null
          processing_time: number | null
          question_number: number
          question_text: string
          question_tips: Json | null
          question_type: string
          response_text: string
          response_time: number | null
          score: number | null
          session_id: string
          strengths: Json | null
          structure_score: number | null
          suggested_answer: string | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          ai_model_used?: string | null
          communication_score?: number | null
          content_score?: number | null
          created_at?: string | null
          id?: string
          improvements?: Json | null
          key_points_covered?: Json | null
          key_points_missed?: Json | null
          processing_time?: number | null
          question_number: number
          question_text: string
          question_tips?: Json | null
          question_type: string
          response_text: string
          response_time?: number | null
          score?: number | null
          session_id: string
          strengths?: Json | null
          structure_score?: number | null
          suggested_answer?: string | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          ai_model_used?: string | null
          communication_score?: number | null
          content_score?: number | null
          created_at?: string | null
          id?: string
          improvements?: Json | null
          key_points_covered?: Json | null
          key_points_missed?: Json | null
          processing_time?: number | null
          question_number?: number
          question_text?: string
          question_tips?: Json | null
          question_type?: string
          response_text?: string
          response_time?: number | null
          score?: number | null
          session_id?: string
          strengths?: Json | null
          structure_score?: number | null
          suggested_answer?: string | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interview_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_sessions: {
        Row: {
          completed_at: string | null
          completion_time: number | null
          created_at: string | null
          current_question: number | null
          difficulty: string
          id: string
          industry: string
          overall_score: number | null
          position: string
          started_at: string | null
          status: string | null
          total_questions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_time?: number | null
          created_at?: string | null
          current_question?: number | null
          difficulty: string
          id?: string
          industry: string
          overall_score?: number | null
          position: string
          started_at?: string | null
          status?: string | null
          total_questions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completion_time?: number | null
          created_at?: string | null
          current_question?: number | null
          difficulty?: string
          id?: string
          industry?: string
          overall_score?: number | null
          position?: string
          started_at?: string | null
          status?: string | null
          total_questions?: number | null
          updated_at?: string | null
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
      notification_settings: {
        Row: {
          created_at: string | null
          digest_day: number | null
          digest_frequency: string | null
          digest_time: string | null
          email_application_updates: boolean | null
          email_job_recommendations: boolean | null
          email_marketing: boolean | null
          email_mentor_messages: boolean | null
          email_platform_updates: boolean | null
          email_skill_reminders: boolean | null
          email_weekly_digest: boolean | null
          id: string
          inapp_job_matches: boolean | null
          inapp_mentor_suggestions: boolean | null
          inapp_profile_views: boolean | null
          push_achievements: boolean | null
          push_messages: boolean | null
          push_new_jobs: boolean | null
          push_reminders: boolean | null
          sms_application_updates: boolean | null
          sms_interview_reminders: boolean | null
          sms_urgent_alerts: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          digest_day?: number | null
          digest_frequency?: string | null
          digest_time?: string | null
          email_application_updates?: boolean | null
          email_job_recommendations?: boolean | null
          email_marketing?: boolean | null
          email_mentor_messages?: boolean | null
          email_platform_updates?: boolean | null
          email_skill_reminders?: boolean | null
          email_weekly_digest?: boolean | null
          id?: string
          inapp_job_matches?: boolean | null
          inapp_mentor_suggestions?: boolean | null
          inapp_profile_views?: boolean | null
          push_achievements?: boolean | null
          push_messages?: boolean | null
          push_new_jobs?: boolean | null
          push_reminders?: boolean | null
          sms_application_updates?: boolean | null
          sms_interview_reminders?: boolean | null
          sms_urgent_alerts?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          digest_day?: number | null
          digest_frequency?: string | null
          digest_time?: string | null
          email_application_updates?: boolean | null
          email_job_recommendations?: boolean | null
          email_marketing?: boolean | null
          email_mentor_messages?: boolean | null
          email_platform_updates?: boolean | null
          email_skill_reminders?: boolean | null
          email_weekly_digest?: boolean | null
          id?: string
          inapp_job_matches?: boolean | null
          inapp_mentor_suggestions?: boolean | null
          inapp_profile_views?: boolean | null
          push_achievements?: boolean | null
          push_messages?: boolean | null
          push_new_jobs?: boolean | null
          push_reminders?: boolean | null
          sms_application_updates?: boolean | null
          sms_interview_reminders?: boolean | null
          sms_urgent_alerts?: boolean | null
          updated_at?: string | null
          user_id?: string
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
          ai_challenges: string[] | null
          ai_generation_status: string | null
          ai_learning_style: string | null
          ai_personality_summary: string | null
          ai_recommended_path: string | null
          ai_roadmap: string | null
          ai_roadmap_json: Json | null
          ai_strengths: string[] | null
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
          ai_challenges?: string[] | null
          ai_generation_status?: string | null
          ai_learning_style?: string | null
          ai_personality_summary?: string | null
          ai_recommended_path?: string | null
          ai_roadmap?: string | null
          ai_roadmap_json?: Json | null
          ai_strengths?: string[] | null
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
          ai_challenges?: string[] | null
          ai_generation_status?: string | null
          ai_learning_style?: string | null
          ai_personality_summary?: string | null
          ai_recommended_path?: string | null
          ai_roadmap?: string | null
          ai_roadmap_json?: Json | null
          ai_strengths?: string[] | null
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
      personality_profiles: {
        Row: {
          assessment_id: string
          category_scores: Json
          confidence_score: number | null
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          key_characteristics: Json | null
          personality_type: string
          team_dynamics: Json | null
          traits: Json
          updated_at: string | null
          user_id: string
          work_style_preferences: Json | null
        }
        Insert: {
          assessment_id: string
          category_scores: Json
          confidence_score?: number | null
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          key_characteristics?: Json | null
          personality_type: string
          team_dynamics?: Json | null
          traits: Json
          updated_at?: string | null
          user_id: string
          work_style_preferences?: Json | null
        }
        Update: {
          assessment_id?: string
          category_scores?: Json
          confidence_score?: number | null
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          key_characteristics?: Json | null
          personality_type?: string
          team_dynamics?: Json | null
          traits?: Json
          updated_at?: string | null
          user_id?: string
          work_style_preferences?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "personality_profiles_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "career_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personality_profiles_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "user_latest_assessment"
            referencedColumns: ["assessment_id"]
          },
        ]
      }
      practice_questions: {
        Row: {
          ai_generated: boolean | null
          correct_answer: string
          created_at: string | null
          difficulty_level: string
          explanation: string | null
          id: string
          material_id: string | null
          options: Json | null
          question_text: string
          question_type: string
          source_reference: string | null
          subject: string
          times_attempted: number | null
          times_correct: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_generated?: boolean | null
          correct_answer: string
          created_at?: string | null
          difficulty_level: string
          explanation?: string | null
          id?: string
          material_id?: string | null
          options?: Json | null
          question_text: string
          question_type: string
          source_reference?: string | null
          subject: string
          times_attempted?: number | null
          times_correct?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_generated?: boolean | null
          correct_answer?: string
          created_at?: string | null
          difficulty_level?: string
          explanation?: string | null
          id?: string
          material_id?: string | null
          options?: Json | null
          question_text?: string
          question_type?: string
          source_reference?: string | null
          subject?: string
          times_attempted?: number | null
          times_correct?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_questions_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "study_materials"
            referencedColumns: ["id"]
          },
        ]
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
          school_id: string | null
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
          school_id?: string | null
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
          school_id?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_registrations"
            referencedColumns: ["registration_number"]
          },
        ]
      }
      promo_code_usage: {
        Row: {
          applied_at: string | null
          credits_awarded: number | null
          discount_amount: number | null
          id: string
          promo_code_id: string
          stripe_invoice_id: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          credits_awarded?: number | null
          discount_amount?: number | null
          id?: string
          promo_code_id: string
          stripe_invoice_id?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string | null
          credits_awarded?: number | null
          discount_amount?: number | null
          id?: string
          promo_code_id?: string
          stripe_invoice_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_usage_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          applies_to: string | null
          code: string
          created_at: string | null
          created_by: string | null
          description: string | null
          discount_type: string | null
          discount_value: number
          id: string
          is_active: boolean | null
          max_uses: number | null
          max_uses_per_user: number | null
          stripe_coupon_id: string | null
          times_used: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          applies_to?: string | null
          code: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          max_uses_per_user?: number | null
          stripe_coupon_id?: string | null
          times_used?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          applies_to?: string | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          max_uses_per_user?: number | null
          stripe_coupon_id?: string | null
          times_used?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      question_attempts: {
        Row: {
          attempted_at: string | null
          id: string
          is_correct: boolean
          question_id: string
          student_answer: string
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          attempted_at?: string | null
          id?: string
          is_correct: boolean
          question_id: string
          student_answer: string
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          attempted_at?: string | null
          id?: string
          is_correct?: boolean
          question_id?: string
          student_answer?: string
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "practice_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      school_registrations: {
        Row: {
          admin_notes: string | null
          contact_email: string
          contact_phone: string
          created_at: string | null
          id: string
          registration_number: string
          reviewed_at: string | null
          reviewed_by: string | null
          school_name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          contact_email: string
          contact_phone: string
          created_at?: string | null
          id?: string
          registration_number: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          school_name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          contact_email?: string
          contact_phone?: string
          created_at?: string | null
          id?: string
          registration_number?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          school_name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          account_locked_until: string | null
          api_created_at: string | null
          api_enabled: boolean | null
          api_key_hash: string | null
          api_last_used: string | null
          api_rate_limit: number | null
          backup_codes_generated: boolean | null
          created_at: string | null
          failed_login_attempts: number | null
          id: string
          last_failed_login: string | null
          last_password_change: string | null
          login_notification_email: boolean | null
          max_active_sessions: number | null
          password_expires_at: string | null
          require_password_change: boolean | null
          session_timeout_minutes: number | null
          two_factor_enabled: boolean | null
          two_factor_method: string | null
          two_factor_phone: string | null
          two_factor_verified: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_locked_until?: string | null
          api_created_at?: string | null
          api_enabled?: boolean | null
          api_key_hash?: string | null
          api_last_used?: string | null
          api_rate_limit?: number | null
          backup_codes_generated?: boolean | null
          created_at?: string | null
          failed_login_attempts?: number | null
          id?: string
          last_failed_login?: string | null
          last_password_change?: string | null
          login_notification_email?: boolean | null
          max_active_sessions?: number | null
          password_expires_at?: string | null
          require_password_change?: boolean | null
          session_timeout_minutes?: number | null
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          two_factor_phone?: string | null
          two_factor_verified?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_locked_until?: string | null
          api_created_at?: string | null
          api_enabled?: boolean | null
          api_key_hash?: string | null
          api_last_used?: string | null
          api_rate_limit?: number | null
          backup_codes_generated?: boolean | null
          created_at?: string | null
          failed_login_attempts?: number | null
          id?: string
          last_failed_login?: string | null
          last_password_change?: string | null
          login_notification_email?: boolean | null
          max_active_sessions?: number | null
          password_expires_at?: string | null
          require_password_change?: boolean | null
          session_timeout_minutes?: number | null
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          two_factor_phone?: string | null
          two_factor_verified?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stripe_payments: {
        Row: {
          amount: number
          created_at: string | null
          credits_purchased: number | null
          currency: string | null
          failure_code: string | null
          failure_message: string | null
          id: string
          invoice_url: string | null
          metadata: Json | null
          payment_method: string | null
          payment_method_details: Json | null
          payment_type: string | null
          receipt_url: string | null
          refund_reason: string | null
          refunded_amount: number | null
          refunded_at: string | null
          retry_count: number | null
          status: string
          stripe_charge_id: string | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          subscription_period_end: string | null
          subscription_period_start: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          credits_purchased?: number | null
          currency?: string | null
          failure_code?: string | null
          failure_message?: string | null
          id?: string
          invoice_url?: string | null
          metadata?: Json | null
          payment_method?: string | null
          payment_method_details?: Json | null
          payment_type?: string | null
          receipt_url?: string | null
          refund_reason?: string | null
          refunded_amount?: number | null
          refunded_at?: string | null
          retry_count?: number | null
          status: string
          stripe_charge_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_period_end?: string | null
          subscription_period_start?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          credits_purchased?: number | null
          currency?: string | null
          failure_code?: string | null
          failure_message?: string | null
          id?: string
          invoice_url?: string | null
          metadata?: Json | null
          payment_method?: string | null
          payment_method_details?: Json | null
          payment_type?: string | null
          receipt_url?: string | null
          refund_reason?: string | null
          refunded_amount?: number | null
          refunded_at?: string | null
          retry_count?: number | null
          status?: string
          stripe_charge_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_period_end?: string | null
          subscription_period_start?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      student_academic_levels: {
        Row: {
          created_at: string | null
          education_level: string
          exam_type: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          education_level: string
          exam_type: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          education_level?: string
          exam_type?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      student_performance: {
        Row: {
          accuracy_percentage: number | null
          average_time_per_question: number | null
          correct_answers: number | null
          created_at: string | null
          exam_readiness_percentage: number | null
          id: string
          last_practice_date: string | null
          study_time_minutes: number | null
          subject: string
          topics_mastered: Json | null
          topics_needs_improvement: Json | null
          total_questions_attempted: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accuracy_percentage?: number | null
          average_time_per_question?: number | null
          correct_answers?: number | null
          created_at?: string | null
          exam_readiness_percentage?: number | null
          id?: string
          last_practice_date?: string | null
          study_time_minutes?: number | null
          subject: string
          topics_mastered?: Json | null
          topics_needs_improvement?: Json | null
          total_questions_attempted?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accuracy_percentage?: number | null
          average_time_per_question?: number | null
          correct_answers?: number | null
          created_at?: string | null
          exam_readiness_percentage?: number | null
          id?: string
          last_practice_date?: string | null
          study_time_minutes?: number | null
          subject?: string
          topics_mastered?: Json | null
          topics_needs_improvement?: Json | null
          total_questions_attempted?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          created_at: string
          created_by: string
          date_of_birth: string | null
          email: string | null
          form_level: number
          gender: string | null
          guardian_email: string | null
          guardian_name: string | null
          guardian_phone: string | null
          id: string
          phone: string | null
          registration_number: string
          school_id: string
          status: string
          student_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          date_of_birth?: string | null
          email?: string | null
          form_level: number
          gender?: string | null
          guardian_email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          phone?: string | null
          registration_number: string
          school_id: string
          status?: string
          student_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          date_of_birth?: string | null
          email?: string | null
          form_level?: number
          gender?: string | null
          guardian_email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          phone?: string | null
          registration_number?: string
          school_id?: string
          status?: string
          student_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_registrations"
            referencedColumns: ["registration_number"]
          },
        ]
      }
      study_guides: {
        Row: {
          ai_generated: boolean | null
          content: Json
          created_at: string | null
          id: string
          is_customized: boolean | null
          material_id: string | null
          subject: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_generated?: boolean | null
          content: Json
          created_at?: string | null
          id?: string
          is_customized?: boolean | null
          material_id?: string | null
          subject: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_generated?: boolean | null
          content?: Json
          created_at?: string | null
          id?: string
          is_customized?: boolean | null
          material_id?: string | null
          subject?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_guides_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "study_materials"
            referencedColumns: ["id"]
          },
        ]
      }
      study_materials: {
        Row: {
          ai_processed: boolean | null
          ai_summary: string | null
          category: string
          created_at: string | null
          description: string | null
          extracted_text: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          key_concepts: Json | null
          subject: string
          topics: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_processed?: boolean | null
          ai_summary?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          extracted_text?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          key_concepts?: Json | null
          subject: string
          topics?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_processed?: boolean | null
          ai_summary?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          extracted_text?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          key_concepts?: Json | null
          subject?: string
          topics?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          created_at: string | null
          duration_minutes: number
          ended_at: string
          id: string
          questions_attempted: number | null
          session_type: string
          started_at: string
          subject: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration_minutes: number
          ended_at: string
          id?: string
          questions_attempted?: number | null
          session_type: string
          started_at: string
          subject: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number
          ended_at?: string
          id?: string
          questions_attempted?: number | null
          session_type?: string
          started_at?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          credits_bonus_signup: number | null
          credits_monthly: number
          credits_rollover_allowed: boolean | null
          currency: string | null
          description: string | null
          display_order: number | null
          features_included: Json | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          max_ai_roadmaps_monthly: number | null
          max_api_calls_monthly: number | null
          max_cv_generations_monthly: number | null
          max_interview_sessions_monthly: number | null
          max_learning_modules_access: number | null
          max_mentor_sessions_monthly: number | null
          max_storage_mb: number | null
          plan_key: string
          plan_name: string
          price_monthly: number
          price_yearly: number | null
          stripe_price_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credits_bonus_signup?: number | null
          credits_monthly?: number
          credits_rollover_allowed?: boolean | null
          currency?: string | null
          description?: string | null
          display_order?: number | null
          features_included?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          max_ai_roadmaps_monthly?: number | null
          max_api_calls_monthly?: number | null
          max_cv_generations_monthly?: number | null
          max_interview_sessions_monthly?: number | null
          max_learning_modules_access?: number | null
          max_mentor_sessions_monthly?: number | null
          max_storage_mb?: number | null
          plan_key: string
          plan_name: string
          price_monthly?: number
          price_yearly?: number | null
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credits_bonus_signup?: number | null
          credits_monthly?: number
          credits_rollover_allowed?: boolean | null
          currency?: string | null
          description?: string | null
          display_order?: number | null
          features_included?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          max_ai_roadmaps_monthly?: number | null
          max_api_calls_monthly?: number | null
          max_cv_generations_monthly?: number | null
          max_interview_sessions_monthly?: number | null
          max_learning_modules_access?: number | null
          max_mentor_sessions_monthly?: number | null
          max_storage_mb?: number | null
          plan_key?: string
          plan_name?: string
          price_monthly?: number
          price_yearly?: number | null
          stripe_price_id?: string | null
          updated_at?: string | null
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
      ubong_insights: {
        Row: {
          ai_model: string | null
          emerging_opportunities: Json
          expires_at: string | null
          generated_at: string | null
          id: string
          location: string
          market_overview: Json
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          ai_model?: string | null
          emerging_opportunities: Json
          expires_at?: string | null
          generated_at?: string | null
          id?: string
          location: string
          market_overview: Json
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          ai_model?: string | null
          emerging_opportunities?: Json
          expires_at?: string | null
          generated_at?: string | null
          id?: string
          location?: string
          market_overview?: Json
          tokens_used?: number | null
          user_id?: string
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
      user_feature_usage: {
        Row: {
          created_at: string | null
          feature_key: string
          id: string
          last_used_at: string | null
          period_end: string | null
          period_start: string | null
          updated_at: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feature_key: string
          id?: string
          last_used_at?: string | null
          period_end?: string | null
          period_start?: string | null
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          feature_key?: string
          id?: string
          last_used_at?: string | null
          period_end?: string | null
          period_start?: string | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_feature_usage_feature_key_fkey"
            columns: ["feature_key"]
            isOneToOne: false
            referencedRelation: "feature_restrictions"
            referencedColumns: ["feature_key"]
          },
        ]
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
      user_preferences: {
        Row: {
          accent_color: string | null
          allow_messages_from: string | null
          api_access_enabled: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          id: string
          language: string | null
          profile_discoverable: boolean | null
          push_notifications: boolean | null
          show_email: boolean | null
          show_online_status: boolean | null
          show_phone: boolean | null
          sms_notifications: boolean | null
          theme: string | null
          timezone: string | null
          two_factor_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accent_color?: string | null
          allow_messages_from?: string | null
          api_access_enabled?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          profile_discoverable?: boolean | null
          push_notifications?: boolean | null
          show_email?: boolean | null
          show_online_status?: boolean | null
          show_phone?: boolean | null
          sms_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accent_color?: string | null
          allow_messages_from?: string | null
          api_access_enabled?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          profile_discoverable?: boolean | null
          push_notifications?: boolean | null
          show_email?: boolean | null
          show_online_status?: boolean | null
          show_phone?: boolean | null
          sms_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      user_strengths_weaknesses: {
        Row: {
          assessment_id: string
          career_recommendations: Json | null
          created_at: string | null
          development_goals: Json | null
          id: string
          is_active: boolean | null
          strengths: Json
          updated_at: string | null
          user_id: string
          version: number
          weaknesses: Json
        }
        Insert: {
          assessment_id: string
          career_recommendations?: Json | null
          created_at?: string | null
          development_goals?: Json | null
          id?: string
          is_active?: boolean | null
          strengths: Json
          updated_at?: string | null
          user_id: string
          version?: number
          weaknesses: Json
        }
        Update: {
          assessment_id?: string
          career_recommendations?: Json | null
          created_at?: string | null
          development_goals?: Json | null
          id?: string
          is_active?: boolean | null
          strengths?: Json
          updated_at?: string | null
          user_id?: string
          version?: number
          weaknesses?: Json
        }
        Relationships: [
          {
            foreignKeyName: "user_strengths_weaknesses_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "career_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_strengths_weaknesses_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "user_latest_assessment"
            referencedColumns: ["assessment_id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
          received_at: string | null
          retry_count: number | null
          status: string | null
          stripe_event_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          payload: Json
          processed_at?: string | null
          received_at?: string | null
          retry_count?: number | null
          status?: string | null
          stripe_event_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          received_at?: string | null
          retry_count?: number | null
          status?: string | null
          stripe_event_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_users_view: {
        Row: {
          avatar_url: string | null
          bio: string | null
          confirmed_at: string | null
          display_name: string | null
          email: string | null
          last_sign_in_at: string | null
          location: string | null
          phone: string | null
          profile_created_at: string | null
          profile_id: string | null
          profile_updated_at: string | null
          role: string | null
          school_id: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          user_created_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_registrations"
            referencedColumns: ["registration_number"]
          },
        ]
      }
      user_latest_assessment: {
        Row: {
          assessment_id: string | null
          assessment_type: string | null
          career_recommendations: Json | null
          category_scores: Json | null
          completed_at: string | null
          confidence_score: number | null
          development_goals: Json | null
          personality_description: string | null
          personality_type: string | null
          score: number | null
          strengths: Json | null
          traits: Json | null
          user_id: string | null
          weaknesses: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_credits: {
        Args: {
          p_amount: number
          p_description?: string
          p_expires_at?: string
          p_metadata?: Json
          p_transaction_type: string
          p_user_id: string
        }
        Returns: {
          new_balance: number
          success: boolean
          transaction_id: string
        }[]
      }
      can_use_feature: {
        Args: { p_feature_key: string; p_user_id: string }
        Returns: {
          can_use: boolean
          credits_available: number
          credits_required: number
          reason: string
          usage_count: number
          usage_limit: number
        }[]
      }
      cleanup_expired_insights: { Args: never; Returns: undefined }
      create_test_user: {
        Args: {
          user_email: string
          user_full_name: string
          user_password: string
        }
        Returns: string
      }
      deduct_credits: {
        Args: {
          p_feature_key: string
          p_metadata?: Json
          p_reference_id?: string
          p_reference_table?: string
          p_user_id: string
        }
        Returns: {
          new_balance: number
          success: boolean
          transaction_id: string
        }[]
      }
      get_admin_users: {
        Args: never
        Returns: {
          avatar_url: string
          bio: string
          confirmed_at: string
          display_name: string
          email: string
          last_sign_in_at: string
          location: string
          phone: string
          profile_created_at: string
          profile_id: string
          profile_updated_at: string
          role: string
          school_id: string
          status: Database["public"]["Enums"]["user_status"]
          user_created_at: string
          user_id: string
        }[]
      }
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      is_admin: { Args: never; Returns: boolean }
      is_mentor: { Args: never; Returns: boolean }
      reset_monthly_credits: { Args: never; Returns: undefined }
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
