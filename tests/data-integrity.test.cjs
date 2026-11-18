const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
function load(file, overrides = {}) {
  const exports = {};
  const output = ts.transpileModule(readFileSync(path.join(root, file), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new vm.Script(output, { filename: file }).runInContext(vm.createContext({ exports, Date, URL, Intl, Number, AbortSignal, console: { warn() {} }, require: (id) => {
    if (id.startsWith("@/")) return load(id.slice(2) + ".ts", overrides);
    throw new Error("Unexpected dependency: " + id);
  }, ...overrides }));
  return exports;
}
const { isUpcomingEvent, isPastEvent } = load("lib/event-time.ts");
const now = Date.parse("2026-11-18T10:00:00Z");
test("completed and failed events never appear as upcoming, even with a future timestamp", () => {
  for (const status of ["completed", "failed"]) assert.equal(isUpcomingEvent({ status, dateUtc: "2026-11-19T10:00:00Z" }, now), false);
});
test("events move to past when their scheduled time passes", () => {
  const event = { status: "scheduled", dateUtc: "2026-11-18T09:59:00Z" };
  assert.equal(isUpcomingEvent(event, now), false);
  assert.equal(isPastEvent(event, now), true);
  assert.equal(isUpcomingEvent(event, now - 120000), true);
});
test("fresh live events remain live, but an old live flag cannot pin an event forever", () => {
  assert.equal(isUpcomingEvent({ status: "live", dateUtc: "2026-11-18T09:00:00Z" }, now), true);
  assert.equal(isUpcomingEvent({ status: "live", dateUtc: "2026-11-16T09:00:00Z" }, now), false);
  assert.equal(isUpcomingEvent({ status: "scheduled", dateUtc: "invalid" }, now), false);
  assert.equal(isPastEvent({ status: "scheduled", dateUtc: "invalid" }, now), false);
});
const lunar = load("services/moon-service.ts");
test("Moon civil dates follow the configured location through UTC midnight", () => {
  assert.equal(lunar.formatDateForUsno(new Date("2026-11-17T20:00:00Z"), 5.5), "2026-11-18");
  assert.equal(lunar.formatDateForUsno(new Date("2026-11-18T02:00:00Z"), -8), "2026-11-17");
});
test("missing illumination is unavailable rather than a fabricated new Moon", () => {
  assert.ok(Number.isNaN(lunar.parseIllumination(null, NaN)));
  assert.ok(Number.isNaN(lunar.parseIllumination("", NaN)));
  assert.equal(lunar.parseIllumination("58%"), 58);
  assert.equal(lunar.parseIllumination("1%"), 1);
  assert.equal(lunar.parseIllumination("0.5%"), 0.5);
  assert.ok(Number.isNaN(lunar.parseIllumination("  ", NaN)));
  assert.equal(lunar.parseIllumination(0), 0);
  assert.equal(lunar.parseIllumination(0.58), 58);
});
test("failed phase requests do not inject old sample milestones into a successful Moon response", async () => {
  const service = load("services/moon-service.ts", { fetch: async (url) => url.pathname.includes("/rstt/") ? { ok: true, json: async () => ({ properties: { data: { curphase: "Waxing Gibbous", fracillum: "58%", moondata: [{ phen: "Rise", time: "13:33" }] } } }) } : { ok: false } });
  const result = await service.getCurrentMoonData({ date: "2026-11-18" });
  assert.equal(result.isFallback, undefined);
  assert.equal(result.phaseName, "Waxing Gibbous");
  assert.equal(result.illuminationPercent, 58);
  assert.equal(result.upcomingPhases.length, 0);
  assert.equal(result.nextFullMoon, undefined);
});
test("a total provider failure produces an explicit unavailable state without sample times", async () => {
  const service = load("services/moon-service.ts", { fetch: async () => { throw new Error("offline"); } });
  const result = await service.getCurrentMoonData({ date: "2026-11-18" });
  assert.equal(result.isFallback, true);
  assert.equal(result.phaseName, "Unknown");
  assert.equal(result.moonrise, undefined);
  assert.equal(result.moonset, undefined);
  assert.equal(result.upcomingPhases.length, 0);
});

test("homepage event limits are applied after past entries are removed", async () => {
  const service = load("services/events-service.ts", { fetch: async (url) => ({ ok: true, status: 200, text: async () => JSON.stringify({ results: String(url).includes("/launches/") ? [
    { id: "past", name: "Past launch", net: "2001-01-01T10:00:00Z" },
    { id: "future", name: "Future launch", net: "2099-01-01T10:00:00Z" }
  ] : [] }) }) });
  const events = await service.getUpcomingEvents(1);
  assert.equal(events.length, 1);
  assert.equal(events[0].title, "Future launch");
});
