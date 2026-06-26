import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaUrl = searchParams.get('url');
    const filename = searchParams.get('filename') || 'download';

    if (!mediaUrl) {
      return new Response('Missing URL parameter', { status: 400 });
    }

    // Fetch the remote media from CDN
    const response = await fetch(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    if (!response.ok) {
      return new Response(`Failed to fetch media: ${response.statusText}`, { status: response.status });
    }

    // Read the media stream as arrayBuffer
    const contentBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Return the media file directly, prompting a browser download
    return new Response(contentBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Access-Control-Allow-Origin': '*', // Allow cross-origin requests
      },
    });
  } catch (error: any) {
    console.error('Error proxying file download:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
