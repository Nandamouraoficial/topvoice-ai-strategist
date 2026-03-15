import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface VerificationScreenProps {
  onVerified: () => void;
}

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "TOPVOICE-";
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export default function VerificationScreen({ onVerified }: VerificationScreenProps) {
  const [code] = useState(generateCode);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<"idle" | "checking" | "success" | "failed">("idle");
  const [copied, setCopied] = useState(false);

  const maxAttempts = 5;

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const verify = async () => {
    setStatus("checking");
    await new Promise((r) => setTimeout(r, 1500));

    // Mock: auto-succeed on 2nd attempt or after
    if (attempts >= 1) {
      setStatus("success");
      setTimeout(onVerified, 2000);
    } else {
      setStatus("failed");
      setAttempts((a) => a + 1);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="floating-orb w-64 h-64 bg-blue-500 top-[20%] left-[10%]" />
      <div className="floating-orb w-48 h-48 bg-gold-500 bottom-[20%] right-[15%]" />

      <div className="glass-card rounded-2xl p-8 max-w-lg w-full animate-scale-in relative z-10">
        {status === "success" ? (
          <div className="text-center animate-scale-in">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-platinum mb-2">Identidade verificada!</h2>
            <p className="text-muted-foreground text-sm">
              Pode remover o código do seu Sobre agora.
            </p>
            <p className="text-gold-500 text-sm mt-4">Iniciando análise...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔐</div>
              <h2 className="text-2xl font-bold text-platinum mb-2">Verificação de Identidade</h2>
              <p className="text-muted-foreground text-sm">
                Precisamos confirmar que esse perfil é realmente seu
              </p>
            </div>

            {/* Code display */}
            <div className="bg-navy-800 rounded-xl p-4 mb-6 text-center border border-navy-700">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Seu código de verificação</p>
              <div className="text-2xl font-mono font-bold text-gold-500 mb-3">{code}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyCode}
                className="text-xs border-navy-700 bg-transparent text-platinum hover:bg-navy-700"
              >
                {copied ? "Copiado! ✓" : "📋 Copiar código"}
              </Button>
            </div>

            {/* Instructions */}
            <div className="space-y-3 mb-6">
              {[
                "Abra seu LinkedIn em outra aba",
                "Vá em Editar Perfil → Seção \"Sobre\"",
                "Adicione o código acima em qualquer lugar do texto",
                "Salve as alterações",
                "Volte aqui e clique em \"Verificar Agora\"",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-xs font-bold text-gold-500 shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-platinum">{text}</span>
                </div>
              ))}
            </div>

            {/* Error message */}
            {status === "failed" && (
              <p className="text-destructive text-sm text-center mb-4 animate-fade-in">
                Código não encontrado ainda. Aguarde 30 segundos e tente novamente.
              </p>
            )}

            {/* Verify button */}
            <Button
              onClick={verify}
              disabled={status === "checking" || attempts >= maxAttempts}
              className="w-full py-5 rounded-pill text-base font-semibold gold-gradient text-navy-950 
                hover:shadow-gold transition-all duration-200 border-0 disabled:opacity-50"
            >
              {status === "checking" ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                "✓ Verificar Agora"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-3">
              Tentativa {attempts + 1} de {maxAttempts}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
