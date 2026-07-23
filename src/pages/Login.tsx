import { loginWithGoogle, auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ArrowRight, Mail, Lock, EyeOff, Eye, User as UserIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import { useNavigate } from 'react-router-dom';
import { optimizeImageUrl } from '@/lib/utils';

export function Login() {
  const { cafe, user } = useTenant();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${cafe?.id || 'perkly'}`, { replace: true });
    }
  }, [user, navigate, cafe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError("Firebase Auth is not initialized.");
      return;
    }
    
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName: name });
        
        // Ensure user document exists with the correct name immediately
        if (db) {
          const userRef = doc(db, `users_${cafe?.id || 'perkly'}`, userCred.user.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              name: name,
              email: email,
              points: 0,
              visits: 0,
              visitsHistory: [],
              rewardsEarned: [],
              onboardingCompleted: false,
              createdAt: new Date().toISOString()
            });
          }
        }
      } else if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setMessage('Password reset email sent. Check your inbox.');
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      // Clean up Firebase error messages
      const msg = err.message.replace('Firebase: ', '').replace(/\(auth.*\)\.?/, '').trim();
      setError(msg || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      // Auth state change will trigger the useEffect to navigate
    } catch (err: any) {
      console.error("Google Login failed", err);
      setError('Google Sign-In failed.');
      setIsLoading(false);
    }
  };

  const primaryColor = cafe?.primaryColor || '#F27D26';

  return (
    <div className="min-h-screen bg-black relative flex flex-col overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 h-[60vh]">
        <img 
          src={optimizeImageUrl(cafe?.heroImageUrl || 'https://images.unsplash.com/photo-1495474472207-464a8d4402b8?auto=format&fit=crop&q=80&w=600')} 
          alt="Background" 
          loading="lazy"
          className="w-full h-full object-cover opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90"></div>
      </div>

      {/* Top Section */}
      <div className="relative z-10 p-6 pt-12 pb-12 flex-1 flex flex-col justify-between h-[45vh]">
        {/* Header */}
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0">
             {cafe?.logoUrl ? (
               <img src={cafe.logoUrl} alt="Logo" className="w-full h-full object-cover" />
             ) : (
               <div className="w-4 h-5 border-2 border-coffee-800 rounded-t-full"></div>
             )}
           </div>
           <span className="text-white text-xs font-bold tracking-widest uppercase">{cafe?.cafeName || 'Perkly Cafe'}</span>
        </div>

        {/* Welcome Text */}
        <div className="mt-auto">
          <h1 className="type-display-xl text-[56px] mb-3">
            {mode === 'signup' ? (
              <>
                <span className="text-white italic block">Join</span>
                <span className="font-normal block" style={{ color: primaryColor }}>{cafe?.cafeName || 'Us'}</span>
              </>
            ) : mode === 'forgot' ? (
              <>
                <span className="text-white italic block">Reset</span>
                <span className="font-normal block" style={{ color: primaryColor }}>Password</span>
              </>
            ) : (
              <>
                <span className="text-white italic block">Welcome</span>
                <span className="font-normal block" style={{ color: primaryColor }}>Back</span>
              </>
            )}
          </h1>
          <p className="text-white/90 text-sm font-medium">
            {mode === 'signup' 
              ? "Start your loyalty journey" 
              : cafe?.welcomeMessage || "Loyalty Brewed Better."}
          </p>
        </div>
      </div>

      {/* Bottom Card */}
      <div className="relative z-10 bg-coffee-50 w-full rounded-t-[32px] p-8 pb-10 flex flex-col min-h-[55vh] shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold">{error}</div>}
          {message && <div className="bg-green-50 text-green-700 p-3 rounded-xl text-xs font-semibold">{message}</div>}

          {mode === 'signup' && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-coffee-400">
                <UserIcon className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                className="w-full pl-12 pr-4 py-4 rounded-3xl border border-coffee-200 bg-white focus:outline-none focus:border-coffee-300 focus:ring-4 focus:ring-coffee-100 transition-all text-sm text-coffee-800 placeholder:text-coffee-400 shadow-sm" 
              />
            </div>
          )}
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-coffee-400">
              <Mail className="w-5 h-5" />
            </div>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="w-full pl-12 pr-4 py-4 rounded-3xl border border-coffee-200 bg-white focus:outline-none focus:border-coffee-300 focus:ring-4 focus:ring-coffee-100 transition-all text-sm text-coffee-800 placeholder:text-coffee-400 shadow-sm" 
            />
          </div>
          
          {mode !== 'forgot' && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-coffee-400">
                <Lock className="w-5 h-5" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                minLength={6}
                className="w-full pl-12 pr-12 py-4 rounded-3xl border border-coffee-200 bg-white focus:outline-none focus:border-coffee-300 focus:ring-4 focus:ring-coffee-100 transition-all text-sm text-coffee-800 placeholder:text-coffee-400 shadow-sm" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-coffee-400 hover:text-coffee-600"
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          )}

          {mode === 'login' && (
            <button 
              type="button" 
              onClick={() => { setMode('forgot'); setError(''); setMessage(''); }} 
              className="text-xs font-bold self-end hover:opacity-80 transition-opacity py-1"
              style={{ color: primaryColor }}
            >
              Forgot password?
            </button>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full text-white rounded-3xl py-4 font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            style={{ backgroundColor: cafe?.secondaryColor || '#4B3621' }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : mode === 'login' ? (
              <>Sign In <ArrowRight className="w-4 h-4" /></>
            ) : mode === 'signup' ? (
              <>Create Account <ArrowRight className="w-4 h-4" /></>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {mode !== 'forgot' && (
          <>
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-coffee-200"></div>
              <span className="text-[10px] text-coffee-400 font-bold uppercase tracking-widest">Or</span>
              <div className="flex-1 h-px bg-coffee-200"></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white text-coffee-800 border border-coffee-200 rounded-3xl py-4 font-bold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 text-sm"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <div className="mt-auto pt-6 text-center text-sm text-coffee-600">
          {mode === 'login' ? (
            <p>Don't have an account? <button onClick={() => { setMode('signup'); setError(''); setMessage(''); }} className="font-bold hover:underline" style={{ color: primaryColor }}>Sign up</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => { setMode('login'); setError(''); setMessage(''); }} className="font-bold hover:underline" style={{ color: primaryColor }}>Log in</button></p>
          )}
        </div>
        
        <p className="text-coffee-400 text-[10px] text-center mt-4 pb-2">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
