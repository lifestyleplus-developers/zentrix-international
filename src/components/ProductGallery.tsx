"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useState } from "react";
import type { ProductImage } from "@/lib/products";

type ProductGalleryProps = {
  name: string;
  images: ProductImage[];
};

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const close = () => {
    setActiveIndex(null);
    setZoomed(false);
  };

  const showPrevious = () => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return current === 0 ? images.length - 1 : current - 1;
    });
    setZoomed(false);
  };

  const showNext = () => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return current === images.length - 1 ? 0 : current + 1;
    });
    setZoomed(false);
  };

  const handleKeydown = useEffectEvent((event: KeyboardEvent) => {
    if (activeIndex === null) {
      return;
    }

    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") showPrevious();
    if (event.key === "ArrowRight") showNext();
  });

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [activeIndex]);

  return (
    <section aria-labelledby="product-gallery">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-stone-400 sm:text-xs sm:tracking-[0.34em]">
            Gallery
          </p>
          <h2
            id="product-gallery"
            className="mt-3 text-[2.2rem] leading-[0.95] tracking-[-0.04em] text-stone-50 sm:text-5xl"
          >
            Additional views
          </h2>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-[1.45rem] border border-white/10 bg-white/6 text-left transition hover:-translate-y-1 hover:border-white/18 focus:outline-none focus:ring-2 focus:ring-stone-200/50"
            aria-label={`Open ${name} image ${index + 1} in viewer`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(15,13,11,0.68)_100%)]" />
            <span className="absolute bottom-4 left-4 rounded-full border border-white/12 bg-[rgba(20,18,15,0.45)] px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-stone-100 backdrop-blur-sm">
              View Image {index + 1}
            </span>
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(10,9,8,0.92)] p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} image viewer`}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-stone-100 transition hover:bg-white/14 focus:outline-none focus:ring-2 focus:ring-stone-200/50"
          >
            Close
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={showPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/12 bg-white/8 px-4 py-3 text-[0.68rem] uppercase tracking-[0.22em] text-stone-100 transition hover:bg-white/14 focus:outline-none focus:ring-2 focus:ring-stone-200/50"
                aria-label="View previous image"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={showNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/12 bg-white/8 px-4 py-3 text-[0.68rem] uppercase tracking-[0.22em] text-stone-100 transition hover:bg-white/14 focus:outline-none focus:ring-2 focus:ring-stone-200/50"
                aria-label="View next image"
              >
                Next
              </button>
            </>
          ) : null}

          <div className="w-full max-w-6xl">
            <button
              type="button"
              onClick={() => setZoomed((current) => !current)}
              className="mb-4 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-stone-100 transition hover:bg-white/14 focus:outline-none focus:ring-2 focus:ring-stone-200/50"
            >
              {zoomed ? "Reset Zoom" : "Zoom Image"}
            </button>
            <div className="relative aspect-[16/10] overflow-auto rounded-[1.7rem] border border-white/10 bg-stone-950">
              <div className={`relative h-full w-full transition duration-300 ${zoomed ? "scale-[1.8]" : "scale-100"}`}>
                <Image
                  src={images[activeIndex].src}
                  alt={images[activeIndex].alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </div>
            <p className="mt-4 text-center text-[0.68rem] uppercase tracking-[0.24em] text-stone-400 sm:text-xs">
              Image {activeIndex + 1} of {images.length}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
