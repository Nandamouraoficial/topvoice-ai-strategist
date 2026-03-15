import { mockAnalysisReport, mockProfile, RANKS } from "@/lib/mock-data";
import ScoreGauge from "./ScoreGauge";
import SectionCard from "./SectionCard";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

interface AnalysisReportProps {
  onViewActions: () => void;
}

export default function AnalysisReport({ onViewActions }: AnalysisReportProps) {
  const report = mockAnalysisReport;
  const profile = mockProfile;

  const scoreBadgeColor = (score: number) => {
    if (score >= 8) return "text-success";
    if (score >= 6) return "text-blue-400";
    if (score >= 4) return "text-gold-500";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Dark header */}
      <div className="bg-navy-900 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            {/* Profile photo */}
            <div className="w-20 h-20 rounded-full border-4 border-gold-500 bg-navy-800 flex items-center justify-center text-3xl shadow-gold">
              {profile.firstName[0]}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-platinum">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.role} na {profile.company}</p>
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">
                {profile.linkedinUrl}
              </a>
              <p className="text-sm text-gold-500 mt-1">🎯 {profile.goal} em {profile.timeline}</p>
            </div>

            {/* Score gauge */}
            <ScoreGauge score={report.overallScore} size={120} />
          </div>

          {/* Mini scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(report.categoryScores).map(([key, val]) => (
              <div key={key} className="glass-card rounded-xl p-4 text-center">
                <div className={`text-2xl font-bold ${scoreBadgeColor(val)}`}>{val}/10</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                  {key === "visual" ? "Visual" : key === "positioning" ? "Posicionamento" : key === "content" ? "Conteúdo" : "Rede"}
                </div>
              </div>
            ))}
          </div>

          {/* Action bar */}
          <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
            <Button variant="outline" className="border-navy-700 text-platinum bg-transparent hover:bg-navy-800 rounded-pill">
              📄 Exportar PDF
            </Button>
            <Button variant="outline" className="border-navy-700 text-platinum bg-transparent hover:bg-navy-800 rounded-pill">
              🔗 Compartilhar
            </Button>
            <Button onClick={onViewActions} className="gold-gradient text-navy-950 rounded-pill border-0 hover:shadow-gold">
              ✅ Ver Plano de Ação
            </Button>
          </div>
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
            {report.executiveDiagnosis.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-4 ml-4 p-4 rounded-xl bg-gold-500/10 border-l-4 border-gold-500">
            <p className="text-sm font-semibold text-gold-500 italic">"{report.pullQuote}"</p>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-card rounded-2xl shadow-premium p-6 border border-border">
          <h2 className="text-xl font-bold text-card-foreground mb-6">Visão 360° do Seu Perfil</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={report.radarData}>
                <PolarGrid stroke="hsl(213 40% 22%)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: "hsl(215 16% 57%)" }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(37 91% 55%)"
                  fill="hsl(37 91% 55%)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section Cards */}
        <div>
          <h2 className="text-xl font-bold text-card-foreground mb-6">Análise por Seção</h2>
          <div className="space-y-6">
            {report.sections.map((section) => (
              <SectionCard key={section.name} section={section} />
            ))}
          </div>
        </div>

        {/* Action Plan */}
        <div className="bg-card rounded-2xl shadow-premium p-6 border border-border">
          <h2 className="text-xl font-bold text-card-foreground mb-6">Plano de Ação</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {report.actionPlan.phases.map((phase) => (
              <div key={phase.phase} className={`rounded-xl border-2 p-5
                ${phase.color === "destructive" ? "border-destructive/30 bg-destructive/5" :
                  phase.color === "warning" ? "border-gold-500/30 bg-gold-500/5" :
                  "border-success/30 bg-success/5"}`}
              >
                <div className="text-sm font-bold mb-3">
                  {phase.color === "destructive" ? "🔴" : phase.color === "warning" ? "🟡" : "🟢"}{" "}
                  {phase.phase} dias — {phase.theme}
                </div>
                <ul className="space-y-2">
                  {phase.actions.map((a, i) => (
                    <li key={i} className="text-sm text-card-foreground flex items-start gap-2">
                      <span className="text-muted-foreground">☐</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Top 5 */}
          <h3 className="text-lg font-bold text-card-foreground mb-4">Top 5 Prioridades</h3>
          <div className="space-y-3">
            {report.actionPlan.topPriorities.map((p) => (
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
                {report.topVoicePotential.accelerators.map((a, i) => (
                  <li key={i} className="text-sm text-platinum">✓ {a}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <h4 className="text-sm font-bold text-destructive mb-2">🚧 Bloqueadores</h4>
              <ul className="space-y-1">
                {report.topVoicePotential.blockers.map((b, i) => (
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
            {report.badges.map((b) => (
              <div
                key={b.name}
                className={`shrink-0 w-28 text-center p-4 rounded-xl border-2 transition-all
                  ${b.earned
                    ? b.rarity === "legendary" ? "border-gold-500 shadow-gold bg-gold-500/5" :
                      b.rarity === "epic" ? "border-purple-500 bg-purple-500/5" :
                      b.rarity === "rare" ? "border-blue-400 bg-blue-400/5" :
                      "border-border bg-card"
                    : "border-border bg-muted/30 opacity-40 grayscale"
                  }`}
              >
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
