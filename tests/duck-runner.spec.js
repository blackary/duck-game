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

test("runner uses mobile-friendly controls and compact HUD on a phone viewport", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  await page.goto("http://127.0.0.1:4381/index.html");
  await page.getByRole("button", { name: "Start Runner" }).click();

  await expect(page.locator("#jumpBtn")).toBeVisible();
  await page.waitForFunction(() => window.__duckDash && window.__duckDash.getState() !== null);
  await page.evaluate(() => window.__duckDash.startNow());
  await page.waitForFunction(() => window.__duckDash.getState().gameStarted === true);
  await page.waitForFunction(() => {
    const duck = window.__duckDash.scene().duck;
    return duck.body.blocked.down || duck.body.touching.down;
  });

  await page.locator("#jumpBtn").click();
  await page.waitForFunction(() => window.__duckDash.scene().duck.body.velocity.y < -100);
  await expect(page.locator("#top")).toContainText("Duck Dash");
  await expect(page.locator("#top")).not.toContainText("FPS");

  await context.close();
});

test("debug hat mode uses 10s and 20s reward thresholds", async ({ page }) => {
  await page.goto("http://127.0.0.1:4381/index.html");
  await page.getByLabel("Debug hats at 10s / 20s").check();
  await page.getByRole("button", { name: "Start Runner" }).click();

  await page.waitForFunction(() => window.__duckDash && window.__duckDash.getState() !== null);
  await page.waitForFunction(() => window.__duckDash.getState().debugFastHats === true);
  await page.evaluate(() => window.__duckDash.startNow());

  await page.evaluate(() => window.__duckDash.forceSeconds(10));
  await page.waitForFunction(() => window.__duckDash.getState().pickerVisible === true);
  await expect(page.locator("#hatTitle")).toContainText("10 Second Reward");
  await page.getByRole("button", { name: "Straw Hat" }).click();

  await page.evaluate(() => window.__duckDash.forceSeconds(20));
  await page.waitForFunction(() => window.__duckDash.getState().pickerVisible === true);
  await expect(page.locator("#hatTitle")).toContainText("20 Second Reward");
  await page.getByRole("button", { name: "Party Hat" }).click();

  await page.waitForFunction(() => {
    const state = window.__duckDash.getState();
    return state.hatLevel === 2 && state.selectedHats[0] === "hat_straw" && state.selectedHats[1] === "hat_party";
  });
});

test("hats sit to the right on the duck and spawned items start off the visible right edge", async ({ page }) => {
  await page.goto("http://127.0.0.1:4381/index.html");
  await page.getByRole("button", { name: "Start Runner" }).click();

  await page.waitForFunction(() => window.__duckDash && window.__duckDash.getState() !== null);
  await page.evaluate(() => {
    window.__duckDash.startNow();
    const scene = window.__duckDash.scene();
    scene.spawnPrize();
    scene.spawnObstacle({ key: "crate" });
    scene.openHatPicker(1);
    scene.applyHatChoice("hat_straw");
  });
  await page.waitForFunction(() => window.__duckDash.scene().duckHat.x > window.__duckDash.scene().duck.x);

  const placement = await page.evaluate(() => {
    const scene = window.__duckDash.scene();
    const obstacle = scene.obstacles.getChildren().find((child) => child.active);
    const prize = scene.prizes.getChildren().find((child) => child.active);
    return {
      rightEdge: scene.cameras.main.scrollX + scene.scale.width,
      obstacleX: obstacle.x,
      prizeX: prize.x,
      duckX: scene.duck.x,
      hatX: scene.duckHat.x
    };
  });

  expect(placement.obstacleX).toBeGreaterThan(placement.rightEdge);
  expect(placement.prizeX).toBeGreaterThan(placement.rightEdge);
  expect(placement.hatX).toBeGreaterThan(placement.duckX);
});
