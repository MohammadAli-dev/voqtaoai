import { GoogleGenAI, Type, Schema, GenerateContentResponse } from "@google/genai";
import { AnalysisResult, DerivedScores, MicroScores } from "../types";

const API_KEY = process.env.API_KEY || '';

// --- Configuration & Constants ---

const MIN_AUDIO_SIZE_BYTES = 3000; // ~3KB, filter out empty/corrupt files

const SUPPORTED_MIME_TYPES: Record<string, string> = {
  'wav': 'audio/wav',
  'mp3': 'audio/mpeg',
  'm4a': 'audio/mp4',
  'mp4': 'audio/mp4',
  'aac': 'audio/aac',
  'flac': 'audio/flac',
  'ogg': 'audio/ogg',
  'opus': 'audio/opus',
  'webm': 'audio/webm',
  'amr': 'audio/amr',
  '3gp': 'audio/3gpp'
};

export class AIServiceError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class GeminiParseError extends Error {
  constructor(message: string, public rawText?: string) {
    super(message);
    this.name = 'GeminiParseError';
  }
}

// --- Schema Definition ---

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    transcript: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: { type: Type.STRING },
          text: { type: Type.STRING },
          sentiment: { type: Type.STRING, enum: ["positive", "neutral", "negative"] },
          timestamp: { type: Type.STRING },
        },
        required: ["speaker", "text", "sentiment", "timestamp"],
      },
    },
    sentimentGraph: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          timeOffset: { type: Type.NUMBER },
          score: { type: Type.NUMBER },
          label: { type: Type.STRING },
        },
        required: ["timeOffset", "score", "label"],
      },
    },
    coaching: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        missedOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        summary: { type: Type.STRING },
        teachingMoments: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["strengths", "missedOpportunities", "summary", "teachingMoments"],
    },
    competitors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          timestamp: { type: Type.STRING },
          context: { type: Type.STRING },
        },
        required: ["name", "timestamp", "context"],
      },
    },
    objections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          objection: { type: Type.STRING },
          timestamp: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          response: { type: Type.STRING },
        },
        required: ["objection", "timestamp", "severity", "response"],
      },
    },
    redFlags: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          flag: { type: Type.STRING },
          timestamp: { type: Type.STRING },
          riskLevel: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          context: { type: Type.STRING },
        },
        required: ["flag", "timestamp", "riskLevel", "context"],
      },
    },
    nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
    behavioral: {
      type: Type.OBJECT,
      properties: {
        talkTimeSec: { type: Type.NUMBER },
        listenTimeSec: { type: Type.NUMBER },
        talkToListenRatio: { type: Type.NUMBER },
        interruptions: { type: Type.NUMBER },
        speakingRateWpm: { type: Type.NUMBER },
        confidenceToneScore: { type: Type.NUMBER },
      },
      required: ["talkTimeSec", "listenTimeSec", "talkToListenRatio", "interruptions", "speakingRateWpm", "confidenceToneScore"],
    },
    microScores: {
      type: Type.OBJECT,
      properties: {
        discoveryScore: { type: Type.NUMBER },
        objectionHandlingScore: { type: Type.NUMBER },
        productMatchScore: { type: Type.NUMBER },
        technicalAccuracyScore: { type: Type.NUMBER },
        complianceScore: { type: Type.NUMBER },
      },
      required: ["discoveryScore", "objectionHandlingScore", "productMatchScore", "technicalAccuracyScore", "complianceScore"],
    },
    industryAnalysis: {
      type: Type.OBJECT,
      properties: {
        industryName: { type: Type.STRING },
        painPointsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
        buyingSignals: { type: Type.ARRAY, items: { type: Type.STRING } },
        productsDiscussed: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["industryName", "painPointsDetected", "buyingSignals", "productsDiscussed"],
    },
    callMetadata: {
      type: Type.OBJECT,
      properties: {
        durationSec: { type: Type.NUMBER },
        language: { type: Type.STRING },
        detectedIndustry: { type: Type.STRING },
      },
      required: ["durationSec", "language", "detectedIndustry"],
    },
    modelCallScore: { type: Type.NUMBER },
    trainingSuggested: {
      type: Type.OBJECT,
      properties: {
        modules: { type: Type.ARRAY, items: { type: Type.STRING } },
        reason: { type: Type.STRING },
      },
      required: ["modules", "reason"],
    },
  },
  required: [
    "transcript", "sentimentGraph", "coaching", "competitors", "objections", 
    "redFlags", "nextSteps", "behavioral", "microScores", "industryAnalysis", 
    "callMetadata", "modelCallScore", "trainingSuggested"
  ],
};

// --- Helper Functions ---

export const getMimeTypeFromFilename = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return SUPPORTED_MIME_TYPES[ext] || 'audio/*';
};

/**
 * Calculates a deterministic derived score based on model micro-scores.
 * This ensures standardization across the platform regardless of model hallucinations on the main score.
 */
