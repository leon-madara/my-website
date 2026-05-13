/* global React */
const { useEffect, useRef, useState } = React;

/* ------------------------------------------------------------------ */
/* Data (mirrors aboutContent.ts shape)                                */
/* ------------------------------------------------------------------ */
const ABOUT = {
  identity: {
    name: "Leon Madara",
    title: "Full Stack AI Developer & Designer",
    location: "Nairobi, Kenya / Remote",
    email: "leon.madara@outlook.com",
    github: "https://github.com/leon-madara",
    linkedin: "https://www.linkedin.com/in/leon-madara/",
    twitter: "https://twitter.com/leon_madara",
    bio: "Full Stack AI Developer & Designer with over a decade of hands-on experience across data, product, and interface work. I bring analytical rigour and sharp interface instincts to every build — from interactive dashboards to full-stack AI-integrated web products.",
  },
  expertise: [
    {
      key: "web",
      title: "Web Design & Development",
      blurb: "Production-ready React, TypeScript, and Vite stacks. AI-integrated products that ship.",
      bullets: ["React 19 / TS", "GSAP + Framer", "Vite / Vercel"],
      featured: true,
      icon: "code",
    },
    {
      key: "uiux",
      title: "UI / UX Design",
      blurb: "Interface instincts grounded in accessibility, type, and motion craft.",
      bullets: ["Design systems", "Wireframing", "Prototyping"],
      icon: "pen",
    },
    {
      key: "data",
      title: "Data Analysis",
      blurb: "Turning messy data into product-grade dashboards and decisions.",
      bullets: ["SQL + Python", "Looker / BI", "Modelling"],
      icon: "chart",
    },
  ],
  skills: [
    { name: "Data Tools",       color: "var(--kenyan-green)", items: ["SQL", "Python", "Pandas", "Looker", "Tableau", "BigQuery", "dbt"] },
    { name: "Web Development",  color: "var(--kenyan-red)",   items: ["React 19", "TypeScript", "Vite", "Node", "GSAP", "Framer Motion"] },
    { name: "UI / UX Design",   color: "var(--savanna-gold)", items: ["Figma", "Tokens", "Design systems", "Prototyping", "A11y"] },
    { name: "Other",            color: "var(--terracotta)",   items: ["Git", "Vercel", "Cloudflare", "Notion", "Linear"] },
  ],
  timeline: [
    {
      years: "2015 – 2018",
      role: "Junior Data Analyst",
      org: "Mumias, Kenya",
      skills: ["SQL", "Excel", "Tableau", "Python"],
      bullets: [
        "Built reporting pipelines for an agriculture supply chain serving 10k+ growers.",
        "Designed the company's first analytics dashboard, reducing weekly review by 6 hours.",
      ],
    },
    {
      years: "2018 – 2022",
      role: "Freelance Full Stack Developer",
      org: "Remote / Nairobi",
      skills: ["React", "Node", "PostgreSQL", "AWS", "Figma"],
      bullets: [
        "Shipped 14 client products across fintech, travel, and education.",
        "Lead designer-engineer for a Series-A travel startup's customer dashboard.",
      ],
    },
    {
      years: "2022 – Present",
      role: "Founder · Code by Leon",
      org: "Nairobi, KE",
      skills: ["React 19", "TypeScript", "GSAP", "AI/LLM", "Design systems"],
      bullets: [
        "Founded a boutique studio building AI-integrated web products.",
        "Designed and engineered Code by Leon — full design system, motion, and content.",
      ],
    },
  ],
  education: [
    {
      school: "University of Nairobi",
      degree: "BSc, Mathematics & Computer Science",
      years: "2009 – 2013",
      honors: "2nd Upper Class Honors",
    },
    {
      school: "Booker Academy High School",
      degree: "K.C.S.E · Sciences",
      years: "2005 – 2008",
    },
  ],
  certifications: [
    { name: "Google Data Analytics Professional", issuer: "Coursera · Google",  hours: "180h", status: "verified",     issuerColor: "#34A853" },
    { name: "Responsive Web Design",              issuer: "freeCodeCamp",        hours: "300h", status: "verified",     issuerColor: "#0A0A23" },
    { name: "Meta Front-End Developer",           issuer: "Coursera · Meta",     hours: "260h", status: "verified",     issuerColor: "#1877F2" },
    { name: "Google UX Design Professional",      issuer: "Coursera · Google",   hours: "220h", status: "in-progress",  issuerColor: "#EA4335" },
  ],
  projects: [
    { title: "Code by Leon", blurb: "Personal portfolio. React 19, GSAP, custom design system.",         tags: ["React", "GSAP", "Vite"],         c1: "#1B2B4B", c2: "#C8860A", glyph: "L" },
    { title: "Savanna BI",   blurb: "Analytics dashboard for an East-African agritech operator.",        tags: ["Next.js", "Looker", "BigQuery"], c1: "#006b3f", c2: "#A0522D", glyph: "S" },
    { title: "Kanga Studio", blurb: "AI-assisted brief generator for African design studios.",            tags: ["TypeScript", "LLM", "Figma"],    tag: "case", c1: "#A0522D", c2: "#ce1126", glyph: "K" },
  ],
};

