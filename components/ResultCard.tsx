"use client";

import React, { useState } from 'react';
import { 
  Download, Film, Image as ImageIcon, Music, Heart, Play, MessageCircle, Share2, 
  ChevronLeft, ChevronRight, User, ExternalLink, RefreshCw 
} from 'lucide-react';

interface ResultCardProps {
  result: any;
  onReset: () => void;
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const { platform, id, title, cover, author, stats, music, videoUrl, videoUrlWatermark, videoUrlHD, images, media } = result;

  const handleDownload = (url: string, filename: string) => {
    setDownloadingUrl(url);
    
    // Generate the proxy URL that forces file download headers
    const proxyUrl = `/api/download/file?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
    
    // Trigger native browser download by opening proxy URL in a new window/tab
    window.open(proxyUrl, '_blank');
    
    // Reset loading state after 1.5 seconds (gives user visual feedback of click trigger)
    setTimeout(() => {
      setDownloadingUrl(null);
    }, 1500);
  };

  const isTikTok = platform === 'tiktok';
  const hasMultipleSlides = isTikTok ? (images && images.length > 0) : (media && media.length > 1);
  const slideCount = isTikTok ? (images?.length || 0) : (media?.length || 0);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === slideCount - 1 ? 0 : prev + 1));
  };

  const getMediaUrlForDownload = () => {
    if (isTikTok) {
      return images[currentSlideIndex];
    } else {
      return media[currentSlideIndex].url;
    }
  };

  const getMediaType = () => {
    if (isTikTok) return 'image';
    return media[currentSlideIndex].type; // 'video' or 'image'
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="glass-card rounded-3xl overflow-hidden border border-red-900/35">
        
        {/* Top bar header */}
        <div className="px-6 py-4 bg-black border-b border-red-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isTikTok ? 'bg-rose-500' : 'bg-red-500'} animate-pulse`}></span>
            <span className="text-sm font-semibold tracking-wider uppercase text-zinc-300">
              {isTikTok ? 'TikTok Media Ready' : 'Instagram Media Ready'}
            </span>
          </div>
          <button 
            onClick={onReset}
            className="text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg bg-black border border-red-900/40 hover:border-red-600/50 transition-all duration-200"
          >
            Download Another
          </button>
        </div>

        {/* Card Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8">
          
          {/* Left Column: Media Preview */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-[9/16] max-h-[480px] bg-black rounded-2xl overflow-hidden border border-red-900/40 shadow-2xl flex items-center justify-center">
              
              {/* Slideshow Carousel */}
              {hasMultipleSlides ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  
                  {getMediaType() === 'video' ? (
                    <video 
                      src={getMediaUrlForDownload()} 
                      controls 
                      poster={cover}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img 
                      src={getMediaUrlForDownload()} 
                      alt={`Slide ${currentSlideIndex + 1}`}
                      className="w-full h-full object-contain"
                    />
                  )}

                  {/* Navigation Arrows */}
                  <button 
                    onClick={handlePrevSlide}
                    className="absolute left-2 p-1.5 rounded-full bg-black/90 hover:bg-red-950/40 text-red-500 border border-red-950 hover:border-red-600 transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleNextSlide}
                    className="absolute right-2 p-1.5 rounded-full bg-black/90 hover:bg-red-950/40 text-red-500 border border-red-950 hover:border-red-600 transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Pagination Badge */}
                  <span className="absolute bottom-4 bg-black text-[11px] font-mono font-bold px-3 py-1 rounded-full border border-red-950 text-zinc-200">
                    {currentSlideIndex + 1} / {slideCount}
                  </span>

                </div>
              ) : (
                /* Single Media Preview */
                <>
                  {isTikTok && videoUrl ? (
                    <video 
                      src={videoUrl} 
                      controls 
                      poster={cover} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <>
                      {media && media[0]?.type === 'video' ? (
                        <video 
                          src={media[0].url} 
                          controls 
                          poster={cover}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img 
                          src={cover || (media && media[0]?.url)} 
                          alt="Instagram content preview" 
                          className="w-full h-full object-contain"
                        />
                      )}
                    </>
                  )}
                </>
              )}

