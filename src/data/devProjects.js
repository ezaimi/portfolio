export const DEV_PROJECTS = [
  {
    id: 1,
    name: "Notebook Repair Pipeline",
    year: "2026",
    type: "Python · LLM · RAG",
    category: "Development",
    img: "/images/dev/thesis/thesismockup.webp",
    desc: "An open-LLM layer that explains and repairs dependency errors in scientific Jupyter notebooks — automatically, and at scale.",
    overview:
      "Most published research notebooks don't actually re-run. Usually it's something small — a library that isn't installed, or the wrong version of one — but the effect is the same: work that's supposed to be reproducible just isn't. Existing reproducibility pipelines are good at spotting these failures, then stop there. This project adds the missing step. When a notebook breaks, an open, locally-run LLM reads the traceback, explains in plain English what went wrong, looks up the correct package version live on PyPI, applies the fix, and re-runs the notebook to confirm it worked — logging every attempt as a reusable benchmark and feeding the outcome into a FAIR knowledge graph.",
    features: [
      "Turns cryptic Python tracebacks into plain-language explanations a non-programmer can follow",
      "Grounds every fix in live PyPI data (RAG), so it suggests a precise pip install pkg==version instead of guessing",
      "Validates by re-execution — a fix only counts if the notebook actually runs afterward",
      "Records each error → explanation → fix → outcome as an open benchmark dataset",
      "Enriches a knowledge graph with RDF repair provenance, queryable for future research",
      "Surfaces all of it in a dashboard: repair rates by error type, top failing packages, and a per-notebook repair view",
    ],
    stack:
      "Python · open / local LLMs · PyPI-grounded RAG · Docker · Jupyter (nbconvert / nbdime) · SQLite · RDF + SPARQL knowledge graph — Dashboard: React + Chart.js on a FastAPI backend over the pipeline's SQLite output.",
    role: "Sole developer — research, architecture, pipeline engineering, and frontend. M.Sc. Web Engineering thesis at TU Chemnitz, supervised by Dr. Sheeba Samuel.",
    status: "In Progress",
    github: "github.com/ezaimi/ma-thesis",
  },

  {
    id: 2,
    name: "KALTËR — Digital Wedding Invitations",
    year: "2026",
    type: "Next.js · Astro",
    category: "Development",
    img: "/images/dev/wedding/template3.webp",
    images: [
      "/images/dev/wedding/template3.webp",
      "/images/dev/wedding/template2.webp",
      "/images/dev/wedding/wedding3.webp",
    ],
    desc: "A full-stack platform for building and sharing personalized digital wedding invitations — six animated templates, built-in RSVP tracking, and a couple's own soundtrack, all behind a single shareable link.",
    overview:
      "Paper wedding invitations are expensive to print, easy to lose, and tell you nothing about who's actually coming. KALTËR replaces them with a digital invitation each couple can personalize and share as one link. A public marketing site introduces the product, while a separate invitation engine renders the couple's chosen design from six distinct templates — each with its own layout, animations, and theme. Guests open the link, read the details, and RSVP in place; the couple watches responses arrive through a guest-tracking view, and can even attach a playlist by searching Spotify and iTunes to set the mood with 30-second previews. The two halves run on different tools by design — Astro for a fast, static marketing site, and Next.js for the dynamic, per-couple invitation pages and API routes.",
    features: [
      "Six distinct invitation templates — each with its own layout, animation style, and theme, so couples pick what fits their wedding",
      "Built-in RSVP system — guests respond in place, and the couple tracks every submission from a single view",
      "Music integration through the Spotify and iTunes APIs — search any track and attach 30-second previews to set the mood",
      "Dynamic URL routing gives each couple a unique, shareable invitation link",
      "Split architecture on purpose — a static Astro marketing site for speed, a dynamic Next.js engine for the live invitations",
      "Polished motion throughout — Framer Motion and GSAP for animation, Lenis for smooth scrolling",
    ],
    stack:
      "Astro (static marketing site) · Next.js 16 / React 19 (dynamic invitation pages, routing, API routes) · TypeScript · Tailwind CSS 4 · Framer Motion · GSAP · Lenis · Spotify & iTunes APIs — Deployed on Vercel with CI/CD via GitHub Actions.",
    role: "Developer and UI/UX designer in a 2-person team — designed all invitation templates and built some of them; designed, co-developed, and now maintain the marketing site.",
    status: "Completed",
   
  },

  {
    id: 3,
    name: "Restaurant POS — Saporini Italiano",
    year: "2026",
    type: "Spring Boot · Next.js",
    category: "Development",
    img: "/images/dev/pos/saporini_mockup1.webp",
    desc: "A production-grade restaurant POS and management platform — handling everything from authentication to kitchen workflows, built for real operations rather than a CRUD demo.",
    overview:
      "Most restaurant software either does one thing well or tries to do everything badly. This platform manages the full operational flow of a restaurant — owners configure menus, branches, roles, and settings from a back office; waiters and cashiers create orders, assign them to tables, and take payments from a touch-friendly POS terminal; and the kitchen sees incoming tickets live through a KDS-style workflow. Underneath it's organized like a real enterprise system: cleanly separated domains (auth, menu, orders, payments, inventory, KDS, reports, settings) behind a layered Spring Boot backend, with security treated as a first-class concern — every request is scoped so one branch's staff can never reach another branch's data.",
    features: [
      "Role-based access control across owners, admins, waiters, cashiers, and kitchen staff — each app surfaces only what that role needs",
      "JWT authentication hardened with login rate limiting, IP/account attempt tracking, session limits, and soft-delete checks",
      "Branch-scoped authorization, so a user from one restaurant location can't read or touch another's menus, orders, or reports",
      "Full menu modeling — sections, items, variants, and option groups with prices, descriptions, and active/inactive states",
      "Order lifecycle tied to tables, customers, payments, and a live Kitchen Display System for preparation status",
      "Inventory and recipe tracking that ties ingredient usage to menu items and flags low-stock situations",
      "Audit logging on every important change (createdBy / updatedBy / timestamps) for full traceability",
      "Reporting layer for sales, orders, payments, and operational performance",
    ],
    stack:
      "Java · Spring Boot · Spring Security · Spring Data JPA / Hibernate · PostgreSQL · JWT · DTO-based REST API · Jakarta Bean Validation · Lombok · integration testing — Frontend: Next.js + React + TypeScript monorepo (Turborepo / pnpm) with separate admin, POS, KDS, and public apps, wired to the backend via an OpenAPI-generated TypeScript client.",
    role: "Backend & frontend developer in a 2-person team — domain analysis, database/ERD design, security implementation, and API design on the backend; plus the Next.js frontend monorepo structure (Turborepo/pnpm) and the client-side auth layer — protected routes, App Router middleware guards, JWT session handling, and auth context/token-refresh flow.",
    status: "In Progress",
    github: "github.com/ezaimi/POS",
  },

  {
    id: 4,
    name: "360°Deutsch — Immersive German Learning",
    year: "2025–2026",
    type: "Three.js · WebXR · Next.js",
    category: "Development",
    img: "/images/dev/webxr/3dmockup.webp",
     images: [
      "/images/dev/webxr/3dmockup.webp",
      "/images/dev/webxr/3dmock.webp",
    ],
    desc: "An immersive German-learning platform where you study vocabulary inside explorable 3D rooms — and in AR, right through your phone's browser.",
    overview:
      "Language apps tend to teach words as flat lists, disconnected from where you'd actually use them. 360°Deutsch teaches German inside the rooms where the words live — a kitchen, a living room, an office — so a learner explores a 3D space, taps an object like der Schreibtisch, and gets its article, plural, pronunciation, examples, and grammar in context. On a supported phone the whole thing opens in augmented reality through the browser, with no app to install; on anything else it falls back to a standard 3D view. Underneath, the vocabulary isn't hardcoded — it's pulled from a semantic knowledge graph of German words (CEFR-leveled, with forms, meanings, and relationships), and an AI assistant grounded in that graph turns verified data into plain explanations instead of inventing them. Built by the five-person AILand team during the Web Engineering Planspiel at TU Chemnitz.",
    features: [
      "Contextual learning — explore 3D rooms and tap objects to get the word, article, plural, pronunciation, examples, and grammar",
      "Full AR mode in the browser via WebXR — open a room in augmented reality on a supported phone, with a 3D fallback when AR isn't available",
      "Vocabulary modeled as a semantic knowledge graph (RDF/SPARQL, CEFR A1–B1), visualized in AR as connected word cards",
      "AI assistant grounded in the knowledge graph — explanations built from verified linguistic data rather than raw generative guesses",
      "CEFR-aligned progression — tasks, levels, streaks, and tracking for mastered vs. difficult words",
      "Secure accounts with Google/GitHub sign-in, JWT sessions, refresh tokens, and password recovery",
    ],
    stack:
      "Frontend: React · Next.js · TypeScript · Three.js · WebXR (browser AR) · GLB assets from Blender — Backend: FastAPI / Python · REST · SQLAlchemy · PostgreSQL · JWT + OAuth2 — Data: GraphDB triple store with RDF/Turtle, SPARQL, and the OntoLex-Lemon model over DBnary German vocabulary — AI: Gemini with knowledge-graph-grounded RAG.",
    role: "Frontend & immersive developer in a 5-person team (AILand, Web Engineering Planspiel at TU Chemnitz) — built the WebXR AR layer and the Three.js 3D rooms (scene rendering, raycasting, GLB room models), plus frontend work across the React/Next.js interface.",
    status: "Completed",
    github: "github.com/ezaimi/360-deutsch",
  },
];
