"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FindingCards } from "@/components/health/finding-badge";
import { useHealthStore } from "@/stores/health-store";
import { analyzeHealthReport } from "@/lib/health-analyzer";

export default function HealthReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const reports = useHealthStore((s) => s.reports);
  const report = reports.find((r) => r.id === id);
  const analysis = report ? analyzeHealthReport(report) : null;

  if (!report) {
    return (
      <div className="text-center py-12">
        <p>ไม่พบรายงาน</p>
        <Link href="/health">
          <Button variant="link">กลับ</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link href="/health">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-1 h-4 w-4" />
          กลับ
        </Button>
      </Link>

      <h1 className="text-xl font-bold">รายงานสุขภาพ</h1>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">ข้อมูลพื้นฐาน</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 text-sm">
          {report.weight && <p>น้ำหนัก: {report.weight} kg</p>}
          {report.height && <p>ส่วนสูง: {report.height} cm</p>}
          {report.bmi && <p>BMI: {report.bmi}</p>}
          {report.waist && <p>รอบเอว: {report.waist} cm</p>}
          {report.labs.fastingGlucose && (
            <p>น้ำตาล: {report.labs.fastingGlucose} mg/dL</p>
          )}
          {report.labs.totalCholesterol && (
            <p>คอเลสเตอรอล: {report.labs.totalCholesterol} mg/dL</p>
          )}
          {report.labs.ldl && <p>LDL: {report.labs.ldl} mg/dL</p>}
          {report.labs.hdl && <p>HDL: {report.labs.hdl} mg/dL</p>}
        </CardContent>
      </Card>

      {analysis && <FindingCards findings={analysis.findings} />}
    </div>
  );
}
