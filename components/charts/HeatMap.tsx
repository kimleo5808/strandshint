interface HeatMapCell {
  label: string;
  value: number;
}

interface HeatMapProps {
  cells: HeatMapCell[];
  color?: "blue" | "amber" | "emerald" | "purple";
}

// Interpolate between a light tint and a deep color based on ratio
function getHeatStyle(ratio: number, color: string): React.CSSProperties {
  const palettes: Record<string, [string, string]> = {
    blue: ["#eff6ff", "#1d4ed8"],
    amber: ["#fffbeb", "#b45309"],
    emerald: ["#ecfdf5", "#065f46"],
    purple: ["#faf5ff", "#6b21a8"],
  };
  const [light, dark] = palettes[color] ?? palettes.blue;

  // Simple CSS opacity trick — use the dark color with opacity
  return {
    backgroundColor: dark,
    opacity: 0.15 + ratio * 0.85,
    color: ratio > 0.5 ? "#fff" : "#1e293b",
  };
}

export function HeatMap({ cells, color = "blue" }: HeatMapProps) {
  const max = Math.max(...cells.map((c) => c.value), 1);

  return (
    <div className="grid grid-cols-[repeat(13,1fr)] gap-1 sm:grid-cols-[repeat(13,1fr)]">
      {cells.map((cell) => {
        const ratio = cell.value / max;
        const style = getHeatStyle(ratio, color);
        return (
          <div
            key={cell.label}
            className="flex flex-col items-center justify-center rounded p-1 text-center"
            style={style}
            title={`${cell.label}: ${cell.value}`}
          >
            <span className="text-[10px] font-bold leading-tight">{cell.label}</span>
            <span className="text-[9px] leading-tight opacity-80">{cell.value}</span>
          </div>
        );
      })}
    </div>
  );
}
