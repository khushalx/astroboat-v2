const assert = require("node:assert/strict");
const { readFileSync, statSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");
const astronomy = require("astronomy-engine");
const root = path.resolve(__dirname, "..");
const exportsObject = {};
const source = ts.transpileModule(readFileSync(path.join(root, "lib/moon-observatory.ts"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
new vm.Script(source).runInNewContext({ exports: exportsObject, Date, Math, Number, RangeError, require: (name) => {
  assert.equal(name, "astronomy-engine"); return astronomy;
} });
const { lunarDateAtNoon, shiftLunarDate, phaseFromLongitude, calculateLunarSnapshot, observationSnapshot, lunarViewBasis } = exportsObject;
const close = (actual, expected, tolerance = 1e-8) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

test("daily simulation uses the location's noon, including fractional UTC offsets", () => {
  assert.equal(lunarDateAtNoon("2026-11-22", 5.5).toISOString(), "2026-11-22T06:30:00.000Z");
  assert.equal(lunarDateAtNoon("2026-11-22", -8).toISOString(), "2026-11-22T20:00:00.000Z");
  assert.equal(shiftLunarDate("2026-12-31", 1), "2027-01-01");
  assert.equal(shiftLunarDate("2028-03-01", -1), "2028-02-29");
  for (const bad of ["bad", "2026-02-30", "2026-13-01", "2026-2-01"]) assert.throws(() => lunarDateAtNoon(bad, 5.5));
  assert.throws(() => calculateLunarSnapshot(new Date("invalid")));
});

test("phase longitude, not illuminated fraction, distinguishes eight phases", () => {
  const names = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"];
  names.forEach((name, index) => assert.equal(phaseFromLongitude(index * 45), name));
  assert.equal(phaseFromLongitude(360), "New Moon");
  assert.equal(phaseFromLongitude(-90), "Last Quarter");
});

test("vector lighting agrees with Astronomy Engine's independent illumination result", () => {
  for (let day = 1; day <= 31; day++) {
    const date = new Date(`2026-12-${String(day).padStart(2, "0")}T06:30:00Z`);
    const snapshot = calculateLunarSnapshot(date);
    close(Math.hypot(...snapshot.sunDirection), 1);
    close(snapshot.illuminationPercent / 100, astronomy.Illumination(astronomy.Body.Moon, date).phase_fraction, 0.0002);
    close(snapshot.illuminationPercent, (1 + snapshot.sunDirection[2]) * 50);
    assert.ok(snapshot.distanceKm > 350000 && snapshot.distanceKm < 410000);
    assert.ok(Math.abs(snapshot.libration.latitude) < 10 && Math.abs(snapshot.libration.longitude) < 10);
  }
});

test("reference USNO full Moon time produces a full modeled disc", () => {
  const full = calculateLunarSnapshot(new Date("2026-11-24T14:53:00Z"));
  assert.equal(full.phaseName, "Full Moon");
  assert.ok(full.illuminationPercent > 99.8);
});

test("the same 50 percent snapshot has opposite sunlight directions when waxing and waning", () => {
  const moon = { date: "2026-11-22", timezoneOffset: 5.5, illuminationPercent: 50 };
  const waxing = observationSnapshot({ ...moon, phaseName: "First Quarter" });
  const waning = observationSnapshot({ ...moon, phaseName: "Last Quarter" });
  assert.ok(waxing.sunDirection[0] > 0.8);
  assert.ok(waning.sunDirection[0] < -0.8);
  close(waxing.sunDirection[2], 0); close(waning.sunDirection[2], 0);
  assert.equal(waxing.source, "USNO daily snapshot");
  assert.equal(waning.illuminationPercent, 50);
});

test("valid daily values survive the model and exact zero/full values stay finite", () => {
  for (const [phaseName, illuminationPercent] of [["Waxing Gibbous", 92], ["New Moon", 0], ["Full Moon", 100]]) {
    const result = observationSnapshot({ date: "2026-11-22", timezoneOffset: 5.5, phaseName, illuminationPercent });
    assert.equal(result.phaseName, phaseName);
    assert.equal(result.illuminationPercent, illuminationPercent);
    assert.equal(result.source, "USNO daily snapshot");
    assert.ok(result.sunDirection.every(Number.isFinite));
    close(Math.hypot(...result.sunDirection), 1);
  }
});

test("an unavailable provider's zero sentinel is never presented as observed new Moon", () => {
  const result = observationSnapshot({ date: "2026-11-22", timezoneOffset: 5.5, phaseName: "Unknown", illuminationPercent: 0, isFallback: true });
  assert.equal(result.source, "Calculated simulation");
  assert.ok(result.illuminationPercent > 80);
  assert.equal(result.phaseName, "Waxing Gibbous");
});

test("libration produces an orthonormal camera basis with north upright", () => {
  for (const [longitude, latitude] of [[0, 0], [-7, 6], [7, -6]]) {
    const { right, up, forward } = lunarViewBasis(longitude, latitude);
    for (const vector of [right, up, forward]) close(Math.hypot(...vector), 1);
    close(right.reduce((sum, value, i) => sum + value * up[i], 0), 0);
    close(up.reduce((sum, value, i) => sum + value * forward[i], 0), 0);
    assert.ok(up[1] > 0.99);
  }
});

test("local NASA assets stay within the progressive delivery budget", async () => {
  const sharp = require("sharp");
  const asset = (name) => path.join(root, "public/textures/moon", name);
  let bytes = 0;
  for (const width of [1024, 2048]) {
    for (const type of ["color", "normal", "height"]) {
      const file = asset(`${type}-${width}.webp`);
      const info = await sharp(file).metadata();
      assert.equal(info.width, width); assert.equal(info.height, width / 2);
      bytes += statSync(file).size;
    }
  }
  const normal = await sharp(asset("normal-2048.webp")).stats();
  assert.ok(normal.channels[2].mean > 245, "Normals face outward, not into the Moon");
  assert.ok(statSync(asset("color-4096.webp")).size < 1400000);
  assert.ok(bytes + statSync(asset("color-4096.webp")).size < 3200000);
  assert.ok(statSync(asset("reference.webp")).size < 200000);
});
