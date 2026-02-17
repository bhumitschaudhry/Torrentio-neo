# AGENTS.md

## Codex Continuation Notes
This repository is a web-based torrent client using React + Vite frontend with Express + WebTorrent backend.

### Current Objective
Maintain and improve the web-based torrent client functionality.

### Current Status
- Pure web application - removed Tauri desktop wrapper.
- Frontend: React + TypeScript + Tailwind CSS running on Vite dev server.
- Backend: Express + WebTorrent running on port 3001.
- All torrent operations work from the browser interface:
  - Add torrents via magnet/URL or file upload
  - Monitor progress with real-time SSE updates
  - Pause/resume/remove torrents
  - Browse files and stream media

### Required First Steps in New Session
1. Run `git status -sb`.
2. Run `npm install` if dependencies are missing.
3. Run `npm run dev` to start both frontend and backend.
4. Validate core workflows (magnet/upload/pause/resume/delete/files/stream).

### Important Technical Context
- Frontend calls relative `/api` endpoints.
- In dev, Vite proxy forwards `/api` and `/downloads` to backend at `127.0.0.1:3001`.
- Frontend API base resolution:
  - Vite dev mode uses `/api` proxy.
  - Production build can call `http://127.0.0.1:3001/api` directly if backend is running.
- Backend runs on Node.js and uses WebTorrent for torrent operations.

### Editing Guidelines for Next Agent
- Keep the web-based architecture.
- Preserve existing frontend API surface where possible.
- Validate with runnable commands before marking complete.
- Test all changes work in browser environment.
