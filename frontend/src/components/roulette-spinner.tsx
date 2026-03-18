"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useVolumeStore } from "@/stores/use-volume-store";
import { CenterToast } from "@/components/center-toast";

// 12 slices on the wheel
const SLICES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 5, 15, 25, 35, 45, 55, 65, 75, 85, 95];
const SLICE_COUNT = SLICES.length;
const SLICE_ANGLE = 360 / SLICE_COUNT;

const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e", "#14b8a6",
  "#a855f7", "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e",
  "#14b8a6",
];

export function RouletteSpinner() {
  const { rouletteState, setRouletteState, setRouletteResult, setActualVolume, setSliderValue } =
    useVolumeStore();
  const [rotation, setRotation] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const animRef = useRef<number | null>(null);
  const startTime = useRef(0);
  const totalSpin = useRef(0);

  const spin = useCallback(() => {
    // pick random result
    const resultIndex = Math.floor(Math.random() * SLICE_COUNT);
    const result = SLICES[resultIndex];

    // target rotation: several full rotations + land on the slice
    // pointer is at top (0°), slice center is at resultIndex * SLICE_ANGLE
    // we want that slice at top, so rotate = -(resultIndex * SLICE_ANGLE) mod 360
    const targetSliceAngle = resultIndex * SLICE_ANGLE;
    const fullRotations = 360 * (5 + Math.floor(Math.random() * 3)); // 5-7 full spins
    const target = fullRotations + (360 - targetSliceAngle);

    totalSpin.current = target;
    startTime.current = performance.now();
    const duration = 4000; // 4 seconds
    const startRotation = rotation;

    const animate = (now: number) => {
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startRotation + totalSpin.current * eased;
      setRotation(current);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setRouletteResult(result);
        setActualVolume(result);
        setSliderValue(result);
        setRouletteState("done");
        setToastMsg(`축하드립니다! 볼륨 ${result}에 당첨되었어요 🎉`);
        // auto-close after showing result
        setTimeout(() => {
          setRouletteState("idle");
        }, 2500);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [rotation, setRouletteState, setRouletteResult, setActualVolume, setSliderValue]);

  useEffect(() => {
    if (rouletteState === "spinning") {
      spin();
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rouletteState]);

  // Build SVG wheel
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  const slicePath = (index: number) => {
    const startAngle = (index * SLICE_ANGLE - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * SLICE_ANGLE - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = SLICE_ANGLE > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const labelPos = (index: number) => {
    const midAngle = ((index + 0.5) * SLICE_ANGLE - 90) * (Math.PI / 180);
    return {
      x: cx + r * 0.65 * Math.cos(midAngle),
      y: cy + r * 0.65 * Math.sin(midAngle),
    };
  };

  return (
    <>
      {/* Fullscreen overlay */}
      <div className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/50">
        <div className="flex flex-col items-center gap-3">
          {/* Pointer */}
          <div className="text-3xl leading-none text-white drop-shadow-lg">▼</div>

          {/* Wheel */}
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="drop-shadow-2xl"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {SLICES.map((val, i) => {
              const pos = labelPos(i);
              return (
                <g key={i}>
                  <path d={slicePath(i)} fill={COLORS[i]} stroke="white" strokeWidth={1.5} />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize={11}
                    fontWeight="bold"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                  >
                    {val}
                  </text>
                </g>
              );
            })}
            {/* Center circle */}
            <circle cx={cx} cy={cy} r={18} fill="white" stroke="#e5e7eb" strokeWidth={2} />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="bold" fill="#374151">
              VOL
            </text>
          </svg>

          {rouletteState === "done" && (
            <p className="text-base font-bold text-white mt-2">결과가 나왔습니다!</p>
          )}
        </div>
      </div>
      <CenterToast message={toastMsg} onDone={() => setToastMsg(null)} />
    </>
  );
}
