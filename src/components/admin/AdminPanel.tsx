import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Token {
  id: string;
  code: string;
  name: string;
  email: string;
  status: "created" | "activated" | "analysis_used" | "expired";
  analysesUsed: number;
  lastActivity: string;
}

const mockTokens: Token[] = [
  { id: "1", code: "TVA-ABC123DEF456", name: "Ana Carolina Ferreira", email: "ana@email.com", status: "analysis_used", analysesUsed: 1, lastActivity: "2024-03-10" },
  { id: "2", code: "TVA-GHI789JKL012", name: "Carlos Eduardo Silva", email: "carlos@email.com", status: "activated", analysesUsed: 0, lastActivity: "2024-03-12" },
  { id: "3", code: "TVA-MNO345PQR678", name: "", email: "", status: "created", analysesUsed: 0, lastActivity: "" },
  { id: "4", code: "TVA-STU901VWX234", name: "Mariana Costa", email: "mari@email.com", status: "expired", analysesUsed: 1, lastActivity: "2024-02-15" },
];

const statusLabels = {
  created: { label: "Criado", color: "bg-secondary text-secondary-foreground" },
  activated: { label: "Ativado", color: "bg-blue-500/20 text-blue-400" },
  analysis_used: { label: "Análise Usada", color: "bg-success/20 text-success" },
  expired: { label: "Expirado", color: "bg-destructive/20 text-destructive" },
};

export default function AdminPanel() {
  const [tokens] = useState(mockTokens);
  const [showGenerate, setShowGenerate] = useState(false);
  const [genCount, setGenCount] = useState(1);
  const [genName, setGenName] = useState("");
  const [genEmail, setGenEmail] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const stats = [
    { label: "Total Tokens", value: tokens.length, icon: "🔑" },
    { label: "Mentorados Ativos", value: tokens.filter((t) => t.status === "activated" || t.status === "analysis_used").length, icon: "👥" },
    { label: "Análises este Mês", value: tokens.filter((t) => t.status === "analysis_used").length, icon: "📊" },
    { label: "Tokens Não Usados", value: tokens.filter((t) => t.status === "created").length, icon: "📦" },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-platinum">
      {/* Header */}
      <div className="border-b border-navy-700 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-lg font-bold text-navy-950">
              TV
            </div>
            <div>
              <span className="text-lg font-bold">TopVoice <span className="text-gold-500">AI</span></span>
              <span className="text-xs text-muted-foreground ml-2">Admin</span>
            </div>
          </div>
          <Button
            onClick={() => setShowGenerate(true)}
            className="gold-gradient text-navy-950 rounded-pill border-0 hover:shadow-gold font-semibold"
          >
            + Gerar Tokens
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-platinum">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tokens table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-navy-700">
            <h2 className="text-lg font-bold">Tokens de Acesso</h2>
          </div>
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
                {tokens.map((token) => (
                  <tr key={token.id} className="border-b border-navy-700/50 hover:bg-navy-800/30 transition-colors">
                    <td className="p-4">
                      <code className="text-sm font-mono text-gold-500">{token.code}</code>
                    </td>
                    <td className="p-4 text-sm">{token.name || "—"}</td>
                    <td className="p-4 text-sm text-muted-foreground">{token.email || "—"}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusLabels[token.status].color}`}>
                        {statusLabels[token.status].label}
                      </span>
                    </td>
                    <td className="p-4 text-sm">{token.analysesUsed}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => copyCode(token.code)} className="text-xs text-muted-foreground hover:text-gold-500 transition-colors">
                          {copiedCode === token.code ? "✓" : "📋"}
                        </button>
                        {token.status === "analysis_used" && (
                          <button className="text-xs text-muted-foreground hover:text-blue-400 transition-colors">👁</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Generate modal */}
      {showGenerate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowGenerate(false)}>
          <div className="glass-card-strong rounded-2xl p-6 max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-platinum mb-4">Gerar Novos Tokens</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Quantidade</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={genCount}
                  onChange={(e) => setGenCount(Number(e.target.value))}
                  className="question-input"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Nome do mentorado (opcional)</label>
                <input
                  type="text"
                  value={genName}
                  onChange={(e) => setGenName(e.target.value)}
                  placeholder="Nome completo"
                  className="question-input"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Email (opcional)</label>
                <input
                  type="email"
                  value={genEmail}
                  onChange={(e) => setGenEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="question-input"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowGenerate(false)}
                className="flex-1 text-muted-foreground"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => { setShowGenerate(false); }}
                className="flex-1 gold-gradient text-navy-950 rounded-pill border-0 hover:shadow-gold"
              >
                Gerar {genCount} Token{genCount > 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
