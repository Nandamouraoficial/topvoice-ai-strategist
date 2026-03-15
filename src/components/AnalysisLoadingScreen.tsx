import { useState, useEffect } from "react";
import { LOADING_MESSAGES } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import { getUserId, getQuestionnaireId, getLinkedinDataId, getTokenData, setAnalysisId } from "@/lib/app-store";

interface AnalysisLoadingScreenProps {
  onComplete: () => void;
}

export default function AnalysisLoadingScreen({ onComplete }: AnalysisLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analysisStarted, setAnalysisStarted] = useState(false);

  // Rotate loading messages
  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Animate progress bar (but cap at 90% until analysis completes)
  useEffect(() => {
    const duration = 60000; // 60 seconds for 90%
    const interval = 100;
    const step = 90 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) { clearInterval(timer); return 90; }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Run real analysis
  useEffect(() => {
    if (analysisStarted) return;
    setAnalysisStarted(true);

    const runAnalysis = async () => {
      try {
        const userId = getUserId();
        const questionnaireId = getQuestionnaireId();
        const linkedinDataId = getLinkedinDataId();
        const tokenData = getTokenData();

        if (!userId || !questionnaireId) {
          throw new Error("Dados de sessão não encontrados");
        }

        // Fetch questionnaire
        const { data: questionnaire, error: qErr } = await supabase
          .from("questionnaire_responses")
          .select("*")
          .eq("id", questionnaireId)
          .single();
        if (qErr) throw qErr;

        // Fetch LinkedIn data
        let linkedinData = null;
        let profilePicUrl = null;
        let bannerUrl = null;
        if (linkedinDataId) {
          const { data: ld } = await supabase
            .from("linkedin_raw_data")
            .select("*")
            .eq("id", linkedinDataId)
            .single();
          if (ld) {
            linkedinData = ld.proxycurl_response_json;
            profilePicUrl = ld.profile_pic_url;
            bannerUrl = ld.banner_url;
          }
        }

        // Call AI analysis edge function
        const { data: aiResult, error: aiError } = await supabase.functions.invoke("analyze-profile", {
          body: {
            questionnaire: {
              full_name: questionnaire.full_name,
              role: questionnaire.role_title,
              company: questionnaire.current_company,
              segment: questionnaire.segment,
              experience_years: questionnaire.experience_years,
              professional_description: questionnaire.professional_description,
              main_goal: questionnaire.main_goal,
              goal_timeline: questionnaire.goal_timeline,
              goal_meaning: questionnaire.goal_meaning,
              goal_categories: questionnaire.goal_categories,
              reference_voices: questionnaire.reference_voices,
              linkedin_self_assessment: questionnaire.linkedin_self_assessment,
              posting_frequency: questionnaire.posting_frequency,
              content_types: questionnaire.content_types,
              challenges: questionnaire.challenges,
              achievements: questionnaire.achievements_text,
              digital_insecurity: questionnaire.digital_insecurity,
              linkedin_url: questionnaire.linkedin_url,
              profile_language: questionnaire.profile_language,
              creator_mode: questionnaire.creator_mode,
              has_newsletter: questionnaire.has_newsletter,
            },
            linkedin_data: linkedinData,
            profile_pic_url: profilePicUrl,
            banner_url: bannerUrl,
          },
        });

        if (aiError) throw aiError;
        if (aiResult.error) throw new Error(aiResult.error);

        // Determine rank
        const score = aiResult.overall_score || 0;
        let rank = "INVISÍVEL";
        if (score >= 100) rank = "ÍCONE";
        else if (score >= 90) rank = "TOP VOICE";
        else if (score >= 80) rank = "REFERÊNCIA";
        else if (score >= 65) rank = "AUTORIDADE";
        else if (score >= 50) rank = "RELEVANTE";
        else if (score >= 35) rank = "EMERGENTE";
        else if (score >= 20) rank = "INICIANTE";

        const xpTotal = aiResult.xp_awarded?.total || 350;

        // Save analysis to Supabase
        const { data: analysis, error: analysisError } = await supabase
          .from("analyses")
          .insert({
            user_id: userId,
            questionnaire_id: questionnaireId,
            linkedin_data_id: linkedinDataId,
            overall_score: score,
            section_scores_json: aiResult.sections,
            full_report_json: aiResult,
            action_plan_json: aiResult.action_plan,
            editorial_calendar_json: aiResult.editorial_calendar_brief,
            ai_recommended_frequency: aiResult.editorial_calendar_brief?.recommended_frequency_per_week || 3,
            top_voice_potential: JSON.stringify(aiResult.top_voice_potential),
            xp_awarded: xpTotal,
          })
          .select("id")
          .single();

        if (analysisError) throw analysisError;

        setAnalysisId(analysis.id);

        // Create gamification record
        await supabase.from("mentee_gamification").insert({
          user_id: userId,
          current_xp: xpTotal,
          current_rank: rank,
          badges_earned_json: [],
        });

        // Update access token
        if (tokenData?.id) {
          await supabase
            .from("access_tokens")
            .update({
              status: "analysis_used",
              analyses_used: 1,
              last_analysis_at: new Date().toISOString(),
            })
            .eq("id", tokenData.id);
        }

        // Complete the progress bar and finish
        setProgress(100);
        setTimeout(onComplete, 800);
      } catch (err: any) {
        console.error("Analysis error:", err);
        setError(err.message || "Erro ao realizar análise. Tente novamente.");
      }
    };

    runAnalysis();
  }, [analysisStarted, onComplete]);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center relative overflow-hidden">
      <div className="floating-orb w-80 h-80 bg-gold-500 top-[10%] right-[10%]" />
      <div className="floating-orb w-64 h-64 bg-blue-500 bottom-[20%] left-[15%]" />

      <div className="text-center relative z-10 max-w-md mx-4">
        <div className="mb-8 inline-flex items-center gap-2 animate-pulse-slow">
          <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center text-xl font-bold text-navy-950">TV</div>
        </div>

        <div className="relative w-36 h-36 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(213 40% 22%)" strokeWidth="6" />
            <circle cx="60" cy="60" r="54" fill="none" stroke="url(#goldGradient)" strokeWidth="6"
              strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
              className="transition-all duration-100 ease-linear" />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(37 91% 55%)" />
                <stop offset="100%" stopColor="hsl(37 88% 63%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-extrabold text-gold-500">{Math.round(progress)}%</span>
          </div>
        </div>

        {error ? (
          <div className="animate-fade-in">
            <p className="text-destructive text-base mb-4">{error}</p>
            <button onClick={() => { setError(null); setAnalysisStarted(false); setProgress(0); }}
              className="px-6 py-3 rounded-pill gold-gradient text-navy-950 font-semibold">
              Tentar Novamente
            </button>
          </div>
        ) : (
          <>
            <p className="text-platinum text-base mb-4 h-6 animate-fade-in" key={messageIndex}>
              {LOADING_MESSAGES[messageIndex]}
            </p>
            <p className="text-muted-foreground text-sm">⏱ ~60 segundos</p>
          </>
        )}
      </div>
    </div>
  );
}
