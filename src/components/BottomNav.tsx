import { Home, Gift, User, MapPin, Coffee } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTenant } from '@/context/TenantContext';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cafe } = useTenant();

  const cafeId = cafe?.id || 'perkly'; // ✅ Fallback value

  const navItems = [
    { icon: Home, label: 'Home', path: '' },
    { icon: Gift, label: 'Rewards', path: 'rewards' },
    { type: 'spacer' as const }, // Space for center button
    { icon: MapPin, label: 'Cafés', path: 'locations' },
    { icon: User, label: 'Profile', path: 'profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5">
      <div className="relative max-w-md mx-auto">
        {/* Floating Center Button */}
        <div className="left-1/2 z-10 -translate-x-1/2 absolute -top-7">
          <button 
            onClick={() => navigate(`/${cafeId}/scan`)}
            className="size-16 bg-[linear-gradient(140deg,#9d5126,#d77b39)] ring-4 ring-[#FDF8F3] shadow-[0_10px_24px_-6px_rgba(125,67,28,.6)] rounded-full flex justify-center items-center active:scale-95 transition-transform"
          >
            <Coffee className="size-7 stroke-[1.5] text-white" />
          </button>
        </div>

        {/* Navigation Bar */}
        <div className="shadow-[0_-6px_24px_-10px_rgba(80,50,20,0.2)] rounded-[24px] bg-white/95 backdrop-blur-xl border border-neutral-200 flex mb-4 px-5 pt-3 pb-4 justify-between items-end">
          {navItems.map((item, i) => {
            if (item.type === 'spacer') {
              return <div key={`spacer-${i}`} className="w-14" />;
            }

            const isActive = item.path === '' 
              ? location.pathname === `/${cafeId}` || location.pathname === `/${cafeId}/`
              : location.pathname.endsWith(item.path);
            const Icon = item.icon!;

            return (
              <NavLink
                key={item.path}
                to={`/${cafeId}/${item.path}`}
                className={({ isActive: navIsActive }) => 
                  `flex flex-col items-center gap-1 w-12 active:scale-95 transition-transform`
                }
              >
                <Icon 
                  className={cn(
                    "size-5 stroke-[1.5] transition-colors",
                    isActive ? "text-[#9d5126] fill-[#9d5126]/20" : "text-neutral-400"
                  )} 
                />
                <span className={cn(
                  "text-[10px] transition-colors",
                  isActive ? "text-[#9d5126] font-semibold" : "text-neutral-400"
                )}>
                  {item.label}
                </span>
                <span className={cn(
                  "rounded-full w-5 h-1 transition-all",
                  isActive ? "bg-[#9d5126] shadow-[0_0_10px_2px_rgba(184,104,49,.3)]" : "bg-transparent"
                )} />
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}