import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addDays,
  cycle,
  csv,
  isData,
  emptyData,
  validateEntry,
  validateProfile,
  validDate,
  type Entry,
  type Profile,
} from "../lib/model";
const profile: Profile = {
  name: "Test",
  lastPeriod: "2026-10-01",
  cycleLength: 28,
  periodLength: 5,
};
const entry: Entry = {
  id: "1",
  date: "2026-10-03",
  flow: "Heavy",
  mood: "Calm",
  symptoms: [],
  notes: "",
  periodStart: false,
};
test("dates handle month boundaries and leap years without local timezone drift", () => {
  assert.equal(addDays("2024-02-28", 1), "2024-02-29");
  assert.equal(addDays("2026-10-31", 1), "2026-11-01");
  assert.equal(validDate("2026-02-30"), false);
  assert.equal(validDate("broken"), false);
});
test("consecutive flow days do not reset the cycle", () => {
  const result = cycle(profile, [entry], "2026-10-18");
  assert.equal(result.currentDay, 18);
  assert.equal(result.next, "2026-10-29");
  assert.equal(result.phase, "Luteal");
});
test("an explicit new period starts a new cycle", () => {
  const result = cycle(
    profile,
    [{ ...entry, date: "2026-10-20", periodStart: true }],
    "2026-10-23",
  );
  assert.equal(result.currentDay, 4);
  assert.equal(result.next, "2026-11-17");
});
test("overdue estimates stay overdue rather than inventing a new period", () => {
  const result = cycle(profile, [], "2026-11-01");
  assert.equal(result.remaining, -3);
  assert.equal(result.overdue, true);
  assert.equal(result.phase, "Awaiting your update");
});
test("profile rejects future dates and fractional cycle lengths", () => {
  assert.ok(
    validateProfile({ ...profile, lastPeriod: "2026-11-01" }, "2026-10-23"),
  );
  assert.ok(validateProfile({ ...profile, cycleLength: 28.5 }, "2026-10-23"));
  assert.equal(validateProfile(profile, "2026-10-23"), "");
});
test("entries require content, valid dates, and flow for period starts", () => {
  assert.ok(validateEntry({ ...entry, flow: "None", mood: "" }, "2026-10-23"));
  assert.ok(validateEntry({ ...entry, date: "2026-10-24" }, "2026-10-23"));
  assert.ok(
    validateEntry({ ...entry, flow: "None", periodStart: true }, "2026-10-23"),
  );
  assert.equal(validateEntry(entry, "2026-10-23"), "");
});
test("export quotes multiline text and prevents spreadsheet formula injection", () => {
  const output = csv([{ ...entry, notes: '=SUM(1,2)\n"note"' }]);
  assert.ok(output.includes('"\'=SUM(1,2)\n""note"""'));
});
test("persisted data is checked before use", () => {
  assert.ok(isData(emptyData()));
  assert.equal(isData({ version: 1, profile, entries: [null] }), false);
  assert.equal(
    isData({
      version: 1,
      profile,
      entries: [{ ...entry, symptoms: "invalid" }],
    }),
    false,
  );
  assert.equal(
    isData({ version: 1, profile, entries: [{ ...entry, date: "bad" }] }),
    false,
  );
});

test("new trackers contain no generated personal or cycle data", () => {
  const data = emptyData();
  assert.deepEqual(data.entries, []);
  assert.equal(data.profile.name, "");
  assert.equal(data.profile.lastPeriod, "");
  const result = cycle(data.profile, data.entries, "2026-10-23");
  assert.equal(result.configured, false);
  assert.equal(result.next, "");
  assert.equal(result.currentDay, 0);
  assert.equal(cycle(data.profile, [{...entry,periodStart:true}], '2026-10-23').configured, false);
});
