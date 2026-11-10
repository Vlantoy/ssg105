"use client";

import React, { useState } from "react";
import Link from "next/link";
import "@/styles/portal-redesign.css";
import { GAMES_DATA, GAMES_LIST } from "@/data/games";
import { usePortalAnimations } from "@/hooks/usePortalAnimations";

export default function VanHoaPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { flightLayerRef } = usePortalAnimations();

  return (
    <div className="home-page" style={{ minHeight: "100vh" }}>
      {/* 5-BIRD FLOCK FLIGHT LAYER (animated across screen on slogan) */}
      <div className="flight-layer" ref={flightLayerRef} aria-hidden="true" hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <img
            key={i}
            className="scroll-crane flock-bird"
            src="/assets/motifs/crane-flight.svg"
            alt=""
            style={{ width: `${116 - i * 9}px` }}
          />
        ))}
      </div>

      {/* SITE HEADER */}
      <header className="site-header">
        <Link className="brand brand-sac-viet" href="/" title="Sắc Việt — Về Sảnh Trò Chơi">
          <span>SẮC VIỆT</span>
        </Link>
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          <a href="#tro-choi">Khám phá văn hóa</a>
          <a href="#ngay-hoi">Không gian ngày hội</a>
          <a href="#ve-du-an">Về Sắc Việt</a>
          <a href="#hoi-dap">Hỏi đáp</a>
        </nav>
        <Link className="button small" href="/" title="Quay lại sảnh chính chơi game">
          Sảnh Trò Chơi <span aria-hidden="true">↗</span>
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          Menu
        </button>
        {mobileMenuOpen && (
          <nav id="mobile-menu" className="mobile-menu" aria-label="Điều hướng điện thoại" style={{ display: "block" }}>
            <a href="#tro-choi" onClick={() => setMobileMenuOpen(false)}>Khám phá văn hóa</a>
            <a href="#ngay-hoi" onClick={() => setMobileMenuOpen(false)}>Không gian ngày hội</a>
            <a href="#ve-du-an" onClick={() => setMobileMenuOpen(false)}>Về Sắc Việt</a>
            <a href="#hoi-dap" onClick={() => setMobileMenuOpen(false)}>Hỏi đáp</a>
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Sảnh Trò Chơi ↗</Link>
          </nav>
        )}
      </header>

      <main id="main">
        {/* HERO SECTION */}
        <section className="home-hero wrap">
          <div className="hero-copy">
            <p className="eyebrow">VĂN HÓA VIỆT · KHÁM PHÁ BẢN SẮC</p>
            <h1>
              Chạm vào<br />
              <em>bản sắc Việt.</em>
            </h1>
            <p className="lead">Gần hơn với tiếng tre, đường còn và những cuộc vui kết nối bản làng.</p>
            <p>Tìm hiểu 6 trò chơi dân gian tiêu biểu qua câu chuyện, ảnh và video tư liệu chân thực của ngày hội truyền thống Việt Nam.</p>
            <div className="actions">
              <a className="button" href="#tro-choi">
                Khám phá văn hóa <span aria-hidden="true">↓</span>
              </a>
              <Link className="button secondary" href="/" style={{ marginLeft: "10px" }}>
                Vào chơi game ngay ↗
              </Link>
              <a className="text-link" href="#ngay-hoi">
                Ghé không gian ngày hội
              </a>
            </div>
          </div>
          <div className="hero-montage">
            <figure className="hero-main-photo">
              <img
                src="https://media3.baotintuc.vn/images/XtMI2cTUOu7JtJPwFuYGlOhAp_5WaApFvOtSitpj84jY7LYX4Vvu6LZYHifoDz1Vsf51Y3DljZWdjVT5FcGhFP0gYc4ylp4gbWLoDLIGOnMewo7zRIcIbhrvlufNPFcQPZSHtPcLRqnub5ylixwLlA/Xen_ban_xen_muongnguoi_ThaiVan_ChanYen_BaiDinh_Cong_Hoan.jpg.avif"
                alt="Múa sạp trong ngày hội của người Thái"
              />
              <figcaption>
                <a href="https://dantocmiennui.baotintuc.vn/mua-sap-cua-nguoi-thai-post303019.html" target="_blank" rel="noopener noreferrer">
                  Ảnh: Đinh Công Hoan / DTMN ↗
                </a>
              </figcaption>
            </figure>
            <figure className="hero-inset-photo">
              <img
                src="https://visitsapa.com.vn/VisitSaPa/Post/%C4%90%E1%BB%99c%20%C4%91%C3%A1o%20l%E1%BB%85%20h%E1%BB%99i%20Ro%C3%B3ng%20Po%E1%BB%8Dc%20c%E1%BB%A7a%20ng%C6%B0%E1%BB%9Di%20Gi%C3%A1y%20Sa%20Pa-/7662/image-thumb__7662__720_jpg/image2.63369953.png"
                alt="Người chơi ném còn tại Sa Pa"
              />
              <figcaption>
                <a href="https://visitsapa.com.vn/vi/le-hoi-roong-pooc-nguoi-giay-sa-pa" target="_blank" rel="noopener noreferrer">
                  Ảnh: Visit Sa Pa ↗
                </a>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ORIENTATION */}
        <section className="orientation wrap" aria-label="Bắt đầu khám phá">
          <p>
            <strong>Hiểu cuộc vui, lưu giữ bản sắc.</strong><br />
            Đọc câu chuyện, chiêm ngưỡng hình ảnh tư liệu và tìm hiểu ý nghĩa ngày hội.
          </p>
          <ol>
            <li><span>01</span> Chọn một trò</li>
            <li><span>02</span> Đọc câu chuyện</li>
            <li><span>03</span> Khám phá tư liệu</li>
          </ol>
        </section>

        {/* 6 GAMES GRID SECTION */}
        <section className="games-section wrap section-space" id="tro-choi">
          {/* Dong Son drum watermark ornament */}
          <img className="scroll-ornament" src="/assets/motifs/dong-son-gold.svg" alt="" aria-hidden="true" loading="lazy" />

          <div className="games-slogan" data-reveal>
            <p className="games-slogan-quote">
              Trò chơi dân gian,<br />
              <em>di sản văn hóa ngàn năm.</em>
            </p>
            <p className="games-slogan-caption">
              Tìm hiểu câu chuyện, cách chơi và ý nghĩa của trò chơi truyền thống Việt Nam qua tư liệu văn hóa chân thực.
            </p>
          </div>
          <div className="section-title" data-reveal>
            <h2>
              Khám phá nét đẹp<br />văn hóa dân gian
            </h2>
            <p>
              Từ nhịp sạp, đường còn đến những màn đọ sức đẩy gậy, bắn nỏ và cú tung quay. Chọn một cuộc vui để tìm hiểu nguồn
              gốc và ý nghĩa ngày hội.
            </p>
          </div>

          <div className="game-grid">
            {GAMES_LIST.map((game) => {
              const info = GAMES_DATA[game.id];
              if (!info) return null;
              return (
                <article key={game.id} className="game-card">
                  <Link href={`/tro-choi/${game.id}`} className="game-image">
                    <img src={info.photo} alt={info.photoAlt} loading="lazy" />
                    <span className="image-open" aria-hidden="true">↗</span>
                  </Link>
                  <div className="game-content">
                    <div className="game-type">
                      <strong>{info.type.toUpperCase()}</strong>
                      <span>{info.place}</span>
                    </div>
                    <h3>{info.title}</h3>
                    <p>{info.description}</p>
                    <div className="card-actions">
                      <Link className="button small" href={`/tro-choi/${game.id}`}>
                        Khám phá văn hóa ↗
                      </Link>
                      <Link className="text-link" href={`/choi/${game.id}`}>
                        Vào chơi ngay ↗
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* FESTIVAL SECTION */}
        <section className="festival-section section-space" id="ngay-hoi">
          {/* Dong Son drum watermark ornament */}
          <img className="scroll-ornament" src="/assets/motifs/dong-son-gold.svg" alt="" aria-hidden="true" loading="lazy" />

          <div className="wrap">
            <div className="section-title" data-reveal>
              <h2>
                Cuộc vui có thật.<br />Những kết nối cũng vậy.
              </h2>
              <p>Phía sau mỗi thao tác trong game là người chơi, dụng cụ và không gian văn hóa ngoài đời.</p>
            </div>

            <div className="festival-grid">
              <figure>
                <img
                  src="https://media3.baotintuc.vn/images/XtMI2cTUOu7JtJPwFuYGlOhAp_5WaApFvOtSitpj84jY7LYX4Vvu6LZYHifoDz1Vsf51Y3DljZWdjVT5FcGhFP0gYc4ylp4gbWLoDLIGOnMewo7zRIcIbhrvlufNPFcQPZSHtPcLRqnub5ylixwLlA/Xen_ban_xen_muongnguoi_ThaiVan_ChanYen_BaiDinh_Cong_Hoan.jpg.avif"
                  alt="Không gian lễ hội Xên bản của người Thái"
                  loading="lazy"
                />
                <figcaption>
                  <h3>Lễ hội Lồng Tồng & Xên Bản</h3>
                  <p>Mùa xuân mở đầu bằng những nghi thức cúng trời đất, sau đó là tiếng cồng chiêng giục giã bước chân vào hội sạp, ném còn.</p>
                </figcaption>
              </figure>
              <figure>
                <img
                  src="https://visitsapa.com.vn/VisitSaPa/Post/%C4%90%E1%BB%99c%20%C4%91%C3%A1o%20l%E1%BB%85%20h%E1%BB%99i%20Ro%C3%B3ng%20Po%E1%BB%8Dc%20c%E1%BB%A7a%20ng%C6%B0%E1%BB%9Di%20Gi%C3%A1y%20Sa%20Pa-/7662/image-thumb__7662__720_jpg/image2.63369953.png"
                  alt="Lễ hội Roóng Poọc của người Giáy Sa Pa"
                  loading="lazy"
                />
                <figcaption>
                  <h3>Hội Roóng Poọc Sa Pa</h3>
                  <p>Cây nêu dựng thẳng đứng giữa thung lũng Mường Hoa, nơi nam nữ cùng tung còn gửi gắm ước nguyện đầu năm.</p>
                </figcaption>
              </figure>
            </div>

            <div className="festival-note">
              <h3>Mỗi nơi, một sắc thái.</h3>
              <p>
                Luật chơi và cách thực hành có thể khác nhau giữa các cộng đồng. Sắc Việt giới thiệu những nét cơ bản, đồng
                thời dẫn nguồn để bạn tiếp tục tìm hiểu từng bối cảnh.
              </p>
              <Link className="text-link" href="/tro-choi/nem-con#nguon">
                Đọc thêm từ nguồn tư liệu ↗
              </Link>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section wrap section-space" id="ve-du-an">
          <div className="about-heading" data-reveal>
            <h2>
              Từ tò mò,<br />đến một lần chạm.
            </h2>
          </div>
          <div className="about-copy">
            <p className="large-copy">Sắc Việt là một lời mời tìm hiểu văn hóa qua trò chơi.</p>
            <p>
              Chúng mình bắt đầu bằng những thao tác dễ thử: tung một quả còn, bước theo nhịp sạp, ghì thanh gậy tre. Từ đó, mở
              ra câu chuyện về con người và những cuộc vui đã gắn bó với cộng đồng.
            </p>
            <p>
              Bản số là một cách chuyển thể sáng tạo. Ảnh tư liệu, video và nguồn đọc giúp nối trải nghiệm trên màn hình với
              hoạt động ngoài đời.
            </p>
            <div className="about-principles">
              <p>
                <strong>Xem được bối cảnh: </strong>Ảnh và video luôn đi cùng chú thích, tác giả hoặc nguồn dẫn chứng.
              </p>
              <p>
                <strong>Bắt đầu dễ dàng: </strong>Khám phá từng trò chơi, có tư liệu minh họa phong phú và liên kết vào game
                ngay.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="faq-section wrap section-space" id="hoi-dap">
          <h2>Trước khi vào hội</h2>
          <div className="faq-list">
            <details>
              <summary>Trang này có mục đích gì?</summary>
              <p>
                Đây là chuyên trang tư liệu văn hóa của nhóm Sắc Việt, tập trung giới thiệu nguồn gốc, ý nghĩa, hình ảnh và
                video tư liệu ngoài đời của các trò chơi dân gian Việt Nam.
              </p>
            </details>
            <details>
              <summary>Tôi muốn quay lại sảnh trò chơi thì làm thế nào?</summary>
              <p>
                Bạn chỉ cần bấm vào nút <strong>"Sảnh Trò Chơi"</strong> ở góc trên bên phải hoặc biểu tượng logo “SẮC VIỆT” ở
                đầu trang để quay lại sảnh chơi game bất cứ lúc nào.
              </p>
            </details>
            <details>
              <summary>Nội dung văn hóa được lấy từ đâu?</summary>
              <p>
                Nội dung được biên soạn từ tư liệu nghiên cứu văn hóa dân gian, báo chí chính thống và nguồn tư liệu du lịch địa
                phương. Mỗi trang chi tiết có danh sách nguồn, chú thích ảnh và liên kết video tư liệu để bạn đối chiếu.
              </p>
            </details>
          </div>
        </section>

        {/* CLOSING */}
        <section className="closing-section wrap">
          <h2>
            Chọn một trò.<br />Mở một cuộc vui.
          </h2>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px" }}>
            <a className="button" href="#tro-choi">
              Khám phá văn hóa ↗
            </a>
            <Link className="button" href="/" style={{ backgroundColor: "#d97706", borderColor: "#d97706", color: "#fff" }}>
              Vào sảnh trò chơi ↗
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer wrap">
        <Link className="brand brand-sac-viet" href="/" title="Sắc Việt — Về Trang chủ chơi game">
          <span>SẮC VIỆT</span>
        </Link>
        <p>Khám phá văn hóa qua trò chơi.</p>
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
