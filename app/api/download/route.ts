import { NextResponse } from 'next/server';
import { igdl, ttdl } from 'btch-downloader';
import { createHash } from 'crypto';

function withTimeout<T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject(new Error(errorMsg));
      }, ms);
    })
  ]);
}

// Server-side sliding-window rate limit store using client IP hashes
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function handleRateLimit(ip: string): { limited: boolean; remaining: number } {
  const now = Date.now();
  const LIMIT = 20; // Max 20 requests per hour
  const WINDOW_MS = 60 * 60 * 1000; // 1 hour window

  const ipHash = createHash('sha256').update(ip).digest('hex');
  const record = rateLimitStore.get(ipHash);

  if (!record) {
    rateLimitStore.set(ipHash, { count: 1, resetTime: now + WINDOW_MS });
    return { limited: false, remaining: LIMIT - 1 };
  }

  if (now > record.resetTime) {
    rateLimitStore.set(ipHash, { count: 1, resetTime: now + WINDOW_MS });
    return { limited: false, remaining: LIMIT - 1 };
  }

  if (record.count >= LIMIT) {
    return { limited: true, remaining: 0 };
  }

  record.count += 1;
  return { limited: false, remaining: LIMIT - record.count };
}

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Check (Server-side IP hashing)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const rateLimit = handleRateLimit(ip);
    if (rateLimit.limited) {
      return NextResponse.json({ error: 'Too many requests. Please try again in an hour.' }, { status: 429 });
    }

    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Please provide a valid URL' }, { status: 400 });
    }

    const cleanUrl = url.trim();

    // 2. Input Length Sanitization
    if (cleanUrl.length > 1000) {
      return NextResponse.json({ error: 'URL is too long. Limit is 1000 characters.' }, { status: 400 });
    }

    // 3. Strict Domain Formatting Regex
    const isTikTok = /^(https?:\/\/)?([a-z0-9-]+\.)?(tiktok\.com)\/[A-Za-z0-9_.\-\/@%]+(\?[^"'\s<>]*)?$/i.test(cleanUrl);
    const isInstagram = /^(https?:\/\/)?([a-z0-9-]+\.)?(instagram\.com|instagr\.am)\/[A-Za-z0-9_.\-\/@%]+(\?[^"'\s<>]*)?$/i.test(cleanUrl);

    if (!isTikTok && !isInstagram) {
      return NextResponse.json({ error: 'Invalid URL format. Only valid TikTok and Instagram links are allowed.' }, { status: 400 });
    }

    // 4. Check for TikTok URL
    if (isTikTok) {
      try {
        // Try TikWM first with a timeout
        const res = await fetch("https://www.tikwm.com/api/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
          body: new URLSearchParams({
            url: cleanUrl,
            web: "1",
            hd: "1"
          }),
          signal: AbortSignal.timeout(6000)
        });

        if (!res.ok) {
          throw new Error(`TikWM API failed with status ${res.status}`);
        }

        const data = await res.json();
        if (data.code !== 0 || !data.data) {
          throw new Error(data.msg || "Failed to parse TikTok video");
        }

        const tk = data.data;
        
        // Helper to ensure absolute URL for TikWM paths
        const absoluteUrl = (path: string) => {
          if (!path) return "";
          if (path.startsWith('http://') || path.startsWith('https://')) return path;
          return `https://www.tikwm.com${path.startsWith('/') ? '' : '/'}${path}`;
        };

        return NextResponse.json({
          platform: 'tiktok',
          success: true,
          id: tk.id,
          title: tk.title || "TikTok Video",
          duration: tk.duration || 0,
          cover: absoluteUrl(tk.cover),
          videoUrl: absoluteUrl(tk.play), // Direct watermark-free link
          videoUrlWatermark: absoluteUrl(tk.wmplay),
          videoUrlHD: absoluteUrl(tk.hdplay || tk.play),
          images: (tk.images || []).map((img: string) => absoluteUrl(img)), // Slideshow images
          music: {
            title: tk.music_info?.title || "Original Sound",
            author: tk.music_info?.author || "",
            playUrl: absoluteUrl(tk.music_info?.play || tk.music)
          },
          author: {
            username: tk.author?.unique_id || "tiktok_user",
            nickname: tk.author?.nickname || "TikTok User",
            avatar: absoluteUrl(tk.author?.avatar)
          },
          stats: {
            plays: tk.play_count || 0,
            likes: tk.digg_count || 0,
            comments: tk.comment_count || 0,
            shares: tk.share_count || 0
          }
        });
      } catch (err: any) {
        console.warn("TikWM failed or timed out, trying fallback ttdl...", err);
        try {
          // Fallback: Try btch-downloader ttdl with a timeout
          const data = await withTimeout(ttdl(cleanUrl), 6000, "Fallback TikTok extraction timed out");
          if (!data || !data.status || (!data.video && !data.audio)) {
            throw new Error(data?.message || "Failed to parse TikTok video via fallback");
          }

          return NextResponse.json({
            platform: 'tiktok',
            success: true,
            id: 'download',
            title: data.title || "TikTok Video",
            duration: 0,
            cover: data.thumbnail || "",
            videoUrl: data.video?.[0] || "",
            videoUrlWatermark: "",
            videoUrlHD: data.video?.[0] || "",
            images: [],
            music: {
              title: data.title_audio || "Original Sound",
              author: "",
              playUrl: data.audio?.[0] || ""
            },
            author: {
              username: "tiktok_user",
              nickname: "TikTok User",
              avatar: ""
            },
            stats: {
              plays: 0,
              likes: 0,
              comments: 0,
              shares: 0
            }
          });
        } catch (fallbackErr: any) {
          console.error("TikTok download error (primary and fallback failed):", fallbackErr);
          return NextResponse.json({ error: fallbackErr.message || "Failed to download TikTok video" }, { status: 500 });
        }
      }
    }

    // 2. Check for Instagram URL
    if (
      cleanUrl.includes('instagram.com') ||
      cleanUrl.includes('instagr.am')
    ) {
      try {
        const results = await withTimeout(igdl(cleanUrl), 8000, "Instagram media extraction timed out. Please try again.");
        if (!results) {
          throw new Error("No media found. Make sure it is a public post/reel.");
        }

        // Standardize result
        let media: any[] = [];
        const checkIsVideo = (mediaUrl: string) => {
          if (!mediaUrl) return false;
          if (
            cleanUrl.includes('/reel/') || 
            cleanUrl.includes('/reels/') || 
            cleanUrl.includes('/tv/')
          ) {
            return true;
          }
          const lowUrl = mediaUrl.toLowerCase();
          if (lowUrl.includes('.mp4')) return true;
          if (lowUrl.includes('/t50.') || lowUrl.includes('/v/t50.')) return true;
          if (lowUrl.includes('/t58.') || lowUrl.includes('/v/t58.')) return true;
          if (lowUrl.includes('/v/') && (lowUrl.includes('fbcdn.net') || lowUrl.includes('cdninstagram.com'))) {
            if (!lowUrl.includes('/t51.') && !lowUrl.includes('/t53.') && !lowUrl.includes('/t55.')) {
              return true;
            }
          }
          return false;
        };

        if (Array.isArray(results)) {
          media = results.map(item => {
            if (typeof item === 'string') {
              return { url: item, type: checkIsVideo(item) ? 'video' : 'image' };
            } else if (item && typeof item === 'object') {
              const link = item.url || item.downloadUrl || item.link || item.thumbnail;
              return {
                url: link,
                type: (item.type === 'video' || checkIsVideo(link) || checkIsVideo(item.url)) ? 'video' : 'image',
                thumbnail: item.thumbnail || item.preview || link
              };
            }
            return null;
          }).filter(Boolean);
        } else if (typeof results === 'object') {
          const resData = (results as any).result || (results as any).data || results;
          if (Array.isArray(resData)) {
            media = resData.map(item => {
              if (typeof item === 'string') {
                return { url: item, type: checkIsVideo(item) ? 'video' : 'image' };
              } else {
                const link = item.url || item.downloadUrl || item.link;
                return {
                  url: link,
                  type: (item.type === 'video' || checkIsVideo(link)) ? 'video' : 'image',
                  thumbnail: item.thumbnail || item.preview || link
                };
              }
            });
          } else if (typeof resData === 'string') {
            media = [{ url: resData, type: checkIsVideo(resData) ? 'video' : 'image' }];
          } else {
            const link = resData.url || resData.downloadUrl || resData.link;
            if (link) {
              media = [{
                url: link,
                type: (resData.type === 'video' || checkIsVideo(link)) ? 'video' : 'image',
                thumbnail: resData.thumbnail || resData.preview || link
              }];
            }
          }
        }

        if (media.length === 0) {
          throw new Error("Failed to extract any download links from this Instagram URL. Make sure it is a public reel or post.");
        }

        // Try parsing username from the URL path
        let parsedUsername = "instagram_creator";
        try {
          const pathParts = new URL(cleanUrl).pathname.split('/').filter(Boolean);
          if (pathParts.length >= 3 && (pathParts[1] === 'p' || pathParts[1] === 'reel' || pathParts[1] === 'reels' || pathParts[1] === 'tv')) {
            parsedUsername = pathParts[0];
          }
        } catch (e) {}

        // Generate response
        return NextResponse.json({
          platform: 'instagram',
          success: true,
          title: "Instagram Post",
          cover: media[0].thumbnail || media[0].url,
          media: media, // Array of { url: string, type: 'video' | 'image', thumbnail?: string }
          author: {
            username: parsedUsername,
            nickname: parsedUsername !== "instagram_creator" ? parsedUsername : "Instagram Creator",
            avatar: ""
          }
        });
      } catch (err: any) {
        console.error("Instagram download error:", err);
        return NextResponse.json({ error: err.message || "Failed to download Instagram video or images" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Unsupported URL. Please enter a valid Instagram or TikTok link.' }, { status: 400 });

  } catch (err: any) {
    console.error("Internal API error:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
