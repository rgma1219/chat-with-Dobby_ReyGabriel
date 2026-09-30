import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-flash-lite-latest";
const RETRY_AFTER_FALLBACK_SECONDS = 30;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { contents, systemInstruction, generationConfig } = req.body ?? {};

    if (!Array.isArray(contents) || contents.length === 0) {
        return res
            .status(400)
            .json({ error: "contents required and must be non-empty" });
    }

    try {
        const response = await ai.models.generateContent({
            model: MODEL,
            contents,
            config: {
                systemInstruction,
                ...generationConfig,
            },
        });

        return res.status(200).json({ candidates: response.candidates });
    } catch (error) {
        if (error.status === 429) {
            console.warn("Rate limit hit on Gemini");
            return res.status(429).json({
                error: "Rate limit exceeded",
                retryAfterSeconds: RETRY_AFTER_FALLBACK_SECONDS,
            });
        }

        if (error.status === 503) {
            return res.status(503).json({ error: "Service unavailable" });
        }

        console.error("Error calling Gemini:", error);
        return res.status(500).json({ error: "Error generating response" });
    }
}
