import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAnalysisId, getUserId, getQuestionnaireId, getLinkedinDataId } from "@/lib/app-store";
import { mockAnalysisReport, mockProfile, RANKS } from "@/lib/mock-data";
import ScoreGauge from "./ScoreGauge";
import SectionCard from "./SectionCard";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

interface AnalysisReportProps {
  onViewActions: () => void;
  readOnly?: boolean;
  analysisData?: any;
}

const SECTION_META: Record<string, { name: string; icon: string }> = {
  profile_photo: { name: "Foto de Perfil", icon: "📸" },
  banner: { name: "Banner/Capa", icon: "🎨" },
  headline: { name: "Headline", icon: "✍️" },
  about: { name: "Sobre/About", icon: "📝" },
  experiences: { name: "Experiência", icon: "💼" },
  education: { name: "Formação", icon: "🎓" },
  skills: { name: "Habilidades", icon: "⚡" },
  recommendations: { name: "Recomendações", icon: "💬" },
  featured: { name: "Em Destaque", icon: "⭐" },
  certifications: { name: "Certificações", icon: "📜" },
  awards: { name: "Prêmios", icon: "🏅" },
  publications: { name: "Publicações", icon: "📰" },
  volunteering: { name: "Voluntariado", icon: "🤝" },
  languages: { name: "Idiomas", icon: "🌍" },
  content_strategy: { name: "Estratégia de Conteúdo", icon: "📊" },
  positioning: { name: "Posicionamento", icon: "🎯" },
  linkedin_seo: { name: "LinkedIn SEO", icon: "🔍" },
};

function getRank(score: number) {
  return RANKS.find(r => score >= r.min && score <= r.max) || RANKS[0];
}

function getStatus(score: number): "Forte" | "Bom" | "Atenção" | "Crítico" {
  if (score >= 8) return "Forte";
  if (score >= 6) return "Bom";
  if (score >= 4) return "Atenção";
  return "Crítico";
}

