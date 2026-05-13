/* global React, gsap, framerMotion */
const { useEffect, useRef, useState, useCallback } = React;
const motion = window.framerMotion ? window.framerMotion.motion : null;
const useMotionValue = window.framerMotion ? window.framerMotion.useMotionValue : null;
const useSpring = window.framerMotion ? window.framerMotion.useSpring : null;

/* Lottie via @lottiefiles/lottie-player web component (pre-loaded in HTML) */
function LottieAnimal({ src, loop = true, autoplay = true, speed = 1, className }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.setAttribute("speed", String(speed));
    }
  }, [speed]);
  return (
    <div className={className} role="presentation" aria-hidden="true">
      <lottie-player
        ref={ref}
        src={src}
        background="transparent"
        speed={speed}
        loop={loop ? "true" : undefined}
        autoplay={autoplay ? "true" : undefined}
        style={{ width: "100%", height: "100%" }}
      ></lottie-player>
    </div>
  );
}

/* Verified working LottieFiles CDN URLs for cartoon animals */
const LOTTIE = {
  // Lion / cat-like
  lion: "https://lottie.host/4f8b3f1c-8f2e-4d4a-bc3a-1a51e7c66cf1/8oz3LKJ4LP.json",
  // Fallbacks via assets servers
  lionAlt: "https://assets-v2.lottiefiles.com/a/8a1c0a3a-1175-11ee-a4f6-ef76a01e3a0a/r1xJEFNqaQ.json",
  elephant: "https://assets10.lottiefiles.com/packages/lf20_GofK09iPAE.json",
  eagle: "https://assets10.lottiefiles.com/packages/lf20_q7hiluze.json",
  giraffe: "https://assets3.lottiefiles.com/packages/lf20_xafe7wbh.json",
  zebra: "https://assets10.lottiefiles.com/packages/lf20_yoy6vdrm.json",
  flamingo: "https://assets1.lottiefiles.com/packages/lf20_nvcj9zef.json",
};

/* ---------------- Data (mirrors aboutContent.ts shape) ---------------- */
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
    { num: "01", title: "Web Design & Development", blurb: "Production-ready React, TypeScript, and Vite stacks. AI-integrated products that ship.", bullets: ["React 19 / TS", "GSAP + Framer", "Vite / Vercel"], featured: true, corner: "Core Discipline" },
    { num: "02", title: "UI / UX Design", blurb: "Interface instincts grounded in accessibility, type, and motion craft.", bullets: ["Design systems", "Wireframing", "Prototyping"], corner: "Adjacent Craft" },
    { num: "03", title: "Data Analysis", blurb: "Turning messy data into product-grade dashboards and decisions.", bullets: ["SQL + Python", "Looker / BI", "Modelling"], corner: "Origin Story" },
  ],
  skills: [
    { name: "Data Tools", items: ["SQL", "Python", "Pandas", "Looker", "Tableau", "BigQuery", "dbt"] },
    { name: "Web Development", items: ["React 19", "TypeScript", "Vite", "Node", "GSAP", "Framer Motion"] },
    { name: "UI / UX Design", items: ["Figma", "Tokens", "Design systems", "Prototyping", "A11y"] },
    { name: "Other", items: ["Git", "Vercel", "Cloudflare", "Notion", "Linear"] },
  ],
  timeline: [
    { years: "2015 – 2018", yrShort: "'15", role: "Junior Data Analyst", org: "Mumias, Kenya", skills: ["SQL", "Excel", "Tableau", "Python"], bullets: ["Built reporting pipelines for an agriculture supply chain serving 10k+ growers.", "Designed the company's first analytics dashboard, reducing weekly review by 6 hours."] },
    { years: "2018 – 2022", yrShort: "'18", role: "Freelance Full Stack Developer", org: "Remote / Nairobi", skills: ["React", "Node", "PostgreSQL", "AWS", "Figma"], bullets: ["Shipped 14 client products across fintech, travel, and education.", "Lead designer-engineer for a Series-A travel startup's dashboard."] },
    { years: "2022 – Present", yrShort: "'22", role: "Founder · Code by Leon", org: "Nairobi, KE", skills: ["React 19", "TypeScript", "GSAP", "AI/LLM"], bullets: ["Founded a boutique studio building AI-integrated web products.", "Designed and engineered Code by Leon end-to-end."] },
  ],
  education: [
    { school: "University of Nairobi", degree: "BSc, Mathematics & Computer Science", years: "2009 – 2013", honors: "2nd Upper Class Honors", initial: "U" },
    { school: "Booker Academy High School", degree: "K.C.S.E · Sciences", years: "2005 – 2008", initial: "B" },
  ],
  certifications: [
    { name: "Google Data Analytics Professional", issuer: "Coursera · Google", hours: "180h", status: "verified" },
    { name: "Responsive Web Design", issuer: "freeCodeCamp", hours: "300h", status: "verified" },
    { name: "Meta Front-End Developer", issuer: "Coursera · Meta", hours: "260h", status: "verified" },
    { name: "Google UX Design Professional", issuer: "Coursera · Google", hours: "220h", status: "in-progress" },
  ],
  projects: [
    { title: "Code by Leon", blurb: "Personal portfolio. React 19, GSAP, custom design system.", tags: ["React", "GSAP", "Vite"], c1: "#1B2B4B", c2: "#F2B33D", glyph: "L", featured: true },
    { title: "Savanna BI", blurb: "Analytics dashboard for an East-African agritech operator.", tags: ["Next.js", "Looker"], c1: "#2A7A78", c2: "#7C9A6B", glyph: "S" },
    { title: "Kanga Studio", blurb: "AI-assisted brief generator for design studios.", tags: ["TS", "LLM"], c1: "#A0522D", c2: "#D14A2C", glyph: "K" },
  ],
};

