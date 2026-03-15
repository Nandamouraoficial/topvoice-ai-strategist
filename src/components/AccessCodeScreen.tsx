import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AccessCodeScreenProps {
  onValidCode: (code: string) => void;
}

// Mock validation - accepts any TVA-XXXX format
const validateCode = (code: string): "valid" | "invalid" | "used" => {
  if (code === "TVA-USED000000") return "used";
  if (/^TVA-[A-Z0-9]{12}$/i.test(code)) return "valid";
  if (/^TVA-[A-Z0-9]{6,}$/i.test(code)) return "valid"; // lenient for testing
  return "invalid";
};

export default function AccessCodeScreen({ onValidCode }: AccessCodeScreenProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const [validating, setValidating] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setValidating(true);

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));

    const result = validateCode(code.trim().toUpperCase());

    if (result === "valid") {
      onValidCode(code.trim().toUpperCase());
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      if (result === "used") {
        setError("Este código já foi utilizado. Entre em contato com Fernanda para um novo acesso.");
      } else {
        setError("Código inválido. Verifique e tente novamente.");
      }
    }

    setValidating(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb w-96 h-96 bg-gold-500 top-[-10%] left-[-10%]" />
      <div className="floating-orb w-72 h-72 bg-blue-500 bottom-[-5%] right-[-5%]" />
      <div className="floating-orb w-48 h-48 bg-gold-400 top-[40%] right-[20%]" />

      <div className={`glass-card rounded-2xl p-10 max-w-md w-full mx-4 animate-scale-in ${shaking ? "animate-shake" : ""}`}>
        {/* Logo */}
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

        {/* Code input */}
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
            <p className="text-destructive text-sm mt-3 text-center animate-fade-in">
              {error}
            </p>
          )}
        </div>

        {/* CTA */}
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

        {/* Help link */}
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
