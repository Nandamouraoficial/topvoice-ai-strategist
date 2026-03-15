import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { setTokenData } from "@/lib/app-store";

interface AccessCodeScreenProps {
  onValidCode: (code: string) => void;
}

export default function AccessCodeScreen({ onValidCode }: AccessCodeScreenProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const [validating, setValidating] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setValidating(true);

    try {
      const inputCode = code.trim().toUpperCase();
      
      const { data: token, error: dbError } = await supabase
        .from("access_tokens")
        .select("*")
        .eq("code", inputCode)
        .maybeSingle();

      if (dbError) {
        console.error("DB error:", dbError);
        setError("Erro ao verificar código. Tente novamente.");
        triggerShake();
        setValidating(false);
        return;
      }

      if (!token) {
        setError("Código inválido. Verifique e tente novamente.");
        triggerShake();
        setValidating(false);
        return;
      }

      if (token.status === "expired") {
        setError("Este código foi expirado. Entre em contato com a Fernanda.");
        triggerShake();
        setValidating(false);
        return;
      }

      if (token.status === "analysis_used" && (token.bonus_analyses_remaining || 0) <= 0) {
        setError("Você já utilizou sua análise. Para uma nova análise, fale com a Fernanda.");
        triggerShake();
        setValidating(false);
        return;
      }

      // Valid token — activate it
      if (token.status === "created") {
        await supabase
          .from("access_tokens")
          .update({ status: "activated", activated_at: new Date().toISOString() })
          .eq("id", token.id);
      }

      // Save token data to localStorage
      setTokenData({
        id: token.id,
        code: token.code,
        mentee_name: token.mentee_name || "",
      });

      onValidCode(inputCode);
    } catch (err) {
      console.error("Validation error:", err);
      setError("Erro inesperado. Tente novamente.");
      triggerShake();
    }

    setValidating(false);
  };

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 relative overflow-hidden">
      <div className="floating-orb w-96 h-96 bg-gold-500 top-[-10%] left-[-10%]" />
      <div className="floating-orb w-72 h-72 bg-blue-500 bottom-[-5%] right-[-5%]" />
      <div className="floating-orb w-48 h-48 bg-gold-400 top-[40%] right-[20%]" />

      <div className={`glass-card rounded-2xl p-10 max-w-md w-full mx-4 animate-scale-in ${shaking ? "animate-shake" : ""}`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-lg font-bold text-navy-950">
              TV
            </div>
            <span className="text-xl font-bold text-platinum">
              TopVoice <span className="text-gold-500">AI</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-platinum mb-2">
            Insira seu código de acesso
          </h1>
          <p className="text-muted-foreground text-sm">
            Você recebeu seu código por e-mail após a compra
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="TVA-XXXXXXXXXXXX"
            className={`w-full px-4 py-4 rounded-xl text-center text-lg font-mono tracking-widest 
              bg-navy-800 border-2 transition-all duration-200
              text-platinum placeholder:text-muted-foreground/50
              focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
              ${error ? "border-destructive" : "border-navy-700"}
            `}
          />
          {error && (
            <div className="mt-3 text-center animate-fade-in">
              <p className="text-destructive text-sm">{error}</p>
              {error.includes("fale com a Fernanda") && (
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-gold-500 hover:underline"
                >
                  💬 Falar com Fernanda no WhatsApp
                </a>
              )}
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!code.trim() || validating}
          className="w-full py-6 rounded-pill text-base font-semibold gold-gradient text-navy-950 
            hover:shadow-gold transition-all duration-200 disabled:opacity-50 border-0"
        >
          {validating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
              Verificando...
            </span>
          ) : (
            "Ativar Acesso →"
          )}
        </Button>

        <div className="text-center mt-6">
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-blue-400 transition-colors"
          >
            Não tem um código? Fale conosco
          </a>
        </div>
      </div>
    </div>
  );
}
