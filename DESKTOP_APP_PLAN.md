# Torrentio Neo - Desktop App Development Plan

## 📋 Current Status

✅ **Completed:**
- React + Vite frontend with beautiful neo-brutalist UI
- Express + WebTorrent backend (for local development)
- Product showcase landing page
- GitHub repository setup
- Documentation

🚧 **In Progress:**
- Desktop app packaging

## 🎯 Desktop App Implementation Plan

### Phase 1: Technology Stack Decision

**Option A: Tauri (Recommended)**
- ✅ Already has Tauri scaffolding (removed earlier, can restore)
- Pros: Smaller bundle size, Rust-based, better security
- Cons: Requires Rust toolchain
- Status: Scaffold existed before, can be restored

**Option B: Electron**
- Pros: Easier setup, larger ecosystem
- Cons: Larger bundle size (~100MB+)
- Status: Would need new setup

**Recommendation:** Use **Tauri** (scaffolding already existed)

### Phase 2: Implementation Steps

#### Step 1: Restore Tauri Configuration
```bash
# Restore src-tauri directory
npm install --save-dev @tauri-apps/cli @tauri-apps/api
npx tauri init
```

#### Step 2: Desktop Architecture
```
Torrentio-Neo-Desktop/
├── src-tauri/
│   ├── src/
│   │   └── main.rs       # Rust backend
│   ├── icons/            # App icons
│   └── tauri.conf.json   # Tauri config
├── src/                  # React frontend (existing)
├── server/              # Express backend (existing)
└── package.json
```

#### Step 3: Backend Integration Strategy
**Current Setup:**
- Frontend: React (localhost:5173 in dev)
- Backend: Express + WebTorrent (localhost:3001)
- Communication: REST API + SSE

**Desktop App Flow:**
1. Tauri starts the Express backend automatically
2. Backend runs on localhost:3001
3. Frontend loads from bundled files
4. Communicates via HTTP to localhost

#### Step 4: Key Features to Implement
- [ ] Auto-start backend on app launch
- [ ] Minimize to system tray
- [ ] File association (.torrent files)
- [ ] Magnet link protocol handler
- [ ] Auto-updates
- [ ] Installation wizards

### Phase 3: Build & Distribution

#### Windows
```bash
npm run tauri build
# Outputs:
# - src-tauri/target/release/bundle/msi/Torrentio-Neo_1.0.0_x64_en-US.msi
# - src-tauri/target/release/bundle/nsis/Torrentio-Neo_1.0.0_x64-setup.exe
```

#### macOS
```bash
npm run tauri build
# Outputs:
# - src-tauri/target/release/bundle/dmg/Torrentio-Neo_1.0.0_x64.dmg
# - src-tauri/target/release/bundle/macos/Torrentio-Neo.app
```

#### Linux
```bash
npm run tauri build
# Outputs:
# - src-tauri/target/release/bundle/appimage/torrentio-neo_1.0.0_amd64.AppImage
# - src-tauri/target/release/bundle/deb/torrentio-neo_1.0.0_amd64.deb
```

### Phase 4: Testing Checklist
- [ ] App starts correctly
- [ ] Backend auto-starts
- [ ] Can add torrents via magnet
- [ ] Can add .torrent files
- [ ] Download/Upload works
- [ ] Streaming works
- [ ] Pause/Resume/Remove works
- [ ] Settings persist
- [ ] App closes cleanly

### Phase 5: Release
1. Tag release in git
2. Create GitHub release
3. Upload installers
4. Update showcase.html download links
5. Announce release

## 🚀 Quick Start (Desktop Development)

```bash
# Install dependencies
npm install

# Development mode (runs Tauri + backend)
npm run tauri:dev

# Build for production
npm run tauri:build
```

## 📦 Distribution Strategy

### Version 1.0 (MVP)
- Windows (MSI + NSIS)
- macOS (DMG)
- Linux (AppImage)

### Future Versions
- Auto-update mechanism
- Portable versions
- Microsoft Store (Windows)
- Mac App Store

## 🔧 Development Requirements

### For Tauri Development:
- **Windows:** Rust, MSVC, WebView2
- **macOS:** Rust, Xcode Command Line Tools
- **Linux:** Rust, GTK3, libwebkit2gtk

### System Requirements for Users:
- **Windows:** Windows 10 or later
- **macOS:** macOS 10.15 (Catalina) or later
- **Linux:** Modern distribution with WebKit2GTK

## 📝 Notes

- The web version will remain available for users who prefer browser-based access
- Desktop app will have full torrent client capabilities (no WebTorrent limitations)
- Both versions will share the same React frontend code
- Desktop app will include the Express backend bundled

## 🎨 UI/UX Considerations

- Keep the neo-brutalist design
- Ensure dark mode support
- Add system tray icon with status
- Show download speed in tray tooltip
- Add notifications for completed downloads

## 🔒 Security Considerations

- Code signing for installers (prevents warnings)
- Sandbox Tauri app
- No unnecessary permissions
- Regular dependency updates
- Security audit before release

## 📊 Success Metrics

- Download count
- GitHub stars
- User feedback
- Bug reports
- Feature requests

---

**Status:** Ready to implement Tauri desktop app
**Estimated Time:** 2-3 weeks for MVP
**Priority:** High
