import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getUserId, getAnalysisId } from "@/lib/app-store";

const allPhases = [
  { key: "30", label: "30 dias" },
  { key: "60", label: "60 dias" },
  { key: "90", label: "90 dias" },
];

type Filter = "all" | "30" | "60" | "90";

interface ActionItem {
  id: string;
  text: string;
  phase: number;
  priority: "Crítico" | "Alto" | "Médio";
  xp: number;
  completed: boolean;
}

import { useState as useStateHook, useEffect } from "react";
import { mockAnalysisReport } from "@/lib/mock-data";

export default function ActionItems() {
  const [filter, setFilter] = useState<Filter>("all");
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const analysisId = getAnalysisId();

      if (analysisId) {
        const { data: analysis } = await supabase.from("analyses").select("action_plan_json, full_report_json").eq("id", analysisId).single();
        if (analysis?.action_plan_json || analysis?.full_report_json?.action_plan) {
          const plan = analysis.action_plan_json || analysis.full_report_json.action_plan;
          const items: ActionItem[] = [];
          const phases = [
            { data: plan.phase_30_days, phase: 30 },
            { data: plan.phase_60_days, phase: 60 },
            { data: plan.phase_90_days, phase: 90 },
          ];
          phases.forEach(({ data: phaseData, phase }) => {
            (phaseData?.actions || []).forEach((action: string, i: number) => {
              items.push({
                id: `${phase}-${i}`,
                text: action,
                phase,
                priority: i < 2 ? "Crítico" : i < 4 ? "Alto" : "Médio",
                xp: [150, 200, 100, 100, 50][i] || 75,
                completed: false,
              });
            });
          });

          // Check completed actions
          const userId = getUserId();
          if (userId) {
            const { data: completed } = await supabase.from("completed_actions").select("action_key").eq("user_id", userId);
            if (completed) {
              const completedKeys = new Set(completed.map(c => c.action_key));
              items.forEach(item => { if (completedKeys.has(item.id)) item.completed = true; });
            }
          }

          setActions(items);
          setLoading(false);
          return;
        }
      }

      // Fallback to mock
      const items = mockAnalysisReport.actionPlan.phases.flatMap(phase =>
        phase.actions.map((action, i) => ({
          id: `${phase.phase}-${i}`,
          text: action,
          phase: phase.phase,
          priority: (i < 2 ? "Crítico" : i < 4 ? "Alto" : "Médio") as "Crítico" | "Alto" | "Médio",
          xp: [150, 200, 100, 100, 50][i] || 75,
          completed: false,
        }))
      );
      setActions(items);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = actions.filter(a => filter === "all" || a.phase === Number(filter));
  const completed = actions.filter(a => a.completed).length;
  const totalXp = actions.filter(a => a.completed).reduce((sum, a) => sum + a.xp, 0);

  const toggleAction = async (id: string) => {
    const action = actions.find(a => a.id === id);
    if (!action) return;

    const newCompleted = !action.completed;
    setActions(prev => prev.map(a => a.id === id ? { ...a, completed: newCompleted } : a));

    const userId = getUserId();
    const analysisId = getAnalysisId();
    if (userId && analysisId) {
      if (newCompleted) {
        await supabase.from("completed_actions").insert({
          user_id: userId,
          analysis_id: analysisId,
          action_key: id,
          action_title: action.text,
          phase: action.phase <= 30 ? "30" : action.phase <= 60 ? "60" : "90",
          priority: action.priority === "Crítico" ? 1 : action.priority === "Alto" ? 2 : 3,
          xp_awarded: action.xp,
        });
        // Update XP
        await supabase.from("mentee_gamification").update({
          current_xp: totalXp + action.xp,
          last_activity_at: new Date().toISOString(),
        }).eq("user_id", userId);
      } else {
        await supabase.from("completed_actions").delete().eq("action_key", id).eq("user_id", userId);
      }
    }
  };

  const priorityColor = {
    Crítico: "bg-destructive/20 text-destructive",
    Alto: "bg-gold-500/20 text-gold-500",
    Médio: "bg-blue-500/20 text-blue-400",
  };

  if (loading) return <div className="text-center py-20"><div className="w-6 h-6 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Plano de Ação</h1>
          <p className="text-muted-foreground text-sm">{completed} de {actions.length} ações concluídas — {totalXp} XP conquistados</p>
        </div>
        <div className="w-16 h-16 relative">
          <svg viewBox="0 0 60 60" className="-rotate-90">
            <circle cx="30" cy="30" r="25" fill="none" stroke="hsl(213 40% 22%)" strokeWidth="5" />
            <circle cx="30" cy="30" r="25" fill="none" stroke="hsl(37 91% 55%)" strokeWidth="5"
              strokeLinecap="round" strokeDasharray={2 * Math.PI * 25}
              strokeDashoffset={2 * Math.PI * 25 * (1 - (actions.length ? completed / actions.length : 0))} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gold-500">
            {actions.length ? Math.round((completed / actions.length) * 100) : 0}%
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {([{ label: "Tudo", value: "all" as Filter }, { label: "30 dias", value: "30" as Filter }, { label: "60 dias", value: "60" as Filter }, { label: "90 dias", value: "90" as Filter }]).map(f => (
          <button key={f.label} onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-pill text-sm font-medium transition-all
              ${filter === f.value ? "gold-gradient text-navy-950" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(action => (
          <div key={action.id} className={`bg-card rounded-xl p-4 border border-border flex items-center gap-4 transition-all ${action.completed ? "opacity-60" : ""}`}>
            <button onClick={() => toggleAction(action.id)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0
                ${action.completed ? "bg-gold-500 border-gold-500 text-navy-950" : "border-navy-700 hover:border-gold-500"}`}>
              {action.completed && "✓"}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${action.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{action.text}</p>
            </div>
            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${priorityColor[action.priority]}`}>{action.priority}</span>
            <span className="text-xs text-gold-500 font-bold shrink-0">+{action.xp} XP</span>
            <span className="text-[10px] text-muted-foreground shrink-0">{action.phase}d</span>
          </div>
        ))}
      </div>
    </div>
  );
}
