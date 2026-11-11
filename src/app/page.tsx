"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import "@/styles/homepage.css";
import { GAMES_LIST } from "@/data/games";

// Web Audio Synthesizer cho nhạc hội xuân Tây Bắc và SFX
class FestivalAudioSystem {
  ctx: AudioContext | null = null;
  isMusicPlaying = false;
  musicTimer: NodeJS.Timeout | null = null;
  step = 0;

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMusic(): boolean {
    this.init();
    this.isMusicPlaying = !this.isMusicPlaying;
    if (this.isMusicPlaying) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
    return this.isMusicPlaying;
  }

  startMusic() {
    if (this.musicTimer) clearInterval(this.musicTimer);
    const notes = [349.23, 392.00, 466.16, 523.25, 587.33, 698.46];
    const seq = [0, 1, 3, 2, 4, 3, 5, 4, 3, 1, 2, 0, 1, 4, 3, 0];

    this.musicTimer = setInterval(() => {
      if (!this.isMusicPlaying || !this.ctx) return;
      const noteIdx = seq[this.step % seq.length];
      this.step++;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(notes[noteIdx], now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1100, now);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
    }, 520);
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  playHoverTick() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.05);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.055);
    } catch {}
  }

  playSlideWhoosh() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.28);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(1.5, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {}
  }

  playSelectChime() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [880, 1760].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        const vol = idx === 0 ? 0.08 : 0.03;
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx === 0 ? 0.45 : 0.25));
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      });
    } catch {}
  }

  playLaunchDrum() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.4);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    } catch {}
  }

  playGong() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [220, 440, 660].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.08 / (i + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.95);
      });
    } catch {}
  }
}

