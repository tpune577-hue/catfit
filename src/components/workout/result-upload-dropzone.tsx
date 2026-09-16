"use client";

import { useCallback, useState } from "react";
import { Upload, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { compressImageFile } from "@/lib/image-compress";
import { recognizeWorkoutResultImage } from "@/lib/workout-result-ocr";
import type { ParsedWorkoutResult } from "@/lib/workout-result-ocr";

interface ResultUploadDropzoneProps {
  onParsed: (imageDataUrl: string, parsed: ParsedWorkoutResult) => void;
}

export function ResultUploadDropzone({ onParsed }: ResultUploadDropzoneProps) {
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        setLoadingLabel("กำลังย่อรูป...");
        const imageDataUrl = await compressImageFile(file);

        setLoadingLabel("กำลังอ่านตัวเลขจากรูป...");
        let parsed: ParsedWorkoutResult = {};
        try {
          const result = await recognizeWorkoutResultImage(file);
          parsed = result.parsed;
        } catch (ocrErr) {
          console.error("OCR error:", ocrErr);
          setError(
            "อ่านตัวเลขจากรูปอัตโนมัติไม่ได้ — กรอกข้อมูลเองในหน้าถัดไป"
          );
        }

        onParsed(imageDataUrl, parsed);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "ไม่สามารถอ่านไฟล์รูปภาพได้";
        setError(message);
        console.error("Image upload error:", err);
      } finally {
        setLoading(false);
        setLoadingLabel("");
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
        ลากรูปผลการออกกำลังกายมาวางที่นี่
      </p>
      <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
        {loading
          ? loadingLabel
          : "เช่น รูปสรุปผลจาก Huawei Health หรือแอปนาฬิกาอื่น ๆ — ระบบจะลองอ่านแคลอรี่ ระยะเวลา และหัวใจให้อัตโนมัติ"}
      </p>
      <label className="mt-4 cursor-pointer">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <span className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-base text-primary-foreground">
          <ImageIcon className="h-4 w-4" />
          เลือกรูปภาพ
        </span>
      </label>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  );
}
