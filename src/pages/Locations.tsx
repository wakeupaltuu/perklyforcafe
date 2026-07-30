import {
  ArrowRight,
  Coffee,
  MapPin,
  Navigation,
  Phone,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ProfileButton } from '@/components/ProfileButton';

export function Locations() {
  return (
    <div className="min-h-screen bg-[#f7f1e8] flex px-6 pt-12 pb-28 flex-col overflow-x-hidden">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2">
          <div className="uppercase text-neutral-500 text-xs leading-4 tracking-[4.48px] flex items-center gap-2">
            <MapPin className="size-3.5 text-[#c68642]" />
            <span>Perkly Cafe</span>
          </div>
          <div className="text-neutral-500 text-sm leading-5">
            123 Main Street, Downtown
          </div>
        </div>
        <div className="flex items-center gap-2">
        <div className="shadow-sm rounded-full bg-white border-neutral-200 border border-solid px-3 py-2">
          <div className="text-neutral-950 text-sm leading-5 flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>Open Now • Closes 10:00 PM</span>
          </div>
        </div>
        <ProfileButton />
        </div>
      </div>
      
      <div className="flex mt-4 justify-between items-center">
        <div className="text-neutral-950 text-sm leading-5 flex items-center gap-2">
          <Star className="size-4 fill-[#c68642] text-[#c68642]" />
          <span className="font-medium">4.8</span>
          <span className="text-neutral-500">(127 reviews)</span>
        </div>
        <div className="font-medium rounded-full bg-[#f0e2d2] text-[#7a4f2a] text-xs leading-4 px-3 py-1">
          Coffee House
        </div>
      </div>

      {/* Action Buttons */}
      <div className="shadow-[0_18px_40px_rgba(74,49,35,0.08)] rounded-3xl bg-white border border-neutral-100 mt-6 p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-semibold text-neutral-950 text-lg leading-7">
              Visit Perkly Cafe
            </div>
            <div className="text-neutral-500 text-sm leading-5 mt-1">
              Everything you need before you arrive
            </div>
          </div>
          <div className="font-medium rounded-full bg-[#f7ede2] text-[#8a5a34] text-xs leading-4 px-3 py-1 shrink-0">
            Today
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <button className="shadow-none rounded-2xl bg-[#fbf7f2] text-[#5c4033] border-neutral-200 border border-solid px-3 py-4 flex flex-col items-center gap-2 h-auto active:scale-95 transition-transform">
            <Navigation className="size-5" />
            <span className="font-medium text-xs leading-4 whitespace-nowrap text-center">
              Get Directions
            </span>
          </button>
          <button className="shadow-none rounded-2xl bg-[#fbf7f2] text-[#5c4033] border-neutral-200 border border-solid px-3 py-4 flex flex-col items-center gap-2 h-auto active:scale-95 transition-transform">
            <Star className="size-5" />
            <span className="font-medium text-xs leading-4 whitespace-nowrap text-center">
              Rate Us
            </span>
          </button>
          <button className="shadow-none rounded-2xl bg-[#fbf7f2] text-[#5c4033] border-neutral-200 border border-solid px-3 py-4 flex flex-col items-center gap-2 h-auto active:scale-95 transition-transform">
            <Phone className="size-5" />
            <span className="font-medium text-xs leading-4 whitespace-nowrap text-center">
              Call Now
            </span>
          </button>
        </div>
      </div>

      {/* Details Box */}
      <div className="shadow-[0_18px_40px_rgba(74,49,35,0.18)] rounded-3xl bg-[#4a3123] text-[#f7f1e8] mt-6 p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="uppercase text-[#d9c2ad] text-xs leading-4 tracking-[4.48px]">
              Cafe details
            </div>
            <div className="leading-tight font-semibold text-2xl">
              Warm coffee, cozy seating, and fresh pastries
            </div>
          </div>
          <div className="rounded-full bg-white/10 p-3 shrink-0">
            <Coffee className="size-5 text-[#f0c38a]" />
          </div>
        </div>
        <div className="grid grid-cols-2 text-[#f0e2d2] text-sm leading-5 mt-5 gap-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <div className="uppercase text-[#d9c2ad] text-xs leading-4 tracking-[3.2px]">
              Address
            </div>
            <div className="leading-relaxed mt-2">
              123 Main Street, Downtown
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <div className="uppercase text-[#d9c2ad] text-xs leading-4 tracking-[3.2px]">
              Hours
            </div>
            <div className="leading-relaxed mt-2">
              Open daily until 10:00 PM
            </div>
          </div>
        </div>
      </div>

      {/* Popular Items */}
      <div className="space-y-4 mt-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-semibold text-neutral-950 text-xl leading-7">
              Popular at Perkly
            </div>
            <div className="text-neutral-500 text-sm leading-5">
              Guest favorites and signature pours
            </div>
          </div>
          <div className="font-medium rounded-full bg-[#f0e2d2] text-[#7a4f2a] text-xs leading-4 px-3 py-1 shrink-0">
            Near you
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="shadow-[0_14px_30px_rgba(74,49,35,0.08)] rounded-3xl bg-white border border-neutral-100 flex flex-col overflow-hidden">
            <div className="h-36 overflow-hidden relative">
              <img
                alt="Cafe interior"
                className="object-cover w-full h-full absolute inset-0"
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
              />
            </div>
            <div className="p-4 flex flex-col gap-1">
              <div className="font-semibold text-neutral-950 text-base leading-6">
                Classic Cappuccino
              </div>
              <div className="text-neutral-500 text-sm leading-5">
                Velvety foam, rich espresso
              </div>
            </div>
          </div>
          <div className="shadow-[0_14px_30px_rgba(74,49,35,0.08)] rounded-3xl bg-white border border-neutral-100 flex flex-col overflow-hidden">
            <div className="h-36 overflow-hidden relative">
              <img
                alt="Caramel coffee"
                className="object-cover w-full h-full absolute inset-0"
                src="https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
              />
            </div>
            <div className="p-4 flex flex-col gap-1">
              <div className="font-semibold text-neutral-950 text-base leading-6">
                Caramel Cloud
              </div>
              <div className="text-neutral-500 text-sm leading-5">
                Iced, silky caramel swirl
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="shadow-[0_14px_30px_rgba(74,49,35,0.06)] rounded-3xl bg-white border-neutral-200 border border-solid mt-6 p-5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform">
        <div>
          <div className="font-semibold text-neutral-950 text-lg leading-7">
            Need help finding us?
          </div>
          <div className="text-neutral-500 text-sm leading-5">
            Tap directions or call the café directly
          </div>
        </div>
        <ArrowRight className="size-5 text-neutral-500" />
      </div>

      <Link
        to="/menu"
        className="mt-5 rounded-2xl bg-[#9d5126] px-5 py-4 text-center font-semibold text-white shadow-[0_12px_24px_rgba(125,67,28,.22)] transition-transform active:scale-[0.98]"
      >
        View Full Menu
      </Link>
    </div>
  );
}
