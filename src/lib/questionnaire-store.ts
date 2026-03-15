// Auto-save questionnaire state to localStorage

const STORAGE_KEY = "topvoice-questionnaire";

export interface QuestionnaireData {
  currentStep: number;
  fullName: string;
  role: string;
  company: string;
  segment: string;
  yearsExperience: number;
  professionalDescription: string;
  mainGoal: string;
  timeline: string;
  goalMeaning: string;
  objectives: string[];
  references: string[];
  linkedinSelfAssessment: string;
  postFrequency: string;
  contentTypes: string[];
  challenges: string[];
  achievements: string;
  insecurity: string;
  linkedinUrl: string;
  profileLanguage: string;
  creatorMode: string;
  hasNewsletter: string;
}

const defaultData: QuestionnaireData = {
  currentStep: 1,
  fullName: "",
  role: "",
  company: "",
  segment: "",
  yearsExperience: 5,
  professionalDescription: "",
  mainGoal: "",
  timeline: "",
  goalMeaning: "",
  objectives: [],
  references: ["", "", ""],
  linkedinSelfAssessment: "",
  postFrequency: "",
  contentTypes: [],
  challenges: [],
  achievements: "",
  insecurity: "",
  linkedinUrl: "",
  profileLanguage: "",
  creatorMode: "",
  hasNewsletter: "",
};

export function loadQuestionnaire(): QuestionnaireData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultData, ...JSON.parse(stored) };
  } catch {}
  return { ...defaultData };
}

export function saveQuestionnaire(data: QuestionnaireData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function clearQuestionnaire() {
  localStorage.removeItem(STORAGE_KEY);
}
