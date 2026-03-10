interface BarItem {
  label: string;
  value: number;
  subLabel?: string;
}

interface BarChartProps {
  items: BarItem[];
  color?: "blue" | "amber" | "emerald" | "purple" | "primary";
  showValue?: boolean;
  maxValue?: number;
}

const COLOR_CLASSES: Record<string, string> = {
  blue: "bg-blue-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  purple: "bg-purple-500",
  primary: "bg-primary",
};

export function BarChart({
  items,
  color = "primary",
  showValue = true,
  maxValue,
}: BarChartProps) {
  const max = maxValue ?? Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const pct = Math.round((item.value / max) * 100);
        return (
          <div key={item.label} className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-right text-xs font-medium text-muted-foreground">
              {item.label}
            </div>
            <div className="flex-1 overflow-hidden rounded-full bg-muted/40 h-5">
              <div
                className={`h-full rounded-full ${COLOR_CLASSES[color]} transition-all`}
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
            {showValue && (
              <div className="w-10 shrink-0 text-xs font-semibold text-foreground">
                {item.value}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
