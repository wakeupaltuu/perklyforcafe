'use client'

import { ArrowRight } from 'lucide-react'

export function TodaysSpecialCard() {
  const imageUrl =
    'https://firebasestorage.googleapis.com/v0/b/perklycafe.firebasestorage.app/o/Gemini_Generated_Image_jy1n0njy1n0njy1n.png?alt=media&token=1bba3ace-2ebe-4e27-85de-ee9d4022ee69'

  return (
    <>
      {/* Card — the image fills the whole container, text sits on top of the right side */}
      <div
        className="relative rounded-2xl overflow-hidden w-full shadow-sm bg-[#EFE0CC]"
        style={{ aspectRatio: '800 / 444' }}
      >
        {/* Full-bleed background image */}
        <img
          src={imageUrl}
          alt="Caramel Cloud Latte"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Text overlay on the right empty area */}
        <div className="absolute inset-y-0 right-0 w-[50%] flex flex-col justify-center px-4 pr-6">
          <span className="text-[#C85A17] text-[9px] font-bold uppercase tracking-[0.15em]">
            Limited Time
          </span>
          <h3
            className="text-[#1C0F07] text-[16px] font-bold leading-tight mt-1"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Caramel Cloud Latte
          </h3>
          <p className="text-[#5C3D28] text-[11px] mt-1 leading-relaxed max-w-[90%]">
            Smooth caramel with a creamy twist.
          </p>

          <button
            className="mt-2 bg-white text-[#C85A17] text-[11px] font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1 w-fit shadow-sm hover:bg-[#fdf6ef] transition-colors"
            onClick={() => window.open('https://www.zomato.com', '_blank')}
          >
            View on Zomato
            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </>
  )
}