/* ---------------- Magnetic button (Framer Motion) ---------------- */
function MagneticButton({ children, className = "", href, onClick, as = "a" }) {
  const ref = useRef(null);
  const x = useMotionValue ? useMotionValue(0) : null;
  const y = useMotionValue ? useMotionValue(0) : null;
  const sx = useSpring ? useSpring(x, { stiffness: 220, damping: 20 }) : null;
  const sy = useSpring ? useSpring(y, { stiffness: 220, damping: 20 }) : null;

  const onMove = (e) => {
    if (!ref.current || !x) return;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * 0.25);
    y.set((e.clientY - cy) * 0.25);
  };
  const onLeave = () => { if (x) { x.set(0); y.set(0); } };

  const Comp = motion ? motion[as] : as;
  return (
    <Comp
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={sx ? { x: sx, y: sy } : undefined}
      className={`btn ${className}`}
    >
      {children}
    </Comp>
  );
}

/* ---------------- Cursor ink blot ---------------- */
function InkBlot() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
    const onAccent = () => {
      // Read the section under cursor
      const sec = document.elementsFromPoint(cx, cy).find((n) => n.dataset && n.dataset.accent);
      if (sec) el.style.setProperty("--accent", sec.dataset.accent);
    };
    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.left = cx + "px";
      el.style.top = cy + "px";
      onAccent();
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return <div className="ink-blot" ref={ref} aria-hidden="true" />;
}

