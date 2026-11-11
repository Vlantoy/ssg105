"use client";

import React, { use, useState, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GAMES_DATA } from "@/data/games";

export default function GamePlayPage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const resolvedParams = use(params);
  const gameKey = resolvedParams.game;
  const game = GAMES_DATA[gameKey];
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0d1117",
        overflow: "hidden",
        zIndex: 1000,
      }}
    >
      {/* GAME RUNNER HEADER */}
      <header
        style={{
          height: "48px",
          backgroundColor: "#161b22",
          borderBottom: "1px solid rgba(237,195,91,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          color: "#f8f5ee",
          userSelect: "none",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Link
            href="/"
            style={{
              color: "#edc35b",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            ← Sảnh trò chơi
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
          <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "0.5px", color: "#fff" }}>
            {game.title.toUpperCase()}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link
            href={`/tro-choi/${gameKey}`}
            style={{
              color: "#edc35b",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 600,
              padding: "4px 10px",
              border: "1px solid rgba(237,195,91,0.4)",
              borderRadius: "4px",
              backgroundColor: "rgba(237,195,91,0.08)",
            }}
          >
            Nét đẹp văn hóa ↗
          </Link>
          <button
            type="button"
            onClick={toggleFullscreen}
            style={{
              color: "#d9d2c5",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "4px",
              padding: "4px 10px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            {isFullscreen ? "Thu nhỏ" : "Toàn màn hình ⛶"}
          </button>
        </div>
      </header>

      {/* GAME RUNNER FRAME */}
      <div style={{ flex: 1, position: "relative", width: "100%", height: "calc(100% - 48px)", backgroundColor: "#000" }}>
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
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  );
}
