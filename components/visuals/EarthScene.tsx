"use client";

import { useEffect, useRef, useState } from "react";
import type { EarthController } from "@/components/visuals/earth-scene";

export function EarthScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<EarthController | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let started = false;
    let visible = true;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPaused(motionQuery.matches);
    function syncMotion() {
      setPaused(motionQuery.matches);
      controllerRef.current?.setPaused(motionQuery.matches);
    }
    motionQuery.addEventListener("change", syncMotion);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      controllerRef.current?.setVisible(entry.isIntersecting);
      if (!entry.isIntersecting || started) return;
      started = true;
      void import("@/components/visuals/earth-scene").then(({ mountEarth }) => {
        if (cancelled) return;
        controllerRef.current = mountEarth(host!, {
          paused: motionQuery.matches,
          onReady: () => { if (!cancelled) setReady(true); },
          onError: () => { if (!cancelled) { setFailed(true); setReady(false); } }
        });
        controllerRef.current.setVisible(visible);
      }).catch(() => { if (!cancelled) setFailed(true); });
    }, { threshold: 0.05 });
    observer.observe(host);
    return () => {
      cancelled = true;
      observer.disconnect();
      motionQuery.removeEventListener("change", syncMotion);
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, []);

  function togglePaused() {
    const next = !paused;
    setPaused(next);
    controllerRef.current?.setPaused(next);
  }

  return (
    <div className={`earth-stage ${ready ? "earth-ready" : ""}`}>
      <div className="earth-stage-glow" aria-hidden="true" />
      <div className="earth-coordinate"><span className="coordinate-cross" aria-hidden="true">+</span><span>SOL SYSTEM / 03</span></div>
      <div className="earth-fallback" aria-hidden="true" />
      <div ref={hostRef} className="earth-canvas" role="img" aria-label={failed ? "Earth, our home among the stars" : "Interactive 3D illustration of Earth with an orbital ring. Drag horizontally to rotate, or use the rotation buttons below."} />
      <div className="earth-caption"><span className="earth-caption-line" aria-hidden="true" /><div><span className="eyebrow">Our pale blue dot</span><p>One planet. Infinite wonder.</p></div></div>
      <div className="earth-controls">
        <span className="earth-interaction-hint">{failed ? "Our home among the stars" : ready ? "Drag to explore" : "A new perspective"}</span>
        {ready && !failed && <div className="earth-control-buttons" aria-label="Earth rotation controls">
          <button type="button" onClick={() => controllerRef.current?.rotate(-0.3)} aria-label="Rotate Earth left">←</button>
          <button type="button" onClick={togglePaused} aria-label={paused ? "Resume Earth rotation" : "Pause Earth rotation"} aria-pressed={paused}>
            {paused ? <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="m5 3 8 5-8 5Z" fill="currentColor" /></svg> : <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" /></svg>}
          </button>
          <button type="button" onClick={() => controllerRef.current?.rotate(0.3)} aria-label="Rotate Earth right">→</button>
        </div>}
      </div>
      <a className="earth-credit" href={ready ? "https://www.solarsystemscope.com/textures/" : "https://science.nasa.gov/resource/blue-marble-2002/"} target="_blank" rel="noreferrer">{ready ? "Textures: Solar System Scope · CC BY 4.0" : "Earth image: NASA / Earth Observatory"}</a>
    </div>
  );
}
