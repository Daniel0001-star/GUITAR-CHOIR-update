import React, { useState, useMemo } from 'react';
import { Guitar, ArrowRight, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const StarField = () => {
  const stars = useMemo(() => {
    return [...Array(100)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 30 + 20, // 20-50s duration
      delay: Math.random() * 20,
      opacity: Math.random() * 0.7 + 0.3,
      // Rainbow colors: vivid HSL values
      color: `hsl(${Math.random() * 360}, 100%, 70%)`
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes space-drift {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: var(--target-opacity); }
          90% { opacity: var(--target-opacity); }
          100% { transform: translateY(-150px) translateX(-30px); opacity: 0; }
        }
      `}</style>
      
      {stars.map((star) => (
        <div 
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size + 2}px ${star.color}`,
            opacity: 0,
            '--target-opacity': star.opacity,
            animation: `space-drift ${star.duration}s linear infinite`,
            animationDelay: `-${star.delay}s`
          } as React.CSSProperties}
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

    // Simulate authentication delay
    setTimeout(() => {
      // Access code validation - Updated answer to '20'
      if (accessCode.trim() === '20') {
        onLogin();
      } else {
        setError('Access denied. Please enter the correct passkey.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-indigo-950 relative overflow-hidden">
      
      {/* Background Decorative Elements with Rainbow Stars */}
      <StarField />
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-8 transform transition-all hover:scale-[1.01] duration-500">
          
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group">
              <Guitar className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
            </div>
            
            {/* Creative Font Treatment */}
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 brand-font mb-2 italic tracking-tighter drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)] transform -rotate-2">
              Guitar Choir
            </h1>
            
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-pink-500 to-transparent mb-3 opacity-50"></div>

            <p className="text-purple-200/80 text-sm tracking-[0.2em] uppercase font-light">
              Lyrics Repository
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="code" className="text-xs font-semibold text-purple-300 uppercase tracking-wider ml-1">
                Access Portal
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-purple-400 group-focus-within:text-purple-200 transition-colors" />
                </div>
                <input
                  id="code"
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-black/20 border border-purple-500/30 rounded-lg text-purple-100 placeholder-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="Enter passkey (hint: how old is guitar choir?)"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center animate-pulse">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white font-medium shadow-lg shadow-purple-900/40 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enter Repository</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-purple-400/40">
              Restricted Access &bull; Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};