import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DashboardTab, Song } from '../types';
import { RepositoryList } from './RepositoryList';
import { SongDetail } from './SongDetail'; 
import { MusicPlayerBar } from './MusicPlayerBar';
import { UploadForm } from './UploadForm';
import { 
  Library, 
  UploadCloud, 
  LogOut,
  Guitar, 
  Sun,
  Moon,
  Headphones,
  Gamepad2
} from 'lucide-react';

// --- 1. StarField Component Definition ---
const StarField = () => {
  const stars = useMemo(() => {
    return [...Array(150)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 30 + 20, 
      delay: Math.random() * 20,
      opacity: Math.random() * 0.7 + 0.3,
      color: `hsl(${Math.random() * 360}, 100%, 75%)`
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes space-drift {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: var(--target-opacity); }
          90% { opacity: var(--target-opacity); }
          100% { transform: translateY(-150px) translateX(-20px); opacity: 0; }
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
            boxShadow: `0 0 ${star.size + 1}px ${star.color}`,
            opacity: 0,
            '--target-opacity': star.opacity,
            animation: `space-drift ${star.duration}s linear infinite`,
            animationDelay: `-${star.delay}s`
          } as any}
        />
      ))}
      
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
    </div>
  );
};

// --- 2. Main Dashboard Component ---
export const Dashboard: React.FC<{ onLogout: () => void; userName: string }> = ({ onLogout, userName }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.REPOSITORY);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setSelectedSong(song); 
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  return (
    <div className="flex h-screen w-full transition-colors duration-300 dark:bg-slate-950 bg-gray-50 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-indigo-950 dark:via-slate-950 dark:to-black text-slate-900 dark:text-white overflow-hidden relative">
      
      <audio ref={backgroundAudioRef} src="https://cdn.pixabay.com/audio/2022/10/18/audio_731a559272.mp3" loop />
      {isDarkMode && <StarField />}

      <aside className="w-20 lg:w-64 flex flex-col border-r dark:border-white/10 border-gray-200 dark:bg-slate-900/50 bg-white/80 backdrop-blur-xl z-20">
        <div className="h-20 flex items-center px-6 border-b dark:border-white/10 border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
             <Guitar className="text-white w-6 h-6" />
          </div>
          <span className="ml-3 font-bold text-xl brand-font hidden lg:block">Guitar Choir</span>
        </div>

        <nav className="flex-1 py-8 flex flex-col gap-2 px-2 lg:px-4">
          <button
            onClick={() => { setActiveTab(DashboardTab.REPOSITORY); setSelectedSong(null); }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === DashboardTab.REPOSITORY ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-500 hover:bg-white/5'}`}
          >
            <Library size={20} />
            <span className="hidden lg:block font-medium">Repository</span>
          </button>

          <button
            onClick={() => setActiveTab(DashboardTab.UPLOAD)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === DashboardTab.UPLOAD ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'}`}
          >
            <UploadCloud size={20} />
            <span className="hidden lg:block font-medium">Upload Songs</span>
          </button>
        </nav>

        <div className="p-4 border-t dark:border-white/10 border-gray-200 space-y-2">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center gap-3 p-3 w-full rounded-xl text-gray-500 hover:bg-white/5">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="hidden lg:block font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button onClick={onLogout} className="flex items-center gap-3 p-3 w-full rounded-xl text-red-500 hover:bg-red-500/10">
            <LogOut size={20} />
            <span className="hidden lg:block font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 relative overflow-hidden flex flex-col">
        <div className={`flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 relative z-10 ${currentSong ? 'pb-32' : ''}`}>
          <div className="max-w-6xl mx-auto">
            
            {!selectedSong && (
              <div className="mb-8">
                <h2 className="text-lg font-medium text-purple-300 mb-1">Welcome, User!</h2>
                <h1 className="text-3xl font-bold mb-2 dark:text-white text-gray-900">
                  {activeTab === DashboardTab.REPOSITORY && "Repository"}
                  {activeTab === DashboardTab.SPOTIFY && "Spotify Music Player"}
                  {activeTab === DashboardTab.UPLOAD && "Upload New Song"}
                </h1>
                <div className={`h-1 w-20 rounded-full ${activeTab === DashboardTab.SPOTIFY ? 'bg-[#1DB954]' : 'bg-purple-600'}`} />
              </div>
            )}

            {selectedSong ? (
              <SongDetail song={selectedSong} onBack={() => setSelectedSong(null)} />
            ) : (
              <>
                {activeTab === DashboardTab.REPOSITORY && (
                  <RepositoryList onPlaySong={handlePlaySong} />
                )}

                {activeTab === DashboardTab.SPOTIFY && (
                  <SpotifyPlayer currentSong={currentSong} isPlaying={isPlaying} onTogglePlay={togglePlay} />
                )}
                
                
                
                {activeTab === DashboardTab.UPLOAD && (
                  <UploadForm onUploadSuccess={() => setActiveTab(DashboardTab.REPOSITORY)} />
                )}
              </>
            )}
          </div>
        </div>

        <MusicPlayerBar currentSong={currentSong} isPlaying={isPlaying} onTogglePlay={togglePlay} onNext={() => {}} onPrev={() => {}} />
      </main>
    </div>
  );
};