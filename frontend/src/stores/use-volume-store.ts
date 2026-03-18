import { create } from "zustand";

export type VolumeMode = "roulette" | "reverse" | "runaway";

export type RouletteState = "idle" | "spinning" | "done";

interface VolumeState {
  mode: VolumeMode;
  sliderValue: number;
  actualVolume: number;
  isPlaying: boolean;
  rouletteState: RouletteState;
  rouletteResult: number | null;
  setMode: (mode: VolumeMode) => void;
  setSliderValue: (value: number) => void;
  setActualVolume: (value: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setRouletteState: (state: RouletteState) => void;
  setRouletteResult: (result: number | null) => void;
  reset: () => void;
}

export const useVolumeStore = create<VolumeState>((set) => ({
  mode: "reverse",
  sliderValue: 50,
  actualVolume: 50,
  isPlaying: false,
  rouletteState: "idle",
  rouletteResult: null,
  setMode: (mode) => set({ mode, sliderValue: 50, actualVolume: 50, rouletteState: "idle", rouletteResult: null }),
  setSliderValue: (sliderValue) => set({ sliderValue }),
  setActualVolume: (actualVolume) => set({ actualVolume }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setRouletteState: (rouletteState) => set({ rouletteState }),
  setRouletteResult: (rouletteResult) => set({ rouletteResult }),
  reset: () => set({ sliderValue: 50, actualVolume: 50, rouletteState: "idle", rouletteResult: null }),
}));
