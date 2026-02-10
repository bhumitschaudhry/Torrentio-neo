# Changelog

All notable changes to this project are documented in this file.

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
