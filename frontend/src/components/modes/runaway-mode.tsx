"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { useVolumeStore } from "@/stores/use-volume-store";

export function RunawayMode() {
  const { sliderValue, setSliderValue, setActualVolume } = useVolumeStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [caught, setCaught] = useState(false);
  const pointerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMove = (e: PointerEvent) => {
      pointerPos.current = { x: e.clientX, y: e.clientY };

      if (caught || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        const angle = Math.atan2(dy, dx);
        const flee = 80 + Math.random() * 60;
        const maxX = window.innerWidth / 2 - rect.width / 2 - 20;
        const maxY = window.innerHeight / 2 - rect.height / 2 - 20;

        setOffset((prev) => ({
          x: Math.max(-maxX, Math.min(maxX, prev.x - Math.cos(angle) * flee)),
          y: Math.max(-maxY, Math.min(maxY, prev.y - Math.sin(angle) * flee)),
        }));
      }
    };

    window.addEventListener("pointermove", handleGlobalMove);
    return () => window.removeEventListener("pointermove", handleGlobalMove);
  }, [caught]);

  const handlePointerDown = useCallback(() => {
    if (!caught) {
      setCaught(true);
      setOffset({ x: 0, y: 0 });
    }
  }, [caught]);

  const handleChange = (value: number) => {
    setSliderValue(value);
    setActualVolume(value);
  };

  return (
    <div
      ref={containerRef}
      className="py-6 space-y-4 transition-transform duration-150 ease-out"
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      onPointerDown={handlePointerDown}
    >
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