export default function AnalysisReport({ onViewActions, readOnly, analysisData: externalData }: AnalysisReportProps) {
  const [loading, setLoading] = useState(!externalData);
  const [report, setReport] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [copying, setCopying] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (externalData) {
      processAnalysis(externalData);
      return;
    }

    const loadData = async () => {
      const analysisId = getAnalysisId();
      if (!analysisId) {
        // Fallback to mock data
        setReport(mockAnalysisReport);
        setProfile(mockProfile);
        setLoading(false);
        return;
      }

      try {
        const { data: analysis } = await supabase
          .from("analyses")
          .select("*")
          .eq("id", analysisId)
          .single();

        if (!analysis?.full_report_json) {
          setReport(mockAnalysisReport);
          setProfile(mockProfile);
          setLoading(false);
          return;
        }

        processAnalysis(analysis);
      } catch (err) {
        console.error("Error loading report:", err);
        setReport(mockAnalysisReport);
        setProfile(mockProfile);
        setLoading(false);
      }
    };
    loadData();
  }, [externalData]);

  const processAnalysis = async (analysis: any) => {
    const fullReport = analysis.full_report_json;
    const score = analysis.overall_score || fullReport.overall_score || 0;
    const rank = getRank(score);

    // Build section cards from AI response
    const sections = fullReport.sections || {};
    const sectionCards = Object.entries(sections).map(([key, data]: [string, any]) => {
      const meta = SECTION_META[key] || { name: key, icon: "📋" };
      const sectionScore = data.score || 0;
      const scoreNormalized = sectionScore > 10 ? Math.round(sectionScore / 10) : sectionScore;
      return {
        name: meta.name,
        icon: meta.icon,
        score: scoreNormalized,
        status: getStatus(scoreNormalized),
        aiSees: data.what_ai_sees || data.diagnosis || data.overall_narrative || "",
        working: data.strengths || [],
        needsChange: data.critical_gaps || [],
        immediateAction: data.immediate_action || "",
        strategy90days: data.strategic_action || data.benchmark || "",
        alternatives: data.alternatives?.map((a: any) => a.text) || undefined,
      };
    });

    // Build radar data
    const radarData = sectionCards.map(s => ({
      dimension: s.name.length > 12 ? s.name.substring(0, 10) + "." : s.name,
      score: s.score,
      fullMark: 10,
    }));

    // Category scores
    const categoryScores = {
      visual: Math.round((
        (sections.profile_photo?.score || 5) +
        (sections.banner?.score || 5)
      ) / 2),
      positioning: Math.round((
        (sections.headline?.score || 5) +
        (sections.about?.score || 5) +
        (sections.positioning?.score || 5)
      ) / 3),
      content: Math.round((
        (sections.content_strategy?.score || 5) +
        (sections.publications?.score || 5) +
        (sections.featured?.score || 5)
      ) / 3),
      network: Math.round((
        (sections.recommendations?.score || 5) +
        (sections.skills?.score || 5)
      ) / 2),
    };

    // Normalize scores > 10
    Object.keys(categoryScores).forEach(k => {
      const key = k as keyof typeof categoryScores;
      if (categoryScores[key] > 10) categoryScores[key] = Math.round(categoryScores[key] / 10);
    });

    // Build action plan
    const actionPlan = fullReport.action_plan || {};
    const phases = [
      { phase: 30, theme: actionPlan.phase_30_days?.theme || "Fundação", color: "destructive", actions: actionPlan.phase_30_days?.actions || [] },
      { phase: 60, theme: actionPlan.phase_60_days?.theme || "Construção", color: "warning", actions: actionPlan.phase_60_days?.actions || [] },
      { phase: 90, theme: actionPlan.phase_90_days?.theme || "Aceleração", color: "success", actions: actionPlan.phase_90_days?.actions || [] },
    ];

    const topPriorities = (actionPlan.top_5_priorities || []).map((p: any) => ({
      rank: p.rank,
      action: p.action,
      why: p.why,
      how: p.how,
      xp: p.xp_reward || 100,
    }));

    // Top voice potential
    const tvp = fullReport.top_voice_potential || {};

    // Load profile info
    let profileInfo = mockProfile;
    const questionnaireId = getQuestionnaireId();
    if (questionnaireId) {
      const { data: q } = await supabase
        .from("questionnaire_responses")
        .select("*")
        .eq("id", questionnaireId)
        .single();
      if (q) {
        profileInfo = {
          name: q.full_name || "",
          firstName: (q.full_name || "").split(" ")[0],
          role: q.role_title || "",
          company: q.current_company || "",
          segment: q.segment || "",
          linkedinUrl: q.linkedin_url || "",
          profilePicUrl: "",
          goal: q.main_goal || "",
          timeline: q.goal_timeline || "",
          yearsExperience: q.experience_years || 0,
        };
      }
    }

    // Try to get profile pic
    const linkedinDataId = getLinkedinDataId();
    if (linkedinDataId) {
      const { data: ld } = await supabase
        .from("linkedin_raw_data")
        .select("profile_pic_url")
        .eq("id", linkedinDataId)
        .single();
      if (ld?.profile_pic_url) profileInfo.profilePicUrl = ld.profile_pic_url;
    }

    const xpAwarded = fullReport.xp_awarded?.total || analysis.xp_awarded || 350;

    setReport({
      overallScore: score,
      categoryScores,
      sectionScores: sectionCards.map(s => ({ section: s.name, score: s.score, status: s.status })),
      radarData,
      executiveDiagnosis: fullReport.executive_diagnosis || "",
      pullQuote: fullReport.executive_diagnosis?.split(".").slice(0, 2).join(".") + "." || "",
      sections: sectionCards,
      topVoicePotential: {
        level: tvp.viability || "Médio",
        monthsToTopVoice: parseInt(tvp.realistic_timeline) || 8,
        accelerators: tvp.main_accelerators || [],
        blockers: tvp.main_blockers || [],
      },
      actionPlan: { phases, topPriorities },
      xpAwarded,
      rank: { icon: rank.icon, name: rank.name, range: `${rank.min}–${rank.max}` },
      badges: mockAnalysisReport.badges, // Keep badges from mock for now
    });
    setProfile(profileInfo);
    setLoading(false);
  };

  const handleShareReport = async () => {
    setCopying(true);
    try {
      const analysisId = getAnalysisId();
      if (!analysisId) throw new Error("Análise não encontrada");

      const { data: share, error } = await supabase
        .from("report_shares")
        .insert({ analysis_id: analysisId })
        .select("share_token")
        .single();

      if (error) throw error;

      const url = `${window.location.origin}/report/${share.share_token}`;
      await navigator.clipboard.writeText(url);
      alert("Link copiado! Válido por 30 dias.");
    } catch (err) {
      console.error("Share error:", err);
      alert("Erro ao gerar link de compartilhamento.");
    }
    setCopying(false);
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("report-content");
      if (!element) throw new Error("Report content not found");

      // Hide action buttons during export
      const noprint = document.querySelectorAll(".no-print");
      noprint.forEach(el => (el as HTMLElement).style.display = "none");

      await html2pdf(element, {
        margin: 0,
        filename: `topvoice-relatorio-${profile?.firstName || "report"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      });

      noprint.forEach(el => (el as HTMLElement).style.display = "");
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Erro ao exportar PDF.");
    }
    setExporting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  if (!report || !profile) return null;

  const scoreBadgeColor = (score: number) => {
    if (score >= 8) return "text-success";
    if (score >= 6) return "text-blue-400";
    if (score >= 4) return "text-gold-500";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-surface" id="report-content">
      {/* Dark header */}
      <div className="bg-navy-900 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full border-4 border-gold-500 bg-navy-800 flex items-center justify-center text-3xl shadow-gold overflow-hidden">
              {profile.profilePicUrl ? (
                <img src={profile.profilePicUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : profile.firstName[0]}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-platinum">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.role} na {profile.company}</p>
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">
                {profile.linkedinUrl}
              </a>
              <p className="text-sm text-gold-500 mt-1">🎯 {profile.goal} em {profile.timeline}</p>
            </div>
            <ScoreGauge score={report.overallScore} size={120} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(report.categoryScores).map(([key, val]: [string, any]) => (
              <div key={key} className="glass-card rounded-xl p-4 text-center">
                <div className={`text-2xl font-bold ${scoreBadgeColor(val)}`}>{val}/10</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                  {key === "visual" ? "Visual" : key === "positioning" ? "Posicionamento" : key === "content" ? "Conteúdo" : "Rede"}
                </div>
              </div>
            ))}
          </div>

          {!readOnly && (
            <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start no-print">
              <Button variant="outline" onClick={handleExportPDF} disabled={exporting}
                className="border-navy-700 text-platinum bg-transparent hover:bg-navy-800 rounded-pill">
                {exporting ? "Exportando..." : "📄 Exportar PDF"}
              </Button>
              <Button variant="outline" onClick={handleShareReport} disabled={copying}
                className="border-navy-700 text-platinum bg-transparent hover:bg-navy-800 rounded-pill">
                {copying ? "Copiando..." : "🔗 Compartilhar"}
              </Button>
              <Button onClick={onViewActions} className="gold-gradient text-navy-950 rounded-pill border-0 hover:shadow-gold">
                ✅ Ver Plano de Ação
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Rank banner */}
      <div className="max-w-5xl mx-auto px-4 -mt-4 relative z-10">
        <div className="glass-card-strong rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 bg-navy-900/90">
          <span className="text-5xl">{report.rank.icon}</span>
          <div className="flex-1 text-center md:text-left">
            <div className="text-lg font-bold text-gold-500">{report.rank.name}</div>
            <p className="text-sm text-muted-foreground">Score {report.rank.range}</p>
          </div>
          <div className="text-right">
            <div className="text-gold-500 font-bold">+{report.xpAwarded} XP</div>
            <p className="text-xs text-muted-foreground">ganhos nesta análise</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Executive Diagnosis */}
        <div className="bg-card rounded-2xl shadow-premium p-6 border border-border relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500" />
          <h2 className="text-xl font-bold text-card-foreground mb-4 pl-4">Diagnóstico Executivo</h2>
          <div className="pl-4 space-y-3 text-sm text-card-foreground/90 leading-relaxed">
            {report.executiveDiagnosis.split("\n\n").map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {report.pullQuote && (
            <div className="mt-4 ml-4 p-4 rounded-xl bg-gold-500/10 border-l-4 border-gold-500">
              <p className="text-sm font-semibold text-gold-500 italic">"{report.pullQuote}"</p>
            </div>
          )}
        </div>

        {/* Radar Chart */}
        <div className="bg-card rounded-2xl shadow-premium p-6 border border-border">
          <h2 className="text-xl font-bold text-card-foreground mb-6">Visão 360° do Seu Perfil</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={report.radarData}>
                <PolarGrid stroke="hsl(213 40% 22%)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: "hsl(215 16% 57%)" }} />
                <Radar name="Score" dataKey="score" stroke="hsl(37 91% 55%)" fill="hsl(37 91% 55%)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section Cards */}
        <div>
          <h2 className="text-xl font-bold text-card-foreground mb-6">Análise por Seção</h2>
          <div className="space-y-6">
            {report.sections.map((section: any) => (
              <SectionCard key={section.name} section={section} />
            ))}
          </div>
        </div>

        {/* Action Plan */}
        <div className="bg-card rounded-2xl shadow-premium p-6 border border-border">
          <h2 className="text-xl font-bold text-card-foreground mb-6">Plano de Ação</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {report.actionPlan.phases.map((phase: any) => (
              <div key={phase.phase} className={`rounded-xl border-2 p-5
                ${phase.color === "destructive" ? "border-destructive/30 bg-destructive/5" :
                  phase.color === "warning" ? "border-gold-500/30 bg-gold-500/5" :
                  "border-success/30 bg-success/5"}`}>
                <div className="text-sm font-bold mb-3">
                  {phase.color === "destructive" ? "🔴" : phase.color === "warning" ? "🟡" : "🟢"}{" "}
                  {phase.phase} dias — {phase.theme}
                </div>
                <ul className="space-y-2">
                  {phase.actions.map((a: string, i: number) => (
                    <li key={i} className="text-sm text-card-foreground flex items-start gap-2">
                      <span className="text-muted-foreground">☐</span>{a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-bold text-card-foreground mb-4">Top 5 Prioridades</h3>
          <div className="space-y-3">
            {report.actionPlan.topPriorities.map((p: any) => (
              <div key={p.rank} className="bg-navy-800/30 rounded-xl p-4 border border-border flex gap-4">
                <div className="text-3xl font-extrabold text-gold-500 w-10 shrink-0">{p.rank}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-card-foreground">{p.action}</h4>
                  <p className="text-sm text-muted-foreground mt-1"><strong>Por quê:</strong> {p.why}</p>
                  <p className="text-sm text-muted-foreground mt-1"><strong>Como:</strong> {p.how}</p>
                </div>
                <div className="text-gold-500 font-bold text-sm shrink-0">+{p.xp} XP</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Voice Potential */}
        <div className="bg-navy-900 rounded-2xl p-6 border border-navy-700">
          <h2 className="text-xl font-bold text-gold-500 mb-4">Seu Potencial Top Voice</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl font-extrabold text-gold-500">{report.topVoicePotential.level}</div>
            <p className="text-platinum">
              {report.topVoicePotential.monthsToTopVoice} meses até Top Voice com as mudanças recomendadas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-success/30 bg-success/5 p-4">
              <h4 className="text-sm font-bold text-success mb-2">🚀 Aceleradores</h4>
              <ul className="space-y-1">
                {report.topVoicePotential.accelerators.map((a: string, i: number) => (
                  <li key={i} className="text-sm text-platinum">✓ {a}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <h4 className="text-sm font-bold text-destructive mb-2">🚧 Bloqueadores</h4>
              <ul className="space-y-1">
                {report.topVoicePotential.blockers.map((b: string, i: number) => (
                  <li key={i} className="text-sm text-platinum">✗ {b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-card rounded-2xl shadow-premium p-6 border border-border">
          <h2 className="text-xl font-bold text-card-foreground mb-4">Conquistas</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {report.badges.map((b: any) => (
              <div key={b.name} className={`shrink-0 w-28 text-center p-4 rounded-xl border-2 transition-all
                ${b.earned
                  ? b.rarity === "legendary" ? "border-gold-500 shadow-gold bg-gold-500/5" :
                    b.rarity === "epic" ? "border-purple-500 bg-purple-500/5" :
                    b.rarity === "rare" ? "border-blue-400 bg-blue-400/5" :
                    "border-border bg-card"
                  : "border-border bg-muted/30 opacity-40 grayscale"}`}>
                <div className="text-3xl mb-2">{b.earned ? b.icon : "🔒"}</div>
                <div className="text-xs font-semibold text-card-foreground">{b.name}</div>
                <div className="text-[10px] text-muted-foreground mt-1">+{b.xp} XP</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
