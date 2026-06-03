import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ALL_PROJECTS } from "../data/projects";

const MONO = "'Space Mono Hero', 'Courier New', monospace";

const fmt = (n) => (n < 10 ? `0${n}` : `${n}`);

const PROJECT_IMAGE_PATHS = [
  ...new Set(
    ALL_PROJECTS.flatMap((project) => [project.img, project.pageImg])
      .filter((src) => src && !src.startsWith("/images/projects/"))
  ),
];

const preloadImage = (src) => new Promise((resolve) => {
  const img = new Image();
  img.onload = async () => {
    try {
      if (img.decode) await img.decode();
    } catch {
      // Decoding can fail for cached images in some browsers; the load still helps.
    }
    resolve(src);
  };
  img.onerror = () => resolve(src);
  img.src = src;
});

export default function PageLoader({ onDone }) {
  const topRef      = useRef(null);
  const bottomRef   = useRef(null);
  const contentRef  = useRef(null);
  const numberRef   = useRef(null);
  const barFillRef  = useRef(null);
  const detailRef   = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    let scramble = null;
    let progressTween = null;
    let finishCall = null;
    let isCancelled = false;
    const progress = { val: 0 };

    const setProgress = (next) => {
      progressTween?.kill();
      progressTween = gsap.to(progress, {
        val: next,
        duration: 0.32,
        ease: "power2.out",
        onUpdate() {
          const value = Math.round(progress.val);
          if (numberRef.current)
            numberRef.current.textContent = value >= 100 ? "100" : fmt(value);
          if (barFillRef.current)
            barFillRef.current.style.transform = `scaleX(${Math.min(progress.val, 100) / 100})`;
        },
      });
    };

    // Phase 1 — rapid scramble (0 → 0.5s)
    scramble = setInterval(() => {
      if (numberRef.current)
        numberRef.current.textContent = fmt(Math.floor(Math.random() * 100));
    }, 50);

    // Phase 2 — smooth count + progress bar (starts at 0.5s)
    const startCount = setTimeout(() => {
      clearInterval(scramble);

      gsap.fromTo(
        detailRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.3 }
      );

      const total = PROJECT_IMAGE_PATHS.length;
      let loaded = 0;
      const minDuration = new Promise((resolve) => setTimeout(resolve, 1400));
      const assetsReady = Promise.all(
        PROJECT_IMAGE_PATHS.map((src) => preloadImage(src).then(() => {
          loaded += 1;
          setProgress(total ? Math.min(96, (loaded / total) * 96) : 96);
        }))
      );

      Promise.all([assetsReady, minDuration]).then(() => {
        if (isCancelled) return;
        setProgress(100);
        finishCall = gsap.delayedCall(0.22, () => {
          if (!isCancelled) exit.play();
        });
      });
    }, 500);

    // Exit — split panels apart after count finishes
    const exit = gsap.timeline({
      paused: true,
      onStart: () => {
        document.body.style.overflow = "";
        const html = document.documentElement;
        const prev = html.style.scrollBehavior;
        html.style.scrollBehavior = "auto";
        window.scrollTo(0, 0);
        window.dispatchEvent(new CustomEvent("loader:beforeReveal"));
        html.style.scrollBehavior = prev;
      },
      onComplete: () => {
        window.__loaderDone = true;
        window.dispatchEvent(new CustomEvent("loader:done"));
        onDone();
      },
    });

    exit
      .to(contentRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" })
      .to(topRef.current,     { y: "-100%", duration: 0.75, ease: "power4.inOut" }, "-=0.05")
      .to(bottomRef.current,  { y: "100%",  duration: 0.75, ease: "power4.inOut" }, "<");

    return () => {
      isCancelled = true;
      document.body.style.overflow = "";
      clearInterval(scramble);
      clearTimeout(startCount);
      progressTween?.kill();
      finishCall?.kill();
      exit.kill();
    };
  }, [onDone]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: 1,
          height: 1,
          overflow: "hidden",
          opacity: 0.001,
        }}
      >
        {PROJECT_IMAGE_PATHS.map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            decoding="sync"
            loading="eager"
            style={{ width: 1, height: 1, objectFit: "cover" }}
          />
        ))}
      </div>

      {/* Split panels */}
      <div ref={topRef}    style={{ position: "absolute", top: 0,    left: 0, right: 0, height: "50%", background: "#0a0a0a" }} />
      <div ref={bottomRef} style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "#0a0a0a" }} />

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "clamp(2rem, 6vw, 4rem)",
        }}
      >
        {/* Large number — bottom-left, very prominent */}
        <span
          ref={numberRef}
          style={{
            fontFamily: MONO,
            fontSize: "clamp(9rem, 30vw, 26rem)",
            fontWeight: 400,
            color: "#F9F3E2",
            lineHeight: 0.85,
            letterSpacing: "-0.05em",
            display: "block",
          }}
        >
          00
        </span>

        {/* Bottom row: progress bar + label */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "2rem",
            marginTop: "clamp(1.5rem, 4vw, 2.5rem)",
          }}
        >
          {/* Progress bar */}
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(249,243,226,0.15)",
              overflow: "hidden",
            }}
          >
            <div
              ref={barFillRef}
              style={{
                width: "100%",
                height: "100%",
                background: "#F9F3E2",
                transformOrigin: "left center",
                transform: "scaleX(0)",
              }}
            />
          </div>

          {/* Small detail label */}
          <span
            ref={detailRef}
            style={{
              fontFamily: MONO,
              fontSize: "clamp(0.5rem, 1.4vw, 0.65rem)",
              fontWeight: 400,
              letterSpacing: "0.2em",
              color: "rgba(249,243,226,0.45)",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              opacity: 0,
            }}
          >
            Developer &amp; Designer
          </span>
        </div>
      </div>
    </div>
  );
}
