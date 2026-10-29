"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Flower2,
  Heart,
  Leaf,
  LockKeyhole,
  ShieldCheck,
  Smile,
  Trash2,
} from "lucide-react";
import {
  Data,
  Entry,
  Profile,
  addDays,
  cycle,
  dayNumber,
  formatDate,
  moods,
  symptoms,
  today,
} from "@/src/lib/model";
import { download } from "@/src/lib/download";
import { ProfileForm } from "./forms";
import { Arrow, Botanical, Empty, SectionTitle } from "./primitives";
export function MoodFace({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <circle
        cx="18"
        cy="18"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="13" cy="15" r="1" fill="currentColor" />
      <circle cx="23" cy="15" r="1" fill="currentColor" />
      <path
        d={
          index === 3
            ? "M12 25Q18 19 24 25"
            : index === 2
              ? "M13 23h10"
              : index === 4
                ? "M12 21Q18 31 24 21Z"
                : "M12 21Q18 27 24 21"
        }
        stroke="currentColor"
        fill="none"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {index === 4 && (
        <path d="m28 2 1 4 4 1-4 1-1 4-1-4-4-1 4-1Z" fill="currentColor" />
      )}
    </svg>
  );
}

export function CycleRing({
  day,
  length,
  periodLength,
}: {
  day: number;
  length: number;
  periodLength: number;
}) {
  return (
    <div className="cycle-ring">
      <svg
        viewBox="0 0 240 240"
        role="img"
        aria-label={
          day
            ? `Cycle day ${day}, estimated ${length}-day cycle`
            : "Cycle details not set"
        }
      >
        <circle
          cx="120"
          cy="120"
          r="91"
          stroke="#dce5dc"
          strokeWidth="1"
          strokeDasharray="2 5"
          fill="none"
        />
        {Array.from({ length }, (_, i) => {
          const a = (((i / length) * 360 - 90) * Math.PI) / 180;
          const x = 120 + 103 * Math.cos(a),
            y = 120 + 103 * Math.sin(a);
          const active = i === day - 1;
          return (
            <g key={i}>
              {active && <circle cx={x} cy={y} r="11" fill="#fffaf0" />}
              <circle
                cx={x}
                cy={y}
                r={active ? 7 : 4.7}
                fill={
                  day > 0 && i < periodLength
                    ? "#cd8370"
                    : i === day - 1
                      ? "#315b46"
                      : "#bbccba"
                }
              />
            </g>
          );
        })}
        <text x="120" y="88" className="ring-label" textAnchor="middle">
          Cycle day
        </text>
        <text x="120" y="146" className="ring-day" textAnchor="middle">
          {day || "—"}
        </text>
        <text x="120" y="172" className="ring-caption" textAnchor="middle">
          {day ? `of your ${length}-day rhythm` : "Add your cycle details"}
        </text>
        <path d="m117 191 3 3 3-3" stroke="#62826d" fill="none" />
      </svg>
    </div>
  );
}

export function Stat({
  label,
  value,
  detail,
  icon,
  color,
  link,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  color: string;
  link: string;
}) {
  return (
    <Link href={link} className="card stat-card">
      <div>
        <span className="stat-label">{label.charAt(0) + label.slice(1).toLowerCase()}</span>
        <span className={`icon-tile ${color}`}>{icon}</span>
      </div>
      <h3>{value}</h3>
      <p>{detail}</p>
    </Link>
  );
}