            </div>
          </div>

          {/* Right Column: Metadata & Downloads */}
          <div className="md:col-span-7 flex flex-col justify-between h-full space-y-6">
            
            {/* Metadata Info */}
            <div className="space-y-4">
              
              {/* Creator block */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-black border border-red-950 overflow-hidden shrink-0">
                  {author?.avatar ? (
                    <img src={author.avatar} alt={author.nickname} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-zinc-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100 text-sm leading-tight">
                    {author?.nickname || 'Creator Profile'}
                  </h3>
                  <p className="text-xs text-red-400 font-mono">
                    @{author?.username || 'user'}
                  </p>
                </div>
              </div>

              {/* Media Title/Caption */}
              <div>
                <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3 bg-black p-3.5 rounded-xl border border-red-950">
                  {title || 'No description provided.'}
                </p>
              </div>

              {/* Statistics Row (TikTok only) */}
              {isTikTok && stats && (
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-red-950/20 p-2 rounded-lg border border-red-900/30">
                    <Play className="w-3.5 h-3.5 mx-auto text-rose-500 mb-1" />
                    <span className="text-[10px] text-zinc-500 font-medium block">Plays</span>
                    <span className="text-[11px] font-mono font-bold text-zinc-200">
                      {stats.plays?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="bg-red-950/20 p-2 rounded-lg border border-red-900/30">
                    <Heart className="w-3.5 h-3.5 mx-auto text-rose-500 mb-1" />
                    <span className="text-[10px] text-zinc-500 font-medium block">Likes</span>
                    <span className="text-[11px] font-mono font-bold text-zinc-200">
                      {stats.likes?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="bg-red-950/20 p-2 rounded-lg border border-red-900/30">
                    <MessageCircle className="w-3.5 h-3.5 mx-auto text-red-500 mb-1" />
                    <span className="text-[10px] text-zinc-500 font-medium block">Comments</span>
                    <span className="text-[11px] font-mono font-bold text-zinc-200">
                      {stats.comments?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="bg-red-950/20 p-2 rounded-lg border border-red-900/30">
                    <Share2 className="w-3.5 h-3.5 mx-auto text-red-500 mb-1" />
                    <span className="text-[10px] text-zinc-500 font-medium block">Shares</span>
                    <span className="text-[11px] font-mono font-bold text-zinc-200">
                      {stats.shares?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Matrix Section */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Available Downloads
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* TIKTOK DOWNLOADING BUTTONS */}
                {isTikTok && (
                  <>
                    {/* No Watermark HD */}
                    {videoUrlHD && (
                      <button
                        onClick={() => handleDownload(videoUrlHD, `tiktok_hd_${id || 'download'}.mp4`)}
                        disabled={downloadingUrl !== null}
                        className="py-3 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-rose-600/10 hover:shadow-rose-500/25 hover:-translate-y-0.5"
                      >
                        {downloadingUrl === videoUrlHD ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Film className="w-4 h-4" />
                        )}
                        <span>Video (No Watermark) HD</span>
                      </button>
                    )}

                    {/* No Watermark Standard */}
                    {videoUrl && videoUrl !== videoUrlHD && (
                      <button
                        onClick={() => handleDownload(videoUrl, `tiktok_${id || 'download'}.mp4`)}
                        disabled={downloadingUrl !== null}
                        className="py-3 px-4 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-red-600/10 hover:shadow-red-500/25 hover:-translate-y-0.5"
                      >
                        {downloadingUrl === videoUrl ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        <span>Video (No Watermark) SD</span>
                      </button>
                    )}

                    {/* Watermark Video */}
                    {videoUrlWatermark && (
                      <button
                        onClick={() => handleDownload(videoUrlWatermark, `tiktok_watermark_${id || 'download'}.mp4`)}
                        disabled={downloadingUrl !== null}
                        className="py-3 px-4 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center gap-2 border border-zinc-700 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        {downloadingUrl === videoUrlWatermark ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 text-zinc-400" />
                        )}
                        <span>Video (With Watermark)</span>
                      </button>
                    )}

                    {/* Audio MP3 download */}
                    {music?.playUrl && (
                      <button
                        onClick={() => handleDownload(music.playUrl, `tiktok_audio_${id || 'download'}.mp3`)}
                        disabled={downloadingUrl !== null}
                        className="py-3 px-4 rounded-xl text-xs font-bold bg-zinc-900 border border-red-500/30 hover:border-red-500/50 hover:bg-zinc-800 text-red-400 flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        {downloadingUrl === music.playUrl ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Music className="w-4 h-4" />
                        )}
                        <span>Download MP3 Audio</span>
                      </button>
                    )}
                  </>
                )}

                {/* INSTAGRAM DOWNLOADING BUTTONS */}
                {!isTikTok && (
                  <>
                    {hasMultipleSlides ? (
                      /* Carousel download helper buttons */
                      <>
                        <button
                          onClick={() => handleDownload(getMediaUrlForDownload(), `instagram_slide_${currentSlideIndex + 1}.${getMediaType() === 'video' ? 'mp4' : 'jpg'}`)}
                          disabled={downloadingUrl !== null}
                          className="py-3 px-4 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-red-600/10 hover:shadow-red-500/25 hover:-translate-y-0.5"
                        >
                          {downloadingUrl === getMediaUrlForDownload() ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : getMediaType() === 'video' ? (
                            <Film className="w-4 h-4" />
                          ) : (
                            <ImageIcon className="w-4 h-4" />
                          )}
                          <span>Download Current Slide #{currentSlideIndex + 1}</span>
                        </button>

                        {/* Direct Links to All Slides */}
                        <div className="sm:col-span-2 bg-red-950/10 p-4 rounded-xl border border-red-950/50 mt-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                            All Slides Direct Links
                          </p>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {media.map((item: any, idx: number) => (
                              <button
                                key={idx}
                                onClick={() => handleDownload(item.url, `instagram_slide_${idx + 1}.${item.type === 'video' ? 'mp4' : 'jpg'}`)}
                                className={`py-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                                  idx === currentSlideIndex 
                                    ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                                    : 'bg-black text-red-400 border-red-950 hover:border-red-600/50 hover:text-red-300'
                                }`}
                              >
                                #{idx + 1}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Single Media Download */
                      <>
                        <button
                          onClick={() => handleDownload(media[0].url, `instagram_${media[0].type === 'video' ? 'video.mp4' : 'photo.jpg'}`)}
                          disabled={downloadingUrl !== null}
                          className="py-3 px-4 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-red-600/10 hover:shadow-red-500/25 hover:-translate-y-0.5"
                        >
                          {downloadingUrl === media[0].url ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : media[0].type === 'video' ? (
                            <Film className="w-4 h-4" />
                          ) : (
                            <ImageIcon className="w-4 h-4" />
                          )}
                          <span>Download {media[0].type === 'video' ? 'Video' : 'Image'}</span>
                        </button>

                        <a
                          href={media[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-3 px-4 rounded-xl text-xs font-semibold bg-red-950/20 hover:bg-red-950/40 text-red-400 flex items-center justify-center gap-2 border border-red-900/40 transition-all duration-300 hover:-translate-y-0.5"
                        >
                          <ExternalLink className="w-4 h-4 text-zinc-400" />
                          <span>View Direct Link</span>
                        </a>
                      </>
                    )}
                  </>
                )}

              </div>

              {/* Direct Link Warning / Instruction */}
              <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
                If the download does not start automatically, please click "View Direct Link", right-click on the media, and select "Save As...".
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
