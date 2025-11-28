export interface TranscriptSegment {
  speaker: string;
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: string;
}

export interface SentimentPoint {
  timeOffset: number; // in seconds
  score: number; // 0 to 100
  label: string; // e.g., "Intro", "Discovery", "Closing"
}

export interface CoachingData {
  strengths: string[];
  missedOpportunities: string[];
  summary: string;
  teachingMoments: string[];
}

export interface CompetitorMention {
  name: string;
  timestamp: string;
  context: string;
}

export interface Objection {
  objection: string;
  timestamp: string;
  severity: 'High' | 'Medium' | 'Low';
  response: string; // How the rep handled it
}

export interface RedFlag {
  flag: string;
  timestamp: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  context: string;
}

export interface BehavioralMetrics {
  talkTimeSec: number;
  listenTimeSec: number;
  talkToListenRatio: number; // e.g. 0.65
  interruptions: number;
  speakingRateWpm: number;
  confidenceToneScore: number; // 0-100
}

export interface MicroScores {
  discoveryScore: number;
  objectionHandlingScore: number;
  productMatchScore: number;
  technicalAccuracyScore: number;
  complianceScore: number;
}

export interface IndustrySpecifics {
  industryName: string;
  painPointsDetected: string[];
  buyingSignals: string[];
  productsDiscussed: string[];
  customFields?: Record<string, string | number | boolean>;
}

export interface DerivedScores {
  overallScore: number;
  weightedBreakdown: {
    engagement: number;
    skills: number;
    outcome: number;
  };
}

export interface AnalysisResult {
  transcript: TranscriptSegment[];
  sentimentGraph: SentimentPoint[];
  coaching: CoachingData;
  competitors: CompetitorMention[];
  objections: Objection[];
  redFlags: RedFlag[];
  nextSteps: string[];
  
  // New fields
  behavioral: BehavioralMetrics;
  microScores: MicroScores;
  industryAnalysis: IndustrySpecifics;
  callMetadata: {
    durationSec: number;
    language: string;
    detectedIndustry: string;
  };
  modelCallScore: number; // The score suggested by Gemini
  derivedScores?: DerivedScores; // Calculated by server heuristics
  trainingSuggested: {
    modules: string[];
    reason: string;
  };
}

export interface AppState {
  status: 'idle' | 'ready' | 'analyzing' | 'complete' | 'error';
  data: AnalysisResult | null;
  error: string | null;
  mediaUrl: string | null;
  mimeType: string | null;
  fileName: string | null;
  
  // User Configuration
  customInstructions: string;
  industryName: string;
  industryExamples: string;
}