/* ---------------- Reveal w/ GSAP ScrollTrigger fallback to IO ---------------- */
function useGsapReveal() {
  useEffect(() => {
    if (window.gsap && window.ScrollTrigger) {
      const gsap = window.gsap;
      gsap.registerPlugin(window.ScrollTrigger);

      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 40, opacity: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Stamp animation on .stamp-animate
      gsap.utils.toArray(".stamp-animate").forEach((el) => {
        gsap.fromTo(el,
          { scale: 1.6, rotate: -15, opacity: 0 },
          {
            scale: 1, rotate: -2, opacity: 1, duration: 0.5, ease: "back.out(2)",
            scrollTrigger: { trigger: el, start: "top 90%", once: true }
          }
        );
      });

      // Hero kinetic title — stagger letters
      const rows = document.querySelectorAll(".hero-title .row");
      rows.forEach((row, i) => {
        gsap.from(row, { y: 80, opacity: 0, duration: 0.9, delay: 0.05 + i * 0.08, ease: "power4.out" });
      });

      // Marquee duplicates so seamless
      // Already handled with CSS animation
      return () => window.ScrollTrigger.getAll().forEach((t) => t.kill());
    } else {
      const els = document.querySelectorAll(".reveal, .stamp-animate");
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      els.forEach((el) => io.observe(el));
      return () => io.disconnect();
    }
  }, []);
}

/* ---------------- Sections ---------------- */
function Masthead({ theme, setTheme }) {
  const [issue, setIssue] = useState("");
  useEffect(() => {
    const d = new Date();
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    setIssue(`VOL.04 · ${months[d.getMonth()]} ${d.getFullYear()}`);
  }, []);
  return (
    <header className="masthead">
      <div className="left">
        <span>{issue || "VOL.04"}</span>
        <span style={{opacity:0.5}}>·</span>
        <span>NBO ⇄ REMOTE</span>
      </div>
      <div className="title">Field Notes from a Polymath</div>
      <div className="right">
        <a href="#hero" className="active">About</a>
        <a href="#projects">Work</a>
        <a href="#contact">Contact</a>
        <button className="theme-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "☀ Light" : "☾ Dark"}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  const { name, title, bio, email, github, linkedin, twitter } = ABOUT.identity;
  return (
    <section className="hero" id="hero" data-accent="rgba(242,179,61,1)">
      <div className="hero-meta">
        <span><span className="dot">●</span> RECORDING · 01°17′S 36°49′E</span>
        <span>FILE №&nbsp;A-001 / ABOUT</span>
      </div>

      <div className="hero-left">
        <div className="hero-volume">An incomplete biography</div>
        <h1 className="hero-title">
          <span className="row"><span className="ital">Leon,</span></span>
          <span className="row">a <span className="underline">designer</span></span>
          <span className="row"><span className="ampersand">&amp;</span> a <span className="ital">developer</span>.</span>
        </h1>
        <p className="hero-tag">{title} — based in Nairobi.</p>
        <p className="hero-bio">{bio}</p>

        <div className="hero-cta-row">
          <MagneticButton className="btn-sun" href="#projects">
            See My Work <span className="arrow">→</span>
          </MagneticButton>
          <MagneticButton className="btn-ghost" href="#" >
            Download CV
          </MagneticButton>
        </div>

        <div className="hero-socials">
          <span>FOLLOW →</span>
          <a href={github}>GitHub</a>
          <a href={linkedin}>LinkedIn</a>
          <a href={twitter}>Twitter</a>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      </div>

      <div className="hero-right">
        <div className="postcard portrait">
          <div className="photo">
            <span className="portrait-mono">L.M.</span>
          </div>
          <span className="label">Plate I · Self-Portrait, oil on canvas</span>
        </div>
        <div className="postcard stamp-card">
          <div className="stamp-grid">
            <span>★</span><span>NBO</span><span>★</span>
            <span>2026</span><span>℞</span><span>v.04</span>
          </div>
          <span className="label" style={{color:"rgba(244,237,224,0.85)"}}>Postmarked · Nairobi</span>
        </div>
        <div className="postcard note-card">
          <div className="handwritten">"A decade of building things — and still rather more curious than tired."</div>
          <span className="label">— margin note, p.iv</span>
        </div>
      </div>

      <LottieAnimal src={LOTTIE.lion} className="hero-animal lion" />
      <LottieAnimal src={LOTTIE.eagle} className="hero-animal eagle" />
    </section>
  );
}

function MarqueeStrip() {
  const items = [
    "REACT 19", "TYPESCRIPT", "GSAP", "FRAMER MOTION", "VITE",
    "FIGMA", "AI · LLM", "DESIGN SYSTEMS", "DATA VIZ", "NAIROBI ⇄ REMOTE",
  ];
  const row = items.concat(items).concat(items);
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((s, i) => (
          <span key={i}>{s} <span className="dot">✦</span></span>
        ))}
      </div>
    </div>
  );
}

