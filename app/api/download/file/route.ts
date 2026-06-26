import { NextResponse } from 'next/server';

// Allowed media CDN hostnames to prevent SSRF and arbitrary local/internal file retrievals
const ALLOWED_CDN_DOMAINS = [
  'cdninstagram.com',
  'fbcdn.net',
  'tiktokcdn.com',
  'tiktokcdn-us.com',
  'ibyteimg.com',
  'tikwm.com',
  'rapidcdn.app',
  'snapinsta.app',
  'snapsave.app',
  'snaptik.app',
  'instagram.com',
  'tiktok.com'
];

function isSafeUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    
    // Enforce HTTP/HTTPS only (blocks file://, loopbacks, internal protocols)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    const hostname = url.hostname.toLowerCase();
    
    // Check if the hostname matches or ends with any of the allowed domains
    return ALLOWED_CDN_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );
  } catch (e) {
    return false;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaUrl = searchParams.get('url');
    const filename = searchParams.get('filename') || 'download';

    if (!mediaUrl) {
      return new Response('Missing URL parameter', { status: 400 });
    }

    // SSRF / Path Traversal Guard: Reject untrusted external links
    if (!isSafeUrl(mediaUrl)) {
      return new Response('Forbidden: Untrusted media source', { status: 403 });
    }

    // Fetch the remote media from CDN
    const response = await fetch(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      return new Response(`Failed to fetch media: ${response.statusText}`, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Stream the body directly to bypass large file buffering in memory (OOM Crash prevention)
    return new Response(response.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Access-Control-Allow-Origin': '*', 
      },
    });
  } catch (error: any) {
    console.error('Error proxying file download:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
