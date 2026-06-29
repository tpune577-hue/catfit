export type FindingCategory =
  | "obesity"
  | "overweight"
  | "hyperlipidemia"
  | "prediabetes"
  | "hypertension"
  | "metabolic_syndrome"
  | "low_fitness"
  | "vaccination"
  | "normal";

export type FindingSeverity = "normal" | "borderline" | "high";

export interface HealthFinding {
  id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  label: string;
  value: number;
  unit: string;
  normalRange: string;
  recommendation: string;
}

export interface LabResults {
  fastingGlucose?: number;
  totalCholesterol?: number;
  hdl?: number;
  ldl?: number;
  triglycerides?: number;
  bun?: number;
  creatinine?: number;
  uricAcid?: number;
}

export interface HealthReport {
  id: string;
  source: "pdf" | "manual";
  uploadedAt: string;
  examDate?: string;
  name?: string;
  age?: number;
  gender?: "male" | "female";
  height?: number;
  weight?: number;
  bmi?: number;
  waist?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  pulse?: number;
  labs: LabResults;
  sedentary?: boolean;
  familyDiabetesHistory?: boolean;
  doctorRecommendations?: string[];
  rawText?: string;
}

export interface HealthAnalysis {
  findings: HealthFinding[];
  priorityGoals: string[];
  healthFocusAreas: string[];
  dietaryRestrictions: string[];
  summary: string;
}
