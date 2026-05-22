import OpenAI from "openai";
import { OpenAIStream } from "ai";
import { getEvaluatorPrompt, getFinalScorecardPrompt } from "./prompts";

// Configure local OpenAI client pointing to Ollama endpoint
const baseURL = (process.env.OLLAMA_BASE_URL || "http://localhost:11434") + "/v1";
const model = process.env.OLLAMA_MODEL || "mistral";

export const client = new OpenAI({
  baseURL,
  apiKey: "ollama",
  maxRetries: 1, // Fail fast if Ollama is not running
});

/**
 * Generates the opening question of the mock interview session
 */
export async function generateOpeningQuestion(
  systemPrompt: string
): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Please introduce yourself briefly and ask the first question to begin the interview." }
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "Hello. I'm ready to begin the interview. Can you tell me about yourself and your background?";
  } catch (error: any) {
    console.error("Ollama connection error in generateOpeningQuestion:", error);
    if (error.code === "ECONNREFUSED" || error.message?.includes("fetch failed") || error.message?.includes("Failed to fetch")) {
      throw new Error("AI service unavailable. Make sure Ollama is running: ollama serve");
    }
    throw new Error(error.message || "An error occurred while calling the local AI model");
  }
}

/**
 * 1. streamInterviewerResponse
 * Calls Ollama model with the interviewer prompt.
 * Returns a streaming response utilizing Vercel AI SDK's OpenAIStream.
 */
export async function streamInterviewerResponse(
  systemPrompt: string,
  history: { role: "system" | "user" | "assistant"; content: string }[]
) {
  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
      ],
      stream: true,
      temperature: 0.7,
    });

    // Return the raw response stream to allow custom wrappers with callbacks
    return response;
  } catch (error: any) {
    console.error("Ollama connection error in streamInterviewerResponse:", error);
    
    // Check if the error is a connection error (Ollama not running)
    if (error.code === "ECONNREFUSED" || error.message?.includes("fetch failed") || error.message?.includes("Failed to fetch")) {
      throw new Error("AI service unavailable. Make sure Ollama is running: ollama serve");
    }
    
    throw new Error(error.message || "An error occurred while calling the local AI model");
  }
}

/**
 * Helper to clean Markdown and other wrapper text around JSON responses from Ollama
 */
function cleanJSONString(raw: string): string {
  let cleaned = raw.trim();
  // Remove markdown codeblock wrappers if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(json)?/, "");
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.replace(/```$/, "");
  }
  return cleaned.trim();
}

/**
 * 2. evaluateAnswer (non-streaming)
 * Calls Ollama mistral model with the evaluator prompt.
 * Parses the JSON response safely and returns scores.
 */
export async function evaluateAnswer(
  role: string,
  difficulty: string,
  type: string,
  question: string,
  answer: string
) {
  const defaultEvaluation = {
    technical: 5,
    clarity: 5,
    depth: 5,
    confidence: 5,
    flags: ["shallow"],
  };

  try {
    const prompt = getEvaluatorPrompt(role, difficulty, type, question, answer);

    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1, // Low temperature for high consistency in JSON structure
      response_format: { type: "json_object" }, // Ask OpenAI API for JSON if Ollama supports it
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return defaultEvaluation;
    }

    try {
      const cleaned = cleanJSONString(content);
      const parsed = JSON.parse(cleaned);
      
      // Ensure all fields are present and valid
      return {
        technical: typeof parsed.technical === "number" ? parsed.technical : 5,
        clarity: typeof parsed.clarity === "number" ? parsed.clarity : 5,
        depth: typeof parsed.depth === "number" ? parsed.depth : 5,
        confidence: typeof parsed.confidence === "number" ? parsed.confidence : 5,
        flags: Array.isArray(parsed.flags) ? parsed.flags : [],
      };
    } catch (parseError) {
      console.error("JSON parsing failed for answer evaluation, falling back to default.", parseError, content);
      return defaultEvaluation;
    }
  } catch (error: any) {
    console.error("Ollama evaluation error:", error);
    if (error.code === "ECONNREFUSED" || error.message?.includes("fetch failed")) {
      throw new Error("AI service unavailable. Make sure Ollama is running: ollama serve");
    }
    return defaultEvaluation;
  }
}

/**
 * 3. generateFinalScorecard
 * Synthesizes a comprehensive final score and recommendations sheet.
 */
export async function generateFinalScorecard(
  difficulty: string,
  evaluations: any[]
) {
  const defaultScorecard = {
    overall: 5,
    technical: 5,
    clarity: 5,
    depth: 5,
    confidence: 5,
    strengths: ["Completed the mock interview session"],
    improvements: ["Practice structuring and speaking depth in answers"],
    recommendation: "Needs more prep",
  };

  try {
    const prompt = getFinalScorecardPrompt(difficulty, evaluations);

    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return defaultScorecard;
    }

    try {
      const cleaned = cleanJSONString(content);
      const parsed = JSON.parse(cleaned);
      return {
        overall: typeof parsed.overall === "number" ? parsed.overall : 5,
        technical: typeof parsed.technical === "number" ? parsed.technical : 5,
        clarity: typeof parsed.clarity === "number" ? parsed.clarity : 5,
        depth: typeof parsed.depth === "number" ? parsed.depth : 5,
        confidence: typeof parsed.confidence === "number" ? parsed.confidence : 5,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Practice structure"],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ["Deepen concepts"],
        recommendation: typeof parsed.recommendation === "string" ? parsed.recommendation : "Almost there, 2-3 weeks of prep needed",
      };
    } catch (parseError) {
      console.error("JSON parsing failed for final scorecard, falling back to default.", parseError, content);
      return defaultScorecard;
    }
  } catch (error: any) {
    console.error("Ollama scorecard generation error:", error);
    if (error.code === "ECONNREFUSED" || error.message?.includes("fetch failed")) {
      throw new Error("AI service unavailable. Make sure Ollama is running: ollama serve");
    }
    return defaultScorecard;
  }
}
