# AGENTS.md

## Codex Continuation Notes
This repository is mid-migration to Tauri desktop.

### Current Objective
Finish runtime QA and release hardening after successful Tauri integration/build.

### Current Status
- Tauri scaffold exists in `src-tauri/`.
- `package.json` includes:
  - `tauri`
  - `tauri:dev`
  - `tauri:build`
- `tauri:dev` startup validated:
  - `/api/health` returns `{"ok":true}`
  - `http://localhost:5173` returns `200`
- `tauri:build` validated and installers generated:
  - `src-tauri/target/release/bundle/msi/Torrentio Neo_0.1.2_x64_en-US.msi`
  - `src-tauri/target/release/bundle/nsis/Torrentio Neo_0.1.2_x64-setup.exe`
- Built release executable startup validated locally:
  - `src-tauri/target/release/torrentio-neo.exe` starts backend and `/api/health` returns `{"ok":true}`.
- Rust checks validated:
  - `cargo check --manifest-path src-tauri/Cargo.toml`
  - `cargo check --manifest-path src-tauri/Cargo.toml --release`

### Required First Steps in New Session
1. Run `git status -sb`.
2. Run packaged app QA from generated installer artifacts.
3. Validate torrent workflows (magnet/upload/pause/resume/delete/files/stream).
4. Add/verify frontend startup error state for backend unavailability.

### Important Technical Context
- Frontend calls relative `/api` endpoints.
- In dev, backend runs via existing `npm run dev` flow.
- In packaged build, `src-tauri/src/main.rs` starts backend in release mode and logs startup attempts to `%TEMP%\\torrentio-neo-startup.log`.
- Frontend API base resolution:
  - Vite dev mode uses `/api` proxy.
  - Packaged desktop mode calls `http://127.0.0.1:3001/api` directly to avoid blank-screen failures.
- Backend script resolution fallback order:
  1. `resource_dir/server/index.js`
  2. `exe_dir/resources/server/index.js`
  3. `exe_dir/server/index.js`
  4. `cwd/server/index.js`
- Node command fallback order:
  1. `node` (PATH)
  2. `%ProgramFiles%\\nodejs\\node.exe`
  3. `%ProgramFiles(x86)%\\nodejs\\node.exe`

### Decision Required
Current decision is set for this cycle:
1. Keep Node prerequisite and document it.

Future options (not implemented yet):
1. Ship Node/server as sidecar.
2. Migrate backend to Rust/Tauri commands.

### Editing Guidelines for Next Agent
- Keep current architecture unless explicitly changing release strategy.
- Preserve existing frontend API surface where possible.
- Validate with runnable commands before marking complete.
- Update `TAURI_PLAN.md` and `tasks.md` as progress changes.
