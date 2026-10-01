export function SkyGridBackground() {
  return (
    <div aria-hidden="true" className="cosmic-background pointer-events-none">
      <div className="star-field-distant" />
      <div className="star-field-near" />
      <div className="constellation-lines" />
    </div>
  );
}
