"use client";

import { ContactForm } from "@/components/ContactForm";
import { contactInfo, footerLinks } from "@/lib/contact";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type TrailDot = {
  x: number;
  y: number;
};

const TRAIL_SIZE = 12;
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
const criticalCardImages = ["/Rough-block.png", "/Crystalo product .png"];
let hasShownHomeLoaderInRuntime = false;

function preloadImages(sources: string[]) {
  return Promise.all(
    sources.map(
      (source) =>
        new Promise<void>((resolve) => {
          const image = new window.Image();
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = source;
        }),
    ),
  );
}

export default function Home() {
  const [trail, setTrail] = useState<TrailDot[]>(
    Array.from({ length: TRAIL_SIZE }, () => ({ x: 0, y: 0 })),
  );
  const [trailVisible, setTrailVisible] = useState(false);
  const [loaderActive, setLoaderActive] = useState(() => !hasShownHomeLoaderInRuntime);
  const [loaderPhase, setLoaderPhase] = useState<"greetings" | "exit">("greetings");
  const [loaderIndex, setLoaderIndex] = useState(0);
  const [criticalAssetsReady, setCriticalAssetsReady] = useState(false);
  const pointer = useRef<TrailDot>({ x: 0, y: 0 });
  const hasPointer = useRef(false);
  const loaderCurve = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!hasShownHomeLoaderInRuntime) {
      hasShownHomeLoaderInRuntime = true;
    }
  }, []);

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
    let cancelled = false;
    const preloadTimeout = window.setTimeout(() => {
      if (!cancelled) {
        setCriticalAssetsReady(true);
      }
    }, 1400);

    preloadImages(criticalCardImages).then(() => {
      if (!cancelled) {
        window.clearTimeout(preloadTimeout);
        setCriticalAssetsReady(true);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(preloadTimeout);
    };
  }, []);

  useEffect(() => {
    if (!loaderActive) {
      return;
    }

    document.body.classList.add("is-loading");
    let greetingDelay: number | undefined;
    let releaseDelay: number | undefined;
    let loaderMayExit = false;

    const releaseLoader = () => {
      setLoaderActive(false);

      window.setTimeout(() => {
        document.body.classList.remove("is-loading");
      }, 520);
    };

    const tryExitLoader = () => {
      if (!loaderMayExit || !criticalAssetsReady) {
        return;
      }

      setLoaderPhase("exit");
      releaseDelay = window.setTimeout(() => {
        releaseLoader();
      }, 80);
    };

    const greetingInterval = window.setInterval(() => {
      setLoaderIndex((current) => {
        if (current >= loaderGreetings.length - 1) {
          window.clearInterval(greetingInterval);

          greetingDelay = window.setTimeout(() => {
            loaderMayExit = true;
            tryExitLoader();
          }, 570);

          return current;
        }

        return current + 1;
      });
    }, 150);

    return () => {
      window.clearInterval(greetingInterval);

      if (greetingDelay) {
        window.clearTimeout(greetingDelay);
      }

      if (releaseDelay) {
        window.clearTimeout(releaseDelay);
      }

    };
  }, [loaderActive, criticalAssetsReady]);

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
    { label: "Raw blocks", value: "Consistent Grade" },
    { label: "Cut to spec", value: "Finished to order" },
    { label: "Reliable lead times.", value: "Daily dispatch" },
  ];
  const products = [
    {
      title: "Rough Blocks",
      text: "",
      href: "/products/rough-blocks",
      image: "/Rough-block.png",
    },
    {
      title: "Gangsaw Slabs",
      href: "/products/gangsaw-slabs",
      image: "/Crystalo product .png",
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
              <h1 className="text-[clamp(2.9rem,15vw,7.8rem)] leading-[0.9] tracking-[-0.05em] text-stone-50 sm:max-w-4xl sm:text-[clamp(3.2rem,9vw,7.8rem)]">
  Stone sourced,<br />graded, &<br />dispatched at volume.
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
              About
            </p>
            <h2 className="mt-4 max-w-[22ch] text-[2.8rem] leading-[0.95] tracking-[-0.05em] text-stone-50 sm:max-w-md sm:text-6xl">
  We work in stone.<br />We ship on schedule.
</h2>
          </div>

          <div className="grid gap-6">
            <p className="max-w-2xl text-base leading-7 text-stone-300 sm:text-lg sm:leading-8">
            Zentrix International supplies granite direct from quarry — rough blocks and gangsaw slabs graded for construction, fabrication, and commercial fit-out buyers.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.45rem] border border-white/10 bg-white/6 p-5 sm:rounded-[1.75rem] sm:p-6">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-400 sm:text-xs sm:tracking-[0.28em]">
                How we work
                </p>
                <p className="mt-3 text-[0.98rem] leading-7 text-stone-200">
                Controlled extraction from face to dispatch. Every load is graded, measured, and documented before it leaves the yard.
                </p>
              </div>
              <div className="rounded-[1.45rem] border border-white/10 bg-white/6 p-5 sm:rounded-[1.75rem] sm:p-6">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-400 sm:text-xs sm:tracking-[0.28em]">
                What we supply
                </p>
                <p className="mt-3 text-[0.98rem] leading-7 text-stone-200">
                Rough blocks, gangsaw slabs, and quarry by-products — prepared for commercial-scale procurement.
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
              <h2 className="mt-4 max-w-[22ch] text-[2.8rem] leading-[0.95] tracking-[-0.05em] sm:max-w-2xl sm:text-6xl">
  Granite for builders,<br />fabricators, &<br />specification teams.
</h2>
            </div>
            <p className="max-w-xl text-[0.98rem] leading-7 text-stone-600 sm:text-base">
            Whether you need raw volume, dimensioned slabs, or secondary material for civil work — we supply across all three categories.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-2 lg:gap-5">
            {products.map((product, index) => (
              <article
                key={product.title}
                className="overflow-hidden rounded-[1.5rem] border border-stone-300 bg-white shadow-[0_24px_70px_rgba(28,23,19,0.08)] sm:rounded-[2rem]"
              >
                {product.image ? (
                  <div className="relative aspect-[16/10] bg-stone-200">
                    <Image
                      src={product.image}
                      alt={`${product.title} preview`}
                      fill
                      sizes="(max-width: 1023px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="p-5 sm:p-7">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-500 sm:text-xs sm:tracking-[0.3em]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 text-[2.15rem] leading-[1] tracking-[-0.04em] text-stone-950 sm:mt-5 sm:text-3xl">
                    {product.title}
                  </h3>
                  {product.text ? (
                    <p className="mt-3 text-[0.98rem] leading-7 text-stone-600 sm:mt-4 sm:text-base">
                      {product.text}
                    </p>
                  ) : null}
                  <Link
                    href={product.href}
                    className="mt-5 inline-flex rounded-full border border-stone-300 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-stone-900 transition hover:border-stone-900 hover:bg-stone-900 hover:text-white sm:text-xs"
                  >
                    View Inventory
                  </Link>
                </div>
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
            <h2 className="mt-4 text-[2.8rem] leading-[0.95] tracking-[-0.05em] text-stone-50 sm:max-w-md sm:text-6xl">
  Ready to source?<br />Talk to us.
</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-300 sm:mt-6 sm:text-lg sm:leading-8">
            For procurement inquiries, sample requests, and dispatch planning.
            </p>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
        </section>

        <footer className="border-t border-stone-300 bg-stone-50 px-5 py-14 text-stone-900 sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-stone-900">
                Head Office
              </p>
              <p className="mt-4 max-w-sm text-[1.02rem] leading-8 text-stone-600">
                {contactInfo.headOffice}
              </p>
            </div>

            <div>
              <p className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-stone-900">
                Connect With Us
              </p>
              <div className="mt-4 grid gap-2 text-[1.02rem] leading-8 text-stone-600">
                <a href={contactInfo.phonePrimaryHref} className="transition hover:text-stone-900">
                  {contactInfo.phonePrimary}
                </a>
                <a href={contactInfo.phoneSecondaryHref} className="transition hover:text-stone-900">
                  {contactInfo.phoneSecondary}
                </a>
                <a href={`mailto:${contactInfo.email}`} className="transition hover:text-stone-900">
                  {contactInfo.email}
                </a>
              </div>
            </div>



            <div>
              <p className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-stone-900">
                Quick Links
              </p>
              <div className="mt-4 grid gap-2 text-[1.02rem] leading-8 text-stone-600">
                {footerLinks.map((item) => (
                  <a key={item.href} href={item.href} className="transition hover:text-stone-900">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-3 border-t border-stone-300 pt-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <p>{contactInfo.companyName}</p>
            <p>{contactInfo.email}</p>
          </div>
        </footer>
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
