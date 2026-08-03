import { ArrowRight, BadgePercent, Clock, Coffee, Heart, Instagram, MapPin, Navigation, Phone, Quote, Share2, Star } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';
import { optimizeImageUrl } from '@/lib/utils';
import { CustomerReviewsMarquee } from '@/components/ui/CustomerReviewsMarquee';
import { CafeGalleryMarquee } from '@/components/ui/CafeGalleryMarquee';

const weekdays = [
  ['monday', 'Monday'], ['tuesday', 'Tuesday'], ['wednesday', 'Wednesday'], ['thursday', 'Thursday'],
  ['friday', 'Friday'], ['saturday', 'Saturday'], ['sunday', 'Sunday'],
] as const;

const openExternal = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

export function Locations() {
  const { cafe, cafeDetails, loading } = useTenant();
  const navigate = useNavigate();

  if (loading || !cafeDetails) {
    return <div className="min-h-screen bg-[#f7f1e8] flex items-center justify-center"><span className="text-neutral-400 text-sm">Loading...</span></div>;
  }

  const { contact, founder, hours, location, offer, rating, story } = cafeDetails;
  const cafeName = cafe?.cafeName || 'Our Cafe';
  const heroImage = optimizeImageUrl(cafe?.heroImageUrl || 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', 800);
  const logoUrl = cafe?.logoUrl;
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()).toLowerCase();
  const reviews = [...(cafeDetails.customerReviews || [])].sort((a, b) => a.displayOrder - b.displayOrder);
  const hasFounder = Boolean(founder?.name || founder?.role || founder?.story || founder?.imageUrl);
  const quickActionCount = [location?.googleMapsUrl, contact?.phone, cafeDetails.links?.instagram, cafeDetails.links?.googleReviews, offer?.title].filter(Boolean).length;
  const quickActionColumns = quickActionCount === 3 ? 'grid-cols-3' : quickActionCount === 2 ? 'grid-cols-2' : quickActionCount === 1 ? 'grid-cols-1' : 'grid-cols-4';

  return <div className="min-h-screen bg-[#f7f1e8] pb-28 overflow-x-hidden">
    <div className="relative h-52 w-full overflow-hidden">
      <img alt={cafeName} className="object-cover w-full h-full" src={heroImage} loading="eager" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(20,12,8,.55),rgba(20,12,8,0)_45%)]" />
      <div className="absolute top-0 inset-x-0 flex justify-between items-center p-4">
        <button onClick={() => navigate(-1)} className="size-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center active:scale-95 transition-transform"><ArrowLeft className="size-4 text-neutral-800" /></button>
        <div className="flex items-center gap-2"><button className="size-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center active:scale-95 transition-transform"><Heart className="size-4 text-neutral-800" /></button><button className="size-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center active:scale-95 transition-transform"><Share2 className="size-4 text-neutral-800" /></button></div>
      </div>
      <div className="absolute bottom-4 left-4 size-14 rounded-2xl bg-white shadow-[0_8px_20px_rgba(0,0,0,0.25)] p-1.5">
        {logoUrl ? <img alt={`${cafeName} logo`} className="w-full h-full object-cover rounded-xl" src={logoUrl} /> : <div className="w-full h-full rounded-xl bg-[#4a3123] flex items-center justify-center"><Coffee className="size-6 text-[#f0c38a]" /></div>}
      </div>
    </div>

    <div className="px-6">
      <div className="pt-5 space-y-1.5"><h1 className="font-semibold text-neutral-950 text-xl leading-7">{cafeName}</h1>{contact?.address && <div className="text-neutral-500 text-sm leading-5 flex items-center gap-1.5"><MapPin className="size-3.5 text-[#c68642]" /><span>{contact.address}</span></div>}</div>
      {(rating?.value !== undefined || rating?.reviewCount !== undefined) && <div className="flex justify-between items-center mt-3 gap-3"><div className="text-neutral-950 text-sm leading-5 flex items-center gap-1.5"><Star className="size-4 fill-[#c68642] text-[#c68642]" /><span className="font-medium">{rating.value}</span><span className="text-neutral-500">({rating.reviewCount} reviews)</span></div>{hours?.[today as keyof typeof hours] && <div className="shadow-sm rounded-full bg-white border border-neutral-200 px-3 py-1.5 shrink-0"><div className="text-neutral-950 text-xs leading-4 flex items-center gap-1.5 whitespace-nowrap"><span className="size-2 rounded-full bg-emerald-500" /><span>Today • {hours[today as keyof typeof hours]}</span></div></div>}</div>}

      <div className={`shadow-[0_18px_40px_rgba(74,49,35,0.08)] rounded-3xl bg-white border border-neutral-100 mt-5 p-4 grid ${quickActionColumns} gap-2`}>
        {location?.googleMapsUrl && <button onClick={() => openExternal(location.googleMapsUrl)} className="rounded-2xl bg-[#fbf7f2] text-[#5c4033] px-2 py-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"><Navigation className="size-5" /><span className="font-medium text-[11px] leading-3.5 text-center">Directions</span></button>}
        {contact?.phone && <a href={`tel:${contact.phone}`} className="rounded-2xl bg-[#fbf7f2] text-[#5c4033] px-2 py-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"><Phone className="size-5" /><span className="font-medium text-[11px] leading-3.5 text-center">Call Now</span></a>}
        {cafeDetails.links?.instagram && <button onClick={() => openExternal(cafeDetails.links.instagram)} className="rounded-2xl bg-[#fbf7f2] text-[#5c4033] px-2 py-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"><Instagram className="size-5" /><span className="font-medium text-[11px] leading-3.5 text-center">Instagram</span></button>}
        {cafeDetails.links?.googleReviews && <button onClick={() => openExternal(cafeDetails.links.googleReviews)} className="rounded-2xl bg-[#fbf7f2] text-[#5c4033] px-2 py-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"><Star className="size-5" /><span className="font-medium text-[11px] leading-3.5 text-center">Rate Us</span></button>}
        {offer?.title && <button onClick={() => offer.buttonUrl && openExternal(offer.buttonUrl)} className="rounded-2xl bg-[#fbf7f2] text-[#5c4033] px-2 py-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"><BadgePercent className="size-5" /><span className="font-medium text-[11px] leading-3.5 text-center">{offer.buttonText || "Today's Offer"}</span></button>}
      </div>

      {(story?.title || story?.body) && <div className="mt-8 space-y-3 text-center">{story?.title && <h2 className="font-serif italic text-2xl leading-8 text-neutral-950">{story.title}</h2>}{story?.body && <p className="font-serif text-[15px] leading-7 text-neutral-500 max-w-[320px] mx-auto">{story.body}</p>}</div>}
      <CafeGalleryMarquee images={cafeDetails.galleryImages || []} />
      <CustomerReviewsMarquee reviews={reviews} rating={rating?.value} reviewCount={rating?.reviewCount} />

      <div className="grid grid-cols-2 gap-3 mt-6">
        {hours && <div className="rounded-3xl bg-white border border-neutral-100 shadow-[0_14px_30px_rgba(74,49,35,0.06)] p-4"><div className="flex items-center gap-2 text-neutral-950 font-semibold text-sm"><Clock className="size-4 text-[#c68642]" /><span>Opening Hours</span></div><div className="mt-3 space-y-2">{weekdays.map(([key, label]) => hours[key] && <div key={key} className={`text-xs leading-4 ${key === today ? 'text-[#9d5126]' : ''}`}><div className="font-medium">{label}</div><div className="text-neutral-500">{hours[key]}</div></div>)}</div></div>}
        {contact?.address && <div className="rounded-3xl bg-white border border-neutral-100 shadow-[0_14px_30px_rgba(74,49,35,0.06)] p-4 flex flex-col"><div className="flex items-center gap-2 text-neutral-950 font-semibold text-sm"><MapPin className="size-4 text-[#c68642]" /><span>Find Us</span></div><div className="mt-3 h-20 rounded-xl bg-[#ece3d6] flex items-center justify-center"><MapPin className="size-6 text-[#9d5126]" /></div><div className="text-xs text-neutral-500 mt-3 leading-4">{contact.address}</div>{location?.googleMapsUrl && <button onClick={() => openExternal(location.googleMapsUrl)} className="mt-3 rounded-full bg-[#f7ede2] text-[#8a5a34] text-xs font-medium py-2 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"><Navigation className="size-3.5" />Get Directions</button>}</div>}
      </div>

      {hasFounder && <div className="rounded-3xl bg-[#f3e9dc] border border-[#e9d9c4] mt-6 p-6 flex flex-col items-center text-center gap-4"><div className="uppercase text-[#9a7a52] text-[10px] tracking-[3px] font-medium">Meet the Founder</div>{founder.imageUrl && <div className="size-24 rounded-full overflow-hidden border-4 border-white shadow-[0_8px_20px_rgba(74,49,35,0.15)]"><img alt={founder.name} className="w-full h-full object-cover" src={founder.imageUrl} /></div>}<div className="space-y-3 max-w-[320px]">{founder.story && <><Quote className="size-5 text-[#c68642] mx-auto" /><p className="font-serif italic text-[17px] leading-7 text-neutral-800">{founder.story}</p></>}<div className="pt-1">{founder.name && <div className="font-semibold text-sm text-neutral-950">{founder.name}</div>}{founder.role && <div className="text-xs text-[#9d5126]">{founder.role}</div>}</div>{founder.story && <button className="text-[#9d5126] text-xs font-semibold flex items-center gap-1 justify-center active:scale-95 transition-transform pt-1">Read My Story<ArrowRight className="size-3.5" /></button>}</div></div>}
      <Link to="/menu" className="mt-6 rounded-2xl bg-[#9d5126] px-5 py-4 text-center font-semibold text-white shadow-[0_12px_24px_rgba(125,67,28,.22)] transition-transform active:scale-[0.98] flex items-center justify-center">View Full Menu</Link>
    </div>
  </div>;
}
