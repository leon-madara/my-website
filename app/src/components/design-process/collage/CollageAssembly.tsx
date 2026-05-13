import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, Home, Mail, MapPin, Share2, User } from "lucide-react";
import ref01 from "@/assets/screenshot-references/ref-01-architecture-sketch.png";
import ref02 from "@/assets/screenshot-references/ref-02-sculpted-type.png";
import ref03 from "@/assets/screenshot-references/ref-03-color-hand.png";
import ref04 from "@/assets/screenshot-references/ref-04-urban-collage.png";
import ref05 from "@/assets/screenshot-references/ref-05-street-collage.png";
import ref06 from "@/assets/screenshot-references/ref-06-blue-editorial.png";
import ref07 from "@/assets/screenshot-references/ref-07-cloud-card.png";
import ref08 from "@/assets/screenshot-references/ref-08-compliance-flow.png";
import ref09 from "@/assets/screenshot-references/ref-09-checkout-ui.png";
import ref10 from "@/assets/screenshot-references/ref-10-red-umbrella-mood.png";
import ref11 from "@/assets/screenshot-references/ref-11-mobile-pos.png";
import ref12 from "@/assets/screenshot-references/ref-12-dashboard-desktop.png";
import { Mono, PhaseHeading } from "../primitives";

// ─── Tool icon placeholders (swap for real SVGs when available) ───────────────
function IconCodex({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 7l-3 3 3 3M14 7l3 3-3 3M11 5l-2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconOpenAI({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 2.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="1.2" fill="currentColor" />
    </svg>
  );
}
function IconFigma({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="3" y="2" width="6" height="6" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11" y="2" width="6" height="6" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3" y="12" width="6" height="6" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3" y="7" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="14" cy="13" r="3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function IconCursor({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 3l12 7-6 1-3 6L4 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

gsap.registerPlugin(ScrollTrigger);

// ─── Narrative beat data ──────────────────────────────────────────────────────

type NarrativeRef = {
  src: string;
  alt: string;
  side: "left" | "right";
  /** vertical offset from top of viewport, % */
  top: number;
  rotate: number;
  /** width in vw */
  w: number;
};

type NarrativeBeat = {
  /** prose split into segments; each segment is either plain text or a highlighted phrase */
  prose: string;
  /** key phrase for the beat — shown as a subtle accent */
  accent?: string;
  refs: NarrativeRef[];
  /** if true, the last word group uses character-by-character animation */
  charReveal?: boolean;
  /** inline tool icons to render after the prose */
  tools?: React.ReactNode[];
};

const BEATS: NarrativeBeat[] = [
  {
    prose:
      "I open with mess. Folders of screenshots, scattered references, no structure yet — just attention.",
    refs: [
      { src: ref04, alt: "Urban collage reference", side: "right", top: 18, rotate: -8, w: 13 },
      { src: ref05, alt: "Street collage reference", side: "right", top: 52, rotate: 6, w: 11 },
      { src: ref01, alt: "Architecture sketch reference", side: "left", top: 30, rotate: 10, w: 10 },
    ],
  },
  {
    prose:
      "Some images stop me. A color that lands, a mood I want to chase. I set them aside without explaining why.",
    accent: "a mood I want to chase",
    refs: [
      { src: ref03, alt: "Color and hand reference", side: "right", top: 22, rotate: -5, w: 12 },
      { src: ref10, alt: "Red umbrella mood reference", side: "left", top: 40, rotate: 8, w: 11 },
    ],
  },
  {
    prose:
      "Other things catch differently. A font that feels right. A grid that breathes. A button that does too much, or just enough.",
    accent: "A font that feels right",
    refs: [
      { src: ref02, alt: "Sculpted typography reference", side: "left", top: 20, rotate: -7, w: 10 },
      { src: ref06, alt: "Blue editorial reference", side: "right", top: 35, rotate: 5, w: 11 },
      { src: ref09, alt: "Checkout interface reference", side: "right", top: 62, rotate: -9, w: 9 },
    ],
  },
  {
    prose:
      "Then I start mixing. Tone from one. Rhythm from another. None of it copied — all of it filtered through the project I'm shipping.",
    accent: "filtered through the project",
    refs: [
      { src: ref07, alt: "Cloud card reference", side: "left", top: 28, rotate: 4, w: 14 },
      { src: ref08, alt: "Compliance flow reference", side: "right", top: 45, rotate: -6, w: 12 },
      { src: ref12, alt: "Desktop dashboard reference", side: "left", top: 60, rotate: 3, w: 16 },
    ],
  },
  {
    prose:
      "Sometimes I bring help — Codex to sketch, OpenAI to brainstorm. Sometimes I let what I'm touching tell me where it's going.",
    accent: "let what I'm touching tell me",
    tools: [
      <IconCodex key="codex" size={18} />,
      <IconOpenAI key="openai" size={18} />,
      <IconFigma key="figma" size={18} />,
      <IconCursor key="cursor" size={18} />,
    ],
    refs: [
      { src: ref11, alt: "Mobile POS reference", side: "right", top: 30, rotate: -10, w: 9 },
    ],
  },
  {
    prose: "And then it clicks. The scatter resolves. The screen knows what it wants to be.",
    accent: "The scatter resolves",
    charReveal: true,
    refs: [
      { src: ref01, alt: "Architecture sketch", side: "left",  top: 12, rotate: -10, w: 10 },
      { src: ref02, alt: "Sculpted type",       side: "right", top: 8,  rotate: 8,  w: 10 },
      { src: ref03, alt: "Color hand",          side: "left",  top: 55, rotate: 10, w: 10 },
      { src: ref04, alt: "Urban collage",       side: "right", top: 48, rotate: -5, w: 11 },
      { src: ref05, alt: "Street collage",      side: "right", top: 72, rotate: -11, w: 9 },
      { src: ref06, alt: "Blue editorial",      side: "left",  top: 35, rotate: -13, w: 10 },
    ],
  },
];

// ─── NarrativePin ─────────────────────────────────────────────────────────────

function NarrativePin() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const beatProseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const refImageRefs = useRef<(HTMLImageElement | null)[][]>(BEATS.map(() => []));
  const beatIndexRef = useRef<number>(-1);

  useEffect(() => {
    if (!wrapRef.current || !stageRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      // Show last beat immediately, hide all others
      beatProseRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { opacity: i === BEATS.length - 1 ? 1 : 0, y: 0 });
        const tokens = el.querySelectorAll<HTMLElement>(".dp-narrative-word, .dp-narrative-char, .dp-narrative-accent");
        gsap.set(tokens, { opacity: 1, y: 0 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Each beat occupies this many seconds on the timeline.
      // With scrub the user scrolls through the full duration.
      const BEAT_DUR = 4;       // seconds of timeline per beat
      const IN_DUR   = 0.6;     // beat container fade-in
      const WORD_DUR = 0.25;    // per-word reveal duration
      const WORD_STG = 0.07;    // stagger between words
      const OUT_DUR  = 0.5;     // beat container fade-out
      const REF_DUR  = 0.5;     // ref image fade-in
      const TOTAL    = BEATS.length * BEAT_DUR;

      // Scroll distance = 1 px per timeline second feels good with scrub 0.8
      const SCROLL_PX = TOTAL * 160;

      // All beats start hidden (CSS sets opacity:0, but also set via GSAP
      // so scrub-back works correctly)
      beatProseRefs.current.forEach((el) => {
        if (!el) return;
        gsap.set(el, { opacity: 0, y: 40 });
        const tokens = el.querySelectorAll<HTMLElement>(".dp-narrative-word, .dp-narrative-char, .dp-narrative-accent");
        gsap.set(tokens, { opacity: 0, y: 14 });
      });
      refImageRefs.current.forEach((beatRefs) => {
        beatRefs.forEach((img) => { if (img) gsap.set(img, { opacity: 0, y: 24 }); });
      });

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: `+=${SCROLL_PX}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      BEATS.forEach((beat, bi) => {
        const beatStart = bi * BEAT_DUR;          // when this beat begins
        const outStart  = beatStart + BEAT_DUR - OUT_DUR - 0.1; // when it exits
        const proseEl   = beatProseRefs.current[bi];
        if (!proseEl) return;

        const words = Array.from(proseEl.querySelectorAll<HTMLElement>(".dp-narrative-word"));
        const chars = Array.from(proseEl.querySelectorAll<HTMLElement>(".dp-narrative-char"));
        const accentEl = proseEl.querySelector<HTMLElement>(".dp-narrative-accent");

        // ── IN: container slides up and fades in ──────────────────────────────
        masterTl.to(proseEl, {
          opacity: 1, y: 0,
          duration: IN_DUR,
          ease: "power2.out",
        }, beatStart);

        // ── IN: word-by-word reveal ───────────────────────────────────────────
        if (words.length > 0) {
          const totalWordTime = words.length * WORD_STG + WORD_DUR;
          // Clamp so words finish well before the beat exits
          const wordStart = beatStart + IN_DUR * 0.5;
          masterTl.to(words, {
            opacity: 1, y: 0,
            stagger: WORD_STG,
            duration: WORD_DUR,
            ease: "power2.out",
          }, wordStart);
          void totalWordTime; // used for reference
        }

        // ── IN: accent phrase (non-charReveal) ───────────────────────────────
        if (accentEl) {
          masterTl.to(accentEl, {
            opacity: 1, y: 0,
            duration: WORD_DUR,
            ease: "power2.out",
          }, beatStart + IN_DUR * 0.5 + 0.1);
        }

        // ── IN: character-by-character (beat 6 accent) ───────────────────────
        if (chars.length > 0) {
          masterTl.to(chars, {
            opacity: 1, y: 0,
            stagger: 0.04,
            duration: 0.2,
            ease: "power3.out",
          }, beatStart + IN_DUR * 0.5 + 0.1);
        }

        // ── IN: margin ref images ─────────────────────────────────────────────
        const beatRefEls = refImageRefs.current[bi].filter(Boolean) as HTMLImageElement[];
        if (beatRefEls.length > 0) {
          masterTl.to(beatRefEls, {
            opacity: (i) => (bi === BEATS.length - 1 ? 0.72 : 0.45 + i * 0.06),
            y: 0,
            stagger: 0.12,
            duration: REF_DUR,
            ease: "power2.out",
          }, beatStart + IN_DUR * 0.3);
        }

        // ── OUT: container slides up and fades out (skip last beat) ──────────
        if (bi < BEATS.length - 1) {
          masterTl.to(proseEl, {
            opacity: 0, y: -40,
            duration: OUT_DUR,
            ease: "power2.in",
          }, outStart);

          // Fade out this beat's ref images before the next beat arrives
          if (beatRefEls.length > 0) {
            masterTl.to(beatRefEls, {
              opacity: 0, y: -20,
              stagger: 0.06,
              duration: OUT_DUR * 0.8,
              ease: "power2.in",
            }, outStart + 0.05);
          }
        }
      });

      // Last beat's refs stay visible — handshake into the assembly animation
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="dp-narrative-pin"
      aria-label="Screenshot frenzy — interior monologue"
    >
      {/* Hairline grid */}
      <div className="dp-grid-bg absolute inset-0 opacity-30 pointer-events-none" aria-hidden />

      {/* Beat counter */}
      <div className="dp-narrative-counter" aria-hidden>
        {BEATS.map((_, bi) => (
          <span key={bi} className="dp-narrative-counter-dot" data-beat={bi} />
        ))}
      </div>

      {/* Stage — centered prose (ref-capturing layer) */}
      <div ref={stageRef} className="dp-narrative-stage">
        {BEATS.map((beat, bi) => (
          <div
            key={`prose-${bi}`}
            ref={(el) => { beatProseRefs.current[bi] = el; }}
            className="dp-narrative-beat absolute inset-0 flex flex-col items-center justify-center px-8 md:px-20 lg:px-32 pointer-events-none"
          >
            <p className="dp-narrative-prose" aria-hidden>
              {(() => {
                const words = beat.prose.split(" ");
                const accentWords = beat.accent ? beat.accent.split(" ") : [];
                const nodes: React.ReactNode[] = [];
                let i = 0;
                while (i < words.length) {
                  if (
                    accentWords.length > 0 &&
                    words.slice(i, i + accentWords.length).join(" ") === beat.accent
                  ) {
                    if (beat.charReveal) {
                      beat.accent!.split("").forEach((ch, ci) => {
                        nodes.push(
                          <span
                            key={`char-${bi}-${ci}`}
                            className="dp-narrative-char"
                            style={{ display: "inline-block" }}
                          >
                            {ch === " " ? "\u00A0" : ch}
                          </span>,
                        );
                      });
                    } else {
                      nodes.push(
                        <span key={`accent-${bi}`} className="dp-narrative-accent">
                          {beat.accent}
                        </span>,
                      );
                    }
                    nodes.push(
                      <span key={`asp-${bi}`} className="dp-narrative-word" style={{ display: "inline-block" }}>
                        {"\u00A0"}
                      </span>,
                    );
                    i += accentWords.length;
                  } else {
                    nodes.push(
                      <span
                        key={`w-${bi}-${i}`}
                        className="dp-narrative-word"
                        style={{ display: "inline-block" }}
                      >
                        {words[i]}
                        {i < words.length - 1 ? "\u00A0" : ""}
                      </span>,
                    );
                    i++;
                  }
                }
                return nodes;
              })()}
              {beat.tools && beat.tools.length > 0 && (
                <span className="dp-narrative-tools" aria-hidden>
                  {beat.tools.map((icon, ti) => (
                    <span key={ti} className="dp-narrative-tool-icon">
                      {icon}
                    </span>
                  ))}
                </span>
              )}
            </p>
            {/* Screen-reader accessible text */}
            <span className="sr-only">{beat.prose}</span>
          </div>
        ))}
      </div>

      {/* Margin reference images */}
      {BEATS.map((beat, bi) =>
        beat.refs.map((ref, ri) => (
          <img
            key={`ref-${bi}-${ri}`}
            ref={(el) => { refImageRefs.current[bi][ri] = el; }}
            src={ref.src}
            alt={ref.alt}
            draggable={false}
            className="dp-narrative-ref-img"
            style={{
              [ref.side === "left" ? "left" : "right"]: ref.side === "left" ? "2%" : "2%",
              top: `${ref.top}%`,
              width: `clamp(80px, ${ref.w}vw, 180px)`,
              transform: `rotate(${ref.rotate}deg)`,
            }}
          />
        )),
      )}

      {/* Beat label */}
      <div className="dp-narrative-label" aria-hidden>
        <Mono>04 / Screenshot Frenzy</Mono>
      </div>
    </div>
  );
}

const PARTS = [
  { id: "paper", initial: { x: -42, y: -24, rotate: -2, scale: 1.03 } },
  { id: "chrome", initial: { x: 92, y: -62, rotate: 4, scale: 0.98 } },
  { id: "glyphs", initial: { x: -112, y: 56, rotate: -5, scale: 1.04 } },
  { id: "intro", initial: { x: 84, y: 36, rotate: 3, scale: 0.98 } },
  { id: "name", initial: { x: -76, y: 78, rotate: -4, scale: 1.05 } },
  { id: "body", initial: { x: 44, y: 8, rotate: 2, scale: 0.99 } },
  { id: "actions", initial: { x: -28, y: 18, rotate: 2, scale: 0.99 } },
] as const;

const REFERENCES = [
  {
    id: "ref-01",
    src: ref01,
    alt: "Architecture sketch reference",
    x: 4,
    y: 12,
    w: 11,
    h: 20,
    maxW: 150,
    maxH: 210,
    rotate: -10,
    shape: "portrait",
  },
  {
    id: "ref-02",
    src: ref02,
    alt: "Sculpted typography reference",
    x: 31,
    y: 4,
    w: 10,
    h: 18,
    maxW: 140,
    maxH: 198,
    rotate: 8,
    shape: "portrait",
  },
  {
    id: "ref-03",
    src: ref03,
    alt: "Color and hand reference",
    x: 16,
    y: 66,
    w: 10,
    h: 18,
    maxW: 142,
    maxH: 190,
    rotate: 10,
    shape: "portrait",
  },
  {
    id: "ref-04",
    src: ref04,
    alt: "Urban collage reference",
    x: 44,
    y: 13,
    w: 11,
    h: 20,
    maxW: 158,
    maxH: 216,
    rotate: -5,
    shape: "portrait",
  },
  {
    id: "ref-05",
    src: ref05,
    alt: "Street collage reference",
    x: 87,
    y: 15,
    w: 9,
    h: 18,
    maxW: 132,
    maxH: 196,
    rotate: -11,
    shape: "portrait",
  },
  {
    id: "ref-06",
    src: ref06,
    alt: "Blue editorial reference",
    x: 23,
    y: 8,
    w: 10,
    h: 19,
    maxW: 140,
    maxH: 208,
    rotate: -13,
    shape: "portrait",
  },
  {
    id: "ref-07",
    src: ref07,
    alt: "Cloud card reference",
    x: 64,
    y: 39,
    w: 14,
    h: 12,
    maxW: 210,
    maxH: 142,
    rotate: 10,
    shape: "landscape",
  },
  {
    id: "ref-08",
    src: ref08,
    alt: "Compliance flow interface reference",
    x: 50,
    y: 66,
    w: 12,
    h: 16,
    maxW: 172,
    maxH: 176,
    rotate: 6,
    shape: "square",
  },
  {
    id: "ref-09",
    src: ref09,
    alt: "Checkout interface reference",
    x: 7,
    y: 39,
    w: 10,
    h: 23,
    maxW: 142,
    maxH: 248,
    rotate: -7,
    shape: "portrait",
  },
  {
    id: "ref-10",
    src: ref10,
    alt: "Red umbrella mood reference",
    x: 74,
    y: 62,
    w: 13,
    h: 18,
    maxW: 190,
    maxH: 205,
    rotate: -8,
    shape: "portrait",
  },
  {
    id: "ref-11",
    src: ref11,
    alt: "Mobile POS interface reference",
    x: 86,
    y: 45,
    w: 9,
    h: 24,
    maxW: 130,
    maxH: 255,
    rotate: 8,
    shape: "phone",
  },
  {
    id: "ref-12",
    src: ref12,
    alt: "Desktop dashboard reference",
    x: 62,
    y: 7,
    w: 23,
    h: 13,
    maxW: 300,
    maxH: 150,
    rotate: 4,
    shape: "wide",
  },
] as const;

function LogoMark() {
  return (
    <div className="dp-portfolio-logo" aria-label="Leon Madara mark">
      <span className="dp-logo-leg dp-logo-green" />
      <span className="dp-logo-leg dp-logo-red" />
      <span className="dp-logo-leg dp-logo-black" />
      <span className="dp-logo-cut" />
    </div>
  );
}

function ThemePill() {
  return (
    <div className="dp-theme-pill" aria-label="Theme preview">
      <span className="dp-theme-sun" />
      <span className="dp-theme-hill dp-theme-hill-a" />
      <span className="dp-theme-hill dp-theme-hill-b" />
    </div>
  );
}

function PortfolioChrome() {
  const navItems = [
    <Home key="home" size={14} strokeWidth={1.7} />,
    <User key="user" size={14} strokeWidth={1.7} />,
    <Briefcase key="briefcase" size={14} strokeWidth={1.7} />,
    <Share2 key="share" size={14} strokeWidth={1.7} />,
    <Mail key="mail" size={14} strokeWidth={1.7} />,
  ];

  return (
    <div className="dp-portfolio-chrome">
      <LogoMark />
      <div className="dp-top-nav" aria-hidden>
        {navItems.map((item, index) => (
          <span key={index} className={index === 0 ? "dp-top-nav-active" : undefined}>
            {item}
          </span>
        ))}
      </div>
      <ThemePill />
    </div>
  );
}

function CodeGlyphs() {
  return (
    <div className="dp-code-glyphs" aria-hidden>
      <span className="dp-glyph dp-glyph-a">&lt;/&gt;</span>
      <span className="dp-glyph dp-glyph-b">&#123; &#125;</span>
      <span className="dp-glyph dp-glyph-c">=&gt;</span>
      <span className="dp-glyph dp-glyph-d">[ ]</span>
      <span className="dp-glyph dp-glyph-e">&#38;&#38;</span>
      <span className="dp-glyph dp-glyph-f">( )</span>
    </div>
  );
}

function ProfileCard() {
  return (
    <div className="dp-profile-card">
      <div className="dp-profile-cover">
        <span>Follow +</span>
      </div>
      <div className="dp-profile-avatar" />
      <div className="dp-profile-exp">
        <span>exp.</span>
        <i />
      </div>
      <h4>Leon Madara</h4>
      <p>
        Full Stack AI Developer from Nairobi, Kenya. Building innovative solutions with modern web
        technologies.
      </p>
      <div className="dp-profile-stats">
        <strong>
          3.2K
          <span>Likes</span>
        </strong>
        <strong>
          47
          <span>Projects</span>
        </strong>
        <strong>
          24.8K
          <span>Views</span>
        </strong>
      </div>
      <div className="dp-profile-links">
        <span>GH</span>
        <span>in</span>
        <span>X</span>
      </div>
    </div>
  );
}

function IntroLine() {
  return <div className="dp-hero-intro">Hi, I&apos;m</div>;
}

function NameBlock() {
  return (
    <div className="dp-name-block">
      <h3>Leon Madara</h3>
      <p>Full Stack AI Developer &amp; Designer</p>
    </div>
  );
}

function BodyBlock() {
  return (
    <div className="dp-body-block">
      <p>
        I build high-performance digital products - clean code, considered design, shipped from
        Nairobi.
      </p>
      <div className="dp-location-pill">
        <span>
          <MapPin size={15} fill="currentColor" strokeWidth={0} />
        </span>
        <strong>Nairobi, Kenya</strong>
      </div>
    </div>
  );
}

function ActionsBlock() {
  return (
    <div className="dp-actions-block">
      <div className="dp-cta-row">
        <span className="dp-cta-primary">View Projects</span>
        <span className="dp-cta-secondary">Contact Me</span>
      </div>
      <div className="dp-page-lines" aria-hidden>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function PartContent({ id }: { id: (typeof PARTS)[number]["id"] }) {
  if (id === "paper") return <div className="dp-portfolio-paper" />;
  if (id === "chrome")
    return (
      <>
        <PortfolioChrome />
        <ProfileCard />
      </>
    );
  if (id === "glyphs") return <CodeGlyphs />;
  if (id === "intro") return <IntroLine />;
  if (id === "name") return <NameBlock />;
  if (id === "body") return <BodyBlock />;
  return <ActionsBlock />;
}

export function CollageAssembly() {
  const root = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const animation = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || !intro.current || !animation.current || !canvas.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      PARTS.forEach((part) => {
        const el = canvas.current!.querySelector<HTMLElement>(`[data-part="${part.id}"]`);
        if (!el) return;

        if (reduce) {
          // Show final assembled state immediately for reduced motion
          gsap.set(el, {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            zIndex: part.id === "paper" ? 1 : 5,
          });
        } else {
          // Scattered initial state for animation
          gsap.set(el, {
            x: part.initial.x,
            y: part.initial.y,
            rotate: part.initial.rotate,
            scale: part.initial.scale,
            opacity: 0.88,
            zIndex: part.id === "paper" ? 1 : 5,
          });
        }
      });

      if (reduce) {
        // Set all other elements to final state
        gsap.set(".dp-frenzy-intro-panel", { clearProps: "all" });
        gsap.set(".dp-screen-decoy", { opacity: 0, display: "none" });
        gsap.set(".dp-locked", { opacity: 1, y: 0 });
        gsap.set(".dp-research-meta", { opacity: 0.28 });
        gsap.set(".dp-portfolio-frame", {
          boxShadow: "0 26px 90px -56px oklch(0.18 0.015 60 / 0.5)",
        });
        return;
      }

      gsap.to(".dp-frenzy-intro-panel", {
        y: 120,
        opacity: 0.34,
        scale: 0.985,
        ease: "none",
        scrollTrigger: {
          trigger: intro.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.75,
          invalidateOnRefresh: true,
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: animation.current,
          start: "top top",
          end: "+=2600",
          scrub: 0.65,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        ".dp-screen-decoy",
        {
          opacity: 0,
          scale: 0.55,
          x: (i) => (i % 2 ? -120 : 120),
          y: (i) => (i % 3 ? 90 : -90),
          rotate: (i) => (i % 2 ? -22 : 22),
          duration: 0.9,
          stagger: 0.025,
          ease: "power2.in",
        },
        0,
      )
        .to(
          PARTS.map((part) => `[data-part="${part.id}"]`).join(","),
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            duration: 1.25,
            ease: "power3.inOut",
            stagger: 0.07,
          },
          0.75,
        )
        .to(
          ".dp-portfolio-frame",
          { boxShadow: "0 26px 90px -56px oklch(0.18 0.015 60 / 0.5)", duration: 0.6 },
          1.65,
        )
        .to(".dp-locked", { opacity: 1, y: 0, duration: 0.55 }, 1.85)
        .to(".dp-research-meta", { opacity: 0.28, duration: 0.55 }, 0.45);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="screenshot-frenzy"
      className="dp-frenzy-sequence relative border-t dp-rule"
      style={{ background: "var(--dp-paper-tint-red)" }}
    >
      <div className="dp-frenzy-intro" ref={intro}>
        <div className="dp-frenzy-intro-panel">
          <PhaseHeading
            index="04"
            kicker="Screenshot frenzy"
            title="Find the visual direction before the screen exists."
            intro="I collect references at speed, then sort them by emotion, implementation reality, and pattern fit. Only directions that pass all three filters move into wireframes."
          />
        </div>
      </div>

      <NarrativePin />

      <div className="dp-frenzy-animation relative min-h-[100svh] overflow-hidden" ref={animation}>
        <div className="dp-grid-bg absolute inset-0 opacity-40" aria-hidden />

        <div className="relative h-screen flex flex-col px-6 md:px-12 lg:px-20 py-10">
          <div className="max-w-6xl mx-auto w-full flex items-start justify-between dp-research-meta">
            <div>
              <Mono>04 / Screenshot Frenzy</Mono>
              <div className="dp-handwritten text-lg mt-1" style={{ color: "var(--dp-clay)" }}>
                references -&gt; responsive screen
              </div>
            </div>
            <div className="hidden md:block text-right">
              <Mono>scroll to assemble</Mono>
              <div className="dp-handwritten text-lg mt-1" style={{ color: "var(--dp-clay)" }}>
                pieces -&gt; portfolio screen
              </div>
            </div>
          </div>

          <div className="relative flex-1 grid place-items-center" ref={canvas}>
            {REFERENCES.map((reference) => (
              <figure
                key={reference.id}
                className="dp-screen-decoy dp-reference-card absolute"
                data-ref-shape={reference.shape}
                style={{
                  left: `${reference.x}%`,
                  top: `${reference.y}%`,
                  width: `clamp(78px, ${reference.w}vw, ${reference.maxW}px)`,
                  height: `clamp(64px, ${reference.h}vh, ${reference.maxH}px)`,
                  transform: `rotate(${reference.rotate}deg)`,
                }}
              >
                <img src={reference.src} alt={reference.alt} loading="eager" draggable={false} />
              </figure>
            ))}

            <div className="dp-portfolio-frame" aria-label="Recreated portfolio screenshot">
              {PARTS.map((part) => (
                <div
                  key={part.id}
                  data-part={part.id}
                  className="dp-screen-part"
                  style={{ willChange: "transform, opacity" }}
                >
                  <PartContent id={part.id} />
                </div>
              ))}
            </div>
          </div>

          <div
            className="dp-locked relative flex items-end"
            style={{ opacity: 0, transform: "translateY(20px)" }}
          >
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
              <span className="dp-tick" />
              <Mono>direction selected</Mono>
              <span className="dp-handwritten text-lg ml-2" style={{ color: "var(--dp-clay)" }}>
                seven parts, one responsive screen
              </span>
            </div>
            <div className="hidden sm:flex gap-1.5 ml-auto">
              {[
                "var(--dp-green)",
                "var(--dp-clay)",
                "var(--dp-amber)",
                "var(--dp-slate)",
                "var(--dp-ink)",
              ].map((c) => (
                <span
                  key={c}
                  className="block h-5 w-5 border dp-rule"
                  style={{ background: c }}
                  aria-hidden
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
