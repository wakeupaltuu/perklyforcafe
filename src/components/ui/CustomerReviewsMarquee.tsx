import type { CSSProperties } from 'react';
import { BadgeCheck } from 'lucide-react';
import type { CustomerReview } from '@/types';

function ReviewCard({ review }: { review: CustomerReview }) {
  const initials = review.name.trim().charAt(0).toUpperCase() || '?';
  const stars = '★'.repeat(Math.max(0, Math.min(5, Math.round(review.rating))));
  return <figure className="flex h-[166px] w-[248px] shrink-0 flex-col items-start rounded-3xl border border-[#e9dfd2] bg-white px-5 py-4 text-left shadow-[0_14px_30px_rgba(74,49,35,0.06)]"><div className="text-[13px] leading-none tracking-[0.1em] text-[#c68642]" aria-label={`${review.rating} out of 5 stars`}>{stars}</div><blockquote className="mt-3 line-clamp-2 text-[14px] leading-[1.4] text-[#5c4033]">“{review.review}”</blockquote><figcaption className="mt-auto flex items-center gap-2.5 pt-3"><div aria-hidden="true" className="flex size-[34px] items-center justify-center rounded-full bg-[#f3e9dc] text-sm font-semibold text-[#7a4f2a] ring-2 ring-[#f8f0e6]">{initials}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-1.5"><p className="truncate text-[13px] font-semibold text-neutral-950">{review.name}</p>{review.verified && <BadgeCheck className="size-3.5 shrink-0 text-emerald-600" aria-label="Verified review" />}</div></div></figcaption></figure>;
}

function MarqueeRow({ rowReviews, reverse = false }: { rowReviews: CustomerReview[]; reverse?: boolean }) {
  const animationStyle = { animationDuration: '40s', animationDirection: reverse ? 'reverse' : 'normal' } as CSSProperties;
  return <div className="group overflow-hidden py-2"><div className="perkly-review-marquee flex w-max gap-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none" style={animationStyle}>{[...rowReviews, ...rowReviews].map((review, index) => <ReviewCard key={`${review.id}-${index}`} review={review} />)}</div></div>;
}

export function CustomerReviewsMarquee({ reviews, rating, reviewCount, eyebrow, title, subtitle }: { reviews: CustomerReview[]; rating: number; reviewCount: number; eyebrow?: string; title?: string; subtitle?: string }) {
  if (!reviews.length) return null;
  const midpoint = Math.ceil(reviews.length / 2);
  const sectionEyebrow = eyebrow?.trim() || 'GUEST NOTES';
  const sectionTitle = title?.trim() || 'Loved by our community';
  const sectionSubtitle = subtitle?.trim() || 'Real experiences from our visitors.';
  return <section className="mt-5 overflow-hidden" aria-labelledby="customer-reviews-heading"><div className="px-1 text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a7a52]">{sectionEyebrow}</p><h2 id="customer-reviews-heading" className="mt-1 font-display text-[22px] leading-7 text-neutral-950">{sectionTitle}</h2><p className="mt-1.5 text-[13px] font-medium text-[#5c4033]">⭐ {rating} • {reviewCount} Reviews</p><p className="mt-0.5 text-[12px] leading-4 text-neutral-500">{sectionSubtitle}</p></div><div className="relative mt-3 -mx-6"><MarqueeRow rowReviews={reviews.slice(0, midpoint)} reverse /><MarqueeRow rowReviews={reviews.slice(midpoint)} /><div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#f7f1e8] to-transparent" /><div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#f7f1e8] to-transparent" /></div><style>{`@keyframes perkly-review-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } } .perkly-review-marquee { animation-name: perkly-review-marquee; animation-timing-function: linear; animation-iteration-count: infinite; }`}</style></section>;
}
