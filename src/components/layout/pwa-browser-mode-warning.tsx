"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { isInstalledPwa } from "@/lib/pwa";

export function PwaBrowserModeWarning() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!isInstalledPwa());
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 px-4">
      <div className="mx-auto flex max-w-lg items-start gap-2 rounded-lg border border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-950 shadow-lg">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          ยังเปิดแบบ Chrome อยู่ (มีแถบค้นหา) — ลบไอคอนเก่า แล้วติดตั้งใหม่ผ่าน{" "}
          <strong>Install app</strong> จากเมนู Chrome
        </p>
      </div>
    </div>
  );
}
