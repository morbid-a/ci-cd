import { test, expect } from "@playwright/test";

// Helper: fill the form on the current page and submit it.
async function submitForm(page, username, password, button) {
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: button }).click();
}

// Users now live in a real database that survives between tests,
// so every test registers its own unique user instead of a fixed "alice".
let alice;

test.beforeEach(async ({ page }) => {
  alice = `alice_${Math.random().toString(36).slice(2, 8)}`;
  await page.goto("/#/register");
  await submitForm(page, alice, "secret123", "Register");
  await expect(page.getByRole("alert")).toHaveText(`Account created for ${alice}. Please log in.`);
});

// Happy path
test("registered user can log in", async ({ page }) => {
  await submitForm(page, alice, "secret123", "Log in");

  await expect(page).toHaveURL(/#\/welcome$/);
  await expect(page.getByRole("heading", { name: `Welcome, ${alice}!` })).toBeVisible();
});

// Sad path
test("login with invalid credentials shows an error", async ({ page }) => {
  await submitForm(page, alice, "wrong-pass1", "Log in");

  await expect(page.getByRole("alert")).toHaveText("Invalid username or password");
  await expect(page).toHaveURL(/#\/login$/);
  await expect(page.getByRole("heading", { name: "Welcome" })).toBeHidden();
});

// TEMPORARY: intentional failure to test CI/CD failure handling
test("intentional failure test", async () => {
  expect(1).toBe(2);
});