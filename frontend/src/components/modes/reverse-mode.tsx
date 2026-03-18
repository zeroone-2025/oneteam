"use client";

import { Slider } from "@/components/ui/slider";
import { useVolumeStore } from "@/stores/use-volume-store";

export function ReverseMode() {
  const { sliderValue, setSliderValue, setActualVolume } = useVolumeStore();

  const handleChange = (value: number) => {
    setSliderValue(value);
    setActualVolume(100 - value);
  };

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
