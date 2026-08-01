import {
  ArrowRight,
  BadgePercent,
  Clock,
  Coffee,
  CreditCard,
  Heart,
  MapPin,
  Navigation,
  PawPrint,
  Phone,
  Quote,
  Share2,
  Star,
  Trees,
  Wifi,
  Zap,
} from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';
import { optimizeImageUrl } from '@/lib/utils';
import { CustomerReviewsMarquee } from '@/components/ui/CustomerReviewsMarquee';

// TODO: replace with real Firestore fields once the cafe-details schema
// is finalized (address, hours, amenities, founder, gallery, etc.)
const PLACEHOLDER = {
  rating: 4.8,
  reviewCount: 127,
  isOpen: true,
  closesAt: '10:00 PM',
  address: '123 Main Street, Downtown',
  storyTitle: 'A place to slow down and feel at home.',
  storyBody:
    "Warm coffee, cozy seating, and good vibes. Whether you're working, reading, or catching up with friends, you'll love it here.",
  hours: [
    { day: 'Monday - Friday', time: '8:00 AM - 10:00 PM' },
    { day: 'Saturday', time: '8:00 AM - 11:00 PM' },
    { day: 'Sunday', time: '8:00 AM - 10:00 PM' },
  ],
  amenities: [
    { icon: Wifi, label: 'Free Wi-Fi' },
    { icon: Zap, label: 'Power Outlets' },
    { icon: Trees, label: 'Outdoor Seating' },
    { icon: PawPrint, label: 'Pet Friendly' },
    { icon: CreditCard, label: 'Cards Accepted' },
  ],
  founderFullName: 'Ananya Sharma',
  founderQuote:
    "I started this cafe with a dream to build a space where everyone feels at home — whether you're here for a quick coffee, a long chat, or some quiet time with your thoughts.",
  founderPhotoUrl:
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
};

