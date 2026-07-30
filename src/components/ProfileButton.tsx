import { UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';

export function ProfileButton() {
  const navigate = useNavigate();
  const { profile, user } = useTenant();
  const name = profile?.name || user?.displayName || '';
  const initial = name.trim().charAt(0).toUpperCase();
  return <button onClick={() => navigate('/profile')} aria-label="Open profile" className="flex size-10 shrink-0 items-center justify-center rounded-full border border-coffee-200 bg-white text-coffee-700 shadow-sm transition-transform active:scale-95">{initial ? <span className="text-sm font-semibold">{initial}</span> : <UserRound className="size-5 stroke-[1.5]" />}</button>;
}
