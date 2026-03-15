
CREATE TABLE public.access_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  mentee_name TEXT,
  mentee_email TEXT,
  status TEXT DEFAULT 'created' CHECK (status IN ('created','activated','analysis_used','expired','bonus_granted')),
  analyses_limit INTEGER DEFAULT 1,
  analyses_used INTEGER DEFAULT 0,
  bonus_analyses_remaining INTEGER DEFAULT 0,
  linkedin_url_locked TEXT,
  notes TEXT,
  created_by TEXT DEFAULT 'admin',
  activated_at TIMESTAMPTZ,
  last_analysis_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  first_name TEXT,
  segment TEXT,
  token_id UUID REFERENCES public.access_tokens(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.questionnaire_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  full_name TEXT,
  role_title TEXT,
  current_company TEXT,
  segment TEXT,
  experience_years INTEGER,
  professional_description TEXT,
  main_goal TEXT,
  goal_timeline TEXT,
  goal_meaning TEXT,
  goal_categories TEXT[],
  reference_voices TEXT[],
  linkedin_self_assessment TEXT,
  posting_frequency TEXT,
  content_types TEXT[],
  challenges TEXT[],
  achievements_text TEXT,
  digital_insecurity TEXT,
  linkedin_url TEXT,
  profile_language TEXT,
  creator_mode TEXT,
  has_newsletter TEXT,
  all_answers_json JSONB,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.linkedin_raw_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  proxycurl_response_json JSONB,
  profile_pic_url TEXT,
  banner_url TEXT,
  verification_code TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  questionnaire_id UUID REFERENCES public.questionnaire_responses(id),
  linkedin_data_id UUID REFERENCES public.linkedin_raw_data(id),
  overall_score INTEGER,
  section_scores_json JSONB,
  full_report_json JSONB,
  action_plan_json JSONB,
  editorial_calendar_json JSONB,
  confirmed_frequency_per_week INTEGER,
  ai_recommended_frequency INTEGER,
  user_accepted_recommendation BOOLEAN,
  top_voice_potential TEXT,
  xp_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.mentee_gamification (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) UNIQUE,
  current_xp INTEGER DEFAULT 0,
  current_rank TEXT DEFAULT 'INVISÍVEL',
  badges_earned_json JSONB DEFAULT '[]',
  current_streak_weeks INTEGER DEFAULT 0,
  longest_streak_weeks INTEGER DEFAULT 0,
  rank_up_history_json JSONB DEFAULT '[]',
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.completed_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  analysis_id UUID REFERENCES public.analyses(id),
  action_key TEXT,
  action_title TEXT,
  phase TEXT CHECK (phase IN ('immediate','30','60','90')),
  priority INTEGER,
  xp_awarded INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.report_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID REFERENCES public.analyses(id),
  share_token TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.admin_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  note_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_raw_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentee_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_tokens" ON public.access_tokens FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_tokens" ON public.access_tokens FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_insert_tokens" ON public.access_tokens FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_insert_users" ON public.users FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_users" ON public.users FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_questionnaire" ON public.questionnaire_responses FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_questionnaire" ON public.questionnaire_responses FOR SELECT TO anon USING (true);
CREATE POLICY "anon_select_linkedin" ON public.linkedin_raw_data FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_linkedin" ON public.linkedin_raw_data FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_linkedin" ON public.linkedin_raw_data FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_select_analyses" ON public.analyses FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_analyses" ON public.analyses FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_analyses" ON public.analyses FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_select_gamification" ON public.mentee_gamification FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_gamification" ON public.mentee_gamification FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_gamification" ON public.mentee_gamification FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_select_actions" ON public.completed_actions FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_actions" ON public.completed_actions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_actions" ON public.completed_actions FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_select_shares" ON public.report_shares FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_shares" ON public.report_shares FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_notes" ON public.admin_notes FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_notes" ON public.admin_notes FOR INSERT TO anon WITH CHECK (true);
