import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Repeat, Shuffle } from 'lucide-react';
import { Song } from '../types';

interface MusicPlayerBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const MusicPlayerBar: React.FC<MusicPlayerBarProps> = ({ 
  currentSong, 
  isPlaying, 
  onTogglePlay,
  onNext,
  onPrev 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration || 0;
      setDuration(total);
      setProgress((current / total) * 100);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekVal = parseFloat(e.target.value);
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (seekVal / 100) * duration;
      setProgress(seekVal);
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-white dark:bg-black border-t dark:border-white/10 border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 px-4 flex items-center justify-between animate-slide-up">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.audioUrl || "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
      />

      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
        <div className="w-14 h-14 rounded-lg overflow-hidden shadow-md relative group">
          <img 
            src={currentSong.coverUrl} 
            alt={currentSong.title} 
            className={`w-full h-full object-cover ${isPlaying ? 'animate-pulse-slow' : ''}`}
          />
        </div>
        <div className="overflow-hidden">
          <h4 className="font-bold text-sm dark:text-white text-gray-900 truncate hover:underline cursor-pointer">
            {currentSong.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate hover:underline cursor-pointer">
            {currentSong.composer}
          </p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center flex-1 max-w-2xl px-4">
        <div className="flex items-center gap-6 mb-2">
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <Shuffle size={16} />
          </button>
          <button 
            onClick={onPrev}
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button 
            onClick={onTogglePlay}
            className="w-10 h-10 bg-[#1DB954] hover:bg-[#1ed760] rounded-full flex items-center justify-center text-black shadow-lg transform hover:scale-105 transition-all"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={onNext}
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <Repeat size={16} />
          </button>
        </div>
        
        <div className="w-full flex items-center gap-2 text-xs text-gray-400 font-mono">
           <span>
             {Math.floor((duration * (progress/100)) / 60)}:{Math.floor((duration * (progress/100)) % 60).toString().padStart(2, '0')}
           </span>
           <input
             type="range"
             min="0"
             max="100"
             value={progress}
             onChange={handleSeek}
             className="flex-1 h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:scale-125 transition-all hover:h-1.5"
           />
           <span>
             {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
           </span>
        </div>
      </div>

      {/* Volume & Options */}
      <div className="w-1/4 flex items-center justify-end gap-3 min-w-[150px]">
         <Volume2 size={18} className="text-gray-500" />
         <input 
           type="range"
           min="0"
           max="1"
           step="0.01"
           value={volume}
           onChange={handleVolumeChange}
           className="w-24 h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
         />
         <button className="text-gray-400 hover:text-white ml-2">
            <Maximize2 size={16} />
         </button>
      </div>
    </div>
  );
};