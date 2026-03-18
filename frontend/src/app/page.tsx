"use client";

import { useEffect, useState } from "react";
import { PlayButton } from "@/components/play-button";
import { VolumeDisplay } from "@/components/volume-display";
import { ReverseMode } from "@/components/modes/reverse-mode";
import { RouletteMode } from "@/components/modes/roulette-mode";
import { RunawayMode } from "@/components/modes/runaway-mode";
import { useVolumeStore } from "@/stores/use-volume-store";
import { useAudio } from "@/hooks/use-audio";
import type { VolumeMode } from "@/stores/use-volume-store";

const tabs = [
  { id: 0, label: "볼륨 조절", mode: "reverse" as VolumeMode },
  { id: 1, label: "볼륨 조절", mode: "roulette" as VolumeMode },
  { id: 2, label: "볼륨 조절", mode: "runaway" as VolumeMode },
];

export default function Home() {
  const { actualVolume, sliderValue, isPlaying, setIsPlaying, setMode } = useVolumeStore();
  const { start, stop, setVolume } = useAudio();
  const [activeTab, setActiveTab] = useState(0);

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

  const handleTabClick = (id: number) => {
    setActiveTab(id);
    setMode(tabs[id].mode);
  };

  return (
    <div className="container mx-auto max-w-2xl">
      {/* Bookmark Tabs */}
      <div className="flex items-end px-4 pt-4 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              relative px-5 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition-colors
              ${activeTab === tab.id
                ? "bg-background text-foreground border-border z-10"
                : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
              }
            `}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className={`
                inline-flex size-5 items-center justify-center rounded-full text-xs font-bold
                ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"}
              `}>
                {tab.id + 1}
              </span>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="border border-border rounded-b-xl rounded-tr-xl bg-background px-4 pb-6">
        {/* YouTube Player */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black mt-4 mb-4">
          <div id="yt-player" className="absolute inset-0 w-full h-full" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <PlayButton isPlaying={isPlaying} onToggle={handleTogglePlay} />
          <VolumeDisplay sliderValue={sliderValue} actualVolume={actualVolume} />
        </div>

        {/* Active Mode Slider */}
        {activeTab === 0 && <ReverseMode />}
        {activeTab === 1 && <RouletteMode />}
        {activeTab === 2 && <RunawayMode />}
      </div>
    </div>
  );
}