const calculateDerivedScores = (micro: MicroScores, modelScore: number): DerivedScores => {
  // Heuristic Weights
  const wDiscovery = 0.25;
  const wObjection = 0.25;
  const wCompliance = 0.20;
  const wTechnical = 0.15;
  const wProduct = 0.15;

  const skillsScore = 
    (micro.discoveryScore * wDiscovery) + 
    (micro.objectionHandlingScore * wObjection) + 
    (micro.technicalAccuracyScore * wTechnical) +
    (micro.productMatchScore * wProduct) +
    (micro.complianceScore * wCompliance);

  // Blend model's holistic score (40%) with our rigid rubric (60%)
  const overall = Math.round((skillsScore * 0.6) + (modelScore * 0.4));

  return {
    overallScore: Math.min(100, Math.max(0, overall)),
    weightedBreakdown: {
      engagement: Math.round(micro.discoveryScore), // Proxy for engagement
      skills: Math.round(skillsScore),
      outcome: Math.round(modelScore), // Proxy for outcome/feeling
    }
  };
};

export interface AnalyzeOptions {
  fileName?: string;
  industryName?: string;
  industryExamples?: string;
  customInstructions?: string;
}

// --- Main Service ---

export const analyzeSalesCall = async (
  base64Data: string, 
  inputMimeType: string, 
  options: AnalyzeOptions = {}
): Promise<AnalysisResult> => {
  
  if (!API_KEY) {
    throw new AIServiceError("API Key is missing. Check environment variables.");
  }

  // 1. Input Validation
  if (base64Data.length < MIN_AUDIO_SIZE_BYTES) {
    throw new AIServiceError("Audio file is too short or empty.");
  }

  let finalMimeType = inputMimeType;
  if (inputMimeType === 'audio/*' || !inputMimeType) {
    if (options.fileName) {
      finalMimeType = getMimeTypeFromFilename(options.fileName);
    } else {
      // Fallback for raw blob without metadata
      finalMimeType = 'audio/mp3'; 
    }
  }
  
  // Verify support
  const isVideo = finalMimeType.startsWith('video/');
  if (!isVideo && !Object.values(SUPPORTED_MIME_TYPES).includes(finalMimeType) && finalMimeType !== 'audio/mp3') {
     // We allow 'audio/mp3' as a generic fallback, but ideally should warn.
     // Proceeding with best effort.
  }

  // 2. Build Prompt
  const industryContext = options.industryName 
    ? `\n**INDUSTRY CONTEXT**:
       - Industry: ${options.industryName}
       - Examples/Terminology: ${options.industryExamples || 'Standard terminology'}`
    : `\n**INDUSTRY CONTEXT**:
       - Please infer the specific industry (e.g., SaaS, Construction, Retail) from the conversation.`;

  const promptText = `
    Analyze this sales call (${finalMimeType}) comprehensively. 
    You are an expert sales coach.
    
    ${industryContext}

    ${options.customInstructions ? `**CUSTOM USER INSTRUCTIONS**:\n${options.customInstructions}\n` : ''}

    **REQUIRED ANALYSIS DIMENSIONS**:
    1. **Transcript**: Diarized (Speaker A/B), verbatim.
    2. **Sentiment**: Time-series data (0-100) for graphing.
    3. **Coaching**: Strengths, Missed Opportunities, Teaching Moments.
    4. **Objections**: Specific objections, severity (High/Med/Low), and rep's response.
    5. **Competitors**: Mentions with timestamp and context.
    6. **Red Flags**: Churn risks, budget issues, or authority blockers.
    7. **Behavioral**: Talk/Listen ratio, WPM, interruptions.
    8. **Micro Scores**: Rate specific skills (Discovery, Objection Handling, etc.) 0-100.
    9. **Next Steps**: Concrete action items.

    **OUTPUT FORMAT**:
    Return ONLY valid JSON matching the provided schema. 
    - If unsure about a value, return null or an empty array. Do not hallucinate.
    - Ensure 'talkToListenRatio' is a decimal (e.g., 0.65).
  `;

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: finalMimeType,
              data: base64Data,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temp for factual extraction
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new GeminiParseError("Received empty response from Gemini.");
    }

    let parsedResult: AnalysisResult;
    try {
      parsedResult = JSON.parse(jsonText);
    } catch (e) {
      throw new GeminiParseError("Failed to parse JSON response", jsonText);
    }

    // 3. Post-Processing & Derived Scoring
    if (parsedResult.microScores && typeof parsedResult.modelCallScore === 'number') {
      parsedResult.derivedScores = calculateDerivedScores(parsedResult.microScores, parsedResult.modelCallScore);
    }

    return parsedResult;

  } catch (error: any) {
    if (error instanceof GeminiParseError || error instanceof AIServiceError) {
      throw error;
    }
    // Handle generic API errors
    const msg = error.message || "Unknown error during AI analysis";
    if (msg.includes("400") || msg.includes("INVALID_ARGUMENT")) {
       throw new AIServiceError("Invalid request. Please check file format and size.", error);
    }
    if (msg.includes("503") || msg.includes("500")) {
       throw new AIServiceError("AI Service is temporarily unavailable. Please retry.", error);
    }
    throw new AIServiceError(`Analysis failed: ${msg}`, error);
  }
};
