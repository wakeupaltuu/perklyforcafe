import { logoutFirebase } from '@/lib/firebase';
import { Settings, LogOut, Clock, Star, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useTenant } from '@/context/TenantContext';

export function Profile() {
  const { user, profile } = useTenant();

  const handleLogout = async () => {
    await logoutFirebase();
  };

  const points = profile?.points || 0;
  const totalVisitsAllTime = profile?.visits || 0;
  const history = profile?.visitsHistory || [];

  return (
    <div className="min-h-screen pb-32 bg-[var(--color-background)]">
      <header className="px-6 pt-12 pb-6 flex justify-between items-center bg-[var(--color-background)]">
        <h1 className="type-page-title text-[var(--color-text)]">Profile</h1>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[var(--color-primary-dark)] shadow-sm border border-[var(--color-border)] active:scale-95 transition-transform">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      <main className="px-6">
        {/* User Info Card */}
        <div className="bg-white rounded-[32px] p-6 mb-6 shadow-sm border border-[var(--color-border)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-[var(--color-primary-light)] rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xl overflow-hidden shrink-0">
              <div className="w-full h-full bg-[var(--color-primary)] flex items-center justify-center">
                {profile?.name ? profile.name.substring(0,2).toUpperCase() : 'ET'}
              </div>
            </div>
            <div>
              <p className="type-eyebrow text-[var(--color-text-muted)] tracking-[.13em] mb-1">Member Since '24</p>
              <h2 className="type-section-title text-[var(--color-text)] text-[24px]">{profile?.name || user?.displayName}</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--color-surface-subtle)] p-4 rounded-2xl border border-[var(--color-border)]/50">
              <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Star className="w-3 h-3" /> Points
              </p>
              <p className="type-display-lg text-[var(--color-text)] text-[30px]">{points}</p>
            </div>
            <div className="bg-[var(--color-primary-dark)] text-white p-4 rounded-2xl shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5 relative z-10">
                <Clock className="w-3 h-3" /> Visits
              </p>
              <p className="type-display-lg text-[30px] relative z-10">{totalVisitsAllTime}</p>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="mb-6">
          <h3 className="font-bold text-[var(--color-text)] mb-4 ml-2">
            Recent Visits
          </h3>
          
          <div className="space-y-3">
            {history.length > 0 ? (
              [...history].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((visit) => (
                <div key={visit.id} className="bg-white p-4 rounded-2xl shadow-sm border border-[var(--color-border)] flex items-center gap-4">
                  <div className="w-10 h-10 bg-[var(--color-surface-subtle)] rounded-full flex items-center justify-center text-[var(--color-primary-dark)] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[var(--color-text)] text-sm">{visit.location}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{format(new Date(visit.date), 'MMM d, yyyy • h:mm a')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-accent">+{visit.pointsEarned}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase">Pts</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[var(--color-text-muted)] text-center py-6 text-sm bg-white rounded-[32px] border border-[var(--color-border)] border-dashed">No visits yet. Time for a coffee!</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div>
          <button 
            onClick={handleLogout}
            className="w-full bg-white border border-[var(--color-border)] text-[var(--color-text)] rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-surface-subtle)] transition-colors shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
