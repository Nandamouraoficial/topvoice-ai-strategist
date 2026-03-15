import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Token {
  id: string;
  code: string;
  mentee_name: string | null;
  mentee_email: string | null;
  status: string;
  analyses_used: number;
  bonus_analyses_remaining: number;
  created_at: string;
  activated_at: string | null;
  last_analysis_at: string | null;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  created: { label: "Criado", color: "bg-secondary text-secondary-foreground" },
  activated: { label: "Ativado", color: "bg-blue-500/20 text-blue-400" },
  analysis_used: { label: "Análise Usada", color: "bg-success/20 text-success" },
  expired: { label: "Expirado", color: "bg-destructive/20 text-destructive" },
  bonus_granted: { label: "Bônus", color: "bg-gold-500/20 text-gold-500" },
};

function generateTokenCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "TVA-";
  for (let i = 0; i < 12; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export default function AdminPanel() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerate, setShowGenerate] = useState(false);
  const [genCount, setGenCount] = useState(1);
  const [genName, setGenName] = useState("");
  const [genEmail, setGenEmail] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const loadTokens = async () => {
    const { data, error } = await supabase
      .from("access_tokens")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setTokens(data as Token[]);
    setLoading(false);
  };

  useEffect(() => { loadTokens(); }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      for (let i = 0; i < genCount; i++) {
        const code = generateTokenCode();
        const { error } = await supabase.from("access_tokens").insert({
          code,
          mentee_name: genName || null,
          mentee_email: genEmail || null,
          status: "created",
        });
        if (error) throw error;

        // Send welcome email if email provided
        if (genEmail) {
          await supabase.functions.invoke("send-welcome-email", {
            body: {
              mentee_name: genName,
              mentee_email: genEmail,
              access_code: code,
              app_url: window.location.origin,
            },
          });
        }
      }
      setShowGenerate(false);
      setGenName("");
      setGenEmail("");
      setGenCount(1);
      loadTokens();
    } catch (err) {
      console.error("Token generation error:", err);
      alert("Erro ao gerar tokens.");
    }
    setGenerating(false);
  };

  const handleExpire = async (id: string) => {
    await supabase.from("access_tokens").update({ status: "expired" }).eq("id", id);
    loadTokens();
  };

  const handleGrantBonus = async (id: string) => {
    const token = tokens.find(t => t.id === id);
    if (!token) return;
    await supabase.from("access_tokens").update({
      bonus_analyses_remaining: (token.bonus_analyses_remaining || 0) + 1,
      status: "bonus_granted",
    }).eq("id", id);
    loadTokens();
  };

  const stats = [
    { label: "Total Tokens", value: tokens.length, icon: "🔑" },
    { label: "Mentorados Ativos", value: tokens.filter(t => ["activated", "analysis_used", "bonus_granted"].includes(t.status)).length, icon: "👥" },
    { label: "Análises Realizadas", value: tokens.filter(t => t.analyses_used > 0).length, icon: "📊" },
    { label: "Tokens Não Usados", value: tokens.filter(t => t.status === "created").length, icon: "📦" },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-platinum">
      <div className="border-b border-navy-700 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-lg font-bold text-navy-950">TV</div>
            <div>
              <span className="text-lg font-bold">TopVoice <span className="text-gold-500">AI</span></span>
              <span className="text-xs text-muted-foreground ml-2">Admin</span>
            </div>
          </div>
          <Button onClick={() => setShowGenerate(true)} className="gold-gradient text-navy-950 rounded-pill border-0 hover:shadow-gold font-semibold">
            + Gerar Tokens
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="glass-card rounded-xl p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-platinum">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-navy-700">
            <h2 className="text-lg font-bold">Tokens de Acesso</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs uppercase tracking-widest text-muted-foreground border-b border-navy-700">
                    <th className="p-4 text-left">Código</th>
                    <th className="p-4 text-left">Nome</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Análises</th>
                    <th className="p-4 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map(token => (
                    <tr key={token.id} className="border-b border-navy-700/50 hover:bg-navy-800/30 transition-colors">
                      <td className="p-4"><code className="text-sm font-mono text-gold-500">{token.code}</code></td>
                      <td className="p-4 text-sm">{token.mentee_name || "—"}</td>
                      <td className="p-4 text-sm text-muted-foreground">{token.mentee_email || "—"}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${(statusLabels[token.status] || statusLabels.created).color}`}>
                          {(statusLabels[token.status] || statusLabels.created).label}
                        </span>
                      </td>
                      <td className="p-4 text-sm">{token.analyses_used}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => copyCode(token.code)} className="text-xs text-muted-foreground hover:text-gold-500 transition-colors" title="Copiar">
                            {copiedCode === token.code ? "✓" : "📋"}
                          </button>
                          {token.status !== "expired" && (
                            <button onClick={() => handleExpire(token.id)} className="text-xs text-muted-foreground hover:text-destructive transition-colors" title="Expirar">🚫</button>
                          )}
                          {["analysis_used", "bonus_granted"].includes(token.status) && (
                            <button onClick={() => handleGrantBonus(token.id)} className="text-xs text-muted-foreground hover:text-success transition-colors" title="Análise extra">➕</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showGenerate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowGenerate(false)}>
          <div className="glass-card-strong rounded-2xl p-6 max-w-md w-full animate-scale-in" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-platinum mb-4">Gerar Novos Tokens</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Quantidade</label>
                <input type="number" min={1} max={50} value={genCount} onChange={e => setGenCount(Number(e.target.value))} className="question-input" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Nome do mentorado (opcional)</label>
                <input type="text" value={genName} onChange={e => setGenName(e.target.value)} placeholder="Nome completo" className="question-input" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Email (opcional)</label>
                <input type="email" value={genEmail} onChange={e => setGenEmail(e.target.value)} placeholder="email@exemplo.com" className="question-input" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="ghost" onClick={() => setShowGenerate(false)} className="flex-1 text-muted-foreground">Cancelar</Button>
              <Button onClick={handleGenerate} disabled={generating} className="flex-1 gold-gradient text-navy-950 rounded-pill border-0 hover:shadow-gold">
                {generating ? "Gerando..." : `Gerar ${genCount} Token${genCount > 1 ? "s" : ""}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
