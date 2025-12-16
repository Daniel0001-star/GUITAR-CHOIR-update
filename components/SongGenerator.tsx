import React, { useState } from 'react';
import { generateLyrics } from '../services/geminiService';
import { Sparkles, Music, Mic2, Loader2, Text } from 'lucide-react';

export const SongGenerator: React.FC = () => {
  const [songTitle, setSongTitle] = useState('');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle.trim()) return;

    setIsLoading(true);
    setGeneratedContent(null);
    try {
      const result = await generateLyrics(songTitle);
      setGeneratedContent(result);
    } catch (error) {
      setGeneratedContent("Error generating content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold dark:text-white text-gray-900 brand-font">Lyrics Generator</h2>
        <p className="dark:text-purple-300 text-purple-600">Enter a song title to generate full lyrics for worship and practice.</p>
      </div>

      <div className="dark:bg-slate-900/50 bg-white/80 backdrop-blur-lg rounded-2xl p-8 border dark:border-white/10 border-purple-100 shadow-xl">
        <form onSubmit={handleGenerate} className="flex gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              placeholder="e.g. Great Faith"
              className="w-full bg-transparent border-2 dark:border-white/10 border-purple-200 rounded-xl px-4 py-3 dark:text-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <Music className="absolute right-4 top-1/2 -translate-y-1/2 dark:text-gray-500 text-gray-400" size={20} />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-purple-500/30"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            Generate
          </button>
        </form>
      </div>

      {generatedContent && (
        <div className="grid gap-6 animate-slide-up">
          <div className="dark:bg-slate-900/80 bg-white border dark:border-white/10 border-purple-100 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-tr-full -ml-8 -mb-8 transition-transform group-hover:scale-110" />
             
             <h3 className="text-xl font-bold mb-6 dark:text-purple-300 text-purple-700 flex items-center gap-2">
               <Text size={20} />
               Generated Lyrics
             </h3>
             
             <div className="prose dark:prose-invert max-w-none whitespace-pre-line font-serif text-lg leading-relaxed dark:text-gray-200 text-gray-800">
               {generatedContent}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};