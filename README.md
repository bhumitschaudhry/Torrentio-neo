# Torrentio Neo

Torrentio Neo is a **fully browser-based torrent client** that runs entirely in your browser using WebTorrent and WebRTC. No backend setup required - just open the website and start torrenting!

## Table of Contents
1. [Core Features](#core-features)
2. [Live Demo](#live-demo)
3. [How It Works](#how-it-works)
4. [Repository Structure](#repository-structure)
5. [Quick Start](#quick-start)
6. [Development](#development)
7. [Troubleshooting](#troubleshooting)
8. [Known Limitations](#known-limitations)
9. [Recent Changes](#recent-changes)

## Core Features
- ✅ **Zero Setup** - Runs entirely in your browser, no installation required
- ✅ **Instant Torrenting** - Add torrents via magnet URI or torrent URL
- ✅ **File Upload** - Upload local `.torrent` files
- ✅ **Full Control** - Pause, resume, and remove torrents
- ✅ **Real-time Updates** - Live progress tracking and statistics
- ✅ **Stream Media** - Stream video/audio directly in your browser
- ✅ **Privacy First** - All torrent activity happens locally in your browser

## Live Demo
🌐 **Try it now:** [https://bhumitschaudhry.github.io/torrentio-neo/](https://bhumitschaudhry.github.io/torrentio-neo/)

Just visit the URL and start adding torrents - nothing to install!

## How It Works
- Frontend: `src/` (React + TypeScript + Tailwind).
- Backend: `server/index.js` (Express + WebTorrent).

### Runtime data flow
1. Frontend calls `/api/*`.
2. Vite proxy (dev) forwards `/api` and `/downloads` to backend at `127.0.0.1:3001`.
3. Backend emits snapshots over `/api/events` every 1.5s and on torrent events.
4. Frontend maintains state via SSE with polling fallback.

## Repository Structure
```text
src/                  React frontend
server/               Express + WebTorrent backend
downloads/            Torrent payload output directory (default)
README.md             Project overview and operations guide
docs/API.md           Endpoint reference
docs/DEVELOPMENT.md   Developer workflow and conventions
```

## Prerequisites
- Node.js 24+
- npm 11+

## Quick Start
```bash
npm install
npm run dev
```

After startup:
- Frontend: `http://localhost:5173`
- Backend health: `http://127.0.0.1:3001/api/health`

## Run Modes

### Web mode (frontend + backend)
```bash
npm run dev
```

### Frontend only
```bash
npm run dev:frontend
```

### Backend only
```bash
npm run dev:backend
```

### Production frontend build preview
```bash
npm run build
npm run preview
```

### Backend smoke validation
```bash
npm run test:smoke
```

## Validation
- `npm run test:smoke` validates backend API health and core torrent operations:
  - add
  - pause/resume
  - files listing
  - stream pre-metadata handling
  - delete

## Configuration
Backend environment variables (`server/index.js`):
- `HOST` default: `127.0.0.1`
- `PORT` default: `3001`
- `TORRENTIO_DOWNLOAD_DIR` default: `<repo>/downloads`

Example:
```bash
set HOST=127.0.0.1
set PORT=3001
set TORRENTIO_DOWNLOAD_DIR=D:\Torrentio-neo\downloads
npm run dev:backend
```

## API Overview
Base URL: `/api`

Main endpoints:
- `GET /health`
- `GET /events` (SSE stream)
- `GET /torrents`
- `POST /torrents`
- `POST /torrents/upload`
- `POST /torrents/:id/pause`
- `POST /torrents/:id/resume`
- `DELETE /torrents/:id`
- `GET /torrents/:id/files`
- `GET /torrents/:id/files/:index/stream`

Detailed request/response reference lives in `docs/API.md`.

## Troubleshooting

### Browser Compatibility
- **Best performance:** Chrome, Firefox, Edge (latest versions)
- **WebRTC support required:** Safari works but may have limited WebRTC support
- Check WebRTC support: [https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/)

### Torrent Not Downloading
- **Slow or stuck downloads:** WebTorrent relies on WebRTC peers. Some torrents may have few WebRTC-compatible peers
- ** magnet links not working:** Ensure the magnet link is complete and valid
- **No peers:** Traditional BitTorrent clients (μTorrent, qBittorrent) don't support WebRTC, so WebTorrent clients can't connect to them directly

### Streaming Issues
- **Video won't play:** Wait for more of the file to download (check progress bar)
- **Buffering:** Pause and let more download before resuming playback

### Browser Errors
- **"WebRTC not supported":** Your browser doesn't support WebRTC. Try Chrome or Firefox
- **"Cannot add torrent":** The magnet link may be invalid or the torrent file may be corrupted

## Known Limitations
- **WebRTC-only peers:** Can only connect to other WebTorrent clients, not traditional BitTorrent clients
- **Speed depends on WebRTC peers:** May be slower than traditional clients for torrents with few WebRTC peers
- **Browser memory limits:** Very large torrents may consume significant browser memory
- **No seeding after page close:** Torrents stop when you close the browser tab

## Recent Changes
- Removed Tauri desktop wrapper - now a pure web-based torrent client.
- UI theme toned down to black/white + single accent for reduced eye strain.

See full history in `CHANGELOG.md`.

## Version Snapshot
Validated locally on 2026-02-17:
- App version: `0.1.2`
- OS: Windows 10.0.26200 x64
- node: 24.13.0
- npm: 11.8.0

## Additional Docs
- `CHANGELOG.md`
- `docs/API.md`
- `docs/DEVELOPMENT.md`
