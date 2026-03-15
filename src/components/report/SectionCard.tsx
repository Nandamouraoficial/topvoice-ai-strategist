import { useState, useCallback } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SectionCardProps {
  section: {
    name: string;
    icon: string;
    score: number;
    status: "Forte" | "Bom" | "Atenção" | "Crítico";
    aiSees: string;
    working: string[];
    needsChange: string[];
    immediateAction: string;
    strategy90days: string;
    alternatives?: string[];
  };
}

const statusColors = {
  Forte: "bg-success/20 text-success border-success/30",
  Bom: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Atenção: "bg-warning/20 text-gold-500 border-warning/30",
  Crítico: "bg-destructive/20 text-destructive border-destructive/30",
};

const scoreBg = (score: number) => {
  if (score >= 8) return "bg-success text-success-foreground";
  if (score >= 6) return "bg-blue-500 text-primary-foreground";
  if (score >= 4) return "bg-gold-500 text-accent-foreground";
  return "bg-destructive text-destructive-foreground";
};

export default function SectionCard({ section }: SectionCardProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copy = useCallback((text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }, []);

  return (
    <div className="bg-card rounded-2xl shadow-premium border border-border p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.icon}</span>
          <h3 className="text-lg font-bold text-card-foreground">{section.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${scoreBg(section.score)}`}>
            {section.score}/10
          </span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusColors[section.status]}`}>
            {section.status}
          </span>
        </div>
      </div>

      {/* AI sees */}
      <p className="text-sm text-muted-foreground mb-4 italic">
        <span className="font-semibold">O que a IA vê:</span> {section.aiSees}
      </p>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl border-2 border-success/20 bg-success/5 p-4">
          <h4 className="text-sm font-bold text-success mb-2">✅ O que está funcionando</h4>
          <ul className="space-y-1.5">
            {section.working.map((w, i) => (
              <li key={i} className="text-sm text-card-foreground flex items-start gap-2">
                <span className="text-success mt-0.5">•</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border-2 border-destructive/20 bg-destructive/5 p-4">
          <h4 className="text-sm font-bold text-destructive mb-2">❌ O que precisa mudar</h4>
          <ul className="space-y-1.5">
            {section.needsChange.map((n, i) => (
              <li key={i} className="text-sm text-card-foreground flex items-start gap-2">
                <span className="text-destructive mt-0.5">•</span>
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Immediate action */}
      <div className="rounded-xl border-2 border-gold-500/30 bg-gold-500/5 p-4 mb-3">
        <h4 className="text-sm font-bold text-gold-500 mb-1">⚡ Ação Imediata</h4>
        <p className="text-sm text-card-foreground">{section.immediateAction}</p>
      </div>

      {/* 90 day strategy */}
      <div className="rounded-xl border-2 border-navy-700/50 bg-navy-800/30 p-4">
        <h4 className="text-sm font-bold text-primary mb-1">📅 Estratégia 90 dias</h4>
        <p className="text-sm text-card-foreground">{section.strategy90days}</p>
      </div>

      {/* Alternatives (for headline) */}
      {section.alternatives && (
        <div className="mt-4">
          <h4 className="text-sm font-bold text-platinum mb-3">📝 Versões alternativas prontas para usar</h4>
          <div className="space-y-2">
            {section.alternatives.map((alt, i) => (
              <div key={i} className="bg-navy-800 rounded-xl p-3 flex items-start justify-between gap-2 border border-navy-700">
                <p className="text-sm text-platinum flex-1">{alt}</p>
                <button
                  onClick={() => copy(alt, i)}
                  className="text-xs text-muted-foreground hover:text-gold-500 transition-colors shrink-0 mt-0.5"
                >
                  {copiedIdx === i ? "✓" : "📋"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
