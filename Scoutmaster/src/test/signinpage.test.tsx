import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SignInPage from "../assets/pages/signinpage";

const { signIn, goToPage } = vi.hoisted(() => ({
    signIn: vi.fn(),
    goToPage: vi.fn((path: string) => vi.fn(() => path)),
}));

vi.mock("../assets/scripts/auth", () => ({ signIn }));
vi.mock("../assets/scripts/multipageutils", () => ({
    useScreenType: () => "desktop",
    useGoToPage: goToPage,
}));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock("react-spinners", () => ({ MoonLoader: () => <span data-testid="spinner" /> }));

describe("SignInPage", () => {
    beforeEach(() => {
        signIn.mockReset();
        goToPage.mockClear();
    });

    it("submits credentials and navigates to the dashboard on success", async () => {
        signIn.mockResolvedValue("Success");
        render(<SignInPage />);

        const inputs = screen.getAllByRole("textbox");
        fireEvent.change(inputs[0], { target: { value: "user@example.com" } });
        fireEvent.change(document.querySelector('input[type="password"]')!, { target: { value: "secret" } });
        fireEvent.submit(screen.getByRole("button", { name: "signin" }).closest("form")!);

        await waitFor(() => expect(signIn).toHaveBeenCalledWith({ email: "user@example.com", password: "secret" }));
        expect(goToPage).toHaveBeenCalledWith("/dashboard");
    });

    it("shows the returned error when sign-in fails", async () => {
        signIn.mockResolvedValue("invalid_credentials");
        render(<SignInPage />);
        fireEvent.submit(screen.getByRole("button", { name: "signin" }).closest("form")!);
        await waitFor(() => expect(screen.getByText("invalid_credentials")).toBeInTheDocument());
    });
});
