"use client";

import { useRef, useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { useVolumeStore } from "@/stores/use-volume-store";

export function RunawayMode() {
  const { sliderValue, setSliderValue, setActualVolume } = useVolumeStore();
  const barRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [caught, setCaught] = useState(false);
  const isMoving = useRef(false);

  useEffect(() => {
    if (caught) return;

    const onMove = (e: PointerEvent) => {
      if (!barRef.current || isMoving.current) return;

      const rect = barRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        isMoving.current = true;

        // flee direction: away from pointer
        const angle = Math.atan2(dy, dx);
        const force = 120 + Math.random() * 80;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const limitX = vw / 2 - rect.width / 2 - 16;
        const limitY = vh / 2 - rect.height / 2 - 16;

        setPos((prev) => {
          let nx = prev.x - Math.cos(angle) * force;
          let ny = prev.y - Math.sin(angle) * force;
          // bounce if hitting edge
          nx = Math.max(-limitX, Math.min(limitX, nx));
          ny = Math.max(-limitY, Math.min(limitY, ny));
          return { x: nx, y: ny };
        });

        // prevent rapid-fire
        setTimeout(() => {
          isMoving.current = false;
        }, 200);
      }
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [caught]);

  const handlePointerDown = () => {
    if (!caught) {
      setCaught(true);
      setPos({ x: 0, y: 0 });
    }
  };

  const handleChange = (value: number) => {
    setSliderValue(value);
    setActualVolume(value);
  };

  return (
    <div
      ref={barRef}
      className="py-6 space-y-4"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
        position: "relative",
        zIndex: caught ? "auto" : 50,
      }}
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
