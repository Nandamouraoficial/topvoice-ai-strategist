import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAnalysisId, getUserId } from "@/lib/app-store";
import { Button } from "@/components/ui/button";

export default function EditorialCalendar() {
  const [phase, setPhase] = useState<"frequency" | "calendar">("frequency");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [frequency, setFrequency] = useState(3);
  const [accepted, setAccepted] = useState(true);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [view, setView] = useState<"grid" | "list">("list");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const analysisId = getAnalysisId();
      if (!analysisId) { setLoading(false); return; }

      const { data } = await supabase.from("analyses").select("*").eq("id", analysisId).single();
      if (data) {
        setAnalysisData(data);
        const rec = data.ai_recommended_frequency || data.full_report_json?.editorial_calendar_brief?.recommended_frequency_per_week || 3;
        setFrequency(rec);
        if (data.editorial_calendar_json?.posts) {
          setCalendar(data.editorial_calendar_json.posts);
          setPhase("calendar");
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const analysisId = getAnalysisId();
      const report = analysisData?.full_report_json;
      const pillars = report?.editorial_calendar_brief?.pillars ||
        report?.sections?.content_strategy?.content_pillars?.map((p: any) => p.pillar_name) || ["Autoridade", "Bastidores", "Educação"];

      // Save frequency choice
      await supabase.from("analyses").update({
        confirmed_frequency_per_week: frequency,
        user_accepted_recommendation: accepted,
      }).eq("id", analysisId);

      // Generate calendar via AI
      const { data: result, error } = await supabase.functions.invoke("generate-calendar", {
        body: {
          frequency,
          pillars,
          segment: report?.sections?.positioning?.brand_archetype || "Profissional",
          goal: analysisData?.full_report_json?.action_plan?.top_5_priorities?.[0]?.action || "Crescer no LinkedIn",
          mentee_name: "Mentorado",
        },
      });

      if (error) throw error;
      if (result?.posts) {
        setCalendar(result.posts);
        await supabase.from("analyses").update({ editorial_calendar_json: result }).eq("id", analysisId);
        setPhase("calendar");
      }
    } catch (err) {
      console.error("Calendar generation error:", err);
      alert("Erro ao gerar calendário. Tente novamente.");
    }
    setGenerating(false);
  };

  const copyHook = (hook: string, idx: number) => {
    navigator.clipboard.writeText(hook);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (loading) return <div className="text-center py-20"><div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" /></div>;

  if (!analysisData) {
    return (
      <div className="text-center py-20">
        <span className="text-5xl mb-4 block">📅</span>
        <h2 className="text-xl font-bold text-foreground mb-2">Calendário Editorial</h2>
        <p className="text-muted-foreground">Complete sua análise para gerar o calendário</p>
      </div>
    );
  }

  if (phase === "frequency") {
    const reasoning = analysisData?.full_report_json?.editorial_calendar_brief?.frequency_reasoning || "Baseado no seu segmento e objetivos, esta frequência maximiza visibilidade sem comprometer qualidade.";

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">📅 Recomendação de Frequência Editorial</h1>
          <p className="text-muted-foreground text-sm mt-1">Defina quantas vezes por semana você vai publicar</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-premium">
          <div className="text-center mb-6">
            <div className="text-6xl font-extrabold text-gold-500 mb-2">{analysisData.ai_recommended_frequency || 3}x</div>
            <p className="text-sm text-muted-foreground">por semana — recomendação da IA</p>
          </div>
          <p className="text-sm text-card-foreground leading-relaxed mb-4">{reasoning}</p>
          <p className="text-xs text-muted-foreground italic">Top Voices do seu segmento postam em média {(analysisData.ai_recommended_frequency || 3) + 1}x/semana</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-premium">
          <h3 className="text-sm font-bold text-card-foreground mb-4">Escolha sua frequência:</h3>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5].map(f => (
              <button key={f} onClick={() => { setFrequency(f); setAccepted(f === (analysisData.ai_recommended_frequency || 3)); }}
                className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2
                  ${frequency === f ? "border-gold-500 bg-gold-500/10 text-gold-500" : "border-border bg-secondary text-secondary-foreground"}`}>
                {f === (analysisData.ai_recommended_frequency || 3) ? `✅ ${f}x (recomendado)` : `${f}x`}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={generating}
          className="w-full py-6 rounded-pill text-base font-semibold gold-gradient text-navy-950 hover:shadow-gold border-0">
          {generating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
              Gerando calendário...
            </span>
          ) : "Gerar meu Calendário →"}
        </Button>
      </div>
    );
  }

  // Calendar view
  const pillarColors: Record<string, string> = {};
  const colors = ["bg-gold-500/20 text-gold-500", "bg-blue-500/20 text-blue-400", "bg-success/20 text-success", "bg-purple-500/20 text-purple-400", "bg-destructive/20 text-destructive"];
  calendar.forEach(p => { if (!pillarColors[p.pillar]) pillarColors[p.pillar] = colors[Object.keys(pillarColors).length % colors.length]; });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendário Editorial</h1>
          <p className="text-muted-foreground text-sm">{frequency}x por semana — {calendar.length} posts planejados</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("list")} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${view === "list" ? "gold-gradient text-navy-950" : "bg-secondary text-secondary-foreground"}`}>Lista</button>
          <button onClick={() => setView("grid")} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${view === "grid" ? "gold-gradient text-navy-950" : "bg-secondary text-secondary-foreground"}`}>Grade</button>
        </div>
      </div>

      {/* Pillar legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(pillarColors).map(([pillar, color]) => (
          <span key={pillar} className={`px-3 py-1 rounded-lg text-xs font-semibold ${color}`}>{pillar}</span>
        ))}
      </div>

      {view === "list" ? (
        <div className="space-y-3">
          {calendar.map((post, idx) => (
            <div key={idx} className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">Dia {post.day}</span>
                  <span className="text-xs text-muted-foreground">{post.day_of_week}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pillarColors[post.pillar] || "bg-secondary text-secondary-foreground"}`}>{post.pillar}</span>
                  <span className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">{post.type}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">~{post.estimated_minutes || 30}min</span>
              </div>
              <p className="text-sm font-medium text-card-foreground mb-1">"{post.hook}"</p>
              <p className="text-xs text-muted-foreground">{post.objective}</p>
              {post.tips && <p className="text-xs text-muted-foreground mt-1 italic">💡 {post.tips}</p>}
              <button onClick={() => copyHook(post.hook, idx)} className="text-xs text-muted-foreground hover:text-gold-500 mt-2 transition-colors">
                {copiedIdx === idx ? "✓ Copiado!" : "📋 Copiar gancho"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(d => (
            <div key={d} className="text-[10px] text-center font-bold text-muted-foreground py-1">{d}</div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const day = i + 1;
            const post = calendar.find(p => p.day === day);
            return (
              <div key={i} className={`aspect-square rounded-lg border text-center flex flex-col items-center justify-center text-[10px] p-0.5
                ${post ? "border-gold-500/30 bg-card" : "border-border/50 bg-muted/10"}`}>
                <span className="text-muted-foreground">{day <= 30 ? day : ""}</span>
                {post && <span className={`w-2 h-2 rounded-full mt-0.5 ${pillarColors[post.pillar]?.includes("gold") ? "bg-gold-500" : pillarColors[post.pillar]?.includes("blue") ? "bg-blue-500" : "bg-success"}`} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