export function Calendar({
  data,
  month,
  setMonth,
  onDay,
  large = false,
}: {
  data: Data;
  month: string;
  setMonth: (m: string) => void;
  onDay: (d: string) => void;
  large?: boolean;
}) {
  const first = `${month}-01`,
    start = new Date(`${first}T12:00:00`).getDay();
  const days = new Date(
    Number(month.slice(0, 4)),
    Number(month.slice(5)),
    0,
  ).getDate();
  const now = today();
  const c = cycle(data.profile, data.entries);
  const nextEnd = c.configured
    ? addDays(c.next, data.profile.periodLength - 1)
    : "";
  function change(n: number) {
    const d = new Date(`${first}T12:00:00`);
    d.setMonth(d.getMonth() + n);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return (
    <section className={`card calendar-card ${large ? "large-calendar" : ""}`}>
      <SectionTitle
        eyebrow="YOUR RHYTHM"
        title={large ? "Cycle calendar" : "Your cycle calendar"}
      >
        {!large && (
          <Link
            href="/calendar"
            className="circle-arrow"
            aria-label="Open full calendar"
          >
            <Arrow />
          </Link>
        )}
      </SectionTitle>
      <div className="month-nav">
        <h3>{formatDate(first, { month: "long", year: "numeric" })}</h3>
        <div>
          <button
            className="icon-button"
            aria-label="Previous month"
            onClick={() => change(-1)}
          >
            <ChevronLeft size={17} />
          </button>
          <button
            className="icon-button"
            aria-label="Go to current month"
            onClick={() => setMonth(now.slice(0, 7))}
          >
            <span className="calendar-today">Today</span>
          </button>
          <button
            className="icon-button"
            aria-label="Next month"
            onClick={() => change(1)}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
      <div className="calendar-grid">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span className="weekday" key={`w${i}`}>
            {d}
          </span>
        ))}
        {Array.from({ length: start }, (_, i) => (
          <span key={`blank${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const d = `${month}-${String(i + 1).padStart(2, "0")}`;
          const e = data.entries.find((e) => e.date === d);
          const period = e && e.flow !== "None" && e.flow !== "Spotting";
          const predicted =
            c.configured && d >= c.next && d <= nextEnd && d > now;
          return (
            <button
              key={d}
              aria-label={`${formatDate(d, { month: "long", day: "numeric", year: "numeric" })}${e ? ", check-in logged" : ""}${period ? ", period" : ""}${predicted ? ", estimated period" : ""}`}
              disabled={d > now}
              onClick={() => onDay(d)}
              className={`calendar-day ${d === now ? "is-today" : ""} ${period ? "is-period" : ""} ${predicted ? "is-predicted" : ""}`}
            >
              <span>{i + 1}</span>
              {e && <i />}
            </button>
          );
        })}
      </div>
      <div className="calendar-legend">
        <span>
          <i className="dot coral" />
          Period
        </span>
        <span>
          <i className="dot predicted" />
          Estimated
        </span>
        <span>
          <i className="dot dark" />
          Today
        </span>
      </div>
      {large && (
        <p className="fine-print">
          Filled dots mark recorded check-ins. Future dates show estimates only.
        </p>
      )}
    </section>
  );
}

export function MoodChart({ entries }: { entries: Entry[] }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(today(), i - 6));
  const hasMoods = days.some((d) => entries.some((e) => e.date === d && e.mood));
  return (
    <div className="mood-chart">
      {!hasMoods && <p className="fine-print">Your check-ins will appear here</p>}
      <ol className="mood-history" aria-label="Daily mood check-ins">
        {days.map((d) => {
          const mood = entries.find((e) => e.date === d)?.mood;
          return (
            <li key={d}>
              <time dateTime={d}>{formatDate(d, { weekday: "short", month: "short", day: "numeric" })}</time>
              <span className={`mood-mark ${mood ? "recorded" : ""}`} aria-hidden="true" />
              <span>{mood || "Not logged"}</span>
            </li>
          );
        })}
      </ol>
      <p className="chart-legend">Daily mood check-ins</p>
    </div>
  );
}

export function Journal({
  entries,
  search,
  filter,
  page,
  setPage,
  onEdit,
}: {
  entries: Entry[];
  search: string;
  filter: string;
  page: number;
  setPage: (p: number) => void;
  onEdit: (e: Entry) => void;
}) {
  const filtered = [...entries]
    .filter(
      (e) =>
        [e.notes, e.mood, e.flow, ...e.symptoms]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (filter === "All entries" ||
          (filter === "Flow logged" && e.flow !== "None") ||
          (filter === "Mood logged" && !!e.mood) ||
          (filter === "Symptoms logged" && !!e.symptoms.length)),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const pages = Math.max(1, Math.ceil(filtered.length / 8));
  const currentPage = Math.min(page, pages);
  return filtered.length ? (
    <>
      <div className="journal-list">
        {filtered.slice((currentPage - 1) * 8, currentPage * 8).map((e) => (
          <button
            key={e.id}
            className="journal-entry"
            onClick={() => onEdit(e)}
          >
            <div className="journal-date">
              <strong>{formatDate(e.date, { day: "numeric" })}</strong>
              <span>
                {formatDate(e.date, { month: "short", year: "numeric" })}
              </span>
            </div>
            <div className="journal-entry-content">
              <div>
                {e.mood && (
                  <span className="entry-chip">
                    <Smile size={13} />
                    {e.mood}
                  </span>
                )}
                {e.flow !== "None" && (
                  <span className="entry-chip peach">
                    <Droplet size={13} />
                    {e.flow}
                  </span>
                )}
                {e.periodStart && (
                  <span className="entry-chip">Period start</span>
                )}
              </div>
              <p>
                {e.notes ||
                  e.symptoms.join(" · ") ||
                  "A little moment, recorded."}
              </p>
              {e.notes && e.symptoms.length > 0 && (
                <span className="fine-print">{e.symptoms.join(" · ")}</span>
              )}
            </div>
            <Arrow />
          </button>
        ))}
      </div>
      <div className="pagination">
        <span>
          {filtered.length} check-ins · Page {currentPage} of {pages}
        </span>
        <div>
          <button
            className="icon-button"
            aria-label="Previous page"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="Next page"
            disabled={currentPage >= pages}
            onClick={() => setPage(currentPage + 1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </>
  ) : (
    <Empty
      title={entries.length ? "No matching moments" : "A fresh page for you"}
      description={
        entries.length
          ? "Try a different search or filter."
          : "Your check-ins will appear here once you start logging."
      }
    />
  );
}

export function Insights({ data }: { data: Data }) {
  const counts = moods.map((m) => ({
    m,
    count: data.entries.filter((e) => e.mood === m).length,
  }));
  const total = counts.reduce((n, m) => n + m.count, 0);
  const common = [...counts].sort((a, b) => b.count - a.count)[0];
  const starts = data.entries
    .filter((e) => e.periodStart)
    .map((e) => e.date)
    .sort();
  const gaps = starts
    .slice(1)
    .map((d, i) => dayNumber(d) - dayNumber(starts[i]))
    .filter((n) => n >= 15 && n <= 60);
  const commonSymptoms = symptoms
    .filter((s) => s !== "No symptoms")
    .map((s) => ({
      s,
      n: data.entries.filter((e) => e.symptoms.includes(s)).length,
    }))
    .filter((s) => s.n)
    .sort((a, b) => b.n - a.n);
  return (
    <>
      <div className="insight-summary">
        <div className="card">
          <span className="icon-tile sage">
            <BookOpen size={20} />
          </span>
          <h2>{data.entries.length} moments</h2>
          <p className="muted">Recorded in your journal</p>
        </div>
        <div className="card">
          <span className="icon-tile lavender">
            <Smile size={20} />
          </span>
          <h2>{total ? common.m : "Getting to know you"}</h2>
          <p className="muted">
            {total
              ? `Your most logged mood · ${common.count} check-ins`
              : "Your mood summary starts with a check-in"}
          </p>
        </div>
        <div className="card">
          <span className="icon-tile peach">
            <Activity size={20} />
          </span>
          <h2>
            {gaps.length
              ? `${Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length)} days`
              : "More time, more insight"}
          </h2>
          <p className="muted">
            {gaps.length
              ? `Average of ${gaps.length} recorded cycle intervals`
              : "Log two period starts to see a cycle interval"}
          </p>
        </div>
      </div>
      <div className={`insights-grid ${data.entries.length ? "has-entries" : ""}`}>
        <section className="card">
          <SectionTitle
            eyebrow="YOUR EMOTIONAL LANDSCAPE"
            title="Every feeling counts"
          />
          {total ? (
            <div className="mood-bars">
              {counts.map((m) => (
                <div key={m.m}>
                  <span>{m.m}</span>
                  <div className="bar-track">
                    <i style={{ width: `${(m.count / total) * 100}%` }} />
                  </div>
                  <strong>{m.count}</strong>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="Make room for your feelings"
              description="Your mood check-ins will build this picture."
            />
          )}
          <p className="fine-print">
            Counts reflect what you recorded, not every day or how you should
            feel.
          </p>
        </section>
        <section className="card">
          <SectionTitle
            eyebrow="LISTENING TO YOUR BODY"
            title="What you’ve noticed"
          />
          {commonSymptoms.length ? (
            commonSymptoms.map((s) => (
              <div className="symptom-row" key={s.s}>
                <span>{s.s}</span>
                <span>{s.n} check-ins</span>
              </div>
            ))
          ) : (
            <Empty
              title="Nothing recorded yet"
              description="Physical symptoms you log will appear here."
            />
          )}
          <p className="disclaimer">
            These are descriptive summaries of your entries. They do not
            establish causes or diagnose conditions.
          </p>
        </section>
      </div>
    </>
  );
}

export function Settings({
  data,
  mode,
  busy,
  save,
  exportData,
  account,
  reset,
}: {
  data: Data;
  mode: string;
  busy: boolean;
  save: (p: Profile) => void;
  exportData: (type: "csv" | "json") => void;
  account: () => void;
  reset: () => void;
}) {
  return (
    <div className="settings-grid">
      <section className="card">
        <SectionTitle eyebrow="MADE PERSONAL" title="Your cycle details" />
        <ProfileForm profile={data.profile} busy={busy} save={save} />
      </section>
      <div>
        <section className="card">
          <SectionTitle
            eyebrow="YOU’RE IN CONTROL"
            title="Your data, your choice"
          />
          <p className="muted">
            {mode === "cloud"
              ? "Your journal is stored in your Firebase account."
              : "Your journal is stored in this browser. It is not encrypted and anyone with access to this browser profile may be able to read it. Clearing browser data removes it."}
          </p>
          <div className="settings-actions">
            <button
              className="button secondary"
              onClick={() => exportData("json")}
            >
              <ArrowDownToLine size={16} />
              Download JSON backup
            </button>
            <button
              className="button secondary"
              onClick={() => exportData("csv")}
            >
              <ArrowDownToLine size={16} />
              Export CSV
            </button>
            <button className="text-button" onClick={account}>
              Manage account <ArrowRight size={15} />
            </button>
          </div>
        </section>
        <section className="card danger-zone">
          <h3>A fresh start</h3>
          <p className="muted">Export a backup before clearing your journal.</p>
          <button className="text-button danger-text" onClick={reset}>
            Clear journal <Trash2 size={14} />
          </button>
        </section>
      </div>
    </div>
  );
}

export function InfoPage({ path, start }: { path: string; start: () => void }) {
  return (
    <div className="info-page">
      <h1>
        {path === "/privacy" ? (
          "Your body. Your data."
        ) : path === "/contact" ? (
          "A little closer."
        ) : path === "/features" ? (
          "Whole-self understanding."
        ) : (
          <>
            Get to know
            <br />
            <em>your own rhythm.</em>
          </>
        )}
      </h1>
      <p className="info-intro">
        {path === "/privacy"
          ? "Clear choices about where your most personal moments live."
          : path === "/contact"
            ? "Have feedback? Keep a note for the person running this installation."
            : "Your cycle is more than dates on a calendar. It’s how you feel, what you notice, and the small moments that make you, you."}
      </p>
      {path === "/contact" ? (
        <Contact />
      ) : (
        <>
          <div className="info-cards">
            {(path === "/privacy"
              ? [
                  {
                    icon: LockKeyhole,
                    title: "Local, by default",
                    text: "Without a cloud account, entries are stored in this browser’s local storage. They are not encrypted. Use a private device and export backups.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Cloud, by choice",
                    text: "If configured, Firebase Authentication and Firestore store your cloud journal. Owner-scoped rules restrict access to your account. Local journals are not uploaded automatically.",
                  },
                  {
                    icon: ArrowDownToLine,
                    title: "Always yours",
                    text: "Export JSON or CSV in Settings. You can clear your journal there, too. Clearing a cloud journal does not delete your authentication account.",
                  },
                ]
              : [
                  {
                    icon: Droplet,
                    title: "Follow your flow",
                    text: "Record daily flow and period starts. See your cycle in a clear calendar, with estimates based on your settings.",
                  },
                  {
                    icon: Heart,
                    title: "Make space for feelings",
                    text: "Check in with your mood, notice physical symptoms, and leave a note about what matters today.",
                  },
                  {
                    icon: Leaf,
                    title: "Find your patterns",
                    text: "Explore honest summaries of your entries, without scores to chase or pressure to feel a certain way.",
                  },
                ]
            ).map((c) => (
              <section className="card" key={c.title}>
                <span className="icon-tile sage">
                  <c.icon size={23} />
                </span>
                <h2>{c.title}</h2>
                <p className="muted">{c.text}</p>
              </section>
            ))}
          </div>
          <div className="info-cta">
            <Botanical />
            <h2>
              A little awareness.
              <br />A little more <em>you.</em>
            </h2>
            <button className="button primary" onClick={start}>
              Find my rhythm <ArrowRight size={17} />
            </button>
            <p className="fine-print">
              Cycle estimates are for awareness, not diagnosis or contraception.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export function Contact() {
  const [email, setEmail] = useState(""),
    [message, setMessage] = useState(""),
    [saved, setSaved] = useState(false),
    [error, setError] = useState("");
  return (
    <section className="card contact-card">
      <h2>A note worth keeping.</h2>
      <p className="muted">
        There is no support delivery service connected. Download your feedback
        as a text file to share with the site operator yourself.
      </p>
      <form
        className="profile-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (message.trim().length < 10) {
            setError("Please add at least 10 characters to your message.");
            return;
          }
          download(
            "avela-feedback.txt",
            `Reply email: ${email}\n\n${message}`,
            "text/plain",
          );
          setSaved(true);
          setError("");
        }}
      >
        <label>
          Your email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label>
          Your message
          <textarea
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setSaved(false);
            }}
          />
        </label>
        <button type="submit" className="button primary">
          <ArrowDownToLine size={16} />
          Download feedback
        </button>
        {saved && (
          <p role="status" className="muted">
            Feedback file prepared. Nothing was sent to a server.
          </p>
        )}
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}
