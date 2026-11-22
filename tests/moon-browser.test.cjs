const assert = require("node:assert/strict");
const test = require("node:test");
const { mkdir } = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");
const { chromium } = require("@playwright/test");
const { SearchMoonPhase } = require("astronomy-engine");

const base = process.env.MOON_TEST_BASE_URL;
const screenshots = process.env.MOON_TEST_SCREENSHOTS || "/tmp/astroboat-moon-checks";
const launch = () => chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}),
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
});
const rendered = (page) => page.waitForFunction(() => document.querySelector('[class*="stageStatus"]')?.textContent === "Earth-facing / lunar north up");
const settle = (page) => page.waitForTimeout(1400);
async function pixels(page) {
  const image = await page.locator("canvas").first().screenshot();
  const { data, info } = await sharp(image).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = 0, right = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * info.channels;
    if ((data[i] + data[i + 1] + data[i + 2]) / 3 > 50) {
      if (x < info.width / 2) left++; else right++;
    }
  }
  return { image, data, info, left, right };
}
function difference(a, b) {
  assert.equal(a.data.length, b.data.length);
  let sum = 0;
  for (let i = 0; i < a.data.length; i++) sum += Math.abs(a.data[i] - b.data[i]);
  return sum / a.data.length;
}
function civil(date) { return new Date(date.getTime() + 5.5 * 3600000).toISOString().slice(0, 10); }

