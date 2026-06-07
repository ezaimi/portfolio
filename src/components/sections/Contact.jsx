import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mono = {
  fontFamily: '"Courier New", Courier, monospace',
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const LINKS = [
  { label: "GitHub",   href: "https://github.com/ezaimi" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/erisazaimi/" },
];

const contactCss = `
@media (max-width: 1199px) {
  .contact-section {
    padding: clamp(5rem, 12vw, 7rem) clamp(1.25rem, 6vw, 3.25rem) clamp(3rem, 8vw, 5rem) !important;
  }

  .contact-spacer {
    display: none !important;
  }

  .contact-head {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) !important;
    gap: 1rem !important;
    margin-bottom: clamp(1rem, 4vw, 1.5rem) !important;
  }

  .contact-title {
    font-size: clamp(4.2rem, 16vw, 9rem) !important;
    max-width: 100% !important;
    overflow-wrap: anywhere !important;
  }

  .contact-line {
    width: 100% !important;
    margin-bottom: 0 !important;
  }

  .contact-meta {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 0.6rem !important;
    align-items: start !important;
    margin-bottom: clamp(1rem, 4vw, 1.5rem) !important;
  }

  .contact-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }

  .contact-cell {
    min-width: 0 !important;
    min-height: clamp(10rem, 26vw, 13rem) !important;
    padding: clamp(1rem, 3vw, 1.25rem) !important;
  }

  .contact-cell:nth-child(2) {
    border-right: 0 !important;
  }

  .contact-cell:nth-child(1),
  .contact-cell:nth-child(2) {
    border-bottom: 1px solid #2a2a2a !important;
  }

  .contact-email {
    word-break: break-word !important;
    overflow-wrap: anywhere !important;
  }

  .contact-copy {
    justify-content: flex-start !important;
  }
}

@media (max-width: 639px) {
  .contact-section {
    padding-top: clamp(4.5rem, 18vw, 6rem) !important;
  }

  .contact-title {
    font-size: clamp(3.7rem, 18vw, 4.7rem) !important;
  }

  .contact-grid {
    grid-template-columns: 1fr !important;
  }

  .contact-cell {
    border-right: 0 !important;
    border-bottom: 1px solid #2a2a2a !important;
    min-height: 9.5rem !important;
  }

  .contact-cell:last-child {
    border-bottom: 0 !important;
  }

  .contact-copy {
    margin-top: 1.25rem !important;
  }
}
`;

export default function Contact() {
  const sectionRef = useRef(null);
  const headRef    = useRef(null);
  const metaRef    = useRef(null);
  const cellsRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headRef.current,  { opacity: 0, y: 40 })
      gsap.set(metaRef.current,  { opacity: 0 })
      gsap.set(".contact-cell",  { opacity: 0, y: 28 })

      // Scrub background from cream (Projects) to dark as section enters viewport.
      // Completes at "top 80%" — exactly when the entrance animation fires — so
      // all content is still opacity:0 during the color transition.
      gsap.to(sectionRef.current, {
        backgroundColor: "#1a1a1a",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top 80%",
          scrub: 0.8,
        },
      })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline()
          tl.to(headRef.current, { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" })
            .to(metaRef.current, { opacity: 1, duration: 0.7, ease: "power2.out" }, "-=0.55")
            .to(".contact-cell", { opacity: 1, y: 0, stagger: 0.08, duration: 0.75, ease: "power3.out" }, "-=0.45")
        },
      })
    })

    return () => ctx.revert()
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-section"
      style={{
        backgroundColor: "#F9F3E2",
        minHeight: "auto",
        overflowX: "clip",
        padding: "60px 52px 80px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{contactCss}</style>
      {/* Spacer — pushes heading + grid to the bottom */}
      <div className="contact-spacer" style={{ flex: 1 }} />

      {/* Heading inline with the divider line */}
      <div
        ref={headRef}
        className="contact-head"
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "28px",
          marginBottom: "16px",
        }}
      >
        <h2
          className="contact-title"
          style={{
            fontSize: "clamp(5rem, 14vw, 25rem)",
            fontWeight: 300,
            lineHeight: 0.88,
            letterSpacing: "0.002em",
            margin: 0,
            color: "#F9F3E2",
            flexShrink: 0,
          }}
        >
          Let's talk.
        </h2>
        <div
          className="contact-line"
          style={{
            flex: 1,
            height: "1px",
            backgroundColor: "rgba(249,243,226,0.12)",
            marginBottom: "14px",
          }}
        />
      </div>

      {/* Meta bar */}
      <div
        ref={metaRef}
        className="contact-meta"
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ ...mono, fontSize: "0.78rem", color: "#aaa" }}>
          Available for new projects
        </span>
        <span style={{ ...mono, fontSize: "0.78rem", color: "#aaa" }}>
          Germany · CET (GMT+1)
        </span>
      </div>

      {/* 4-column contact strip */}
      <div
        ref={cellsRef}
        className="contact-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          border: "1px solid #2a2a2a",
        }}
      >
        {/* Email — wider cell */}
        <div
          className="contact-cell"
          style={{
            borderRight: "1px solid #2a2a2a",
            padding: "22px 26px 28px",
            display: "flex",
            flexDirection: "column",
            minHeight: "160px",
          }}
        >
          <span style={{ ...mono, fontSize: "0.85rem", color: "#909090", marginBottom: "auto" }}>
            // email
          </span>
          <a
            className="contact-email"
            href="mailto:erisazaimi22@gmail.com"
            style={{
              fontFamily: '"Courier New", monospace',
              fontSize: "clamp(0.75rem, 1.4vw, 1.1rem)",
              letterSpacing: "0.06em",
              color: "#F9F3E2",
              textDecoration: "none",
              marginTop: "32px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(249,243,226,0.5)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#F9F3E2")}
          >
            erisazaimi22@gmail.com ↗
          </a>
        </div>

        {/* Social links */}
        <div
          className="contact-cell"
          style={{
            borderRight: "1px solid #2a2a2a",
            padding: "22px 26px 28px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span style={{ ...mono, fontSize: "0.85rem", color: "#909090", marginBottom: "auto" }}>
            // connect
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "32px" }}>
            {LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...mono,
                  fontSize: "0.85rem",
                  color: "#999",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F9F3E2")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
              >
                {label} ↗
              </a>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div
          className="contact-cell"
          style={{
            borderRight: "1px solid #2a2a2a",
            padding: "22px 26px 28px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span style={{ ...mono, fontSize: "0.85rem", color: "#909090", marginBottom: "auto" }}>
            // availability
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "32px" }}>
            <span style={{ ...mono, fontSize: "0.85rem", color: "#F9F3E2" }}>Freelance</span>
            <span style={{ ...mono, fontSize: "0.85rem", color: "#F9F3E2" }}>Full-time</span>
            <span style={{ ...mono, fontSize: "0.85rem", color: "#F9F3E2" }}>Contract</span>
          </div>
        </div>

        {/* Status */}
        <div
          className="contact-cell"
          style={{
            padding: "22px 26px 28px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span style={{ ...mono, fontSize: "0.85rem", color: "#909090", marginBottom: "auto" }}>
            // status
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#4ade80",
                  flexShrink: 0,
                }}
              />
              <span style={{ ...mono, fontSize: "0.85rem", color: "#F9F3E2" }}>Open to work</span>
            </div>
            <span style={{ ...mono, fontSize: "0.72rem", color: "#909090" }}>Response within 48h</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        className="contact-copy"
        style={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <span style={{ ...mono, fontSize: "0.72rem", color: "#666" }}>
          © 2025 Erisa Zaimi
        </span>
      </div>
    </section>
  );
}
