import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatTileProps {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}

export function StatTile({
  label,
  value,
  unit,
  sub,
  icon: Icon,
  className,
  children,
}: StatTileProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-4 shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">
        {value}
        {unit && (
          <span className="ml-1 text-base font-normal text-muted-foreground">
            {unit}
          </span>
        )}
      </p>
      {sub && (
        <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      )}
      {children}
    </div>
  );
}
