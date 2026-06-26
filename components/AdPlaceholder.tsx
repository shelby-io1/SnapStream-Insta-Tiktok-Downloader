"use client";

import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface AdPlaceholderProps {
  type: 'banner' | 'sidebar' | 'inline';
}

export default function AdPlaceholder({ type }: AdPlaceholderProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getDimensions = () => {
    switch (type) {
      case 'banner':
        return {
          classes: 'w-full max-w-[728px] h-[90px] mx-auto',
          label: 'Responsive Leaderboard Banner (728x90)'
        };
      case 'sidebar':
        return {
          classes: 'w-full max-w-[300px] h-[250px] mx-auto',
          label: 'Medium Rectangle Sidebar Ad (300x250)'
        };
      case 'inline':
        return {
          classes: 'w-full h-[120px] max-w-[640px] mx-auto',
          label: 'Inline Banner (Native/Responsive)'
        };
    }
  };

  const ad = getDimensions();

  return (
    <div className={`my-6 px-4 shrink-0 transition-opacity duration-300`}>
      <div className={`${ad.classes} glass-card border border-dashed border-zinc-800 rounded-xl flex flex-col justify-between p-2.5 relative overflow-hidden select-none bg-zinc-900/10`}>
        
        {/* Ad Tag Header */}
        <div className="flex items-center justify-between text-[8px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
          <div className="flex items-center gap-1">
            <Info className="w-2.5 h-2.5 text-zinc-600" />
            <span>Sponsor Ad</span>
          </div>
          <button 
            type="button"
            onClick={() => setIsVisible(false)}
            className="hover:text-zinc-300 p-0.5 rounded transition-colors"
            title="Dismiss Ad"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Central Label / Placeholder Content */}
        <div className="flex flex-col items-center justify-center flex-grow py-2 text-center">
          <div className="w-5 h-5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold flex items-center justify-center mb-1">
            AD
          </div>
          <span className="text-[10px] text-zinc-400 font-medium">
            {ad.label}
          </span>
          <span className="text-[8px] text-zinc-600 font-mono mt-0.5">
            Pre-allocated space prevents Cumulative Layout Shift (CLS)
          </span>
        </div>

        {/* Bottom subtle grid decoration */}
        <div className="absolute right-0 bottom-0 w-24 h-12 bg-red-500/5 blur-xl pointer-events-none rounded-tl-full"></div>

      </div>
    </div>
  );
}
