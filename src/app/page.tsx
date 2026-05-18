"use client";

import { useEffect, useRef, useState } from "react";

type TrailDot = {
  x: number;
  y: number;
};

const TRAIL_SIZE = 12;
const navItems = [
  { href: "#about-us", label: "About Us" },
  { href: "#products", label: "Products" },
  { href: "#contact-us", label: "Contact Us" },
];
const loaderGreetings = [
  "Hello",
  "नमस्ते",
  "السلام عليكم",
  "你好",
  "Que onda",
  "Bonjour",
  "Hallo",
  "Hola",
  "السلام علیکم",
  "こんにちは",
  "Здравствуйте",
];

export default function Home() {
  const [trail, setTrail] = useState<TrailDot[]>(
    Array.from({ length: TRAIL_SIZE }, () => ({ x: 0, y: 0 })),
  );
  const [trailVisible, setTrailVisible] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loaderActive, setLoaderActive] = useState(true);
  const [loaderPhase, setLoaderPhase] = useState<"greetings" | "exit">("greetings");
  const [loaderIndex, setLoaderIndex] = useState(0);
  const pointer = useRef<TrailDot>({ x: 0, y: 0 });
  const hasPointer = useRef(false);
  const loaderCurve = useRef<SVGPathElement>(null);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };

      if (!hasPointer.current) {
        hasPointer.current = true;
        setTrailVisible(true);
        setTrail(Array.from({ length: TRAIL_SIZE }, () => pointer.current));
      }
    };

    const tick = () => {
      setTrail((currentTrail) =>
        currentTrail.map((dot, index) => {
          const target = index === 0 ? pointer.current : currentTrail[index - 1];
          const drag = index === 0 ? 0.24 : Math.max(0.12, 0.22 - index * 0.01);

          return {
            x: dot.x + (target.x - dot.x) * drag,
            y: dot.y + (target.y - dot.y) * drag,
          };
        }),
      );

      frame = window.requestAnimationFrame(tick);
    };

    let frame = window.requestAnimationFrame(tick);

    window.addEventListener("pointermove", handleMove);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 36);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const closeMenu = () => {
      setMobileMenuOpen(false);
    };

    window.addEventListener("resize", closeMenu);

    return () => {
      window.removeEventListener("resize", closeMenu);
    };
  }, []);

  useEffect(() => {
    if (!loaderActive) {
      return;
    }

    document.body.classList.add("is-loading");

    const greetingInterval = window.setInterval(() => {
      setLoaderIndex((current) => {
        if (current >= loaderGreetings.length - 1) {
          window.clearInterval(greetingInterval);

          greetingDelay = window.setTimeout(() => {
            setLoaderPhase("exit");
            releaseLoader();
          }, 570);

          return current;
        }

        return current + 1;
      });
    }, 150);

    let greetingDelay: number | undefined;
    const releaseLoader = () => {
      setLoaderActive(false);

      window.setTimeout(() => {
        document.body.classList.remove("is-loading");
      }, 520);
    };

    return () => {
      window.clearInterval(greetingInterval);

      if (greetingDelay) {
        window.clearTimeout(greetingDelay);
      }

    };
  }, [loaderActive]);

  useEffect(() => {
    if (!loaderActive || loaderPhase !== "exit") {
      return;
    }

    const path = loaderCurve.current;

    if (!path) {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const finalPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height} 0 ${height} L0 0`;
    const start = performance.now();
    let frame = 0;

    const animate = (time: number) => {
      const progress = Math.min((time - start) / 380, 1);
      const eased = 1 - (1 - progress) ** 3;
      const curveHeight = height + 300 * (1 - eased);

      path.setAttribute(
        "d",
        `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${curveHeight} 0 ${height} L0 0`,
      );

      if (progress < 1) {
        frame = window.requestAnimationFrame(animate);
      } else {
        path.setAttribute("d", finalPath);
      }
    };

    const delay = window.setTimeout(() => {
      frame = window.requestAnimationFrame(animate);
    }, 80);

    return () => {
      window.clearTimeout(delay);

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [loaderActive, loaderPhase]);

  useEffect(() => {
    if (!loaderActive) {
      return;
    }

    const updatePath = () => {
      const path = loaderCurve.current;

      if (!path) {
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;

      path.setAttribute(
        "d",
        `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height + 300} 0 ${height} L0 0`,
      );
    };

    updatePath();
    window.addEventListener("resize", updatePath, { passive: true });

    return () => {
      window.removeEventListener("resize", updatePath);
    };
  }, [loaderActive]);

  const stats = [
    { label: "Block extraction", value: "Prime granite" },
    { label: "Site movement", value: "Excavators + fleets" },
    { label: "Dispatch rhythm", value: "Daily outbound loads" },
  ];
  const products = [
    {
      title: "Raw Granite Blocks",
      text: "Large-format extraction for architecture, monuments, and export-grade fabrication lines.",
    },
    {
      title: "Cut-to-Size Slabs",
      text: "Dimensioned stone selected for consistency, grain control, and clean finishing.",
    },
    {
      title: "Aggregate & Fill",
      text: "Secondary quarry output suited for infrastructure beds, grading, and site reinforcement.",
    },
  ];

  return (
    <main id="top" className="bg-[var(--canvas)] text-[var(--ink)]">
      {loaderActive ? (
        <div
          className={`page-loader page-loader-${loaderPhase} ${
            loaderPhase === "exit" ? "page-loader-exit" : ""
          }`}
          aria-hidden={!loaderActive}
        >
          <div className="loader-copy-wrap">
            {loaderPhase === "greetings" ? (
              <p className="loader-copy">{loaderGreetings[loaderIndex]}</p>
            ) : (
              <p className="loader-copy">{loaderGreetings[loaderIndex]}</p>
            )}
          </div>
          <svg className="loader-curve" aria-hidden="true">
            <path ref={loaderCurve} d="M0 0 L0 0 L0 0 Q0 0 0 0 L0 0" />
          </svg>
        </div>
      ) : null}

      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 transition-all duration-300 sm:px-6 sm:pt-3">
        <div
          className={[
            "w-full max-w-5xl border px-3 shadow-[inset_0_1px_0_rgba(255,248,235,0.1),0_22px_60px_rgba(0,0,0,0.28)] transition-all duration-300 sm:px-6",
            navScrolled
              ? "rounded-[1.45rem] border-stone-200/14 bg-[linear-gradient(180deg,rgba(25,21,17,0.94)_0%,rgba(18,15,12,0.98)_100%)] py-2.5"
              : "rounded-[1.7rem] border-stone-300/12 bg-[linear-gradient(180deg,rgba(43,36,30,0.96)_0%,rgba(28,23,19,0.98)_100%)] py-3",
          ].join(" ")}
        >
          <nav
            aria-label="Primary navigation"
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center justify-between gap-3 sm:block">
              <a
                href="#top"
                className={[
                  "block px-2 text-[0.7rem] uppercase text-stone-100 transition-all hover:text-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-200/50 sm:px-0",
                  navScrolled ? "tracking-[0.28em]" : "tracking-[0.34em]",
                ].join(" ")}
              >
                Zentrix International
              </a>

              <button
                type="button"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-menu"
                aria-label="Toggle navigation menu"
                onClick={() => setMobileMenuOpen((current) => !current)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-stone-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-stone-200/50 sm:hidden"
              >
                <span className="relative block h-4 w-5">
                  <span
                    className={`absolute left-0 top-0 h-[1.5px] w-5 rounded-full bg-current transition-all duration-300 ${
                      mobileMenuOpen ? "top-[7px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-[7px] h-[1.5px] w-5 rounded-full bg-current transition-all duration-300 ${
                      mobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-[14px] h-[1.5px] w-5 rounded-full bg-current transition-all duration-300 ${
                      mobileMenuOpen ? "top-[7px] -rotate-45" : ""
                    }`}
                  />
                </span>
              </button>
            </div>

            <div
              id="mobile-nav-menu"
              className={`${
                mobileMenuOpen ? "grid" : "hidden"
              } grid-cols-1 gap-2 border-t border-white/8 pt-3 sm:flex sm:border-none sm:pt-0 sm:items-center sm:justify-end sm:gap-x-1 sm:gap-y-2`}
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={[
                    "flex min-h-11 items-center justify-center rounded-[0.95rem] px-3 py-2.5 text-center text-[0.68rem] uppercase tracking-[0.2em] transition-all hover:text-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-200/50 sm:min-h-0 sm:rounded-full sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.24em]",
                    navScrolled
                      ? "bg-stone-100/8 text-stone-200 hover:bg-stone-100/12"
                      : "bg-black/10 text-stone-300 hover:bg-stone-100/8",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <div className={`site-shell ${loaderActive ? "site-shell-loading" : ""}`}>
        <section className="relative min-h-dvh overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,242,235,0.18),transparent_38%),linear-gradient(180deg,rgba(17,16,13,0.1),rgba(17,16,13,0.7))]" />

        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/quarry-hero.mp4" type="video/mp4" />
        </video>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(14,13,11,0.78)_16%,rgba(14,13,11,0.38)_42%,rgba(14,13,11,0.82)_100%)]" />

        <div className="relative z-10 flex min-h-dvh flex-col justify-between px-5 py-34 sm:px-10 sm:py-28 lg:px-16 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_20rem] lg:items-end">
            <div className="max-w-4xl">
              <p className="mb-4 text-[0.68rem] uppercase tracking-[0.28em] text-stone-200/72 sm:text-sm sm:tracking-[0.32em]">
                Cut from earth. Moved with precision.
              </p>
              <h1 className="max-w-[8ch] text-[clamp(2.9rem,15vw,7.8rem)] leading-[0.9] tracking-[-0.05em] text-stone-50 sm:max-w-4xl sm:text-[clamp(3.2rem,9vw,7.8rem)]">
                Granite carved at quarry scale.
              </h1>
            </div>
          </div>

          <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="min-w-[15.5rem] snap-start rounded-[1.3rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.08))] p-4 backdrop-blur-sm sm:min-w-0 sm:rounded-[1.75rem] sm:p-5 md:min-w-0"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-300/70 sm:text-xs sm:tracking-[0.28em]">
                  {stat.label}
                </p>
                <p className="mt-2 text-[1.15rem] leading-[1.1] text-stone-50 sm:mt-3 sm:text-2xl">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
        </section>

        <section
          id="about-us"
          className="border-t border-white/8 bg-[linear-gradient(180deg,#120f0c_0%,#17120d_100%)] px-5 py-16 sm:px-10 sm:py-20 lg:px-16"
        >
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-400 sm:text-xs sm:tracking-[0.34em]">
              About Us
            </p>
            <h2 className="mt-4 max-w-[10ch] text-[2.8rem] leading-[0.95] tracking-[-0.05em] text-stone-50 sm:max-w-md sm:text-6xl">
              A quarry team built around discipline and stone quality.
            </h2>
          </div>

          <div className="grid gap-6">
            <p className="max-w-2xl text-base leading-7 text-stone-300 sm:text-lg sm:leading-8">
              Zentrix International is positioned as a granite quarry operator
              focused on dependable extraction, efficient loading cycles, and
              consistent material grading for downstream construction and stone
              fabrication partners.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.45rem] border border-white/10 bg-white/6 p-5 sm:rounded-[1.75rem] sm:p-6">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-400 sm:text-xs sm:tracking-[0.28em]">
                  Operating principle
                </p>
                <p className="mt-3 text-[0.98rem] leading-7 text-stone-200">
                  Controlled extraction, measured haulage, and accountable site
                  movement from cut face to dispatch.
                </p>
              </div>
              <div className="rounded-[1.45rem] border border-white/10 bg-white/6 p-5 sm:rounded-[1.75rem] sm:p-6">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-400 sm:text-xs sm:tracking-[0.28em]">
                  Material focus
                </p>
                <p className="mt-3 text-[0.98rem] leading-7 text-stone-200">
                  Granite blocks, cut stock, and quarry by-products prepared for
                  commercial-scale supply chains.
                </p>
              </div>
            </div>
          </div>
        </div>
        </section>

        <section
          id="products"
        className="border-t border-white/8 bg-stone-100 px-5 py-16 text-stone-900 sm:px-10 sm:py-20 lg:px-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-500 sm:text-xs sm:tracking-[0.34em]">
                Products
              </p>
              <h2 className="mt-4 max-w-[10ch] text-[2.8rem] leading-[0.95] tracking-[-0.05em] sm:max-w-2xl sm:text-6xl">
                Quarry output designed for heavy use and clean finishing.
              </h2>
            </div>
            <p className="max-w-xl text-[0.98rem] leading-7 text-stone-600 sm:text-base">
              Product categories are structured for buyers who need raw volume,
              dimensional consistency, or secondary material for civil work.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-3 lg:gap-5">
            {products.map((product, index) => (
              <article
                key={product.title}
                className="rounded-[1.5rem] border border-stone-300 bg-white p-5 shadow-[0_24px_70px_rgba(28,23,19,0.08)] sm:rounded-[2rem] sm:p-7"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-500 sm:text-xs sm:tracking-[0.3em]">
                  0{index + 1}
                </p>
                <h3 className="mt-4 text-[2.15rem] leading-[1] tracking-[-0.04em] text-stone-950 sm:mt-5 sm:text-3xl">
                  {product.title}
                </h3>
                <p className="mt-3 text-[0.98rem] leading-7 text-stone-600 sm:mt-4 sm:text-base">
                  {product.text}
                </p>
              </article>
            ))}
          </div>
        </div>
        </section>

        <section
          id="contact-us"
        className="border-t border-white/8 bg-[linear-gradient(180deg,#1b1712_0%,#120f0d_100%)] px-5 py-16 sm:px-10 sm:py-20 lg:px-16"
      >
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-400 sm:text-xs sm:tracking-[0.34em]">
              Contact Us
            </p>
            <h2 className="mt-4 max-w-[9ch] text-[2.8rem] leading-[0.95] tracking-[-0.05em] text-stone-50 sm:max-w-md sm:text-6xl">
              Start a supply conversation with the quarry team.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-300 sm:mt-6 sm:text-lg sm:leading-8">
              Use this section as the first contact block for procurement,
              material inquiries, and dispatch planning.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.45rem] border border-white/10 bg-white/7 p-5 backdrop-blur-sm sm:rounded-[1.9rem] sm:p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-400 sm:text-xs sm:tracking-[0.28em]">
                Email
              </p>
              <a
                href="mailto:internationalzentrix@gmail.com"
                className="mt-4 block max-w-full overflow-hidden text-base leading-7 text-stone-50 break-all transition hover:text-stone-200 sm:text-xl sm:leading-8 sm:break-words"
              >
                internationalzentrix@gmail.com
              </a>
            </div>
            <div className="rounded-[1.45rem] border border-white/10 bg-white/7 p-5 backdrop-blur-sm sm:rounded-[1.9rem] sm:p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-400 sm:text-xs sm:tracking-[0.28em]">
                Phone
              </p>
              <a
                href="tel:+918050609350"
                className="mt-4 block text-[1.7rem] leading-none text-stone-50 transition hover:text-stone-200 sm:text-xl"
              >
                +91-8050609350
              </a>
            </div>
            <div className="rounded-[1.45rem] border border-white/10 bg-white/7 p-5 backdrop-blur-sm sm:col-span-2 sm:rounded-[1.9rem] sm:p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-400 sm:text-xs sm:tracking-[0.28em]">
                Site office
              </p>
              <p className="mt-4 max-w-xl text-lg leading-8 text-stone-50 sm:text-xl">
                No.47/1 Bhel Layout, Jayanager East, Bangalore, India - 560041
              </p>
            </div>
          </div>
        </div>
        </section>
      </div>

      <div className={`hidden md:block ${trailVisible ? "" : "opacity-0"}`}>
        {trail.map((dot, index) => (
          <span
            key={index}
            className="quarry-trail"
            style={{
              left: dot.x,
              top: dot.y,
              width: `${24 - index * 1.45}px`,
              height: `${24 - index * 1.45}px`,
              opacity: `${0.42 - index * 0.024}`,
              transform: `translate(-50%, -50%) rotate(${index * 17}deg)`,
            }}
          />
        ))}
      </div>
    </main>
  );
}
