# Tasks (Resume Tomorrow)

## High Priority
- [x] Run `npm run tauri:dev` and verify startup behavior.
- [x] Run `npm run tauri:build` and produce installers.
- [x] Decide current release backend strategy: keep Node prerequisite and document it.
- [ ] Validate packaged app runtime on a clean machine profile.

## Validation Checklist
- [x] `/api/health` responds in desktop dev mode.
- [x] Vite frontend responds in desktop dev mode (`http://localhost:5173`).
- [ ] Add torrent via magnet link works.
- [ ] Upload `.torrent` file works.
- [ ] Pause/resume/delete works.
- [ ] Files list + stream endpoint works.
- [ ] Downloads path and serving logic work in packaged app.
- [x] `/api/health` from built release executable works in local environment.
- [ ] `/api/health` from installed packaged app (not just build artifact) works.

## Hardening
- [x] Add backend startup path fallbacks in release build (`resource_dir`, `exe/resources`, `cwd`).
- [x] Add release backend startup diagnostics log (`%TEMP%\\torrentio-neo-startup.log`).
- [ ] Add frontend startup health-check with user-facing error when backend unavailable.
- [ ] Add retry/backoff around backend connectivity.
- [ ] Log backend startup failures in a user-visible UI way (currently file log only).

## Docs
- [x] Update README with Tauri setup, prerequisites, and run/build steps.
- [x] Add troubleshooting section for missing Node/WebView2/permissions.
- [x] Document exact tested versions (Node, Rust, Tauri).

## Git/Release
- [x] Review `git status -sb`.
- [ ] Commit scaffold changes.
- [ ] Commit runtime hardening changes.
- [ ] Commit docs changes.
