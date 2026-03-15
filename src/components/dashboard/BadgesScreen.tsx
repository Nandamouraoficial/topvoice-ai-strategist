import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getUserId } from "@/lib/app-store";
import { RANKS } from "@/lib/mock-data";

const ALL_BADGES = [
  { icon: "📸", name: "Primeira Impressão", rarity: "common" as const, xp: 150, requirement: "Complete a análise de foto de perfil" },
  { icon: "✍️", name: "Wordsmith", rarity: "common" as const, xp: 150, requirement: "Reescreva sua headline" },
  { icon: "🎨", name: "Identidade Visual", rarity: "common" as const, xp: 100, requirement: "Crie um banner personalizado" },
  { icon: "📝", name: "Storyteller", rarity: "common" as const, xp: 100, requirement: "Reescreva sua seção Sobre" },
  { icon: "💬", name: "Bem Recomendado", rarity: "rare" as const, xp: 200, requirement: "Receba 5 recomendações" },
  { icon: "🎯", name: "Posicionado", rarity: "rare" as const, xp: 200, requirement: "Complete todas as ações de 30 dias" },
  { icon: "📊", name: "Analista", rarity: "rare" as const, xp: 200, requirement: "Complete 2 análises" },
  { icon: "🔥", name: "Em Chamas", rarity: "rare" as const, xp: 250, requirement: "Mantenha streak de 4 semanas" },
  { icon: "🚀", name: "Decolagem", rarity: "epic" as const, xp: 300, requirement: "Atinja score 70+" },
  { icon: "💎", name: "Diamante", rarity: "epic" as const, xp: 400, requirement: "Complete todas as ações de 60 dias" },
  { icon: "🌟", name: "Influenciador", rarity: "epic" as const, xp: 350, requirement: "Publique 30 posts do calendário" },
  { icon: "👑", name: "Top Voice Candidate", rarity: "legendary" as const, xp: 500, requirement: "Atinja score 90+" },
  { icon: "🏆", name: "Ícone", rarity: "legendary" as const, xp: 1000, requirement: "Complete todas as 34 ações do plano" },
];

const rarityColors = {
  common: { border: "border-border", bg: "bg-card", label: "Comum", labelColor: "text-muted-foreground" },
  rare: { border: "border-blue-400", bg: "bg-blue-400/5", label: "Rara", labelColor: "text-blue-400" },
  epic: { border: "border-purple-500", bg: "bg-purple-500/5", label: "Épica", labelColor: "text-purple-500" },
  legendary: { border: "border-gold-500", bg: "bg-gold-500/5", label: "Lendária", labelColor: "text-gold-500" },
};

export default function BadgesScreen() {
  const [gamification, setGamification] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const userId = getUserId();
      if (!userId) { setLoading(false); return; }
      const { data } = await supabase.from("mentee_gamification").select("*").eq("user_id", userId).single();
      if (data) setGamification(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="text-center py-20"><div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" /></div>;

  const earnedBadges = gamification?.badges_earned_json || [];
  const currentXp = gamification?.current_xp || 0;
  const currentRank = gamification?.current_rank || "INVISÍVEL";
  const currentRankData = RANKS.find(r => r.name === currentRank) || RANKS[0];

  const badgesWithState = ALL_BADGES.map(b => ({
    ...b,
    earned: earnedBadges.some((e: any) => e.name === b.name),
    earnedDate: earnedBadges.find((e: any) => e.name === b.name)?.date,
  }));

  const nextBadge = badgesWithState.find(b => !b.earned);

  const rarities: ("common" | "rare" | "epic" | "legendary")[] = ["common", "rare", "epic", "legendary"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Suas Conquistas</h1>
          <p className="text-muted-foreground text-sm">
            {earnedBadges.length} de {ALL_BADGES.length} badges conquistadas
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gold-500">{currentXp} XP</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
            <span>{currentRankData.icon}</span> {currentRank}
          </div>
        </div>
      </div>

      {/* Next badge */}
      {nextBadge && (
        <div className="bg-card rounded-2xl p-5 border border-gold-500/30 shadow-premium">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{nextBadge.icon}</span>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-gold-500 font-bold mb-1">Próxima conquista</p>
              <p className="font-bold text-card-foreground">{nextBadge.name}</p>
              <p className="text-xs text-muted-foreground">{nextBadge.requirement}</p>
            </div>
            <div className="text-gold-500 font-bold text-sm">+{nextBadge.xp} XP</div>
          </div>
        </div>
      )}

      {/* Rank timeline */}
      <div className="bg-card rounded-2xl p-5 border border-border shadow-premium">
        <h3 className="text-sm font-bold text-card-foreground mb-4">Progressão de Rank</h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {RANKS.map((rank, i) => {
            const isPast = RANKS.indexOf(currentRankData) >= i;
            const isCurrent = rank.name === currentRank;
            return (
              <div key={rank.name} className="flex flex-col items-center min-w-[60px]">
                <span className={`text-2xl ${isCurrent ? "animate-pulse" : ""} ${isPast ? "" : "opacity-30 grayscale"}`}>{rank.icon}</span>
                <div className={`w-full h-1.5 rounded-full mt-1 ${isPast ? "gold-gradient" : "bg-navy-700"} ${isCurrent ? "shadow-gold" : ""}`} />
                <span className={`text-[9px] mt-1 font-bold ${isCurrent ? "text-gold-500" : isPast ? "text-muted-foreground" : "text-muted-foreground/40"}`}>{rank.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge sections by rarity */}
      {rarities.map(rarity => {
        const badges = badgesWithState.filter(b => b.rarity === rarity);
        if (badges.length === 0) return null;
        const rc = rarityColors[rarity];
        return (
          <div key={rarity}>
            <h3 className={`text-sm font-bold mb-3 ${rc.labelColor}`}>{rc.label}</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {badges.map(badge => (
                <div key={badge.name} className={`shrink-0 w-32 text-center p-4 rounded-xl border-2 transition-all
                  ${badge.earned ? `${rc.border} ${rc.bg}` : "border-border bg-muted/20 opacity-40 grayscale"}`}>
                  <div className="text-3xl mb-2">{badge.earned ? badge.icon : "🔒"}</div>
                  <div className="text-xs font-semibold text-card-foreground">{badge.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">+{badge.xp} XP</div>
                  {badge.earned && badge.earnedDate && (
                    <div className="text-[9px] text-gold-500 mt-1">Conquistada</div>
                  )}
                  {!badge.earned && (
                    <div className="text-[9px] text-muted-foreground mt-1 line-clamp-2">{badge.requirement}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
