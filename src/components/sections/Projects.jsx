import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ALL_PROJECTS, pad } from "../../data/projects";

gsap.registerPlugin(ScrollTrigger);

const FILTERS = ["Development", "UI / UX Design", "Product Design"];

export default function Projects() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter]   = useState("Development");
  const [hoveredId, setHoveredId]         = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const sectionRef   = useRef(null);
  const headRef      = useRef(null);
  const metaRef      = useRef(null);
  const gridRef      = useRef(null);
  const filterBarRef = useRef(null);
  const filterRefs   = useRef({});
  const isAnimating    = useRef(false);
  const isFirstRender  = useRef(true);
  const userStopped    = useRef(false);

  const filtered = ALL_PROJECTS.filter((p) => p.category === activeFilter);

  // Slide the underline indicator to the active tab
  useEffect(() => {
    const btn = filterRefs.current[activeFilter];
    const bar = filterBarRef.current;
    if (!btn || !bar) return;
    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicatorStyle({
      left: btnRect.left - barRect.left,
      width: btnRect.width,
      opacity: 1,
    });
  }, [activeFilter]);

  const handleFilter = (f, isAuto = false) => {
    if (f === activeFilter || isAnimating.current) return;
    if (!isAuto) userStopped.current = true;
    isAnimating.current = true;

    const cards = gridRef.current?.querySelectorAll(".proj-card");
    if (!cards?.length) {
      setActiveFilter(f);
      return;
    }

    gsap.to(cards, {
      opacity: 0,
      y: -18,
      scale: 0.94,
      stagger: { each: 0.03, from: "end" },
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => setActiveFilter(f),
    });
  };

  // Auto-advance tabs every 3 s; stops permanently on manual click
  useEffect(() => {
    if (userStopped.current) return;
    const id = setTimeout(() => {
      const next = FILTERS[(FILTERS.indexOf(activeFilter) + 1) % FILTERS.length];
      handleFilter(next, true);
    }, 3000);
    return () => clearTimeout(id);
  }, [activeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Animate new cards in after filter change (useLayoutEffect prevents flash)
  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const cards = gridRef.current?.querySelectorAll(".proj-card");
    if (!cards?.length) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 26, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: { each: 0.06, from: "start" },
        duration: 0.52,
        ease: "power3.out",
        onComplete: () => { isAnimating.current = false; ScrollTrigger.refresh(); },
      }
    );
  }, [activeFilter]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.fromTo(
        headRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }
      )
        .fromTo(
          metaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.7, ease: "power2.out" },
          "-=0.55"
        )
        .fromTo(
          ".proj-card",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, stagger: 0.07, duration: 0.75, ease: "power3.out" },
          "-=0.45"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{
        backgroundColor: "#F9F3E2",
        minHeight: "100vh",
        padding: "60px 52px 80px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Heading (marginBottom:auto pushes the rest toward the bottom) ── */}
      <div ref={headRef} style={{ opacity: 0, marginBottom: "auto" }}>
        <h2
          style={{
            fontSize: "clamp(5rem, 14vw, 25rem)",
            fontWeight: 300,
            lineHeight: 0.88,
            letterSpacing: "0.002em",
            margin: "0 0 20px",
            color: "#1a1a1a",
          }}
        >
          <span>Assets*</span>
          {/* <span
            style={{
              // fontStyle: "italic",
              // fontFamily: "Georgia, 'Times New Roman', serif",
               fontSize: "clamp(5rem, 14vw, 15rem)",
            }}
          >
             Work
          </span> */}
        </h2>
      </div>

      {/* ── Grid header: count left · category filters right ── */}
      <div
        ref={metaRef}
        style={{
          opacity: 0,
          borderTop: "1px solid rgba(26,26,26,0.15)",
          paddingTop: "12px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: "0.62rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#aaa",
          }}
        >
          {filtered.length} Projects
        </span>

        <div ref={filterBarRef} style={{ display: "flex", gap: "28px", position: "relative" }}>
          {/* Sliding underline indicator */}
          <div
            style={{
              position: "absolute",
              bottom: -4,
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              height: "1px",
              backgroundColor: "#1a1a1a",
              opacity: indicatorStyle.opacity,
              transition: "left 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s",
              pointerEvents: "none",
            }}
          />
          {FILTERS.map((f) => (
            <button
              key={f}
              ref={(el) => { filterRefs.current[f] = el; }}
              onClick={() => handleFilter(f)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 0 6px",
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "0.82rem",
                fontWeight: activeFilter === f ? 600 : 400,
                color: activeFilter === f ? "#1a1a1a" : "#aaa",
                transition: "color 0.25s ease, font-weight 0.25s ease",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4-column project grid ── */}
      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "3px",
        }}
      >
        {filtered.map((project) => (
          <div
            key={project.id}
            className="proj-card"
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => navigate(`/projects/${project.id}`)}
            style={{
              aspectRatio: "1",
              backgroundColor: "#1a1a1a",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            {/* Ghost index number — always visible, very subtle */}
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontFamily: '"Courier New", monospace',
                fontSize: "clamp(2.5rem, 4.5vw, 6rem)",
                fontWeight: 300,
                color: "rgba(249,243,226,0.06)",
                letterSpacing: "-0.04em",
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              {pad(project.id)}
            </span>

            {/* Hover overlay: gradient + project info */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)",
                opacity: hoveredId === project.id ? 1 : 0,
                transition: "opacity 0.25s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "16px",
              }}
            >
              <div
                style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(249,243,226,0.95)",
                  marginBottom: "4px",
                }}
              >
                {project.name}
              </div>
              <div
                style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: "0.55rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(249,243,226,0.5)",
                }}
              >
                {project.type} · {project.year}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
