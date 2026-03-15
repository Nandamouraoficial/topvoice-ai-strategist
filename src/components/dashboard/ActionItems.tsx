import { useState } from "react";
import { mockAnalysisReport } from "@/lib/mock-data";

const allActions = mockAnalysisReport.actionPlan.phases.flatMap((phase) =>
  phase.actions.map((action, i) => ({
    id: `${phase.phase}-${i}`,
    text: action,
    phase: phase.phase,
    priority: i < 2 ? "Crítico" as const : i < 4 ? "Alto" as const : "Médio" as const,
    xp: [150, 200, 100, 100, 50][i] || 75,
    completed: false,
  }))
);

type Filter = "all" | 30 | 60 | 90;

export default function ActionItems() {
  const [filter, setFilter] = useState<Filter>("all");
  const [actions, setActions] = useState(allActions);

  const filtered = actions.filter((a) => filter === "all" || a.phase === filter);
  const completed = actions.filter((a) => a.completed).length;
  const totalXp = actions.filter((a) => a.completed).reduce((sum, a) => sum + a.xp, 0);

  const toggleAction = (id: string) => {
    setActions((prev) => prev.map((a) => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const priorityColor = {
    Crítico: "bg-destructive/20 text-destructive",
    Alto: "bg-gold-500/20 text-gold-500",
    Médio: "bg-blue-500/20 text-blue-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Plano de Ação</h1>
          <p className="text-muted-foreground text-sm">
            {completed} de {actions.length} ações concluídas — {totalXp} XP conquistados
          </p>
        </div>
        <div className="w-16 h-16 relative">
          <svg viewBox="0 0 60 60" className="-rotate-90">
            <circle cx="30" cy="30" r="25" fill="none" stroke="hsl(213 40% 22%)" strokeWidth="5" />
            <circle
              cx="30" cy="30" r="25" fill="none"
              stroke="hsl(37 91% 55%)" strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 25}
              strokeDashoffset={2 * Math.PI * 25 * (1 - completed / actions.length)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gold-500">
            {Math.round((completed / actions.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { label: "Tudo", value: "all" as Filter },
          { label: "30 dias", value: 30 as Filter },
          { label: "60 dias", value: 60 as Filter },
          { label: "90 dias", value: 90 as Filter },
        ].map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-pill text-sm font-medium transition-all
              ${filter === f.value
                ? "gold-gradient text-navy-950"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Action list */}
      <div className="space-y-2">
        {filtered.map((action) => (
          <div
            key={action.id}
            className={`bg-card rounded-xl p-4 border border-border flex items-center gap-4 transition-all
              ${action.completed ? "opacity-60" : ""}`}
          >
            <button
              onClick={() => toggleAction(action.id)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0
                ${action.completed
                  ? "bg-gold-500 border-gold-500 text-navy-950"
                  : "border-navy-700 hover:border-gold-500"
                }`}
            >
              {action.completed && "✓"}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${action.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {action.text}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${priorityColor[action.priority]}`}>
              {action.priority}
            </span>
            <span className="text-xs text-gold-500 font-bold shrink-0">+{action.xp} XP</span>
            <span className="text-[10px] text-muted-foreground shrink-0">{action.phase}d</span>
          </div>
        ))}
      </div>
    </div>
  );
}
