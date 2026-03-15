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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      access_tokens: {
        Row: {
          activated_at: string | null
          analyses_limit: number | null
          analyses_used: number | null
          bonus_analyses_remaining: number | null
          code: string
          created_at: string | null
          created_by: string | null
          id: string
          last_analysis_at: string | null
          linkedin_url_locked: string | null
          mentee_email: string | null
          mentee_name: string | null
          notes: string | null
          status: string | null
        }
        Insert: {
          activated_at?: string | null
          analyses_limit?: number | null
          analyses_used?: number | null
          bonus_analyses_remaining?: number | null
          code: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_analysis_at?: string | null
          linkedin_url_locked?: string | null
          mentee_email?: string | null
          mentee_name?: string | null
          notes?: string | null
          status?: string | null
        }
        Update: {
          activated_at?: string | null
          analyses_limit?: number | null
          analyses_used?: number | null
          bonus_analyses_remaining?: number | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_analysis_at?: string | null
          linkedin_url_locked?: string | null
          mentee_email?: string | null
          mentee_name?: string | null
          notes?: string | null
          status?: string | null
        }
        Relationships: []
      }
      admin_notes: {
        Row: {
          created_at: string | null
          id: string
          note_text: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          note_text?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          note_text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      analyses: {
        Row: {
          action_plan_json: Json | null
          ai_recommended_frequency: number | null
          confirmed_frequency_per_week: number | null
          created_at: string | null
          editorial_calendar_json: Json | null
          full_report_json: Json | null
          id: string
          linkedin_data_id: string | null
          overall_score: number | null
          questionnaire_id: string | null
          section_scores_json: Json | null
          top_voice_potential: string | null
          user_accepted_recommendation: boolean | null
          user_id: string | null
          xp_awarded: number | null
        }
        Insert: {
          action_plan_json?: Json | null
          ai_recommended_frequency?: number | null
          confirmed_frequency_per_week?: number | null
          created_at?: string | null
          editorial_calendar_json?: Json | null
          full_report_json?: Json | null
          id?: string
          linkedin_data_id?: string | null
          overall_score?: number | null
          questionnaire_id?: string | null
          section_scores_json?: Json | null
          top_voice_potential?: string | null
          user_accepted_recommendation?: boolean | null
          user_id?: string | null
          xp_awarded?: number | null
        }
        Update: {
          action_plan_json?: Json | null
          ai_recommended_frequency?: number | null
          confirmed_frequency_per_week?: number | null
          created_at?: string | null
          editorial_calendar_json?: Json | null
          full_report_json?: Json | null
          id?: string
          linkedin_data_id?: string | null
          overall_score?: number | null
          questionnaire_id?: string | null
          section_scores_json?: Json | null
          top_voice_potential?: string | null
          user_accepted_recommendation?: boolean | null
          user_id?: string | null
          xp_awarded?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analyses_linkedin_data_id_fkey"
            columns: ["linkedin_data_id"]
            isOneToOne: false
            referencedRelation: "linkedin_raw_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analyses_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "questionnaire_responses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      completed_actions: {
        Row: {
          action_key: string | null
          action_title: string | null
          analysis_id: string | null
          completed_at: string | null
          id: string
          phase: string | null
          priority: number | null
          user_id: string | null
          xp_awarded: number | null
        }
        Insert: {
          action_key?: string | null
          action_title?: string | null
          analysis_id?: string | null
          completed_at?: string | null
          id?: string
          phase?: string | null
          priority?: number | null
          user_id?: string | null
          xp_awarded?: number | null
        }
        Update: {
          action_key?: string | null
          action_title?: string | null
          analysis_id?: string | null
          completed_at?: string | null
          id?: string
          phase?: string | null
          priority?: number | null
          user_id?: string | null
          xp_awarded?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "completed_actions_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completed_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      linkedin_raw_data: {
        Row: {
          banner_url: string | null
          fetched_at: string | null
          id: string
          profile_pic_url: string | null
          proxycurl_response_json: Json | null
          user_id: string | null
          verification_code: string | null
          verified: boolean | null
          verified_at: string | null
        }
        Insert: {
          banner_url?: string | null
          fetched_at?: string | null
          id?: string
          profile_pic_url?: string | null
          proxycurl_response_json?: Json | null
          user_id?: string | null
          verification_code?: string | null
          verified?: boolean | null
          verified_at?: string | null
        }
        Update: {
          banner_url?: string | null
          fetched_at?: string | null
          id?: string
          profile_pic_url?: string | null
          proxycurl_response_json?: Json | null
          user_id?: string | null
          verification_code?: string | null
          verified?: boolean | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "linkedin_raw_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mentee_gamification: {
        Row: {
          badges_earned_json: Json | null
          current_rank: string | null
          current_streak_weeks: number | null
          current_xp: number | null
          id: string
          last_activity_at: string | null
          longest_streak_weeks: number | null
          rank_up_history_json: Json | null
          user_id: string | null
        }
        Insert: {
          badges_earned_json?: Json | null
          current_rank?: string | null
          current_streak_weeks?: number | null
          current_xp?: number | null
          id?: string
          last_activity_at?: string | null
          longest_streak_weeks?: number | null
          rank_up_history_json?: Json | null
          user_id?: string | null
        }
        Update: {
          badges_earned_json?: Json | null
          current_rank?: string | null
          current_streak_weeks?: number | null
          current_xp?: number | null
          id?: string
          last_activity_at?: string | null
          longest_streak_weeks?: number | null
          rank_up_history_json?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentee_gamification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_responses: {
        Row: {
          achievements_text: string | null
          all_answers_json: Json | null
          challenges: string[] | null
          completed_at: string | null
          content_types: string[] | null
          creator_mode: string | null
          current_company: string | null
          digital_insecurity: string | null
          experience_years: number | null
          full_name: string | null
          goal_categories: string[] | null
          goal_meaning: string | null
          goal_timeline: string | null
          has_newsletter: string | null
          id: string
          linkedin_self_assessment: string | null
          linkedin_url: string | null
          main_goal: string | null
          posting_frequency: string | null
          professional_description: string | null
          profile_language: string | null
          reference_voices: string[] | null
          role_title: string | null
          segment: string | null
          user_id: string | null
        }
        Insert: {
          achievements_text?: string | null
          all_answers_json?: Json | null
          challenges?: string[] | null
          completed_at?: string | null
          content_types?: string[] | null
          creator_mode?: string | null
          current_company?: string | null
          digital_insecurity?: string | null
          experience_years?: number | null
          full_name?: string | null
          goal_categories?: string[] | null
          goal_meaning?: string | null
          goal_timeline?: string | null
          has_newsletter?: string | null
          id?: string
          linkedin_self_assessment?: string | null
          linkedin_url?: string | null
          main_goal?: string | null
          posting_frequency?: string | null
          professional_description?: string | null
          profile_language?: string | null
          reference_voices?: string[] | null
          role_title?: string | null
          segment?: string | null
          user_id?: string | null
        }
        Update: {
          achievements_text?: string | null
          all_answers_json?: Json | null
          challenges?: string[] | null
          completed_at?: string | null
          content_types?: string[] | null
          creator_mode?: string | null
          current_company?: string | null
          digital_insecurity?: string | null
          experience_years?: number | null
          full_name?: string | null
          goal_categories?: string[] | null
          goal_meaning?: string | null
          goal_timeline?: string | null
          has_newsletter?: string | null
          id?: string
          linkedin_self_assessment?: string | null
          linkedin_url?: string | null
          main_goal?: string | null
          posting_frequency?: string | null
          professional_description?: string | null
          profile_language?: string | null
          reference_voices?: string[] | null
          role_title?: string | null
          segment?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      report_shares: {
        Row: {
          analysis_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          share_token: string | null
        }
        Insert: {
          analysis_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          share_token?: string | null
        }
        Update: {
          analysis_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          share_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_shares_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          name: string
          segment: string | null
          token_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          name: string
          segment?: string | null
          token_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          name?: string
          segment?: string | null
          token_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "access_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
