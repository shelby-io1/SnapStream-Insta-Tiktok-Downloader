"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import DownloaderForm from '@/components/DownloaderForm';
import ResultCard from '@/components/ResultCard';
import AdPlaceholder from '@/components/AdPlaceholder';
import SeoFooter from '@/components/SeoFooter';
import { AlertCircle, AlertTriangle } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleDownloadSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract media. Please try again.');
      }

      setResult(data);
    } catch (err: any) {
      console.error("Extraction error:", err);
      setError(err.message || 'An error occurred while processing the request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setError(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      {/* Brand Header Navbar */}
      <Navbar />

      <main className="flex-grow flex flex-col items-center">
        
        {/* Top Ad Banner to prevent Layout Shift */}
        <AdPlaceholder type="banner" />

        {/* Hero Section + Downloader Input Bar */}
        <DownloaderForm 
          onSubmit={handleDownloadSubmit} 
          isLoading={isLoading} 
          onClear={handleClear}
          hasResult={!!result}
        />

        {/* Error Notification Block */}
        {error && (
          <div className="w-full max-w-2xl mx-auto px-4 my-6">
            <div className="glass-card border border-rose-500/30 rounded-2xl p-5 flex items-start gap-3.5 bg-rose-950/10 shadow-lg shadow-rose-950/5">
              <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-semibold text-rose-400 text-sm">Download Failed</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {error}
                </p>
                <div className="pt-2 text-[10px] text-zinc-500 font-medium">
                  Tip: Ensure the post is **public** and the link format matches standard sharing URLs.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result Card Preview Column */}
        {result && (
          <div className="w-full">
            <ResultCard result={result} onReset={handleClear} />
            
            {/* Inline Ad banner showing contextually on result */}
            <AdPlaceholder type="inline" />
          </div>
        )}

        {/* Default Landing Spacer when no results */}
        {!result && !error && (
          <div className="my-10 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-full bg-black border border-red-950 flex items-center justify-center text-red-400/80 mb-4 shadow-inner">
              ⚡
            </div>
            <p className="text-xs text-zinc-500 max-w-xs font-medium">
              Supported media formats: Instagram Reels, Posts, Carousels & TikTok HD Videos, Slideshows, Audios.
            </p>
          </div>
        )}

      </main>

      {/* Footer detailing FAQs, Guides, and Features */}
      <SeoFooter />

    </div>
  );
}
