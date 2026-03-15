import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  firstName: string;
  onStart: () => void;
}

export default function WelcomeScreen({ firstName, onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb w-80 h-80 bg-gold-500 top-[10%] left-[5%]" />
      <div className="floating-orb w-64 h-64 bg-blue-500 bottom-[10%] right-[10%]" />
      <div className="floating-orb w-40 h-40 bg-gold-400 top-[60%] left-[60%]" />

      <div className="text-center max-w-2xl mx-4 animate-fade-in relative z-10">
        {/* Greeting */}
        <p className="text-gold-500 text-xl font-semibold mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Olá, {firstName || "Profissional"} 👋
        </p>

        {/* Main title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-platinum leading-tight mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Vamos transformar seu LinkedIn em{" "}
          <span className="text-gold-500">autoridade</span>
        </h1>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {["17 seções analisadas", "IA com visão", "Plano de 90 dias"].map((pill) => (
            <span
              key={pill}
              className="glass-card px-5 py-2.5 rounded-pill text-sm font-medium text-platinum"
            >
              {pill}
            </span>
          ))}
        </div>

        {/* Progress indicator */}
        <p className="text-muted-foreground text-sm mb-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          Passo 1 de 4 — Questionário Estratégico
        </p>

        {/* CTA */}
        <div className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <Button
            onClick={onStart}
            className="px-10 py-6 rounded-pill text-base font-semibold gold-gradient text-navy-950 
              hover:shadow-gold transition-all duration-200 border-0"
          >
            Começar Agora →
          </Button>
        </div>

        {/* Time estimate */}
        <p className="text-muted-foreground text-sm mt-6 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          ⏱ ~12 minutos para completar
        </p>
      </div>
    </div>
  );
}
