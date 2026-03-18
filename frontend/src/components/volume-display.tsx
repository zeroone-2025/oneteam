"use client";

import { Volume2 } from "lucide-react";

interface VolumeDisplayProps {
  sliderValue: number;
  actualVolume: number;
}

export function VolumeDisplay({ actualVolume }: VolumeDisplayProps) {
  return (
    <div className="flex items-center gap-3">
      <Volume2 className="size-5 text-muted-foreground" />
      <span className="text-4xl font-bold tabular-nums">{Math.round(actualVolume)}</span>
    </div>
  );
}
