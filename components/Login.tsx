import React, { useState, useMemo } from 'react';
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const StarField = () => {
  const stars = useMemo(() => {
    return [...Array(100)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 30 + 20,
      delay: Math.random() * 20,
      opacity: Math.random() * 0.7 + 0.3,
      // Colors adjusted to include pinks and whites to match the logo
      color: `hsl(${Math.random() > 0.5 ? 330 : 260}, 100%, 75%)`
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes space-drift {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: var(--target-opacity); }
          100% { transform: translateY(-100px) translateX(-20px); opacity: 0; }
        }
      `}</style>
      {stars.map((star) => (
        <div key={star.id} className="absolute rounded-full"
          style={{
            left: star.left, top: star.top, width: `${star.size}px`, height: `${star.size}px`,
            backgroundColor: star.color, boxShadow: `0 0 ${star.size + 2}px ${star.color}`,
            opacity: 0, '--target-opacity': star.opacity,
            animation: `space-drift ${star.duration}s linear infinite`,
            animationDelay: `-${star.delay}s`
          } as any}
        />
      ))}
    </div>
  );
};

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (accessCode.trim() === '20') {
        onLogin();
      } else {
        setError('Access denied. Please check your passkey.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden selection:bg-pink-500">
      
      {/* Background Ambience */}
      <StarField />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="backdrop-blur-2xl bg-white/[0.02] border border-white/10 rounded-[3rem] p-10 shadow-2xl shadow-black/50">
          
          {/* Logo Section with Pink Underground Glow */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="relative mb-6 group">
              {/* The "Pink Underground" Glow */}
              <div className="absolute inset-0 bg-pink-600/40 rounded-full blur-2xl group-hover:bg-pink-500/60 transition-all duration-700 scale-110" />
              
              {/* Logo Circle */}
              <div className="relative w-28 h-28 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 overflow-hidden shadow-inner">
                <img 
                  src="https://ewdlsufzakowsdyozato.supabase.co/storage/v1/object/public/guitarChoir%20images/guitar_logo.jpeg" 
                  alt="MFM Guitar Choir" 
                  className="w-[85%] h-[85%] object-contain transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
            
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-purple-300 brand-font mb-2 italic tracking-tighter drop-shadow-[0_2px_10px_rgba(219,39,119,0.3)] transform -rotate-1">
              Guitar Choir
            </h1>
            
            <p className="text-pink-300/50 text-[10px] tracking-[0.4em] uppercase font-bold">
              Lyrics Repository
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-pink-400/60 uppercase tracking-widest ml-4">
                Security Access
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-500/50">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white placeholder-white/10 focus:outline-none focus:border-pink-500/50 transition-all backdrop-blur-sm"
                  placeholder="Enter passkey"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center font-medium animate-bounce">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg shadow-pink-900/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Open Archive</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-10 flex items-center justify-center gap-2 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
            <ShieldCheck size={12} />
            Authorized Access Only
          </div>
        </div>
      </div>
    </div>
  );
};