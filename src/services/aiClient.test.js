import { afterEach, describe, expect, it, vi } from "vitest";
import { getDobbyReply } from "./aiClient.js";
import { DOBBY_SYSTEM_PROMPT } from "./prompts.js";

describe("aiClient", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("sends trimmed history to the API and normalizes its response", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                candidates: [
                    {
                        content: {
                            parts: [
                                { text: "Dobby responde " },
                                { text: "con alegría." },
                            ],
                        },
                    },
                ],
            }),
        });
        vi.stubGlobal("fetch", fetchMock);
        const messages = Array.from({ length: 14 }, (_, index) => ({
            role: index % 2 === 0 ? "character" : "user",
            text: `mensaje-${index}`,
        }));

        await expect(getDobbyReply(messages)).resolves.toBe(
            "Dobby responde con alegría.",
        );

        expect(fetchMock).toHaveBeenCalledOnce();
        const [url, options] = fetchMock.mock.calls[0];
        expect(url).toBe("/api/chat");
        expect(options).toMatchObject({
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const payload = JSON.parse(options.body);
        expect(payload.systemInstruction.parts[0].text).toBe(
            DOBBY_SYSTEM_PROMPT,
        );
        expect(payload.contents).toEqual(
            messages.slice(-12).map((message) => ({
                role: message.role === "character" ? "model" : "user",
                parts: [{ text: message.text }],
            })),
        );
    });

    it("preserves rate limit details from the API response", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: false,
            status: 429,
            statusText: "Too Many Requests",
            json: vi
                .fn()
                .mockResolvedValue({
                    error: "Rate limit exceeded",
                    retryAfterSeconds: 12,
                }),
        });
        vi.stubGlobal("fetch", fetchMock);

        await expect(getDobbyReply([])).rejects.toMatchObject({
            status: 429,
            retryAfterSeconds: 12,
            body: { error: "Rate limit exceeded", retryAfterSeconds: 12 },
        });
    });
});
