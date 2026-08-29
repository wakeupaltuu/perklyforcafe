// this is TodaysSpecialCard.tsx stored in src/components/home folder

'use client'

import { ArrowRight } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'

export function TodaysSpecialCard() {
  const { cafe, loading } = useTenant()
  const homeContent = cafe?.homeContent

  if (loading) return null

  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()).toLowerCase()
  const special = homeContent?.todaysSpecial?.find(
    (banner) => banner.isActive && banner.days?.some((day) => day.toLowerCase() === today),
  )

  if (!special) return null

  return (
    <>
      {/* Card — the image fills the whole container, text sits on top of the right side */}
      <div
        className="relative rounded-2xl overflow-hidden w-full shadow-sm bg-[var(--color-surface)]"
        style={{ aspectRatio: '800 / 444' }}
      >
        {/* Full-bleed background image */}
        <img
          src={special.imageUrl}
          alt={special.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Text overlay on the right empty area */}
<div className="absolute inset-y-0 right-0 w-[50%] flex flex-col justify-center px-5 pr-7">
  <span className="text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-[0.22em]">
    {special.badge}
  </span>

  <h3
    className="text-[var(--color-text)] text-[19px] font-bold leading-[1.08] mt-2"
    style={{ fontFamily: 'Georgia, serif' }}
  >
    {special.title}
  </h3>

  <p className="text-[var(--color-text-muted)] text-[13px] leading-[1.55] mt-3 max-w-[88%]">
    {special.description}
  </p>

  <button
    className="mt-5 bg-white text-[var(--color-primary)] text-[12px] font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 w-fit shadow-md hover:bg-[var(--color-surface-subtle)] transition-colors"
    onClick={() => window.open(special.buttonUrl, '_blank')}
  >
    {special.buttonText}
    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
  </button>
</div>
      </div>
    </>
  )
}