test("Moon renders, phases correctly, explores, zooms, resets and stays responsive", { skip: !base, timeout: 180000 }, async () => {
  await mkdir(screenshots, { recursive: true });
  const browser = await launch();
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    // Vercel injects this in production hosting; a local Next server has no analytics endpoint.
    await context.route("**/_vercel/insights/script.js", (route) => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.addInitScript(() => {
      window.__lunarFrames = 0;
      const original = window.requestAnimationFrame;
      window.requestAnimationFrame = (callback) => original.call(window, (time) => { window.__lunarFrames++; callback(time); });
    });
    await page.goto(base + "/moon", { waitUntil: "networkidle" });
    await rendered(page); await settle(page);
    assert.equal(await page.locator("h1").count(), 1);
    const primaryNav = page.getByRole("navigation", { name: "Primary navigation", exact: true });
    assert.equal(await primaryNav.getByRole("link", { name: "Moon", exact: true }).getAttribute("aria-current"), "page");
    assert.equal(await primaryNav.getByRole("link", { name: "Asteroid Watch", exact: true }).getAttribute("href"), "/asteroids");
    assert.equal(await primaryNav.getByRole("button", { name: "Sky tools" }).count(), 0);
    const observation = await page.locator('section[aria-labelledby="moon-conditions-title"]').innerText();
    const initialDate = await page.getByLabel("Simulation date", { exact: true }).inputValue();
    const start = new Date(initialDate + "T00:00:00Z");
    const firstQuarter = civil(SearchMoonPhase(90, start, 40).date);
    const lastQuarter = civil(SearchMoonPhase(270, start, 40).date);
    await page.getByLabel("Simulation date", { exact: true }).fill(firstQuarter); await settle(page);
    const waxing = await pixels(page);
    assert.ok(waxing.right > waxing.left * 1.8, "Waxing quarter lights the right-hand side");
    assert.ok(waxing.left + waxing.right > 10000, "Real textured pixels, not a blank canvas");
    await page.screenshot({ path: path.join(screenshots, "desktop-waxing.png"), fullPage: true });
    await page.getByLabel("Simulation date", { exact: true }).fill(lastQuarter); await settle(page);
    const waning = await pixels(page);
    assert.ok(waning.left > waning.right * 1.8, "Waning quarter lights the left-hand side");
    await page.screenshot({ path: path.join(screenshots, "desktop-waning.png") });
    assert.equal(await page.locator('section[aria-labelledby="moon-conditions-title"]').innerText(), observation, "Simulation cannot relabel USNO rise/set dates");
    const earthView = await pixels(page);
    await page.getByRole("button", { name: "Explore", exact: true }).click(); await settle(page);
    const box = await page.locator("canvas").boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 160, box.y + box.height / 2 + 30, { steps: 12 }); await page.mouse.up();
    await settle(page);
    assert.ok(difference(earthView, await pixels(page)) > 3, "Dragging changes the rendered surface");
    await page.getByRole("button", { name: "Reset Earth-facing view" }).click(); await settle(page);
    assert.ok(difference(earthView, await pixels(page)) < 0.5, "Reset restores the actual observing direction");
    const preZoom = await pixels(page);
    await page.getByRole("button", { name: "Zoom in" }).click(); await settle(page);
    assert.ok(difference(preZoom, await pixels(page)) > 2, "Zoom button changes the projection");
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, -300); await settle(page);
    assert.ok(difference(preZoom, await pixels(page)) > 4, "Wheel zoom works");
    await page.getByRole("button", { name: "Reset Earth-facing view" }).click();
    await page.getByRole("button", { name: "Explore", exact: true }).click();
    await page.locator('[aria-describedby="moon-keyboard-help"]').focus();
    const keyboardBefore = await pixels(page);
    await page.keyboard.press("ArrowRight"); await settle(page);
    assert.ok(difference(keyboardBefore, await pixels(page)) > 1, "Keyboard rotation works");
    await page.getByRole("button", { name: "Reset Earth-facing view" }).click();
    await page.getByRole("button", { name: "Enter fullscreen" }).click(); await settle(page);
    const full = await page.locator('[class*="stageToolbar"]').locator("..").boundingBox();
    assert.ok(full.width >= 1400 && full.height >= 990, "Fullscreen fills the viewport");
    await page.screenshot({ path: path.join(screenshots, "fullscreen.png") });
    await page.getByRole("button", { name: "Exit fullscreen" }).click();
    await page.getByRole("button", { name: "Today", exact: true }).click(); await settle(page);
    assert.equal(await page.getByLabel("Simulation date", { exact: true }).inputValue(), initialDate);
    await page.getByLabel("Lunar simulation timeline", { exact: true }).focus();
    for (let i = 0; i < 7; i++) await page.keyboard.press("ArrowRight");
    await settle(page);
    assert.notEqual(await page.getByLabel("Simulation date", { exact: true }).inputValue(), initialDate);
    await page.getByLabel("Simulation date", { exact: true }).fill(lastQuarter); await settle(page);
    for (const width of [320, 390, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 }); await settle(page);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "No overflow at " + width);
      if (width >= 1024) {
        const links = await primaryNav.getByRole("link").evaluateAll((items) => items.map((item) => item.getBoundingClientRect().toJSON()));
        for (let i = 1; i < links.length; i++) assert.ok(links[i - 1].right <= links[i].left, "Navigation links do not overlap at " + width);
        const navBox = await primaryNav.boundingBox();
        const searchBox = await page.getByRole("button", { name: "Open Astroboat search" }).boundingBox();
        assert.ok(navBox.x + navBox.width <= searchBox.x, "Navigation stays clear of search at " + width);
      }
      const image = await pixels(page);
      assert.ok(image.left + image.right > (width < 768 ? 1500 : 5000), "Nonblank render at " + width);
      if (width === 390 || width === 1440) await page.screenshot({ path: path.join(screenshots, width === 390 ? "mobile.png" : "desktop.png"), fullPage: true });
      if (width === 390) {
        await page.getByRole("button", { name: "Open navigation menu" }).click();
        const mobileNav = page.getByRole("navigation", { name: "Mobile primary navigation" });
        assert.equal(await mobileNav.getByRole("link", { name: "Moon", exact: true }).getAttribute("aria-current"), "page");
        assert.equal(await mobileNav.getByRole("link", { name: "Asteroid Watch", exact: true }).getAttribute("href"), "/asteroids");
        await page.getByRole("button", { name: "Close navigation menu" }).click();
      }
    }
    await settle(page);
    const beforeIdle = await page.evaluate(() => window.__lunarFrames);
    await page.waitForTimeout(600);
    assert.ok(await page.evaluate(() => window.__lunarFrames) - beforeIdle < 5, "No constant idle render loop");
    await page.evaluate(() => { const canvas = document.querySelector("canvas"); canvas.getContext("webgl2").getExtension("WEBGL_lose_context").loseContext(); });
    await page.getByText("Static surface reference; phase not simulated", { exact: true }).waitFor();
    assert.equal(await page.locator("canvas").count(), 0, "Context loss returns to an honest reference");
    assert.deepEqual(errors, []);
    console.log("Moon screenshots: " + screenshots);
    await context.close();
  } finally { await browser.close(); }
});

