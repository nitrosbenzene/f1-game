const { test, expect } = require("@playwright/test");

test("prototype loads and starts without browser errors", async ({ page }) => {
  const errors = [];
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", error => errors.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Austria prototype" })).toBeVisible();
  await expect(page.locator("#raceCanvas")).toBeVisible();

  await page.getByRole("button", { name: "Start session" }).click();
  await expect(page.locator("#startOverlay")).toBeHidden();

  await page.waitForTimeout(700);

  const speedText = await page.locator("#speed").innerText();
  const speed = Number(speedText.replace(/[^0-9.]/g, ""));
  expect(speed).toBeGreaterThan(0);

  const box = await page.locator("#raceCanvas").boundingBox();
  expect(box && box.width).toBeGreaterThan(250);
  expect(box && box.height).toBeGreaterThan(180);

  expect(errors).toEqual([]);
});

test("keyboard and touch controls are present", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start session" }).click();

  await expect(page.getByRole("button", { name: "Left action" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Center action" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Right action" })).toBeVisible();

  if (isMobile) {
    await page.getByRole("button", { name: "Center action" }).tap();
  } else {
    await page.keyboard.press("Space");
  }

  await expect(page.locator("#raceMessage")).toContainText(/RaceFlow|input|needed|T1|rhythm/i);
});
