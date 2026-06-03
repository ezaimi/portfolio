import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mono = {
  fontFamily: '"Courier New", Courier, monospace',
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const nowSectionCss = `
.now-section {
  height: auto;
  background: #0c0c0c;
  overflow: hidden;
}

.now-inner {
  --c1: #F9F3E2;
  --c2: rgba(249, 243, 226, 0.18);
  --cb: #2a2a2a;
  --ct: #3a3a3a;
  --co: rgba(12, 12, 12, 0.88);
  position: relative;
  min-height: 100svh;
  overflow: visible;
  background: #0c0c0c;
  display: flex;
  flex-direction: column;
}

.now-heading {
  flex-shrink: 0;
  padding: clamp(5rem, 18vw, 6rem) clamp(1.25rem, 6vw, 3.25rem) 0;
}

.now-head {
  opacity: 0;
}

.now-title {
  font-size: clamp(3.35rem, 16.5vw, 7rem);
  font-weight: 300;
  line-height: 0.88;
  letter-spacing: 0;
  color: var(--c1);
  margin: 0;
}

.now-title-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  column-gap: clamp(0.5rem, 2vw, 1rem);
  row-gap: 0.1rem;
  margin: 0 0 clamp(0.5rem, 2vw, 1rem);
}

.now-muted {
  grid-column: 1 / -1;
  color: var(--c2);
}

.now-designer {
  min-width: 0;
  color: var(--c1);
}

.now-badge {
  width: clamp(2.5rem, 13vw, 4.25rem);
  height: clamp(2.5rem, 13vw, 4.25rem);
  align-self: center;
  justify-self: end;
  margin-bottom: 0.08em;
}

.now-info {
  opacity: 0;
  border-top: 1px solid var(--cb);
  padding-top: clamp(0.7rem, 2vw, 1rem);
  display: grid;
  gap: 0.55rem;
}

.now-info-left {
  display: grid;
  gap: 0.4rem;
}

.now-mono {
  font-family: "Courier New", Courier, monospace;
  font-size: clamp(0.58rem, 2.35vw, 0.78rem);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.now-body {
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  margin: clamp(1.25rem, 4vw, 2.5rem) clamp(1.25rem, 6vw, 3.25rem) clamp(2rem, 8vw, 4rem);
  border-top: 1px solid var(--cb);
  min-height: 0;
  overflow: visible;
}

.now-panels {
  order: 2;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  border-left: 1px solid var(--cb);
  border-right: 1px solid var(--cb);
  border-bottom: 1px solid var(--cb);
}

.now-panel {
  opacity: 0;
  min-width: 0;
  border-top: 1px solid var(--cb);
  padding: clamp(1rem, 4vw, 1.25rem);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.now-panel-title {
  color: #909090;
}

.now-copy {
  color: var(--c1);
  line-height: 1.65;
  margin: 0;
  text-transform: none;
  letter-spacing: 0.04em;
}

.now-copy-muted {
  color: #999;
}

.now-stack {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.now-education-item,
.now-experience-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.now-education-row {
  display: grid;
  grid-template-columns: 2ch 3.5rem minmax(0, 1fr);
  align-items: center;
  gap: 0 0.65rem;
}

.now-field {
  min-width: 0;
}

.now-years {
  color: #999;
}

.now-education-years {
  padding-left: calc(2ch + 0.65rem);
}

.now-experience-meta {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.35rem 1rem;
}

.now-focus-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.now-focus-item {
  width: min(100%, 14rem);
  border: 1px solid var(--ct);
  border-radius: 1px;
  padding: 0.25rem 0.5rem;
  color: var(--c1);
  box-sizing: border-box;
}

.now-portrait {
  opacity: 0;
  order: 1;
  position: relative;
  min-height: clamp(18rem, 86vw, 30rem);
  overflow: hidden;
  border-left: 1px solid var(--cb);
  border-right: 1px solid var(--cb);
}

.now-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.now-portrait-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, var(--co) 100%);
  pointer-events: none;
}

.now-portrait-caption {
  position: absolute;
  bottom: clamp(1rem, 4vw, 2rem);
  left: clamp(1rem, 4vw, 1.25rem);
  right: clamp(1rem, 4vw, 1.25rem);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.now-portrait-caption span {
  font-family: "Courier New", monospace;
  font-size: clamp(0.58rem, 2.2vw, 0.72rem);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c1);
}

/* Mobile: show &amp; in "and" row, hide from first h2 */
.now-amp-desktop { display: none; }
.now-amp-mobile  { display: inline; }

@media (max-width: 639px) {
  .now-and-text { color: var(--c1); }
}

@media (min-width: 640px) {
  .now-amp-desktop { display: inline; }
  .now-amp-mobile  { display: none; }
}

@media (max-width: 420px) {
  .now-experience-meta,
  .now-portrait-caption {
    grid-template-columns: 1fr;
    display: grid;
  }

  .now-experience-meta .now-years,
  .now-portrait-caption span:last-child {
    justify-self: start;
  }
}

@media (min-width: 640px) {
  .now-heading {
    padding-top: clamp(3.25rem, 7vw, 4rem);
  }

  .now-title {
    font-size: clamp(5rem, 14vw, 9rem);
  }

  .now-title-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.1em;
  }

  .now-muted {
    grid-column: auto;
  }

  .now-badge {
    width: clamp(3rem, 7vw, 5rem);
    height: clamp(3rem, 7vw, 5rem);
  }

  .now-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .now-info-left {
    display: flex;
    gap: clamp(1.25rem, 4vw, 2.25rem);
  }

  .now-panels {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .now-panel-current,
  .now-panel-experience {
    border-right: 1px solid var(--cb);
  }

  .now-panel-current,
  .now-panel-education {
    border-bottom: 1px solid var(--cb);
  }
}

@media (min-width: 900px) {
  .now-inner {
    min-height: 700px;
  }
}

@media (min-width: 1200px) {
  .now-section {
    height: 100vh;
  }

  .now-inner {
    position: relative;
    top: 0;
    height: 100vh;
    min-height: 700px;
    overflow: hidden;
  }

  .now-heading {
    padding: clamp(2rem, 3.3vw, 3rem) clamp(2rem, 3.6vw, 3.25rem) 0;
  }

  .now-title {
    font-size: clamp(6rem, 13.8vw, 25.5rem);
    line-height: 0.88;
    letter-spacing: 0.02em;
  }

  .now-title-row {
    gap: 0.75rem;
  }

  .now-badge {
    width: clamp(3rem, 5.2vw, 7rem);
    height: clamp(3rem, 5.2vw, 7rem);
    align-self: flex-end;
  }

  .now-info {
    padding-top: 0.65rem;
  }

  .now-body {
    grid-template-columns: 40fr 60fr;
    margin-top: 0.875rem;
    margin-bottom: clamp(1.75rem, 3vw, 2.5rem);
    margin-left: clamp(2rem, 2.8vw, 2.5rem);
    margin-right: clamp(3rem, 4.8vw, 4.375rem);
    overflow: hidden;
    align-items: stretch;
  }

  .now-panels {
    order: 1;
    grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
    border: 0;
    overflow: hidden;
  }

  .now-panel {
    border-top: 0;
    padding: clamp(0.75rem, 1.25vw, 1.125rem) clamp(0.9rem, 1.5vw, 1.375rem);
    gap: clamp(0.45rem, 0.8vw, 0.75rem);
    overflow: hidden;
  }

  .now-copy,
  .now-panel-title,
  .now-panel .now-mono {
    font-size: clamp(0.58rem, 0.66vw, 0.85rem);
  }

  .now-stack {
    gap: clamp(0.45rem, 0.75vw, 0.65rem);
  }

  .now-focus-list {
    gap: clamp(0.35rem, 0.6vw, 0.5rem);
  }

  .now-focus-item {
    width: min(100%, 12.5rem);
    padding: 0.2rem 0.45rem;
  }

  .now-portrait {
    order: 2;
    min-height: 0;
    height: 100%;
    border-left: 1px solid var(--cb);
    border-right: 0;
    padding-bottom: 1.75rem;
  }

  .now-portrait-caption {
    bottom: 2.875rem;
  }
}

@media (min-width: 1200px) and (max-height: 820px) {
  .now-heading {
    padding: 3.5rem 2.25rem 0;
  }

  .now-title {
    font-size: clamp(6rem, 13.8vw, 25.5rem);
  }

  .now-body {
    margin: 0.65rem 3rem 1.5rem 2.25rem;
  }

  .now-info {
    padding-top: 0.5rem;
  }

  .now-panel {
    padding: 0.65rem 0.85rem;
    gap: 0.4rem;
  }

  .now-copy,
  .now-panel-title,
  .now-panel .now-mono {
    font-size: 0.58rem;
    line-height: 1.5;
  }

  .now-focus-list {
    gap: 0.3rem;
  }

  .now-focus-item {
    padding: 0.16rem 0.4rem;
  }
}

@media (min-width: 1200px) and (max-width: 1699px) {
  .now-title {
    font-size: clamp(6rem, 12.5vw, 22rem) !important;
  }

  .now-inner {
    height: 100svh !important;
    min-height: 750px !important;
  }

  .now-body {
    margin: 0.5rem clamp(2rem, 2.8vw, 2.5rem) 0.75rem clamp(2rem, 2.8vw, 2.5rem) !important;
  }

  .now-portrait {
    padding-bottom: 0.75rem !important;
  }

  .now-portrait-caption {
    bottom: 1.6rem !important;
  }
}

@media (min-width: 1700px) and (min-height: 980px) {
  .now-title {
    font-size: clamp(6rem, 13.8vw, 25.5rem);
  }

  .now-badge {
    width: clamp(4rem, 5.8vw, 8rem);
    height: clamp(4rem, 5.8vw, 8rem);
  }

  .now-portrait-caption span {
    font-size: clamp(0.72rem, 0.9vw, 1rem);
  }
}
`;

function CircleBadge({ badgeRef, className = "" }) {
  return (
    <svg
      ref={badgeRef}
      className={className}
      viewBox="0 0 120 120"
      style={{
        display: "block",
        flexShrink: 0,
        color: "var(--c1)",
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
        <textPath href="#cp" textLength="248" lengthAdjust="spacing">
          CODE - DESIGN - SOLVE - CREATE -
        </textPath>
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
  { role: "Internship", company: "Vodafone", years: "May 2022 - June 2022" },
  {
    role: "Freelance Full-Stack Developer",
    company: "Self-employed",
    years: "2022 - 2025",
  },
  { role: "Visual Designer", company: "Studit", years: "2025 - 2026" },
];

const EDUCATION = [
  {
    num: "01",
    degree: "B.Sc.",
    field: "Software Engineering",
    years: "2021 - 2024",
  },
  {
    num: "02",
    degree: "M.Sc.",
    field: "Web Engineering",
    years: "2024 - 2026",
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
      // Portrait: visible but fully hidden by clip-path
      gsap.set(portraitRef.current, { opacity: 1, clipPath: "inset(0 0 100% 0)" });

      // Badge continuous spin
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

      // Title fades and slides up
      tl.fromTo(
        headRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
      )
      // Badge elastic scale-in, overlaps with title
      .fromTo(
        badgeRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2.5)" },
        "-=0.5"
      )
      // Info bar slides in from right
      .fromTo(
        infoRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.65, ease: "power3.out" },
        "-=0.5"
      )
      // Portrait wipes in top-to-bottom (scanner reveal)
      .to(
        portraitRef.current,
        { clipPath: "inset(0 0 0% 0)", duration: 1.15, ease: "power4.inOut" },
        "-=0.55"
      )
      // Panels flip in with 3D perspective, staggered (pivot at top edge)
      .fromTo(
        [statementRef.current, educationRef.current, experienceRef.current, focusRef.current],
        { opacity: 0, y: 28, rotationX: -50, transformPerspective: 700, transformOrigin: "50% 0%" },
        { opacity: 1, y: 0, rotationX: 0, duration: 0.75, ease: "power3.out", stagger: 0.1 },
        "-=0.85"
      )
      // Focus tags slide in from left individually
      .fromTo(
        ".now-focus-item",
        { opacity: 0, x: -22 },
        { opacity: 1, x: 0, duration: 0.45, ease: "power2.out", stagger: 0.07 },
        "-=0.4"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="now-section">
      <style>{nowSectionCss}</style>
      <div ref={innerRef} className="now-inner">
        <div className="now-heading">
          <div ref={headRef} className="now-head">
            <h2 className="now-title">Developer<span className="now-amp-desktop"> &amp;</span></h2>
            <h2 className="now-title now-title-row">
              <span className="now-muted"><span className="now-amp-mobile">&amp; </span><span className="now-and-text">and </span></span>
              <span className="now-designer">Designer</span>
              <CircleBadge badgeRef={badgeRef} className="now-badge" />
            </h2>
          </div>
          <div ref={infoRef} className="now-info">
            <div className="now-info-left">
              <span style={{ ...mono, color: "#aaa" }} className="now-mono">
                Based in Germany
              </span>
              <span style={{ ...mono, color: "#aaa" }} className="now-mono">
                CET (GMT +1)
              </span>
            </div>
            <span style={{ ...mono, color: "#999" }} className="now-mono">
              Available for new projects
            </span>
          </div>
        </div>

        <div className="now-body">
          <div className="now-panels">
            <div
              ref={statementRef}
              className="now-panel now-panel-current"
            >
              <span
                style={{ ...mono }}
                className="now-mono now-panel-title"
              >
                // currently
              </span>
              <p
                style={{ ...mono }}
                className="now-mono now-copy"
              >
                Full-stack developer with a strong eye for UI/UX and visual
                design. I build polished digital products from backend logic to
                beautiful user interfaces.
              </p>
              <p
                style={{ ...mono }}
                className="now-mono now-copy now-copy-muted"
              >
                Open to full-time opportunities and freelance.
              </p>
            </div>

            <div
              ref={educationRef}
              className="now-panel now-panel-education"
            >
              <span
                style={{ ...mono }}
                className="now-mono now-panel-title"
              >
                // education
              </span>
              <div className="now-stack">
                {EDUCATION.map(({ num, degree, field, years }) => (
                  <div key={num} className="now-education-item">
                    <div className="now-education-row">
                      <span
                        style={{ ...mono, color: "#888" }}
                        className="now-mono"
                      >
                        {num}
                      </span>
                      <span
                        style={{ ...mono, color: "var(--c1)" }}
                        className="now-mono"
                      >
                        {degree}
                      </span>
                      <span
                        style={{ ...mono, color: "var(--c1)" }}
                        className="now-mono now-field"
                      >
                        {field}
                      </span>
                    </div>
                    <div className="now-education-years">
                      <span
                        style={{ ...mono }}
                        className="now-mono now-years"
                      >
                        {years}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={experienceRef}
              className="now-panel now-panel-experience"
            >
              <span
                style={{ ...mono }}
                className="now-mono now-panel-title"
              >
                // experience
              </span>
              <div className="now-stack">
                {EXPERIENCE.map(({ role, company, years }, i) => (
                  <div key={i} className="now-experience-item">
                    <span
                      style={{ ...mono, color: "var(--c1)" }}
                      className="now-mono"
                    >
                      {role}
                    </span>
                    <div className="now-experience-meta">
                      <span
                        style={{ ...mono, color: "#999" }}
                        className="now-mono"
                      >
                        {company}
                      </span>
                      <span
                        style={{ ...mono }}
                        className="now-mono now-years"
                      >
                        {years}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div ref={focusRef} className="now-panel now-panel-focus">
              <span
                style={{ ...mono }}
                className="now-mono now-panel-title"
              >
                // focus
              </span>
              <div className="now-focus-list">
                {FOCUS.map((s) => (
                  <span
                    key={s}
                    style={{ ...mono }}
                    className="now-mono now-focus-item"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div ref={portraitRef} className="now-portrait">
            <img src="/images/oldme.png" alt="Erisa Zaimi" />
            <div className="now-portrait-shade" />
            <div className="now-portrait-caption">
              <span style={{ opacity: 0.75 }}>Hi, it's me!</span>
              <span style={{ opacity: 0.55 }}>Germany, 2025</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
