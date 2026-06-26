"use client";

import React from 'react';
import { Download, Compass, Zap, HelpCircle } from 'lucide-react';

export default function Navbar() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-red-950/80 px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 p-0.5 shadow-lg shadow-red-500/20 group-hover:shadow-red-500/35 transition-all duration-300">
            <div className="flex items-center justify-center w-full h-full bg-black rounded-[10px]">
              <Zap className="w-5 h-5 text-red-400 group-hover:text-rose-400 transition-colors duration-300 fill-red-400/25 group-hover:fill-rose-400/25" />
            </div>
          </div>
          <span className="font-outfit text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-200 bg-clip-text text-transparent group-hover:from-red-200 group-hover:to-rose-200 transition-all duration-300">
            Snap<span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent font-extrabold text-glow-primary">Stream</span>
          </span>
        </div>

        {/* Desktop Menu links */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          <button 
            onClick={() => scrollToSection('downloader-section')} 
            className="flex items-center gap-1.5 text-red-500 hover:text-red-400 transition-all duration-200 py-1.5 px-3 rounded-xl border border-transparent hover:border-red-600 focus:outline-none focus:border-red-600"
          >
            <Download className="w-4 h-4" /> Downloader
          </button>
          <button 
            onClick={() => scrollToSection('features-section')} 
            className="flex items-center gap-1.5 text-red-500 hover:text-red-400 transition-all duration-200 py-1.5 px-3 rounded-xl border border-transparent hover:border-red-600 focus:outline-none focus:border-red-600"
          >
            <Compass className="w-4 h-4" /> Features
          </button>
          <button 
            onClick={() => scrollToSection('faq-section')} 
            className="flex items-center gap-1.5 text-red-500 hover:text-red-400 transition-all duration-200 py-1.5 px-3 rounded-xl border border-transparent hover:border-red-600 focus:outline-none focus:border-red-600"
          >
            <HelpCircle className="w-4 h-4" /> FAQ
          </button>
        </div>

        {/* Action badge / status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-red-950/30 border border-red-500/30 text-[11px] font-mono text-red-400 font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            Online
          </div>
        </div>

      </div>
    </nav>
  );
}
