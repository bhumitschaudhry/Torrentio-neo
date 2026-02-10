# Torrentio Neo

Torrentio Neo is a React + Vite frontend with an Express/WebTorrent backend, now scaffolded for Tauri desktop builds on Windows.

## Prerequisites
- Node.js 24+ and npm 11+
- Rust toolchain (stable, MSVC target on Windows)
- Visual Studio C++ build tools
- WebView2 Runtime (Windows)

## Install
```bash
npm install
```

## Run (Web Dev)
```bash
npm run dev
```

This starts:
- Vite frontend on `http://localhost:5173`
- Backend on `http://127.0.0.1:3001`

## Run (Tauri Dev)
```bash
npm run tauri:dev
```

## Build Desktop Installers
```bash
npm run tauri:build
```

Outputs:
- `src-tauri/target/release/bundle/msi/Torrentio Neo_0.1.0_x64_en-US.msi`
- `src-tauri/target/release/bundle/nsis/Torrentio Neo_0.1.0_x64-setup.exe`

## Current Release Strategy
- Backend remains `server/index.js` (Node-based).
- Tauri release startup attempts to spawn the backend automatically.
- Node.js must be installed on target machine for backend startup.

## Troubleshooting
- Backend not reachable in desktop build:
  - Check `%TEMP%\\torrentio-neo-startup.log` for startup diagnostics.
  - Ensure `node` is installed and available.
  - Verify backend manually: `http://127.0.0.1:3001/api/health`.
- Vite dev server not reachable:
  - Check `http://localhost:5173` (not only `127.0.0.1`).
- Build failures:
  - Run `npx tauri info` and verify Rust/MSVC/WebView2 status.

## Verified Environment (2026-02-10)
- OS: Windows 10.0.26200 x64
- node: 24.13.0
- npm: 11.8.0
- rustc: 1.91.1
- cargo: 1.91.1
- @tauri-apps/cli: 2.10.0
- @tauri-apps/api: 2.10.1
- tauri (Rust): 2.10.2
