"use client";

import { useRef, useCallback, useEffect } from "react";

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const getContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
      gainRef.current = audioCtxRef.current.createGain();
      gainRef.current.connect(audioCtxRef.current.destination);
      gainRef.current.gain.value = 0.5;
    }
    return audioCtxRef.current;
  }, []);

  const start = useCallback(() => {
    const ctx = getContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    if (oscillatorRef.current) return;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 440;
    osc.connect(gainRef.current!);
    osc.start();
    oscillatorRef.current = osc;
  }, [getContext]);

  const stop = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (gainRef.current) {
      gainRef.current.gain.value = Math.max(0, Math.min(1, volume / 100));
    }
  }, []);

  useEffect(() => {
    return () => {
      oscillatorRef.current?.stop();
      oscillatorRef.current?.disconnect();
      audioCtxRef.current?.close();
    };
  }, []);

  return { start, stop, setVolume };
}
