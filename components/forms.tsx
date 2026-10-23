"use client";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Droplet,
  Trash2,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";
import {
  Entry,
  Profile,
  flows,
  moods,
  symptoms,
  today,
  validateEntry,
  validateProfile,
} from "@/lib/model";
import { cloud, cloudEnabled } from "@/lib/cloud";
import type { User } from "firebase/auth";
export function LogForm({
  entry,
  date,
  existing,
  busy,
  onSave,
  onDelete,
}: {
  entry?: Entry;
  date: string;
  existing: Entry[];
  busy: boolean;
  onSave: (e: Entry) => void;
  onDelete: (e: Entry) => void;
}) {
  const [value, setValue] = useState<Entry>(
      entry || {
        id: crypto.randomUUID(),
        date,
        flow: "None",
        mood: "",
        symptoms: [],
        notes: "",
        periodStart: false,
      },
    ),
    [error, setError] = useState(""),
    [confirm, setConfirm] = useState(false);
  const update = (patch: Partial<Entry>) => {
    setValue((v) => ({ ...v, ...patch }));
    setError("");
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const submitted = {
          ...value,
          date: String(form.get("entryDate") || value.date),
        };
        const err = validateEntry(submitted);
        setError(err);
        if (!err) onSave(submitted);
      }}
      className="log-form"
    >
      <label>
        Date
        <input
          type="date"
          name="entryDate"
          value={value.date}
          onInput={(e) => update({ date: e.currentTarget.value })}
          max={today()}
          required
          onChange={(e) => {
            const found = existing.find((x) => x.date === e.target.value);
            if (found) setValue(found);
            else update({ date: e.target.value });
          }}
        />
      </label>
      <fieldset>
        <legend>How is your flow?</legend>
        <div className="choice-row">
          {flows.map((f) => (
            <button
              type="button"
              key={f}
              className={`choice ${value.flow === f ? "selected" : ""}`}
              aria-pressed={value.flow === f}
              onClick={() =>
                update({
                  flow: f,
                  periodStart: ["None", "Spotting"].includes(f)
                    ? false
                    : value.periodStart,
                })
              }
            >
              <Droplet
                size={15}
                fill={f === "Heavy" ? "currentColor" : "none"}
              />
              {f}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={value.periodStart}
          onChange={(e) => update({ periodStart: e.target.checked })}
        />
        This is the first day of a new period
      </label>
      <fieldset>
        <legend>How are you feeling?</legend>
        <div className="choice-row">
          {moods.map((m) => (
            <button
              type="button"
              key={m}
              aria-pressed={value.mood === m}
              className={`choice ${value.mood === m ? "selected" : ""}`}
              onClick={() => update({ mood: value.mood === m ? "" : m })}
            >
              {m}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Anything your body is telling you?</legend>
        <div className="choice-row">
          {symptoms.map((s) => (
            <button
              type="button"
              key={s}
              aria-pressed={value.symptoms.includes(s)}
              className={`choice ${value.symptoms.includes(s) ? "selected" : ""}`}
              onClick={() =>
                update({
                  symptoms: value.symptoms.includes(s)
                    ? value.symptoms.filter((x) => x !== s)
                    : s === "No symptoms"
                      ? ["No symptoms"]
                      : [
                          ...value.symptoms.filter((x) => x !== "No symptoms"),
                          s,
                        ],
                })
              }
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>
      <label>
        A little note <span className="optional">(optional)</span>
        <textarea
          maxLength={2000}
          rows={3}
          placeholder="What would you like to remember about today?"
          value={value.notes}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button primary full" type="submit" disabled={busy}>
        {busy
          ? "Saving…"
          : existing.some((e) => e.date === value.date)
            ? "Update check-in"
            : "Save my check-in"}
        <Check size={16} />
      </button>
      {entry &&
        existing.some((e) => e.id === entry.id) &&
        (confirm ? (
          <div className="confirm-inline">
            <span>Remove this entry?</span>
            <button
              type="button"
              className="text-button danger-text"
              disabled={busy}
              onClick={() => onDelete(entry)}
            >
              Yes, remove
            </button>
            <button
              type="button"
              className="text-button"
              onClick={() => setConfirm(false)}
            >
              Keep it
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="text-button danger-text full"
            onClick={() => setConfirm(true)}
          >
            <Trash2 size={14} />
            Remove entry
          </button>
        ))}
      <p className="fine-print">
        One check-in per day. Re-saving a date updates that day’s entry. Cycle
        estimates are not medical advice.
      </p>
    </form>
  );
}

export function ProfileForm({
  profile,
  busy,
  save,
}: {
  profile: Profile;
  busy: boolean;
  save: (p: Profile) => void;
}) {
  const [p, setP] = useState(profile),
    [error, setError] = useState("");
  return (
    <form
      className="profile-form"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const submitted = {
          ...p,
          lastPeriod: String(form.get("lastPeriod") || p.lastPeriod),
        };
        const err = validateProfile(submitted);
        setError(err);
        if (!err) save({ ...submitted, name: p.name.trim() });
      }}
    >
      <label>
        What should we call you?
        <input
          value={p.name}
          required
          maxLength={50}
          autoComplete="given-name"
          placeholder="Your first name"
          onChange={(e) => setP({ ...p, name: e.target.value })}
        />
      </label>
      <label>
        Last period started
        <input
          type="date"
          name="lastPeriod"
          required
          max={today()}
          value={p.lastPeriod}
          onInput={(e) => setP({ ...p, lastPeriod: e.currentTarget.value })}
          onChange={(e) => setP({ ...p, lastPeriod: e.target.value })}
        />
      </label>
      <div className="form-columns">
        <label>
          Cycle length (days)
          <input
            type="number"
            required
            min={21}
            max={40}
            step={1}
            value={p.cycleLength}
            onChange={(e) =>
              setP({ ...p, cycleLength: Number(e.target.value) })
            }
          />
        </label>
        <label>
          Period length (days)
          <input
            type="number"
            required
            min={1}
            max={10}
            step={1}
            value={p.periodLength}
            onChange={(e) =>
              setP({ ...p, periodLength: Number(e.target.value) })
            }
          />
        </label>
      </div>
      <p className="fine-print">
        These settings give you a starting estimate. You can change them
        anytime. Avela does not diagnose conditions or provide contraception
        guidance.
      </p>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <button type="submit" className="button primary full" disabled={busy}>
        {busy ? "Saving…" : "Save my details"}
        <ArrowRight size={16} />
      </button>
    </form>
  );
}

export function Account({
  user,
  start,
  done,
  initialSignup = false,
}: {
  user: User | null;
  mode: string;
  start: () => void;
  done: () => void;
  initialSignup?: boolean;
}) {
  const [screen, setScreen] = useState<"login" | "signup" | "reset">(
    initialSignup ? "signup" : "login",
  );
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  function show(next: "login" | "signup" | "reset") {
    setScreen(next);
    setError("");
    setMessage("");
    setPassword("");
  }
  function report(cause: unknown) {
    const code = (cause as { code?: string }).code;
    setError(
      code === "auth/network-request-failed"
        ? "Could not connect. Check your internet connection and try again."
        : code === "auth/too-many-requests"
          ? "Too many attempts. Please wait a moment and try again."
          : code === "auth/operation-not-allowed"
            ? "Email/password sign-in is not enabled for this installation."
            : code === "auth/unauthorized-domain"
              ? "Sign-in is not enabled for this domain. Contact the site operator."
              : code === "auth/weak-password"
                ? "Use a stronger password with at least 8 characters."
                : screen === "signup"
                  ? "Could not create your account. Check your email and password, or sign in if you already have an account."
                  : screen === "reset"
                    ? "Could not request a reset email. Check your email and connection, then try again."
                    : "Could not sign in. Check your email and password, then try again.",
    );
  }
  return (
    <div className="account-content">
      {user ? (
        <>
          <span className="icon-tile sage">
            <ShieldCheck />
          </span>
          <h3>You’re signed in.</h3>
          <p className="muted">{user.email}</p>
          <p className="fine-print">
            Your cloud journal belongs to your account. Signing out restores
            this device’s separate local journal.
          </p>
          <button
            className="button secondary full"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                const { signOut } = await import("firebase/auth");
                await signOut(cloud().auth);
                done();
              } catch (cause) {
                report(cause);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Signing out…" : "Sign out"}
          </button>
        </>
      ) : (
        <>
          <span className="icon-tile sage">
            <LockKeyhole />
          </span>
          <h3>
            {screen === "signup"
              ? "Create your Avela account."
              : screen === "reset"
                ? "Reset your password."
                : "Welcome back to Avela."}
          </h3>
          <p className="muted">
            {screen === "reset"
              ? "Enter your account email to request a password reset link."
              : "Keep your journal connected to your own account. Local entries are kept separate and are not automatically uploaded."}
          </p>
          {!cloudEnabled && (
            <p className="form-note" role="status">
              Account sign-in is waiting for this installation’s Firebase
              configuration. You can use a local tracker while setup is
              completed.
            </p>
          )}
          <form
            className="profile-form"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!cloudEnabled) {
                setError("Firebase is not connected yet.");
                return;
              }
              setBusy(true);
              setError("");
              setMessage("");
              try {
                const {
                  createUserWithEmailAndPassword,
                  signInWithEmailAndPassword,
                  sendPasswordResetEmail,
                } = await import("firebase/auth");
                if (screen === "reset") {
                  await sendPasswordResetEmail(cloud().auth, email.trim());
                  setMessage(
                    "If this email belongs to an account, check your inbox for password reset instructions.",
                  );
                } else {
                  await (
                    screen === "signup"
                      ? createUserWithEmailAndPassword
                      : signInWithEmailAndPassword
                  )(cloud().auth, email.trim(), password);
                  setPassword("");
                  done();
                }
              } catch (cause) {
                report(cause);
              } finally {
                setBusy(false);
              }
            }}
          >
            <label>
              Email
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                disabled={busy}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            {screen !== "reset" && (
              <label>
                Password
                <input
                  type="password"
                  required
                  minLength={screen === "signup" ? 8 : 1}
                  autoComplete={
                    screen === "signup" ? "new-password" : "current-password"
                  }
                  value={password}
                  disabled={busy}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            )}
            <button
              type="submit"
              className="button primary full"
              disabled={busy || !cloudEnabled}
            >
              {busy
                ? "Connecting…"
                : screen === "signup"
                  ? "Create account"
                  : screen === "reset"
                    ? "Send reset link"
                    : "Sign in"}
            </button>
          </form>
          {screen === "login" && (
            <button
              className="text-button full"
              disabled={busy}
              onClick={() => show("reset")}
            >
              Forgot password?
            </button>
          )}
          <button
            className="text-button full"
            disabled={busy}
            onClick={() => show(screen === "login" ? "signup" : "login")}
          >
            {screen === "login"
              ? "New to Avela? Create an account"
              : "Already have an account? Sign in"}
          </button>
          <button
            className="button secondary full"
            disabled={busy}
            onClick={start}
          >
            Continue with a local tracker <ArrowRight size={16} />
          </button>
        </>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="form-note" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
