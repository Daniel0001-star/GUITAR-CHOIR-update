import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import { Play, ChevronLeft, ChevronRight, Music4, ExternalLink, Search, Music, Mic2, ImageOff } from 'lucide-react';

// Updated Database with high-quality thematic Unsplash images matching song titles
const GUITAR_CHOIR_DATABASE: Song[] = [
  { 
    id: '1', 
    title: 'Great Faith (Live)', 
    composer: 'MFM Guitar Choir', 
    arranger: 'Choir Director', 
    difficulty: 'Medium', 
    key: 'G Major', 
    uploadDate: '2024-01-15',
    // Visual: Grand concert lighting/Atmosphere for "Great Faith"
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800',
    youtubeUrl: 'https://www.shazam.com/song/1761664407',
    spotifyUrl: 'https://www.shazam.com/song/1761664407',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
    lyrics: "Great is Thy faithfulness, O God my Father; There is no shadow of turning with Thee...",
    parts: { S: "Strong Lead", A: "Mid Harmony", T: "Counter", B: "Deep Foundation" }
  },
  { 
    id: '2', 
    title: 'VANITY', 
    composer: 'MFM Guitar Choir', 
    arranger: 'Ensemble Lead', 
    difficulty: 'Hard', 
    key: 'A Minor', 
    uploadDate: '2024-01-20',
    // Visual: Moody/Somber acoustic guitar in shadow for "Vanity" - Fixed URL
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800',
    youtubeUrl: 'https://www.shazam.com/song/1761655077',
    spotifyUrl: 'https://www.shazam.com/song/1761655077',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3',
    lyrics: "[Lyrics concerning spiritual reflection and vanity]",
    parts: { S: "Vibrant Lead", A: "Subdued", T: "High Tenor", B: "Steady Root" }
  },
  { 
    id: '3', 
    title: 'Going Greater', 
    composer: 'MFM Guitar Choir', 
    arranger: 'All Stars', 
    difficulty: 'Medium', 
    key: 'E Major', 
    uploadDate: '2024-02-01',
    // Visual: Energetic performance/Ascent for "Going Greater"
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    youtubeUrl: 'https://www.shazam.com/song/1775928812',
    spotifyUrl: 'https://www.shazam.com/song/1775928812',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/10/25/audio_51770e0653.mp3',
    lyrics: "[Featured track lyrics with MFM Guitar Choir]",
    parts: { S: "Anthem Lead", A: "Warm", T: "Driving", B: "Punchy" }
  },
  { 
    id: '4', 
    title: 'Egberun Ahon', 
    composer: 'MFM Guitar Choir', 
    arranger: 'Yoruba Section', 
    difficulty: 'Medium', 
    key: 'F Major', 
    uploadDate: '2024-02-10',
    // Visual: Traditional/Choir singing for "1000 Tongues"
    coverUrl: 'https://images.unsplash.com/photo-1525926477800-7a3be5800fcb?auto=format&fit=crop&q=80&w=800',
    youtubeUrl: 'https://www.shazam.com/song/1757833424',
    spotifyUrl: 'https://www.shazam.com/song/1757833424',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_73685e9447.mp3',
    lyrics: "[Yoruba lyrics: A thousand tongues to sing...]",
    parts: { S: "Choral Lead", A: "Standard", T: "Standard", B: "Root Notes" }
  },
  { 
    id: '5', 
    title: 'Oghene Woruna', 
    composer: 'MFM Guitar Choir', 
    arranger: 'feat. Kehinde Adeyemo', 
    difficulty: 'Hard', 
    key: 'D Major', 
    uploadDate: '2024-02-15',
    // Visual: Hands raised in praise for "God You've Done Well"
    coverUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800',
    youtubeUrl: 'https://www.shazam.com/song/1753020937',
    spotifyUrl: 'https://www.shazam.com/song/1753020937',
    audioUrl: 'https://cdn.pixabay.com/audio/2024/01/16/audio_e2b992254f.mp3',
    lyrics: "[Featured track with Kehinde Adeyemo]",
    parts: { S: "High Lead", A: "Alt-Harmony", T: "Support", B: "Melodic Bass" }
  },
  { 
    id: '6', 
    title: 'Deliverance We Pray', 
    composer: 'MFM Guitar Choir', 
    arranger: 'Prayer Unit', 
    difficulty: 'Medium', 
    key: 'A Minor', 
    uploadDate: '2024-03-01',
    // Visual: Intense/Spiritual atmosphere for "Deliverance"
    coverUrl: 'https://images.unsplash.com/photo-1507643179173-39db3ffde235?auto=format&fit=crop&q=80&w=800',
    youtubeUrl: 'https://www.shazam.com/song/1672304605',
    spotifyUrl: 'https://www.shazam.com/song/1672304605',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3',
    lyrics: "[Spiritual warfare/Deliverance prayer lyrics]",
    parts: { S: "Warfare Lead", A: "Sharp", T: "Aggressive", B: "Steady" }
  },
  { 
    id: '7', 
    title: 'By The Rivers Of Babylon', 
    composer: 'MFM Guitar Choir', 
    arranger: 'feat. Vincent Edeigba', 
    difficulty: 'Easy', 
    key: 'C Major', 
    uploadDate: '2024-03-10',
    // Visual: Water/Nature/Reflection for "Rivers of Babylon" - Fixed URL
    coverUrl: 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e3?auto=format&fit=crop&q=80&w=800',
    youtubeUrl: 'https://www.shazam.com/song/167179891',
    spotifyUrl: 'https://www.shazam.com/song/167179891',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/04/24/audio_924250262b.mp3',
    lyrics: "[Biblical/Psalm lyrics feat. Vincent Edeigba]",
    parts: { S: "Emotional Lead", A: "Deep Harmony", T: "Tenor Solo", B: "Depth" }
  },
  { 
    id: '8', 
    title: 'Omeriwo', 
    composer: 'MFM Guitar Choir', 
    arranger: 'feat. Temitope Abraham', 
    difficulty: 'Medium', 
    key: 'G Major', 
    uploadDate: '2024-03-20',
    // Visual: Vibrant celebration for "Victory/Prevailed"
    coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800',
    youtubeUrl: 'https://www.shazam.com/song/1746053483',
    spotifyUrl: 'https://www.shazam.com/song/1746053483',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/01/10/audio_24e3752e25.mp3',
    lyrics: "[Featured track with Temitope Abraham]",
    parts: { S: "Bright Lead", A: "Harmonic Third", T: "Fillers", B: "Strong Root" }
  },
  { 
    id: '9', 
    title: 'You Showed Me Your Mercy', 
    composer: 'MFM Guitar Choir', 
    arranger: 'Worship Team', 
    difficulty: 'Medium', 
    key: 'E Major', 
    uploadDate: '2024-04-05',
    // Visual: Soft light/Grace for "Mercy"
    coverUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384ebd?auto=format&fit=crop&q=80&w=800',
    youtubeUrl: 'https://www.shazam.com/song/1672304608',
    spotifyUrl: 'https://www.shazam.com/song/1672304608',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/05/22/audio_1311059345.mp3',
    lyrics: "[Lyrics of thanksgiving and mercy]",
    parts: { S: "Soft Lead", A: "Mid", T: "Supporting", B: "Quiet Bass" }
  },
  { 
    id: '10', 
    title: 'Hakuna Mungu', 
    composer: 'MFM Guitar Choir', 
    arranger: 'International Team', 
    difficulty: 'Medium', 
    key: 'F Major', 
    uploadDate: '2024-04-12',
    // Visual: Group worship/Cross-cultural for "Hakuna Mungu"
    coverUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=800',
    youtubeUrl: 'https://www.shazam.com/song/1672304609',
    spotifyUrl: 'https://www.shazam.com/song/1672304609',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/10/01/audio_1087405238.mp3',
    lyrics: "[Swahili lyrics: There is no God like You]",
    parts: { S: "Pulsing Lead", A: "Syncopated", T: "High Support", B: "Rhythmic" }
  }
];

