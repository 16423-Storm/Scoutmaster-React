# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: signin.spec.ts >> sign in >> signs in and loads the dashboard
- Location: e2e\signin.spec.ts:12:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /#\/dashboard$/
Received string:  "http://127.0.0.1:5173/#/choice"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    4 × locator resolved to <html lang="en">…</html>
      - unexpected value "http://127.0.0.1:5173/#/signin"
    10 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://127.0.0.1:5173/#/choice"

```

```yaml
- button "Create New Group":
  - img
  - text: Create New Group
- button "Join Existing Group":
  - img
  - text: Join Existing Group
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | const email = process.env.E2E_EMAIL;
  4  | const password = process.env.E2E_PASSWORD;
  5  | 
  6  | test.describe("sign in", () => {
  7  |     test.skip(
  8  |         !email || !password,
  9  |         "Set E2E_EMAIL and E2E_PASSWORD to run the authenticated browser test.",
  10 |     );
  11 | 
  12 |     test("signs in and loads the dashboard", async ({ page }) => {
  13 |         await page.goto("/#/signin");
  14 |         await page.locator('input[name="email"]').fill(email!);
  15 |         await page.locator('input[name="password"]').fill(password!);
  16 |         await page.getByRole("button", { name: /sign in/i }).click();
  17 | 
> 18 |         await expect(page).toHaveURL(/#\/dashboard$/);
     |                            ^ Error: expect(page).toHaveURL(expected) failed
  19 |         await expect(page.locator(".desktop-dash-maincontainer, .phone-dash-maincontainer")).toBeVisible();
  20 |     });
  21 | });
  22 | 
```