import Link from "next/link";
import { NavIcon } from "@/components/layout/NavIcon";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { MoonPhaseVisual } from "@/components/visuals/MoonPhaseVisual";
import type { MoonData } from "@/lib/types";

const tools = [
  { title: "The cosmic collection", category: "ASTRONOMY GALLERY", copy: "Extraordinary views from the world’s most powerful observatories.", href: "/gallery", action: "Explore the gallery", icon: "Gallery", style: "gallery" },
  { title: "Stay a little starstruck", category: "ASTRONOMY BRIEFS", copy: "The latest in space, with the context that makes it click.", href: "/briefs", action: "Read the latest", icon: "Briefs", style: "briefs" },
  { title: "Don’t miss the moment", category: "SPACE EVENTS", copy: "Rocket launches, mission milestones, and reasons to look up.", href: "/events", action: "Open the calendar", icon: "Events", style: "events" },
  { title: "Meet tonight’s Moon", category: "LUNAR OBSERVATORY", copy: "Follow the phases. Find the light. Plan a better night outside.", href: "/moon", action: "Explore the Moon", icon: "Moon", style: "moon" },
  { title: "Our cosmic neighbours", category: "ASTEROID WATCH", copy: "Follow near-Earth objects, with the science that puts each approach in perspective.", href: "/asteroids", action: "Track near-Earth objects", icon: "Asteroid Watch", style: "asteroids" }
] as const;

export function CoreTools({ moon }: { moon: MoonData }) {
  return (
    <section id="explore" className="explore-section" aria-labelledby="explore-title">
      <div className="explore-heading">
        <div><p className="eyebrow mb-3">Follow your curiosity</p><h2 id="explore-title">There’s more out there.</h2></div>
        <p>Pick a rabbit hole.<br />See where it takes you.</p>
      </div>
      <div className="discovery-grid">
        {tools.map((tool, index) => (
          <Link href={tool.href} key={tool.href} className={`discovery-card discovery-card-${tool.style}`}>
            <div className="discovery-card-top"><span className="tool-icon"><NavIcon label={tool.icon} className="h-5 w-5" /></span><span className="tool-number">0{index + 1}</span></div>
            {tool.style === "moon" && <div className="tool-moon" aria-hidden="true"><MoonPhaseVisual phaseName={moon.phaseName} illuminationPercent={moon.illuminationPercent} size="md" /></div>}
            <div className="discovery-card-content"><p className="tool-category">{tool.category}</p><h3>{tool.title}</h3><p className="tool-description">{tool.copy}</p></div>
            <span className="tool-action">{tool.action}<span className="tool-arrow"><ArrowIcon diagonal /></span></span>
            {tool.style === "gallery" && <span className="gallery-card-credit">N44 · NASA, ESA/Hubble, D. Gouliermis</span>}
          </Link>
        ))}
      </div>
      <Link href="/ask" className="ask-invitation">
        <div className="ask-symbol" aria-hidden="true">✳</div>
        <div className="ask-invitation-copy"><p className="eyebrow mb-2">Meet your cosmic co-pilot</p><h3>Good questions open up new worlds.</h3><p>Black holes, blue moons, or the big bang. Ask away.</p></div>
        <span className="cosmic-primary inline-flex min-h-12 shrink-0 items-center justify-center gap-5 rounded-full px-6 text-sm font-semibold">Ask Astroboat<ArrowIcon diagonal /></span>
      </Link>
    </section>
  );
}
