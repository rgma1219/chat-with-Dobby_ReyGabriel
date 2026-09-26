const MAX_OUTPUT_TOKENS = 200;
const TEMPERATURE = 0.8;
const MAX_TURNS_HISTORY = 12;

// { role: "character" | "user", text } -> shape de Gemini: { role: "model" | "user", parts: [{ text }] }
export function toApiMessages(uiMessages) {
  return uiMessages.map((msg) => ({
    role: msg.role === "character" ? "model" : "user",
    parts: [{ text: msg.text }],
  }));
}

export function buildPayload({ systemPrompt, uiMessages }) {
  return {
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: toApiMessages(uiMessages),
    generationConfig: {
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      temperature: TEMPERATURE,
    },
  };
}

export function normalizeAIResponse(raw) {
  const parts = raw?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";

  return parts
    .filter((p) => p && typeof p.text === "string")
    .map((p) => p.text)
    .join("")
    .trim();
}

// Limita cuántos mensajes de historial se mandan como contexto en cada request.
export function getTrimmedHistory(messages, maxTurns = MAX_TURNS_HISTORY) {
  return messages.slice(-maxTurns);
}
