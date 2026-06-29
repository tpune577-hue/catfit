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
        "rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
            <Icon className="h-4 w-4 text-foreground" aria-hidden />
          </span>
        )}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight">
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
