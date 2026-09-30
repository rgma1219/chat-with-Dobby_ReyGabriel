import { afterEach, describe, expect, it, vi } from "vitest";
import { getDobbyReply } from "./mockDobbyApi.js";

describe("mockDobbyApi", () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("returns a canned reply after the simulated network delay", async () => {
        vi.useFakeTimers();
        vi.spyOn(Math, "random")
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0.9)
            .mockReturnValueOnce(0);

        const reply = getDobbyReply([]);
        const assertion = expect(reply).resolves.toBe(
            "¡Dobby está feliz de responder, señor! Dobby siempre tiene tiempo para ayudar.",
        );
        await vi.advanceTimersByTimeAsync(500);
        await assertion;
    });

    it("rejects with a 429 error when the mock rate limit is triggered", async () => {
        vi.useFakeTimers();
        vi.spyOn(Math, "random")
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0.1);

        const reply = getDobbyReply([]);
        const assertion = expect(reply).rejects.toMatchObject({
            message: "Rate limit exceeded",
            status: 429,
            retryAfterSeconds: 4,
        });
        await vi.advanceTimersByTimeAsync(500);
        await assertion;
    });
});
