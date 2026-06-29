"use client";

interface MacroRingProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  color?: string;
}

export function MacroRing({
  label,
  current,
  target,
  unit = "g",
  color = "stroke-primary",
}: MacroRingProps) {
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="88" height="88" className="-rotate-90">
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-muted"
        />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <p className="mt-1 text-xs font-medium">{label}</p>
      <p className="text-[10px] text-muted-foreground">
        {Math.round(current)}/{target}
        {unit}
      </p>
    </div>
  );
}