const SLOT_CLASSES = [
  "slot-center",
  "slot-right",
  "slot-hidden-right",
  "slot-hidden-back",
  "slot-hidden-left",
  "slot-left"
];

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCulture, setShowCulture] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [spinnerText, setSpinnerText] = useState("ĐANG VÀO HỘI XUÂN...");
  const [highScores, setHighScores] = useState({ nemcon: 0, nhaysap: 0, daygay: 0, banno: 0 });

  // Trạng thái tiền tải (preloader) toàn bộ tài nguyên
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isPreloaderRemoved, setIsPreloaderRemoved] = useState(false);

  const audioSysRef = useRef<FestivalAudioSystem | null>(null);
  const isSlidingRef = useRef(false);

  // Preload toàn bộ ảnh lớn trước khi hiển thị giao diện
  useEffect(() => {
    const imagesToPreload = [
      "/assets/ui/seamless_panorama.png",
      "/assets/ui/layer_logo_sac_viet.png",
      "/assets/ui/btn_play_sac_viet.png",
      "/assets/ui/btn_culture_sac_viet.png",
      "/assets/ui/btn_arrow_left.png",
      "/assets/ui/btn_arrow_right.png",
      "/assets/ui/btn_facebook_pixel.png?v=3",
      "/assets/ui/btn_audio_pixel.png",
      "/assets/ui/btn_settings_pixel.png",
      "/assets/motifs/drum-inspired.svg",
      ...GAMES_LIST.map((g) => g.cardImg),
    ];

    let loadedCount = 0;
    const totalCount = imagesToPreload.length;

    const onAssetLoaded = () => {
      loadedCount++;
      const pct = Math.min(100, Math.round((loadedCount / totalCount) * 100));
      setLoadProgress(pct);

      if (loadedCount >= totalCount) {
        setTimeout(() => {
          setIsLoading(false);
          setTimeout(() => setIsPreloaderRemoved(true), 600);
        }, 300);
      }
    };

    // Giới hạn an toàn tối đa 8 giây phòng khi mạng bị nghẽn 1 file
    const fallbackTimer = setTimeout(() => {
      setLoadProgress(100);
      setIsLoading(false);
      setTimeout(() => setIsPreloaderRemoved(true), 600);
    }, 8000);

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (img.complete) {
        onAssetLoaded();
      } else {
        img.onload = onAssetLoaded;
        img.onerror = onAssetLoaded;
      }
    });

    return () => clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    audioSysRef.current = new FestivalAudioSystem();

    // Load High Scores from localStorage
    try {
      const nc = localStorage.getItem("ssg105_nemcon_highscore") || "0";
      const ns = localStorage.getItem("ssg105_nhaysap_best_score") || "0";
      const dg = localStorage.getItem("ssg105_daygay_wins") || "0";
      const bn = localStorage.getItem("ssg105_banno_best_score") || "0";
      setHighScores({
        nemcon: parseInt(nc, 10) || 0,
        nhaysap: parseInt(ns, 10) || 0,
        daygay: parseInt(dg, 10) || 0,
        banno: parseInt(bn, 10) || 0,
      });
    } catch {}

    // Init ambient particles
    const container = document.getElementById("ambient-particles");
    if (container && container.children.length === 0) {
      for (let i = 0; i < 22; i++) {
        const petal = document.createElement("div");
        petal.className = "petal-particle";
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.animationDuration = `${6 + Math.random() * 8}s`;
        petal.style.animationDelay = `${Math.random() * 6}s`;
        petal.style.opacity = `${0.35 + Math.random() * 0.55}`;
        const size = 6 + Math.random() * 8;
        petal.style.width = `${size}px`;
        petal.style.height = `${size * 1.3}px`;
        container.appendChild(petal);
      }
    }

    document.body.classList.add("is-lobby");

    return () => {
      document.body.classList.remove("is-lobby");
      audioSysRef.current?.stopMusic();
    };
  }, []);

  const nextSlide = useCallback(() => {
    if (isSlidingRef.current) return;
    isSlidingRef.current = true;
    audioSysRef.current?.playSlideWhoosh();

    setCurrentIndex((prev) => (prev + 1) % GAMES_LIST.length);

    setTimeout(() => {
      isSlidingRef.current = false;
    }, 160);
  }, []);

  const prevSlide = useCallback(() => {
    if (isSlidingRef.current) return;
    isSlidingRef.current = true;
    audioSysRef.current?.playSlideWhoosh();

    setCurrentIndex((prev) => (prev - 1 + GAMES_LIST.length) % GAMES_LIST.length);

    setTimeout(() => {
      isSlidingRef.current = false;
    }, 160);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      else if (e.key === "ArrowLeft") prevSlide();
      else if (e.key === "Enter" || e.key === " ") {
        // Space/Enter launch current game
        const activeEl = document.activeElement;
        if (!activeEl || activeEl.tagName !== "BUTTON") {
          handleLaunchGame();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleToggleMusic = () => {
    if (audioSysRef.current) {
      const playing = audioSysRef.current.toggleMusic();
      setIsMusicPlaying(playing);
    }
  };

  const handleLaunchGame = (gameId?: string) => {
    const targetId = gameId || GAMES_LIST[currentIndex].id;
    const game = GAMES_LIST.find((g) => g.id === targetId) || GAMES_LIST[currentIndex];

    audioSysRef.current?.playLaunchDrum();
    setSpinnerText(`ĐANG VÀO HỘI ${game.name}...`);
    setIsTransitioning(true);

    setTimeout(() => {
      window.location.href = `/choi/${game.id}`;
    }, 220);
  };

  const handleCardClick = (idx: number) => {
    const n = GAMES_LIST.length;
    const offset = (idx - currentIndex + n) % n;

    if (offset === 0) {
      audioSysRef.current?.playSelectChime();
      handleLaunchGame(GAMES_LIST[idx].id);
    } else if (offset === 1) {
      nextSlide();
    } else if (offset === n - 1) {
      prevSlide();
    } else {
      audioSysRef.current?.playSlideWhoosh();
      setCurrentIndex(idx);
    }
  };

  const handleResetScores = () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ điểm kỷ lục không?")) {
      try {
        localStorage.removeItem("ssg105_nemcon_highscore");
        localStorage.removeItem("ssg105_nhaysap_best_score");
        localStorage.removeItem("ssg105_daygay_wins");
        localStorage.removeItem("ssg105_banno_best_score");
        setHighScores({ nemcon: 0, nhaysap: 0, daygay: 0, banno: 0 });
        alert("Đã xóa điểm kỷ lục thành công!");
      } catch {}
    }
  };

  const currentGame = GAMES_LIST[currentIndex];

  return (
    <>
      {/* 0. INITIAL ASSET PRELOADER SCREEN */}
      {!isPreloaderRemoved && (
        <div
          className={`initial-preloader ${isLoading ? "" : "fade-out"}`}
          role="progressbar"
          aria-valuenow={loadProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="preloader-box">
            <div className="preloader-drum-spinner">
              <div className="preloader-glow-ring" />
              <img
                src="/assets/motifs/drum-inspired.svg"
                alt=""
                className="preloader-drum-svg"
                aria-hidden="true"
              />
            </div>
            <h2 className="preloader-heading">SẮC VIỆT</h2>
            <p className="preloader-subtext">Đang tải không gian trò chơi dân gian...</p>
            <div className="preloader-bar-wrap">
              <div className="preloader-bar-inner" style={{ width: `${loadProgress}%` }} />
            </div>
            <div className="preloader-meta">
              <span className="preloader-label">Chuẩn bị lễ hội</span>
              <span className="preloader-percent">{loadProgress}%</span>
            </div>
          </div>
        </div>
      )}

      <div
        className="homepage-container"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.45s ease-out",
        }}
      >
        <div className="homepage-stage" id="homepage-stage">
        {/* ENDLESS SEAMLESS SCROLLING BACKGROUND */}
        <div className="endless-bg-track" id="endless-bg-track" aria-hidden="true">
          <img src="/assets/ui/seamless_panorama.png" className="endless-bg-img" alt="" />
          <img src="/assets/ui/seamless_panorama.png" className="endless-bg-img" alt="" />
        </div>

        {/* TOP-LEFT: FANPAGE FACEBOOK Ở Ô RIÊNG BIỆT */}
        <div className="top-left-controls">
          <a
            href="https://www.facebook.com/profile.php?id=61594770114607"
            target="_blank"
            rel="noopener noreferrer"
            className="ctrl-btn btn-facebook"
            id="btn-facebook-link"
            title="Fanpage Facebook Sắc Việt"
            aria-label="Fanpage Facebook Sắc Việt"
          >
            <img src="/assets/ui/btn_facebook_pixel.png?v=3" alt="Facebook Fanpage" className="ctrl-icon-pixel" />
          </a>
        </div>

        {/* TOP-RIGHT: ÂM THANH & CÀI ĐẶT */}
        <div className="top-controls">
          <button
            type="button"
            className="ctrl-btn btn-audio"
            id="btn-audio-toggle"
            title="Âm thanh hội xuân (Bật/Tắt)"
            aria-label="Bật tắt âm thanh"
            onClick={handleToggleMusic}
          >
            <img
              src="/assets/ui/btn_audio_pixel.png"
              alt="Âm thanh"
              id="img-audio-state"
              className="ctrl-icon-pixel"
              style={{ opacity: isMusicPlaying ? 1 : 0.6 }}
            />
          </button>
          <button
            type="button"
            className="ctrl-btn btn-settings"
            id="btn-settings-toggle"
            title="Cài đặt & Điểm kỷ lục"
            aria-label="Cài đặt"
            onClick={() => setShowSettings(true)}
          >
            <img src="/assets/ui/btn_settings_pixel.png" alt="Cài đặt" className="ctrl-icon-pixel" />
          </button>
        </div>

        {/* AMBIENT FLOATING PETALS */}
        <div className="ambient-particles" id="ambient-particles" aria-hidden="true" />

        {/* 1. HEADER LOGO "SẮC VIỆT" */}
        <div
          className="layer-logo-wrap"
          id="logo-layer"
          title="Sắc Việt — Tinh hoa Trò chơi Dân gian Việt Nam"
          role="banner"
          onClick={() => audioSysRef.current?.playGong()}
          style={{ cursor: "pointer" }}
        >
          <img src="/assets/ui/layer_logo_sac_viet.png" alt="SẮC VIỆT" className="layer-img logo-img" />
        </div>

        {/* 2. CAROUSEL NAVIGATION ARROWS */}
        <button
          type="button"
          className="carousel-arrow btn-arrow-prev"
          id="btn-slide-prev"
          title="Trò chơi trước (Phím ←)"
          aria-label="Trò chơi trước"
          onClick={prevSlide}
          onMouseEnter={() => audioSysRef.current?.playHoverTick()}
        >
          <img src="/assets/ui/btn_arrow_left.png" alt="Trước" className="arrow-img" />
        </button>

        <button
          type="button"
          className="carousel-arrow btn-arrow-next"
          id="btn-slide-next"
          title="Trò chơi tiếp theo (Phím →)"
          aria-label="Trò chơi tiếp theo"
          onClick={nextSlide}
          onMouseEnter={() => audioSysRef.current?.playHoverTick()}
        >
          <img src="/assets/ui/btn_arrow_right.png" alt="Tiếp" className="arrow-img" />
        </button>

        {/* 3. MULTI-GAME CAROUSEL VIEWPORT */}
        <div className="carousel-viewport" id="carousel-viewport" role="region" aria-label="Danh sách trò chơi dân gian">
          {GAMES_LIST.map((game, idx) => {
            const n = GAMES_LIST.length;
            const offset = (idx - currentIndex + n) % n;
            const slotClass = SLOT_CLASSES[offset];
            const isCenter = offset === 0;

            return (
              <div
                key={game.id}
                className={`card-item ${slotClass} ${isCenter ? "selected" : ""}`}
                id={`card-${game.id}`}
                data-game={game.id}
                data-index={idx}
                tabIndex={0}
                role="button"
                aria-label={game.name}
                aria-checked={isCenter}
                onClick={() => handleCardClick(idx)}
                onMouseEnter={() => audioSysRef.current?.playHoverTick()}
              >
                <img src={game.cardImg} alt={game.name} className="layer-img card-img" />
              </div>
            );
          })}
        </div>

        {/* CAROUSEL INDICATOR DOTS */}
        <div className="carousel-dots" id="carousel-dots" aria-hidden="true">
          {GAMES_LIST.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === currentIndex ? "active" : ""}`}
              data-dot={idx}
              onClick={() => {
                audioSysRef.current?.playSlideWhoosh();
                setCurrentIndex(idx);
              }}
            />
          ))}
        </div>

        {/* 4. ACTION BUTTONS */}
        <button
          type="button"
          className="action-btn btn-play"
          id="btn-play-game"
          title={`Bắt đầu chơi ${currentGame.name}`}
          onClick={() => handleLaunchGame()}
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
        >
          <img src="/assets/ui/btn_play_sac_viet.png" alt="CHƠI NGAY" className="layer-img btn-img" />
        </button>

        <Link
          href={`/tro-choi/${currentGame.id}`}
          className="action-btn btn-culture"
          id="btn-kham-pha"
          title="Tìm hiểu nét đẹp văn hóa dân gian"
        >
          <img src="/assets/ui/btn_culture_sac_viet.png" alt="KHÁM PHÁ VĂN HÓA" className="layer-img btn-img" />
        </Link>
      </div>

      {/* MODAL: KHÁM PHÁ VĂN HÓA */}
      {showCulture && (
        <div className="modal-overlay active" id="modal-culture" role="dialog" aria-modal="true">
          <div className="modal-box">
            <div className="modal-header">
              <h2 id="culture-modal-title">SẮC VIỆT — DI SẢN TRÒ CHƠI DÂN GIAN VIỆT NAM</h2>
              <button type="button" className="modal-close-btn" onClick={() => setShowCulture(false)} aria-label="Đóng">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="culture-section">
                <h3>1. Lễ hội Lồng Tồng (Xuống Đồng) Vùng Cao</h3>
                <p>
                  Lễ hội Lồng Tồng là ngày hội xuân thiêng liêng và tưng bừng bậc nhất của các đồng bào dân tộc Tày, Nùng, Thái, Mường tại vùng núi phía Bắc.
                </p>
              </div>
              <div className="culture-section">
                <h3>2. Ném Còn — Linh hồn hội xuân</h3>
                <p>Quả còn may bằng vải hoa rực rỡ tượng trưng cho sự sinh sôi nảy nở, phóng qua vòng nhật nguyệt cầu chúc mưa thuận gió hòa.</p>
              </div>
              <div className="culture-section">
                <h3>3. Đẩy Gậy — Tinh thần thượng võ</h3>
                <p>Hai đấu thủ nắm chặt thân gậy tre dồn toàn bộ sức mạnh vào đôi chân trụ vững vàng để tôn vinh sự kiên cường vùng cao.</p>
              </div>
              <div className="culture-section">
                <h3>4. Nhảy Sạp — Giai điệu tre nứa</h3>
                <p>Tiếng gõ tre giòn giã "Cộc - Cộc - Cộc - Chách" hòa cùng tiếng khèn bè, kết nối trai gái và cộng đồng trong điệu múa say đắm.</p>
              </div>
            </div>
            <div className="modal-footer">
              <Link href="/van-hoa" className="btn-modal-action" style={{ textDecoration: "none", textAlign: "center" }}>
                ĐỌC TẤT CẢ TƯ LIỆU VĂN HÓA ↗
              </Link>
              <button type="button" className="btn-modal-action btn-modal-close" onClick={() => setShowCulture(false)}>
                ĐÓNG
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CÀI ĐẶT & KỶ LỤC */}
      {showSettings && (
        <div className="modal-overlay active" id="modal-settings" role="dialog" aria-modal="true">
          <div className="modal-box">
            <div className="modal-header">
              <h2 id="settings-title">TÙY CHỌN & THÀNH TÍCH</h2>
              <button type="button" className="modal-close-btn" onClick={() => setShowSettings(false)} aria-label="Đóng">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <h3>Bản nhạc hội xuân Tây Bắc</h3>
              <p>Bấm vào biểu tượng chiếc loa gỗ ở góc trên bên phải màn hình để bật/tắt giai điệu khèn năm cung rộn rã.</p>

              <h3>Thành tích kỷ lục hiện tại</h3>
              <div className="score-board-grid">
                <div className="score-card">
                  <span className="score-game-name">NÉM CÒN</span>
                  <span className="score-val" id="val-nemcon-hs">{highScores.nemcon}</span>
                  <span className="score-unit">điểm</span>
                </div>
                <div className="score-card">
                  <span className="score-game-name">NHẢY SẠP</span>
                  <span className="score-val" id="val-nhaysap-hs">{highScores.nhaysap}</span>
                  <span className="score-unit">điểm</span>
                </div>
                <div className="score-card">
                  <span className="score-game-name">ĐẨY GẬY</span>
                  <span className="score-val" id="val-daygay-hs">{highScores.daygay}</span>
                  <span className="score-unit">trận thắng</span>
                </div>
                <div className="score-card">
                  <span className="score-game-name">BẮN NỎ</span>
                  <span className="score-val" id="val-banno-hs">{highScores.banno}</span>
                  <span className="score-unit">điểm</span>
                </div>
              </div>

              <div className="community-wrap" style={{ marginTop: "16px", marginBottom: "8px", textAlign: "center" }}>
                <a
                  href="https://www.facebook.com/profile.php?id=61594770114607"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#1877f2",
                    color: "#fff",
                    padding: "11px 16px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "13px",
                    boxShadow: "0 4px 12px rgba(24,119,242,0.35)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  KẾT NỐI FANPAGE FACEBOOK SẮC VIỆT ↗
                </a>
              </div>

              <div className="reset-data-wrap">
                <button type="button" id="btn-reset-data" className="btn-modal-action btn-danger" onClick={handleResetScores}>
                  XÓA DỮ LIỆU ĐIỂM KỶ LỤC
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-modal-action btn-modal-close" onClick={() => setShowSettings(false)}>
                HOÀN TẤT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRANSITION OVERLAY KHI VÀO GAME */}
      <div className={`page-transition-overlay ${isTransitioning ? "active" : ""}`} id="page-transition-overlay">
        <div className="transition-spinner">
          <div className="spinner-ring" />
          <span className="spinner-text" id="spinner-text">{spinnerText}</span>
        </div>
      </div>
    </div>
  </>
);
}
