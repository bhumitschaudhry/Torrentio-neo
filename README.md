# Torrentio Neo

**Torrentio Neo** is a modern, cross-platform torrent client with a beautiful neo-brutalist design. Currently in development - coming soon for Windows, macOS, and Linux.

![Torrentio Neo](https://img.shields.io/badge/version-1.0.0--developing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Current Status

**🔨 Under Active Development**

We're building Torrentio Neo from the ground up with:
- ✅ Beautiful neo-brutalist UI design
- ✅ Cross-platform desktop architecture planned
- ✅ Open source and community-driven
- 🚧 Desktop app in development (see [DESKTOP_APP_PLAN.md](DESKTOP_APP_PLAN.md))

## ✨ Key Features

- **Beautiful Design** - Neo-brutalist interface with bold typography
- **Lightning Fast** - Built with modern technologies
- **Cross-Platform** - Windows, macOS, and Linux support
- **Privacy First** - No tracking, no telemetry
- **Stream While Downloading** - Watch videos as they download
- **Full Control** - Complete torrent management

## 📸 Screenshots

Coming soon! Check out our live showcase for UI previews.

## 🌐 Live Showcase

Visit our product showcase: **[https://bhumitschaudhry.github.io/Torrentio-neo/](https://bhumitschaudhry.github.io/Torrentio-neo/)**

See the beautiful interface and learn more about upcoming features.

## 🛠️ Development

### Tech Stack
- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Express + WebTorrent
- **Desktop:** Tauri (Rust-based)

### Project Status
- ✅ UI/UX design complete
- ✅ Frontend components built
- ✅ Backend API implemented
- 🚧 Desktop app packaging in progress
- 📋 Release planned for v1.0.0

### Roadmap
1. **Phase 1:** Complete desktop app packaging
2. **Phase 2:** Beta testing
3. **Phase 3:** Public release (Windows, macOS, Linux)
4. **Phase 4:** Auto-updates and additional features

## 🤝 Contributing

We welcome contributions! See [DESKTOP_APP_PLAN.md](DESKTOP_APP_PLAN.md) for the development roadmap.

**Quick Start:**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📋 To-Do

- [ ] Complete Tauri desktop app packaging
- [ ] Add auto-update mechanism
- [ ] Code signing for installers
- [ ] Beta testing program
- [ ] Public v1.0.0 release
- [ ] Microsoft Store submission
- [ ] Mac App Store submission

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **Website:** [https://bhumitschaudhry.github.io/Torrentio-neo/](https://bhumitschaudhry.github.io/Torrentio-neo/)
- **GitHub:** [https://github.com/bhumitschaudhry/Torrentio-neo](https://github.com/bhumitschaudhry/Torrentio-neo)
- **Desktop Plan:** [DESKTOP_APP_PLAN.md](DESKTOP_APP_PLAN.md)

## 💬 Community

- **Star** the repo if you're interested!
- **Watch** for updates
- **Issues** - Report bugs or request features
- **Discussions** - Join the conversation

---

**Torrentio Neo** - Built with ❤️ using React + Tauri

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
