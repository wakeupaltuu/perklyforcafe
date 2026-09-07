import { UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';
import { cn } from '@/lib/utils';

export function ProfileButton({ iconOnly = false, className }: { iconOnly?: boolean; className?: string }) {
  const navigate = useNavigate();
  const { profile, user } = useTenant();
  const name = profile?.name || user?.displayName || '';
  const initial = name.trim().charAt(0).toUpperCase();
  return <button onClick={() => navigate('/profile')} aria-label="Open profile" className={cn("flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-primary-dark)] shadow-sm transition-transform active:scale-95", className)}>{iconOnly ? <UserRound className="size-5 stroke-[1.5]" /> : initial ? <span className="text-sm font-semibold">{initial}</span> : <UserRound className="size-5 stroke-[1.5]" />}</button>;
}
