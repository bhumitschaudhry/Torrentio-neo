# Development Guide

## Stack
- Frontend: React 19 + TypeScript + Vite + Tailwind
- Backend: Express 5 + WebTorrent
- Desktop: Tauri 2 (Rust)

## Scripts
- `npm run dev` start frontend and backend concurrently
- `npm run dev:frontend` run Vite only
- `npm run dev:backend` run backend only
- `npm run test:smoke` run backend smoke test suite
- `npm run build` build frontend assets
- `npm run preview` preview frontend build
- `npm run tauri:dev` run desktop dev shell
- `npm run tauri:build` build desktop installers

## Local Workflow
1. Install dependencies:
```bash
npm install
```

2. Start web dev stack:
```bash
npm run dev
```

3. Verify health:
- `http://localhost:5173`
- `http://127.0.0.1:3001/api/health`

4. Run desktop dev:
```bash
npm run tauri:dev
```

5. Run smoke validation:
```bash
npm run test:smoke
```

## Backend Notes
- Backend host/port are controlled by `HOST` and `PORT`.
- Download output path controlled by `TORRENTIO_DOWNLOAD_DIR`.
- SSE updates are emitted periodically and on torrent events.

## Frontend-Backend Contract
- Frontend talks to `/api` relative path.
- `vite.config.ts` proxies `/api` and `/downloads` to `127.0.0.1:3001` in dev.
- Frontend hook `useTorrentBackend` uses:
  - initial snapshot fetch
  - SSE stream (`/api/events`)
  - polling fallback every 1.5 seconds

## Project Conventions
- Keep API responses backward-compatible with `src/types/torrent.ts`.
- Preserve existing `/api` endpoint routes when adding new UI features.
- Keep visual system in black/white + one accent unless a change is explicitly requested.
- Keep changes split by scope when committing:
  - `feat(tauri): ...`
  - `feat(backend): ...`
  - `feat(ui): ...`
  - `docs: ...`

## QA Checklist
- Add torrent via magnet URI.
- Upload `.torrent`.
- Pause and resume torrent.
- Remove torrent.
- Open first streamable file from torrent.
- Confirm stats and list update in near real-time.

## Useful Commands
```bash
git status -sb
npx tauri info
cargo check --manifest-path src-tauri/Cargo.toml
cargo check --manifest-path src-tauri/Cargo.toml --release
```

## Common Local Issues
- Port busy (`3001` or `5173`):
  - stop conflicting process or use different env values for backend.
- Backend starts but UI disconnected:
  - verify Vite proxy targets and backend health endpoint.
- Tauri dev hangs in terminal:
  - expected behavior for long-running desktop dev process.
