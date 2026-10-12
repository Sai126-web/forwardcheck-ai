import { test, expect } from "@playwright/test";

test.describe("ForwardCheck AI Core User Journeys", () => {
  test("Landing Page renders with hero, modalities, and sample investigations", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/ForwardCheck AI/);

    // Verify Tagline in heading
    await expect(page.getByRole("heading", { name: /Don’t just check the claim/i })).toBeVisible();
    await expect(page.getByText("Explore the truth behind it.", { exact: false }).first()).toBeVisible();

    // Verify 6 Ingestion Entry Points
    await expect(page.getByRole("heading", { name: "Pasted Text" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Screenshots" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Posters & Notices" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Voice Notes" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "PDF Documents" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Public URLs" })).toBeVisible();

    // Verify 5 Canonical Verdicts section
    await expect(page.getByRole("heading", { name: "Five Canonical Verdicts Only" })).toBeVisible();
  });

  test("Dashboard renders telemetry statistics and recent investigations", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: "Forensic Dashboard" })).toBeVisible();

    // Verify Telemetry Cards
    await expect(page.getByText("Total Analyzed")).toBeVisible();
    await expect(page.getByText("Avg Bait Score")).toBeVisible();

    // Verify Recent investigations list
    await expect(page.getByRole("heading", { name: "Recent Investigations" })).toBeVisible();
  });

  test("TruthGraph Canvas renders interactive nodes, inspector, and view mode", async ({ page }) => {
    await page.goto("/investigations/sample-plastic-rice-2026/graph");

    // Verify Title and Mode badge
    await expect(page.getByRole("heading", { name: "WHO Plastic Rice Contamination Alert" })).toBeVisible();
    await expect(page.getByText("Sample Investigation").first()).toBeVisible();

    // Verify Canvas controls
    await expect(page.getByRole("button", { name: "Canvas" })).toBeVisible();
    await expect(page.getByRole("button", { name: "List View" })).toBeVisible();

    // Switch to List View
    await page.getByRole("button", { name: "List View" }).click();
    await expect(page.getByRole("heading", { name: "Claim & Evidence Index" })).toBeVisible();

    // Click a claim in list view to open Inspector Panel
    await page.locator("text=Claim #1").first().click();
    await expect(page.getByText("Normalized Proposition")).toBeVisible();
  });

  test("Report page renders Bait Index gauge, claims, multilingual tabs, and WhatsApp rebuttal", async ({ page }) => {
    await page.goto("/investigations/sample-plastic-rice-2026/report");

    // Verify Conclusion & Verdict
    await expect(page.getByText("Overall Forensic Conclusion")).toBeVisible();
    await expect(page.locator("text=False").first()).toBeVisible();

    // Verify Bait Index Gauge
    await expect(page.getByRole("heading", { name: "Bait Index™ Analysis" })).toBeVisible();
    await expect(page.getByText("Artificial Urgency", { exact: true })).toBeVisible();
    await expect(page.getByText("Authority Appeals", { exact: true })).toBeVisible();

    // Verify Multilingual Switching
    await expect(page.getByRole("heading", { name: "Plain-Language Investigative Explanation" })).toBeVisible();
    await page.getByRole("button", { name: "हिंदी" }).click();
    await expect(page.getByText("इस संदेश की जांच")).toBeVisible();

    await page.getByRole("button", { name: "मराठी" }).click();
    await expect(page.getByText("या संदेशाची सखोल तपासणी")).toBeVisible();

    // Verify Polite WhatsApp Rebuttal
    await expect(page.getByRole("heading", { name: "Polite WhatsApp Factual Rebuttal" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy Rebuttal" })).toBeVisible();
  });

  test("History page allows search and filtering", async ({ page }) => {
    await page.goto("/investigations");
    await expect(page.getByRole("heading", { name: "Investigation History" })).toBeVisible();

    // Filter by mode
    const modeSelect = page.locator("select").nth(1);
    await modeSelect.selectOption("sample");
    await expect(page.getByText("Sample Investigation").first()).toBeVisible();
  });

  test("Evidence Library allows searching and inspecting sources", async ({ page }) => {
    await page.goto("/evidence");
    await expect(page.getByRole("heading", { name: "Evidence & Source Repository" })).toBeVisible();
    await expect(page.getByText("Citation #").first()).toBeVisible();
  });

  test("Settings page supports guest session and appearance preferences", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "Settings & Privacy" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Clear Local Data" })).toBeVisible();
  });

  test("Full End-to-End Investigation Creation Flow", async ({ page }) => {
    await page.goto("/investigations/new");

    // Paste text into text area
    const sampleForward = "URGENT ALERT: Supreme Court ordered emergency closure of all highways starting at 6 PM today! Forward this to 5 groups immediately!";
    await page.locator("textarea").first().fill(sampleForward);

    // Click Extract & Review Claims
    await page.getByRole("button", { name: "Extract & Review Claims" }).click();

    // Verify Step 2 Ingestion Review appears
    await expect(page.getByRole("heading", { name: "Ingestion Review & Claim Pre-Decomposition" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Detected Atomic Claims/ })).toBeVisible();

    // Submit for Evidence Verification
    await page.getByRole("button", { name: "Start Evidence Verification" }).click();

    // Verify Navigation to Processing screen
    await expect(page).toHaveURL(/processing/);
    await expect(page.getByRole("heading", { name: "Investigating Claims..." })).toBeVisible();

    // Wait for auto-transition to TruthGraph
    await page.waitForURL(/graph/, { timeout: 15000 });
    await expect(page.getByRole("button", { name: "Canvas" })).toBeVisible();
  });
});
