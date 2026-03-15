import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getUserId, getAnalysisId } from "@/lib/app-store";
import { mockAnalysisReport, RANKS } from "@/lib/mock-data";
import ScoreGauge from "@/components/report/ScoreGauge";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function MenteeDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const userId = getUserId();
      const analysisId = getAnalysisId();

      if (!userId || !analysisId) {
        setData({
          score: mockAnalysisReport.overallScore,
          rank: mockAnalysisReport.rank,
          xp: 350,
          actionsCompleted: 0,
          totalActions: 15,
          streak: 0,
          firstName: "Usuário",
          badges: mockAnalysisReport.badges,
        });
        setLoading(false);
        return;
      }

      const [{ data: analysis }, { data: gamification }, { data: user }, { data: completedActions }] = await Promise.all([
        supabase.from("analyses").select("overall_score, xp_awarded, full_report_json, action_plan_json").eq("id", analysisId).single(),
        supabase.from("mentee_gamification").select("*").eq("user_id", userId).single(),
        supabase.from("users").select("first_name").eq("id", userId).single(),
        supabase.from("completed_actions").select("id").eq("user_id", userId),
      ]);

      const score = analysis?.overall_score || 0;
      const rank = RANKS.find(r => score >= r.min && score <= r.max) || RANKS[0];
      const plan = (analysis?.action_plan_json || (analysis?.full_report_json as any)?.action_plan) as any;
      const totalActions = (plan?.phase_30_days?.actions?.length || 0) + (plan?.phase_60_days?.actions?.length || 0) + (plan?.phase_90_days?.actions?.length || 0);

      setData({
        score,
        rank: { icon: rank.icon, name: rank.name, range: `${rank.min}–${rank.max}` },
        xp: gamification?.current_xp || analysis?.xp_awarded || 0,
        actionsCompleted: completedActions?.length || 0,
        totalActions: totalActions || 15,
        streak: gamification?.current_streak_weeks || 0,
        firstName: user?.first_name || "Usuário",
        badges: mockAnalysisReport.badges,
      });
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="text-center py-20"><div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" /></div>;
  if (!data) return null;

  const stats = [
    { label: "Score Atual", value: String(data.score), icon: "📊", trend: data.score > 50 ? `+${data.score - 50}` : undefined },
    { label: "XP Total", value: String(data.xp), icon: "⚡" },
    { label: "Ações Concluídas", value: `${data.actionsCompleted}/${data.totalActions}`, icon: "✅" },
    { label: "Streak", value: `${data.streak} semanas`, icon: "🔥" },
  ];

  const nextRank = RANKS.find(r => r.min > data.score);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Bem-vindo de volta, {data.firstName}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-2xl p-5 border border-border shadow-premium">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{s.icon}</span>
              {s.trend && <span className="text-xs text-success font-bold">↑ {s.trend}</span>}
            </div>
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-navy-900 rounded-2xl p-6 border border-navy-700 flex flex-col md:flex-row items-center gap-4">
        <span className="text-5xl">{data.rank.icon}</span>
        <div className="flex-1 text-center md:text-left">
          <div className="text-lg font-bold text-gold-500">{data.rank.name}</div>
          <p className="text-sm text-muted-foreground">Score {data.rank.range}</p>
          <div className="w-full max-w-xs bg-navy-800 rounded-full h-2 mt-2">
            <div className="h-full gold-gradient rounded-full" style={{ width: `${data.score}%` }} />
          </div>
          {nextRank && <p className="text-xs text-muted-foreground mt-1">Faltam {nextRank.min - data.score} pontos para {nextRank.name} {nextRank.icon}</p>}
        </div>
        <ScoreGauge score={data.score} size={90} />
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border shadow-premium">
        <h2 className="text-lg font-bold text-foreground mb-4">Conquistas</h2>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
          {data.badges.map((b: any) => (
            <div key={b.name} className={`text-center p-3 rounded-xl border-2 transition-all
              ${b.earned ? "border-gold-500/30 bg-gold-500/5" : "border-border bg-muted/20 opacity-40 grayscale"}`}>
              <div className="text-2xl mb-1">{b.earned ? b.icon : "🔒"}</div>
              <div className="text-[10px] font-semibold text-foreground truncate">{b.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
