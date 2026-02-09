import { ArrowDown, ArrowUp, HardDrive, Globe, Shield } from 'lucide-react';
import { globalStats } from '../data/mockData';

export function BottomBar() {
  return (
    <div className="fixed bottom-0 left-[100px] right-0 z-50 bg-brutal-black border-t-[5px] border-brutal-black">
      <div className="flex items-center justify-between px-6 py-2">
        {/* Left stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <ArrowDown className="w-4 h-4 text-acid-green" strokeWidth={3} />
            <span className="font-display text-[13px] text-acid-green">{globalStats.totalDownloadSpeed}</span>
          </div>
          <div className="w-[3px] h-4 bg-brutal-dark-gray" />
          <div className="flex items-center gap-1.5">
            <ArrowUp className="w-4 h-4 text-hot-magenta" strokeWidth={3} />
            <span className="font-display text-[13px] text-hot-magenta">{globalStats.totalUploadSpeed}</span>
          </div>
          <div className="w-[3px] h-4 bg-brutal-dark-gray" />
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-electric-blue" strokeWidth={2.5} />
            <span className="font-body text-[11px] text-brutal-gray font-semibold">
              ↓ {globalStats.totalDownloaded} · ↑ {globalStats.totalUploaded}
            </span>
          </div>
        </div>

        {/* Right info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-acid-green" strokeWidth={2.5} />
            <span className="font-body text-[11px] text-brutal-gray font-semibold">ENCRYPTED</span>
          </div>
          <div className="w-[3px] h-4 bg-brutal-dark-gray" />
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-electric-blue" strokeWidth={2.5} />
            <span className="font-body text-[11px] text-brutal-gray font-semibold">DHT: {globalStats.dhtNodes}</span>
          </div>
          <div className="w-[3px] h-4 bg-brutal-dark-gray" />
          <div className="bg-acid-green px-2 py-0.5 border-[2px] border-acid-green-dark">
            <span className="font-display text-[9px] text-brutal-black tracking-wider">PORT: OPEN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
