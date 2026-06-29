import type { HealthFinding } from "@/types/health";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const severityStyles = {
  normal:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-100",
  borderline:
    "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100",
  high: "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-100",
};

const severityLabel = {
  normal: "ปกติ",
  borderline: "ควรติดตาม",
  high: "ต้องแก้ไข",
};

export function FindingBadge({ finding }: { finding: HealthFinding }) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        severityStyles[finding.severity]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-semibold leading-snug">{finding.label}</p>
        <Badge
          variant="outline"
          className="shrink-0 border-current/20 bg-white/50 text-xs font-medium"
        >
          {severityLabel[finding.severity]}
        </Badge>
      </div>
      {finding.value > 0 && (
        <p className="mt-2 text-sm leading-relaxed opacity-90">
          ค่า {finding.value} {finding.unit} · ปกติ {finding.normalRange}
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed">{finding.recommendation}</p>
    </div>
  );
}

export function FindingCards({ findings }: { findings: HealthFinding[] }) {
  if (findings.length === 0) {
    return (
      <p className="text-base text-muted-foreground">ไม่พบประเด็นที่ต้องแก้ไข</p>
    );
  }
  return (
    <div className="space-y-3">
      {findings.map((f) => (
        <FindingBadge key={f.id} finding={f} />
      ))}
    </div>
  );
}
