import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ScanLine, XCircle, Camera } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

export function Scan() {
  const { user, profile, cafe, cafeSlug } = useTenant();
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const addVisit = async () => {
    if (user && profile && cafe && cafeSlug) {
      try {
        const userRef = doc(db, `users_${cafeSlug}`, user.uid);
        
        await updateDoc(userRef, {
          points: increment(cafe.pointsPerVisit || 10),
          visits: increment(1),
          visitsHistory: arrayUnion({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            location: cafe.cafeName || 'Main Store',
            pointsEarned: cafe.pointsPerVisit || 10
          })
        });
        
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 2500);
      } catch (err) {
        console.error("Check-in failed:", err);
      }
    }
  };

  const startScanner = async () => {
    setErrorMsg(null);
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      
      setIsScanning(true);
      
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleScan(decodedText);
        },
        (errorMessage) => {
          // ignore stream errors, they are noisy
        }
      );
    } catch (err: any) {
      console.error(err);
      setIsScanning(false);
      setErrorMsg(err.message || 'Could not start camera');
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner", err);
      }
      scannerRef.current = null;
      setIsScanning(false);
    }
  };

  const handleScan = async (decodedText: string) => {
    // Expected format: {"cafe":"coffeehouse","type":"checkin"}
    try {
      const data = JSON.parse(decodedText);
      if (data.type === 'checkin' && data.cafe === cafeSlug) {
        stopScanner();
        addVisit();
      } else {
        stopScanner();
        setErrorMsg('Invalid QR Code for this cafe.');
      }
    } catch (e) {
      stopScanner();
      setErrorMsg('Unrecognized QR format.');
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  const handleSimulateCheckIn = () => {
    if (isScanning) stopScanner();
    addVisit();
  };

  return (
    <div className="app-page min-h-screen pb-32 pt-14 px-5 sm:px-6 flex flex-col items-center">
      <div className="w-full mb-12">
        <h1 className="type-display-xl text-ink mb-5">Check in</h1>
        <p className="type-body-lg text-muted">Scan the café QR to collect your stamp</p>
      </div>

      <div className="relative w-full max-w-sm">
        <div className="rounded-[30px] bg-[radial-gradient(circle_at_50%_35%,#d7c299,#998f7d)] p-3 shadow-[0_22px_45px_-22px_rgba(77,49,26,.55)] flex flex-col items-center">
          
          {/* Scanner Container */}
          <div className="w-full aspect-square bg-black/10 rounded-[23px] overflow-hidden relative flex flex-col items-center justify-center border border-white/50">
            {!isScanning ? (
               <div className="text-coffee-800/70 flex flex-col items-center">
                 <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-surface/80 shadow-[var(--shadow-card)]">
                   <ScanLine className="w-9 h-9" />
                 </div>
                 <p className="type-body-lg font-medium">Center the QR code</p>
               </div>
            ) : null}
            
            {/* Html5Qrcode injects video here */}
            <div id="qr-reader" className={`w-full h-full [&>video]:object-cover ${!isScanning ? 'hidden' : ''}`}></div>

            {/* Framing remains visible before the camera is opened. */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-[3px] border-l-[3px] border-caramel rounded-tl-lg z-10" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-[3px] border-r-[3px] border-caramel rounded-tr-lg z-10" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-[3px] border-l-[3px] border-caramel rounded-bl-lg z-10" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-[3px] border-r-[3px] border-caramel rounded-br-lg z-10" />
            {isScanning && (
              <>
                {/* Scanning line animation */}
                <motion.div 
                  initial={{ top: '10%' }}
                  animate={{ top: '90%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-[10%] right-[10%] h-0.5 bg-caramel shadow-[0_0_8px_rgba(184,104,49,.8)] z-10"
                />
              </>
            )}
          </div>

          {errorMsg && (
            <div className="w-full bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm flex items-start gap-2 font-medium">
              <XCircle className="w-5 h-5 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

        </div>

        <div className="text-center w-full pt-8">
            {!isScanning ? (
              <button 
                onClick={startScanner}
                className="type-button w-full bg-neutral-900 text-white rounded-full py-5 text-base shadow-[var(--shadow-card)] active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Camera className="w-6 h-6" />
                Open Camera
              </button>
            ) : (
              <button 
                onClick={stopScanner}
                className="type-button w-full bg-surface border border-line text-ink rounded-full py-5 text-base shadow-[var(--shadow-card)] active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                Stop Scanning
              </button>
            )}
            
            <p className="type-body mt-7 text-muted">Enter code instead</p>
            {/* Hidden manual checkin */}
            <button 
              onClick={handleSimulateCheckIn}
              className="mt-6 opacity-0 hover:opacity-100 focus:opacity-100 text-xs text-coffee-300 mx-auto block py-2 transition-opacity"
            >
              [Dev] Manual Check-in
            </button>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-28 left-6 right-6 bg-coffee-800 text-white p-4 rounded-2xl shadow-lg flex items-center gap-3 z-50 border border-coffee-700"
          >
            <div className="bg-accent p-2 rounded-full text-white">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold">Check-in Successful!</p>
              <p className="text-sm text-coffee-200 opacity-90">+1 Visit, +{cafe?.pointsPerVisit || 10} Points</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
