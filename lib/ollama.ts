import Groq from 'groq-sdk'
import { getEvaluatorPrompt } from './prompts'
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'

// ─── Interviewer: streams the next question/follow-up ───────────────
export async function streamInterviewerResponse(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
): Promise<ReadableStream<Uint8Array>> {
  const stream = await groq.chat.completions.create({
    model: MODEL,
    messages,
    stream: true,
    max_tokens: 200,
    temperature: 0.8
  })

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const word = chunk.choices[0]?.delta?.content || ''
        if (word) {
          controller.enqueue(new TextEncoder().encode(word))
        }
      }
      controller.close()
    }
  })
}

// ─── Evaluator: silently scores the answer, returns JSON ─────────────
export async function evaluateAnswer(
  question: string,
  answer: string,
  role: string,
  difficulty: string,
  interviewType: string,
  technologies: string[] = []
): Promise<{
  technical: number
  clarity: number
  depth: number
  confidence: number
  overall: number
  flags: string[]
  detailedFeedback: string
}> {
  const defaultScore = {
    technical: 5,
    clarity: 5,
    depth: 5,
    confidence: 5,
    overall: 5,
    flags: [],
    detailedFeedback: "Answer was recorded but evaluation failed."
  }

  try {
    const promptContent = getEvaluatorPrompt(role, difficulty, technologies, question, answer);
    
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: promptContent
        }
      ],
      stream: false,
      max_tokens: 300,
      temperature: 0.1
    })

    const text = response.choices[0]?.message?.content || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    
    if (!parsed.overall) {
      parsed.overall = Math.round(
        (parsed.technical * 0.4) + 
        (parsed.clarity * 0.2) + 
        (parsed.depth * 0.3) + 
        (parsed.confidence * 0.1)
      )
    }
    parsed.overall = Math.min(10, Math.max(0, parsed.overall))
    
    if (!parsed.detailedFeedback) {
      parsed.detailedFeedback = "No detailed feedback provided by AI."
    }
    
    return parsed

  } catch (error) {
    console.error('Evaluator parsing failed:', error)
    return defaultScore
  }
}

// ─── Final scorecard generator ────────────────────────────────────────
export async function generateFinalScore(
  evaluations: Array<{
    technical: number
    clarity: number
    depth: number
    confidence: number
    flags: string[]
    questionText: string
    answerText: string
  }>,
  role: string,
  difficulty: string
): Promise<{
  overall: number
  technical: number
  clarity: number
  depth: number
  confidence: number
  strengths: string[]
  improvements: string[]
  recommendation: string
}> {
  const defaultFinal = {
    overall: 5,
    technical: 5,
    clarity: 5,
    depth: 5,
    confidence: 5,
    strengths: ['Completed the interview'],
    improvements: ['Practice more'],
    recommendation: 'Needs more preparation'
  }

  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `Generate a final interview scorecard.
Return ONLY valid JSON, no explanation, no markdown, no backticks.
Schema:
{
  "overall": <0-10>,
  "technical": <0-10>,
  "clarity": <0-10>,
  "depth": <0-10>,
  "confidence": <0-10>,
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["specific area 1", "specific area 2"],
  "recommendation": "<one of: Ready for ${difficulty} roles | Almost there, 2-3 weeks prep needed | Needs significant preparation | Strong candidate>"
}`
        },
        {
          role: 'user',
          content: `Role: ${role}, Difficulty: ${difficulty}
Evaluations: ${JSON.stringify(evaluations)}`
        }
      ],
      stream: false,
      max_tokens: 300,
      temperature: 0.2
    })

    const text = response.choices[0]?.message?.content || ''
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)

  } catch (error) {
    console.error('Final score generation failed:', error)
    return defaultFinal
  }
}
