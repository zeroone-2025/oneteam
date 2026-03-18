"use client";

import { Slider } from "@/components/ui/slider";
import { useVolumeStore } from "@/stores/use-volume-store";
import { RouletteSpinner } from "@/components/roulette-spinner";

export function RouletteMode() {
  const { sliderValue, setSliderValue, setRouletteState, rouletteState } = useVolumeStore();

  const handleChange = (value: number) => {
    if (rouletteState === "spinning") return;
    setSliderValue(value);
  };

  const handlePointerUp = () => {
    if (rouletteState === "spinning") return;
    setRouletteState("spinning");
  };

  return (
    <div className="py-6 space-y-4">
      <div className="px-2" onPointerUp={handlePointerUp}>
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
      <RouletteSpinner />
    </div>
  );
}
