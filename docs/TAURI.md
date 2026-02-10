# Tauri Desktop Notes

## Purpose
This document describes desktop runtime behavior, packaging choices, and operational constraints for `src-tauri/`.

## Config Summary
Main config: `src-tauri/tauri.conf.json`

Important values:
- `build.beforeDevCommand`: `npm run dev`
- `build.devUrl`: `http://localhost:5173`
- `build.beforeBuildCommand`: `npm run build`
- `build.frontendDist`: `../dist`
- `bundle.resources`: includes `../server`
- `bundle.targets`: `all`

## Runtime Strategy
The app currently keeps the Node backend architecture:
- Frontend runs inside Tauri webview.
- Backend remains `server/index.js`.
- Release startup attempts to spawn backend from Rust `setup`.
- Backend process is launched without opening a visible console window on Windows.

## Release Backend Startup Logic
Implemented in `src-tauri/src/main.rs`.

### Script resolution order
1. `resource_dir/server/index.js`
2. `exe_dir/resources/server/index.js`
3. `exe_dir/server/index.js`
4. `cwd/server/index.js`

### Node resolution order
1. `node` from PATH
2. `%ProgramFiles%\\nodejs\\node.exe`
3. `%ProgramFiles(x86)%\\nodejs\\node.exe`

### Window behavior
- Node backend child process is spawned with hidden-window flags on Windows.
- Standard IO is detached (`stdin/stdout/stderr` set to null) to avoid console flicker.

## Diagnostics
Startup attempts are logged to:
- `%TEMP%\\torrentio-neo-startup.log`

Log includes:
- resolved backend script path
- which node candidate was attempted
- startup failure reasons
- successful child process PID

## Build Outputs
Current documented release version: `0.1.2`.

After `npm run tauri:build`:
- `src-tauri/target/release/torrentio-neo.exe`
- `src-tauri/target/release/bundle/msi/Torrentio Neo_0.1.2_x64_en-US.msi`
- `src-tauri/target/release/bundle/nsis/Torrentio Neo_0.1.2_x64-setup.exe`

## Operational Constraint
Current release requires Node on target system. If Node is unavailable, backend startup fails and API calls will not work.

## Future Hardening Options
- Package Node runtime as sidecar with installer.
- Replace Node backend with Rust-native commands/services.
- Add UI-level backend bootstrap status and retry flow.

## Recent Desktop Changes
- Tauri scaffold and installer generation enabled.
- Backend startup path and Node fallback logic added.
- Startup diagnostic logging added.
- CMD popup on app startup fixed.
- Packaged blank-screen issue fixed by using direct backend API base outside Vite dev mode.

## Validation Commands
```bash
npx tauri info
cargo check --manifest-path src-tauri/Cargo.toml --release
npm run tauri:dev
npm run tauri:build
```
