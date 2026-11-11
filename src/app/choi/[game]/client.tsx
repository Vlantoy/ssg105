"use client";

import React, { useState, useRef, useEffect } from "react";
import { notFound } from "next/navigation";
import { GAMES_DATA } from "@/data/games";

export default function GamePlayClient({ gameKey }: { gameKey: string }) {
  const game = GAMES_DATA[gameKey];
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Prevent iframe inception: If this page is rendered inside an iframe, break out immediately
  useEffect(() => {
    if (typeof window !== "undefined" && window.top && window.top !== window.self) {
      try {
        window.top.location.href = window.location.href;
      } catch (_) {}
    }
  }, []);

  if (!game) {
    notFound();
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#000",
        overflow: "hidden",
        zIndex: 1000,
      }}
    >
      {/* FLOATING FULLSCREEN TOGGLE */}
      <button
        type="button"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 9999,
          background: "rgba(22, 27, 34, 0.8)",
          color: "#edc35b",
          border: "1px solid rgba(237, 195, 91, 0.35)",
          backdropFilter: "blur(6px)",
          borderRadius: "8px",
          padding: "7px 12px",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          userSelect: "none",
          transition: "all 0.2s ease",
        }}
      >
        <span>{isFullscreen ? "✕" : "⛶"}</span>
        <span>{isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}</span>
      </button>

      {/* GAME RUNNER FRAME */}
      <iframe
        ref={iframeRef}
        src={`/${gameKey}/index.html`}
        title={`Trò chơi ${game.title}`}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        allow="autoplay; fullscreen; accelerometer; gyroscope"
      />
    </div>
  );
}
