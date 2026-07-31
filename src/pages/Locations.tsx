import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Clock,
  Coffee,
  CreditCard,
  Heart,
  Image as ImageIcon,
  MapPin,
  Navigation,
  PawPrint,
  Phone,
  Share2,
  Star,
  Trees,
  Wifi,
  Zap,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';
import { optimizeImageUrl } from '@/lib/utils';

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
  galleryImages: [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  ],
  photoCount: 12,
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
  founderName: 'Ananya',
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

        {/* Logo badge overlapping the photo's bottom edge */}
        <div className="absolute -bottom-7 left-6 size-16 rounded-2xl bg-white shadow-[0_10px_24px_rgba(74,49,35,0.25)] p-1.5">
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
        <div className="pt-10 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-semibold text-neutral-950 text-xl leading-7">
              {cafeName}
            </h1>
           
          </div>
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

        {/* Story section */}
        <div className="mt-6 space-y-3">
          <h2 className="font-semibold text-neutral-950 text-xl leading-7">
            {PLACEHOLDER.storyTitle}
          </h2>
          <p className="text-neutral-500 text-sm leading-5">
            {PLACEHOLDER.storyBody}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PLACEHOLDER.galleryImages.map((src, i) => (
              <div key={i} className="relative h-20 rounded-xl overflow-hidden">
                <img
                  alt={`${cafeName} photo ${i + 1}`}
                  className="object-cover w-full h-full"
                  src={optimizeImageUrl(src, 200)}
                  loading="lazy"
                />
                {i === PLACEHOLDER.galleryImages.length - 1 && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-0.5 text-white">
                    <ImageIcon className="size-4" />
                    <span className="text-[11px] font-medium">
                      {PLACEHOLDER.photoCount}+ Photos
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
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

        {/* Meet the Founder */}
        <div className="rounded-3xl bg-[#f3e9dc] border border-[#e9d9c4] mt-6 p-5 flex gap-4">
          <div className="size-16 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
            <img
              alt={PLACEHOLDER.founderName}
              className="w-full h-full object-cover"
              src={PLACEHOLDER.founderPhotoUrl}
            />
          </div>
          <div className="space-y-2">
            <div className="uppercase text-[#9a7a52] text-[10px] tracking-[2px] font-medium">
              Meet the Founder
            </div>
            <div className="font-semibold text-neutral-950 text-base leading-6">
              Hi, I'm {PLACEHOLDER.founderName}! 👋
            </div>
            <p className="text-neutral-600 text-xs leading-5">
              {PLACEHOLDER.founderQuote}
            </p>
            <button className="text-[#9d5126] text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform">
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