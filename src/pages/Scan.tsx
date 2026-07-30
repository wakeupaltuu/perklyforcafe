import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Camera, CheckCircle2, Coffee, QrCode, ShieldCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { Html5Qrcode } from 'html5-qrcode';
import { ProfileButton } from '@/components/ProfileButton';

export function Scan() {
  const { user, profile, cafe, cafeSlug } = useTenant();
  const navigate = useNavigate();
  const [checkingIn, setCheckingIn] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
          scannerRef.current.clear();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, []);

  const startScanner = async () => {
    if (!scannerContainerRef.current) {
      setScanError('Scanner not initialized. Please refresh.');
      return;
    }
    
    setScanning(true);
    setScanError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 280, height: 280 },
          aspectRatio: 1.0
        },
        onScanSuccess,
        onScanError
      );

      console.log('Scanner started');
    } catch (err: any) {
      console.error('Camera error:', err);
      setScanError('Unable to access camera. Please check permissions.');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        // Ignore
      }
    }
    setScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (e) {
        // Ignore
      }
    }
    setScanning(false);
    setCheckingIn(true);

    try {
      const data = JSON.parse(decodedText);
      
      if (data.type !== 'checkin') {
        throw new Error('Invalid QR code');
      }

      if (data.cafe !== cafeSlug) {
        throw new Error(`This QR is for ${data.cafe}`);
      }

      const today = new Date().toISOString().split('T')[0];
      if (profile?.checkInHistory?.includes(today)) {
        throw new Error('Already checked in today! ☕');
      }

      setSuccess(true);
      
      if (user && cafeSlug) {
        const userRef = doc(db, `users_${cafeSlug}`, user.uid);
        await updateDoc(userRef, {
          points: increment(cafe?.pointsPerVisit || 10),
          visits: increment(1),
          lastCheckIn: new Date().toISOString(),
          checkInHistory: arrayUnion(today),
          visitsHistory: arrayUnion({
            id: `${today}_${Date.now()}`,
            date: new Date().toISOString(),
            location: cafe?.cafeName || 'Main Store',
            pointsEarned: cafe?.pointsPerVisit || 10
          })
        });
      }

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err: any) {
      console.error('Check-in error:', err);
      setScanError(err.message || 'Invalid QR code');
      setCheckingIn(false);
      setSuccess(false);
      setTimeout(() => {
        startScanner();
      }, 2000);
    }
  };

  const onScanError = (err: any) => {
    // Ignore
  };

  const handleManualCheckIn = async () => {
    setCheckingIn(true);
    setSuccess(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      if (profile?.checkInHistory?.includes(today)) {
        throw new Error('Already checked in today! ☕');
      }

      if (user && cafeSlug) {
        const userRef = doc(db, `users_${cafeSlug}`, user.uid);
        await updateDoc(userRef, {
          points: increment(cafe?.pointsPerVisit || 10),
          visits: increment(1),
          lastCheckIn: new Date().toISOString(),
          checkInHistory: arrayUnion(today),
          visitsHistory: arrayUnion({
            id: `${today}_${Date.now()}`,
            date: new Date().toISOString(),
            location: cafe?.cafeName || 'Main Store',
            pointsEarned: cafe?.pointsPerVisit || 10
          })
        });
      }
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      console.error('Manual check-in error:', err);
      setScanError(err.message || 'Manual check-in failed');
      setCheckingIn(false);
      setSuccess(false);
    }
  };

  const navigateToHome = () => {
    navigate('/');
  };

  if (!cafe) return null;

  // Success state
  if (success) {
    return (
      <div className="p-6 h-screen flex flex-col items-center justify-center pt-12 bg-coffee-50">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 size={64} className="text-green-500" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-coffee-800">Checked In! ✅</h3>
            <p className="text-coffee-500 mt-2">
              +{cafe?.pointsPerVisit || 10} Points Earned
            </p>
            <p className="text-sm text-coffee-400 mt-1">
              {profile?.visits || 0} total visits
            </p>
          </div>
          <button
            onClick={navigateToHome}
            className="mt-6 bg-primary text-white px-8 py-3 rounded-full font-bold"
          >
            Continue
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-page min-h-screen px-5 pt-8 pb-32 sm:px-6">
      <header className="mx-auto flex w-full max-w-md items-center justify-between">
        <button onClick={navigateToHome} aria-label="Back to home" className="icon-button size-10">
          <ArrowLeft className="size-5" strokeWidth={1.6} />
        </button>
        <div className="flex items-center gap-2 text-coffee-700">
          {cafe.logoUrl ? <img src={cafe.logoUrl} alt="" className="size-7 rounded-full object-cover" /> : <Coffee className="size-5" strokeWidth={1.6} />}
          <span className="type-small font-semibold">{cafe.cafeName}</span>
        </div>
        <ProfileButton />
      </header>

      <div className="mx-auto mt-9 max-w-md text-center">
        <span className="eyebrow">Loyalty check-in</span>
        <h1 className="type-display-lg mt-2 text-coffee-800">Scan to earn</h1>
        <p className="type-body mt-3 text-muted">
          {scanning ? 'Point camera at QR code' : 'Scan at the counter to earn points'}
        </p>
      </div>

      <div className="mx-auto mt-9 flex w-full max-w-sm flex-col items-center">
        <div 
          ref={scannerContainerRef}
          className="relative flex aspect-square w-full max-w-[310px] items-center justify-center overflow-hidden rounded-[2.25rem] border border-[#2d211b] bg-[#211712] p-3 shadow-[0_22px_45px_-19px_rgba(58,31,17,.65)]"
        >
          {scanning ? (
            <>
              <div id="qr-reader" className="h-full w-full overflow-hidden rounded-[1.7rem]" />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-7 rounded-[1.35rem] border border-white/20" />
                <div className="absolute left-7 top-7 size-9 rounded-tl-xl border-l-[3px] border-t-[3px] border-[#e6a36e]" />
                <div className="absolute right-7 top-7 size-9 rounded-tr-xl border-r-[3px] border-t-[3px] border-[#e6a36e]" />
                <div className="absolute bottom-7 left-7 size-9 rounded-bl-xl border-b-[3px] border-l-[3px] border-[#e6a36e]" />
                <div className="absolute bottom-7 right-7 size-9 rounded-br-xl border-b-[3px] border-r-[3px] border-[#e6a36e]" />
                <motion.div 
                  initial={{ top: '15%' }}
                  animate={{ top: '85%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-10 right-10 h-px bg-[#f5bc8c] shadow-[0_0_18px_2px_rgba(235,154,95,.85)]"
                />
              </div>
              <button
                onClick={stopScanner}
                className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/15 bg-[#2f211b]/90 p-3 text-white shadow-lg backdrop-blur"
              >
                <X size={24} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 px-6 text-center">
              <div className="flex size-20 items-center justify-center rounded-[1.35rem] border border-[#4d372b] bg-[#2b1d17]">
                <QrCode size={42} className="text-[#dda06e]" strokeWidth={1.35} />
              </div>
              <p className="type-small max-w-52 text-[#c4ada0]">
                Your camera will open securely when you’re ready.
              </p>
            </div>
          )}
        </div>

        {scanError && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center"
          >
            <p className="type-small text-red-700">{scanError}</p>
          </motion.div>
        )}

        {/* ✅ FIX: Show button when NOT scanning and NOT success */}
        {!scanning && !success && (
          <div className="mt-6 w-full space-y-3">
            <button
              onClick={startScanner}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[linear-gradient(135deg,#78401f,#ba6b35)] px-6 py-4 text-base font-semibold text-white shadow-[0_15px_28px_-12px_rgba(116,61,28,.7)] transition-transform active:scale-[.98]"
            >
              <Camera size={24} />
              {scanError ? 'Try camera again' : 'Start scanning'}
            </button>

            <button
              onClick={handleManualCheckIn}
              className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-2 text-sm font-medium text-coffee-400 transition-transform active:scale-[.98]"
            >
              <span className="opacity-60">Manual check-in (test)</span>
            </button>
          </div>
        )}

        {scanning && (
          <div className="mt-5 flex items-center gap-2 text-coffee-500">
            <ShieldCheck className="size-4" strokeWidth={1.5} />
            <p className="type-caption">Position the QR code within the frame</p>
          </div>
        )}
      </div>
    </div>
  );
}
