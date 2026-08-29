import type { CSSProperties } from 'react';

const DURATION = 58;

function GalleryRow({ images, reverse = false }: { images: string[]; reverse?: boolean }) {
  const animationStyle = { animationDuration: `${DURATION}s`, animationDirection: reverse ? 'reverse' : 'normal' } as CSSProperties;
  return <div className="group overflow-hidden py-2"><div className="perkly-gallery-marquee flex w-max gap-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none" style={animationStyle}>{[...images, ...images].map((image, index) => { const large = index % images.length % 3 === 2; return <div key={`${image}-${index}`} className={`${large ? 'h-44 w-72' : 'h-36 w-56'} shrink-0 overflow-hidden rounded-3xl shadow-[0_14px_30px_rgba(74,49,35,0.14)]`}><img src={image} alt="Inside our cafe" className="size-full object-cover" loading="lazy" /></div>; })}</div></div>;
}

export function CafeGalleryMarquee({ images, eyebrow, title, subtitle }: { images: string[]; eyebrow?: string; title?: string; subtitle?: string }) {
  if (!images.length) return null;
  const midpoint = Math.ceil(images.length / 2);
  const bottomImages = images.slice(midpoint).length ? images.slice(midpoint) : images;
  const sectionEyebrow = eyebrow?.trim() || 'INSIDE OUR CAFE';
  const sectionTitle = title?.trim() || 'Inside Our Cafe';
  const sectionSubtitle = subtitle?.trim() || 'A glimpse into the atmosphere, food and moments that make us special.';
  return <section className="mt-8 overflow-hidden" aria-labelledby="cafe-gallery-heading"><div className="px-1 text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">{sectionEyebrow}</p><h2 id="cafe-gallery-heading" className="font-serif italic text-2xl leading-8 text-neutral-950">{sectionTitle}</h2><p className="mt-2 font-serif text-[15px] leading-7 text-neutral-500 max-w-[320px] mx-auto">{sectionSubtitle}</p></div><div className="relative mt-3 -mx-6"><GalleryRow images={images.slice(0, midpoint)} reverse /><GalleryRow images={bottomImages} /><div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--color-background)] to-transparent" /><div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--color-background)] to-transparent" /></div><style>{`@keyframes perkly-gallery-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } } .perkly-gallery-marquee { animation-name: perkly-gallery-marquee; animation-timing-function: linear; animation-iteration-count: infinite; }`}</style></section>;
}
