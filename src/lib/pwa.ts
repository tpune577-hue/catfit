export function getPwaDisplayMode(): "standalone" | "fullscreen" | "browser" | "minimal-ui" | "unknown" {
  if (typeof window === "undefined") return "unknown";

  const modes = ["fullscreen", "standalone", "minimal-ui", "browser"] as const;
  for (const mode of modes) {
    if (window.matchMedia(`(display-mode: ${mode})`).matches) return mode;
  }

  if (
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  ) {
    return "standalone";
  }

  return "browser";
}

export function isInstalledPwa() {
  const mode = getPwaDisplayMode();
  return mode === "standalone" || mode === "fullscreen";
}

export function isIosDevice() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) &&
    !(window as Window & { MSStream?: unknown }).MSStream
  );
}

export async function getServiceWorkerStatus(): Promise<
  "active" | "installing" | "none" | "unsupported"
> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return "unsupported";
  }

  const registration = await navigator.serviceWorker.getRegistration("/");
  if (!registration) return "none";
  if (registration.active) return "active";
  if (registration.installing || registration.waiting) return "installing";
  return "none";
}

export function isAndroidDevice() {
  if (typeof window === "undefined") return false;
  return /Android/i.test(window.navigator.userAgent);
}

export function isIosChrome() {
  if (!isIosDevice()) return false;
  return /CriOS/.test(window.navigator.userAgent);
}
