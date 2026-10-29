import Link from "next/link";
import { ArrowRight, Plus, Minus, Droplet, Leaf, CalendarDays } from "lucide-react";
import { Brand } from "./primitives";
import { HeroVideo } from "./hero-video";
import "./landing.css";

const faqs = [
  ["What can I track with Avela?", "You can log period starts, daily flow, moods, physical symptoms, and personal notes. Your check-ins appear in your calendar and journal, with summaries in My insights."],
  ["Do I need an account to start?", "No. You can start tracking in your browser without an account. Your entries are saved in that browser, so use the same browser and device to return to them."],
  ["Can I look back at previous cycles?", "Yes. Your calendar and journal show past entries, and My insights shows intervals between recorded period starts. Log at least two period starts to see a cycle interval."],
  ["Can I edit or export my entries?", "Yes. You can edit check-ins and delete journal entries. In Settings, you can export a CSV or download a JSON backup of your saved data."],
  ["Are the cycle dates medical advice?", "No. Cycle dates are estimates based on your settings and recorded period starts. Avela is a tracking tool and does not provide a diagnosis or replace advice from a healthcare professional."],
];

export function LandingPage() {
  return (
    <div className="landing">
      <a className="skip-link" href="#landing-main">Skip to content</a>
      <header className="landing-nav landing-frame">
        <Link href="/" aria-label="Avela home"><Brand /></Link>
        <nav aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <Link className="landing-button landing-nav-cta" href="/dashboard">Start tracking <ArrowRight size={16} aria-hidden="true" /></Link>
        </nav>
      </header>

      <main id="landing-main">
        <section className="landing-hero" aria-labelledby="hero-title">
          <HeroVideo />
          <div className="landing-frame landing-hero-inner">
            <div className="landing-hero-copy">
              <h1 id="hero-title">Get to know<br />your cycle.</h1>
              <p>A calmer way to keep track of your periods, symptoms, and everyday patterns.</p>
              <div className="landing-actions">
                <Link className="landing-button" href="/dashboard">Start tracking <ArrowRight size={18} aria-hidden="true" /></Link>
                <a className="landing-text-link" href="#features">Explore features</a>
              </div>
              <span className="landing-hero-note"><Leaf size={16} strokeWidth={1.5} aria-hidden="true" /> A little more in tune with you.</span>
            </div>
          </div>
        </section>

        <section id="features" className="landing-features landing-frame landing-section" aria-labelledby="features-title">
          <div className="landing-section-intro">
            <h2 id="features-title">Your cycle.<br />A clearer picture.</h2>
            <p>Some days feel different. Keep a little record of them, and come back to your own patterns over time.</p>
          </div>
          <div className="landing-feature-grid">
            <article className="landing-feature">
              <div className="landing-feature-art landing-calendar" data-ui aria-hidden="true">
                <div className="landing-preview-heading"><CalendarDays size={17} /> Your cycle calendar</div>
                <div className="landing-week">{"MTWTFSS".split("").map((day, i) => <span key={i}>{day}</span>)}</div>
                <div className="landing-dates">{Array.from({length: 21}, (_, i) => <span key={i} className={i >= 8 && i <= 12 ? "marked" : ""}>{i + 1}</span>)}</div>
              </div>
              <div className="landing-feature-copy"><h3>Make a note of your flow.</h3><p>Log your period starts and daily flow. See your recorded days together in a simple calendar.</p></div>
            </article>
            <article className="landing-feature">
              <div className="landing-feature-art landing-symptoms" data-ui aria-hidden="true">
                <div className="landing-preview-heading">How is your body feeling?</div>
                <div className="landing-symptom-list"><span>Cramps <Plus size={14} /></span><span className="selected">Bloating <Minus size={14} /></span><span>Headache <Plus size={14} /></span><span>Fatigue <Plus size={14} /></span></div>
              </div>
              <div className="landing-feature-copy"><h3>Notice how you feel.</h3><p>Record symptoms and moods, and add a personal note about what matters to you that day.</p></div>
            </article>
            <article className="landing-feature">
              <div className="landing-feature-art landing-history" data-ui aria-hidden="true">
                <div className="landing-preview-heading">A little perspective</div>
                <div className="landing-history-row"><span>Period starts</span><Droplet size={16} /></div>
                <div className="landing-history-row"><span>Cycle intervals</span><CalendarDays size={16} /></div>
                <div className="landing-history-row"><span>Daily check-ins</span><Leaf size={16} /></div>
              </div>
              <div className="landing-feature-copy"><h3>Look back, at your pace.</h3><p>Browse past check-ins and view the intervals between your recorded period starts in My insights.</p></div>
            </article>
          </div>
          <p className="landing-preview-caption">Illustrative previews. Your tracker starts with your own entries.</p>
        </section>

        <section className="landing-how" aria-labelledby="how-title">
          <div className="landing-frame landing-how-grid">
            <div><h2 id="how-title">A small moment.<br />An everyday ritual.</h2><p>Start where you are.<br />There’s no perfect way to check in.</p></div>
            <ol className="landing-steps">
              <li><span className="landing-step-number">1</span><div><h3>Set up your cycle.</h3><p>Add your last period date and your usual cycle and period lengths. You can adjust them in Settings.</p></div></li>
              <li><span className="landing-step-number">2</span><div><h3>Check in with yourself.</h3><p>Log your flow, mood, symptoms, or a note. Come back when you have something to record.</p></div></li>
              <li><span className="landing-step-number">3</span><div><h3>Come back to the picture.</h3><p>Explore your calendar, revisit your journal, and see summaries as your entries build up.</p></div></li>
            </ol>
          </div>
        </section>

        <section id="faq" className="landing-faq landing-frame landing-section" aria-labelledby="faq-title">
          <div><h2 id="faq-title">A few things<br />you might wonder.</h2><p>A little clarity before you begin.</p></div>
          <div className="landing-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>
        </section>

        <section className="landing-final" aria-labelledby="final-title">
          <div className="landing-frame landing-final-inner"><div><h2 id="final-title">Make a little space<br />for yourself.</h2><p>Your next check-in can start right here.</p></div><Link className="landing-button" href="/dashboard">Start tracking <ArrowRight size={18} aria-hidden="true" /></Link></div>
        </section>
      </main>

      <footer className="landing-footer landing-frame">
        <div><Link href="/" aria-label="Avela home"><Brand /></Link><p>In tune with you.</p></div>
        <nav aria-label="Footer navigation"><a href="#features">Features</a><a href="#faq">FAQ</a><Link href="/about">About Avela</Link><Link href="/contact">Get in touch</Link><Link href="/privacy">Privacy &amp; data</Link></nav>
        <p className="landing-footer-note">A cycle tracker for everyday life.<br />Cycle estimates are not medical advice.</p>
      </footer>
    </div>
  );
}
