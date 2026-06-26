# SnapStream Downloader Platform

SnapStream is a premium, high-performance web application designed for downloading media from Instagram and TikTok. Built with **Next.js (App Router)**, **React**, and **Tailwind CSS**, it features a fully optimized, responsive design styled around a striking black-and-red neon theme.

---

## 🚀 Key Features

* **Dual Platform Support**:
  * **TikTok**: Downloads watermark-free HD videos, watermarked videos, and direct MP3 audio tracks.
  * **Instagram**: Downloads Reels, single posts, and multi-slide carousels (with a custom interactive slide viewer).
* **CORS Download Proxy**: Custom server-side proxy route (`/api/download/file`) that fetches media from remote CDNs and streams them directly, completely bypassing browser CORS restrictions and preventing corrupted or unopenable files.
* **Smart Account Extraction**: Automatically extracts the Instagram creator's username from shared URLs (e.g., `instagram.com/username/...`) to display in the result cards.
* **Premium Black & Red Theme**:
  * Solid black background (`#000000`) with high-energy crimson glowing accents.
  * Sleek, redesigned white URL paste field and a matched red Download action button.
  * Complete removal of blue highlights, including overrides for Chrome's auto-fill light-blue box and mobile browser blue tap-flashes.
  * Clean, layout-shift-free ad placeholders preventing Cumulative Layout Shift (CLS).

---

## 📁 Directory & Component Tree

```text
├── app/
│   ├── api/
│   │   ├── download/
│   │   │   ├── file/
│   │   │   │   └── route.ts     # CORS proxy to stream files to browser
│   │   │   └── route.ts         # TikWM (TikTok) & btch-downloader (Instagram) API integration
│   │   └── layout.tsx           # Root layout, fonts, and global metadata
│   ├── page.tsx                 # Main application dashboard page
│   └── globals.css              # Dark theme styling, glows, webkit resets, and scrollbars
├── components/
│   ├── AdPlaceholder.tsx        # Responsive ad skeletons to prevent layout shift
│   ├── DownloaderForm.tsx       # White URL input bar with Paste shortcut and Download button
│   ├── Navbar.tsx               # Header with online status and navigation
│   ├── ResultCard.tsx           # Media preview, image carousel, stats, and download options
│   └── SeoFooter.tsx            # How-to steps, features checklist, and accordion FAQs
├── package.json                 # Dependency manifest
└── tsconfig.json                # TypeScript configurations
```

---

## 🛠️ Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v20.18.1 or higher recommended)
* npm (comes bundled with Node.js)

### 1. Install dependencies
Clone the repository and run:
```bash
npm install
```

### 2. Start the development server
Run the development command:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Production Build
To build and optimize the project for production deployment:
```bash
npm run build
npm run start
```

---

## ⚡ Tech Stack & Technologies Used

* **Core Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4.0](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Media Processing**: Custom API wrappers mapping to TikWM and `btch-downloader`.
