export type TorrentStatus = 'downloading' | 'seeding' | 'paused' | 'queued' | 'completed';

export interface TorrentItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  downloadSpeed: string;
  uploadSpeed: string;
  seeds: number;
  peers: number;
  status: TorrentStatus;
  eta: string;
  ratio: number;
  added: string;
  category: string;
}

export interface GlobalStats {
  totalDownloadSpeed: string;
  totalUploadSpeed: string;
  activeTorrents: number;
  totalTorrents: number;
  totalDownloaded: string;
  totalUploaded: string;
  dhtNodes: number;
}

export interface BackendSnapshot {
  torrents: TorrentItem[];
  stats: GlobalStats;
}

export interface TorrentFileInfo {
  index: number;
  name: string;
  size: string;
  path: string;
  streamable: boolean;
}

export interface TorrentFilesResponse {
  files: TorrentFileInfo[];
}
