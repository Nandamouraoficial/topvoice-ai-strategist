import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AnalysisReport from "@/components/report/AnalysisReport";

export default function SharedReport() {
  const { shareToken } = useParams();
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!shareToken) { setLoading(false); return; }

      const { data: share, error } = await supabase
        .from("report_shares")
        .select("*, analyses(*)")
        .eq("share_token", shareToken)
        .single();

      if (error || !share) {
        setExpired(true);
        setLoading(false);
        return;
      }

      if (new Date(share.expires_at) < new Date()) {
        setExpired(true);
        setLoading(false);
        return;
      }

      setAnalysis(share.analyses);
      setLoading(false);
    };
    load();
  }, [shareToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  if (expired || !analysis) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-10 max-w-md text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold text-platinum mb-2">Este relatório expirou</h1>
          <p className="text-muted-foreground text-sm">
            Links de compartilhamento são válidos por 30 dias. Entre em contato com o proprietário para um novo link.
          </p>
        </div>
      </div>
    );
  }

  return <AnalysisReport onViewActions={() => {}} readOnly analysisData={analysis} />;
}
