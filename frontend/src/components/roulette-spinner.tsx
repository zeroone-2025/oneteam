"use client";

import { useEffect, useRef, useState } from "react";
import { useVolumeStore } from "@/stores/use-volume-store";

export function RouletteSpinner() {
  const { rouletteState, setRouletteState, setRouletteResult, setActualVolume, setSliderValue } =
    useVolumeStore();
  const [displayNumber, setDisplayNumber] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (rouletteState === "spinning") {
      intervalRef.current = setInterval(() => {
        setDisplayNumber(Math.floor(Math.random() * 101));
      }, 50);

      const timeout = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        const result = Math.floor(Math.random() * 101);
        setDisplayNumber(result);
        setRouletteResult(result);
        setActualVolume(result);
        setSliderValue(result);
        setRouletteState("done");
      }, 2000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        clearTimeout(timeout);
      };
    }
  }, [rouletteState, setRouletteState, setRouletteResult, setActualVolume, setSliderValue]);

  if (rouletteState === "idle") return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`text-5xl font-bold tabular-nums ${
          rouletteState === "spinning" ? "animate-pulse text-yellow-500" : "text-red-500"
        }`}
      >
        {displayNumber}
      </div>
      <p className="text-sm text-muted-foreground">
        {rouletteState === "spinning" ? "룰렛 돌리는 중..." : "결과가 나왔습니다!"}
      </p>
    </div>
  );
}
