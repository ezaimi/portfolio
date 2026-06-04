import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ALL_PROJECTS, pad } from "../../data/index";

gsap.registerPlugin(ScrollTrigger);

const FILTERS = ["Development", "UI / UX Design", "Product Design"];

const projectsCss = `
.projects-filter-button[data-active="false"]:hover {
  color: #bd8589 !important;
}

@media (max-width: 1199px) {
  .projects-section {
    min-height: auto !important;
    padding: clamp(5rem, 14vw, 7rem) clamp(1.25rem, 6vw, 3.25rem) clamp(4rem, 10vw, 6rem) !important;
  }

  .projects-head {
    margin-bottom: clamp(1.5rem, 6vw, 3rem) !important;
  }

  .projects-title {
    font-size: clamp(4.5rem, 18vw, 9rem) !important;
    line-height: 0.88 !important;
    margin-bottom: 0 !important;
  }

  .projects-meta {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
    align-items: start !important;
    margin-bottom: clamp(1rem, 4vw, 1.5rem) !important;
  }

  .projects-filter-bar {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 0.35rem 1rem !important;
    width: 100% !important;
  }

  .projects-filter-button {
    padding: 0 0 0.45rem !important;
    font-size: clamp(0.78rem, 2vw, 0.9rem) !important;
  }

  .projects-filter-button[data-active="true"] {
    border-bottom: 1px solid #1a1a1a !important;
  }

  .projects-indicator {
    display: none !important;
  }

  .projects-grid {
    gap: clamp(0.5rem, 2vw, 0.75rem) !important;
  }

  .proj-card {
    min-height: 0 !important;
  }

  .proj-card-overlay {
    opacity: 1 !important;
    background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.18) 58%, transparent 100%) !important;
    padding: clamp(0.9rem, 3vw, 1rem) !important;
  }

  .proj-card-index {
    font-size: clamp(3.25rem, 13vw, 5.5rem) !important;
    color: rgba(249,243,226,0.08) !important;
  }
}

@media (max-width: 639px) {
  .projects-section {
    padding-top: clamp(5rem, 18vw, 6rem) !important;
  }

  .projects-head {
    margin-bottom: 0.75rem !important;
  }

  .projects-title {
    font-size: clamp(4.1rem, 21vw, 5.5rem) !important;
  }

  .projects-meta {
    gap: 0.85rem !important;
  }

  .projects-filter-bar {
    justify-content: space-between !important;
  }

  .projects-filter-button {
    max-width: 7.5rem !important;
    text-align: left !important;
    line-height: 1.25 !important;
  }

  .projects-indicator {
    display: none !important;
  }

  .projects-grid {
    grid-template-columns: 1fr !important;
  }

  .proj-card {
    aspect-ratio: 1.08 / 1 !important;
  }
}

@media (min-width: 640px) and (max-width: 1199px) {
  .projects-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}
`;

export default function Projects() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFilter, setActiveFilter]   = useState(location.state?.filter ?? "Development");
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
  const userStopped    = useRef(!!location.state?.filter);

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

    gsap.killTweensOf(cards);
    gsap.to(cards, {
      opacity: 0,
      y: -8,
      scale: 0.985,
      stagger: { each: 0.012, from: "end" },
      duration: 0.12,
      ease: "power1.out",
      overwrite: "auto",
      force3D: true,
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

    gsap.killTweensOf(cards);
    gsap.fromTo(
      cards,
      { opacity: 0, y: 10, scale: 0.99 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: { each: 0.018, from: "start" },
        duration: 0.24,
        ease: "power2.out",
        overwrite: "auto",
        force3D: true,
        onComplete: () => { isAnimating.current = false; },
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
      className="projects-section"
      style={{
        backgroundColor: "#F9F3E2",
        minHeight: "100vh",
        padding: "60px 52px 80px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{projectsCss}</style>
      {/* ── Heading (marginBottom:auto pushes the rest toward the bottom) ── */}
      <div ref={headRef} className="projects-head" style={{ opacity: 0, marginBottom: "auto" }}>
        <h2
          className="projects-title"
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
        className="projects-meta"
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

        <div ref={filterBarRef} className="projects-filter-bar" style={{ display: "flex", gap: "28px", position: "relative" }}>
          {/* Sliding underline indicator */}
          <div
            className="projects-indicator"
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
              className="projects-filter-button"
              data-active={activeFilter === f}
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
        className="projects-grid"
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
              willChange: "transform, opacity",
              transform: "translateZ(0)",
            }}
          >
            {/* Cover image */}
            {project.img && !project.img.startsWith("/images/projects/") && (
              <img
                src={project.img}
                alt={project.name}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                  opacity: 1,
                  transform: 'translateZ(0)',
                }}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            )}

            {/* Ghost index number — always visible, very subtle */}
            {(!project.img || project.img.startsWith("/images/projects/")) && (
              <span
                className="proj-card-index"
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
            )}

            {/* Hover overlay: gradient + project info */}
            <div
              className="proj-card-overlay"
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
