export const Marquee = () => {
  const items = [
    "/// SHIP YOUR REP ///",
    "DROP A PDF • PASTE A REPO • COMPILE //",
    "ZERO TEMPLATES //",
    "REAL-TIME PREVIEW //",
    "PUBLIC URL IN MINUTES //",
    "BUILT FOR DEVELOPERS WHO LET THE WORK SPEAK //",
  ];
  return (
    <div className="bg-accent border-y-4 border-foreground py-3 overflow-hidden">
      <div className="animate-marquee flex gap-10 whitespace-nowrap text-foreground font-bold text-sm uppercase tracking-widest">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
};
