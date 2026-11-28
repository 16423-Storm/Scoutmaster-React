import { beforeEach, describe, expect, it, vi } from "vitest";

const signInWithPassword = vi.fn();
const getSession = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
    createClient: vi.fn(() => ({ auth: { signInWithPassword, getSession } })),
}));
vi.mock("../assets/scripts/multipageutils", () => ({ useGoToPage: vi.fn() }));

describe("signIn", () => {
    beforeEach(() => {
        vi.resetModules();
        signInWithPassword.mockReset();
        getSession.mockReset();
    });

    it("returns Success when credentials are valid and the user has a group", async () => {
        signInWithPassword.mockResolvedValue({ error: null });
        getSession.mockResolvedValue({ data: { session: { access_token: "token" } } });
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => true }));

        const { signIn } = await import("../assets/scripts/auth");
        await expect(signIn({ email: "user@example.com", password: "secret" })).resolves.toBe("Success");
        expect(signInWithPassword).toHaveBeenCalledWith({ email: "user@example.com", password: "secret" });
    });

    it("returns ChoiceSuccess when credentials are valid without a group", async () => {
        signInWithPassword.mockResolvedValue({ error: null });
        getSession.mockResolvedValue({ data: { session: { access_token: "token" } } });
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => false }));

        const { signIn } = await import("../assets/scripts/auth");
        await expect(signIn({ email: "user@example.com", password: "secret" })).resolves.toBe("ChoiceSuccess");
    });

    it.each([
        ["invalid_credentials", "invalid_credentials"],
        ["email_not_confirmed", "email_not_confirmed"],
        ["over_request_rate_limit", "over_request_rate_limit"],
    ])("returns the Supabase error code for %s", async (code, expected) => {
        signInWithPassword.mockResolvedValue({ error: { code, status: 400 } });
        const { signIn } = await import("../assets/scripts/auth");
        await expect(signIn({ email: "user@example.com", password: "wrong" })).resolves.toBe(expected);
    });

    it("maps server failures to supabase_down_error", async () => {
        signInWithPassword.mockResolvedValue({ error: { code: "unknown", status: 503 } });
        const { signIn } = await import("../assets/scripts/auth");
        await expect(signIn({ email: "user@example.com", password: "secret" })).resolves.toBe("supabase_down_error");
    });
});
