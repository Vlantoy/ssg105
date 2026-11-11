"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function usePortalAnimations() {
  const flightLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 1. Hero text stagger entrance
      const hero = document.querySelector(".hero-copy, .detail-hero-copy");
      if (hero && hero.children.length > 0) {
        gsap.from(hero.children, {
          y: 24,
          opacity: 0,
          duration: 0.75,
          stagger: 0.09,
          ease: "power2.out",
          clearProps: "all",
        });
      }

      // 2. [data-reveal] elements fade up on scroll
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 32,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: el,
            start: "top 94%",
            once: true,
          },
        });
      });
    });

    mm.add("(min-width: 1000px) and (prefers-reduced-motion: no-preference)", () => {
      // 3. Montage parallax
      const collage = document.querySelector(".hero-montage");
      if (collage) {
        gsap.from(collage, {
          y: 28,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          clearProps: "all",
        });
        gsap.to(".hero-inset-photo", {
          y: -38,
          ease: "none",
          scrollTrigger: {
            trigger: ".home-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const compact = window.matchMedia("(max-width: 800px)").matches;

      // 4. Opening drum 360deg spin on scroll
      const opening = document.querySelector<HTMLElement>(".home-hero");
      if (opening) {
        gsap.to(opening, {
          "--hero-drum-turn": "360deg",
          ease: "none",
          scrollTrigger: {
            trigger: opening,
            start: "top top",
            end: () => "+=" + opening.offsetHeight * 2,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });
      }

      // 5. Parallax and rotation on scroll ornaments (Dong Son bronze drum watermarks)
      document.querySelectorAll(".scroll-ornament").forEach((el) => {
        if (!el.parentElement) return;
        gsap.fromTo(
          el,
          { rotation: -12, y: 90 },
          {
            rotation: 36,
            y: -100,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });

      // 6. Game card tilt and entrance
      document
        .querySelectorAll(".game-image, .gallery-grid .photo-button, .festival-grid figure > a")
        .forEach((el, index) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.7,
            },
          });
          tl.fromTo(
            el,
            {
              x: (index % 2 ? 1 : -1) * (compact ? 18 : 55),
              y: 55,
              scale: 0.94,
              rotation: compact ? 0 : index % 2 ? 2 : -2,
              opacity: 0.4,
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: 0.3,
              ease: "power1.out",
            }
          )
            .to(el, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.4 })
            .to(el, { y: -35, scale: 0.97, opacity: 0.65, duration: 0.3, ease: "power1.in" });
        });

      // 7. Flock of cranes flying across the screen on slogan
      const flightLayer = flightLayerRef.current;
      if (flightLayer) {
        const flock = Array.from(flightLayer.querySelectorAll<HTMLElement>(".flock-bird"));
        let activeFlight: gsap.core.Timeline | null = null;

        const flyPast = () => {
          if (activeFlight?.isActive()) return;
          flightLayer.hidden = false;
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const widths = [0.43, 0.28, 0.23, 0.33, 0.19].map((r) =>
            Math.min(compact ? 330 : 650, Math.max(compact ? 155 : 220, vw * r))
          );
          const lanes = [0, -0.12, 0.16, -0.24, 0.25];
          const duration = compact ? 1.55 : 1.85;

          activeFlight = gsap.timeline({
            onComplete: () => {
              flightLayer.hidden = true;
            },
          });

          flock.forEach((bird, i) => {
            const size = widths[i];
            const delay = i * 0.09;
            gsap.set(bird, { width: size, zIndex: 5 - i, transformOrigin: "50% 50%" });
            activeFlight
              ?.fromTo(
                bird,
                { x: vw + size * 0.15, y: vh * (0.66 + lanes[i]), rotation: 10, scale: 0.72, opacity: 0 },
                {
                  x: -size * 1.25,
                  y: -vh * 0.3 + vh * lanes[i] * 0.4,
                  rotation: 24,
                  scale: 1.12,
                  duration,
                  ease: "power1.inOut",
                },
                delay
              )
              .to(bird, { opacity: i === 0 ? 0.96 : 0.83, duration: 0.1 }, delay)
              .to(bird, { opacity: 0, duration: 0.13 }, delay + duration - 0.13);
          });
        };

        const slogan = document.querySelector(".games-slogan");
        if (slogan) {
          ScrollTrigger.create({
            trigger: slogan,
            start: "center 60%",
            once: true,
            onEnter: flyPast,
          });
        }
      }
    });

    ScrollTrigger.refresh();

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return { flightLayerRef };
}
