interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  accent?: "blue" | "amber" | "emerald" | "purple";
}

const ACCENT_CLASSES: Record<string, string> = {
  blue: "text-blue-500",
  amber: "text-amber-500",
  emerald: "text-emerald-500",
  purple: "text-purple-500",
};

export function StatCard({ label, value, subtext, accent = "blue" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm text-center">
      <div className={`font-heading text-4xl font-bold ${ACCENT_CLASSES[accent]}`}>
        {value}
      </div>
      <div className="mt-1 text-sm font-semibold text-foreground">{label}</div>
      {subtext && (
        <div className="mt-1 text-xs text-muted-foreground">{subtext}</div>
      )}
    </div>
  );
}
