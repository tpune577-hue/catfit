"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getPwaDisplayMode,
  isInstalledPwa,
  isIosChrome,
  isIosDevice,
} from "@/lib/pwa";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [displayMode, setDisplayMode] = useState<string>("browser");
  const [ios, setIos] = useState(false);
  const [iosChrome, setIosChrome] = useState(false);

  useEffect(() => {
    const mode = getPwaDisplayMode();
    setDisplayMode(mode);
    setIos(isIosDevice());
    setIosChrome(isIosChrome());

    if (isInstalledPwa()) return;
    if (sessionStorage.getItem("pwa-install-dismissed") === "1") return;

    setVisible(true);

    const onInstallable = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onInstallable);
    return () => window.removeEventListener("beforeinstallprompt", onInstallable);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("pwa-install-dismissed", "1");
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  };

  if (!visible || isInstalledPwa()) return null;

  const title =
    displayMode === "minimal-ui"
      ? "ยังเปิดแบบมีแถบ Chrome อยู่"
      : "ติดตั้ง CatFit ลงเครื่อง";

  let description = "เมนู Chrome (⋮) → Install app แล้วเปิดจากไอคอนบนหน้าจอ ไม่ใช่แท็บเบราว์เซอร์";

  if (iosChrome) {
    description =
      "บน iPhone ต้องเปิดด้วย Safari แล้วกด Share → Add to Home Screen — Chrome บน iOS ไม่รองรับแอปเต็มจอ";
  } else if (ios) {
    description =
      "กด Share → Add to Home Screen แล้วเปิดจากไอคอน CatFit บนหน้าจอ จะไม่มีแถบ Safari";
  } else if (displayMode === "minimal-ui") {
    description =
      "ลบไอคอนเดิม แล้วติดตั้งใหม่ผ่าน Install app (ไม่ใช่ Add to Home screen แบบ shortcut)";
  } else if (deferredPrompt) {
    description = "กดติดตั้ง แล้วเปิดจากไอคอนหน้าจอ จะไม่มีแถบค้นหา URL";
  }

  return (
    <div className="border-b border-primary/30 bg-secondary px-4 py-3">
      <div className="mx-auto flex max-w-lg items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          {deferredPrompt && !ios && (
            <Button size="sm" className="gap-1" onClick={install}>
              <Download className="h-4 w-4" />
              ติดตั้ง
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={dismiss}
            aria-label="ปิด"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
