import { analyzeSalesCall, AIServiceError, GeminiParseError } from '../services/geminiService';
import constructionFixture from './fixtures/construction_chemicals_sample.json';
import mobileFixture from './fixtures/mobile_accessories_sample.json';
import hinglishFixture from './fixtures/hinglish_short_sample.json';

// Declare Jest globals to fix TypeScript errors when @types/jest is missing
declare const jest: any;
declare const describe: any;
declare const test: any;
declare const expect: any;
declare const beforeEach: any;

// --- Mocks ---

const mockGenerateContent = jest.fn();

jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent
      }
    })),
    Type: { OBJECT: 'OBJECT', ARRAY: 'ARRAY', STRING: 'STRING', NUMBER: 'NUMBER', BOOLEAN: 'BOOLEAN' },
    Schema: {}
  };
});

describe('Gemini Analysis Service', () => {
  const validBase64 = "UklGRi4AAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="; // Minimal WAV header
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.API_KEY = 'test-key';
  });

  test('successfully analyzes Construction Chemicals call', async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(constructionFixture)
    });

    const result = await analyzeSalesCall(validBase64, 'audio/mp3', {
      industryName: 'Construction Chemicals',
      industryExamples: 'sealant, water-proofing'
    });

    expect(result.transcript.length).toBeGreaterThan(0);
    expect(result.industryAnalysis.industryName).toBe("Construction Chemicals");
    expect(result.objections[0].severity).toBe("High");
    
    // Check Derived Score Logic
    expect(result.derivedScores).toBeDefined();
    expect(result.derivedScores?.overallScore).toBeGreaterThan(0);
  });

  test('successfully analyzes Mobile Accessories call', async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(mobileFixture)
    });

    const result = await analyzeSalesCall(validBase64, 'audio/wav');
    
    expect(result.redFlags.length).toBeGreaterThan(0);
    expect(result.redFlags[0].riskLevel).toBe("High");
    expect(result.behavioral.talkToListenRatio).toBe(1.5);
  });

  test('successfully analyzes Hinglish call', async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(hinglishFixture)
    });

    const result = await analyzeSalesCall(validBase64, 'audio/aac');
    expect(result.callMetadata.language).toBe("Hinglish");
  });

  test('throws AIServiceError for short audio', async () => {
    const shortAudio = "SGVsbG8="; // Too short
    await expect(analyzeSalesCall(shortAudio, 'audio/mp3'))
      .rejects
      .toThrow(AIServiceError);
  });

  test('handles invalid JSON from Gemini gracefully', async () => {
    mockGenerateContent.mockResolvedValue({
      text: "I am not sure, here is some text that is not JSON."
    });

    await expect(analyzeSalesCall(validBase64, 'audio/mp3'))
      .rejects
      .toThrow(GeminiParseError);
  });

  test('handles generic API failure (e.g. 503)', async () => {
    mockGenerateContent.mockRejectedValue(new Error("503 Service Unavailable"));

    await expect(analyzeSalesCall(validBase64, 'audio/mp3'))
      .rejects
      .toThrow("AI Service is temporarily unavailable");
  });

  test('infers MIME type from filename if input is generic', async () => {
    mockGenerateContent.mockResolvedValue({ text: JSON.stringify(constructionFixture) });

    await analyzeSalesCall(validBase64, 'audio/*', { fileName: 'recording.m4a' });

    // Inspect the call to ensure m4a mime type was passed to Gemini
    const callArgs = mockGenerateContent.mock.calls[0][0];
    expect(callArgs.contents.parts[0].inlineData.mimeType).toBe('audio/mp4');
  });
});