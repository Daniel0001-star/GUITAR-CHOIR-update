import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Search, ExternalLink, Music2, Headphones, Wifi } from 'lucide-react';
import { Song } from '../types';

interface SpotifyPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ currentSong, isPlaying, onTogglePlay }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Use currentSong if available, otherwise fallback to demo logic if connected
  const activeTrack = currentSong ? {
    title: currentSong.title,
    artist: currentSong.composer,
    album: "Live Ministration",
    coverUrl: currentSong.coverUrl,
    duration: 245
  } : null;

  useEffect(() => {
    let interval: number;
    if (isConnected && isPlaying && activeTrack) {
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 0.4;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected, isPlaying, activeTrack]);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 1500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.open(`https://open.spotify.com/search/${encodeURIComponent(searchQuery + ' MFM Guitar Choir')}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 animate-fade-in">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 text-center border border-gray-200 dark:border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-[#1DB954]/20 rounded-full blur-2xl" />
           <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />

           <div className="relative z-10 flex flex-col items-center">
             <div className="w-20 h-20 bg-gradient-to-br from-[#1DB954] to-[#191414] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#1DB954]/30">
               <Music2 className="text-white w-10 h-10" />
             </div>
             
             <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-2">Connect to Spotify</h2>
             <p className="text-gray-500 dark:text-gray-400 mb-8">
               Link your account to see lyrics and advanced metadata.
             </p>

             <button
               onClick={handleConnect}
               disabled={isConnecting}
               className="w-full py-3 px-6 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full transition-all transform hover:scale-105 disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
             >
               {isConnecting ? (
                 <>
                   <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                   Connecting...
                 </>
               ) : (
                 <>
                   <Wifi size={20} />
                   Connect Account
                 </>
               )}
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold dark:text-white text-gray-900 brand-font flex items-center gap-2">
            <span className="text-[#1DB954]"><Headphones size={32} /></span>
            Spotify Player
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Now Playing from your repository.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input
             type="text"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search MFM Guitar Choir songs..."
             className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1DB954] dark:text-white transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Now Playing Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-white/5 sticky top-8">
            {activeTrack ? (
              <>
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 shadow-lg group">
                  <img 
                    src={activeTrack.coverUrl} 
                    alt="Album Cover" 
                    className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : ''}`}
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full bg-[#1DB954] ${isPlaying ? 'animate-pulse' : ''}`} />
                    <span className="text-white text-xs font-medium">Live</span>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-xl font-bold dark:text-white text-gray-900 line-clamp-1">{activeTrack.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{activeTrack.artist}</p>
                  <p className="text-[#1DB954] text-xs font-medium uppercase tracking-wider">{activeTrack.album}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between px-2">
                  <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <SkipBack size={24} />
                  </button>
                  <button 
                    onClick={onTogglePlay}
                    className="w-16 h-16 bg-[#1DB954] hover:bg-[#1ed760] rounded-full flex items-center justify-center text-black shadow-lg shadow-[#1DB954]/20 transform transition-transform hover:scale-105 active:scale-95"
                  >
                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                  </button>
                  <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <SkipForward size={24} />
                  </button>
                </div>
              </>
            ) : (
               <div className="flex flex-col items-center justify-center h-[400px] text-center">
                 <Music2 className="text-gray-700 w-16 h-16 mb-4" />
                 <p className="text-gray-500">Select a song from the Repository to start listening.</p>
               </div>
            )}
          </div>
        </div>

        {/* Playlist & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Official Spotify Embed */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-1 overflow-hidden shadow-lg border border-gray-200 dark:border-white/5">
            <iframe 
              style={{ borderRadius: '12px' }} 
              src="https://open.spotify.com/embed/artist/3TVXtAsR1Inumwj472S9r4?utm_source=generator&theme=0" 
              width="100%" 
              height="352" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              title="MFM Guitar Choir Spotify Embed"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};