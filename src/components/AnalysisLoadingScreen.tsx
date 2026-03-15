import { useState, useEffect } from "react";
import { LOADING_MESSAGES } from "@/lib/mock-data";

interface AnalysisLoadingScreenProps {
  onComplete: () => void;
}

export default function AnalysisLoadingScreen({ onComplete }: AnalysisLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const duration = 8000; // 8 seconds total
    const interval = 50;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center relative overflow-hidden">
      <div className="floating-orb w-80 h-80 bg-gold-500 top-[10%] right-[10%]" />
      <div className="floating-orb w-64 h-64 bg-blue-500 bottom-[20%] left-[15%]" />

      <div className="text-center relative z-10 max-w-md mx-4">
        {/* Logo pulse */}
        <div className="mb-8 inline-flex items-center gap-2 animate-pulse-slow">
          <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center text-xl font-bold text-navy-950">
            TV
          </div>
        </div>

        {/* Circular progress */}
        <div className="relative w-36 h-36 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke="hsl(213 40% 22%)"
              strokeWidth="6"
            />
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-100 ease-linear"
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(37 91% 55%)" />
                <stop offset="100%" stopColor="hsl(37 88% 63%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-extrabold text-gold-500">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Loading message */}
        <p className="text-platinum text-base mb-4 h-6 animate-fade-in" key={messageIndex}>
          {LOADING_MESSAGES[messageIndex]}
        </p>

        <p className="text-muted-foreground text-sm">
          ⏱ ~60 segundos
        </p>
      </div>
    </div>
  );
}
