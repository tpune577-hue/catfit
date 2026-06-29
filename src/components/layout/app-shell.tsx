"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Dumbbell,
  Apple,
  Activity,
  FileHeart,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "หน้าหลัก", shortLabel: "หลัก", icon: Home },
  { href: "/workout", label: "ออกกำลังกาย", shortLabel: "ออกกำลัง", icon: Dumbbell },
  { href: "/nutrition", label: "โภชนาการ", shortLabel: "อาหาร", icon: Apple },
  { href: "/body", label: "ร่างกาย", shortLabel: "ร่างกาย", icon: Activity },
  { href: "/health", label: "สุขภาพ", shortLabel: "สุขภาพ", icon: FileHeart },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname.startsWith("/onboarding");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4 sm:px-5">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-primary"
          >
            FitTrack
          </Link>
          <Link
            href="/settings"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="ตั้งค่า"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-5 pb-28 sm:px-5">
        {children}
      </main>

      {!hideNav && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md supports-[backdrop-filter]:bg-background/90"
          aria-label="เมนูหลัก"
        >
          <div className="mx-auto grid max-w-lg grid-cols-5 gap-0 px-1 pt-1">
            {navItems.map(({ href, label, shortLabel, icon: Icon }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium transition-colors sm:text-xs",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.25 : 2} />
                  <span className="max-w-full truncate leading-none">
                    <span className="hidden min-[380px]:inline">{label}</span>
                    <span className="min-[380px]:hidden">{shortLabel}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
