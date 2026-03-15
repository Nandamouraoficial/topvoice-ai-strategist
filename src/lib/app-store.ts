// Simple app-level state management via localStorage

const TOKEN_KEY = "topvoice-token";
const TOKEN_DATA_KEY = "topvoice-token-data";
const FLOW_KEY = "topvoice-flow-state";
const USER_ID_KEY = "topvoice-user-id";
const QUESTIONNAIRE_ID_KEY = "topvoice-questionnaire-id";
const LINKEDIN_DATA_ID_KEY = "topvoice-linkedin-data-id";
const ANALYSIS_ID_KEY = "topvoice-analysis-id";
const VERIFICATION_CODE_KEY = "topvoice-verification-code";

export type FlowState = 
  | "access_code"
  | "welcome"
  | "questionnaire"
  | "verification"
  | "loading"
  | "report"
  | "dashboard";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getTokenData(): { id: string; code: string; mentee_name: string } | null {
  try {
    const d = localStorage.getItem(TOKEN_DATA_KEY);
    return d ? JSON.parse(d) : null;
  } catch { return null; }
}

export function setTokenData(data: { id: string; code: string; mentee_name: string }) {
  localStorage.setItem(TOKEN_DATA_KEY, JSON.stringify(data));
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_DATA_KEY);
}

export function getFlowState(): FlowState {
  return (localStorage.getItem(FLOW_KEY) as FlowState) || "access_code";
}

export function setFlowState(state: FlowState) {
  localStorage.setItem(FLOW_KEY, state);
}

export function getUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

export function setUserId(id: string) {
  localStorage.setItem(USER_ID_KEY, id);
}

export function getQuestionnaireId(): string | null {
  return localStorage.getItem(QUESTIONNAIRE_ID_KEY);
}

export function setQuestionnaireId(id: string) {
  localStorage.setItem(QUESTIONNAIRE_ID_KEY, id);
}

export function getLinkedinDataId(): string | null {
  return localStorage.getItem(LINKEDIN_DATA_ID_KEY);
}

export function setLinkedinDataId(id: string) {
  localStorage.setItem(LINKEDIN_DATA_ID_KEY, id);
}

export function getAnalysisId(): string | null {
  return localStorage.getItem(ANALYSIS_ID_KEY);
}

export function setAnalysisId(id: string) {
  localStorage.setItem(ANALYSIS_ID_KEY, id);
}

export function getVerificationCode(): string | null {
  return localStorage.getItem(VERIFICATION_CODE_KEY);
}

export function setVerificationCode(code: string) {
  localStorage.setItem(VERIFICATION_CODE_KEY, code);
}

export function resetApp() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_DATA_KEY);
  localStorage.removeItem(FLOW_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(QUESTIONNAIRE_ID_KEY);
  localStorage.removeItem(LINKEDIN_DATA_ID_KEY);
  localStorage.removeItem(ANALYSIS_ID_KEY);
  localStorage.removeItem(VERIFICATION_CODE_KEY);
  localStorage.removeItem("topvoice-questionnaire");
}
