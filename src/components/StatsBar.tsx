import { ArrowDown, ArrowUp, Activity, HardDrive } from 'lucide-react';
import type { GlobalStats } from '../types/torrent';

interface StatsBarProps {
  stats: GlobalStats;
}

function splitMetric(metric: string) {
  const [value = '0', unit = 'KB/s'] = metric.split(' ');
  return { value, unit };
}

export function StatsBar({ stats }: StatsBarProps) {
  const download = splitMetric(stats.totalDownloadSpeed);
  const upload = splitMetric(stats.totalUploadSpeed);

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Download Speed */}
      <div className="bg-brutal-white border-[5px] border-brutal-black brutal-shadow px-6 py-4 flex items-center gap-4 relative min-w-[260px]">
        <div className="absolute -top-3 -left-1 bg-brutal-black px-2 py-0.5">
          <span className="text-acid-green font-display text-[10px] tracking-widest">↓ DOWNLOAD</span>
        </div>
        <ArrowDown className="w-10 h-10 text-acid-green" strokeWidth={3.5} />
        <div>
          <span className="font-display text-[42px] leading-none text-brutal-black tracking-tight">
            {download.value}
          </span>
          <span className="font-display text-[18px] text-brutal-black ml-1">
            {download.unit}
          </span>
        </div>
      </div>

      {/* Upload Speed */}
      <div className="bg-brutal-white border-[5px] border-brutal-black brutal-shadow px-6 py-4 flex items-center gap-4 relative min-w-[260px]">
        <div className="absolute -top-3 -left-1 bg-brutal-black px-2 py-0.5">
          <span className="text-acid-green font-display text-[10px] tracking-widest">↑ UPLOAD</span>
        </div>
        <ArrowUp className="w-10 h-10 text-acid-green" strokeWidth={3.5} />
        <div>
          <span className="font-display text-[42px] leading-none text-brutal-black tracking-tight">
            {upload.value}
          </span>
          <span className="font-display text-[18px] text-brutal-black ml-1">
            {upload.unit}
          </span>
        </div>
      </div>

      {/* Active */}
      <div className="bg-brutal-white border-[5px] border-brutal-black brutal-shadow px-6 py-4 flex items-center gap-4 relative min-w-[200px]">
        <div className="absolute -top-3 -left-1 bg-brutal-black px-2 py-0.5">
          <span className="text-acid-green font-display text-[10px] tracking-widest">⚡ ACTIVE</span>
        </div>
        <Activity className="w-8 h-8 text-acid-green" strokeWidth={3} />
        <div>
          <span className="font-display text-[42px] leading-none text-brutal-black">
            {stats.activeTorrents}
          </span>
          <span className="font-display text-[16px] text-brutal-black ml-1">
            / {stats.totalTorrents}
          </span>
        </div>
      </div>

      {/* DHT / Transferred */}
      <div className="bg-brutal-white border-[5px] border-brutal-black brutal-shadow px-6 py-4 flex items-center gap-4 relative min-w-[200px]">
        <div className="absolute -top-3 -left-1 bg-brutal-black px-2 py-0.5">
          <span className="text-acid-green font-display text-[10px] tracking-widest">DHT NODES</span>
        </div>
        <HardDrive className="w-8 h-8 text-acid-green" strokeWidth={3} />
        <div>
          <span className="font-display text-[42px] leading-none text-brutal-black">
            {stats.dhtNodes}
          </span>
        </div>
      </div>
    </div>
  );
}
