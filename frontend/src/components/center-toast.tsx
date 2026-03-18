"use client";

import { useEffect, useState } from "react";

interface CenterToastProps {
  message: string | null;
  onDone: () => void;
}

export function CenterToast({ message, onDone }: CenterToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 2500);
    return () => clearTimeout(timer);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none">
      <div
        className={`
          pointer-events-auto bg-background border border-border rounded-2xl px-8 py-5 shadow-2xl
          text-center transition-all duration-300
          ${visible ? "opacity-100 scale-100" : "opacity-0 scale-90"}
        `}
      >
        <p className="text-lg font-bold">{message}</p>
      </div>
    </div>
  );
}
