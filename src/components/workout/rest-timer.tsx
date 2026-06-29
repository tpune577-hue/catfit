"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function RestTimer({ seconds, onComplete }: { seconds: number; onComplete: () => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          onComplete();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, remaining, onComplete]);

  const pct = ((seconds - remaining) / seconds) * 100;

  return (
    <div className="rounded-lg border p-4 text-center">
      <p className="text-sm text-muted-foreground">พักระหว่างเซ็ต</p>
      <p className="my-2 text-4xl font-bold tabular-nums">{remaining}s</p>
      <Progress value={pct} className="mb-3" />
      {!running ? (
        <Button onClick={() => { setRemaining(seconds); setRunning(true); }}>
          เริ่มจับเวลา
        </Button>
      ) : (
        <Button variant="outline" onClick={() => setRunning(false)}>
          หยุด
        </Button>
      )}
    </div>
  );
}
