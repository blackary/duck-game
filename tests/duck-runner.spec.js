const { test, expect } = require("@playwright/test");

test("runner supports prize collection and stacked hats at 1m and 2m", async ({ page }) => {
  await page.goto("http://127.0.0.1:4381/index.html");
  await page.getByRole("button", { name: "Start Runner" }).click();

  await page.waitForFunction(() => window.__duckDash && window.__duckDash.getState() !== null);
  await page.evaluate(() => window.__duckDash.startNow());
  await page.waitForFunction(() => window.__duckDash.getState().gameStarted === true);

  await page.evaluate(() => {
    window.__duckDash.spawnPrizeNow();
    window.__duckDash.collectFirstPrize();
  });
  await page.waitForFunction(() => window.__duckDash.getState().prizeCount >= 1);

  await page.evaluate(() => window.__duckDash.forceSeconds(60));
  await page.waitForFunction(() => window.__duckDash.getState().pickerVisible === true);
  await page.getByRole("button", { name: "Party Hat" }).click();
  await page.waitForFunction(() => {
    const state = window.__duckDash.getState();
    return state.hatLevel === 1 && state.selectedHats[0] === "hat_party" && state.pickerVisible === false;
  });

  await page.evaluate(() => window.__duckDash.forceSeconds(120));
  await page.waitForFunction(() => window.__duckDash.getState().pickerVisible === true);
  await page.getByRole("button", { name: "Bowler" }).click();
  await page.waitForFunction(() => {
    const state = window.__duckDash.getState();
    return state.hatLevel === 2 && state.selectedHats[0] === "hat_party" && state.selectedHats[1] === "hat_bow";
  });

  await expect(page.locator("#prizes")).toContainText("Hat 1: Party Hat");
  await expect(page.locator("#prizes")).toContainText("Hat 2: Bowler");
  await expect(page.locator("#prizes")).toContainText("Prize Count:");
});
