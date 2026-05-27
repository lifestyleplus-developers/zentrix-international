"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "/#about-us", label: "About Us" },
  { href: "/#contact-us", label: "Contact Us" },
];

const productLinks = [
  { href: "/products/rough-blocks", label: "Rough Block" },
  { href: "/products/gangsaw-slabs", label: "Gangsaw Slabs" },
];

export function SiteNavbar() {
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

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
      setProductsOpen(false);
    };

    window.addEventListener("resize", closeMenu);

    return () => {
      window.removeEventListener("resize", closeMenu);
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        productsDropdownRef.current &&
        !productsDropdownRef.current.contains(event.target as Node)
      ) {
        setProductsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  function closeNavigation() {
    setMobileMenuOpen(false);
    setProductsOpen(false);
  }

  return (
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
            <Link
              href="/"
              className={[
                "block px-2 text-[0.7rem] uppercase text-stone-100 transition-all hover:text-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-200/50 sm:px-0",
                navScrolled ? "tracking-[0.28em]" : "tracking-[0.34em]",
              ].join(" ")}
              onClick={closeNavigation}
            >
              Zentrix International
            </Link>

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
            } grid-cols-1 gap-2 border-t border-white/8 pt-3 sm:flex sm:items-center sm:justify-end sm:gap-x-1 sm:gap-y-2 sm:border-none sm:pt-0`}
          >
            <Link
              href={navItems[0].href}
              onClick={closeNavigation}
              className={[
                "flex min-h-11 items-center justify-center rounded-[0.95rem] px-3 py-2.5 text-center text-[0.68rem] uppercase tracking-[0.2em] transition-all hover:text-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-200/50 sm:min-h-0 sm:rounded-full sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.24em]",
                navScrolled
                  ? "bg-stone-100/8 text-stone-200 hover:bg-stone-100/12"
                  : "bg-black/10 text-stone-300 hover:bg-stone-100/8",
              ].join(" ")}
            >
              {navItems[0].label}
            </Link>

            <div ref={productsDropdownRef} className="relative">
              <button
                type="button"
                aria-expanded={productsOpen}
                aria-controls="products-nav-menu"
                onClick={() => setProductsOpen((current) => !current)}
                className={[
                  "flex min-h-11 w-full items-center justify-center gap-2 rounded-[0.95rem] px-3 py-2.5 text-center text-[0.68rem] uppercase tracking-[0.2em] transition-all hover:text-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-200/50 sm:min-h-0 sm:rounded-full sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.24em]",
                  navScrolled
                    ? "bg-stone-100/8 text-stone-200 hover:bg-stone-100/12"
                    : "bg-black/10 text-stone-300 hover:bg-stone-100/8",
                ].join(" ")}
              >
                Products
                <span
                  aria-hidden="true"
                  className={`text-[0.7rem] transition-transform duration-200 ${
                    productsOpen ? "rotate-180" : ""
                  }`}
                >
                  ↓
                </span>
              </button>

              <div
                id="products-nav-menu"
                className={`${
                  productsOpen ? "grid" : "hidden"
                } mt-2 grid gap-2 rounded-[1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(31,27,23,0.98)_0%,rgba(19,16,13,0.98)_100%)] p-2 shadow-[0_18px_45px_rgba(0,0,0,0.34)] sm:absolute sm:left-1/2 sm:top-full sm:mt-3 sm:w-56 sm:-translate-x-1/2`}
              >
                {productLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeNavigation}
                    className="rounded-[0.75rem] px-4 py-3 text-center text-[0.68rem] uppercase tracking-[0.18em] text-stone-300 transition hover:bg-white/8 hover:text-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-200/50 sm:text-left"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeNavigation}
                className={[
                  "flex min-h-11 items-center justify-center rounded-[0.95rem] px-3 py-2.5 text-center text-[0.68rem] uppercase tracking-[0.2em] transition-all hover:text-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-200/50 sm:min-h-0 sm:rounded-full sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.24em]",
                  navScrolled
                    ? "bg-stone-100/8 text-stone-200 hover:bg-stone-100/12"
                    : "bg-black/10 text-stone-300 hover:bg-stone-100/8",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
