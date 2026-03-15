// Simple app-level state management via localStorage

const TOKEN_KEY = "topvoice-token";
const FLOW_KEY = "topvoice-flow-state";

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

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getFlowState(): FlowState {
  return (localStorage.getItem(FLOW_KEY) as FlowState) || "access_code";
}

export function setFlowState(state: FlowState) {
  localStorage.setItem(FLOW_KEY, state);
}

export function resetApp() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(FLOW_KEY);
  localStorage.removeItem("topvoice-questionnaire");
}
