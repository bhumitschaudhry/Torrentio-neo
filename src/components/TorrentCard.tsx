import {
  ArrowDown,
  ArrowUp,
  Users,
  Clock,
  Pause,
  Play,
  Trash2,
  MoreHorizontal,
  Upload,
  CheckCircle,
  Loader,
} from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import type { TorrentItem } from '../data/mockData';

interface TorrentCardProps {
  torrent: TorrentItem;
  index: number;
}

export function TorrentCard({ torrent, index }: TorrentCardProps) {
  const getStatusBadge = () => {
    switch (torrent.status) {
      case 'downloading':
        return (
          <div className="bg-acid-green border-[3px] border-brutal-black px-3 py-1 flex items-center gap-1.5">
            <ArrowDown className="w-4 h-4" strokeWidth={3} />
            <span className="font-display text-[11px] text-brutal-black tracking-wider">DOWNLOADING</span>
          </div>
        );
      case 'seeding':
        return (
          <div className="bg-hot-magenta border-[3px] border-brutal-black px-3 py-1 flex items-center gap-1.5">
            <Upload className="w-4 h-4" strokeWidth={3} />
            <span className="font-display text-[11px] text-brutal-black tracking-wider">SEEDING</span>
          </div>
        );
      case 'completed':
        return (
          <div className="bg-electric-blue border-[3px] border-brutal-black px-3 py-1 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" strokeWidth={3} />
            <span className="font-display text-[11px] text-brutal-black tracking-wider">COMPLETE</span>
          </div>
        );
      case 'paused':
        return (
          <div className="bg-brutal-yellow border-[3px] border-brutal-black px-3 py-1 flex items-center gap-1.5">
            <Pause className="w-4 h-4" strokeWidth={3} />
            <span className="font-display text-[11px] text-brutal-black tracking-wider">PAUSED</span>
          </div>
        );
      case 'queued':
        return (
          <div className="bg-brutal-gray border-[3px] border-brutal-black px-3 py-1 flex items-center gap-1.5">
            <Loader className="w-4 h-4" strokeWidth={3} />
            <span className="font-display text-[11px] text-brutal-black tracking-wider">QUEUED</span>
          </div>
        );
    }
  };

  const getBorderAccent = () => {
    switch (torrent.status) {
      case 'downloading':
        return 'border-l-acid-green';
      case 'seeding':
        return 'border-l-hot-magenta';
      case 'completed':
        return 'border-l-electric-blue';
      case 'paused':
        return 'border-l-brutal-yellow';
      default:
        return 'border-l-brutal-gray';
    }
  };

  // Offset for overlapping effect
  const overlap = index > 0 ? '-mt-2' : '';

  return (
    <div
      className={`${overlap} relative z-[${10 - index}] group`}
      style={{ zIndex: 10 - index }}
    >
      <div
        className={`bg-brutal-white border-[5px] border-brutal-black border-l-[12px] ${getBorderAccent()} brutal-shadow 
          p-5 hover:translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[9px_9px_0px_#000000] 
          transition-all duration-150 relative`}
      >
        {/* Top Row: Name + Status + Actions */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-[18px] text-brutal-black leading-tight truncate pr-4">
              {torrent.name}
            </h3>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[12px] font-body font-semibold text-brutal-dark-gray bg-brutal-gray border-[2px] border-brutal-black px-2 py-0.5">
                {torrent.size}
              </span>
              <span className="text-[12px] font-body font-semibold text-brutal-dark-gray bg-brutal-gray border-[2px] border-brutal-black px-2 py-0.5">
                {torrent.category}
              </span>
              <span className="text-[11px] font-body text-brutal-dark-gray">
                Added {torrent.added}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {getStatusBadge()}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {torrent.status === 'paused' ? (
                <button className="w-[36px] h-[36px] bg-acid-green border-[3px] border-brutal-black flex items-center justify-center hover:bg-electric-blue transition-colors cursor-pointer active:translate-x-[1px] active:translate-y-[1px]">
                  <Play className="w-4 h-4 text-brutal-black" strokeWidth={3} />
                </button>
              ) : torrent.status === 'downloading' ? (
                <button className="w-[36px] h-[36px] bg-brutal-yellow border-[3px] border-brutal-black flex items-center justify-center hover:bg-hot-magenta transition-colors cursor-pointer active:translate-x-[1px] active:translate-y-[1px]">
                  <Pause className="w-4 h-4 text-brutal-black" strokeWidth={3} />
                </button>
              ) : null}
              <button className="w-[36px] h-[36px] bg-brutal-red border-[3px] border-brutal-black flex items-center justify-center hover:bg-hot-magenta transition-colors cursor-pointer active:translate-x-[1px] active:translate-y-[1px]">
                <Trash2 className="w-4 h-4 text-brutal-black" strokeWidth={3} />
              </button>
              <button className="w-[36px] h-[36px] bg-brutal-gray border-[3px] border-brutal-black flex items-center justify-center hover:bg-electric-blue transition-colors cursor-pointer active:translate-x-[1px] active:translate-y-[1px]">
                <MoreHorizontal className="w-4 h-4 text-brutal-black" strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3 pr-4">
          <ProgressBar progress={torrent.progress} status={torrent.status} />
        </div>

        {/* Bottom Stats Row */}
        <div className="flex items-center gap-4 flex-wrap">
          {(torrent.status === 'downloading' || torrent.status === 'seeding') && (
            <>
              <div className="flex items-center gap-1.5 bg-brutal-bg border-[3px] border-brutal-black px-3 py-1.5">
                <ArrowDown className="w-4 h-4 text-acid-green-dark" strokeWidth={3} />
                <span className="font-display text-[14px] text-brutal-black">{torrent.downloadSpeed}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-brutal-bg border-[3px] border-brutal-black px-3 py-1.5">
                <ArrowUp className="w-4 h-4 text-hot-magenta-dark" strokeWidth={3} />
                <span className="font-display text-[14px] text-brutal-black">{torrent.uploadSpeed}</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-1.5 bg-brutal-bg border-[3px] border-brutal-black px-3 py-1.5">
            <Users className="w-4 h-4 text-electric-blue-dark" strokeWidth={2.5} />
            <span className="font-body text-[12px] font-semibold text-brutal-black">
              {torrent.seeds} seeds · {torrent.peers} peers
            </span>
          </div>
          {torrent.status === 'downloading' && (
            <div className="flex items-center gap-1.5 bg-brutal-bg border-[3px] border-brutal-black px-3 py-1.5">
              <Clock className="w-4 h-4 text-brutal-dark-gray" strokeWidth={2.5} />
              <span className="font-body text-[12px] font-semibold text-brutal-black">ETA: {torrent.eta}</span>
            </div>
          )}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="font-body text-[11px] text-brutal-dark-gray font-semibold">
              RATIO: {torrent.ratio.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
