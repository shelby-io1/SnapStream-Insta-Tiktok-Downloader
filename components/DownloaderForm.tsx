"use client";

import React, { useState, useEffect } from 'react';
import { Link2, Clipboard, Trash2, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

interface DownloaderFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  onClear: () => void;
  hasResult: boolean;
}

export default function DownloaderForm({ onSubmit, isLoading, onClear, hasResult }: DownloaderFormProps) {
  const [url, setUrl] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState<'tiktok' | 'instagram' | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const cleanUrl = url.trim().toLowerCase();
    if (!cleanUrl) {
      setDetectedPlatform(null);
      setValidationError(null);
      return;
    }

    if (cleanUrl.includes('tiktok.com')) {
      setDetectedPlatform('tiktok');
      setValidationError(null);
    } else if (cleanUrl.includes('instagram.com') || cleanUrl.includes('instagr.am')) {
      setDetectedPlatform('instagram');
      setValidationError(null);
    } else {
      setDetectedPlatform(null);
      setValidationError('Please enter a valid Instagram or TikTok link');
    }
  }, [url]);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text);
        }
      } else {
        // Fallback for browsers/contexts that don't support clipboard reading
        alert("Clipboard access is blocked or not supported. Please paste the link manually.");
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleClear = () => {
    setUrl('');
    onClear();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!url.trim()) return;
    
    if (validationError) {
      return;
    }
    
    onSubmit(url.trim());
  };

  return (
    <div id="downloader-section" className="w-full max-w-3xl mx-auto px-4 pt-10 pb-6 text-center">
      
      {/* Title / Hero */}
      <h1 className="font-outfit text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
        Download <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent text-glow-primary">TikTok & Instagram</span>
        <br />
        Videos and Photos
      </h1>
      
      <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto mb-8">
        Get high-quality media, reels, carousels, and MP3 tracks without limits or watermarks instantly.
      </p>

      {/* Main Form Box */}
      <form onSubmit={handleSubmit} className="relative bg-black border-2 border-red-600 p-2 sm:p-3 rounded-2xl glow-primary">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          
          {/* Input container */}
          <div className="relative w-full flex items-center bg-white rounded-xl overflow-hidden shadow-inner border border-zinc-200">
            <Link2 className="absolute left-4 w-5 h-5 text-red-600 z-10" />
            
            <input
              type="url"
              placeholder="Paste Instagram post/reel or TikTok link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white pl-12 pr-28 py-3.5 sm:py-4 rounded-xl text-black placeholder-zinc-400 text-sm focus:outline-none focus:ring-0 border-0"
              required
            />

            <div className="absolute right-2.5 flex items-center gap-1.5 z-10">
              {url && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isLoading}
                  className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-650 transition-all duration-200"
                  title="Clear input"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              
              <button
                type="button"
                onClick={handlePaste}
                disabled={isLoading}
                className="flex items-center gap-1 py-1.5 px-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all duration-200 shadow-sm"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Paste</span>
              </button>
            </div>
          </div>

          {/* Submit Button (Red Redesign matching Paste Button) */}
          <button
            type="submit"
            disabled={isLoading || !url.trim() || !!validationError}
            className={`w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-lg shrink-0 border ${
              isLoading
                ? 'bg-red-600/50 text-white/50 border-red-600/40 cursor-not-allowed'
                : !url.trim() || validationError
                ? 'bg-red-600/40 text-white/40 border-red-600/30 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white border-red-600 hover:border-red-500 shadow-red-600/20 hover:shadow-red-500/35 hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <span>Download</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </div>
      </form>

      {/* Validation / Platform Status Indicator */}
      <div className="h-8 mt-3 flex items-center justify-center text-xs">
        {isLoading && (
          <p className="text-zinc-400 animate-pulse">
            Contacting media server, extracting direct links...
          </p>
        )}

        {!isLoading && validationError && url.trim() && (
          <div className="flex items-center gap-1 text-rose-500/90 font-medium bg-rose-500/5 px-3 py-1 rounded-full border border-rose-500/10">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{validationError}</span>
          </div>
        )}

        {!isLoading && detectedPlatform && !validationError && (
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Detected:</span>
            {detectedPlatform === 'tiktok' ? (
              <span className="flex items-center gap-1 text-rose-400 font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 text-glow-success animate-neon-pulse">
                🎵 TikTok Link
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-400 font-bold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 text-glow-primary animate-neon-pulse">
                📸 Instagram Link
              </span>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
