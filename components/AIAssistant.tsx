import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on mount
    chatSessionRef.current = createChatSession();
    // Add initial greeting
    setMessages([{
      id: 'init',
      role: 'model',
      text: 'Greetings. I am the Maestro. How may I assist your ensemble practice today? I can help with music theory, repertoire suggestions, or technique.',
      timestamp: new Date()
    }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !chatSessionRef.current || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    setIsLoading(true);

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);

    try {
      const responseText = await sendMessageToGemini(chatSessionRef.current, userText);
      
      const newModelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newModelMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I apologize, but I encountered a momentary dissonance in my connection. Please try again.",
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[600px] w-full bg-black/20 border border-purple-500/20 rounded-2xl overflow-hidden backdrop-blur-md">
      
      {/* Header */}
      <div className="bg-purple-900/20 border-b border-purple-500/20 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-purple-100">Maestro AI</h3>
          <p className="text-xs text-purple-400">Music Theory & Repertoire Expert</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' 
                ? 'bg-purple-600' 
                : 'bg-indigo-600'
            }`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-purple-600 text-white rounded-tr-none'
                : msg.isError 
                  ? 'bg-red-900/50 border border-red-500/30 text-red-200 rounded-tl-none'
                  : 'bg-white/10 text-purple-50 border border-white/5 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <Bot size={14} />
            </div>
            <div className="bg-white/10 text-purple-50 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
              <span className="text-xs text-purple-300">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-purple-900/10 border-t border-purple-500/20">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about harmony, composition, or repertoire..."
            className="flex-1 bg-black/40 border border-purple-500/30 text-white placeholder-purple-500/50 text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-2 p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};