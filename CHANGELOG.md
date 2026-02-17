# Changelog

All notable changes to this project are documented in this file.

## 2026-02-17 (v0.2.0)

### Changed
- **BREAKING**: Removed Tauri desktop wrapper - now a pure web-based torrent client.
- Removed all Tauri dependencies from package.json.
- Removed `src-tauri/` directory and all Tauri configuration.
- Simplified architecture to web-only (React + Vite frontend, Express + WebTorrent backend).
- Updated all documentation to reflect web-only architecture.

### Removed
- Tauri desktop integration and packaging
- Windows installer generation (msi/nsis)
- Desktop-specific startup scripts and configurations

## 2026-02-10 (v0.1.2)

## 2026-02-10 (v0.1.2)

### Changed
- Bumped release versions across project metadata:
  - `package.json` / `package-lock.json` -> `0.1.2`
  - `src-tauri/tauri.conf.json` -> `0.1.2`
  - `src-tauri/Cargo.toml` -> `0.1.2`
- Updated documentation installer references and download links to `0.1.2`.

### Built Artifacts
- `Torrentio Neo_0.1.2_x64_en-US.msi`
- `Torrentio Neo_0.1.2_x64-setup.exe`

### Validation
- `npm run tauri:build` passed for `0.1.2`.
- `npm run test:smoke` passed.

## 2026-02-10 (v0.1.1)

### Changed
- Bumped release versions across project metadata:
  - `package.json` / `package-lock.json` -> `0.1.1`
  - `src-tauri/tauri.conf.json` -> `0.1.1`
  - `src-tauri/Cargo.toml` -> `0.1.1`
- Updated documentation references and installer links to `0.1.1`.

### Fixed
- Fixed packaged desktop blank-screen issue by resolving API base dynamically:
  - Vite dev mode uses relative `/api` (proxy).
  - Packaged desktop mode uses `http://127.0.0.1:3001/api`.
- Added backend response-shape guard in frontend API client to avoid null payload crashes.
- Fixed torrent add endpoint duplicate detection logic:
  - Replaced unreliable `client.get(source)` short-circuit with active-torrent/source-based matching.
- Fixed torrent lookup by route id:
  - Replaced `client.get(id)` in lookup path to avoid phantom objects.
- Fixed files endpoint behavior before metadata:
  - `/api/torrents/:id/files` now returns an empty list instead of crashing.
  - `/api/torrents/:id/files/:index/stream` now returns `409` when metadata is not available yet.

### Added
- Added backend smoke test runner: `npm run test:smoke`.

## 2026-02-10

### Added
- Tauri desktop scaffold and packaging pipeline (`src-tauri/`, `tauri:dev`, `tauri:build`).
- Windows installer outputs via Tauri (`msi` and `nsis`).
- Comprehensive documentation set:
  - `README.md`
  - `docs/API.md`
  - `docs/DEVELOPMENT.md`
  - `docs/TAURI.md`

### Changed
- Release backend startup is hardened in `src-tauri/src/main.rs`:
  - Multiple backend script path fallbacks.
  - Multiple Node runtime resolution fallbacks.
  - Startup diagnostics to `%TEMP%\torrentio-neo-startup.log`.
- UI palette shifted to a calmer two-tone base (black/white) with a single accent color.
- Accent usage reduced across header, sidebar, stat cards, progress bars, and action controls.

### Fixed
- Removed visible CMD/console popup when launching desktop app by spawning backend with hidden window flags on Windows.

## 2026-02-09

### Added
- Backend-driven torrent management flow integrated with frontend:
  - Snapshot API
  - SSE real-time updates
  - Add/upload/pause/resume/remove flows
  - File listing and stream endpoint