export function Locations() {
  const { cafe, loading } = useTenant();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f1e8] flex items-center justify-center">
        <span className="text-neutral-400 text-sm">Loading...</span>
      </div>
    );
  }

  const cafeName = cafe?.cafeName || 'Our Cafe';
  const heroImage = optimizeImageUrl(
    cafe?.heroImageUrl ||
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    800
  );
  const logoUrl = cafe?.logoUrl;

  return (
    <div className="min-h-screen bg-[#f7f1e8] pb-28 overflow-x-hidden">
      {/* Hero photo */}
      <div className="relative h-52 w-full overflow-hidden">
        <img
          alt={cafeName}
          className="object-cover w-full h-full"
          src={heroImage}
          loading="eager"
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(20,12,8,.55),rgba(20,12,8,0)_45%)]" />

        {/* Top nav row */}
        <div className="absolute top-0 inset-x-0 flex justify-between items-center p-4">
          <button
            onClick={() => navigate(-1)}
            className="size-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="size-4 text-neutral-800" />
          </button>
          <div className="flex items-center gap-2">
            <button className="size-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center active:scale-95 transition-transform">
              <Heart className="size-4 text-neutral-800" />
            </button>
            <button className="size-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center active:scale-95 transition-transform">
              <Share2 className="size-4 text-neutral-800" />
            </button>
          </div>
        </div>

        {/* Logo badge — now sits inside the hero, top-left, no overlap with content below */}
        <div className="absolute bottom-4 left-4 size-14 rounded-2xl bg-white shadow-[0_8px_20px_rgba(0,0,0,0.25)] p-1.5">
          {logoUrl ? (
            <img
              alt={`${cafeName} logo`}
              className="w-full h-full object-cover rounded-xl"
              src={logoUrl}
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-[#4a3123] flex items-center justify-center">
              <Coffee className="size-6 text-[#f0c38a]" />
            </div>
          )}
        </div>
      </div>

      <div className="px-6">
        {/* Name / category / address */}
        <div className="pt-5 space-y-1.5">
          <h1 className="font-semibold text-neutral-950 text-xl leading-7">
            {cafeName}
          </h1>
          <div className="text-neutral-500 text-sm leading-5 flex items-center gap-1.5">
            <MapPin className="size-3.5 text-[#c68642]" />
            <span>{PLACEHOLDER.address}</span>
          </div>
        </div>

        {/* Rating + open status */}
        <div className="flex justify-between items-center mt-3 gap-3">
          <div className="text-neutral-950 text-sm leading-5 flex items-center gap-1.5">
            <Star className="size-4 fill-[#c68642] text-[#c68642]" />
            <span className="font-medium">{PLACEHOLDER.rating}</span>
            <span className="text-neutral-500">
              ({PLACEHOLDER.reviewCount} reviews)
            </span>
          </div>
          <div className="shadow-sm rounded-full bg-white border border-neutral-200 px-3 py-1.5 shrink-0">
            <div className="text-neutral-950 text-xs leading-4 flex items-center gap-1.5 whitespace-nowrap">
              <span
                className={`size-2 rounded-full ${
                  PLACEHOLDER.isOpen ? 'bg-emerald-500' : 'bg-neutral-300'
                }`}
              />
              <span>
                {PLACEHOLDER.isOpen ? 'Open Now' : 'Closed'} • Closes{' '}
                {PLACEHOLDER.closesAt}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="shadow-[0_18px_40px_rgba(74,49,35,0.08)] rounded-3xl bg-white border border-neutral-100 mt-5 p-4 grid grid-cols-4 gap-2">
          <button className="rounded-2xl bg-[#fbf7f2] text-[#5c4033] px-2 py-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
            <Navigation className="size-5" />
            <span className="font-medium text-[11px] leading-3.5 text-center">
              Directions
            </span>
          </button>
          <button className="rounded-2xl bg-[#fbf7f2] text-[#5c4033] px-2 py-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
            <Phone className="size-5" />
            <span className="font-medium text-[11px] leading-3.5 text-center">
              Call Now
            </span>
          </button>
          <button className="rounded-2xl bg-[#fbf7f2] text-[#5c4033] px-2 py-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
            <Star className="size-5" />
            <span className="font-medium text-[11px] leading-3.5 text-center">
              Rate Us
            </span>
          </button>
          <button className="rounded-2xl bg-[#fbf7f2] text-[#5c4033] px-2 py-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
            <BadgePercent className="size-5" />
            <span className="font-medium text-[11px] leading-3.5 text-center">
              Today's Offer
            </span>
          </button>
        </div>

        {/* Story section — centered, serif, editorial feel */}
        <div className="mt-8 space-y-3 text-center">
          <h2 className="font-serif italic text-2xl leading-8 text-neutral-950">
            {PLACEHOLDER.storyTitle}
          </h2>
          <p className="font-serif text-[15px] leading-7 text-neutral-500 max-w-[320px] mx-auto">
            {PLACEHOLDER.storyBody}
          </p>
          <CustomerReviewsMarquee />
        </div>

        {/* Hours + Find us */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="rounded-3xl bg-white border border-neutral-100 shadow-[0_14px_30px_rgba(74,49,35,0.06)] p-4">
            <div className="flex items-center gap-2 text-neutral-950 font-semibold text-sm">
              <Clock className="size-4 text-[#c68642]" />
              <span>Opening Hours</span>
            </div>
            <div className="mt-3 space-y-2">
              {PLACEHOLDER.hours.map((h) => (
                <div key={h.day} className="text-xs leading-4">
                  <div className="text-neutral-950 font-medium">{h.day}</div>
                  <div className="text-neutral-500">{h.time}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Open Now
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-neutral-100 shadow-[0_14px_30px_rgba(74,49,35,0.06)] p-4 flex flex-col">
            <div className="flex items-center gap-2 text-neutral-950 font-semibold text-sm">
              <MapPin className="size-4 text-[#c68642]" />
              <span>Find Us</span>
            </div>
            <div className="mt-3 h-20 rounded-xl bg-[#ece3d6] flex items-center justify-center">
              <MapPin className="size-6 text-[#9d5126]" />
            </div>
            <div className="text-xs text-neutral-500 mt-3 leading-4">
              {PLACEHOLDER.address}
            </div>
            <button className="mt-3 rounded-full bg-[#f7ede2] text-[#8a5a34] text-xs font-medium py-2 flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
              <Navigation className="size-3.5" />
              Get Directions
            </button>
          </div>
        </div>

        {/* Amenities */}
        <div className="rounded-3xl bg-white border border-neutral-100 shadow-[0_14px_30px_rgba(74,49,35,0.06)] mt-6 p-4">
          <div className="grid grid-cols-5 gap-2">
            {PLACEHOLDER.amenities.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                <Icon className="size-4 text-[#7a4f2a]" />
                <span className="text-[10px] leading-3 text-neutral-500">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Meet the Founder — bigger photo, serif pull-quote style */}
        <div className="rounded-3xl bg-[#f3e9dc] border border-[#e9d9c4] mt-6 p-6 flex flex-col items-center text-center gap-4">
          <div className="uppercase text-[#9a7a52] text-[10px] tracking-[3px] font-medium">
            Meet the Founder
          </div>

          <div className="size-24 rounded-full overflow-hidden border-4 border-white shadow-[0_8px_20px_rgba(74,49,35,0.15)]">
            <img
              alt={PLACEHOLDER.founderFullName}
              className="w-full h-full object-cover"
              src={PLACEHOLDER.founderPhotoUrl}
            />
          </div>

          <div className="space-y-3 max-w-[320px]">
            <Quote className="size-5 text-[#c68642] mx-auto" />
            <p className="font-serif italic text-[17px] leading-7 text-neutral-800">
              {PLACEHOLDER.founderQuote}
            </p>
            <div className="pt-1">
              <div className="font-semibold text-sm text-neutral-950">
                {PLACEHOLDER.founderFullName}
              </div>
              <div className="text-xs text-[#9d5126]">Founder, {cafeName}</div>
            </div>
            <button className="text-[#9d5126] text-xs font-semibold flex items-center gap-1 justify-center active:scale-95 transition-transform pt-1">
              Read My Story
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        <Link
          to="/menu"
          className="mt-6 rounded-2xl bg-[#9d5126] px-5 py-4 text-center font-semibold text-white shadow-[0_12px_24px_rgba(125,67,28,.22)] transition-transform active:scale-[0.98] flex items-center justify-center"
        >
          View Full Menu
        </Link>
      </div>
    </div>
  );
}