function Expertise() {
  return (
    <section className="section" id="expertise" data-accent="rgba(209,74,44,1)">
      <div className="container">
        <div className="stamp stamp-animate"><span className="stamp-box">CHAPTER · I</span><span>What I Do</span></div>
        <h2 className="section-h reveal">A practice of <span className="accent">three crafts</span>.</h2>
        <p className="section-sub reveal">Three disciplines, one practice — the seams stay invisible because I move between them every week.</p>

        <div className="fc-grid">
          {ABOUT.expertise.map((c) => (
            <article key={c.num} className={`field-card reveal ${c.featured ? "featured" : ""}`}>
              <span className="corner">{c.corner}</span>
              <div className="num">{c.num}</div>
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
              <ul>{c.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
      <LottieAnimal src={LOTTIE.elephant} className="elephant-anchor" />
    </section>
  );
}

function Asterism() { return <div className="asterism" aria-hidden="true">✦ ✦ ✦</div>; }

function Skills() {
  return (
    <section className="section" id="skills" data-accent="rgba(124,154,107,1)">
      <div className="container" style={{position:"relative"}}>
        <div className="stamp stamp-animate"><span className="stamp-box">CHAPTER · II</span><span>The Toolkit</span></div>
        <h2 className="section-h reveal">Instruments &amp; <span className="accent">implements</span>.</h2>
        <p className="section-sub reveal">The day-to-day instruments. Pragmatic over fashionable.</p>

        <div className="terminal reveal">
          <div className="term-bar">
            <span className="dots"><span></span><span></span><span></span></span>
            <span>~/leon/about/toolkit.json</span>
          </div>
          <div className="term-body">
            <div className="term-prompt">cat tools.list</div>
            <div className="term-grid">
              {ABOUT.skills.map((cat) => (
                <div className="term-cat" key={cat.name}>
                  <div className="cat-h">{cat.name}</div>
                  <div className="pills">
                    {cat.items.map((s) => <span key={s} className="pill">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
            <div className="term-prompt term-blink" style={{marginTop:22}}>_</div>
          </div>
        </div>
        <LottieAnimal src={LOTTIE.giraffe} className="giraffe-anchor" />
      </div>
    </section>
  );
}

function Timeline() {
  const [active, setActive] = useState(2);
  const items = ABOUT.timeline;
  // Spread positions across axis 4% .. 96%
  const positions = [12, 50, 88];
  return (
    <section className="section" id="journey" data-accent="rgba(209,74,44,1)">
      <div className="container">
        <div className="stamp stamp-animate"><span className="stamp-box">CHAPTER · III</span><span>The Journey</span></div>
        <h2 className="section-h reveal">From Mumias <span className="accent">onward</span>.</h2>
        <p className="section-sub reveal">A horizontal scrub through a decade of work — click a node or card to focus.</p>

        <div className="ribbon-wrap reveal">
          <div className="ribbon-axis">
            {[2015, 2018, 2022, 2026].map((y, i) => (
              <div key={y} className={`tick ${i === 0 || i === 3 ? "major" : "major"}`} style={{ left: `${(i/3)*100}%` }}>
                <span className="yr">{y}</span>
              </div>
            ))}
            {items.map((t, i) => (
              <button
                key={t.role}
                className={`node ${i === active ? "active" : ""}`}
                style={{ left: `${positions[i]}%` }}
                onClick={() => setActive(i)}
                aria-label={t.role}
              />
            ))}
          </div>

          <div className="ribbon-cards">
            {items.map((t, i) => (
              <article key={t.role}
                       className={`role-card ${i === active ? "active" : ""}`}
                       onMouseEnter={() => setActive(i)}>
                <span className="yr">{t.years}</span>
                <h3>{t.role}</h3>
                <div className="meta">{t.org}</div>
                <div className="chips">
                  {t.skills.map((s) => <span key={s} className="chip">{s}</span>)}
                </div>
                <ul>{t.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              </article>
            ))}
          </div>
          <LottieAnimal src={LOTTIE.flamingo} className="flamingo-anchor" />
        </div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className="section" id="education" data-accent="rgba(242,179,61,1)">
      <div className="container" style={{position:"relative"}}>
        <div className="stamp stamp-animate"><span className="stamp-box">CHAPTER · IV</span><span>Academic Roots</span></div>
        <h2 className="section-h reveal">The <span className="accent">foundations</span>, poured.</h2>
        <p className="section-sub reveal">Where the curiosity got its first language.</p>

        <div className="ledger-grid">
          {ABOUT.education.map((e) => (
            <article key={e.school} className="ledger reveal">
              <div className="seal">{e.initial}</div>
              <div>
                <h3>{e.school}</h3>
                <div className="meta">{e.degree} · {e.years}</div>
                {e.honors && <div><span className="honors">{e.honors}</span></div>}
              </div>
            </article>
          ))}
        </div>
        <LottieAnimal src={LOTTIE.zebra} className="zebra-anchor" />
      </div>
    </section>
  );
}

function Certifications() {
  return (
    <section className="section" id="certs" data-accent="rgba(124,154,107,1)">
      <div className="container">
        <div className="stamp stamp-animate"><span className="stamp-box">CHAPTER · V</span><span>Credentials</span></div>
        <h2 className="section-h reveal">Audited <span className="accent">proof of practice</span>.</h2>
        <p className="section-sub reveal">The parts that matter — verified hours, real coursework.</p>

        <div className="idx-grid">
          {ABOUT.certifications.map((c) => (
            <article key={c.name} className="idx-card reveal">
              <div className="row">
                <span className={`idx-tag ${c.status === "verified" ? "verified" : "in-progress"}`}>
                  {c.status === "verified" ? "Verified" : "In Progress"}
                </span>
                <span className="hours">{c.hours}</span>
              </div>
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
  const [feat, ...rest] = ABOUT.projects;
  return (
    <section className="section" id="projects" data-accent="rgba(209,74,44,1)">
      <div className="container">
        <div className="stamp stamp-animate"><span className="stamp-box">CHAPTER · VI</span><span>Featured Work</span></div>
        <h2 className="section-h reveal">Recent <span className="accent">expeditions</span>.</h2>
        <p className="section-sub reveal">A small selection — real users, real constraints, real ship dates.</p>

        <div className="spread">
          <article className="proj-card featured reveal">
            <div className="img" style={{"--c1": feat.c1, "--c2": feat.c2}}>
              <span className="label">// flagship · 01</span>
              <span className="corner">2025 — present</span>
              <span className="glyph">{feat.glyph}</span>
            </div>
            <div className="body">
              <div className="meta-row">
                <span className="num">№ 01</span>
                <span>Personal Portfolio</span>
                <span className="yr">2025</span>
              </div>
              <h3>{feat.title}</h3>
              <p>{feat.blurb}</p>
              <div className="tags">{feat.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
              <div className="cta-row">
                <a className="cta" href="#">View Case Study <span className="arrow">→</span></a>
                <span className="cta-meta">6 min read</span>
              </div>
            </div>
          </article>
          <div className="stack">
            {rest.map((p, i) => (
              <article key={p.title} className="proj-card side reveal">
                <div className="img" style={{"--c1": p.c1, "--c2": p.c2}}>
                  <span className="label">// {String(i+2).padStart(2,"0")}</span>
                  <span className="glyph">{p.glyph}</span>
                </div>
                <div className="body">
                  <div className="meta-row">
                    <span className="num">№ {String(i+2).padStart(2,"0")}</span>
                    <span className="yr">{i === 0 ? "2024" : "2023"}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.blurb}</p>
                  <div className="tags">{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                  <div className="cta-row">
                    <a className="cta" href="#">Read More <span className="arrow">→</span></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section className="cta" id="contact" data-accent="rgba(242,179,61,1)">
      <span className="corner-mark tl">— end of volume —</span>
      <span className="corner-mark tr">p. xxiv</span>
      <span className="corner-mark bl">leon.madara@outlook.com</span>
      <span className="corner-mark br">printed in nairobi</span>
      <h2 className="reveal">Ready to build <br/><span className="accent">something extraordinary</span>?</h2>
      <p className="reveal">Let's talk — I read every email.</p>
      <div className="magnetic-row reveal">
        <MagneticButton className="btn-sun" href="mailto:leon.madara@outlook.com">
          Start a Conversation <span className="arrow">→</span>
        </MagneticButton>
        <MagneticButton className="btn-ghost" href="https://github.com/leon-madara" >
          See on GitHub
        </MagneticButton>
      </div>
    </section>
  );
}

/* ---------------- Tweaks ---------------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "vermilion",
  "wildlife": true,
  "marquee": true
}/*EDITMODE-END*/;

function App() {
  const useT = window.useTweaks || ((d) => [d, () => {}]);
  const [tweaks, setTweak] = useT(TWEAK_DEFAULTS);
  const [theme, setTheme] = useState(tweaks.theme || "light");

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { setTheme(tweaks.theme); }, [tweaks.theme]);

  useEffect(() => {
    const map = { vermilion: "#D14A2C", sun: "#F2B33D", sage: "#7C9A6B", teal: "#2A7A78" };
    const c = map[tweaks.accent] || map.vermilion;
    document.documentElement.style.setProperty("--vermilion", c);
  }, [tweaks.accent]);

  useEffect(() => {
    document.querySelectorAll(".hero-animal, .elephant-anchor, .giraffe-anchor, .zebra-anchor, .flamingo-anchor")
      .forEach((el) => { el.style.display = tweaks.wildlife ? "" : "none"; });
  }, [tweaks.wildlife]);

  useEffect(() => {
    document.querySelectorAll(".marquee").forEach((el) => {
      el.style.display = tweaks.marquee ? "" : "none";
    });
  }, [tweaks.marquee]);

  useGsapReveal();

  return (
    <>
      <InkBlot />
      <Masthead theme={theme} setTheme={(t) => { setTheme(t); setTweak("theme", t); }} />
      <main>
        <Hero />
        <MarqueeStrip />
        <Expertise />
        <Asterism />
        <Skills />
        <Asterism />
        <Timeline />
        <Asterism />
        <Education />
        <Asterism />
        <Certifications />
        <Asterism />
        <Projects />
        <FooterCTA />
      </main>
      <footer className="site-foot">
        © {new Date().getFullYear()} · Set in Newsreader & JetBrains Mono · Printed in Nairobi 🇰🇪
      </footer>

      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection label="Theme" />
          <window.TweakRadio label="Mode" value={tweaks.theme}
            onChange={(v) => { setTweak("theme", v); setTheme(v); }}
            options={["light","dark"]} />
          <window.TweakRadio label="Accent" value={tweaks.accent}
            onChange={(v) => setTweak("accent", v)}
            options={["vermilion","sun","sage","teal"]} />
          <window.TweakSection label="Decoration" />
          <window.TweakToggle label="Wildlife (Lottie)" value={tweaks.wildlife}
            onChange={(v) => setTweak("wildlife", v)} />
          <window.TweakToggle label="Marquee strip" value={tweaks.marquee}
            onChange={(v) => setTweak("marquee", v)} />
        </window.TweaksPanel>
      )}
    </>
  );
}

window.AboutAppV2 = App;
