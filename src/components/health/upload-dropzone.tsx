"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { parsePdfFile, parseHealthReportText, createHealthReportFromParsed, countParsedFields } from "@/lib/health-pdf-parser";
import type { HealthReport } from "@/types/health";

interface UploadDropzoneProps {
  onParsed: (report: HealthReport) => void;
}

export function UploadDropzone({ onParsed }: UploadDropzoneProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        setError("กรุณาอัปโหลดไฟล์ PDF เท่านั้น");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const text = await parsePdfFile(file);
        const parsed = parseHealthReportText(text);
        const fieldCount = countParsedFields(parsed);
        if (fieldCount === 0) {
          setError(
            "อ่านไฟล์ได้แต่ดึงค่าไม่ครบ — กรุณาตรวจสอบและกรอกข้อมูลในหน้าถัดไป"
          );
        }
        const report = createHealthReportFromParsed(parsed);
        onParsed(report);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "ไม่สามารถอ่านไฟล์ PDF ได้";
        setError(`${message} — ลองใหม่หรือกรอกข้อมูลเอง`);
        console.error("PDF parse error:", err);
      } finally {
        setLoading(false);
      }
    },
    [onParsed]
  );

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-colors",
        dragOver ? "border-primary bg-primary/5" : "border-border",
        loading && "pointer-events-none opacity-60"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
    >
      {loading ? (
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      ) : (
        <Upload className="h-10 w-10 text-muted-foreground" />
      )}
      <p className="mt-3 text-center text-base font-medium">
        ลากไฟล์ PDF รายงานสุขภาพมาวางที่นี่
      </p>
      <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
        ข้อมูลจะถูกประมวลผลในเครื่องของคุณเท่านั้น ไม่ส่งออกนอกเครื่อง
      </p>
      <label className="mt-4 cursor-pointer">
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <span className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-base text-primary-foreground">
          <FileText className="h-4 w-4" />
          เลือกไฟล์ PDF
        </span>
      </label>
      {error && (
        <p className="mt-3 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
