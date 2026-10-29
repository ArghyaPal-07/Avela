"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Droplet,
  Flower2,
  Heart,
  LayoutGrid,
  Leaf,
  LockKeyhole,
  Menu,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Smile,
  Sparkles,
  Sun,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import {
  addDays,
  csv,
  cycle,
  Data,
  Entry,
  flows,
  formatDate,
  isData,
  emptyData,
  Mood,
  moods,
  Profile,
  symptoms,
  today,
  validateEntry,
  validateProfile,
  dayNumber,
} from "@/src/lib/model";
import { cloudEnabled, cloud } from "@/src/lib/cloud";
import {
  Botanical,
  Brand,
  Empty,
  Modal,
  SectionTitle,
  Arrow,
} from "./primitives";
import type { User } from "firebase/auth";
import { download } from "@/src/lib/download";
import { LogForm, ProfileForm, Account } from "./forms";
import {
  MoodFace,
  CycleRing,
  Stat,
  Calendar,
  MoodChart,
  Journal,
  Insights,
  Settings,
  InfoPage,
} from "./tracking-views";
const KEY = "avela.wellness.v1";
const nav = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/calendar", label: "Cycle calendar", icon: CalendarDays },
  { href: "/insights", label: "My insights", icon: TrendingUp },
  { href: "/journal", label: "Daily journal", icon: BookOpen },
];
type DialogName =
  | "log"
  | "setup"
  | "account"
  | "notifications"
  | "delete"
  | null;
