import { expect, test } from "@playwright/test";

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

test.describe("sign in", () => {
    test.skip(
        !email || !password,
        "Set E2E_EMAIL and E2E_PASSWORD to run the authenticated browser test.",
    );

    test("signs in and loads the dashboard", async ({ page }) => {
        await page.goto("/#/signin");
        await page.locator('input[name="email"]').fill(email!);
        await page.locator('input[name="password"]').fill(password!);
        await page.getByRole("button", { name: /sign in/i }).click();

        await expect(page).toHaveURL(/#\/dashboard$/);
        await expect(page.locator(".desktop-dash-maincontainer, .phone-dash-maincontainer")).toBeVisible();
    });
});
