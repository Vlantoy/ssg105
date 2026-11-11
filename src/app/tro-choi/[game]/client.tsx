"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import "@/styles/portal-redesign.css";
import { GAMES_DATA, GALLERIES } from "@/data/games";
import { usePortalAnimations } from "@/hooks/usePortalAnimations";

export default function GameCultureDetailClient({ slug }: { slug: string }) {
  const g = GAMES_DATA[slug];

  usePortalAnimations();

  if (!g) {
    notFound();
  }

  const gameKeys = Object.keys(GAMES_DATA);
  const currentIdx = gameKeys.indexOf(slug);
  const nextSlug = gameKeys[(currentIdx + 1) % gameKeys.length];
  const other = GAMES_DATA[nextSlug];

  const extraPhotos = GALLERIES[slug] || [];
  const photos = [{ src: g.photo, caption: g.photoAlt, credit: g.photoCredit, source: g.source }, ...extraPhotos];

  return (
    <div className="detail-page" style={{ minHeight: "100vh" }}>
      {/* HEADER */}
      <header className="site-header">
        <Link className="brand brand-sac-viet" href="/" title="Sắc Việt — Về Sảnh Trò Chơi">
          <span>SẮC VIỆT</span>
        </Link>
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          <Link href="/van-hoa#tro-choi">Khám phá văn hóa</Link>
          <Link href="/van-hoa#ngay-hoi">Không gian ngày hội</Link>
          <Link href="/van-hoa#ve-du-an">Về Sắc Việt</Link>
        </nav>
        <Link className="text-link header-back" href="/van-hoa#tro-choi">
          ← Các trò chơi
        </Link>
        <Link className="button small" href={`/choi/${slug}`} title="Vào trải nghiệm game ngay">
          Chơi ngay <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <main id="main">
        {/* BREADCRUMB */}
        <div className="wrap breadcrumb">
          <Link href="/van-hoa">Trang văn hóa</Link>
          <span aria-hidden="true">/</span>
          <Link href="/van-hoa#tro-choi">Trò chơi</Link>
          <span aria-hidden="true">/</span>
          <span id="breadcrumb">{g.title}</span>
        </div>

        {/* HERO */}
        <section className="detail-hero wrap">
          <div className="detail-hero-copy">
            <p className="eyebrow">{(g.category || g.type).toUpperCase()} · SẮC VIỆT</p>
            <h1>{g.title}</h1>
            <p className="detail-tagline">{g.intro || ""}</p>
            <p className="lead">{g.description}</p>
            <div className="actions" style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <Link
                className="button"
                href={`/choi/${slug}`}
                style={{ backgroundColor: "#d97706", borderColor: "#d97706", color: "#fff", fontWeight: 700 }}
              >
                Vào chơi {g.title} ngay ↗
              </Link>
              <a className="button" href="#cach-choi">
                Cách chơi ngoài đời <span aria-hidden="true">↓</span>
              </a>
              <a className="text-link" href="#tong-quan">
                Ý nghĩa văn hóa ↓
              </a>
            </div>
            <p className="play-note">Chuyên trang văn hóa Sắc Việt · Bấm logo Sắc Việt trên thanh điều hướng để về sảnh game</p>
          </div>
          <figure className="detail-cover">
            <div className="photo-button" aria-label={`Ảnh: ${g.photoAlt}`}>
              <img src={g.photo} alt={g.photoAlt} fetchPriority="high" />
              <span className="image-open" aria-hidden="true">↗</span>
            </div>
            <figcaption>
              <a className="credit" href={g.source} target="_blank" rel="noopener noreferrer">
                {g.photoCredit} ↗
              </a>
            </figcaption>
          </figure>
        </section>

        {/* DETAIL FACTS */}
        <div className="detail-facts wrap">
          <p>
            <span>Loại hình</span>
            {g.type}
          </p>
          <p>
            <span>Không gian</span>
            {g.place}
          </p>
          <p>
            <span>Điểm thú vị</span>
            {g.skill}
          </p>
        </div>

        {/* CHAPTER NAV */}
        <nav className="chapter-nav" aria-label="Mục lục trò chơi">
          <div className="wrap">
            <div className="chapter-links">
              <a href="#tong-quan">Giới thiệu</a>
              <a href="#y-nghia">Ý nghĩa</a>
              <a href="#cach-choi">Cách chơi</a>
              <a href="#dung-cu">Dụng cụ</a>
              <a href="#hinh-anh">Hình ảnh</a>
              {g.video && <a href="#video">Video</a>}
              <a href="#nguon">Nguồn đọc</a>
            </div>
            <Link className="button small" href={`/choi/${slug}`} style={{ backgroundColor: "#d97706", borderColor: "#d97706", color: "#fff" }}>
              Chơi ngay ↗
            </Link>
          </div>
        </nav>

        {/* OVERVIEW */}
        <section className="chapter wrap section-space" id="tong-quan">
          <div className="chapter-heading" data-reveal>
            <span className="section-caption">Làm quen với cuộc vui</span>
            <h2>
              {g.title}:<br />
              cuộc vui bắt đầu thế nào?
            </h2>
          </div>
          <div className="reading-copy" data-reveal>
            {(g.overview || []).map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
            {g.sources && g.sources[0] && (
              <a className="source-inline" href={g.sources[0][1]} target="_blank" rel="noopener noreferrer">
                Đọc thêm: {g.sources[0][0]} ↗
              </a>
            )}
          </div>
        </section>

        {/* MEANING */}
        <section className="meaning-section wrap section-space" id="y-nghia" aria-labelledby="meaning-heading">
          <div className="chapter">
            <div className="chapter-heading" data-reveal>
              <h2 id="meaning-heading" dangerouslySetInnerHTML={{ __html: g.meaningTitle }} />
            </div>
            <div className="reading-copy" data-reveal>
              <p className="large-copy">{g.meaningIntro}</p>
            </div>
          </div>
          <div className="meaning-points" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px", marginTop: "40px" }}>
            {(g.meaningBlocks || []).map(([title, text], idx) => (
              <article key={idx} data-reveal style={{ padding: "24px", backgroundColor: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--line)" }}>
                <h3 style={{ color: "var(--gold)", marginBottom: "12px" }}>{title}</h3>
                <p style={{ lineHeight: 1.75 }}>{text}</p>
              </article>
            ))}
          </div>
          {g.meaningScope && <p className="meaning-scope" style={{ marginTop: "24px", color: "var(--muted)", fontStyle: "italic" }}>{g.meaningScope}</p>}
        </section>

        {/* HOW TO PLAY */}
        <section className="how-section section-space" id="cach-choi">
          <div className="wrap">
            <div className="section-title" data-reveal>
              <h2>
                Hiểu nhịp chơi,<br />
                nhập cuộc dễ hơn.
              </h2>
              <p>Cách tham gia ngoài đời. Khi đến một ngày hội, hãy theo cách tổ chức và hướng dẫn của cộng đồng tại đó.</p>
            </div>
            <ol className="steps-list">
              {(g.steps || []).map(([t, p], i) => (
                <li key={i} data-reveal>
                  <span className="step-number">0{i + 1}</span>
                  <div>
                    <h3>{t}</h3>
                    <p>{p}</p>
                  </div>
                </li>
              ))}
            </ol>
            {g.variants && g.variants.length > 0 && (
              <div className="variations">
                {g.variants.map(([t, p], idx) => (
                  <div key={idx} data-reveal>
                    <h3>{t}</h3>
                    <p>{p}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* EQUIPMENT */}
        <section className="equipment-section wrap section-space" id="dung-cu" aria-labelledby="equipment-heading">
          <h2 className="compact-heading" id="equipment-heading" data-reveal>
            Một cuộc chơi cần những gì?
          </h2>
          <dl className="equipment-list">
            {(g.equipment || []).map(([t, p], idx) => (
              <div key={idx} data-reveal>
                <dt>{t}</dt>
                <dd>{p}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* PHOTO GALLERY SECTION */}
        <section className="photo-section wrap section-space" id="hinh-anh">
          {/* Dong Son drum watermark ornament */}
          <img className="scroll-ornament" src="/assets/motifs/dong-son-gold.svg" alt="" aria-hidden="true" loading="lazy" />

          <div className="section-title" data-reveal>
            <h2>Những khoảnh khắc<br />ngoài màn hình.</h2>
            <p>Quan sát dụng cụ, tư thế và không gian ngày hội. Ảnh tư liệu văn hóa chân thực.</p>
          </div>
          <div className="gallery-grid">
            {photos.map((photo, i) => (
              <figure key={i} data-reveal>
                <div className="photo-button" aria-label={`Xem ảnh: ${photo.caption}`}>
                  <img src={photo.src} alt={photo.caption} loading="lazy" />
                  <span className="image-open" aria-hidden="true">↗</span>
                </div>
                <figcaption>
                  <p>{photo.caption}</p>
                  <a className="credit" href={photo.source} target="_blank" rel="noopener noreferrer">
                    {photo.credit} ↗
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
          {g.context && (
            <div className="photo-context" id="cau-chuyen" data-reveal>
              <h3>Đọc ảnh trong đúng bối cảnh</h3>
              <p>{g.context}</p>
            </div>
          )}
        </section>

        {/* VIDEO */}
        {g.video && (
          <section className="video-section section-space" id="video">
            <div className="wrap">
              <div className="section-title" data-reveal>
                <h2>
                  Nghe nhịp, nhìn động tác.<br />
                  Cảm nhận cuộc vui.
                </h2>
                <p>Video tư liệu giúp bạn quan sát cách chơi và không khí ngoài đời.</p>
              </div>
              <div className="video-frame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${g.video}`}
                  title={`${g.videoTitle} · ${g.channel}`}
                  loading="lazy"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="video-caption">
                <p>
                  {g.videoTitle}
                  <span>{g.channel}</span>
                </p>
                <a
                  className="text-link"
                  href={`https://www.youtube.com/watch?v=${g.video}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mở trên YouTube ↗
                </a>
              </div>
            </div>
          </section>
        )}

        {/* DIGITAL / PLAY BANNER */}
        <section className="digital-section wrap section-space" id="trai-nghiem">
          <div data-reveal>
            <span className="section-caption">Góc nhìn văn hóa</span>
            <h2>
              Tinh hoa truyền đời,<br />
              kết nối thế hệ.
            </h2>
            <p>{g.digital}</p>
          </div>
          <div className="play-panel" data-reveal>
            <h3>Khám phá {g.title.toLowerCase()} cùng Sắc Việt</h3>
            <p>{g.controls}</p>
            <Link
              className="button"
              href={`/choi/${slug}`}
              style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}
            >
              Vào trải nghiệm trò chơi ngay ↗
            </Link>
            <small>Bấm vào biểu tượng “SẮC VIỆT” ở đầu trang để quay lại sảnh chơi game bất cứ lúc nào.</small>
          </div>
        </section>

        {/* FAQs */}
        {g.faqs && g.faqs.length > 0 && (
          <section className="faq-section wrap section-space">
            <h2>Bạn có thể đang tò mò</h2>
            <div className="faq-list">
              {g.faqs.map(([q, a], idx) => (
                <details key={idx}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* SOURCES */}
        {g.sources && g.sources.length > 0 && (
          <section className="sources-section wrap section-space" id="nguon">
            <h2>Tiếp tục tìm hiểu</h2>
            <p>
              Nội dung được biên soạn và đối chiếu từ những nguồn dưới đây. Cách chơi, ý nghĩa và nghi thức có thể thay đổi
              theo cộng đồng.
            </p>
            <ol>
              {g.sources.map(([t, url, note], idx) => (
                <li key={idx}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {t} ↗
                  </a>
                  <p>{note}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* NEXT GAME TEASER */}
        {other && (
          <section className="next-story wrap">
            <Link href={`/tro-choi/${nextSlug}`}>
              <img src={other.photo} alt={other.photoAlt} loading="lazy" />
              <div>
                <span>Tiếp tục hành trình khám phá</span>
                <h2>
                  {other.title} <span>→</span>
                </h2>
                <p>{other.description}</p>
              </div>
            </Link>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="site-footer wrap">
        <Link className="brand brand-sac-viet" href="/" title="Sắc Việt — Về Trang chủ chơi game">
          <span>SẮC VIỆT</span>
        </Link>
        <p>
          Khám phá văn hóa qua trò chơi.<br />
          <span>Tư liệu và nguồn tham khảo được ghi trong từng bài.</span>
        </p>
        <a
          href="https://www.facebook.com/profile.php?id=61594770114607"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#edc35b", textDecoration: "none", fontWeight: 600, fontSize: "13px", margin: "8px 0" }}
          title="Ghé thăm Fanpage Facebook Sắc Việt"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Fanpage Facebook ↗
        </a>
        <a href="#main">Về đầu trang ↑</a>
      </footer>
    </div>
  );
}
