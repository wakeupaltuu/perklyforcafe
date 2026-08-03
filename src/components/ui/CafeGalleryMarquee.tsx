import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';

const DURATION = 58;

function GalleryRow({ images, reverse = false, onImageClick }: { images: string[]; reverse?: boolean; onImageClick: (index: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const startRef = useRef({ x: 0, transform: 0, moved: false });
  const resumeRef = useRef<number | undefined>(undefined);
  const [dragging, setDragging] = useState(false);

  const pause = () => {
    const track = trackRef.current;
    if (!track) return;
    window.clearTimeout(resumeRef.current);
    const matrix = window.getComputedStyle(track).transform.match(/matrix\(([^)]+)\)/);
    const current = matrix ? Number(matrix[1].split(',')[4]) : 0;
    track.style.animation = 'none';
    track.style.transform = `translateX(${current}px)`;
    startRef.current.transform = current;
  };
  const resume = () => {
    window.clearTimeout(resumeRef.current);
    resumeRef.current = window.setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      const halfWidth = track.scrollWidth / 2;
      const matrix = track.style.transform.match(/translateX\(([-\d.]+)px\)/);
      const current = matrix ? Number(matrix[1]) : 0;
      const normalized = ((current % halfWidth) + halfWidth) % halfWidth;
      const progress = reverse ? 1 - normalized / halfWidth : normalized / halfWidth;
      track.style.transform = '';
      track.style.animation = '';
      track.style.animationDelay = `-${progress * DURATION}s`;
      track.style.animationPlayState = 'running';
      setDragging(false);
    }, 2000);
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pause();
    startRef.current = { ...startRef.current, x: event.clientX, moved: false };
    setDragging(true);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging || event.pointerType === 'mouse' || !trackRef.current) return;
    const delta = event.clientX - startRef.current.x;
    if (Math.abs(delta) > 5) startRef.current.moved = true;
    trackRef.current.style.transform = `translateX(${startRef.current.transform + delta}px)`;
  };
  const onPointerUp = () => resume();
  const style = { animationDuration: `${DURATION}s`, animationDirection: reverse ? 'reverse' : 'normal' } as CSSProperties;
  return <div className="group overflow-hidden py-2 touch-pan-y" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}><div ref={trackRef} className="perkly-gallery-marquee flex w-max gap-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none" style={style}>{[...images, ...images].map((image, index) => { const imageIndex = index % images.length; const large = imageIndex % 3 === 2; return <button key={`${image}-${index}`} type="button" onClick={() => !startRef.current.moved && onImageClick(imageIndex)} className={`${large ? 'h-44 w-72' : 'h-36 w-56'} shrink-0 overflow-hidden rounded-3xl shadow-[0_14px_30px_rgba(74,49,35,0.14)]`}><img src={image} alt="Inside our cafe" className="size-full object-cover" loading="lazy" draggable={false} /></button>; })}</div></div>;
}

export function CafeGalleryMarquee({ images }: { images: string[] }) {
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const swipeStart = useRef<number | null>(null);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setActiveImage(null);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);
  if (!images.length) return null;
  const midpoint = Math.ceil(images.length / 2);
  const bottomImages = images.slice(midpoint).length ? images.slice(midpoint) : images;
  const previous = () => setActiveImage(current => current === null ? null : (current - 1 + images.length) % images.length);
  const next = () => setActiveImage(current => current === null ? null : (current + 1) % images.length);
  return <section className="mt-8 overflow-hidden" aria-labelledby="cafe-gallery-heading"><div className="px-1 text-center"><h2 id="cafe-gallery-heading" className="font-serif italic text-2xl leading-8 text-neutral-950">Inside Our Cafe</h2><p className="mt-2 font-serif text-[15px] leading-7 text-neutral-500 max-w-[320px] mx-auto">A glimpse into the atmosphere, food and moments that make us special.</p></div><div className="relative mt-3 -mx-6"><GalleryRow images={images.slice(0, midpoint)} reverse onImageClick={setActiveImage} /><GalleryRow images={bottomImages} onImageClick={index => setActiveImage(images.length === 1 ? index : index + midpoint)} /><div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#f7f1e8] to-transparent" /><div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#f7f1e8] to-transparent" /></div><style>{`@keyframes perkly-gallery-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } } .perkly-gallery-marquee { animation-name: perkly-gallery-marquee; animation-timing-function: linear; animation-iteration-count: infinite; }`}</style>{activeImage !== null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-5" role="dialog" aria-modal="true" onClick={() => setActiveImage(null)} onPointerDown={event => { swipeStart.current = event.clientX; }} onPointerUp={event => { const delta = event.clientX - (swipeStart.current ?? event.clientX); if (Math.abs(delta) > 40) delta > 0 ? previous() : next(); }}><img src={images[activeImage]} alt="Inside our cafe" className="max-h-full max-w-full rounded-3xl object-contain shadow-2xl" onClick={event => event.stopPropagation()} /></div>}</section>;
}
