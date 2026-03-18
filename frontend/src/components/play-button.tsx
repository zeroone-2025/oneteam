"use client";

import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlayButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function PlayButton({ isPlaying, onToggle }: PlayButtonProps) {
  return (
    <Button
      variant={isPlaying ? "destructive" : "default"}
      size="lg"
      onClick={onToggle}
      className="gap-2"
    >
      {isPlaying ? (
        <>
          <Square className="size-4" />
          정지
        </>
      ) : (
        <>
          <Play className="size-4" />
          재생
        </>
      )}
    </Button>
  );
}
