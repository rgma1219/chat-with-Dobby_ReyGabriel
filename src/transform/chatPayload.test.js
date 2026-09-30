import { describe, expect, it } from "vitest";
import {
    buildPayload,
    getTrimmedHistory,
    normalizeAIResponse,
    toApiMessages,
} from "./chatPayload.js";

describe("chatPayload", () => {
    it("maps UI roles to the Gemini API roles", () => {
        expect(
            toApiMessages([
                { role: "character", text: "Hola" },
                { role: "user", text: "¿Cómo estás?" },
            ]),
        ).toEqual([
            { role: "model", parts: [{ text: "Hola" }] },
            { role: "user", parts: [{ text: "¿Cómo estás?" }] },
        ]);
    });

    it("builds a Gemini request payload", () => {
        expect(
            buildPayload({
                systemPrompt: "Responde como Dobby",
                uiMessages: [{ role: "user", text: "Hola" }],
            }),
        ).toEqual({
            systemInstruction: { parts: [{ text: "Responde como Dobby" }] },
            contents: [{ role: "user", parts: [{ text: "Hola" }] }],
            generationConfig: { maxOutputTokens: 200, temperature: 0.8 },
        });
    });

    it("joins text parts and trims the response", () => {
        expect(
            normalizeAIResponse({
                candidates: [
                    {
                        content: {
                            parts: [
                                { text: " Hola " },
                                { text: "Dobby" },
                                { text: 1 },
                            ],
                        },
                    },
                ],
            }),
        ).toBe("Hola Dobby");
    });

    it("returns an empty response when there are no text parts", () => {
        expect(normalizeAIResponse({ candidates: [] })).toBe("");
        expect(normalizeAIResponse(null)).toBe("");
    });

    it("keeps only the latest twelve messages by default", () => {
        const messages = Array.from({ length: 14 }, (_, index) => ({
            text: `message-${index}`,
        }));

        expect(getTrimmedHistory(messages)).toEqual(messages.slice(-12));
    });

    it("accepts a custom history limit", () => {
        expect(getTrimmedHistory([1, 2, 3, 4], 2)).toEqual([3, 4]);
    });
});
