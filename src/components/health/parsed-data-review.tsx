"use client";

import type { HealthReport } from "@/types/health";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ParsedDataReviewProps {
  report: HealthReport;
  onChange: (report: HealthReport) => void;
}

function Field({
  label,
  value,
  onChange,
  unit,
}: {
  label: string;
  value?: number | string;
  onChange: (v: string) => void;
  unit?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-9"
        />
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

export function ParsedDataReview({ report, onChange }: ParsedDataReviewProps) {
  const update = (partial: Partial<HealthReport>) =>
    onChange({ ...report, ...partial });

  const updateLab = (key: keyof HealthReport["labs"], val: string) =>
    onChange({
      ...report,
      labs: { ...report.labs, [key]: val ? parseFloat(val) : undefined },
    });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">ข้อมูลพื้นฐาน</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Field label="อายุ" value={report.age} onChange={(v) => update({ age: parseInt(v) || undefined })} unit="ปี" />
          <Field label="น้ำหนัก" value={report.weight} onChange={(v) => update({ weight: parseFloat(v) || undefined })} unit="kg" />
          <Field label="ส่วนสูง" value={report.height} onChange={(v) => update({ height: parseFloat(v) || undefined })} unit="cm" />
          <Field label="BMI" value={report.bmi} onChange={(v) => update({ bmi: parseFloat(v) || undefined })} />
          <Field label="รอบเอว" value={report.waist} onChange={(v) => update({ waist: parseFloat(v) || undefined })} unit="cm" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">ผลตรวจเลือด</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Field label="น้ำตาล" value={report.labs.fastingGlucose} onChange={(v) => updateLab("fastingGlucose", v)} unit="mg/dL" />
          <Field label="คอเลสเตอรอลรวม" value={report.labs.totalCholesterol} onChange={(v) => updateLab("totalCholesterol", v)} unit="mg/dL" />
          <Field label="HDL" value={report.labs.hdl} onChange={(v) => updateLab("hdl", v)} unit="mg/dL" />
          <Field label="LDL" value={report.labs.ldl} onChange={(v) => updateLab("ldl", v)} unit="mg/dL" />
          <Field label="ไตรกลีเซอไรด์" value={report.labs.triglycerides} onChange={(v) => updateLab("triglycerides", v)} unit="mg/dL" />
        </CardContent>
      </Card>
    </div>
  );
}
