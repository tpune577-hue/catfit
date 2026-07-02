"use client";

import { useState } from "react";
import Image from "next/image";
import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExerciseImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <Dumbbell className="h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn("object-cover", className)}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
