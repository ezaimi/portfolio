import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mono = {
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: "0.78rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

function CircleBadge({ badgeRef, style: extStyle = {} }) {
  return (
    <svg
      ref={badgeRef}
      viewBox="0 0 120 120"
      style={{
        display: "block",
        flexShrink: 0,
        color: "var(--c1)",
        ...extStyle,
      }}
    >
      <defs>
        <path id="cp" d="M60,60 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
      </defs>
      <text
        fill="currentColor"
        fontSize="9.2"
        fontFamily="'Courier New',monospace"
        letterSpacing="2"
      >
        <textPath href="#cp" textLength="248" lengthAdjust="spacing">CODE • DESIGN • SOLVE • CREATE •</textPath>
      </text>
      <line
        x1="60"
        y1="50"
        x2="60"
        y2="70"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="50"
        y1="60"
        x2="70"
        y2="60"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const EXPERIENCE = [
  { role: "Internship", company: "Vodafone", years: "May 2022 – June 2022" },
  {
    role: "Freelance Full-Stack Developer",
    company: "Self-employed",
    years: "2022 – 2025",
  },
  { role: "Visual Designer", company: "Studit", years: "2025 – 2026" },
];

const EDUCATION = [
  {
    num: "01",
    degree: "B.Sc.",
    field: "Software Engineering",
    years: "2021 – 2024",
  },
  {
    num: "02",
    degree: "M.Sc.",
    field: "Web Engineering",
    years: "2024 – 2026",
  },
];

const FOCUS = [
  "Web Development",
  "UI / UX Design",
  "Frontend Systems",
  "Design Systems",
];

export default function NowSection() {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const headRef = useRef(null);
  const infoRef = useRef(null);
  const badgeRef = useRef(null);
  const portraitRef = useRef(null);
  const statementRef = useRef(null);
  const educationRef = useRef(null);
  const experienceRef = useRef(null);
  const focusRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(badgeRef.current, {
        rotation: 360,
        duration: 22,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      tl.fromTo(
        headRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
      )
        .fromTo(
          infoRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.7, ease: "power2.out" },
          "-=0.55",
        )
        .fromTo(
          portraitRef.current,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out" },
          "-=0.5",
        )
        .fromTo(
          statementRef.current,
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
          "-=0.8",
        )
        .fromTo(
          educationRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.55",
        )
        .fromTo(
          experienceRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.5",
        )
        .fromTo(
          focusRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.4",
        );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ height: "200vh" }}>
      <div
        ref={innerRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#0c0c0c",
          display: "flex",
          flexDirection: "column",
          "--c1": "#F9F3E2",
          "--c2": "rgba(249,243,226,0.18)",
          "--cb": "#2a2a2a",
          "--ct": "#3a3a3a",
          "--co": "rgba(12,12,12,0.88)",
        }}
      >
        {/* Heading */}
        <div style={{ padding: "48px 52px 0", flexShrink: 0 }}>
          <div ref={headRef} style={{ opacity: 0 }}>
            <h2
              style={{
                fontSize: "clamp(5rem, 14vw, 25rem)",
                fontWeight: 300,
                lineHeight: 0.88,
                letterSpacing: "0.02em",
                color: "var(--c1)",
                margin: 0,
              }}
            >
              Developer &amp;
            </h2>
            <h2
              style={{
                fontSize: "clamp(5rem, 14vw, 25rem)",
                fontWeight: 300,
                lineHeight: 0.88,
                letterSpacing: "0.02em",
                margin: "0 0 18px",
                display: "flex",
                alignItems: "flex-end",
                gap: "12px",
              }}
            >
              <span style={{ color: "var(--c2)" }}>and </span>
              <span style={{ color: "var(--c1)" }}>Designer</span>
              <CircleBadge
                badgeRef={badgeRef}
                style={{
                  width: "clamp(3rem, 6vw, 8rem)",
                  height: "clamp(3rem, 6vw, 8rem)",
                }}
              />
            </h2>
          </div>
          <div
            ref={infoRef}
            style={{
              opacity: 0,
              borderTop: "1px solid var(--cb)",
              paddingTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "36px" }}>
              <span style={{ ...mono, color: "#aaa" }}>Based in Germany</span>
              <span style={{ ...mono, color: "#aaa" }}>CET (GMT +1)</span>
            </div>
            <span style={{ ...mono, color: "#999" }}>
              Available for new projects
            </span>
          </div>
        </div>

        {/* Body: portrait + content */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "40fr 60fr",
            marginTop: "14px",
            marginBottom: "40px",
            marginLeft: "40px",
            marginRight: "70px",
            borderTop: "1px solid var(--cb)",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Left: content panels — 2×2 grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              overflow: "hidden",
            }}
          >
            {/* Top-left: Currently */}
            <div
              ref={statementRef}
              style={{
                opacity: 0,
                borderRight: "1px solid var(--cb)",
                borderBottom: "1px solid var(--cb)",
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <span style={{ ...mono, color: "#909090", fontSize: "0.85rem" }}>
                // currently
              </span>
              <p
                style={{
                  ...mono,
                  fontSize: "0.85rem",
                  color: "var(--c1)",
                  lineHeight: 1.7,
                  margin: 0,
                  textTransform: "none",
                  letterSpacing: "0.04em",
                }}
              >
                Full-stack developer with a strong eye for UI/UX and visual
                design. I build polished digital products from backend logic to
                beautiful user interfaces.
              </p>
              <p
                style={{
                  ...mono,
                  fontSize: "0.85rem",
                  color: "#999",
                  lineHeight: 1.7,
                  margin: 0,
                  textTransform: "none",
                  letterSpacing: "0.04em",
                }}
              >
                Open to full-time opportunities and freelance.
              </p>
            </div>

            {/* Top-right: Education */}
            <div
              ref={educationRef}
              style={{
                opacity: 0,
                borderBottom: "1px solid var(--cb)",
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <span style={{ ...mono, color: "#909090", fontSize: "0.85rem" }}>
                // education
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {EDUCATION.map(({ num, degree, field, years }) => (
                  <div
                    key={num}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "24px 46px 1fr",
                        alignItems: "center",
                        gap: "0 10px",
                      }}
                    >
                      <span
                        style={{ ...mono, color: "#888", fontSize: "0.85rem" }}
                      >
                        {num}
                      </span>
                      <span
                        style={{
                          ...mono,
                          color: "var(--c1)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {degree}
                      </span>
                      <span
                        style={{
                          ...mono,
                          color: "var(--c1)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {field}
                      </span>
                    </div>
                    <div style={{ paddingLeft: "24px" }}>
                      <span
                        style={{ ...mono, color: "#999", fontSize: "0.85rem" }}
                      >
                        {years}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom-left: Experience */}
            <div
              ref={experienceRef}
              style={{
                opacity: 0,
                borderRight: "1px solid var(--cb)",
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <span style={{ ...mono, color: "#909090", fontSize: "0.85rem" }}>
                // experience
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {EXPERIENCE.map(({ role, company, years }, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <span
                      style={{
                        ...mono,
                        color: "var(--c1)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {role}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{ ...mono, color: "#999", fontSize: "0.85rem" }}
                      >
                        {company}
                      </span>
                      <span
                        style={{
                          ...mono,
                          color: "#999",
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {years}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom-right: Focus */}
            <div
              ref={focusRef}
              style={{
                opacity: 0,
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <span style={{ ...mono, color: "#909090", fontSize: "0.85rem" }}>
                // focus
              </span>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {FOCUS.map((s) => (
                  <span
                    key={s}
                    style={{
                      ...mono,
                      fontSize: "0.85rem",
                      color: "var(--c1)",
                      border: "1px solid var(--ct)",
                      padding: "3px 7px",
                      borderRadius: "1px",
                      width: "200px",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Portrait */}
          <div
            ref={portraitRef}
            style={{
              opacity: 0,
              position: "relative",
              overflow: "hidden",
              borderLeft: "1px solid var(--cb)",
              padding: "0 0 28px",
            }}
          >
            <img
              src="/images/oldme.png"
              alt="Erisa Zaimi"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, transparent 50%, var(--co) 100%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "46px",
                left: "20px",
                right: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <span
                style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: "0.72rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--c1)",
                  opacity: 0.75,
                }}
              >
                Hi, it's me!
              </span>
              <span
                style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: "0.72rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--c1)",
                  opacity: 0.55,
                }}
              >
                Germany, 2025
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
