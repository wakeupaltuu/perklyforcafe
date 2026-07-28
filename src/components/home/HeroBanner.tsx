// HeroBanner.tsx

import { useEffect, useRef, useState } from 'react';
import { optimizeImageUrl } from '@/lib/utils';
import { useTenant } from '@/context/TenantContext';
import { useNavigate } from 'react-router-dom';
import type { HeroSlide } from '@/types';

const AUTOPLAY_MS = 3000;

export function HeroBanner() {
  const { cafe } = useTenant();
  const navigate = useNavigate();

  // `heroSLides` supports the existing Firestore spelling; new documents should use `heroSlides`.
  const configuredSlides = cafe?.heroSlides ?? cafe?.heroSLides;

  // Falls back to a single slide built from legacy fields if neither slide array is set.
  const slides: HeroSlide[] =
    configuredSlides && configuredSlides.length > 0
      ? configuredSlides
      : [
          {
            imageUrl:
              cafe?.heroImageUrl ||
              'https://images.unsplash.com/photo-1579265898841-79c7890d69cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxsYXR0ZSUyMGFydCUyMGNvZmZlZSUyMGN1cCUyMGdvbGRlbiUyMGJva2VoJTIwd2FybXxlbnwxfDB8fHwxNzg0Nzc1OTc4fDA&ixlib=rb-4.1.0&q=80&w=400',
            eyebrow: 'Fresh Roast',
            title: `Start your day the ${cafe?.cafeName || 'Perkly'} way`,
            ctaText: 'Check in now',
            ctaLink: '/scan',
          },
        ];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const goTo = (i: number) => {
    setIndex(i);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), AUTOPLAY_MS);
  };

  const handleCta = (link?: string) => {
    if (!link) return;

    if (/^https?:\/\//i.test(link)) {
      window.location.assign(link);
      return;
    }

    navigate(link);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) {
        goTo((index + 1) % slides.length);
      } else {
        goTo((index - 1 + slides.length) % slides.length);
      }
    }
    touchStartX.current = null;
  };

  return (
    <div className="px-5 pt-1 sm:px-6">
      <div
        className="relative overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-float)] h-[236px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="relative w-full h-full flex-shrink-0">
              <img
                alt={slide.title}
                className="object-cover w-full h-full"
                src={optimizeImageUrl(slide.imageUrl, 400)}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <div className="bg-[linear-gradient(0deg,rgba(38,21,12,.9),rgba(38,21,12,.18))] absolute inset-0" />
              <div className="flex absolute inset-0 p-6 flex-col justify-end gap-3">
                {slide.eyebrow && (
                  <span className="type-eyebrow text-white/75 tracking-[.22em]">
                    {slide.eyebrow}
                  </span>
                )}
                <h2 className="type-section-title max-w-[82%] text-white text-[26px] leading-8">
                  {slide.title}
                </h2>
                {slide.ctaText && (
                  <button
                    onClick={() => handleCta(slide.ctaLink)}
                    className="type-button bg-caramel shadow-[0_6px_16px_-4px_rgba(60,30,10,.65)] rounded-full text-white mt-1 px-5 py-2.5 w-fit active:scale-95 transition-transform"
                  >
                    {slide.ctaText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
