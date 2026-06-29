"use client";

import { useEffect, useState } from "react";
import {
  getPwaDisplayMode,
  getServiceWorkerStatus,
  isInstalledPwa,
} from "@/lib/pwa";

const MODE_LABEL: Record<string, string> = {
  standalone: "แอปเต็มจอ (ถูกต้อง)",
  fullscreen: "แอปเต็มจอ (ถูกต้อง)",
  browser: "เปิดในเบราว์เซอร์ (มีแถบ Chrome)",
  "minimal-ui": "โหมด minimal-ui (มีแถบค้นหา)",
  unknown: "ไม่ทราบ",
};

const SW_LABEL: Record<string, string> = {
  active: "พร้อมติดตั้งแอป",
  installing: "กำลังติดตั้ง offline mode...",
  none: "ยังไม่พร้อม — รีเฟรชหน้าแล้วลองใหม่",
  unsupported: "เบราว์เซอร์ไม่รองรับ",
};

export function PwaStatusCard() {
  const [mode, setMode] = useState("unknown");
  const [swStatus, setSwStatus] = useState("unsupported");

  useEffect(() => {
    setMode(getPwaDisplayMode());
    void getServiceWorkerStatus().then(setSwStatus);
  }, []);

  const ok = isInstalledPwa();

  return (
    <div
      className={
        ok
          ? "space-y-1 rounded-lg bg-primary/10 px-3 py-2 text-sm text-foreground"
          : "space-y-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950"
      }
    >
      <p>
        โหมดปัจจุบัน: <strong>{MODE_LABEL[mode] ?? mode}</strong>
      </p>
      <p>
        Service Worker: <strong>{SW_LABEL[swStatus] ?? swStatus}</strong>
      </p>
      {!ok && (
        <p>
          ถ้ายังเห็นแถบค้นหา: ลบไอคอน CatFit เก่า → เปิด{" "}
          <strong>catfit-lime.vercel.app</strong> ใน Chrome → เมนู ⋮ →{" "}
          <strong>Install app</strong> (ไม่ใช่ Add to Home screen ธรรมดา)
        </p>
      )}
    </div>
  );
}
