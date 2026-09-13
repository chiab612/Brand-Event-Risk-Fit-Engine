export interface EventContext {
  id: string;
  title: string;
  type: string;
  targetIndustry: string;
  targetAudience: string;
  specialRequirements: string;
}

export interface ApplicantData {
  name: string;
  title: string;
  company: string;
  industry: string;
  bio: string;
  socialUrl: string;
  intent: string;
  pastEvents: string;
  relevance: string;
  isCommunityMember: boolean;
  notes: string;
}

export type RiskSeverity = "INFO" | "WARNING" | "HIGH_ATTENTION";

export interface TrustSignal {
  category: string;
  description: string;
}

export interface RiskSignal {
  severity: RiskSeverity;
  category: string;
  description: string;
}

export interface ValueDimension {
  dimension: string;
  explanation: string;
}

export type RecommendedActionType = 
  | "適合參與" 
  | "建議人工確認" 
  | "需要更多資料" 
  | "與本次活動關聯較低";

export interface OverallAssessment {
  eventFitScore: number;
  collaborationScore: number;
  riskLevel: "LOW" | "MODERATE" | "HIGH";
  recommendedAction: RecommendedActionType;
  executiveSummary: string;
  actionAdvice: string;
  suggestedQuestions: string[];
}

export interface EventFitAnalysis {
  rating: string;
  details: string;
  keyMatchPoints: string[];
}

export interface IntentAnalysis {
  clarity: string;
  alignment: string;
  details: string;
}

export interface ProfessionalRelevance {
  relevanceLevel: string;
  details: string;
  highlightSkills: string[];
}

export interface CollaborationValue {
  potentialValueLevel: string;
  details: string;
  valueDimensions: ValueDimension[];
}

export interface EvaluationResult {
  overallAssessment: OverallAssessment;
  eventFitAnalysis: EventFitAnalysis;
  intentAnalysis: IntentAnalysis;
  professionalRelevance: ProfessionalRelevance;
  trustSignals: TrustSignal[];
  riskSignals: RiskSignal[];
  collaborationValue: CollaborationValue;
}

export interface EvaluationRecord {
  id: string;
  createdAt: string;
  eventContext: EventContext;
  applicant: ApplicantData;
  result: EvaluationResult;
  manualStatus?: "UNREVIEWED" | "APPROVED" | "FLAGGED" | "DECLINED";
  manualNotes?: string;
}