/* ------------------------------------------------------------------ */
/* Inline icons & silhouettes                                          */
/* ------------------------------------------------------------------ */
const Icon = {
  code: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>),
  pen: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>),
  chart: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
  github: () => (<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.55.12-3.23 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.68.25 2.92.12 3.23.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5z"/></svg>),
  linkedin: () => (<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.71h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.86V21h-4V9z"/></svg>),
  twitter: () => (<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2H21.5l-7.51 8.58L23 22h-6.766l-5.296-6.93L4.864 22H1.6l8.04-9.18L1 2h6.93l4.79 6.34L18.244 2zM17.083 20h1.79L7.04 4H5.16l11.923 16z"/></svg>),
  cap: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10l-10-5L2 10l10 5 10-5z"/><path d="M6 12v5c0 1 4 3 6 3s6-2 6-3v-5"/></svg>),
};

const Acacia = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 320 400" aria-hidden="true">
    <g fill="currentColor">
      <rect x="155" y="190" width="10" height="210" />
      <path d="M160 210 C 110 210, 70 198, 50 188 C 70 196, 130 198, 160 196 Z" />
      <path d="M160 210 C 210 210, 250 198, 270 188 C 250 196, 190 198, 160 196 Z" />
      <ellipse cx="160" cy="180" rx="150" ry="22" />
      <ellipse cx="100" cy="170" rx="60" ry="14" />
      <ellipse cx="220" cy="170" rx="60" ry="14" />
      <ellipse cx="160" cy="158" rx="80" ry="12" />
      <path d="M158 280 q 6 -10 14 -2 q -8 6 -14 2z" />
      <path d="M158 320 q -6 -10 -14 -2 q 8 6 14 2z" />
    </g>
  </svg>
);

/* CSS-art "Lottie placeholder" silhouettes (animal-shaped, walk-cycle nodding) */
const AnimalSVG = {
  lion: () => (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <g fill="#1a1410">
        {/* mane */}
        <circle cx="42" cy="50" r="26" fill="#A0522D"/>
        <circle cx="42" cy="50" r="20" fill="#C8860A"/>
        {/* face */}
        <circle cx="42" cy="52" r="13" fill="#FDF6E3"/>
        <circle cx="37" cy="50" r="1.5"/>
        <circle cx="47" cy="50" r="1.5"/>
        <path d="M42 56 q-2 2 -4 1 M42 56 q2 2 4 1" stroke="#1a1410" strokeWidth="1" fill="none"/>
        {/* body */}
        <ellipse cx="78" cy="68" rx="26" ry="14" fill="#C8860A"/>
        {/* legs */}
        <rect x="60" y="78" width="5" height="20" fill="#A0522D"/>
        <rect x="72" y="78" width="5" height="20" fill="#A0522D"/>
        <rect x="86" y="78" width="5" height="20" fill="#A0522D"/>
        <rect x="98" y="78" width="5" height="20" fill="#A0522D"/>
        {/* tail */}
        <path d="M104 70 q 14 -4 12 -18" stroke="#A0522D" strokeWidth="3" fill="none"/>
        <circle cx="115" cy="52" r="3" fill="#1a1410"/>
      </g>
    </svg>
  ),
  eagle: () => (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <g>
        <path d="M50 50 L 12 28 Q 26 48, 48 50 Z" fill="#1a1410"/>
        <path d="M50 50 L 88 28 Q 74 48, 52 50 Z" fill="#1a1410"/>
        <ellipse cx="50" cy="56" rx="9" ry="14" fill="#1a1410"/>
        <circle cx="50" cy="46" r="7" fill="#FDF6E3"/>
        <circle cx="52" cy="46" r="2" fill="#1a1410"/>
        <path d="M56 47 l 8 -2 l -8 4 z" fill="#C8860A"/>
      </g>
    </svg>
  ),
  elephant: () => (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <g fill="#5a4a3a">
        <ellipse cx="62" cy="60" rx="34" ry="22"/>
        <circle cx="32" cy="58" r="18"/>
        <path d="M14 64 q -6 14 0 28 q 6 -2 6 -10 q 0 -8 -2 -16 z" fill="#5a4a3a"/>
        <ellipse cx="22" cy="48" rx="10" ry="14" fill="#7b6857"/>
        <rect x="46" y="78" width="7" height="22"/>
        <rect x="62" y="78" width="7" height="22"/>
        <rect x="80" y="78" width="7" height="22"/>
        <rect x="92" y="78" width="7" height="22"/>
        <circle cx="32" cy="54" r="1.5" fill="#1a1410"/>
        <path d="M96 56 q 6 0 8 6 q -6 4 -10 -2z"/>
      </g>
    </svg>
  ),
  giraffe: () => (
    <svg viewBox="0 0 130 220" aria-hidden="true">
      <g fill="#C8860A">
        {/* body */}
        <ellipse cx="80" cy="160" rx="36" ry="22"/>
        {/* legs */}
        <rect x="58" y="178" width="7" height="40"/>
        <rect x="74" y="178" width="7" height="40"/>
        <rect x="92" y="178" width="7" height="40"/>
        <rect x="106" y="178" width="7" height="40"/>
        {/* neck */}
        <path d="M50 152 L 24 30 L 44 28 L 70 150 Z"/>
        {/* head */}
        <ellipse cx="30" cy="22" rx="14" ry="10"/>
        <rect x="20" y="6" width="4" height="10" fill="#1a1410"/>
        <rect x="36" y="6" width="4" height="10" fill="#1a1410"/>
        {/* spots */}
        <circle cx="78" cy="152" r="5" fill="#A0522D"/>
        <circle cx="92" cy="162" r="4" fill="#A0522D"/>
        <circle cx="68" cy="166" r="3" fill="#A0522D"/>
        <circle cx="60" cy="120" r="3" fill="#A0522D"/>
        <circle cx="52" cy="80" r="3" fill="#A0522D"/>
        <circle cx="40" cy="50" r="3" fill="#A0522D"/>
      </g>
    </svg>
  ),
  zebra: () => (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <g>
        <ellipse cx="60" cy="60" rx="36" ry="20" fill="#FDF6E3"/>
        <circle cx="28" cy="48" r="14" fill="#FDF6E3"/>
        {/* stripes */}
        <path d="M30 40 v 16 M38 38 v 22 M46 36 v 26 M58 36 v 28 M70 36 v 28 M82 38 v 24 M90 42 v 18" stroke="#1a1410" strokeWidth="3" fill="none"/>
        {/* mane */}
        <path d="M22 40 q 4 -8 14 -8 q 0 4 -2 8 z" fill="#1a1410"/>
        {/* legs */}
        <rect x="42" y="76" width="5" height="22" fill="#FDF6E3" stroke="#1a1410" strokeWidth="1.2"/>
        <rect x="56" y="76" width="5" height="22" fill="#FDF6E3" stroke="#1a1410" strokeWidth="1.2"/>
        <rect x="72" y="76" width="5" height="22" fill="#FDF6E3" stroke="#1a1410" strokeWidth="1.2"/>
        <rect x="86" y="76" width="5" height="22" fill="#FDF6E3" stroke="#1a1410" strokeWidth="1.2"/>
        <circle cx="22" cy="46" r="1.4" fill="#1a1410"/>
        <path d="M14 50 q -4 -2 0 -6" stroke="#1a1410" strokeWidth="2" fill="none"/>
      </g>
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/* Reveal hook                                                         */
/* ------------------------------------------------------------------ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .title-underline");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ------------------------------------------------------------------ */
/* Top nav                                                             */
/* ------------------------------------------------------------------ */
function TopNav({ theme, setTheme }) {
  return (
    <header className="top-nav">
      <div className="brand">
        <span className="brand-stripe" aria-hidden="true"></span>
        Leon&nbsp;Madara
      </div>
      <nav>
        <a href="#">Work</a>
        <a href="#" className="is-active">About</a>
        <a href="#">Writing</a>
        <a href="#">Contact</a>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
function Hero() {
  const { name, title, bio } = ABOUT.identity;
  return (
    <section className="hero" id="hero">
      <Acacia className="acacia hero-acacia" />

      {/* animals */}
      <div className="animal hero-lion" role="presentation" aria-hidden="true"><AnimalSVG.lion /></div>
      <div className="animal hero-eagle" role="presentation" aria-hidden="true"><AnimalSVG.eagle /></div>

      <div className="hero-inner">
        <div>
          <p className="hero-eyebrow reveal">// Nairobi, Kenya</p>
          <h1 className="hero-title reveal delay-1">
            {name.split(" ")[0]} <span className="accent">{name.split(" ")[1]}</span>
          </h1>
          <p className="hero-subtitle reveal delay-2">{title}</p>
          <p className="hero-bio reveal delay-3">{bio}</p>
          <div className="hero-cta-row reveal delay-4">
            <a className="btn btn-primary" href="#projects">
              See My Work <span className="arrow">→</span>
            </a>
            <a className="btn btn-ghost" href="#" download>
              Download CV
            </a>
          </div>
          <div className="hero-socials reveal delay-5">
            <a href={ABOUT.identity.github} aria-label="GitHub"><Icon.github /></a>
            <a href={ABOUT.identity.linkedin} aria-label="LinkedIn"><Icon.linkedin /></a>
            <a href={ABOUT.identity.twitter} aria-label="Twitter"><Icon.twitter /></a>
            <span className="font-mono" style={{ fontSize: 12, color: "rgba(17,17,17,0.55)", marginLeft: 6 }}>
              leon.madara@outlook.com
            </span>
          </div>
        </div>

        <div className="hero-portrait-wrap reveal delay-3">
          <div className="hero-portrait-glow" aria-hidden="true" />
          <div className="hex-frame" aria-label="Portrait of Leon Madara">
            <div className="hex-portrait">
              <span className="portrait-letter">L</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Kikoi() {
  return <div className="kikoi-divider" role="presentation" aria-hidden="true" />;
}

function Expertise() {
  return (
    <section className="section expertise-section" id="expertise">
      <div className="container">
        <div className="expertise-head">
          <div>
            <p className="section-eyebrow reveal">// 01 — What I Do</p>
            <h2 className="section-heading reveal">
              <span className="title-underline">What I <em>Do</em></span>
            </h2>
            <p className="section-subhead reveal delay-1">
              Three disciplines, one practice — I move fluently between them so the work doesn't lose continuity at the seams.
            </p>
          </div>
        </div>

        <div className="expertise-grid">
          {ABOUT.expertise.map((c, i) => {
            const I = Icon[c.icon];
            return (
              <article key={c.key} className={`exp-card reveal delay-${i+1} ${c.featured ? "featured" : ""}`}>
                {c.featured && <span className="exp-badge">Core Expertise</span>}
                <div className="exp-icon"><I /></div>
                <h3>{c.title}</h3>
                <p>{c.blurb}</p>
                <ul>
                  {c.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </article>
            );
          })}
        </div>
      </div>

      <div className="animal section-aside-elephant" role="presentation" aria-hidden="true"><AnimalSVG.elephant /></div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section skills-section" id="skills">
      <div className="container">
        <p className="section-eyebrow reveal">// 02 — Toolkit</p>
        <h2 className="section-heading reveal">
          <span className="title-underline">My <em>Toolkit</em></span>
        </h2>
        <p className="section-subhead reveal delay-1">
          The day-to-day instruments. Pragmatic over fashionable.
        </p>

        <div className="skills-grid">
          {ABOUT.skills.map((cat, i) => (
            <div key={cat.name} className={`skill-card reveal delay-${i+1}`} style={{ "--bar": cat.color }}>
              <div className="skill-bar">
                {cat.name}
                <span className="count">{String(cat.items.length).padStart(2, "0")}</span>
              </div>
              <div className="pills">
                {cat.items.map((s) => <span key={s} className="pill">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="animal section-aside-giraffe" role="presentation" aria-hidden="true"><AnimalSVG.giraffe /></div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="section journey-section" id="journey">
      <div className="container">
        <p className="section-eyebrow reveal">// 03 — Career</p>
        <h2 className="section-heading reveal">
          <span className="title-underline">The <em>Journey</em></span>
        </h2>
        <p className="section-subhead reveal delay-1">
          From Mumias to Nairobi — and beyond.
        </p>

        <div className="timeline">
          {ABOUT.timeline.map((t, i) => (
            <div key={t.role} className={`timeline-item reveal delay-${i+1}`}>
              <div className="timeline-card">
                <span className="year-pill">{t.years}</span>
                <h3>{t.role}</h3>
                <div className="meta">{t.org}</div>
                <div className="skills">
                  {t.skills.map((s) => <span key={s} className="skill-chip">{s}</span>)}
                </div>
                <ul>
                  {t.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Acacia className="acacia journey-acacia" />
    </section>
  );
}

function Education() {
  return (
    <section className="section education-section" id="education">
      <div className="container">
        <p className="section-eyebrow reveal">// 04 — Education</p>
        <h2 className="section-heading reveal">
          <span className="title-underline">Academic <em>Roots</em></span>
        </h2>
        <p className="section-subhead reveal delay-1">
          Where the foundations were poured.
        </p>

        <div className="edu-grid">
          {ABOUT.education.map((e, i) => (
            <article key={e.school} className={`edu-card reveal delay-${i+1}`}>
              <div className="edu-cap"><Icon.cap /></div>
              <div>
                <h3>{e.school}</h3>
                <div className="meta">{e.degree} · {e.years}</div>
                {e.honors && <span className="honors">{e.honors}</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="animal section-aside-zebra" role="presentation" aria-hidden="true"><AnimalSVG.zebra /></div>
    </section>
  );
}

function Certifications() {
  return (
    <section className="section certs-section" id="certs">
      <div className="container">
        <p className="section-eyebrow reveal">// 05 — Credentials</p>
        <h2 className="section-heading reveal">
          <span className="title-underline">Cre<em>den</em>tials</span>
        </h2>
        <p className="section-subhead reveal delay-1">
          Audited proof of practice — the parts that matter.
        </p>

        <div className="cert-grid">
          {ABOUT.certifications.map((c, i) => (
            <article key={c.name} className={`cert-card reveal delay-${i+1}`} style={{ "--issuer": c.issuerColor }}>
              <span className="hours">{c.hours}</span>
              <span className={`cert-status ${c.status === "verified" ? "verified" : "in-progress"}`}>
                {c.status === "verified" ? "Verified" : "In Progress"}
              </span>
              <h3>{c.name}</h3>
              <div className="issuer">{c.issuer}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="section projects-section" id="projects">
      <div className="container">
        <p className="section-eyebrow reveal">// 06 — Featured</p>
        <h2 className="section-heading reveal">
          <span className="title-underline">Featured <em>Work</em></span>
        </h2>
        <p className="section-subhead reveal delay-1">
          Selected builds — real users, real constraints.
        </p>

        <div className="proj-grid">
          {ABOUT.projects.map((p, i) => (
            <article key={p.title} className={`proj-card reveal delay-${i+1}`}>
              <div className="proj-image" style={{ "--c1": p.c1, "--c2": p.c2 }}>
                <span className="placeholder-label">// project shot</span>
                <span className="placeholder-glyph">{p.glyph}</span>
              </div>
              <div className="proj-body">
                <h3>{p.title}</h3>
                <p>{p.blurb}</p>
                <div className="proj-tags">
                  {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
                <a className="proj-cta" href="#">View Case Study <span className="arrow">→</span></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section className="cta-strip" id="contact">
      <h2 className="reveal">Ready to build something <em>extraordinary</em>?</h2>
      <p className="reveal delay-1">Let's talk — leon.madara@outlook.com</p>
      <a className="btn btn-primary reveal delay-2" href="mailto:leon.madara@outlook.com">
        Start a Conversation <span className="arrow">→</span>
      </a>
      <div className="flag-stripe" aria-hidden="true" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Tweaks                                                              */
/* ------------------------------------------------------------------ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "heroVariant": "savanna",
  "showAnimals": true,
  "accentHue": "gold"
}/*EDITMODE-END*/;

function App() {
  const useT = window.useTweaks || ((d) => [d, () => {}]);
  const [tweaks, setTweak] = useT(TWEAK_DEFAULTS);
  const [theme, setTheme] = useState(tweaks.theme || "light");

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { setTheme(tweaks.theme); }, [tweaks.theme]);
  useEffect(() => {
    document.body.dataset.animals = tweaks.showAnimals ? "on" : "off";
    document.querySelectorAll(".animal").forEach((el) => {
      el.style.display = tweaks.showAnimals ? "" : "none";
    });
  }, [tweaks.showAnimals]);
  useEffect(() => {
    const root = document.documentElement;
    const map = {
      gold: "#C8860A", red: "#ce1126", green: "#006b3f", terracotta: "#A0522D"
    };
    root.style.setProperty("--accent-active", map[tweaks.accentHue] || map.gold);
  }, [tweaks.accentHue]);

  useReveal();

  // Hero variant
  useEffect(() => {
    const root = document.documentElement;
    if (tweaks.heroVariant === "twilight") {
      root.style.setProperty("--hero-bg-light", "linear-gradient(160deg, #FDF6E3 0%, #1B2B4B 80%, #C8860A 100%)");
    } else if (tweaks.heroVariant === "crimson") {
      root.style.setProperty("--hero-bg-light", "linear-gradient(160deg, #FDF6E3 0%, #ce1126 70%, #1B2B4B 100%)");
    } else {
      root.style.setProperty("--hero-bg-light", "linear-gradient(160deg, #FDF6E3 0%, #E9C77A 55%, #A0522D 100%)");
    }
  }, [tweaks.heroVariant]);

  return (
    <>
      <TopNav theme={theme} setTheme={(t) => { setTheme(t); setTweak("theme", t); }} />
      <main>
        <Hero />
        <Kikoi />
        <Expertise />
        <Kikoi />
        <Skills />
        <Kikoi />
        <Timeline />
        <Kikoi />
        <Education />
        <Kikoi />
        <Certifications />
        <Kikoi />
        <Projects />
        <FooterCTA />
      </main>
      <footer className="site-footer">
        © {new Date().getFullYear()} · Leon Madara · Built in Nairobi 🇰🇪
      </footer>

      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection label="Theme" />
          <window.TweakRadio
            label="Mode"
            value={tweaks.theme}
            onChange={(v) => { setTweak("theme", v); setTheme(v); }}
            options={["light", "dark"]}
          />
          <window.TweakSelect
            label="Hero Backdrop"
            value={tweaks.heroVariant}
            onChange={(v) => setTweak("heroVariant", v)}
            options={["savanna", "twilight", "crimson"]}
          />
          <window.TweakRadio
            label="Accent"
            value={tweaks.accentHue}
            onChange={(v) => setTweak("accentHue", v)}
            options={["gold", "red", "green", "terracotta"]}
          />
          <window.TweakSection label="Decoration" />
          <window.TweakToggle
            label="Show wildlife"
            value={tweaks.showAnimals}
            onChange={(v) => setTweak("showAnimals", v)}
          />
        </window.TweaksPanel>
      )}
    </>
  );
}

window.AboutApp = App;
