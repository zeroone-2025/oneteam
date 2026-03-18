"use client";

import { useRef, useCallback, useEffect } from "react";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export function useAudio() {
  const playerRef = useRef<YT.Player | null>(null);
  const readyRef = useRef(false);
  const pendingVolume = useRef<number | null>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!document.getElementById("yt-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    const initPlayer = () => {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player("yt-player", {
        videoId: "h0KIWaUEIgQ",
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: "h0KIWaUEIgQ",
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            readyRef.current = true;
            if (pendingVolume.current !== null) {
              playerRef.current?.setVolume(pendingVolume.current);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
      readyRef.current = false;
    };
  }, []);

  const start = useCallback(() => {
    if (readyRef.current && playerRef.current) {
      playerRef.current.playVideo();
    }
  }, []);

  const stop = useCallback(() => {
    if (readyRef.current && playerRef.current) {
      playerRef.current.pauseVideo();
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const v = Math.max(0, Math.min(100, volume));
    if (readyRef.current && playerRef.current) {
      playerRef.current.setVolume(v);
    } else {
      pendingVolume.current = v;
    }
  }, []);

  return { start, stop, setVolume };
}
