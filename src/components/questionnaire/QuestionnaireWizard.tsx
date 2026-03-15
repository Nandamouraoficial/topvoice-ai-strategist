import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { QuestionnaireData, loadQuestionnaire, saveQuestionnaire } from "@/lib/questionnaire-store";
import { SEGMENTS, OBJECTIVES, LINKEDIN_LEVELS, POST_FREQUENCIES, CONTENT_TYPES, CHALLENGES, TIMELINES } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import { getTokenData, setUserId, setQuestionnaireId } from "@/lib/app-store";

interface QuestionnaireWizardProps {
  onComplete: (data: QuestionnaireData) => void;
}

const TOTAL_STEPS = 21;

export default function QuestionnaireWizard({ onComplete }: QuestionnaireWizardProps) {
  const [data, setData] = useState<QuestionnaireData>(loadQuestionnaire);
  const [saving, setSaving] = useState(false);

  const update = useCallback((partial: Partial<QuestionnaireData>) => {
    setData((prev) => {
      const next = { ...prev, ...partial };
      saveQuestionnaire(next);
      return next;
    });
  }, []);

  const step = data.currentStep;
  const setStep = (s: number) => update({ currentStep: s });

  const canNext = (): boolean => {
    switch (step) {
      case 1: return data.fullName.trim().length > 2;
      case 2: return data.role.trim().length > 0 && data.company.trim().length > 0;
      case 3: return data.segment.length > 0;
      case 4: return true;
      case 5: return data.professionalDescription.length >= 100;
      case 6: return data.mainGoal.length >= 50;
      case 7: return data.timeline.length > 0;
      case 8: return data.goalMeaning.trim().length > 10;
      case 9: return data.objectives.length > 0;
      case 10: return true;
      case 11: return data.linkedinSelfAssessment.length > 0;
      case 12: return data.postFrequency.length > 0;
      case 13: return data.contentTypes.length > 0;
      case 14: return data.challenges.length > 0;
      case 15: return true;
      case 16: return true;
      case 17: return /linkedin\.com\/in\//.test(data.linkedinUrl);
      case 18: return data.profileLanguage.length > 0;
      case 19: return data.creatorMode.length > 0;
      case 20: return data.hasNewsletter.length > 0;
      case 21: return true;
      default: return false;
    }
  };

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const blockLabel = () => {
    if (step <= 5) return "SOBRE VOCÊ";
    if (step <= 10) return "SEUS OBJETIVOS";
    if (step <= 16) return "SEU LINKEDIN HOJE";
    if (step <= 20) return "SEU LINKEDIN";
    return "CONFIRMAÇÃO";
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const tokenData = getTokenData();
      const firstName = data.fullName.split(" ")[0];

      // Insert user
      const { data: user, error: userError } = await supabase
        .from("users")
        .insert({
          name: data.fullName,
          first_name: firstName,
          email: "",
          segment: data.segment,
          token_id: tokenData?.id || null,
        })
        .select("id")
        .single();

      if (userError) throw userError;

      setUserId(user.id);

      // Insert questionnaire responses
      const { data: qr, error: qrError } = await supabase
        .from("questionnaire_responses")
        .insert({
          user_id: user.id,
          full_name: data.fullName,
          role_title: data.role,
          current_company: data.company,
          segment: data.segment,
          experience_years: data.yearsExperience,
          professional_description: data.professionalDescription,
          main_goal: data.mainGoal,
          goal_timeline: data.timeline,
          goal_meaning: data.goalMeaning,
          goal_categories: data.objectives,
          reference_voices: data.references.filter(Boolean),
          linkedin_self_assessment: data.linkedinSelfAssessment,
          posting_frequency: data.postFrequency,
          content_types: data.contentTypes,
          challenges: data.challenges,
          achievements_text: data.achievements,
          digital_insecurity: data.insecurity,
          linkedin_url: data.linkedinUrl,
          profile_language: data.profileLanguage,
          creator_mode: data.creatorMode,
          has_newsletter: data.hasNewsletter,
          all_answers_json: data as any,
        })
        .select("id")
        .single();

      if (qrError) throw qrError;

      setQuestionnaireId(qr.id);
      onComplete(data);
    } catch (err) {
      console.error("Error saving questionnaire:", err);
      alert("Erro ao salvar suas respostas. Tente novamente.");
    }
    setSaving(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <QuestionWrapper label={blockLabel()} question="Qual é o seu nome completo?">
            <input type="text" value={data.fullName} onChange={(e) => update({ fullName: e.target.value })}
              placeholder="Ex: Ana Carolina Ferreira" className="question-input" autoFocus />
          </QuestionWrapper>
        );
      case 2:
        return (
          <QuestionWrapper label={blockLabel()} question="Qual é o seu cargo e empresa atual?">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={data.role} onChange={(e) => update({ role: e.target.value })}
                placeholder="Cargo" className="question-input" autoFocus />
              <input type="text" value={data.company} onChange={(e) => update({ company: e.target.value })}
                placeholder="Empresa" className="question-input" />
            </div>
          </QuestionWrapper>
        );
      case 3:
        return (
          <QuestionWrapper label={blockLabel()} question="Em qual segmento você atua?">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SEGMENTS.map((s) => (
                <button key={s.label} onClick={() => update({ segment: s.label })}
                  className={`p-4 rounded-xl text-left transition-all duration-200 border-2
                    ${data.segment === s.label ? "border-gold-500 bg-gold-500/10 text-gold-500" : "border-navy-700 bg-navy-800 text-platinum hover:border-navy-700/80"}`}>
                  <span className="text-xl mr-2">{s.icon}</span>
                  <span className="text-sm font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          </QuestionWrapper>
        );
      case 4:
        return (
          <QuestionWrapper label={blockLabel()} question="Há quantos anos você está no mercado?">
            <div className="text-center">
              <div className="text-6xl font-extrabold text-gold-500 mb-6">{data.yearsExperience}</div>
              <input type="range" min={1} max={30} value={data.yearsExperience}
                onChange={(e) => update({ yearsExperience: Number(e.target.value) })}
                className="w-full h-2 rounded-full appearance-none bg-navy-700 
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-500 [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-gold" />
              <div className="flex justify-between text-muted-foreground text-xs mt-2">
                <span>1 ano</span><span>30+ anos</span>
              </div>
            </div>
          </QuestionWrapper>
        );
      case 5:
        return (
          <QuestionWrapper label={blockLabel()} question="Como você se descreveria profissionalmente hoje?">
            <textarea value={data.professionalDescription} onChange={(e) => update({ professionalDescription: e.target.value })}
              placeholder="Conte um pouco sobre sua trajetória, o que você já construiu e onde está agora..."
              className="question-input min-h-[160px] resize-none" />
            <CharCount current={data.professionalDescription.length} min={100} />
          </QuestionWrapper>
        );
      case 6:
        return (
          <QuestionWrapper label={blockLabel()} question="Qual é o seu grande objetivo profissional?">
            <textarea value={data.mainGoal} onChange={(e) => update({ mainGoal: e.target.value })}
              placeholder="Seja específico. O que você quer que aconteça na sua carreira nos próximos anos?"
              className="question-input min-h-[160px] resize-none" autoFocus />
            <CharCount current={data.mainGoal.length} min={50} />
          </QuestionWrapper>
        );
      case 7:
        return (
          <QuestionWrapper label={blockLabel()} question="Em quanto tempo você quer alcançar esse objetivo?">
            <div className="flex flex-wrap gap-3">
              {TIMELINES.map((t) => (
                <button key={t} onClick={() => update({ timeline: t })}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 border-2
                    ${data.timeline === t ? "border-gold-500 bg-gold-500/10 text-gold-500" : "border-navy-700 bg-navy-800 text-platinum hover:border-navy-700/80"}`}>
                  {data.timeline === t && "✓ "}{t}
                </button>
              ))}
            </div>
          </QuestionWrapper>
        );
      case 8:
        return (
          <QuestionWrapper label={blockLabel()} question="O que alcançar esse objetivo significa para você?">
            <textarea value={data.goalMeaning} onChange={(e) => update({ goalMeaning: e.target.value })}
              placeholder="Por que isso importa de verdade na sua vida?"
              className="question-input min-h-[140px] resize-none" autoFocus />
          </QuestionWrapper>
        );
      case 9:
        return (
          <QuestionWrapper label={blockLabel()} question="Selecione todos que se aplicam ao seu objetivo:">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {OBJECTIVES.map((o) => (
                <button key={o.label} onClick={() => update({ objectives: toggleArray(data.objectives, o.label) })}
                  className={`p-4 rounded-xl text-left transition-all duration-200 border-2
                    ${data.objectives.includes(o.label) ? "border-gold-500 bg-gold-500/10 text-gold-500" : "border-navy-700 bg-navy-800 text-platinum hover:border-navy-700/80"}`}>
                  <span className="text-xl mr-2">{o.icon}</span>
                  <span className="text-sm font-medium">{o.label}</span>
                </button>
              ))}
            </div>
          </QuestionWrapper>
        );
      case 10:
        return (
          <QuestionWrapper label={blockLabel()} question="Quem são as 3 referências de Top Voice que você admira?">
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Referência {i + 1}
                  </label>
                  <input type="text" value={data.references[i] || ""}
                    onChange={(e) => { const refs = [...data.references]; refs[i] = e.target.value; update({ references: refs }); }}
                    placeholder="Nome ou URL do LinkedIn" className="question-input" />
                </div>
              ))}
              <p className="text-muted-foreground text-xs">A IA vai comparar seu perfil com o posicionamento deles</p>
            </div>
          </QuestionWrapper>
        );
      case 11:
        return (
          <QuestionWrapper label={blockLabel()} question="Como você avalia seu LinkedIn hoje?">
            <div className="space-y-3">
              {LINKEDIN_LEVELS.map((l) => (
                <button key={l.label} onClick={() => update({ linkedinSelfAssessment: l.label })}
                  className={`w-full p-5 rounded-xl text-left transition-all duration-200 border-2
                    ${data.linkedinSelfAssessment === l.label ? "border-gold-500 bg-gold-500/10" : "border-navy-700 bg-navy-800 hover:border-navy-700/80"}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{l.icon}</span>
                    <div>
                      <div className={`font-semibold ${data.linkedinSelfAssessment === l.label ? "text-gold-500" : "text-platinum"}`}>{l.label}</div>
                      <div className="text-sm text-muted-foreground">{l.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </QuestionWrapper>
        );
      case 12:
        return (
          <QuestionWrapper label={blockLabel()} question="Com que frequência você posta conteúdo no LinkedIn?">
            <div className="flex flex-wrap gap-3">
              {POST_FREQUENCIES.map((f) => (
                <button key={f} onClick={() => update({ postFrequency: f })}
                  className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2
                    ${data.postFrequency === f ? "border-gold-500 bg-gold-500/10 text-gold-500" : "border-navy-700 bg-navy-800 text-platinum hover:border-navy-700/80"}`}>
                  {f}
                </button>
              ))}
            </div>
          </QuestionWrapper>
        );
      case 13:
        return (
          <QuestionWrapper label={blockLabel()} question="Que tipo de conteúdo você costuma postar?">
            <div className="flex flex-wrap gap-3">
              {CONTENT_TYPES.map((t) => (
                <button key={t} onClick={() => update({ contentTypes: toggleArray(data.contentTypes, t) })}
                  className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2
                    ${data.contentTypes.includes(t) ? "border-gold-500 bg-gold-500/10 text-gold-500" : "border-navy-700 bg-navy-800 text-platinum hover:border-navy-700/80"}`}>
                  {t}
                </button>
              ))}
            </div>
          </QuestionWrapper>
        );
      case 14:
        return (
          <QuestionWrapper label={blockLabel()} question="Qual é o seu maior desafio no LinkedIn hoje?">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CHALLENGES.map((c) => (
                <button key={c} onClick={() => update({ challenges: toggleArray(data.challenges, c) })}
                  className={`p-4 rounded-xl text-left text-sm transition-all duration-200 border-2
                    ${data.challenges.includes(c) ? "border-gold-500 bg-gold-500/10 text-gold-500" : "border-navy-700 bg-navy-800 text-platinum hover:border-navy-700/80"}`}>
                  {c}
                </button>
              ))}
            </div>
          </QuestionWrapper>
        );
      case 15:
        return (
          <QuestionWrapper label={blockLabel()} question="Você tem conquistas, prêmios ou resultados que se orgulha mas ainda não destaca bem no LinkedIn?">
            <textarea value={data.achievements} onChange={(e) => update({ achievements: e.target.value })}
              placeholder="Pode ser premiações, projetos, cases, números que você entregou, reconhecimentos..."
              className="question-input min-h-[140px] resize-none" autoFocus />
          </QuestionWrapper>
        );
      case 16:
        return (
          <QuestionWrapper label={blockLabel()} question="Qual é a sua maior insegurança em relação à sua presença digital hoje?">
            <textarea value={data.insecurity} onChange={(e) => update({ insecurity: e.target.value })}
              placeholder="Seja honesto — quanto mais você compartilhar, mais precisa será a estratégia"
              className="question-input min-h-[140px] resize-none" autoFocus />
          </QuestionWrapper>
        );
      case 17:
        return (
          <QuestionWrapper label={blockLabel()} question="Cole a URL do seu perfil do LinkedIn:">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-lg">🔗</span>
              <input type="url" value={data.linkedinUrl} onChange={(e) => update({ linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/seuperfil" className="question-input pl-12" autoFocus />
            </div>
            {data.linkedinUrl && (
              <p className={`text-sm mt-2 ${/linkedin\.com\/in\//.test(data.linkedinUrl) ? "text-success" : "text-destructive"}`}>
                {/linkedin\.com\/in\//.test(data.linkedinUrl) ? "URL válida ✓" : "Verifique a URL e tente novamente"}
              </p>
            )}
          </QuestionWrapper>
        );
      case 18:
        return (
          <QuestionWrapper label={blockLabel()} question="Seu perfil está em qual idioma principal?">
            <div className="flex flex-wrap gap-3">
              {["Português", "Inglês", "Espanhol", "Outro"].map((l) => (
                <button key={l} onClick={() => update({ profileLanguage: l })}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 border-2
                    ${data.profileLanguage === l ? "border-gold-500 bg-gold-500/10 text-gold-500" : "border-navy-700 bg-navy-800 text-platinum hover:border-navy-700/80"}`}>
                  {l}
                </button>
              ))}
            </div>
          </QuestionWrapper>
        );
      case 19:
        return (
          <QuestionWrapper label={blockLabel()} question="Você tem Creator Mode ativado?">
            <div className="space-y-3">
              {["Sim ✓", "Não", "Não sei o que é"].map((opt) => (
                <button key={opt} onClick={() => update({ creatorMode: opt })}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all duration-200 border-2
                    ${data.creatorMode === opt ? "border-gold-500 bg-gold-500/10 text-gold-500" : "border-navy-700 bg-navy-800 text-platinum hover:border-navy-700/80"}`}>
                  {opt}
                </button>
              ))}
              <p className="text-muted-foreground text-xs mt-2">💡 Creator Mode aumenta sua visibilidade e libera ferramentas exclusivas de crescimento</p>
            </div>
          </QuestionWrapper>
        );
      case 20:
        return (
          <QuestionWrapper label={blockLabel()} question="Você tem Newsletter no LinkedIn?">
            <div className="space-y-3">
              {["Sim, ativa", "Sim, mas inativa", "Não, mas quero criar", "Não"].map((opt) => (
                <button key={opt} onClick={() => update({ hasNewsletter: opt })}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all duration-200 border-2
                    ${data.hasNewsletter === opt ? "border-gold-500 bg-gold-500/10 text-gold-500" : "border-navy-700 bg-navy-800 text-platinum hover:border-navy-700/80"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </QuestionWrapper>
        );
      case 21:
        return (
          <div className="glass-card rounded-2xl p-8 max-w-xl mx-auto animate-scale-in">
            <h2 className="text-2xl font-bold text-platinum mb-6">
              Vamos analisar o LinkedIn de <span className="text-gold-500">{data.fullName}</span>
            </h2>
            <div className="space-y-4 mb-8">
              <SummaryRow label="Objetivo" value={data.mainGoal.slice(0, 80) + (data.mainGoal.length > 80 ? "..." : "")} />
              <SummaryRow label="Prazo" value={data.timeline} />
              <SummaryRow label="Segmento" value={data.segment} />
              <SummaryRow label="LinkedIn" value={data.linkedinUrl} />
            </div>
            <Button onClick={handleComplete} disabled={saving}
              className="w-full py-6 rounded-pill text-base font-semibold gold-gradient text-navy-950 
                hover:shadow-gold transition-all duration-200 border-0">
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
                  Salvando...
                </span>
              ) : "Iniciar Análise Completa →"}
            </Button>
            <p className="text-muted-foreground text-xs text-center mt-4">⚡ Análise completa em aproximadamente 60 segundos</p>
            <p className="text-muted-foreground text-xs text-center mt-1">🔐 Vamos verificar que o perfil é seu antes de analisar</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-navy-800">
          <div className="h-full gold-gradient transition-all duration-500 ease-out" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>
      </div>
      <div className="pt-6 pb-2 text-center">
        <span className="text-sm text-muted-foreground">{step} de {TOTAL_STEPS - 1}</span>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl animate-fade-in" key={step}>{renderStep()}</div>
      </div>
      {step < 21 && (
        <div className="p-4 flex justify-between max-w-2xl mx-auto w-full">
          <Button variant="ghost" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
            className="text-muted-foreground hover:text-platinum">← Voltar</Button>
          <Button onClick={() => setStep(step + 1)} disabled={!canNext()}
            className="px-8 rounded-pill gold-gradient text-navy-950 font-semibold hover:shadow-gold border-0 disabled:opacity-40">
            Próximo →
          </Button>
        </div>
      )}
    </div>
  );
}

function QuestionWrapper({ label, question, children }: { label: string; question: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-[2px] text-gold-500 mb-3">{label}</div>
      <h2 className="text-xl md:text-2xl font-bold text-platinum mb-6">{question}</h2>
      {children}
    </div>
  );
}

function CharCount({ current, min }: { current: number; min: number }) {
  return (
    <p className={`text-xs mt-2 ${current >= min ? "text-success" : "text-muted-foreground"}`}>
      {current}/{min} caracteres {current >= min ? "✓" : `(mínimo ${min})`}
    </p>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground min-w-[80px]">{label}</span>
      <span className="text-sm text-platinum">{value}</span>
    </div>
  );
}