export function WellnessApp({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const activePath = path === "/dashboard" ? "/" : path;
  const [data, setData] = useState<Data | null>(null),
    [mode, setMode] = useState<"local" | "cloud">("local");
  const [user, setUser] = useState<User | null>(null),
    [cloudLoading, setCloudLoading] = useState(false);
  const [dialog, setDialog] = useState<DialogName>(null),
    [edit, setEdit] = useState<Entry | undefined>(),
    [selectedDate, setSelectedDate] = useState(today());
  const [mobile, setMobile] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState("All entries"),
    [page, setPage] = useState(1);
  const [month, setMonth] = useState(() => today().slice(0, 7));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sidebar = useRef<HTMLElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  function toast(message: string) {
    setNotice(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(""), 5000);
  }
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!isData(parsed)) throw new Error("invalid");
        setData(parsed);
        setMode("local");
      } else setData(emptyData());
    } catch {
      setData(emptyData());
      setError(
        "Saved data could not be read. Existing browser data is unchanged; starting a new tracker will replace it.",
      );
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (!cloudEnabled) return;
    let unsubscribe = () => {};
    let stopData = () => {};
    let active = true;
    import("firebase/auth").then(({ onAuthStateChanged }) => {
      if (!active) return;
      unsubscribe = onAuthStateChanged(cloud().auth, async (u) => {
        stopData();
        setUser(u);
        if (u) {
          setCloudLoading(true);
          try {
            const { doc, onSnapshot } = await import("firebase/firestore");
            if (!active) return;
            stopData = onSnapshot(
              doc(cloud().db, "users", u.uid, "wellness", "data"),
              (snap) => {
                if (snap.exists()) {
                  const d = snap.data();
                  if (isData(d)) {
                    setData(d);
                    setMode("cloud");
                  } else
                    setError(
                      "Cloud data has an unsupported format. No data was overwritten.",
                    );
                } else {
                  setData({
                    version: 1,
                    profile: {
                      name: u.displayName || "",
                      lastPeriod: "",
                      cycleLength: 28,
                      periodLength: 5,
                    },
                    entries: [],
                  });
                  setMode("cloud");
                  setDialog("setup");
                }
                setCloudLoading(false);
              },
              () => {
                setError(
                  "Cloud data could not be loaded. Check your connection and Firestore rules.",
                );
                setCloudLoading(false);
              },
            );
          } catch {
            setCloudLoading(false);
            setError("Could not connect to your cloud account.");
          }
        } else {
          try {
            const raw = localStorage.getItem(KEY);
            const parsed = raw ? JSON.parse(raw) : null;
            setData(isData(parsed) ? parsed : emptyData());
            setMode("local");
          } catch {
            setData(emptyData());
            setMode("local");
          }
        }
      });
    });
    return () => {
      active = false;
      unsubscribe();
      stopData();
    };
  }, []);
  useEffect(() => {
    setMobile(false);
    setSearch("");
    setPage(1);
  }, [path]);
  useEffect(() => {
    if (!mobile) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus after the drawer is visible; focusing during its hidden first frame is ignored.
    const focusTimer = setTimeout(() => {
      sidebar.current?.querySelector<HTMLButtonElement>(".mobile-close")?.focus();
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180);
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobile(false);
      if (event.key === "Tab") {
        const controls = sidebar.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled)',
        );
        if (!controls?.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const closeOnDesktop = () => {
      if (window.innerWidth > 1100) setMobile(false);
    };
    document.addEventListener("keydown", closeMenu);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeMenu);
      clearTimeout(focusTimer);
      window.removeEventListener("resize", closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      menuTrigger.current?.focus();
    };
  }, [mobile]);
  useEffect(() => {
    if (path === "/flow" || path === "/mood" || path === "/body") {
      setEdit(undefined);
      setDialog("log");
    }
    if (path === "/login" || path === "/signup") setDialog("account");
  }, [path]);
  async function persist(next: Data) {
    setError("");
    if (cloudLoading || (user && mode !== "cloud"))
      throw new Error("Wait for your cloud journal to load before saving.");
    if (next.entries.length > 2000)
      throw new Error(
        "Your journal has reached 2,000 entries. Export a backup before removing older entries.",
      );
    if (mode === "cloud" && user) {
      const { doc, setDoc } = await import("firebase/firestore");
      await setDoc(
        doc(cloud().db, "users", user.uid, "wellness", "data"),
        next,
      );
    } else {
      localStorage.setItem(KEY, JSON.stringify(next));
      setMode("local");
    }
    setData(next);
  }
  function openLog(e?: Entry, date = today()) {
    setEdit(e);
    setSelectedDate(e?.date || date);
    setDialog("log");
  }
  async function saveEntry(entry: Entry) {
    if (!data) return;
    setBusy(true);
    try {
      const base = data;
      await persist({
        ...base,
        entries: [
          ...base.entries.filter(
            (e) => e.id !== entry.id && e.date !== entry.date,
          ),
          entry,
        ].sort((a, b) => b.date.localeCompare(a.date)),
      });
      setDialog(null);
      toast("Your check-in has been saved.");
    } catch {
      setError(
        "Your check-in could not be saved. Check storage permissions or your cloud connection, then try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function removeEntry(entry: Entry) {
    if (!data) return;
    setBusy(true);
    try {
      await persist({
        ...data,
        entries: data.entries.filter((e) => e.id !== entry.id),
      });
      setDialog(null);
      toast("Entry removed.");
    } catch {
      setError("Could not remove this entry. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function setup(p: Profile) {
    if (!data) return;
    setBusy(true);
    try {
      await persist({
        version: 1,
        profile: p,
        entries: data.entries,
      });
      setDialog(null);
      toast("Your tracker is ready. Make a little space for yourself.");
    } catch {
      setError(
        "Your settings could not be saved. Check browser storage or your cloud connection.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (!data)
    return (
      <div className="loading">
        <Brand />
        <p>Making a little space for you…</p>
      </div>
    );
  const status = cycle(data.profile, data.entries);
  const date = today();
  const todayEntry = data.entries.find((e) => e.date === date);
  const isInfo = [
    "/about",
    "/features",
    "/contact",
    "/welcome",
    "/privacy",
  ].includes(path);
  const title =
    path === "/calendar"
      ? "Your cycle, at a glance."
      : path === "/insights"
        ? "A little more self-understanding."
        : path === "/journal"
          ? "Every feeling has a place."
          : path === "/settings"
            ? "Your space, your way."
            : data.profile.name
              ? "A little more in tune."
              : "Welcome to your wellness space.";
  const currentNav =
    nav.find((n) => n.href === activePath)?.label ||
    (path === "/settings"
      ? "Settings"
      : isInfo
        ? "Discover Avela"
        : "Overview");
  const exportData = (type: "csv" | "json") => {
    download(
      `avela-${date}.${type}`,
      type === "json" ? JSON.stringify(data, null, 2) : csv(data.entries),
      type === "json" ? "application/json" : "text/csv;charset=utf-8",
    );
    toast(`Your data exported as ${type.toUpperCase()}.`);
  };
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {mobile && (
        <button
          className="nav-scrim"
          aria-label="Close navigation"
          tabIndex={-1}
          onClick={() => setMobile(false)}
        />
      )}
      <aside
        ref={sidebar}
        id="navigation"
        role={mobile ? "dialog" : undefined}
        aria-modal={mobile ? true : undefined}
        aria-label={mobile ? "Navigation" : undefined}
        className={`sidebar ${mobile ? "open" : ""}`}
      >
        <Link href="/" className="brand-link" aria-label="Avela home">
          <Brand />
        </Link>
        <p className="brand-tagline">In tune with you</p>
        <button
          className="mobile-close icon-button"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        >
          <X />
        </button>
        <div className="nav-label">Your wellness space</div>
        <nav aria-label="Main navigation">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={activePath === n.href ? "page" : undefined}
              className={`nav-item ${activePath === n.href ? "active" : ""}`}
            >
              <n.icon size={19} strokeWidth={1.6} />
              {n.label}
              {path === n.href && <span className="active-dot" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <div className="tiny-flower">
            <Flower2 size={21} strokeWidth={1.2} />
          </div>
          <h3>A moment for you.</h3>
          <p>
            Small check-ins.
            <br />A deeper connection.
          </p>
          <button
            onClick={() =>
              !status.configured ? setDialog("setup") : openLog()
            }
          >
            Make time for yourself <ArrowRight size={15} />
          </button>
          <Botanical small />
        </div>
        <div className="sidebar-bottom">
          <Link
            href="/settings"
            className={`nav-item ${path === "/settings" ? "active" : ""}`}
          >
            <Settings2 size={19} strokeWidth={1.6} />
            Settings
          </Link>
          <Link href="/about" className="nav-item">
            <CircleHelp size={19} strokeWidth={1.6} />
            About Avela
          </Link>
          <div className="privacy-small">
            <ShieldCheck size={14} />
            Your body. Your data.
          </div>
        </div>
      </aside>
      <div className="main-shell" inert={mobile}>
        <header className="topbar">
          <div className="breadcrumb">
            <button
              ref={menuTrigger}
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              aria-expanded={mobile}
              aria-controls="navigation"
              onClick={() => setMobile(true)}
            >
              <Menu />
            </button>
            <span className="breadcrumb-home">My wellness</span>
            <ChevronRight size={14} />
            <strong>{currentNav}</strong>
          </div>
          <div className="topbar-right">
            <span className="mode-badge">
              <span />
              {mode === "cloud" ? "Cloud account" : "Saved on this device"}
            </span>
            <button
              className="icon-button notification-button"
              aria-label="View updates"
              onClick={() => setDialog("notifications")}
            >
              <Bell size={19} />
              <span />
            </button>
            {!user && (
              <button
                className="text-button"
                onClick={() => setDialog("account")}
              >
                Log in
              </button>
            )}
            <button
              className="avatar"
              aria-label="Open account"
              onClick={() => setDialog("account")}
            >
              {data.profile.name.charAt(0).toUpperCase() || (
                <Flower2 size={18} />
              )}
            </button>
          </div>
        </header>
        <main id="main" className="main-content" tabIndex={-1}>
          {error && (
            <div className="error-banner" role="alert">
              <span>{error}</span>
              <button
                className="icon-button"
                aria-label="Dismiss error"
                onClick={() => setError("")}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {cloudLoading && (
            <div role="status" className="setup-banner">
              Loading your private cloud journal…
            </div>
          )}
          {!status.configured && !isInfo && (
            <div className="setup-banner">
              <span>
                Add your cycle details to see your personal estimates.
              </span>
              <button onClick={() => setDialog("setup")}>
                Set up my tracker <ArrowRight size={14} />
              </button>
            </div>
          )}
          {!isInfo && (
            <div className="page-heading">
              <div>
                <h1>{title}</h1>
                {currentNav === "Overview" && data.profile.name && (
                  <p className="profile-name">Your space, {data.profile.name}.</p>
                )}
                <p>
                  {path === "/calendar"
                    ? "Make room for your rhythm, one day at a time."
                    : path === "/journal"
                      ? "Notice the small things. They tell your story."
                      : path === "/insights"
                        ? "Patterns from your journal, with room for real life."
                        : path === "/settings"
                          ? "A few details to make Avela feel like you."
                          : "Your body has a rhythm. Let’s get to know it together."}
                </p>
              </div>
              <div className="heading-actions">
                <span className="today-label">
                  <CalendarDays size={15} />
                  {formatDate(date, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <button
                  className="button primary"
                  onClick={() => openLog(todayEntry)}
                >
                  <Plus size={17} />
                  Log today
                </button>
              </div>
            </div>
          )}
          {isInfo ? (
            <InfoPage path={path} start={() => setDialog("setup")} />
          ) : path === "/calendar" ? (
            <div className="calendar-page">
              <Calendar
                data={data}
                month={month}
                setMonth={setMonth}
                onDay={(d) =>
                  openLog(
                    data.entries.find((e) => e.date === d),
                    d,
                  )
                }
                large
              />
              <aside className="card calendar-side">
                <h2>Your next chapter</h2>
                <p className="section-caption">The bigger picture</p>
                <div className="calendar-next">
                  <Droplet />
                  <span>
                    Next period estimate
                    <strong>
                      {formatDate(status.next, {
                        month: "long",
                        day: "numeric",
                      })}
                    </strong>
                  </span>
                </div>
                <p className="muted">
                  {status.configured
                    ? `Based on your ${data.profile.cycleLength}-day setting. Your body may follow a different timeline.`
                    : "Add your last period date and cycle lengths in Settings to see your estimate."}
                </p>
                <div className="divider" />
                <h3>Notice. Don’t judge.</h3>
                <p className="muted">
                  Tap any past or current date to add a check-in, or open an
                  existing entry.
                </p>
                <p className="disclaimer">
                  Estimates are for awareness only. They cannot confirm
                  ovulation and should not be used for contraception.
                </p>
              </aside>
            </div>
          ) : path === "/journal" ? (
            <section className="card journal-card">
              <SectionTitle
                eyebrow="A RECORD OF YOU"
                title="Your daily journal"
              >
                <button
                  className="button secondary"
                  onClick={() => exportData("csv")}
                >
                  <ArrowDownToLine size={16} />
                  Export CSV
                </button>
              </SectionTitle>
              <div className="journal-tools">
                <label className="search-field">
                  <Search size={17} />
                  <input
                    aria-label="Search journal"
                    placeholder="Search moods, symptoms, notes…"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </label>
                <select
                  aria-label="Filter entries"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  {[
                    "All entries",
                    "Flow logged",
                    "Mood logged",
                    "Symptoms logged",
                  ].map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
              <Journal
                entries={data.entries}
                search={search}
                filter={filter}
                page={page}
                setPage={setPage}
                onEdit={openLog}
              />
            </section>
          ) : path === "/insights" ? (
            <Insights data={data} />
          ) : path === "/settings" ? (
            <Settings
              data={data}
              mode={mode}
              busy={busy}
              save={setup}
              exportData={exportData}
              account={() => setDialog("account")}
              reset={() => setDialog("delete")}
            />
          ) : path === "/" ||
            path === "/dashboard" ||
            ["/flow", "/mood", "/body", "/login", "/signup"].includes(path) ? (
            <>
              <div className="overview-top">
                <section className="cycle-card">
                  <div className="cycle-copy">
                    <div className="phase-badge">
                      <Leaf size={14} />
                      {status.phase}
                      {status.configured && !status.overdue && " phase"}
                    </div>
                    <h2>
                      {!status.configured
                        ? "Your rhythm,"
                        : status.overdue
                          ? "Your rhythm,"
                          : status.phase === "Luteal"
                            ? "Slow down."
                            : status.phase === "Menstrual"
                              ? "Rest a little."
                              : "Find your flow."}
                      <br />
                      <em>
                        {!status.configured || status.overdue
                          ? "on your terms."
                          : "Tune in."}
                      </em>
                    </h2>
                    <p>
                      {!status.configured
                        ? "Start with your own cycle details. Your calendar and insights will grow with each check-in."
                        : status.overdue
                          ? "Your estimate has passed. Add a period start when it arrives, or adjust your cycle settings."
                          : "A little gentleness goes a long way. Make space to listen to what your body needs."}
                    </p>
                    <Link href="/insights" className="text-link">
                      Explore your cycle <ArrowRight size={15} />
                    </Link>
                  </div>
                  <div className="cycle-visual">
                    <CycleRing
                      day={status.currentDay}
                      length={data.profile.cycleLength}
                      periodLength={data.profile.periodLength}
                    />
                    <div className="cycle-ring-footer">
                      <span className="dot coral" />
                      Period <span className="dot sage" />
                      Cycle days
                    </div>
                  </div>
                  <Botanical />
                </section>
                <section className="card checkin-card">
                  <div className="card-title">
                    <span className="icon-tile lavender">
                      <Heart size={19} strokeWidth={1.5} />
                    </span>
                    <span>Your daily check-in</span>
                  </div>
                  <h2>
                    How are you, <em>really?</em>
                  </h2>
                  <p>A moment to notice how you feel.</p>
                  <div className="mood-quick">
                    {(
                      [
                        "Happy",
                        "Calm",
                        "Sensitive",
                        "Low",
                        "Energetic",
                      ] as Mood[]
                    ).map((m, i) => (
                      <button
                        key={m}
                        onClick={() => {
                          setEdit(
                            todayEntry
                              ? { ...todayEntry, mood: m }
                              : {
                                  id: crypto.randomUUID(),
                                  date,
                                  flow: "None",
                                  mood: m,
                                  symptoms: [],
                                  notes: "",
                                  periodStart: false,
                                },
                          );
                          setSelectedDate(date);
                          setDialog("log");
                        }}
                        className={todayEntry?.mood === m ? "chosen" : ""}
                        aria-pressed={todayEntry?.mood === m}
                      >
                        <MoodFace index={i} />
                        <span>{m}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    className="button secondary full"
                    onClick={() => openLog(todayEntry)}
                  >
                    {todayEntry
                      ? "View today’s check-in"
                      : "Check in with yourself"}
                    <ArrowRight size={16} />
                  </button>
                  <div className="checkin-bottom">
                    <LockKeyhole size={12} />
                    {mode === "cloud"
                      ? "Only in your private account"
                      : "A little moment, saved on this device"}
                  </div>
                </section>
              </div>
              <div className="stats-grid">
                <Stat
                  label="NEXT PERIOD"
                  icon={<Droplet size={17} />}
                  color="peach"
                  value={
                    !status.configured
                      ? "Not set up"
                      : status.remaining < 0
                        ? `${Math.abs(status.remaining)} days past estimate`
                        : status.remaining === 0
                          ? "Estimated today"
                          : `In ${status.remaining} days`
                  }
                  detail={
                    status.configured
                      ? `${formatDate(status.next)} · estimated`
                      : "Add your cycle details"
                  }
                  link="/calendar"
                />
                <Stat
                  label="CYCLE LENGTH"
                  icon={<Activity size={17} />}
                  color="sage"
                  value={
                    status.configured
                      ? `${data.profile.cycleLength} days`
                      : "Not set"
                  }
                  detail={
                    status.configured
                      ? "Your current cycle setting"
                      : "Set in your cycle details"
                  }
                  link="/settings"
                />
                <Stat
                  label="PERIOD LENGTH"
                  icon={<CalendarDays size={17} />}
                  color="sand"
                  value={
                    status.configured
                      ? `${data.profile.periodLength} days`
                      : "Not set"
                  }
                  detail={
                    status.configured
                      ? "Your current period setting"
                      : "Set in your cycle details"
                  }
                  link="/settings"
                />
                <Stat
                  label="CHECK-IN STREAK"
                  icon={<Sparkles size={17} />}
                  color="lavender"
                  value={`${streak(data.entries)} days`}
                  detail={
                    data.entries.length
                      ? "A little care, day by day"
                      : "Your first check-in starts here"
                  }
                  link="/journal"
                />
              </div>
              <div className="overview-bottom">
                <Calendar
                  data={data}
                  month={month}
                  setMonth={setMonth}
                  onDay={(d) =>
                    openLog(
                      data.entries.find((e) => e.date === d),
                      d,
                    )
                  }
                />
                <section className="card trends-card">
                  <SectionTitle
                    eyebrow="CONNECTING THE DOTS"
                    title="Your mood, lately"
                  >
                    <Link
                      href="/insights"
                      aria-label="View all mood insights"
                      className="circle-arrow"
                    >
                      <Arrow />
                    </Link>
                  </SectionTitle>
                  <p className="muted">
                    A little perspective on the last 7 days.
                  </p>
                  <MoodChart entries={data.entries} />
                  <div className="trend-note">
                    <span className="icon-tile sage">
                      <Leaf size={17} />
                    </span>
                    <p>
                      {data.entries.filter((e) => e.mood).length ? (
                        <>
                          <strong>Every feeling belongs.</strong> Keep checking
                          in to get to know your patterns.
                        </>
                      ) : (
                        <>
                          <strong>Start with how you feel.</strong> Your mood
                          check-ins will appear here.
                        </>
                      )}
                    </p>
                  </div>
                </section>
                <section className="care-card">
                  <div className="care-top">
                    <span>A little self-care</span>
                    <Sun size={20} strokeWidth={1.2} />
                  </div>
                  <div className="care-illustration">
                    <Botanical />
                  </div>
                  <h2>
                    You don’t have to
                    <br />
                    do it all today.
                  </h2>
                  <p>
                    Take a breath. Make a cup of something warm. Your pace is
                    enough.
                  </p>
                  <Link href="/about" className="text-link">
                    A gentler approach <ArrowRight size={15} />
                  </Link>
                  <span className="care-number">A moment to pause</span>
                </section>
              </div>
              <section className="recent-section">
                <SectionTitle title="Little moments, logged">
                  <Link href="/journal" className="text-link">
                    View your journal <ArrowRight size={15} />
                  </Link>
                </SectionTitle>
                {data.entries.length ? (
                  <div className="recent-list">
                    {[...data.entries]
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .slice(0, 3)
                      .map((e) => (
                        <button
                          key={e.id}
                          onClick={() => openLog(e)}
                          className="recent-item"
                        >
                          <span className="recent-date">
                            {formatDate(e.date)}
                          </span>
                          <span className="entry-chip">
                            <Smile size={14} />
                            {e.mood || "Mood not logged"}
                          </span>
                          <span className="recent-note">
                            {e.notes ||
                              e.symptoms.join(", ") ||
                              `${e.flow} flow`}
                          </span>
                          <Arrow />
                        </button>
                      ))}
                  </div>
                ) : (
                  <Empty
                    title="Your story starts here"
                    description="Add your first check-in. A few words are enough."
                    action={
                      <button
                        className="button secondary"
                        onClick={() => openLog()}
                      >
                        Add a check-in
                      </button>
                    }
                  />
                )}
              </section>
            </>
          ) : (
            <Empty
              title="This page has wandered off"
              description="Let’s get you back to your wellness space."
              action={
                <Link className="button primary" href="/">
                  Back to overview
                </Link>
              }
            />
          )}
          <footer className="footer">
            <span>
              <Flower2 size={14} />
              Made for your rhythm. Made for you.
            </span>
            <div>
              <Link href="/privacy">Privacy & data</Link>
              <Link href="/contact">Get in touch</Link>
              <span>© {new Date().getFullYear()} Avela</span>
            </div>
          </footer>
        </main>
        {children}
      </div>
      {notice && (
        <div className="toast" role="status">
          <Check size={17} />
          {notice}
        </div>
      )}
      {dialog === "log" && (
        <Modal
          title={edit ? "Your daily check-in" : "A moment for yourself"}
          close={() => setDialog(null)}
          wide
        >
          <LogForm
            entry={edit}
            date={selectedDate}
            existing={data.entries}
            busy={busy}
            onSave={saveEntry}
            onDelete={removeEntry}
          />
        </Modal>
      )}
      {dialog === "setup" && (
        <Modal
          title={
            !status.configured
              ? "Let’s find your rhythm."
              : "Your cycle details"
          }
          close={() => setDialog(null)}
        >
          <p className="muted">
            {!status.configured
              ? "Enter your own details to start tracking your cycle."
              : "Update these details whenever your rhythm changes."}
          </p>
          <ProfileForm profile={data.profile} busy={busy} save={setup} />
        </Modal>
      )}
      {dialog === "account" && (
        <Modal title="Your Avela space" close={() => setDialog(null)}>
          <Account
            initialSignup={path === "/signup"}
            user={user}
            mode={mode}
            start={() => setDialog("setup")}
            done={() => {
              setDialog(null);
            }}
          />
        </Modal>
      )}
      {dialog === "notifications" && (
        <Modal title="A little update" close={() => setDialog(null)}>
          <div className="update-item">
            <CalendarDays />
            <div>
              <h3>
                {!status.configured
                  ? "Set up your cycle"
                  : status.remaining < 0
                    ? "Time for a cycle update"
                    : `Next period estimate: ${formatDate(status.next)}`}
              </h3>
              <p className="muted">
                {!status.configured
                  ? "Add your last period date and cycle lengths to see estimates."
                  : status.remaining < 0
                    ? "Log a new period start when it arrives, or review your cycle settings."
                    : "Based on your settings. This is an estimate, not a medical prediction."}
              </p>
            </div>
          </div>
          <div className="update-item">
            <Heart />
            <div>
              <h3>
                {todayEntry
                  ? "You made time for you today."
                  : "Your daily check-in is here."}
              </h3>
              <p className="muted">
                {todayEntry
                  ? "Your latest check-in is in your journal."
                  : "Notice your mood, flow, or a little change in your body."}
              </p>
            </div>
          </div>
          <button
            className="button primary full"
            onClick={() => openLog(todayEntry)}
          >
            Open today’s check-in
          </button>
          <p className="fine-print">
            Updates appear here while Avela is open. Push and email reminders
            are not enabled.
          </p>
        </Modal>
      )}
      {dialog === "delete" && (
        <Modal title="Clear this journal?" close={() => setDialog(null)}>
          <p className="muted">
            This removes your entries and profile from{" "}
            {mode === "cloud" ? "your cloud account" : "this browser"}. Download
            a backup first if you want to keep them. Your account will remain.
          </p>
          <button
            className="button secondary full"
            onClick={() => exportData("json")}
          >
            <ArrowDownToLine size={16} />
            Download backup
          </button>
          <button
            className="button danger full"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                if (mode === "cloud" && user) {
                  const { deleteDoc, doc } = await import("firebase/firestore");
                  await deleteDoc(
                    doc(cloud().db, "users", user.uid, "wellness", "data"),
                  );
                } else {
                  localStorage.removeItem(KEY);
                  setData(emptyData());
                  setMode("local");
                }
                setDialog(null);
                toast("Journal cleared.");
              } catch {
                setError("Your data could not be cleared. Please try again.");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Clearing…" : "Clear my journal"}
          </button>
        </Modal>
      )}
    </div>
  );
}
function streak(entries: Entry[]) {
  const dates = new Set(entries.map((e) => e.date));
  let d = today(),
    n = 0;
  if (!dates.has(d)) d = addDays(d, -1);
  while (dates.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}
