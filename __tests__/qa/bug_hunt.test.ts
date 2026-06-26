import { NextRequest } from 'next/server';
import { GET as fileProxyHandler } from '../../app/api/download/file/route';
import { POST as downloadHandler } from '../../app/api/download/route';

// Mock btch-downloader and other network fetch requests
jest.mock('btch-downloader', () => ({
  igdl: jest.fn(),
  ttdl: jest.fn()
}));

global.fetch = jest.fn();

describe('SnapStream QA Bug Hunt & Vulnerability Audit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // A. INPUT MALFORMATION & INJECTION EXPLOITS
  describe('Input Malformation & Injection Exploits', () => {
    
    test('Should reject XSS payloads and sanitize input gracefully without crashing', async () => {
      const maliciousPayload = "<script>alert('xss')</script>";
      const request = new NextRequest('http://localhost:3000/api/download', {
        method: 'POST',
        body: JSON.stringify({ url: maliciousPayload }),
        headers: { 'content-type': 'application/json' }
      });

      const response = await downloadHandler(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Invalid URL format');
    });

    test('Should reject SQL injection payloads in the input', async () => {
      const sqlPayload = "https://instagram.com/reel/123' OR '1'='1";
      const request = new NextRequest('http://localhost:3000/api/download', {
        method: 'POST',
        body: JSON.stringify({ url: sqlPayload }),
        headers: { 'content-type': 'application/json' }
      });

      const response = await downloadHandler(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Invalid URL format');
    });

    test('Should fail gracefully on dead short-links or malicious obfuscated domains', async () => {
      const maliciousDomain = "https://tiktok.com.maliciousdomain.com/video/123";
      const request = new NextRequest('http://localhost:3000/api/download', {
        method: 'POST',
        body: JSON.stringify({ url: maliciousDomain }),
        headers: { 'content-type': 'application/json' }
      });

      const response = await downloadHandler(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Invalid URL format');
    });
  });

  // B. ASYNC NETWORK & SCRAPER TIMEOUT MATRIX
  describe('Async Network & Scraper Failure Matrix', () => {
    
    test('Should handle scraper timeouts (>10s) gracefully', async () => {
      // Mock fetch to timeout
      (global.fetch as jest.Mock).mockImplementation(() => 
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 50))
      );

      const request = new NextRequest('http://localhost:3000/api/download', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://www.tiktok.com/@user/video/123456789' }),
        headers: { 'content-type': 'application/json' }
      });

      const response = await downloadHandler(request);
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    test('Should handle upstream API schema structural changes (empty fields or unexpected shapes)', async () => {
      // Mock a successful response but with unexpected body shape
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ code: 0, data: { id: "123", play: "" } }) // play is empty
      });

      const request = new NextRequest('http://localhost:3000/api/download', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://www.tiktok.com/@user/video/123456789' }),
        headers: { 'content-type': 'application/json' }
      });

      const response = await downloadHandler(request);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.videoUrl).toBe(""); // Safe fallback mapped
    });
  });

  // C. SSRF & DIRECT LINK TRAVERSAL SECURITY AUDIT
  describe('API Streaming SSRF & Path Traversal Security Audit', () => {
    
    test('Should block direct loopback SSRF attempts (localhost/metadata)', async () => {
      const maliciousUrls = [
        'http://localhost:3000/api/download',
        'http://127.0.0.1:80/etc/passwd',
        'http://169.254.169.254/latest/meta-data/',
        'file:///etc/passwd'
      ];

      for (const maliciousUrl of maliciousUrls) {
        const request = new NextRequest(`http://localhost:3000/api/download/file?url=${encodeURIComponent(maliciousUrl)}`);
        const response = await fileProxyHandler(request);
        expect(response.status).toBe(403);
        const text = await response.text();
        expect(text).toContain('Forbidden: Untrusted media source');
      }
    });

    test('Should allow validated TikTok and Instagram CDN domain extensions', async () => {
      const safeUrls = [
        'https://scontent.cdninstagram.com/v/t50.2886-16/safe.mp4',
        'https://instagram.fsnc1-1.fna.fbcdn.net/v/t51.2885-15/safe.jpg',
        'https://v16-ies-music.tiktokcdn-us.com/safe.mp3',
        'https://www.tikwm.com/video/media/play/safe.mp4'
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'video/mp4' }),
        body: new ReadableStream()
      });

      for (const safeUrl of safeUrls) {
        const request = new NextRequest(`http://localhost:3000/api/download/file?url=${encodeURIComponent(safeUrl)}&filename=test.mp4`);
        const response = await fileProxyHandler(request);
        expect(response.status).toBe(200);
      }
    });
  });
});
