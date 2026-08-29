//this is RewardRedemptionSheet.tsx, a component that displays a reward redemption sheet with QR code and countdown timer for expiration. It handles different states of the reward redemption process, including pending, completed, rejected, and expired. The component also provides a button to redeem the reward again if it has expired.

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { CheckCircle2, Clock3, Gift, X } from 'lucide-react';
import { Redemption, Reward } from '@/types';

function requirementsText(reward: Reward) {
  if (reward.type !== 'buy_x_get_y') return null;
  const { buyQuantity, buyItemName, getQuantity, getItemName } = reward;
  if (!buyQuantity && !buyItemName && !getQuantity && !getItemName) return null;
  return `Buy ${buyQuantity || ''} ${buyItemName || ''} · Get ${getQuantity || ''} ${getItemName || ''}`.replace(/\s+/g, ' ').trim();
}

function Countdown({ expiresAt, onExpired }: { expiresAt?: { toMillis?: () => number }; onExpired: () => void }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const remaining = Math.max(0, (expiresAt?.toMillis?.() || 0) - now);
  useEffect(() => { if (expiresAt?.toMillis?.() && remaining === 0) onExpired(); }, [expiresAt, onExpired, remaining]);
  return <>{String(Math.floor(remaining / 60000)).padStart(2, '0')}:{String(Math.floor(remaining / 1000) % 60).padStart(2, '0')}</>;
}

interface Props {
  reward: Reward | null;
  cafeName?: string;
  redemption: Redemption | null;
  creating: boolean;
  error: string | null;
  onClose: () => void;
  onRedeem: (reward: Reward) => void;
}

export function RewardRedemptionSheet({ reward, cafeName, redemption, creating, error, onClose, onRedeem }: Props) {
  const [locallyExpired, setLocallyExpired] = useState(false);
  useEffect(() => setLocallyExpired(false), [redemption?.id]);
  if (!reward) return null;
  const isExpired = redemption?.status === 'expired' || locallyExpired;
  const qrValue = redemption ? JSON.stringify({ type: 'redemption', redemptionId: redemption.id, code: redemption.redemptionCode }) : '';
  const promotion = requirementsText(reward);
  const isPointsReward = reward.pointsRequired > 0;
  const status = redemption?.status;

  return <div className="fixed inset-0 z-[60] flex items-end bg-black/40" role="dialog" aria-modal="true" aria-label="Reward redemption">
    <div className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[2rem] bg-canvas shadow-2xl">
      <div className="shrink-0 px-5 pt-5">
      <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[var(--color-border)]" />
      <div className="flex items-start justify-between"><div><p className="eyebrow">{status ? 'Your digital voucher' : 'Reward details'}</p><h2 className="type-page-title mt-1">{status === 'completed' ? 'Redeemed Successfully' : status === 'rejected' ? 'Redemption Unavailable' : isExpired ? 'Redemption Expired' : status ? 'Reward Ready!' : reward.title}</h2></div><button className="icon-button size-9" onClick={onClose} aria-label="Close"><X className="size-4" /></button></div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
      {!status && reward.imageUrl && <img src={reward.imageUrl} alt={reward.title} className="mt-5 h-40 w-full rounded-2xl object-cover" />}
      {!status && <div className="mt-5 space-y-3"><p className="type-body text-muted">{reward.description}</p><p className="type-small text-[var(--color-primary-dark)]">{cafeName}</p>{isPointsReward && <p className="type-body font-semibold">{reward.pointsRequired} Points</p>}{promotion && <div className="rounded-2xl bg-[var(--color-surface-subtle)] p-3 text-sm text-[var(--color-primary-dark)]">{promotion}</div>}{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}</div>}
      {redemption && <div className="mt-5 text-center"><h3 className="type-section-title">{redemption.rewardTitle}</h3><p className="mt-1 text-sm text-muted">{cafeName}</p>{redemption.pointsRequired > 0 && <p className="mt-2 text-sm font-semibold">{redemption.pointsRequired} points {status === 'completed' ? 'used' : ''}</p>}{status === 'pending' && !isExpired && <><div className="mx-auto mt-5 w-fit rounded-2xl bg-white p-4"><QRCode value={qrValue} size={180} /></div><p className="mt-4 text-sm text-muted">Show this QR code to cafe staff</p><div className="mt-4 rounded-2xl bg-[var(--color-surface-subtle)] p-4"><span className="eyebrow">Code</span><p className="mt-1 text-3xl font-bold tracking-[.22em]">{redemption.redemptionCode}</p></div><div className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--color-primary-dark)]"><Clock3 className="size-4" />Expires in: <Countdown expiresAt={redemption.expiresAt} onExpired={() => setLocallyExpired(true)} /></div><p className="mt-3 text-xs text-muted">READY TO USE — this reward has not been permanently redeemed yet.</p></>}{status === 'completed' && <CheckCircle2 className="mx-auto mt-5 size-14 text-green-600" />}{(isExpired || status === 'rejected') && <Gift className="mx-auto mt-5 size-14 text-[var(--color-text-muted)]" />}</div>}
      </div>
      {(!status || isExpired) && <div className="shrink-0 border-t border-line bg-canvas px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4"><button onClick={() => onRedeem(reward)} disabled={creating} className="primary-button w-full disabled:opacity-50">{creating ? 'Creating voucher…' : isExpired ? 'Redeem Again' : isPointsReward ? 'Redeem Now' : 'Claim Offer'}</button><p className="mt-2 text-center text-xs text-muted">{isExpired ? 'Your previous voucher expired. No points were used.' : 'Points are only used after cafe staff verifies this reward.'}</p></div>}
    </div>
  </div>;
}
