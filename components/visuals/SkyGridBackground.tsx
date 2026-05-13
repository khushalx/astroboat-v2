export function SkyGridBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="star-field absolute inset-0 opacity-70" />
      <div className="orbital-field absolute inset-0 opacity-55" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-astro-blue/20 to-transparent" />
    </div>
  );
}
