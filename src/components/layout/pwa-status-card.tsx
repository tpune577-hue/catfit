"use client";

import { useEffect, useState } from "react";
import { getPwaDisplayMode, isInstalledPwa } from "@/lib/pwa";

const MODE_LABEL: Record<string, string> = {
  standalone: "แอปเต็มจอ (ถูกต้อง)",
  fullscreen: "แอปเต็มจอ (ถูกต้อง)",
  browser: "เปิดในเบราว์เซอร์ (มีแถบ Chrome)",
  "minimal-ui": "โหมด minimal-ui (มีแถบค้นหา)",
  unknown: "ไม่ทราบ",
};

export function PwaStatusCard() {
  const [mode, setMode] = useState("unknown");

  useEffect(() => {
    setMode(getPwaDisplayMode());
  }, []);

  const ok = isInstalledPwa();

  return (
    <p
      className={
        ok
          ? "rounded-lg bg-primary/10 px-3 py-2 text-sm text-foreground"
          : "rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950"
      }
    >
      โหมดปัจจุบัน: <strong>{MODE_LABEL[mode] ?? mode}</strong>
      {!ok && (
        <>
          <br />
          ถ้ายังเห็นแถบค้นหา ให้ลบไอคอนเดิม ติดตั้งใหม่ แล้วเปิดจากไอคอน CatFit
        </>
      )}
    </p>
  );
}
