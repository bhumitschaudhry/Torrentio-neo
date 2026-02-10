# Tauri Implementation Plan and Handoff (2026-02-10)

## Goal
Convert `D:\Torrentio-neo` from a web app + Node backend into a runnable Tauri desktop app without breaking existing frontend/backend behavior.

## Current State Summary
Core Tauri integration is now implemented and validated for startup/build.

Implemented and validated:
- `npm install` completed with Tauri dependencies present.
- `npm run tauri:dev -- --no-watch` starts successfully.
- Backend health endpoint responds in dev mode: `/api/health` returns `{"ok":true}`.
- Vite frontend responds in dev mode: `http://localhost:5173` returns `200`.
- `cargo check --manifest-path src-tauri/Cargo.toml` passes.
- `cargo check --manifest-path src-tauri/Cargo.toml --release` passes.
- `npm run tauri:build` passes and generates installers.
- Built release executable starts and serves backend health in local environment (`/api/health` returns `{"ok":true}`).

Build artifacts produced:
- `src-tauri/target/release/bundle/msi/Torrentio Neo_0.1.2_x64_en-US.msi`
- `src-tauri/target/release/bundle/nsis/Torrentio Neo_0.1.2_x64-setup.exe`

## Technical Decisions (Current)
1. Keep existing backend architecture for now.
- Express/WebTorrent backend remains in `server/index.js`.

2. Keep Node runtime as current release prerequisite.
- No Node sidecar or Rust backend migration yet.

3. Keep Tauri integration via `tauri.conf.json`.
- `beforeDevCommand`: `npm run dev`
- `devUrl`: `http://localhost:5173`
- `beforeBuildCommand`: `npm run build`
- `frontendDist`: `../dist`
- `bundle.resources` includes `../server`

4. Harden release backend bootstrap.
- `src-tauri/src/main.rs` now resolves backend script from multiple locations:
  - `resource_dir/server/index.js`
  - `exe_dir/resources/server/index.js`
  - `exe_dir/server/index.js`
  - `cwd/server/index.js`
- Startup attempts are logged to `%TEMP%\torrentio-neo-startup.log`.

5. Fix packaged frontend API routing.
- In Vite dev mode, frontend uses relative `/api`.
- In packaged mode, frontend uses `http://127.0.0.1:3001/api` directly.
- Added backend response-shape guard to avoid blank-screen crashes on invalid payloads.

## Open Risks
1. Installed package behavior on clean machine still needs full test.
- Build and local release executable startup are validated, but installer-runtime behavior on a clean profile must still be tested end-to-end.

2. Node prerequisite remains a deployment risk.
- If Node is missing or not discoverable, backend cannot start.

3. Functional torrent flows in desktop app still need manual QA.
- Magnet add, upload, pause/resume/delete, files list, streaming.

## Next Actions
1. Install and run the NSIS/MSI package on a clean profile.
- Verify backend startup and `/api/health`.

2. Execute manual functional checklist in desktop app.
- Torrent creation/upload/control and stream/download paths.

3. Add frontend startup diagnostics.
- Visible UI state when backend is unreachable.
- Optional retry/backoff behavior.

4. Commit in logical chunks.
- Scaffold
- Runtime hardening
- Documentation/handoff

## Useful Commands
- `npm run tauri:dev`
- `npm run tauri:build`
- `npx tauri info`
- `cargo check --manifest-path src-tauri/Cargo.toml --release`
