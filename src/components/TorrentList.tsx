import { TorrentCard } from './TorrentCard';
import type { TorrentItem } from '../data/mockData';

interface TorrentListProps {
  torrents: TorrentItem[];
  activeTab: string;
}

export function TorrentList({ torrents, activeTab }: TorrentListProps) {
  const filteredTorrents = torrents.filter((t) => {
    switch (activeTab) {
      case 'downloads':
        return t.status === 'downloading' || t.status === 'paused' || t.status === 'queued';
      case 'seeding':
        return t.status === 'seeding';
      case 'completed':
        return t.status === 'completed';
      case 'all':
      default:
        return true;
    }
  });

  const getTabTitle = () => {
    switch (activeTab) {
      case 'downloads':
        return 'ACTIVE DOWNLOADS';
      case 'seeding':
        return 'SEEDING';
      case 'completed':
        return 'COMPLETED';
      default:
        return 'ALL TRANSFERS';
    }
  };

  return (
    <div className="relative">
      {/* Section title - overlapping style */}
      <div className="relative mb-4 mt-2">
        <h2 className="font-display text-[36px] text-brutal-black leading-none relative z-10">
          {getTabTitle()}
        </h2>
        <div className="absolute -bottom-1 left-[3px] w-[200px] h-[14px] bg-acid-green -z-0 opacity-60" />
        <div className="flex items-center gap-3 mt-2">
          <span className="font-body text-[13px] text-brutal-dark-gray font-semibold">
            {filteredTorrents.length} TORRENT{filteredTorrents.length !== 1 ? 'S' : ''}
          </span>
          <div className="h-[3px] flex-1 bg-brutal-black opacity-10" />
        </div>
      </div>

      {/* Torrent cards - stacked with overlap */}
      <div className="space-y-1">
        {filteredTorrents.length > 0 ? (
          filteredTorrents.map((torrent, index) => (
            <TorrentCard key={torrent.id} torrent={torrent} index={index} />
          ))
        ) : (
          <div className="bg-brutal-white border-[5px] border-brutal-black brutal-shadow p-12 text-center">
            <span className="font-display text-[24px] text-brutal-dark-gray">NO TORRENTS HERE</span>
            <p className="font-body text-[14px] text-brutal-dark-gray mt-2">
              Add some torrents to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
