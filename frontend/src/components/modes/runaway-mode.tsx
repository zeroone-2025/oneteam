"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { useVolumeStore } from "@/stores/use-volume-store";

const BAR_WIDTH = 300;
const BAR_HEIGHT = 48;
const DETECT_RANGE = 180;

export function RunawayMode() {
  const { sliderValue, setSliderValue, setActualVolume } = useVolumeStore();
  const [caught, setCaught] = useState(false);
  const isMoving = useRef(false);

  // absolute pixel position on viewport
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  // initialize to center of viewport
  useEffect(() => {
    setPos({
      x: (window.innerWidth - BAR_WIDTH) / 2,
      y: (window.innerHeight - BAR_HEIGHT) / 2,
    });
  }, []);

  useEffect(() => {
    if (caught || !pos) return;

    const onMove = (e: PointerEvent) => {
      if (isMoving.current) return;

      const cx = pos.x + BAR_WIDTH / 2;
      const cy = pos.y + BAR_HEIGHT / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < DETECT_RANGE) {
        isMoving.current = true;

        const angle = Math.atan2(dy, dx);
        const force = 150 + Math.random() * 100;
        const pad = 16;

        setPos((prev) => {
          if (!prev) return prev;
          let nx = prev.x - Math.cos(angle) * force;
          let ny = prev.y - Math.sin(angle) * force;

          // keep inside viewport
          nx = Math.max(pad, Math.min(window.innerWidth - BAR_WIDTH - pad, nx));
          ny = Math.max(pad, Math.min(window.innerHeight - BAR_HEIGHT - pad, ny));
          return { x: nx, y: ny };
        });

        setTimeout(() => {
          isMoving.current = false;
        }, 180);
      }
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [caught, pos]);

  const handlePointerDown = useCallback(() => {
    if (!caught) {
      setCaught(true);
    }
  }, [caught]);

  const handleChange = (value: number) => {
    setSliderValue(value);
    setActualVolume(value);
  };

  // before position is initialized, render nothing floating
  if (!pos) return <div className="py-6" />;

  // caught: render inline normally
  if (caught) {
    return (
      <div className="py-6 space-y-4">
        <div className="px-2">
          <Slider
            value={[sliderValue]}
            min={0}
            max={100}
            onValueChange={(val) => handleChange(Array.isArray(val) ? val[0] : val)}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* placeholder to keep layout */}
      <div className="py-6" />

      {/* floating runaway bar */}
      <div
        onPointerDown={handlePointerDown}
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: BAR_WIDTH,
          zIndex: 9999,
          transition: "left 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        className="bg-background border border-border rounded-xl px-4 py-3 shadow-lg"
      >
        <Slider
          value={[sliderValue]}
          min={0}
          max={100}
          onValueChange={(val) => handleChange(Array.isArray(val) ? val[0] : val)}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    </>
  );
}
