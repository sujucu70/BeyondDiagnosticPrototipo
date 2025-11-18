import type { LucideIcon } from 'lucide-react';

export type TierKey = 'gold' | 'silver' | 'bronze';

export interface Tier {
  name: string;
  price: number;
  color: string;
  description: string;
  requirements: string;
  timeline: string;
  features?: string[];
}

export interface Field {
  name: string;
  type: string;
  example: string;
  critical: boolean;
}

export interface DataCategory {
  category: string;
  fields: Field[];
}

export interface DataRequirement {
  mandatory: DataCategory[];
  format: string;
  volumeMin: string;
}

export type TiersData = Record<TierKey, Tier>;
export type DataRequirementsData = Record<TierKey, DataRequirement>;

// --- Analysis Dashboard Types ---

export interface Kpi {
  label: string;
  value: string;
  change?: string; // e.g., '+5%' or '-10s'
  changeType?: 'positive' | 'negative' | 'neutral';
}

export interface DimensionAnalysis {
  id: string;
  title: string;
  score: number;
  summary: string;
  kpi: Kpi;
  // FIX: Added icon property to be used in UI components.
  icon: LucideIcon;
}

export interface HeatmapDataPoint {
  skill: string;
  metrics: {
    fcr: number;    // First Contact Resolution score (0-100)
    aht: number;    // Average Handle Time score (0-100, donde 100 es óptimo)
    csat: number;   // Customer Satisfaction score (0-100)
    quality: number; // Quality Assurance score (0-100)
  };
}

export interface Opportunity {
  id: string;
  name: string;
  impact: number;
  feasibility: number;
  savings: number;
  dimensionId: string;
}

export enum RoadmapPhase {
  Automate = 'Automate',
  Assist = 'Assist',
  Augment = 'Augment'
}

export interface RoadmapInitiative {
  id: string;
  name: string;
  phase: RoadmapPhase;
  timeline: string;
  investment: number;
  resources: string[];
  dimensionId: string;
}

export interface Finding {
  text: string;
  dimensionId: string;
}

export interface Recommendation {
  text: string;
  dimensionId: string;
}

export interface EconomicModelData {
    currentAnnualCost: number;
    futureAnnualCost: number;
    annualSavings: number;
    initialInvestment: number;
    paybackMonths: number;
    roi3yr: number;
    savingsBreakdown: { category: string; amount: number; percentage: number }[];
}

export interface BenchmarkDataPoint {
    kpi: string;
    userValue: number;
    userDisplay: string;
    industryValue: number;
    industryDisplay: string;
    percentile: number;
}

export interface AnalysisData {
  tier: TierKey;
  overallHealthScore: number;
  summaryKpis: Kpi[];
  dimensions: DimensionAnalysis[];
  keyFindings: Finding[];
  recommendations: Recommendation[];
  heatmap: HeatmapDataPoint[];
  opportunityMatrix: Opportunity[];
  roadmap: RoadmapInitiative[];
  economicModel: EconomicModelData;
  benchmarkReport: BenchmarkDataPoint[];
}
