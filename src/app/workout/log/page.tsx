"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Flame, Timer, HeartPulse, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ResultUploadDropzone } from "@/components/workout/result-upload-dropzone";
import { ResultReviewForm } from "@/components/workout/result-review-form";
import { useWorkoutLogStore } from "@/stores/workout-log-store";
import type { WorkoutResultLog } from "@/types/workout-log";
import type { ParsedWorkoutResult } from "@/lib/workout-result-ocr";

function formatDuration(seconds?: number): string {
  if (!seconds) return "-";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0
    ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    : `${m}:${s.toString().padStart(2, "0")}`;
}

export default function WorkoutLogPage() {
  const { logs, addLog, removeLog } = useWorkoutLogStore();
  const [draft, setDraft] = useState<WorkoutResultLog | null>(null);

  const handleParsed = (imageDataUrl: string, parsed: ParsedWorkoutResult) => {
    setDraft({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      imageDataUrl,
      ...parsed,
    });
  };

  const save = () => {
    if (!draft) return;
    addLog(draft);
    setDraft(null);
  };

  return (
    <div className="space-y-6">
      <Link href="/workout">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-1 h-4 w-4" />
          กลับ
        </Button>
      </Link>

      <PageHeader
        title="บันทึกผลการออกกำลังกาย"
        description="อัปโหลดรูปสรุปผลจากนาฬิกา/แอปสุขภาพ แล้วตรวจสอบตัวเลขก่อนบันทึก"
      />

      {draft ? (
        <div className="space-y-4">
          <div className="mx-auto h-56 w-full max-w-xs overflow-hidden rounded-2xl bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element -- local data URL, no benefit from next/image */}
            <img
              src={draft.imageDataUrl}
              alt="ผลการออกกำลังกาย"
              className="h-full w-full object-contain"
            />
          </div>
          <ResultReviewForm log={draft} onChange={setDraft} />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setDraft(null)}>
              ยกเลิก
            </Button>
            <Button className="flex-1" onClick={save}>
              บันทึก
            </Button>
          </div>
        </div>
      ) : (
        <ResultUploadDropzone onParsed={handleParsed} />
      )}

      <Section title="ประวัติที่บันทึกไว้" description={`${logs.length} รายการ`}>
        {logs.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            ยังไม่มีบันทึกผล
          </p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex gap-3 rounded-2xl border border-border/80 bg-card p-3"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local data URL, no benefit from next/image */}
                  <img
                    src={log.imageDataUrl}
                    alt={log.activityName ?? "ผลการออกกำลังกาย"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">
                      {log.activityName ?? "ออกกำลังกาย"}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeLog(log.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="ลบ"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(log.createdAt), "d MMM yyyy HH:mm")}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {log.calories !== undefined && (
                      <span className="inline-flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5" /> {log.calories} kcal
                      </span>
                    )}
                    {log.durationSeconds !== undefined && (
                      <span className="inline-flex items-center gap-1">
                        <Timer className="h-3.5 w-3.5" />
                        {formatDuration(log.durationSeconds)}
                      </span>
                    )}
                    {log.avgHeartRate !== undefined && (
                      <span className="inline-flex items-center gap-1">
                        <HeartPulse className="h-3.5 w-3.5" /> {log.avgHeartRate} bpm
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
