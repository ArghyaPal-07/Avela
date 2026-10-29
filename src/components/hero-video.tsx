"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [eligible, setEligible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 900px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => {
      const allow = wide.matches && !motion.matches && !connection?.saveData;
      if (!allow) video.current?.pause();
      setEligible(allow);
    };
    update();
    wide.addEventListener("change", update);
    motion.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      motion.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (eligible) video.current?.play().catch(() => setPlaying(false));
  }, [eligible]);

  async function toggle() {
    const player = video.current;
    if (!player) return;
    if (!player.paused) player.pause();
    else {
      try { await player.play(); } catch { setPlaying(false); }
    }
  }

  return (
    <>
      <div className="landing-hero-media" aria-hidden="true">
        <picture>
          <source media="(max-width: 540px)" srcSet="/pub/video/hero-mobile.webp" />
          <img src="/pub/video/hero-poster.webp" alt="" width="1920" height="1080" fetchPriority="high" />
        </picture>
        {eligible && !failed && (
          <video ref={video} autoPlay muted loop playsInline preload="none"
            poster="/pub/video/hero-poster.webp" tabIndex={-1}
            onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
            onError={() => { setFailed(true); setPlaying(false); }}>
            <source src="/pub/video/hero-desktop.mp4" type="video/mp4"
              onError={() => { setFailed(true); setPlaying(false); }} />
          </video>
        )}
      </div>
      {eligible && !failed && (
        <button className="landing-motion" onClick={toggle}
          aria-label={playing ? "Pause background video" : "Resume background video"}>
          {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          <span>{playing ? "Pause video" : "Play video"}</span>
        </button>
      )}
    </>
  );
}
