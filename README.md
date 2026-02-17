# Torrentio Neo

Torrentio Neo is a web-based torrent client with:
- React + Vite frontend
- Express + WebTorrent backend

It provides live torrent status, upload/magnet ingestion, pause/resume/remove controls, file listing, and stream endpoints - all from your browser.

## Table of Contents
1. [Core Features](#core-features)
2. [Live Demo](#live-demo)
3. [Architecture](#architecture)
4. [Repository Structure](#repository-structure)
5. [Prerequisites](#prerequisites)
6. [Quick Start](#quick-start)
7. [Run Modes](#run-modes)
8. [Validation](#validation)
9. [Configuration](#configuration)
10. [API Overview](#api-overview)
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
- Fully functional from your browser window.

## Live Demo
🌐 **Try it live:** [https://bhumitschaudhry.github.io/torrentio-neo/](https://bhumitschaudhry.github.io/torrentio-neo/)

> **Note:** The live demo requires a local backend server running. See [Quick Start](#quick-start) for running the full application.

## Architecture
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
- Backend unreachable:
  - Check `http://127.0.0.1:3001/api/health`.
  - Confirm Node is installed and discoverable (`node -v`).
- Frontend unreachable:
  - Verify `http://localhost:5173`.
  - Ensure Vite process is running.
- Port conflicts:
  - Ensure ports `5173` and `3001` are not already in use.

## Known Limitations
- No authentication layer on backend API endpoints.
- Streaming endpoint uses generic `application/octet-stream` content type.

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
