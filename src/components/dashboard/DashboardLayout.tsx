import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getUserId, getAnalysisId } from "@/lib/app-store";
import { RANKS } from "@/lib/mock-data";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const navItems = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "report", icon: "📊", label: "Meu Relatório" },
  { id: "actions", icon: "✅", label: "Plano de Ação" },
  { id: "calendar", icon: "📅", label: "Calendário" },
  { id: "badges", icon: "🏆", label: "Conquistas" },
];

export default function DashboardLayout({ children, activeTab, onTabChange, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState({ firstName: "Usuário", rank: RANKS[0] });

  useEffect(() => {
    const load = async () => {
      const userId = getUserId();
      if (!userId) return;

      const [{ data: user }, { data: gamification }] = await Promise.all([
        supabase.from("users").select("first_name, name").eq("id", userId).single(),
        supabase.from("mentee_gamification").select("current_rank").eq("user_id", userId).single(),
      ]);

      const rankName = gamification?.current_rank || "INVISÍVEL";
      const rank = RANKS.find(r => r.name === rankName) || RANKS[0];
      setProfileData({
        firstName: user?.first_name || user?.name?.split(" ")[0] || "Usuário",
        rank,
      });
    };
    load();
  }, []);

  const { firstName, rank } = profileData;

  return (
    <div className="min-h-screen flex bg-surface">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-navy-950 border-r border-navy-700 
        flex flex-col z-50 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-5 border-b border-navy-700">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center text-sm font-bold text-navy-950">TV</div>
            <span className="text-lg font-bold text-platinum">TopVoice <span className="text-gold-500">AI</span></span>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { onTabChange(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${activeTab === item.id ? "bg-gold-500/10 text-gold-500" : "text-muted-foreground hover:text-platinum hover:bg-navy-800"}`}>
              <span className="text-lg">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-navy-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-navy-800 flex items-center justify-center text-sm font-bold text-gold-500 border-2 border-gold-500/30">
              {firstName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-platinum truncate">{firstName}</div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span>{rank.icon}</span> {rank.name}
              </div>
            </div>
          </div>
          <button onClick={onLogout} className="mt-3 w-full text-xs text-muted-foreground hover:text-destructive transition-colors text-left">Sair</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden sticky top-0 z-30 bg-surface/95 backdrop-blur-sm border-b border-border p-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-foreground">☰</button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gold-gradient flex items-center justify-center text-xs font-bold text-navy-950">TV</div>
            <span className="text-sm font-bold text-foreground">TopVoice <span className="text-gold-500">AI</span></span>
          </div>
        </header>
        <main className="p-4 md:p-8 max-w-6xl">{children}</main>
      </div>
    </div>
  );
}
