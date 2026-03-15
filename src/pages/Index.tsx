import { useState, useCallback } from "react";
import AccessCodeScreen from "@/components/AccessCodeScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import QuestionnaireWizard from "@/components/questionnaire/QuestionnaireWizard";
import VerificationScreen from "@/components/VerificationScreen";
import AnalysisLoadingScreen from "@/components/AnalysisLoadingScreen";
import AnalysisReport from "@/components/report/AnalysisReport";
import MenteeDashboard from "@/components/dashboard/MenteeDashboard";
import ActionItems from "@/components/dashboard/ActionItems";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FlowState, getFlowState, setFlowState, setToken, resetApp } from "@/lib/app-store";
import { QuestionnaireData } from "@/lib/questionnaire-store";

export default function Index() {
  const [flow, setFlow] = useState<FlowState>(getFlowState);
  const [firstName, setFirstName] = useState("");
  const [dashTab, setDashTab] = useState("dashboard");

  const goTo = useCallback((state: FlowState) => {
    setFlowState(state);
    setFlow(state);
  }, []);

  const handleValidCode = (code: string) => {
    setToken(code);
    goTo("welcome");
  };

  const handleStartQuestionnaire = () => goTo("questionnaire");

  const handleQuestionnaireComplete = (data: QuestionnaireData) => {
    setFirstName(data.fullName.split(" ")[0]);
    goTo("verification");
  };

  const handleVerified = () => goTo("loading");
  const handleAnalysisComplete = () => goTo("report");

  const handleLogout = () => {
    resetApp();
    goTo("access_code");
  };

  // Dashboard view (after report)
  if (flow === "dashboard") {
    return (
      <DashboardLayout activeTab={dashTab} onTabChange={setDashTab} onLogout={handleLogout}>
        {dashTab === "dashboard" && <MenteeDashboard />}
        {dashTab === "report" && <AnalysisReport onViewActions={() => setDashTab("actions")} />}
        {dashTab === "actions" && <ActionItems />}
        {dashTab === "calendar" && (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">📅</span>
            <h2 className="text-xl font-bold text-foreground mb-2">Calendário Editorial</h2>
            <p className="text-muted-foreground">Complete sua análise para gerar o calendário</p>
          </div>
        )}
        {dashTab === "badges" && (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🏆</span>
            <h2 className="text-xl font-bold text-foreground mb-2">Conquistas</h2>
            <p className="text-muted-foreground">Continue suas ações para desbloquear conquistas</p>
          </div>
        )}
      </DashboardLayout>
    );
  }

  switch (flow) {
    case "access_code":
      return <AccessCodeScreen onValidCode={handleValidCode} />;
    case "welcome":
      return <WelcomeScreen firstName={firstName || "Profissional"} onStart={handleStartQuestionnaire} />;
    case "questionnaire":
      return <QuestionnaireWizard onComplete={handleQuestionnaireComplete} />;
    case "verification":
      return <VerificationScreen onVerified={handleVerified} />;
    case "loading":
      return <AnalysisLoadingScreen onComplete={handleAnalysisComplete} />;
    case "report":
      return (
        <div>
          <AnalysisReport onViewActions={() => goTo("dashboard")} />
          <div className="bg-surface p-6 text-center">
            <button onClick={() => goTo("dashboard")} className="text-sm text-gold-500 hover:underline font-semibold">
              Ir para o Dashboard →
            </button>
          </div>
        </div>
      );
    default:
      return <AccessCodeScreen onValidCode={handleValidCode} />;
  }
}
