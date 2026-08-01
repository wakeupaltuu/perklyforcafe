import type { CSSProperties } from 'react';
import { BadgeCheck } from 'lucide-react';

type CustomerReview = { name: string; date: string; review: string; avatar: string };

const reviews: CustomerReview[] = [
  { name: 'Ananya Mehta', date: '2 days ago', review: 'The coffee is consistently lovely and the warm little corners make it my favourite place to slow down after work.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80' },
  { name: 'Rohan Kapoor', date: 'Last week', review: 'Came for the Korean noodles and stayed for dessert. Everything felt thoughtful, fresh, and beautifully served.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80' },
  { name: 'Priya Nair', date: 'Last week', review: 'Such a calming space to work remotely. Great Wi-Fi, kind staff, and a cappuccino that made my morning.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&q=80' },
  { name: 'Arjun Malhotra', date: '1 week ago', review: 'The breakfast menu is a quiet winner. Excellent coffee, relaxed music, and the team made us feel right at home.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&q=80' },
  { name: 'Kavya Iyer', date: '2 weeks ago', review: 'Beautiful ambience without feeling fussy. The desserts were delicate, not overly sweet, and absolutely worth returning for.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=96&q=80' },
  { name: 'Vikram Singh', date: '2 weeks ago', review: 'A proper neighbourhood cafe. The staff remembered my order and the cold brew was smooth and perfectly balanced.', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=96&q=80' },
  { name: 'Neha Desai', date: '3 weeks ago', review: 'Our weekend breakfast felt unhurried in the best way. Cozy tables, lovely pastries, and coffee everyone enjoyed.', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=96&q=80' },
  { name: 'Siddharth Rao', date: '3 weeks ago', review: 'The kind of cafe you want to keep to yourself. Excellent espresso, comforting food, and a genuinely peaceful atmosphere.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=80' },
];

function ReviewCard({ review }: { review: CustomerReview }) {
  return <figure className="flex h-[202px] w-[300px] shrink-0 flex-col rounded-3xl border border-[#e9dfd2] bg-white p-5 shadow-[0_14px_30px_rgba(74,49,35,0.06)]"><div className="text-[14px] leading-none tracking-[0.12em] text-[#c68642]" aria-label="5 out of 5 stars">★★★★★</div><blockquote className="mt-4 line-clamp-3 text-[15px] leading-6 text-[#5c4033]">“{review.review}”</blockquote><figcaption className="mt-auto flex items-center gap-3 pt-4"><img src={review.avatar} alt="" className="size-9 rounded-full object-cover ring-2 ring-[#f8f0e6]" loading="lazy" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-neutral-950">{review.name}</p><div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-neutral-500"><span className="inline-flex items-center gap-0.5 font-medium text-emerald-600"><BadgeCheck className="size-3" aria-hidden="true" />Verified Customer</span><span className="text-[#d7c8b8]">•</span><span>{review.date}</span></div></div></figcaption></figure>;
}

function MarqueeRow({ rowReviews, reverse = false }: { rowReviews: CustomerReview[]; reverse?: boolean }) {
  const animationStyle = { animationDuration: '40s', animationDirection: reverse ? 'reverse' : 'normal' } as CSSProperties;
  return <div className="group overflow-hidden py-2"><div className="perkly-review-marquee flex w-max gap-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none" style={animationStyle}>{[...rowReviews, ...rowReviews].map((review, index) => <ReviewCard key={`${review.name}-${index}`} review={review} />)}</div></div>;
}

export function CustomerReviewsMarquee() {
  const midpoint = Math.ceil(reviews.length / 2);
  return <section className="mt-6 overflow-hidden" aria-labelledby="customer-reviews-heading"><div className="px-1 text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a7a52]">Guest notes</p><h2 id="customer-reviews-heading" className="mt-2 font-display text-2xl leading-8 text-neutral-950">Loved by our community</h2><p className="mt-2 text-sm font-medium text-[#5c4033]">⭐ 4.8 • 127 Reviews</p><p className="mt-1 text-[12px] leading-4 text-neutral-500">Real experiences from our visitors</p></div><div className="relative mt-5 -mx-6"><MarqueeRow rowReviews={reviews.slice(0, midpoint)} reverse /><MarqueeRow rowReviews={reviews.slice(midpoint)} /><div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#f7f1e8] to-transparent" /><div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#f7f1e8] to-transparent" /></div><style>{`@keyframes perkly-review-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } } .perkly-review-marquee { animation-name: perkly-review-marquee; animation-timing-function: linear; animation-iteration-count: infinite; }`}</style></section>;
}
