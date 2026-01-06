import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import { Music4, Search, Loader2, Database, CloudOff } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface RepositoryListProps {
  onPlaySong?: (song: Song) => void;
}

export const RepositoryList: React.FC<RepositoryListProps> = ({ onPlaySong }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSongsFromSupabase = async () => {
      try {
        setLoading(true);
        // 1. Directly targeting your table from the screenshot
        const { data, error } = await supabase
          .from('GuitarDB')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          // 2. Mapping the "photo album" column to the image card
          const mappedData = data.map((item: any) => ({
            id: item.id.toString(),
            title: item.title || 'Untitled Piece',
            composer: item.composer || 'MFM Guitar Choir',
            difficulty: item.difficulty || 'Medium',
            key: item.key || 'C Major',
            // Uses your specific DB column name
            coverUrl: item['photo album'] || 'https://images.unsplash.com/photo-1510915361408-d59c2d4cd330',
            audioUrl: item.audio_url || 'https://ewdlsufzakowsdyozato.supabase.co/storage/v1/object/public/songs_guitar_choir/Gba_A_-_Receive_it(256k).mp3',
            lyrics: item.lyrics || ''
          }));

          setSongs(mappedData);
          setIsLive(true);
        }
      } catch (err: any) {
        console.error("Database Connection Error:", err.message);
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSongsFromSupabase();
  }, []);

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.composer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1510915361408-d59c2d4cd330?auto=format&fit=crop&q=80&w=800';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Search Area */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b dark:border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-bold dark:text-white brand-font">Guitar Archive</h2>
          {!isLive && !loading && (
            <span className="text-red-500 text-xs flex items-center gap-1 mt-1 font-bold">
              <CloudOff size={14} /> Repository Offline
            </span>
          )}
        </div>

        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search songs or composers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-white/5 border-2 dark:border-white/10 focus:border-purple-500 outline-none transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Main Data Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-purple-600 w-10 h-10 mb-4" />
          <p className="text-purple-600 font-bold">Loading GuitarDB...</p>
        </div>
      ) : filteredSongs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSongs.map((song) => (
            <div 
              key={song.id} 
              className="bg-white dark:bg-white/5 rounded-[2rem] overflow-hidden border dark:border-white/10 hover:border-purple-500/50 transition-all hover:shadow-xl cursor-pointer"
              onClick={() => onPlaySong?.(song)}
            >
              <div className="h-60 overflow-hidden relative">
                <img 
                  src={song.coverUrl} 
                  alt={song.title} 
                  onError={handleImageError} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold dark:text-white mb-1">{song.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{song.composer}</p>
                <div className="flex justify-between items-center pt-4 border-t dark:border-white/5">
                  <span className="text-purple-500 font-bold flex items-center gap-2">
                    <Music4 size={16} /> {song.key}
                  </span>
                  <button className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold">
                    Play
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-white/20">
          <Database size={64} />
          <p className="mt-4 text-xl">No songs found in the database.</p>
        </div>
      )}
    </div>
  );
};