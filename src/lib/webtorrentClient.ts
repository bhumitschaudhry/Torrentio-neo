import type { Torrent as WebTorrentInstance, TorrentFile } from 'webtorrent';
import type { TorrentItem, GlobalStats } from '../types/torrent';

declare global {
  var WebTorrent: any;
}

function getClient(): any {
  if (typeof window === 'undefined') {
    throw new Error('WebTorrent only works in the browser');
  }

  if (typeof window.WebTorrent === 'undefined') {
    throw new Error('WebTorrent is not loaded. Please ensure the WebTorrent CDN script is loaded.');
  }

  return new window.WebTorrent();
}

let clientInstance: any | null = null;

function getClientInstance(): any {
  if (!clientInstance) {
    clientInstance = getClient();
  }
  return clientInstance;
}

export interface BrowserTorrentClient {
  client: WebTorrentInstance;
  addTorrent: (source: string) => Promise<WebTorrentInstance>;
  uploadTorrent: (file: File) => Promise<WebTorrentInstance>;
  pauseTorrent: (infoHash: string) => void;
  resumeTorrent: (infoHash: string) => void;
  removeTorrent: (infoHash: string) => void;
  getTorrents: () => TorrentItem[];
  getStats: () => GlobalStats;
  getFileUrl: (torrentId: string, fileIndex: number) => string;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  destroy: () => void;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const decimals = value >= 100 || unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

function formatSpeed(bytesPerSecond: number): string {
  if (!Number.isFinite(bytesPerSecond) || bytesPerSecond <= 0) {
    return '0 KB/s';
  }

  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
  let value = bytesPerSecond;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const decimals = value >= 100 || unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '∞';
  }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }

  return `${secs}s`;
}

