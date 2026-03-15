import { mockAnalysisReport, mockProfile, RANKS } from "@/lib/mock-data";
import ScoreGauge from "@/components/report/ScoreGauge";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const scoreHistory = [
  { date: "Jan", score: 35 },
  { date: "Fev", score: 42 },
  { date: "Mar", score: 55 },
  { date: "Abr", score: 62 },
];

const stats = [
  { label: "Score Atual", value: "62", icon: "📊", trend: "+7" },
  { label: "XP Total", value: "1,250", icon: "⚡" },
  { label: "Ações Concluídas", value: "8/34", icon: "✅" },
  { label: "Streak", value: "3 semanas", icon: "🔥" },
];

export default function MenteeDashboard() {
  const report = mockAnalysisReport;
  const profile = mockProfile;
  const rank = report.rank;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Bem-vindo de volta, {profile.firstName}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
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

      {/* Rank card */}
      <div className="bg-navy-900 rounded-2xl p-6 border border-navy-700 flex flex-col md:flex-row items-center gap-4">
        <span className="text-5xl">{rank.icon}</span>
        <div className="flex-1 text-center md:text-left">
          <div className="text-lg font-bold text-gold-500">{rank.name}</div>
          <p className="text-sm text-muted-foreground">Score {rank.range}</p>
          <div className="w-full max-w-xs bg-navy-800 rounded-full h-2 mt-2">
            <div className="h-full gold-gradient rounded-full" style={{ width: "62%" }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Faltam 3 pontos para AUTORIDADE 💎</p>
        </div>
        <ScoreGauge score={62} size={90} />
      </div>

      {/* Score evolution */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-premium">
        <h2 className="text-lg font-bold text-foreground mb-4">Evolução do Score</h2>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreHistory}>
              <XAxis dataKey="date" stroke="hsl(215 16% 57%)" fontSize={12} />
              <YAxis stroke="hsl(215 16% 57%)" fontSize={12} domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(37 91% 55%)"
                strokeWidth={3}
                dot={{ fill: "hsl(37 91% 55%)", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-premium">
        <h2 className="text-lg font-bold text-foreground mb-4">Conquistas</h2>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
          {report.badges.map((b) => (
            <div
              key={b.name}
              className={`text-center p-3 rounded-xl border-2 transition-all
                ${b.earned ? "border-gold-500/30 bg-gold-500/5" : "border-border bg-muted/20 opacity-40 grayscale"}`}
            >
              <div className="text-2xl mb-1">{b.earned ? b.icon : "🔒"}</div>
              <div className="text-[10px] font-semibold text-foreground truncate">{b.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
