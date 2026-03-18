"use client";

import { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlayButton } from "@/components/play-button";
import { VolumeDisplay } from "@/components/volume-display";
import { ReverseMode } from "@/components/modes/reverse-mode";
import { RouletteMode } from "@/components/modes/roulette-mode";
import { RunawayMode } from "@/components/modes/runaway-mode";
import { useVolumeStore } from "@/stores/use-volume-store";
import { useAudio } from "@/hooks/use-audio";
import type { VolumeMode } from "@/stores/use-volume-store";

const modeMap: Record<number, VolumeMode> = {
  0: "reverse",
  1: "roulette",
  2: "runaway",
};

export default function Home() {
  const { actualVolume, sliderValue, isPlaying, setIsPlaying, setMode } = useVolumeStore();
  const { start, stop, setVolume } = useAudio();

  useEffect(() => {
    setVolume(actualVolume);
  }, [actualVolume, setVolume]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stop();
      setIsPlaying(false);
    } else {
      start();
      setIsPlaying(true);
    }
  };

  const handleTabChange = (value: number | string | null) => {
    if (value !== null && typeof value === "number") {
      setMode(modeMap[value]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* YouTube Player */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black mb-6">
        <div id="yt-player" className="absolute inset-0 w-full h-full" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <PlayButton isPlaying={isPlaying} onToggle={handleTogglePlay} />
        <VolumeDisplay sliderValue={sliderValue} actualVolume={actualVolume} />
      </div>

      {/* Mode Tabs */}
      <Tabs defaultValue={0} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value={0} className="flex-1 flex items-center justify-center gap-1.5">
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">1</span>
            볼륨
          </TabsTrigger>
          <TabsTrigger value={1} className="flex-1 flex items-center justify-center gap-1.5">
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">2</span>
            볼륨
          </TabsTrigger>
          <TabsTrigger value={2} className="flex-1 flex items-center justify-center gap-1.5">
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">3</span>
            볼륨
          </TabsTrigger>
        </TabsList>
        <TabsContent value={0}>
          <ReverseMode />
        </TabsContent>
        <TabsContent value={1}>
          <RouletteMode />
        </TabsContent>
        <TabsContent value={2}>
          <RunawayMode />
        </TabsContent>
      </Tabs>
    </div>
  );
}
