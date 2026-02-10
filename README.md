# Torrentio Neo

Torrentio Neo is a desktop-ready torrent manager with:
- React + Vite frontend
- Express + WebTorrent backend
- Tauri desktop packaging for Windows

It provides live torrent status, upload/magnet ingestion, pause/resume/remove controls, file listing, and stream endpoints.

## Table of Contents
1. [Core Features](#core-features)
2. [Architecture](#architecture)
3. [Repository Structure](#repository-structure)
4. [Prerequisites](#prerequisites)
5. [Quick Start](#quick-start)
6. [Run Modes](#run-modes)
7. [Validation](#validation)
8. [Configuration](#configuration)
9. [API Overview](#api-overview)
10. [Tauri Packaging](#tauri-packaging)
11. [Troubleshooting](#troubleshooting)
12. [Known Limitations](#known-limitations)
13. [Recent Changes](#recent-changes)
14. [Version Snapshot](#version-snapshot)
15. [Additional Docs](#additional-docs)

## Core Features
- Add torrents via magnet URI / torrent URL.
- Upload local `.torrent` files.
- Pause, resume, and remove torrents.
- Live torrent and aggregate stats updates via Server-Sent Events (SSE).
- File listing per torrent and byte-range streaming endpoint.
- Desktop installers generated through Tauri (`msi` and `nsis`).

## Architecture
- Frontend: `src/` (React + TypeScript + Tailwind).
- Backend: `server/index.js` (Express + WebTorrent).
- Desktop shell: `src-tauri/` (Rust + Tauri v2).

### Runtime data flow
1. Frontend calls `/api/*`.
2. Vite proxy (dev) forwards `/api` and `/downloads` to backend at `127.0.0.1:3001`.
3. Backend emits snapshots over `/api/events` every 1.5s and on torrent events.
4. Frontend maintains state via SSE with polling fallback.

## Repository Structure
```text
src/                  React frontend
server/               Express + WebTorrent backend
src-tauri/            Tauri Rust app and packaging config
downloads/            Torrent payload output directory (default)
releases/             Published Windows installers
README.md             Project overview and operations guide
docs/API.md           Endpoint reference
docs/DEVELOPMENT.md   Developer workflow and conventions
docs/TAURI.md         Desktop runtime and packaging details
```

## Prerequisites

### Web development only
- Node.js 24+
- npm 11+

### Tauri desktop development/build (Windows)
- Rust stable toolchain (`x86_64-pc-windows-msvc`)
- Visual Studio C++ Build Tools / MSVC toolchain
- WebView2 Runtime

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

### Tauri desktop dev
```bash
npm run tauri:dev
```

### Tauri desktop installers
```bash
npm run tauri:build
```

Installer outputs:
- `src-tauri/target/release/bundle/msi/Torrentio Neo_0.1.2_x64_en-US.msi`
- `src-tauri/target/release/bundle/nsis/Torrentio Neo_0.1.2_x64-setup.exe`

Direct download links:
- [Windows Installer (MSI)](./releases/Torrentio%20Neo_0.1.2_x64_en-US.msi)
- [Windows Setup (EXE)](./releases/Torrentio%20Neo_0.1.2_x64-setup.exe)

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

## Tauri Packaging
Current strategy:
- Bundle frontend static assets + backend `server/` resources.
- On release startup, Rust bootstrap attempts to spawn backend with Node.
- Node must be present on target machine.

Startup diagnostics:
- `%TEMP%\torrentio-neo-startup.log`

Detailed desktop/runtime notes live in `docs/TAURI.md`.

## Troubleshooting
- Backend unreachable:
  - Check `http://127.0.0.1:3001/api/health`.
  - Inspect `%TEMP%\torrentio-neo-startup.log` for desktop runs.
  - Confirm Node is installed and discoverable (`node -v`).
- Frontend unreachable:
  - Verify `http://localhost:5173`.
  - Ensure Vite process is running.
- Tauri build failures:
  - Run `npx tauri info`.
  - Verify MSVC, Rust, and WebView2 setup.
- Port conflicts:
  - Ensure ports `5173` and `3001` are not already in use.

## Known Limitations
- Packaged app currently depends on system Node runtime for backend startup.
- No authentication layer on backend API endpoints.
- Streaming endpoint uses generic `application/octet-stream` content type.
- Full installer-runtime QA on a clean machine profile should still be part of release validation.

## Recent Changes
- Released `v0.1.2` with refreshed Windows installers and synchronized version metadata.
- Tauri desktop integration completed and validated (`tauri:dev`, `tauri:build`).
- Backend startup hardening for packaged runtime with diagnostics logging.
- Windows CMD popup removed on desktop launch (backend now spawns hidden).
- Fixed packaged desktop blank-screen issue by routing API calls directly to `http://127.0.0.1:3001` outside Vite dev mode.
- UI theme toned down to black/white + single accent for reduced eye strain.

See full history in `CHANGELOG.md`.

## Version Snapshot
Validated locally on 2026-02-10:
- App version: `0.1.2`
- OS: Windows 10.0.26200 x64
- node: 24.13.0
- npm: 11.8.0
- rustc: 1.91.1
- cargo: 1.91.1
- @tauri-apps/cli: 2.10.0
- @tauri-apps/api: 2.10.1
- tauri (Rust crate): 2.10.2

## Additional Docs
- `CHANGELOG.md`
- `docs/API.md`
- `docs/DEVELOPMENT.md`
- `docs/TAURI.md`
