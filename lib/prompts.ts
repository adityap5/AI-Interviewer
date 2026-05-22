/**
 * AI Mock Interviewer Prompts Library
 */

export function getInterviewerPrompt(
  role: string,
  difficulty: string,
  type: string,
  multiplier: number = 1.0
): string {
  let adaptiveInstruction = "";
  if (multiplier > 1.3) {
    adaptiveInstruction = "\nThe candidate is performing well. Ask a harder, more nuanced question that requires system design thinking or edge case handling.";
  } else if (multiplier < 0.8) {
    adaptiveInstruction = "\nThe candidate is struggling. Ask a more fundamental question on the same topic to assess baseline understanding.";
  }

  return `You are a senior ${role} engineer conducting a ${difficulty}-level ${type} interview.
Your personality: direct, professional, slightly challenging.
You do NOT give hints unless asked. You do NOT compliment weak answers.
You ask ONE question or ONE follow-up at a time. Never ask multiple questions.
Keep responses under 4 sentences. When probing, be specific about what was weak in the answer.
After 6 questions total, say exactly: "That concludes our interview. Thank you for your time."${adaptiveInstruction}`;
}

export function getEvaluatorPrompt(
  role: string,
  difficulty: string,
  type: string,
  question: string,
  answer: string
): string {
  return `You are evaluating an interview answer. Return ONLY valid JSON, no explanation, no markdown, no backticks.
Schema:
{
  "technical": <0-10>,
  "clarity": <0-10>,
  "depth": <0-10>,
  "confidence": <0-10>,
  "flags": []
}

Flags options: "vague", "no_example", "off_topic", "shallow", "strong_answer", "excellent_depth", "good_communication"

Context: ${role} ${difficulty} ${type} interview.
Question: ${question}
Answer: ${answer}`;
}

export function getFinalScorecardPrompt(
  difficulty: string,
  evaluations: any[]
): string {
  // Determine next difficulty level for recommendations
  const nextLevel = difficulty === "junior" ? "mid-level" : difficulty === "mid" ? "senior" : "staff-level";

  return `Generate a final interview scorecard based on the evaluations of all questions in this session.
Return ONLY valid JSON, no explanation, no markdown, no backticks.

Schema:
{
  "overall": <0-10>,
  "technical": <0-10>,
  "clarity": <0-10>,
  "depth": <0-10>,
  "confidence": <0-10>,
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "improvements": ["<specific area 1>", "<specific area 2>"],
  "recommendation": "<one of: Ready for ${difficulty} roles | Almost there, 2-3 weeks of prep needed | Needs significant preparation | Strong candidate, consider ${nextLevel} roles>"
}

Evaluations data: ${JSON.stringify(evaluations)}`;
}
