"use client";

import React, { useState } from 'react';
import { 
  Zap, DownloadCloud, Sparkles, ChevronDown, 
  HelpCircle, Lock 
} from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-black rounded-2xl border border-red-900/35 overflow-hidden transition-all duration-300 hover:border-red-600/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-semibold text-zinc-200 hover:text-red-400 hover:bg-red-950/15 transition-all duration-200"
      >
        <span className="text-sm md:text-base pr-4">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-zinc-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-red-400' : ''}`} 
        />
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[250px] border-t border-red-950/40' : 'max-h-0'
        }`}
      >
        <p className="p-5 text-sm text-zinc-400 leading-relaxed bg-black">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function SeoFooter() {
  const currentYear = new Date().getFullYear();

  const faqs = [
    {
      question: "Is this media downloader completely free to use?",
      answer: "Yes! SnapStream is 100% free. You can download as many Instagram posts, reels, and TikTok videos as you want. We do not require any credit cards, registration, or logins."
    },
    {
      question: "How do I download a TikTok video without watermarks?",
      answer: "Simply copy the share link of the TikTok video from the app or website, paste it into our input box above, and click Download. Our backend automatically extracts the HD watermark-free link (and a watermarked version if you prefer) for you to save."
    },
    {
      question: "Can I download Instagram image carousels or multiple slides?",
      answer: "Absolutely! When you enter an Instagram link with multiple images or videos, SnapStream fetches all slides. You can preview them inside our slider card and download each one individually in high quality."
    },
    {
      question: "Do you store the downloaded videos or keep logs of links?",
      answer: "No, user privacy is our top priority. We do not host, store, or duplicate any media downloaded through our service. All request payloads are processed in-memory, and direct CDN download links are served directly to your browser."
    },
    {
      question: "Is it legal to download public Instagram reels or TikTok videos?",
      answer: "Downloading public media for personal use, offline viewing, or educational reference is generally acceptable. However, you must not use downloaded content for commercial purposes, re-upload it, or claim ownership without permission from the original creators."
    }
  ];

  return (
    <footer className="w-full bg-black border-t border-red-950/50 mt-auto pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Step-by-Step Guide Section */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-outfit text-2xl md:text-3xl font-extrabold text-zinc-100">
              How to Download Instagram & TikTok Media
            </h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Follow these three simple steps to save your favorite reels, videos, and photos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="bg-black p-6 rounded-2xl border border-red-900/30 relative group hover:border-red-500/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-extrabold text-sm mb-4 font-mono">
                01
              </div>
              <h3 className="font-semibold text-zinc-200 mb-2">Copy Link</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Open the Instagram or TikTok app, navigate to the post, video, or reel, click the Share icon and select 'Copy Link'.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-black p-6 rounded-2xl border border-red-900/30 relative group hover:border-red-500/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-extrabold text-sm mb-4 font-mono">
                02
              </div>
              <h3 className="font-semibold text-zinc-200 mb-2">Paste on SnapStream</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Paste the copied URL into the downloader bar above manually or click the 'Paste' shortcut button.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-black p-6 rounded-2xl border border-red-900/30 relative group hover:border-red-500/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-extrabold text-sm mb-4 font-mono">
                03
              </div>
              <h3 className="font-semibold text-zinc-200 mb-2">Download Media</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Click the 'Download' button. Wait for extraction and select your preferred quality (HD, no-watermark, or MP3).
              </p>
            </div>

          </div>
        </div>

        {/* Feature Grid List */}
        <div id="features-section" className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-outfit text-2xl md:text-3xl font-extrabold text-zinc-100">
              Platform Features
            </h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Why use SnapStream for downloading your social media posts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="flex gap-4 items-start bg-black p-5 rounded-2xl border border-red-900/30">
              <Zap className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <h4 className="font-semibold text-zinc-200 text-sm mb-1">Super Fast</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Downloads begin instantly with no redirection loops.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-black p-5 rounded-2xl border border-red-900/30">
              <Lock className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h4 className="font-semibold text-zinc-200 text-sm mb-1">100% Secure</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">No login required, keeping your account cookies completely safe.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-black p-5 rounded-2xl border border-red-900/30">
              <DownloadCloud className="w-6 h-6 text-rose-500 shrink-0" />
              <div>
                <h4 className="font-semibold text-zinc-200 text-sm mb-1">No Limits</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Download video, audio, or slide carousels with zero daily quotas.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-black p-5 rounded-2xl border border-red-900/30">
              <Sparkles className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <h4 className="font-semibold text-zinc-200 text-sm mb-1">HD Quality</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Preserves original resolutions for pictures and video bitrates.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Accordion FAQ Component */}
        <div id="faq-section" className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-red-500/10 text-xs font-semibold text-red-400 border border-red-500/15">
              <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
            </div>
            <h2 className="font-outfit text-2xl md:text-3xl font-extrabold text-zinc-100">
              Got Questions? We Have Answers.
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Footer Brand Banner */}
        <div className="border-t border-red-950/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            <p className="font-medium text-zinc-400 mb-1">
              SnapStream Downloader Platform
            </p>
            <p>&copy; {currentYear} SnapStream. All rights reserved. Not affiliated with Instagram, Meta, or TikTok.</p>
          </div>
          
          <div className="flex gap-6 text-zinc-400 font-medium">
            <a href="#" className="hover:text-red-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-red-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-red-400 transition-colors">API Details</a>
            <a href="#" className="hover:text-red-400 transition-colors">Contact</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
