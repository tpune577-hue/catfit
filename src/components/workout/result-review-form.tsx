"use client";

import type { WorkoutResultLog } from "@/types/workout-log";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Field({
  label,
  value,
  onChange,
  unit,
  type = "number",
}: {
  label: string;
  value?: number | string;
  onChange: (v: string) => void;
  unit?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-9"
        />
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
}

function parseDuration(text: string): number | undefined {
  const parts = text.split(":").map((p) => Number(p));
  if (parts.some(Number.isNaN) || parts.length === 0) return undefined;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0];
}

export function ResultReviewForm({
  log,
  onChange,
}: {
  log: WorkoutResultLog;
  onChange: (log: WorkoutResultLog) => void;
}) {
  const update = (partial: Partial<WorkoutResultLog>) =>
    onChange({ ...log, ...partial });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">ตรวจสอบผลก่อนบันทึก</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Field
          label="ชื่อกิจกรรม"
          type="text"
          value={log.activityName}
          onChange={(v) => update({ activityName: v || undefined })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="แคลอรี่"
            value={log.calories}
            onChange={(v) => update({ calories: v ? Math.round(Number(v)) : undefined })}
            unit="kcal"
          />
          <Field
            label="ระยะเวลา (ชม:นาที:วินาที)"
            type="text"
            value={formatDuration(log.durationSeconds)}
            onChange={(v) => update({ durationSeconds: parseDuration(v) })}
          />
          <Field
            label="หัวใจเฉลี่ย"
            value={log.avgHeartRate}
            onChange={(v) => update({ avgHeartRate: v ? Math.round(Number(v)) : undefined })}
            unit="bpm"
          />
          <Field
            label="หัวใจสูงสุด"
            value={log.maxHeartRate}
            onChange={(v) => update({ maxHeartRate: v ? Math.round(Number(v)) : undefined })}
            unit="bpm"
          />
          <Field
            label="ก้าว"
            value={log.steps}
            onChange={(v) => update({ steps: v ? Math.round(Number(v)) : undefined })}
          />
        </div>
        <Field
          label="โน้ต"
          type="text"
          value={log.note}
          onChange={(v) => update({ note: v || undefined })}
        />
      </CardContent>
    </Card>
  );
}
