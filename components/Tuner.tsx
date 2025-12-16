import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, CheckCircle2 } from 'lucide-react';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const GUITAR_STRINGS = [
  { note: 'E', freq: 82.41 },
  { note: 'A', freq: 110.00 },
  { note: 'D', freq: 146.83 },
  { note: 'G', freq: 196.00 },
  { note: 'B', freq: 246.94 },
  { note: 'E', freq: 329.63 },
];

export const Tuner: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [pitch, setPitch] = useState<number>(0);
  const [note, setNote] = useState<string>('--');
  const [cents, setCents] = useState<number>(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const requestRef = useRef<number>();

  const autoCorrelate = (buf: Float32Array, sampleRate: number) => {
    let size = buf.length;
    let rms = 0;
    for (let i = 0; i < size; i++) {
      const val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / size);
    if (rms < 0.01) return -1; // Not enough signal

    let r1 = 0, r2 = size - 1, thres = 0.2;
    for (let i = 0; i < size / 2; i++) {
      if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    }
    for (let i = 1; i < size / 2; i++) {
      if (Math.abs(buf[size - i]) < thres) { r2 = size - i; break; }
    }

    buf = buf.slice(r1, r2);
    size = buf.length;

    const c = new Array(size).fill(0);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - i; j++) {
        c[i] = c[i] + buf[j] * buf[j + i];
      }
    }

    let d = 0; while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < size; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  };

  const updatePitch = () => {
    if (!analyserRef.current) return;
    const buf = new Float32Array(2048);
    analyserRef.current.getFloatTimeDomainData(buf);
    const ac = autoCorrelate(buf, audioContextRef.current!.sampleRate);

    if (ac !== -1) {
      setPitch(Math.round(ac));
      const noteNum = 12 * (Math.log(ac / 440) / Math.log(2)) + 69;
      const roundedNote = Math.round(noteNum);
      const noteName = NOTES[roundedNote % 12];
      
      // Calculate cents off
      const centsOff = Math.floor((noteNum - roundedNote) * 100);
      
      setNote(noteName);
      setCents(centsOff);
    }
    requestRef.current = requestAnimationFrame(updatePitch);
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new window.AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      
      setIsListening(true);
      updatePitch();
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopListening = () => {
    if (sourceRef.current) sourceRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setIsListening(false);
    setPitch(0);
    setNote('--');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold dark:text-white text-gray-900 brand-font mb-2">Acoustic Guitar Tuner</h2>
        <p className="dark:text-gray-400 text-gray-600">Standard Tuning (E A D G B E)</p>
      </div>

      <div className="relative w-72 h-72 rounded-full border-8 dark:border-slate-800 border-gray-200 bg-white dark:bg-slate-900 shadow-[0_0_50px_rgba(139,92,246,0.3)] flex flex-col items-center justify-center transition-colors">
        {/* Tuner Gauge UI */}
        <div className={`text-6xl font-bold mb-2 transition-colors ${
          Math.abs(cents) < 5 && pitch > 0 ? 'text-green-500' : 'dark:text-white text-gray-900'
        }`}>
          {note}
        </div>
        
        {pitch > 0 && (
          <div className="flex items-center gap-2">
             <span className="text-sm dark:text-gray-400 text-gray-500">{pitch} Hz</span>
             {Math.abs(cents) < 5 && <CheckCircle2 className="text-green-500 w-5 h-5" />}
          </div>
        )}

        {/* Needle */}
        <div 
          className="absolute w-1 h-24 bg-red-500 origin-bottom rounded-full transition-transform duration-100 ease-out"
          style={{ 
            bottom: '50%', 
            transform: `rotate(${Math.min(Math.max(cents * 1.5, -90), 90)}deg)`,
            backgroundColor: Math.abs(cents) < 5 ? '#22c55e' : '#ef4444'
          }}
        />
        <div className="absolute w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full z-10" />
      </div>

      <div className="flex flex-col items-center space-y-4">
        {/* String Reference */}
        <div className="flex gap-3">
          {GUITAR_STRINGS.map((s) => (
             <div key={s.freq} className={`px-3 py-1 rounded-lg border text-sm font-medium ${
               note === s.note && Math.abs(pitch - s.freq) < 10 
                 ? 'bg-purple-600 text-white border-purple-500' 
                 : 'dark:bg-slate-800 bg-white dark:text-gray-400 text-gray-600 dark:border-slate-700 border-gray-300'
             }`}>
               {s.note}
             </div>
          ))}
        </div>

        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' 
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/30'
          }`}
        >
          {isListening ? <><MicOff size={20} /> Stop Tuner</> : <><Mic size={20} /> Start Tuner</>}
        </button>
      </div>
    </div>
  );
};