function formatRelativeTime(dateMs: number): string {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - dateMs) / 1000));
  if (elapsedSeconds < 60) {
    return `${elapsedSeconds} sec ago`;
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} min ago`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return `${elapsedHours} hour${elapsedHours === 1 ? '' : 's'} ago`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);
  return `${elapsedDays} day${elapsedDays === 1 ? '' : 's'} ago`;
}

function inferCategory(name: string): string {
  const normalized = name.toLowerCase();
  if (normalized.includes('ubuntu') || normalized.includes('debian') || normalized.includes('linux')) {
    return 'Linux ISOs';
  }
  if (normalized.includes('movie') || normalized.includes('1080p') || normalized.includes('2160p')) {
    return 'Video';
  }
  if (normalized.includes('game')) {
    return 'Games';
  }
  if (normalized.includes('book') || normalized.includes('ebook')) {
    return 'Books';
  }
  return 'General';
}

function getTorrentStatus(torrent: WebTorrentInstance): TorrentItem['status'] {
  if (torrent.paused) {
    return 'paused';
  }
  if (!torrent.ready) {
    return 'queued';
  }
  if (torrent.progress >= 1) {
    return torrent.uploadSpeed > 0 ? 'seeding' : 'completed';
  }
  if (torrent.downloadSpeed > 0 || torrent.progress > 0) {
    return 'downloading';
  }
  return 'queued';
}

function mapTorrent(torrent: WebTorrentInstance): TorrentItem {
  const status = getTorrentStatus(torrent);
  const downloaded = Number.isFinite(torrent.downloaded) ? torrent.downloaded : 0;
  const uploaded = Number.isFinite(torrent.uploaded) ? torrent.uploaded : 0;
  const length = Number.isFinite(torrent.length) ? torrent.length : 0;
  const downloadSpeed = Number.isFinite(torrent.downloadSpeed) ? torrent.downloadSpeed : 0;
  const uploadSpeed = Number.isFinite(torrent.uploadSpeed) ? torrent.uploadSpeed : 0;
  const progress = Math.max(0, Math.min(100, Math.round((torrent.progress ?? 0) * 100)));
  const peerCount = Number.isFinite(torrent.numPeers) ? torrent.numPeers : 0;
  const seedCount = Number.isFinite(torrent.numSeeds) ? torrent.numSeeds : peerCount;

  let eta = '∞';
  if (status === 'paused') {
    eta = 'Paused';
  } else if (status === 'queued') {
    eta = 'Queued';
  } else if (status === 'completed') {
    eta = '—';
  } else if (status === 'downloading') {
    const remaining = Math.max(length - downloaded, 0);
    eta = formatDuration(downloadSpeed > 0 ? remaining / downloadSpeed : Infinity);
  }

  return {
    id: torrent.infoHash,
    name: torrent.name,
    size: formatBytes(length),
    progress,
    downloadSpeed: formatSpeed(downloadSpeed),
    uploadSpeed: formatSpeed(uploadSpeed),
    seeds: seedCount,
    peers: peerCount,
    status,
    eta,
    ratio: downloaded > 0 ? uploaded / downloaded : 0,
    added: formatRelativeTime((torrent as unknown as { addedAt: number }).addedAt ?? Date.now()),
    category: inferCategory(torrent.name),
  };
}

function addMetadata(torrent: WebTorrentInstance, source: string): void {
  (torrent as unknown as { addedAt: number }).addedAt = Date.now();
  (torrent as unknown as { source: string }).source = source;
}

export const browserTorrentClient: BrowserTorrentClient = {
  get client() {
    return getClientInstance();
  },

  addTorrent(source: string): Promise<WebTorrentInstance> {
    return new Promise((resolve, reject) => {
      const client = getClientInstance();
      const existing = client.get(source);
      if (existing) {
        resolve(existing);
        return;
      }

      client.add(source, { path: '' }, (torrent, err) => {
        if (err) {
          reject(err);
          return;
        }
        addMetadata(torrent, source);
        resolve(torrent);
      });
    });
  },

  uploadTorrent(file: File): Promise<WebTorrentInstance> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const client = getClientInstance();
        client.add(buffer, { path: '' }, (torrent, err) => {
          if (err) {
            reject(err);
            return;
          }
          addMetadata(torrent, file.name);
          resolve(torrent);
        });
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  },

  pauseTorrent(infoHash: string): void {
    const client = getClientInstance();
    const torrent = client.get(infoHash);
    if (torrent) {
      torrent.pause();
    }
  },

  resumeTorrent(infoHash: string): void {
    const client = getClientInstance();
    const torrent = client.get(infoHash);
    if (torrent) {
      torrent.resume();
    }
  },

  removeTorrent(infoHash: string): void {
    const client = getClientInstance();
    const torrent = client.get(infoHash);
    if (torrent) {
      client.remove(torrent);
    }
  },

  getTorrents(): TorrentItem[] {
    const client = getClientInstance();
    return client.torrents.map(mapTorrent);
  },

  getStats(): GlobalStats {
    const client = getClientInstance();
    const torrents = client.torrents;
    const totalDownloadedBytes = torrents.reduce(
      (sum, torrent) => sum + (Number.isFinite(torrent.downloaded) ? torrent.downloaded : 0),
      0,
    );
    const totalUploadedBytes = torrents.reduce(
      (sum, torrent) => sum + (Number.isFinite(torrent.uploaded) ? torrent.uploaded : 0),
      0,
    );

    return {
      totalDownloadSpeed: formatSpeed(client.downloadSpeed ?? 0),
      totalUploadSpeed: formatSpeed(client.uploadSpeed ?? 0),
      activeTorrents: torrents.filter(
        (torrent) => getTorrentStatus(torrent) === 'downloading' || getTorrentStatus(torrent) === 'seeding'
      ).length,
      totalTorrents: torrents.length,
      totalDownloaded: formatBytes(totalDownloadedBytes),
      totalUploaded: formatBytes(totalUploadedBytes),
      dhtNodes: 0,
    };
  },

  getFileUrl(torrentId: string, fileIndex: number): string {
    const client = getClientInstance();
    const torrent = client.get(torrentId);
    if (!torrent || !torrent.files[fileIndex]) {
      return '';
    }
    const file = torrent.files[fileIndex];
    return streamFile(file);
  },

  on(event: string, callback: (...args: unknown[]) => void): void {
    const client = getClientInstance();
    client.on(event as never, callback);
  },

  destroy(): void {
    const client = getClientInstance();
    client.destroy();
  },
};

function streamFile(file: TorrentFile): string {
  return file.createReadStream().toURL();
}
