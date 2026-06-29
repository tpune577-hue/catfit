"use client";

import Link from "next/link";
import { Plus, FileHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FindingCards } from "@/components/health/finding-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { useHealthStore } from "@/stores/health-store";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";

export default function HealthPage() {
  const reports = useHealthStore((s) => s.reports);
  const latestAnalysis = useHealthStore((s) => s.latestAnalysis);

  return (
    <div className="space-y-6">
      <PageHeader
        title="สุขภาพ"
        description="รายงานตรวจและประเด็นที่ต้องติดตาม"
        action={
          <Link href="/health/upload">
            <Button size="default" className="h-10 gap-1.5">
              <Plus className="h-4 w-4" />
              อัปโหลด
            </Button>
          </Link>
        }
      />

      {latestAnalysis && (
        <Section title="สรุปผลวิเคราะห์">
          <p className="mb-3 text-base leading-relaxed text-muted-foreground">
            {latestAnalysis.summary}
          </p>
          <FindingCards findings={latestAnalysis.findings} />
        </Section>
      )}

      {reports.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-14 text-center">
          <FileHeart className="h-12 w-12 text-muted-foreground/70" />
          <p className="mt-4 text-base font-medium">ยังไม่มีรายงานสุขภาพ</p>
          <p className="mt-1 text-sm text-muted-foreground">
            อัปโหลด PDF จากการตรวจสุขภาพเพื่อปรับแผนอัตโนมัติ
          </p>
          <Link href="/health/upload" className="mt-6">
            <Button size="lg" className="h-11">
              อัปโหลดรายงาน PDF
            </Button>
          </Link>
        </div>
      ) : (
        <Section title="ประวัติรายงาน">
          <div className="space-y-2">
            {reports.map((r) => (
              <Link key={r.id} href={`/health/${r.id}`}>
                <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-accent/40">
                  <div>
                    <p className="text-base font-medium">รายงานตรวจสุขภาพ</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {r.examDate ??
                        format(parseISO(r.uploadedAt), "d MMM yyyy", {
                          locale: th,
                        })}
                    </p>
                  </div>
                  <div className="text-right text-sm tabular-nums">
                    {r.weight && <p className="font-medium">{r.weight} kg</p>}
                    {r.bmi && (
                      <p className="text-muted-foreground">BMI {r.bmi}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
