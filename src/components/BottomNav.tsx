import { Home, Gift, MapPin, UtensilsCrossed, Coffee } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems: Array<{ icon: LucideIcon; label: string; path: string }> = [
    { icon: Home, label: 'Home', path: '' },
    { icon: Gift, label: 'Rewards', path: 'rewards' },
    { icon: MapPin, label: 'Cafes', path: 'locations' },
    { icon: UtensilsCrossed, label: 'Menu', path: 'menu' },
  ];
  return <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5"><div className="relative mx-auto max-w-md"><button onClick={() => navigate('/scan')} aria-label="Scan to check in" className="absolute -top-7 left-1/2 z-10 flex size-16 -translate-x-1/2 items-center justify-center rounded-full bg-[linear-gradient(140deg,#9d5126,#d77b39)] text-white ring-4 ring-[#FDF8F3] shadow-[0_10px_24px_-6px_rgba(125,67,28,.6)] transition-transform active:scale-95"><Coffee className="size-7 stroke-[1.5]" /></button><nav className="grid grid-cols-[repeat(2,minmax(0,1fr))_4rem_repeat(2,minmax(0,1fr))] items-end rounded-[24px] border border-neutral-200 bg-white/95 px-3 pb-4 pt-3 shadow-[0_-6px_24px_-10px_rgba(80,50,20,0.2)] backdrop-blur-xl">{navItems.map((item, index) => {
    const isActive = item.path === '' ? location.pathname === '/' : location.pathname === `/${item.path}` || location.pathname.startsWith(`/${item.path}/`);
    const Icon = item.icon;
    return <NavLink key={item.path} to={item.path ? `/${item.path}` : '/'} className={cn('flex min-w-0 flex-col items-center gap-1 transition-transform active:scale-95', index === 2 && 'col-start-4')}><Icon className={cn('size-5 stroke-[1.5] transition-colors', isActive ? 'fill-[#9d5126]/20 text-[#9d5126]' : 'text-neutral-400')} /><span className={cn('text-[10px] transition-colors', isActive ? 'font-semibold text-[#9d5126]' : 'text-neutral-400')}>{item.label}</span><span className={cn('h-1 w-5 rounded-full transition-all', isActive ? 'bg-[#9d5126] shadow-[0_0_10px_2px_rgba(184,104,49,.3)]' : 'bg-transparent')} /></NavLink>;
  })}</nav></div></div>;
}
