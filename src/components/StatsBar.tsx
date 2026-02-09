import { ArrowDown, ArrowUp, Activity, HardDrive } from 'lucide-react';
import { globalStats } from '../data/mockData';

export function StatsBar() {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Download Speed */}
      <div className="bg-acid-green border-[5px] border-brutal-black brutal-shadow px-6 py-4 flex items-center gap-4 relative min-w-[260px]">
        <div className="absolute -top-3 -left-1 bg-brutal-black px-2 py-0.5">
          <span className="text-acid-green font-display text-[10px] tracking-widest">↓ DOWNLOAD</span>
        </div>
        <ArrowDown className="w-10 h-10 text-brutal-black" strokeWidth={3.5} />
        <div>
          <span className="font-display text-[42px] leading-none text-brutal-black tracking-tight">
            {globalStats.totalDownloadSpeed.split(' ')[0]}
          </span>
          <span className="font-display text-[18px] text-brutal-black ml-1">
            {globalStats.totalDownloadSpeed.split(' ')[1]}
          </span>
        </div>
      </div>

      {/* Upload Speed */}
      <div className="bg-hot-magenta border-[5px] border-brutal-black brutal-shadow px-6 py-4 flex items-center gap-4 relative min-w-[260px]">
        <div className="absolute -top-3 -left-1 bg-brutal-black px-2 py-0.5">
          <span className="text-hot-magenta font-display text-[10px] tracking-widest">↑ UPLOAD</span>
        </div>
        <ArrowUp className="w-10 h-10 text-brutal-black" strokeWidth={3.5} />
        <div>
          <span className="font-display text-[42px] leading-none text-brutal-black tracking-tight">
            {globalStats.totalUploadSpeed.split(' ')[0]}
          </span>
          <span className="font-display text-[18px] text-brutal-black ml-1">
            {globalStats.totalUploadSpeed.split(' ')[1]}
          </span>
        </div>
      </div>

      {/* Active */}
      <div className="bg-electric-blue border-[5px] border-brutal-black brutal-shadow px-6 py-4 flex items-center gap-4 relative min-w-[200px]">
        <div className="absolute -top-3 -left-1 bg-brutal-black px-2 py-0.5">
          <span className="text-electric-blue font-display text-[10px] tracking-widest">⚡ ACTIVE</span>
        </div>
        <Activity className="w-8 h-8 text-brutal-black" strokeWidth={3} />
        <div>
          <span className="font-display text-[42px] leading-none text-brutal-black">
            {globalStats.activeTorrents}
          </span>
          <span className="font-display text-[16px] text-brutal-black ml-1">
            / {globalStats.totalTorrents}
          </span>
        </div>
      </div>

      {/* DHT / Transferred */}
      <div className="bg-brutal-yellow border-[5px] border-brutal-black brutal-shadow px-6 py-4 flex items-center gap-4 relative min-w-[200px]">
        <div className="absolute -top-3 -left-1 bg-brutal-black px-2 py-0.5">
          <span className="text-brutal-yellow font-display text-[10px] tracking-widest">DHT NODES</span>
        </div>
        <HardDrive className="w-8 h-8 text-brutal-black" strokeWidth={3} />
        <div>
          <span className="font-display text-[42px] leading-none text-brutal-black">
            {globalStats.dhtNodes}
          </span>
        </div>
      </div>
    </div>
  );
}
