"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUp, CalendarDays, Maximize, Minimize, Minus, Plus, RotateCcw } from "lucide-react";
import type { MoonData } from "@/lib/types";
import { calculateLunarSnapshot, lunarDateAtNoon, observationSnapshot, shiftLunarDate } from "@/lib/moon-observatory";
import type { MoonCommand } from "./MoonCanvas";
import { MoonReference } from "./MoonReference";
import styles from "./moon.module.css";

const MoonCanvas = dynamic(() => import("./MoonCanvas"), { ssr: false });
const DAY = 86400000;
const formatDay = (date: string) => new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(date + "T12:00:00Z"));
const shortDay = (date: string) => new Intl.DateTimeFormat("en", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(date + "T12:00:00Z"));

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function IconButton({ label, children, onClick, disabled = false }: { label: string; children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button className={styles.iconButton} type="button" aria-label={label} onClick={onClick} disabled={disabled}>
    {children}<span className={styles.tooltip} role="tooltip">{label}</span>
  </button>;
}

export function MoonObservatory({ moon }: { moon: MoonData }) {
  const [day, setDay] = useState(moon.date);
  const [simulation, setSimulation] = useState(false);
  const [explore, setExplore] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [immersive, setImmersive] = useState(false);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [command, setCommand] = useState<MoonCommand>({ sequence: 0, action: "reset" });
  const stage = useRef<HTMLDivElement>(null);
  const fullscreenButton = useRef<HTMLButtonElement>(null);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFailed(true); setReady(false); }, []);
  const initial = useMemo(() => observationSnapshot(moon), [moon]);
  const snapshot = useMemo(() => simulation ? calculateLunarSnapshot(lunarDateAtNoon(day, moon.timezoneOffset)) : initial, [simulation, day, moon.timezoneOffset, initial]);
  const minDay = shiftLunarDate(moon.date, -30);
  const maxDay = shiftLunarDate(moon.date, 60);
  const offset = Math.round((Date.parse(day + "T12:00:00Z") - Date.parse(moon.date + "T12:00:00Z")) / DAY);
  const calculated = simulation || moon.isFallback;
  const showFallback = !ready || failed;

  useEffect(() => {
    const host = stage.current;
    if (!host) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReducedMotion(media.matches);
    motion(); media.addEventListener("change", motion);
    let intersecting = true, started = false;
    const visibility = () => setActive(intersecting && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting; visibility();
      if (!intersecting || started) return;
      started = true;
      try {
        const probe = document.createElement("canvas");
        const context = probe.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
        if (!context) { onFailure(); return; }
        context.getExtension("WEBGL_lose_context")?.loseContext();
        setEnabled(true);
      } catch { onFailure(); }
    }, { rootMargin: "100px" });
    observer.observe(host);
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); media.removeEventListener("change", motion); document.removeEventListener("visibilitychange", visibility); };
  }, [onFailure]);

  useEffect(() => {
    const change = () => {
      const expanded = document.fullscreenElement === stage.current;
      setNativeFullscreen(expanded);
      if (!expanded) fullscreenButton.current?.focus();
    };
    document.addEventListener("fullscreenchange", change);
    return () => document.removeEventListener("fullscreenchange", change);
  }, []);
  useEffect(() => {
    if (!immersive) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = fullscreenButton.current;
    document.body.style.overflow = "hidden";
    stage.current?.focus();
    return () => { document.body.style.overflow = previousOverflow; trigger?.focus(); };
  }, [immersive]);

  const issue = (action: MoonCommand["action"]) => setCommand((previous) => ({ sequence: previous.sequence + 1, action }));
  function selectDay(next: string) {
    if (!next || next < minDay || next > maxDay) return;
    try { lunarDateAtNoon(next, moon.timezoneOffset); } catch { return; }
    setDay(next); setSimulation(true);
  }
  function today() { setDay(moon.date); setSimulation(false); }
  function reset() { setExplore(false); issue("reset"); }
  async function toggleFullscreen() {
    if (document.fullscreenElement === stage.current) { await document.exitFullscreen(); return; }
    if (immersive) { setImmersive(false); return; }
    try {
      if (!stage.current?.requestFullscreen) { setImmersive(true); return; }
      await stage.current.requestFullscreen();
    } catch { setImmersive(true); }
  }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && immersive) { event.preventDefault(); setImmersive(false); }
    if (immersive && event.key === "Tab") {
      const items = stage.current?.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], [tabindex='0']");
      if (items?.length) {
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === stage.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
  }
  function canvasKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    const actions: Record<string, MoonCommand["action"]> = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down", "+": "in", "=": "in", "-": "out", Home: "reset" };
    const action = actions[event.key];
    if (!action || (!explore && ["left", "right", "up", "down"].includes(action))) return;
    event.preventDefault();
    if (action === "reset") reset(); else issue(action);
  }

  return <div className={styles.observatory}>
    <div className={styles.topline}><span>Lunar observatory</span><Link href="/guides/understanding-moon-phases">Understanding the phases <ArrowRight size={14} aria-hidden="true" /></Link></div>
    <section className={styles.hero} aria-labelledby="moon-title">
      <div ref={stage} className={`${styles.stage} ${immersive ? styles.immersive : ""}`} tabIndex={immersive ? -1 : undefined}
        role={immersive ? "dialog" : undefined} aria-modal={immersive ? true : undefined} aria-label={immersive ? "Immersive lunar observatory" : undefined}
        onKeyDown={keyboard}>
        <div className={styles.stageToolbar}>
          <div className={styles.modes} role="group" aria-label="Lunar viewing mode">
            <button type="button" aria-pressed={!explore} onClick={() => setExplore(false)}>Earth-facing</button>
            <button type="button" aria-pressed={explore} onClick={() => setExplore(true)}>Explore</button>
          </div>
          <button ref={fullscreenButton} type="button" className={styles.iconButton} onClick={() => void toggleFullscreen()} aria-label={immersive || nativeFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
            {immersive || nativeFullscreen ? <Minimize size={17} aria-hidden="true" /> : <Maximize size={17} aria-hidden="true" />}
            <span className={styles.tooltip} role="tooltip">{immersive || nativeFullscreen ? "Exit fullscreen" : "Fullscreen"}</span>
          </button>
        </div>
        <div className={styles.immersiveReadout}>{snapshot.phaseName} <span>{snapshot.illuminationPercent.toFixed(1)}% illuminated / {formatDay(day)}</span></div>
        <div className={`${styles.renderArea} ${ready && !failed ? styles.renderReady : ""} ${explore ? styles.explore : ""}`}>
          {showFallback && <div className={styles.referenceWrap}><MoonReference /></div>}
          {enabled && !failed && <div className={styles.canvas}><SceneBoundary onFailure={onFailure}>
            <MoonCanvas snapshot={snapshot} explore={explore} active={active} reducedMotion={reducedMotion}
              command={command} onReady={onReady} onFailure={onFailure} />
          </SceneBoundary></div>}
          {ready && !failed && <div className={styles.keyboardTarget} tabIndex={0} role="img"
            aria-label={`${snapshot.phaseName}, ${snapshot.illuminationPercent.toFixed(1)} percent illuminated. ${explore ? "Free exploration; not the observed phase view." : "Earth-facing Moon, lunar north up."}`}
            aria-describedby="moon-keyboard-help" onKeyDown={canvasKeyboard} />}
          <p id="moon-keyboard-help" className="sr-only">In Explore mode, use the arrow keys to rotate. Plus and minus zoom. Home returns to the Earth-facing view.</p>
        </div>
        {!explore && !showFallback && <span className={styles.north}><ArrowUp size={14} aria-hidden="true" /> N</span>}
        <div className={styles.stageFooter}>
          <span className={styles.stageStatus} role="status">{failed ? "Static surface reference; phase not simulated" : !ready ? "NASA surface reference / loading 3D" : explore ? "Free camera / Earth-facing phase shown in readout" : "Earth-facing / lunar north up"}</span>
          <div className={styles.viewControls} role="group" aria-label="Lunar camera controls">
            <IconButton label="Zoom out" onClick={() => issue("out")} disabled={!ready || failed}><Minus size={16} aria-hidden="true" /></IconButton>
            <IconButton label="Zoom in" onClick={() => issue("in")} disabled={!ready || failed}><Plus size={16} aria-hidden="true" /></IconButton>
            <IconButton label="Reset Earth-facing view" onClick={reset} disabled={!ready || failed}><RotateCcw size={16} aria-hidden="true" /></IconButton>
          </div>
        </div>
        <a className={styles.credit} href="https://svs.gsfc.nasa.gov/4720/" target="_blank" rel="noreferrer">Surface: NASA / SVS / LRO</a>
      </div>
      <div className={styles.readout}>
        <p className={styles.kicker}>Earth&apos;s natural satellite</p>
        <h1 id="moon-title">Tonight’s Moon</h1>
        <p className={styles.date}><time dateTime={day}>{formatDay(day)}</time><span>{calculated ? "Calculated simulation" : "USNO daily conditions"}</span></p>
        <div className={styles.phaseBlock}>
          <h2>{snapshot.phaseName}</h2>
          <p className={styles.illumination}>{snapshot.illuminationPercent.toFixed(1)}<span>%</span></p>
          <p className={styles.caption}>of the Earth-facing disc illuminated</p>
        </div>
        <p className={styles.advice}>{calculated ? "The moving boundary between light and dark reveals the shape of the lunar terrain. Compare dates to follow it across the near side." : moon.viewingAdvice}</p>
        <dl className={styles.modelFacts}>
          <div><dt>Model distance</dt><dd>{Math.round(snapshot.distanceKm).toLocaleString("en")} <span>km</span></dd></div>
          <div><dt>Libration, longitude / latitude</dt><dd>{snapshot.libration.longitude.toFixed(1)}° / {snapshot.libration.latitude.toFixed(1)}°</dd></div>
        </dl>
        <details className={styles.scienceNote}><summary>About this view</summary>
          <p>USNO supplies the daily phase and observing times. Astronomy Engine supplies the date simulation, Sun direction and approximate libration. The view is geocentric and lunar-north-up, not the Moon&apos;s rotation above your local horizon. Eclipse shadows and photometric earthshine are not modeled; terrain is not vertically exaggerated.</p>
          <p>Explore changes the camera, not the Earth-facing illumination readout. NASA&apos;s visual color mosaic is not a calibrated scientific measurement.</p>
        </details>
      </div>
    </section>
    <section className={styles.timeline} aria-labelledby="moon-timeline-title">
      <div className={styles.timelineHeader}>
        <div><h2 id="moon-timeline-title">Follow the light.</h2><p>Daily simulation at 12:00 IST (06:30 UTC). Observing times below stay on the USNO date.</p></div>
        <div className={styles.dateControls}>
          <label className={styles.dateInput}><CalendarDays size={16} aria-hidden="true" /><span className="sr-only">Simulation date</span><input type="date" value={day} min={minDay} max={maxDay} onChange={(event) => selectDay(event.target.value)} /></label>
          <button className={styles.today} type="button" onClick={today}>Today</button>
        </div>
      </div>
      <div className={styles.sliderRow}>
        <IconButton label="Previous simulation day" onClick={() => selectDay(shiftLunarDate(day, -1))} disabled={day <= minDay}><ArrowLeft size={17} aria-hidden="true" /></IconButton>
        <div className={styles.rangeWrap}><input type="range" min={-30} max={60} step={1} value={offset} aria-label="Lunar simulation timeline" aria-valuetext={formatDay(day)} onChange={(event) => selectDay(shiftLunarDate(moon.date, Number(event.target.value)))} />
          <div className={styles.rangeLabels}>{[-30, 0, 30, 60].map((days) => <span key={days}>{days === 0 ? "Today" : shortDay(shiftLunarDate(moon.date, days))}</span>)}</div>
        </div>
        <IconButton label="Next simulation day" onClick={() => selectDay(shiftLunarDate(day, 1))} disabled={day >= maxDay}><ArrowRight size={17} aria-hidden="true" /></IconButton>
      </div>
      <p className={styles.simulationStatus} role="status">{calculated ? `Simulation for ${formatDay(day)} / Astronomy Engine` : `Daily observation for ${formatDay(moon.date)} / USNO`}</p>
    </section>
  </div>;
}
