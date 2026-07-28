import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, CheckCircle2, QrCode, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { Html5Qrcode } from 'html5-qrcode';

export function Scan() {
  const { user, profile, cafe, cafeSlug } = useTenant();
  const navigate = useNavigate();
  const [checkingIn, setCheckingIn] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  // Clean up scanner on unmount
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
      console.error('Scanner container not found');
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

      console.log('Scanner started successfully');
    } catch (err: any) {
      console.error('Camera error:', err);
      
      let errorMessage = 'Unable to access camera.';
      if (err.message.includes('NotAllowedError')) {
        errorMessage = 'Camera permission denied. Please allow camera access in browser settings.';
      } else if (err.message.includes('NotFoundError')) {
        errorMessage = 'No camera found on this device.';
      } else if (err.message.includes('NotReadableError')) {
        errorMessage = 'Camera is already in use by another application.';
      } else if (err.message.includes('OverconstrainedError')) {
        errorMessage = 'Camera not supported on this device.';
      } else if (err.message.includes('qr-reader')) {
        errorMessage = 'Scanner not ready. Please try again.';
      } else {
        errorMessage = `Camera error: ${err.message}`;
      }
      
      setScanError(errorMessage);
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err: any) {
        // Ignore "scanner is not running" errors
        if (!err.message?.includes('not running')) {
          console.error('Error stopping scanner:', err);
        }
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
        throw new Error('Invalid QR code: Not a check-in code');
      }

      if (data.cafe !== cafeSlug) {
        throw new Error(`This QR code is for ${data.cafe}, not ${cafeSlug}`);
      }

      const today = new Date().toISOString().split('T')[0];
      if (profile?.checkInHistory?.includes(today)) {
        throw new Error('You have already checked in today! ☕');
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
      setScanError(err.message || 'Invalid QR code. Please try again.');
      setCheckingIn(false);
      setSuccess(false);
      setTimeout(() => {
        startScanner();
      }, 2000);
    }
  };

  const onScanError = (err: any) => {
    // Ignore — this is called continuously while scanning
  };

  const handleManualCheckIn = async () => {
    setCheckingIn(true);
    setSuccess(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      if (profile?.checkInHistory?.includes(today)) {
        throw new Error('You have already checked in today! ☕');
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
      setScanError(err.message || 'Manual check-in failed.');
      setCheckingIn(false);
      setSuccess(false);
    }
  };

  const navigateToHome = () => {
    navigate('/');
  };

  if (!cafe) return null;

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
    <div className="p-6 h-screen flex flex-col pt-12 bg-coffee-50">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-coffee-800 mb-2">Check-In</h1>
        <p className="text-coffee-500">
          {scanning ? 'Point camera at QR code' : 'Scan at the counter to earn points'}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full mx-auto">
        <div 
          ref={scannerContainerRef}
          className="relative w-full aspect-square max-w-[280px] bg-zinc-900 rounded-[2.5rem] border-2 border-zinc-800 flex items-center justify-center overflow-hidden"
        >
          {scanning ? (
            <>
              <div id="qr-reader" className="w-full h-full" />
              
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-primary/40 rounded-3xl" />
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                
                <motion.div 
                  initial={{ top: '15%' }}
                  animate={{ top: '85%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-8 right-8 h-0.5 bg-primary shadow-[0_0_20px_var(--primary)]"
                />
              </div>

              <button
                onClick={stopScanner}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-800 text-white p-3 rounded-full shadow-lg z-10"
              >
                <X size={24} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <QrCode size={80} className="text-zinc-700" />
              <p className="text-zinc-500 text-sm text-center px-4">
                Tap "Start Scanning" to check in
              </p>
            </div>
          )}
        </div>

        {scanError && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-500 text-sm text-center max-w-xs space-y-3"
          >
            <p>{scanError}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={startScanner}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 font-medium text-xs transition-colors"
              >
                Retry Camera
              </button>
              <button
                onClick={handleManualCheckIn}
                className="px-4 py-2 bg-zinc-700/50 hover:bg-zinc-700 rounded-lg text-zinc-300 font-medium text-xs transition-colors"
              >
                Manual Check-in
              </button>
            </div>
          </motion.div>
        )}

        {!scanning && (
          <div className="mt-6 w-full space-y-3">
            <button
              onClick={startScanner}
              className="w-full bg-primary text-white px-6 py-5 rounded-2xl font-bold text-lg active:scale-95 transition-transform flex items-center justify-center gap-3 shadow-lg shadow-primary/10"
            >
              <Camera size={24} />
              Start Scanning
            </button>

            <button
              onClick={handleManualCheckIn}
              className="w-full text-zinc-500 px-6 py-3 rounded-2xl text-sm font-medium active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <span className="opacity-50">Manual Check-in (Test)</span>
            </button>
          </div>
        )}

        {scanning && (
          <p className="mt-4 text-xs text-zinc-500 text-center">
            Position the QR code within the frame
          </p>
        )}
      </div>
    </div>
  );
}