// Selecting Featured/Trending songs from the new database
const TRENDING_SONGS = [
  GUITAR_CHOIR_DATABASE[0], // Great Faith
  GUITAR_CHOIR_DATABASE[2], // Going Greater
  GUITAR_CHOIR_DATABASE[5], // Deliverance
  GUITAR_CHOIR_DATABASE[1], // Vanity
];

interface RepositoryListProps {
  onPlaySong?: (song: Song) => void;
}

export const RepositoryList: React.FC<RepositoryListProps> = ({ onPlaySong }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter Logic
  const filteredSongs = GUITAR_CHOIR_DATABASE.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.composer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % TRENDING_SONGS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % TRENDING_SONGS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + TRENDING_SONGS.length) % TRENDING_SONGS.length);

  const handlePlaySong = (song: Song) => {
    if (onPlaySong) {
      onPlaySong(song);
    }
  };

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };

  // Robust error handling for images
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null; // Prevent infinite loop
    e.currentTarget.src = 'https://images.unsplash.com/photo-1510915361408-d59c2d4cd330?auto=format&fit=crop&q=80&w=800'; // Reliable fallback (Guitar)
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      
      {/* Featured Ministrations Slider */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white text-gray-900 brand-font tracking-wide flex items-center gap-2">
            <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
            Featured Ministrations
          </h2>
          <div className="flex gap-2">
            <button onClick={prevSlide} className="p-2 rounded-full dark:bg-white/5 bg-gray-200 dark:hover:bg-white/20 hover:bg-gray-300 transition-colors dark:text-white text-gray-700">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} className="p-2 rounded-full dark:bg-white/5 bg-gray-200 dark:hover:bg-white/20 hover:bg-gray-300 transition-colors dark:text-white text-gray-700">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl dark:shadow-black/50 shadow-purple-900/20 group bg-gray-900">
          {TRENDING_SONGS.map((song, index) => (
            <div
              key={song.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img 
                src={song.coverUrl} 
                alt={song.title} 
                onError={handleImageError}
                className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-[10s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3 bg-gradient-to-r from-black/80 to-transparent">
                <span className="inline-block px-3 py-1 mb-3 rounded-full bg-purple-600/90 text-white text-xs font-bold uppercase tracking-wider shadow-lg border border-purple-400/50">
                  Featured
                </span>
                <h3 className="text-4xl md:text-6xl font-bold text-white mb-2 brand-font leading-tight drop-shadow-lg">
                  {song.title}
                </h3>
                <p className="text-xl text-purple-200/90 font-light mb-6 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-purple-400 inline-block"></span>
                  {song.composer}
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handlePlaySong(song)}
                    className="px-8 py-3 bg-white text-purple-900 rounded-full font-bold hover:bg-purple-100 transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-white/20"
                  >
                    <Play size={20} fill="currentColor" /> Play Now
                  </button>
                  <button 
                    onClick={() => handleOpenLink(song.youtubeUrl)}
                    className="px-6 py-3 bg-black/40 text-white border border-white/20 rounded-full font-bold hover:bg-black/60 transition-all hover:scale-105 flex items-center gap-2 backdrop-blur-sm"
                  >
                    <ExternalLink size={20} /> Info
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Slider Indicators */}
          <div className="absolute bottom-8 right-8 flex gap-3 z-20">
             {TRENDING_SONGS.map((_, idx) => (
               <button 
                 key={idx}
                 onClick={() => setCurrentSlide(idx)}
                 className={`h-1.5 rounded-full transition-all duration-500 ${
                   currentSlide === idx ? 'w-12 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 'w-3 bg-white/30 hover:bg-white/50'
                 }`}
               />
             ))}
          </div>
        </div>
      </section>

      {/* Database Search & Grid */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
           <div>
             <h2 className="text-xl font-bold dark:text-white text-gray-900 brand-font tracking-wide">
               Repertoire Database
             </h2>
             <span className="text-sm dark:text-purple-300/50 text-purple-600/60">
               {GUITAR_CHOIR_DATABASE.length} Songs Available
             </span>
           </div>

           {/* Search Input */}
           <div className="relative w-full md:w-72">
             <input
               type="text"
               placeholder="Search database..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-2 rounded-xl dark:bg-slate-900/50 bg-white border dark:border-white/10 border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:text-white text-gray-900 transition-all placeholder:text-gray-500"
             />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
           </div>
        </div>

        {filteredSongs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.map((song, index) => (
              <div 
                key={song.id}
                onClick={() => handlePlaySong(song)}
                className="group relative dark:bg-slate-900/40 bg-white/60 rounded-xl overflow-hidden border dark:border-white/5 border-purple-100 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl dark:hover:shadow-purple-900/20 hover:shadow-purple-200/50 hover:-translate-y-2 flex flex-col h-full cursor-pointer backdrop-blur-sm"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <img 
                    src={song.coverUrl} 
                    alt={song.title} 
                    onError={handleImageError}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t dark:from-slate-900 from-gray-900/50 via-transparent to-transparent opacity-80" />
                  
                  {/* Overlay Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                     <button className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300 hover:bg-purple-500">
                       <Play size={24} fill="currentColor" className="ml-1" />
                     </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold dark:text-white text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                      {song.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    <p className="text-sm dark:text-gray-400 text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      {song.composer}
                    </p>
                    {song.parts && (
                      <p className="text-xs text-purple-500/80 dark:text-purple-400/80 flex items-center gap-1.5 mt-1">
                         <Mic2 size={10} />
                         <span>Part: {song.parts.S?.split(' ')[0]} / {song.parts.A?.split(' ')[0]}</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t dark:border-white/5 border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs dark:text-gray-500 text-gray-500">
                      <Music4 size={12} />
                      <span>{song.key}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handlePlaySong(song); }}
                        className="text-purple-500 hover:text-purple-700 transition-colors flex items-center gap-1.5 text-xs font-semibold group/btn"
                      >
                        <Play size={14} className="group-hover/btn:scale-110 transition-transform" />
                        Play
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
             <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
               <Search className="text-gray-400 w-8 h-8" />
             </div>
             <h3 className="text-xl font-medium dark:text-white text-gray-900 mb-2">No songs found</h3>
             <p className="text-gray-500 dark:text-gray-400">Try searching for "Great Faith" or "Vanity".</p>
          </div>
        )}
      </section>
    </div>
  );
};