test("WebGL-disabled and missing-texture devices retain the NASA reference and data", { skip: !base, timeout: 90000 }, async () => {
  await mkdir(screenshots, { recursive: true });
  const browser = await launch();
  try {
    for (const failure of ["webgl", "texture"]) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      if (failure === "webgl") await context.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) { return type.startsWith("webgl") ? null : original.call(this, type, ...args); };
        Element.prototype.requestFullscreen = undefined;
      });
      else await context.route("**/textures/moon/color-1024.webp", (route) => route.abort());
      const page = await context.newPage();
      await page.goto(base + "/moon", { waitUntil: "networkidle" });
      await page.getByText("Static surface reference; phase not simulated", { exact: true }).waitFor();
      const reference = page.getByRole("img", { name: /NASA LRO surface reference/ });
      assert.ok(await reference.isVisible());
      const referenceBox = await reference.boundingBox();
      const controlBox = await page.getByRole("group", { name: "Lunar camera controls" }).boundingBox();
      assert.ok(referenceBox.y + referenceBox.height < controlBox.y, "Fallback stays clear of camera controls");
      assert.ok(await page.locator('section[aria-labelledby="moon-conditions-title"]').isVisible());
      await page.screenshot({ path: path.join(screenshots, "fallback-" + failure + ".png") });
      if (failure === "webgl") {
        await page.getByRole("button", { name: "Enter fullscreen" }).click();
        const dialog = page.getByRole("dialog", { name: "Immersive lunar observatory" });
        await dialog.waitFor();
        await page.keyboard.press("Shift+Tab");
        assert.equal(await page.evaluate(() => document.activeElement.textContent), "Surface: NASA / SVS / LRO");
        await page.keyboard.press("Tab");
        assert.equal(await page.evaluate(() => document.activeElement.textContent), "Earth-facing");
        await page.keyboard.press("Escape");
        assert.equal(await dialog.count(), 0);
        assert.equal(await page.getByRole("button", { name: "Enter fullscreen" }).evaluate((element) => document.activeElement === element), true);
        assert.equal(await page.evaluate(() => document.body.style.overflow), "");
      }
      await context.close();
    }
  } finally { await browser.close(); }
});

test("normal motion settles, data saver limits downloads, and other pages do not load lunar maps", { skip: !base, timeout: 90000 }, async () => {
  const browser = await launch();
  try {
    for (const variant of ["normal", "save-data", "detail-failure", "home"]) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
      if (variant === "save-data") await context.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true } }));
      if (variant === "detail-failure") await context.route("**/textures/moon/color-4096.webp", (route) => route.abort());
      const page = await context.newPage();
      const resources = [];
      page.on("request", (request) => { if (request.url().includes("/textures/moon/")) resources.push(request.url()); });
      await page.addInitScript(() => {
        window.__lunarFrames = 0;
        const original = window.requestAnimationFrame;
        window.requestAnimationFrame = (callback) => original.call(window, (time) => { window.__lunarFrames++; callback(time); });
      });
      await page.goto(base + (variant === "home" ? "/" : "/moon"), { waitUntil: "networkidle" });
      if (variant === "home") assert.deepEqual(resources, []);
      else {
        await rendered(page);
        const initialDate = await page.getByLabel("Simulation date", { exact: true }).inputValue();
        const quarter = civil(SearchMoonPhase(90, new Date(initialDate + "T00:00:00Z"), 40).date);
        await page.getByLabel("Simulation date", { exact: true }).fill(quarter);
        await page.waitForTimeout(3500);
        const before = await page.evaluate(() => window.__lunarFrames);
        await page.waitForTimeout(750);
        assert.ok(await page.evaluate(() => window.__lunarFrames) - before < 5, variant + " must settle instead of spinning");
        const image = await pixels(page);
        assert.ok(image.left + image.right > 10000, variant + " retains a rendered Moon");
        if (variant === "save-data") assert.equal(resources.some((url) => /(?:2048|4096)\.webp$/.test(url)), false);
      }
      await context.close();
    }
  } finally { await browser.close(); }
});
