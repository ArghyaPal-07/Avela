export type Flow = "None" | "Spotting" | "Light" | "Medium" | "Heavy";
export type Mood =
  | "Happy"
  | "Calm"
  | "Sensitive"
  | "Low"
  | "Anxious"
  | "Energetic";
export interface Entry {
  id: string;
  date: string;
  flow: Flow;
  mood: Mood | "";
  symptoms: string[];
  notes: string;
  periodStart: boolean;
}
export interface Profile {
  name: string;
  lastPeriod: string;
  cycleLength: number;
  periodLength: number;
}
export interface Data {
  version: 1;
  profile: Profile;
  entries: Entry[];
}
export const flows: Flow[] = ["None", "Spotting", "Light", "Medium", "Heavy"];
export const moods: Mood[] = [
  "Happy",
  "Calm",
  "Sensitive",
  "Low",
  "Anxious",
  "Energetic",
];
export const symptoms = [
  "Cramps",
  "Headache",
  "Bloating",
  "Fatigue",
  "Backache",
  "Tender breasts",
  "Acne",
  "No symptoms",
];
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function dayNumber(date: string) {
  return Date.parse(`${date}T00:00:00Z`) / 86400000;
}
export function validDate(date: unknown): date is string {
  return (
    typeof date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    Number.isFinite(dayNumber(date)) &&
    new Date(dayNumber(date) * 86400000).toISOString().slice(0, 10) === date
  );
}
export function addDays(date: string, n: number) {
  return new Date((dayNumber(date) + n) * 86400000).toISOString().slice(0, 10);
}
export function formatDate(
  date: string,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" },
) {
  if (!validDate(date)) return "Not set";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", options);
}
export function validateProfile(p: Profile, now = today()) {
  if (!p.name.trim() || p.name.length > 50)
    return "Enter a name between 1 and 50 characters.";
  if (
    !validDate(p.lastPeriod) ||
    p.lastPeriod > now ||
    dayNumber(now) - dayNumber(p.lastPeriod) > 366
  )
    return "Choose a period start within the past 12 months.";
  if (
    !Number.isInteger(p.cycleLength) ||
    p.cycleLength < 21 ||
    p.cycleLength > 40
  )
    return "Cycle length must be a whole number between 21 and 40 days.";
  if (
    !Number.isInteger(p.periodLength) ||
    p.periodLength < 1 ||
    p.periodLength > 10
  )
    return "Period length must be between 1 and 10 days.";
  return "";
}
export function validateEntry(e: Entry, now = today()) {
  if (
    !validDate(e.date) ||
    e.date > now ||
    dayNumber(now) - dayNumber(e.date) > 3660
  )
    return "Choose a valid date within the past 10 years, up to today.";
  if (
    !flows.includes(e.flow) ||
    (e.mood && !moods.includes(e.mood)) ||
    e.symptoms.some((s) => !symptoms.includes(s))
  )
    return "Please choose valid tracking options.";
  if (e.periodStart && ["None", "Spotting"].includes(e.flow))
    return "Choose light, medium, or heavy flow for a period start.";
  if (e.flow === "None" && !e.mood && !e.symptoms.length && !e.notes.trim())
    return "Add a flow, mood, symptom, or note before saving.";
  if (e.notes.length > 2000) return "Keep notes under 2,000 characters.";
  return "";
}
export function cycle(profile: Profile, entries: Entry[], date = today()) {
  const starts = entries
    .filter((e) => e.periodStart && e.date <= date)
    .map((e) => e.date);
  const start =
    [...starts, profile.lastPeriod]
      .filter((d) => d <= date)
      .sort()
      .at(-1) || profile.lastPeriod;
  if (!validDate(profile.lastPeriod) || !validDate(start))
    return {
      configured: false,
      start: "",
      currentDay: 0,
      next: "",
      remaining: 0,
      phase: "Not set up",
      overdue: false,
    };
  const elapsed = dayNumber(date) - dayNumber(start);
  const currentDay = elapsed + 1;
  const next = addDays(start, profile.cycleLength);
  const remaining = dayNumber(next) - dayNumber(date);
  const phase =
    currentDay <= 0
      ? "Upcoming"
      : currentDay <= profile.periodLength
        ? "Menstrual"
        : currentDay < profile.cycleLength - 15
          ? "Follicular"
          : currentDay <= profile.cycleLength - 12
            ? "Ovulatory"
            : remaining > 0
              ? "Luteal"
              : "Awaiting your update";
  return {
    configured: true,
    start,
    currentDay,
    next,
    remaining,
    phase,
    overdue: remaining < 0,
  };
}
export function emptyData(): Data {
  return {
    version: 1,
    profile: {
      name: "",
      lastPeriod: "",
      cycleLength: 28,
      periodLength: 5,
    },
    entries: [],
  };
}
export function isData(value: unknown): value is Data {
  if (!value || typeof value !== "object") return false;
  const d = value as Data;
  return (
    d.version === 1 &&
    !!d.profile &&
    typeof d.profile.name === "string" &&
    d.profile.name.length <= 50 &&
    (d.profile.lastPeriod === "" || validDate(d.profile.lastPeriod)) &&
    Number.isInteger(d.profile.cycleLength) &&
    d.profile.cycleLength >= 21 &&
    d.profile.cycleLength <= 40 &&
    d.profile.periodLength >= 1 &&
    Number.isInteger(d.profile.periodLength) &&
    d.profile.periodLength <= 10 &&
    Array.isArray(d.entries) &&
    d.entries.length <= 10000 &&
    d.entries.every(
      (e) =>
        !!e &&
        typeof e === "object" &&
        typeof e.id === "string" &&
        validDate(e.date) &&
        flows.includes(e.flow) &&
        (e.mood === "" || moods.includes(e.mood)) &&
        Array.isArray(e.symptoms) &&
        e.symptoms.every((s) => symptoms.includes(s)) &&
        typeof e.notes === "string" &&
        e.notes.length <= 2000 &&
        typeof e.periodStart === "boolean",
    )
  );
}
export function csv(entries: Entry[]) {
  const esc = (s: string) =>
    `"${(/^[=+@\-\t\r]/.test(s) ? "'" : "") + s.replaceAll('"', '""')}"`;
  return [
    "Date,Flow,Mood,Symptoms,Notes,Period start",
    ...entries.map((e) =>
      [
        e.date,
        e.flow,
        e.mood,
        e.symptoms.join("; "),
        e.notes,
        e.periodStart ? "Yes" : "No",
      ]
        .map(esc)
        .join(","),
    ),
  ].join("\r\n");
}
